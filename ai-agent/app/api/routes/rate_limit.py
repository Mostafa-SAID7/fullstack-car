"""
Rate Limit Management API
Endpoints for viewing and managing rate limiting
"""
from fastapi import APIRouter, HTTPException, status
from typing import Dict, Any
import logging

logger = logging.getLogger(__name__)

router = APIRouter()


@router.get(
    "/analytics",
    summary="Get Rate Limit Analytics",
    description="Get analytics about rate limiting (total requests, blocked requests, top users/IPs)",
    response_description="Rate limit analytics data"
)
async def get_rate_limit_analytics() -> Dict[str, Any]:
    """
    Get rate limiting analytics
    
    Returns analytics including:
    - Total requests processed
    - Blocked requests count
    - Block rate percentage
    - Active users and IPs
    - Top users/IPs by limit hits
    """
    try:
        from app.middleware.rate_limiter import get_rate_limiter
        rate_limiter = get_rate_limiter()
        analytics = rate_limiter.get_analytics()
        
        return {
            "success": True,
            "analytics": analytics
        }
    except Exception as e:
        logger.error(f"Failed to get rate limit analytics: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get analytics: {str(e)}"
        )


@router.post(
    "/analytics/reset",
    summary="Reset Rate Limit Analytics",
    description="Reset rate limiting analytics counters",
    response_description="Success confirmation"
)
async def reset_rate_limit_analytics() -> Dict[str, Any]:
    """
    Reset rate limiting analytics
    
    Resets all analytics counters including:
    - Total requests
    - Blocked requests
    - Limit hits by user/IP
    """
    try:
        from app.middleware.rate_limiter import get_rate_limiter
        rate_limiter = get_rate_limiter()
        rate_limiter.reset_analytics()
        
        return {
            "success": True,
            "message": "Rate limit analytics reset successfully"
        }
    except Exception as e:
        logger.error(f"Failed to reset rate limit analytics: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to reset analytics: {str(e)}"
        )


@router.get(
    "/config",
    summary="Get Rate Limit Configuration",
    description="Get current rate limiting configuration",
    response_description="Rate limit configuration"
)
async def get_rate_limit_config() -> Dict[str, Any]:
    """
    Get rate limiting configuration
    
    Returns current configuration including:
    - User request limit
    - IP request limit
    - Time window
    - Admin bypass setting
    """
    try:
        from app.middleware.rate_limiter import get_rate_limiter
        rate_limiter = get_rate_limiter()
        
        return {
            "success": True,
            "config": {
                "user_limit": rate_limiter.user_limit,
                "ip_limit": rate_limiter.ip_limit,
                "window_seconds": rate_limiter.window_seconds,
                "window_hours": rate_limiter.window_seconds / 3600,
                "admin_bypass": rate_limiter.admin_bypass
            }
        }
    except Exception as e:
        logger.error(f"Failed to get rate limit config: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get config: {str(e)}"
        )
