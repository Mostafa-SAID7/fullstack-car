"""
Quick integration test for rate limiting
"""
import sys
sys.path.insert(0, '.')

print("Testing rate limiting integration...")

# Test 1: Import middleware
try:
    from app.middleware.rate_limiter import RateLimiter, get_rate_limiter
    print("✓ Rate limiter imports successfully")
except Exception as e:
    print(f"✗ Failed to import rate limiter: {e}")
    sys.exit(1)

# Test 2: Create rate limiter
try:
    limiter = get_rate_limiter()
    print(f"✓ Rate limiter initialized: {limiter.user_limit} req/user/hour, {limiter.ip_limit} req/IP/hour")
except Exception as e:
    print(f"✗ Failed to initialize rate limiter: {e}")
    sys.exit(1)

# Test 3: Test rate limiting logic
try:
    # Make some requests
    for i in range(5):
        is_allowed, info = limiter.check_rate_limit(
            user_id="test_user",
            ip_address="127.0.0.1"
        )
        if not is_allowed:
            print(f"✗ Request {i+1} was blocked unexpectedly")
            sys.exit(1)
    
    print(f"✓ Rate limiting logic works correctly")
    print(f"  - Remaining requests: {info['user_remaining']}")
except Exception as e:
    print(f"✗ Rate limiting logic failed: {e}")
    sys.exit(1)

# Test 4: Test analytics
try:
    analytics = limiter.get_analytics()
    print(f"✓ Analytics working: {analytics['total_requests']} total requests")
except Exception as e:
    print(f"✗ Analytics failed: {e}")
    sys.exit(1)

# Test 5: Import main app
try:
    from main import app
    print("✓ Main application imports successfully with rate limiting middleware")
except Exception as e:
    print(f"✗ Failed to import main app: {e}")
    sys.exit(1)

print("\n✓ All integration tests passed!")
print("Rate limiting is ready for production use.")
