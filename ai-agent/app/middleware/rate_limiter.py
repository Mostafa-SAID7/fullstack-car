"""
Rate Limiting Middleware for AI Agent API
Implements per-user and per-IP rate limiting to prevent abuse and control costs
"""
import time
import logging
from typing import Dict, Optional, Tuple
from collections import defaultdict
from datetime import datetime, timedelta
from fastapi import Request, HTTPException, status
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.types import ASGIApp

logger = logging.getLogger(__name__)


class RateLimiter:
    """
    Rate limiter using sliding window algorithm
    Tracks requests per user and per IP address
    """
    
    def __init__(
        self,
        user_limit: int = 100,
        ip_limit: int = 200,
        window_seconds: int = 3600,  # 1 hour
        admin_bypass: bool = True
    ):
        """
        Initialize rate limiter
        
        Args:
            user_limit: Maximum requests per user per window
            ip_limit: Maximum requests per IP per window
            window_seconds: Time window in seconds (default: 1 hour)
            admin_bypass: Whether admins bypass rate limits
        """
        self.user_limit = user_limit
        self.ip_limit = ip_limit
        self.window_seconds = window_seconds
        self.admin_bypass = admin_bypass
        
        # Storage for request timestamps
        # Format: {identifier: [timestamp1, timestamp2, ...]}
        self.user_requests: Dict[str, list] = defaultdict(list)
        self.ip_requests: Dict[str, list] = defaultdict(list)
        
        # Analytics
        self.total_requests = 0
        self.blocked_requests = 0
        self.limit_hits_by_user: Dict[str, int] = defaultdict(int)
        self.limit_hits_by_ip: Dict[str, int] = defaultdict(int)
        
        logger.info(
            f"Rate limiter initialized: {user_limit} req/user/hour, "
            f"{ip_limit} req/IP/hour"
        )
    
    def _clean_old_requests(self, requests: list, current_time: float) -> list:
        """Remove requests outside the time window"""
        cutoff_time = current_time - self.window_seconds
        return [ts for ts in requests if ts > cutoff_time]
    
    def _check_limit(
        self,
        identifier: str,
        requests: Dict[str, list],
        limit: int,
        current_time: float
    ) -> Tuple[bool, int, int]:
        """
        Check if identifier has exceeded rate limit
        
        Returns:
            Tuple of (is_allowed, remaining_requests, reset_time_seconds)
        """
        # Clean old requests
        requests[identifier] = self._clean_old_requests(
            requests[identifier],
            current_time
        )
        
        # Count requests in current window
        request_count = len(requests[identifier])
        
        # Check if limit exceeded
        is_allowed = request_count < limit
        remaining = max(0, limit - request_count)
        
        # Calculate reset time (oldest request + window)
        if requests[identifier]:
            oldest_request = min(requests[identifier])
            reset_time = int(oldest_request + self.window_seconds - current_time)
        else:
            reset_time = self.window_seconds
        
        return is_allowed, remaining, reset_time
    
    def check_rate_limit(
        self,
        user_id: Optional[str],
        ip_address: str,
        is_admin: bool = False
    ) -> Tuple[bool, Dict[str, any]]:
        """
        Check if request should be allowed
        
        Args:
            user_id: User identifier (if authenticated)
            ip_address: Client IP address
            is_admin: Whether user is admin
            
        Returns:
            Tuple of (is_allowed, rate_limit_info)
        """
        self.total_requests += 1
        current_time = time.time()
        
        # Admin bypass
        if is_admin and self.admin_bypass:
            return True, {
                'limit': 'unlimited',
                'remaining': 'unlimited',
                'reset': 0,
                'admin_bypass': True
            }
        
        # Check user limit (if authenticated)
        if user_id:
            user_allowed, user_remaining, user_reset = self._check_limit(
                user_id,
                self.user_requests,
                self.user_limit,
                current_time
            )
            
            if not user_allowed:
                self.blocked_requests += 1
                self.limit_hits_by_user[user_id] += 1
                logger.warning(
                    f"Rate limit exceeded for user {user_id}: "
                    f"{len(self.user_requests[user_id])} requests in window"
                )
                return False, {
                    'limit': self.user_limit,
                    'remaining': 0,
                    'reset': user_reset,
                    'limit_type': 'user'
                }
        
        # Check IP limit
        ip_allowed, ip_remaining, ip_reset = self._check_limit(
            ip_address,
            self.ip_requests,
            self.ip_limit,
            current_time
        )
        
        if not ip_allowed:
            self.blocked_requests += 1
            self.limit_hits_by_ip[ip_address] += 1
            logger.warning(
                f"Rate limit exceeded for IP {ip_address}: "
                f"{len(self.ip_requests[ip_address])} requests in window"
            )
            return False, {
                'limit': self.ip_limit,
                'remaining': 0,
                'reset': ip_reset,
                'limit_type': 'ip'
            }
        
        # Record request BEFORE returning (so remaining count is after recording)
        if user_id:
            self.user_requests[user_id].append(current_time)
        self.ip_requests[ip_address].append(current_time)
        
        # Recalculate remaining after recording
        if user_id:
            user_remaining = self.user_limit - len(self.user_requests[user_id])
        ip_remaining = self.ip_limit - len(self.ip_requests[ip_address])
        
        # Return most restrictive limit info
        if user_id:
            return True, {
                'user_limit': self.user_limit,
                'user_remaining': user_remaining,
                'user_reset': user_reset,
                'ip_limit': self.ip_limit,
                'ip_remaining': ip_remaining,
                'ip_reset': ip_reset
            }
        else:
            return True, {
                'limit': self.ip_limit,
                'remaining': ip_remaining,
                'reset': ip_reset,
                'limit_type': 'ip'
            }
    
    def get_analytics(self) -> Dict[str, any]:
        """Get rate limiting analytics"""
        return {
            'total_requests': self.total_requests,
            'blocked_requests': self.blocked_requests,
            'block_rate': (
                self.blocked_requests / self.total_requests * 100
                if self.total_requests > 0 else 0
            ),
            'active_users': len(self.user_requests),
            'active_ips': len(self.ip_requests),
            'top_users_by_limit_hits': dict(
                sorted(
                    self.limit_hits_by_user.items(),
                    key=lambda x: x[1],
                    reverse=True
                )[:10]
            ),
            'top_ips_by_limit_hits': dict(
                sorted(
                    self.limit_hits_by_ip.items(),
                    key=lambda x: x[1],
                    reverse=True
                )[:10]
            )
        }
    
    def reset_analytics(self):
        """Reset analytics counters"""
        self.total_requests = 0
        self.blocked_requests = 0
        self.limit_hits_by_user.clear()
        self.limit_hits_by_ip.clear()
        logger.info("Rate limiter analytics reset")


class RateLimiterMiddleware(BaseHTTPMiddleware):
    """
    FastAPI middleware for rate limiting
    """
    
    def __init__(
        self,
        app: ASGIApp,
        rate_limiter: RateLimiter,
        excluded_paths: Optional[list] = None
    ):
        """
        Initialize middleware
        
        Args:
            app: ASGI application
            rate_limiter: RateLimiter instance
            excluded_paths: Paths to exclude from rate limiting
        """
        super().__init__(app)
        self.rate_limiter = rate_limiter
        self.excluded_paths = excluded_paths or [
            "/",
            "/health",
            "/docs",
            "/redoc",
            "/openapi.json"
        ]
        logger.info(f"Rate limiter middleware initialized with excluded paths: {self.excluded_paths}")
    
    def _get_client_ip(self, request: Request) -> str:
        """Extract client IP address from request"""
        # Check X-Forwarded-For header (for proxies)
        forwarded = request.headers.get("X-Forwarded-For")
        if forwarded:
            return forwarded.split(",")[0].strip()
        
        # Check X-Real-IP header
        real_ip = request.headers.get("X-Real-IP")
        if real_ip:
            return real_ip
        
        # Fall back to direct client
        if request.client:
            return request.client.host
        
        return "unknown"
    
    def _get_user_id(self, request: Request) -> Optional[str]:
        """Extract user ID from request (if authenticated)"""
        # Check for user ID in headers (set by auth middleware)
        user_id = request.headers.get("X-User-ID")
        if user_id:
            return user_id
        
        # Check for user ID in state (set by auth dependency)
        if hasattr(request.state, "user_id"):
            return request.state.user_id
        
        return None
    
    def _is_admin(self, request: Request) -> bool:
        """Check if user is admin"""
        # Check for admin flag in headers
        is_admin = request.headers.get("X-User-Admin", "false").lower() == "true"
        if is_admin:
            return True
        
        # Check for admin flag in state
        if hasattr(request.state, "is_admin"):
            return request.state.is_admin
        
        return False
    
    async def dispatch(self, request: Request, call_next):
        """Process request through rate limiter"""
        # Skip rate limiting for excluded paths
        if request.url.path in self.excluded_paths:
            return await call_next(request)
        
        # Extract request info
        ip_address = self._get_client_ip(request)
        user_id = self._get_user_id(request)
        is_admin = self._is_admin(request)
        
        # Check rate limit
        is_allowed, rate_info = self.rate_limiter.check_rate_limit(
            user_id=user_id,
            ip_address=ip_address,
            is_admin=is_admin
        )
        
        # Block if limit exceeded
        if not is_allowed:
            logger.warning(
                f"Rate limit exceeded - IP: {ip_address}, User: {user_id}, "
                f"Limit: {rate_info.get('limit')}, Reset: {rate_info.get('reset')}s"
            )
            
            return JSONResponse(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                content={
                    "error": "Rate limit exceeded",
                    "message": f"Too many requests. Please try again in {rate_info.get('reset')} seconds.",
                    "limit": rate_info.get('limit'),
                    "remaining": 0,
                    "reset": rate_info.get('reset'),
                    "limit_type": rate_info.get('limit_type', 'unknown')
                },
                headers={
                    "X-RateLimit-Limit": str(rate_info.get('limit', 0)),
                    "X-RateLimit-Remaining": "0",
                    "X-RateLimit-Reset": str(rate_info.get('reset', 0)),
                    "Retry-After": str(rate_info.get('reset', 0))
                }
            )
        
        # Process request
        response = await call_next(request)
        
        # Add rate limit headers to response
        if rate_info.get('admin_bypass'):
            response.headers["X-RateLimit-Limit"] = "unlimited"
            response.headers["X-RateLimit-Remaining"] = "unlimited"
        elif 'user_limit' in rate_info:
            # User-based limits
            response.headers["X-RateLimit-User-Limit"] = str(rate_info['user_limit'])
            response.headers["X-RateLimit-User-Remaining"] = str(rate_info['user_remaining'])
            response.headers["X-RateLimit-User-Reset"] = str(rate_info['user_reset'])
            response.headers["X-RateLimit-IP-Limit"] = str(rate_info['ip_limit'])
            response.headers["X-RateLimit-IP-Remaining"] = str(rate_info['ip_remaining'])
            response.headers["X-RateLimit-IP-Reset"] = str(rate_info['ip_reset'])
        else:
            # IP-based limits only
            response.headers["X-RateLimit-Limit"] = str(rate_info['limit'])
            response.headers["X-RateLimit-Remaining"] = str(rate_info['remaining'])
            response.headers["X-RateLimit-Reset"] = str(rate_info['reset'])
        
        return response


# Global rate limiter instance
_rate_limiter: Optional[RateLimiter] = None


def get_rate_limiter() -> RateLimiter:
    """Get or create global rate limiter instance"""
    global _rate_limiter
    if _rate_limiter is None:
        from app.core.config import settings
        _rate_limiter = RateLimiter(
            user_limit=settings.RATE_LIMIT_USER,
            ip_limit=settings.RATE_LIMIT_IP,
            window_seconds=settings.RATE_LIMIT_WINDOW,
            admin_bypass=settings.RATE_LIMIT_ADMIN_BYPASS
        )
    return _rate_limiter
