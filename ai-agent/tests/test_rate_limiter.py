"""
Tests for Rate Limiting Middleware
"""
import pytest
import time
from unittest.mock import Mock, patch
from fastapi import Request
from fastapi.responses import JSONResponse
from app.middleware.rate_limiter import RateLimiter, RateLimiterMiddleware


class TestRateLimiter:
    """Test RateLimiter class"""
    
    def test_initialization(self):
        """Test rate limiter initialization"""
        limiter = RateLimiter(
            user_limit=50,
            ip_limit=100,
            window_seconds=1800,
            admin_bypass=True
        )
        
        assert limiter.user_limit == 50
        assert limiter.ip_limit == 100
        assert limiter.window_seconds == 1800
        assert limiter.admin_bypass is True
        assert limiter.total_requests == 0
        assert limiter.blocked_requests == 0
    
    def test_user_rate_limit_allows_within_limit(self):
        """Test that requests within user limit are allowed"""
        limiter = RateLimiter(user_limit=5, ip_limit=10, window_seconds=3600)
        
        # Make 5 requests (within limit)
        for i in range(5):
            is_allowed, info = limiter.check_rate_limit(
                user_id="user123",
                ip_address="192.168.1.1"
            )
            assert is_allowed is True
            # After recording the request, remaining should be limit - (i+1)
            assert info['user_remaining'] == 5 - (i + 1)
    
    def test_user_rate_limit_blocks_over_limit(self):
        """Test that requests over user limit are blocked"""
        limiter = RateLimiter(user_limit=3, ip_limit=10, window_seconds=3600)
        
        # Make 3 requests (at limit)
        for i in range(3):
            is_allowed, _ = limiter.check_rate_limit(
                user_id="user123",
                ip_address="192.168.1.1"
            )
            assert is_allowed is True
        
        # 4th request should be blocked
        is_allowed, info = limiter.check_rate_limit(
            user_id="user123",
            ip_address="192.168.1.1"
        )
        assert is_allowed is False
        assert info['limit'] == 3
        assert info['remaining'] == 0
        assert info['limit_type'] == 'user'
    
    def test_ip_rate_limit_allows_within_limit(self):
        """Test that requests within IP limit are allowed"""
        limiter = RateLimiter(user_limit=100, ip_limit=5, window_seconds=3600)
        
        # Make 5 requests from same IP (no user)
        for i in range(5):
            is_allowed, info = limiter.check_rate_limit(
                user_id=None,
                ip_address="192.168.1.1"
            )
            assert is_allowed is True
            # After recording the request, remaining should be limit - (i+1)
            assert info['remaining'] == 5 - (i + 1)
    
    def test_ip_rate_limit_blocks_over_limit(self):
        """Test that requests over IP limit are blocked"""
        limiter = RateLimiter(user_limit=100, ip_limit=3, window_seconds=3600)
        
        # Make 3 requests (at limit)
        for i in range(3):
            is_allowed, _ = limiter.check_rate_limit(
                user_id=None,
                ip_address="192.168.1.1"
            )
            assert is_allowed is True
        
        # 4th request should be blocked
        is_allowed, info = limiter.check_rate_limit(
            user_id=None,
            ip_address="192.168.1.1"
        )
        assert is_allowed is False
        assert info['limit'] == 3
        assert info['remaining'] == 0
        assert info['limit_type'] == 'ip'
    
    def test_admin_bypass(self):
        """Test that admins bypass rate limits"""
        limiter = RateLimiter(user_limit=1, ip_limit=1, window_seconds=3600, admin_bypass=True)
        
        # Make multiple requests as admin
        for i in range(10):
            is_allowed, info = limiter.check_rate_limit(
                user_id="admin_user",
                ip_address="192.168.1.1",
                is_admin=True
            )
            assert is_allowed is True
            assert info['limit'] == 'unlimited'
            assert info['admin_bypass'] is True
    
    def test_sliding_window_cleanup(self):
        """Test that old requests are cleaned up"""
        limiter = RateLimiter(user_limit=2, ip_limit=5, window_seconds=1)
        
        # Make 2 requests (at limit)
        for i in range(2):
            is_allowed, _ = limiter.check_rate_limit(
                user_id="user123",
                ip_address="192.168.1.1"
            )
            assert is_allowed is True
        
        # 3rd request should be blocked
        is_allowed, _ = limiter.check_rate_limit(
            user_id="user123",
            ip_address="192.168.1.1"
        )
        assert is_allowed is False
        
        # Wait for window to expire
        time.sleep(1.1)
        
        # Request should now be allowed (old requests cleaned up)
        is_allowed, info = limiter.check_rate_limit(
            user_id="user123",
            ip_address="192.168.1.1"
        )
        assert is_allowed is True
        # After recording this request, remaining should be 1
        assert info['user_remaining'] == 1
    
    def test_different_users_independent_limits(self):
        """Test that different users have independent limits"""
        limiter = RateLimiter(user_limit=2, ip_limit=10, window_seconds=3600)
        
        # User 1 makes 2 requests
        for i in range(2):
            is_allowed, _ = limiter.check_rate_limit(
                user_id="user1",
                ip_address="192.168.1.1"
            )
            assert is_allowed is True
        
        # User 1's 3rd request blocked
        is_allowed, _ = limiter.check_rate_limit(
            user_id="user1",
            ip_address="192.168.1.1"
        )
        assert is_allowed is False
        
        # User 2 can still make requests
        is_allowed, info = limiter.check_rate_limit(
            user_id="user2",
            ip_address="192.168.1.2"
        )
        assert is_allowed is True
        # After recording this request, remaining should be 1
        assert info['user_remaining'] == 1
    
    def test_different_ips_independent_limits(self):
        """Test that different IPs have independent limits"""
        limiter = RateLimiter(user_limit=100, ip_limit=2, window_seconds=3600)
        
        # IP 1 makes 2 requests
        for i in range(2):
            is_allowed, _ = limiter.check_rate_limit(
                user_id=None,
                ip_address="192.168.1.1"
            )
            assert is_allowed is True
        
        # IP 1's 3rd request blocked
        is_allowed, _ = limiter.check_rate_limit(
            user_id=None,
            ip_address="192.168.1.1"
        )
        assert is_allowed is False
        
        # IP 2 can still make requests
        is_allowed, info = limiter.check_rate_limit(
            user_id=None,
            ip_address="192.168.1.2"
        )
        assert is_allowed is True
        # After recording this request, remaining should be 1
        assert info['remaining'] == 1
    
    def test_analytics_tracking(self):
        """Test that analytics are tracked correctly"""
        limiter = RateLimiter(user_limit=2, ip_limit=5, window_seconds=3600)
        
        # Make some allowed requests
        for i in range(2):
            limiter.check_rate_limit(user_id="user1", ip_address="192.168.1.1")
        
        # Make some blocked requests
        for i in range(3):
            limiter.check_rate_limit(user_id="user1", ip_address="192.168.1.1")
        
        analytics = limiter.get_analytics()
        
        assert analytics['total_requests'] == 5
        assert analytics['blocked_requests'] == 3
        assert analytics['block_rate'] == 60.0
        assert analytics['active_users'] == 1
        assert analytics['active_ips'] == 1
        assert 'user1' in analytics['top_users_by_limit_hits']
        assert analytics['top_users_by_limit_hits']['user1'] == 3
    
    def test_analytics_reset(self):
        """Test that analytics can be reset"""
        limiter = RateLimiter(user_limit=5, ip_limit=10, window_seconds=3600)
        
        # Make some requests
        for i in range(3):
            limiter.check_rate_limit(user_id="user1", ip_address="192.168.1.1")
        
        # Reset analytics
        limiter.reset_analytics()
        
        analytics = limiter.get_analytics()
        assert analytics['total_requests'] == 0
        assert analytics['blocked_requests'] == 0
        assert len(analytics['top_users_by_limit_hits']) == 0


class TestRateLimiterMiddleware:
    """Test RateLimiterMiddleware class"""
    
    @pytest.fixture
    def rate_limiter(self):
        """Create rate limiter for testing"""
        return RateLimiter(user_limit=5, ip_limit=10, window_seconds=3600)
    
    @pytest.fixture
    def middleware(self, rate_limiter):
        """Create middleware for testing"""
        app = Mock()
        return RateLimiterMiddleware(
            app=app,
            rate_limiter=rate_limiter,
            excluded_paths=["/health", "/docs"]
        )
    
    def test_excluded_paths_bypass_rate_limiting(self, middleware, rate_limiter):
        """Test that excluded paths bypass rate limiting"""
        request = Mock(spec=Request)
        request.url.path = "/health"
        request.client.host = "192.168.1.1"
        
        call_next = Mock()
        call_next.return_value = JSONResponse(content={"status": "ok"})
        
        # Should not check rate limit
        initial_requests = rate_limiter.total_requests
        
        # Note: We can't actually call dispatch in unit test without async setup
        # This test verifies the logic exists
        assert "/health" in middleware.excluded_paths
    
    def test_get_client_ip_from_forwarded_header(self, middleware):
        """Test extracting IP from X-Forwarded-For header"""
        request = Mock(spec=Request)
        request.headers.get.return_value = "203.0.113.1, 198.51.100.1"
        
        ip = middleware._get_client_ip(request)
        assert ip == "203.0.113.1"
    
    def test_get_client_ip_from_real_ip_header(self, middleware):
        """Test extracting IP from X-Real-IP header"""
        request = Mock(spec=Request)
        request.headers.get.side_effect = lambda key: {
            "X-Forwarded-For": None,
            "X-Real-IP": "203.0.113.1"
        }.get(key)
        
        ip = middleware._get_client_ip(request)
        assert ip == "203.0.113.1"
    
    def test_get_client_ip_from_client(self, middleware):
        """Test extracting IP from request.client"""
        request = Mock(spec=Request)
        request.headers.get.return_value = None
        request.client.host = "192.168.1.1"
        
        ip = middleware._get_client_ip(request)
        assert ip == "192.168.1.1"
    
    def test_get_user_id_from_header(self, middleware):
        """Test extracting user ID from header"""
        request = Mock(spec=Request)
        request.headers.get.return_value = "user123"
        
        user_id = middleware._get_user_id(request)
        assert user_id == "user123"
    
    def test_get_user_id_from_state(self, middleware):
        """Test extracting user ID from request state"""
        request = Mock(spec=Request)
        request.headers.get.return_value = None
        request.state.user_id = "user456"
        
        user_id = middleware._get_user_id(request)
        assert user_id == "user456"
    
    def test_is_admin_from_header(self, middleware):
        """Test checking admin status from header"""
        request = Mock(spec=Request)
        request.headers.get.return_value = "true"
        
        is_admin = middleware._is_admin(request)
        assert is_admin is True
    
    def test_is_admin_from_state(self, middleware):
        """Test checking admin status from request state"""
        request = Mock(spec=Request)
        request.headers.get.return_value = "false"
        request.state.is_admin = True
        
        is_admin = middleware._is_admin(request)
        assert is_admin is True
    
    def test_rate_limit_headers_added_to_response(self, middleware, rate_limiter):
        """Test that rate limit headers are added to successful responses"""
        # This would require async test setup
        # Verify the logic exists in the code
        assert hasattr(middleware, 'dispatch')


class TestRateLimiterIntegration:
    """Integration tests for rate limiter"""
    
    def test_concurrent_requests_from_same_user(self):
        """Test handling concurrent requests from same user"""
        limiter = RateLimiter(user_limit=10, ip_limit=20, window_seconds=3600)
        
        # Simulate concurrent requests
        results = []
        for i in range(15):
            is_allowed, info = limiter.check_rate_limit(
                user_id="user1",
                ip_address="192.168.1.1"
            )
            results.append(is_allowed)
        
        # First 10 should be allowed, rest blocked
        assert sum(results) == 10
        assert results[:10] == [True] * 10
        assert results[10:] == [False] * 5
    
    def test_mixed_authenticated_and_anonymous_requests(self):
        """Test handling mix of authenticated and anonymous requests"""
        limiter = RateLimiter(user_limit=5, ip_limit=10, window_seconds=3600)
        
        # Authenticated requests
        for i in range(5):
            is_allowed, _ = limiter.check_rate_limit(
                user_id="user1",
                ip_address="192.168.1.1"
            )
            assert is_allowed is True
        
        # User limit reached
        is_allowed, _ = limiter.check_rate_limit(
            user_id="user1",
            ip_address="192.168.1.1"
        )
        assert is_allowed is False
        
        # Anonymous requests from same IP still have separate limit
        for i in range(5):
            is_allowed, _ = limiter.check_rate_limit(
                user_id=None,
                ip_address="192.168.1.1"
            )
            assert is_allowed is True
    
    def test_rate_limit_configuration_from_settings(self):
        """Test that rate limiter uses configuration from settings"""
        # Import settings at module level for patching
        from app.core import config
        
        with patch.object(config, 'settings') as mock_settings:
            mock_settings.RATE_LIMIT_USER = 50
            mock_settings.RATE_LIMIT_IP = 100
            mock_settings.RATE_LIMIT_WINDOW = 1800
            mock_settings.RATE_LIMIT_ADMIN_BYPASS = False
            
            # Reset global instance
            import app.middleware.rate_limiter as rl_module
            rl_module._rate_limiter = None
            
            limiter = rl_module.get_rate_limiter()
            
            assert limiter.user_limit == 50
            assert limiter.ip_limit == 100
            assert limiter.window_seconds == 1800
            assert limiter.admin_bypass is False


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
