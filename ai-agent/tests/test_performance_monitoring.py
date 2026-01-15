"""
Tests for Performance Monitoring
"""
import pytest
import time
from unittest.mock import Mock, patch
from datetime import datetime, timedelta
from app.middleware.metrics import PerformanceMetrics, PerformanceMonitoringMiddleware


class TestPerformanceMetrics:
    """Test PerformanceMetrics class"""
    
    def test_initialization(self):
        """Test metrics initialization"""
        metrics = PerformanceMetrics(max_history=500)
        
        assert metrics.max_history == 500
        assert len(metrics.request_times) == 0
        assert len(metrics.slow_queries) == 0
        assert metrics.slow_query_threshold == 2.0
        assert isinstance(metrics.start_time, datetime)
    
    def test_record_request_success(self):
        """Test recording successful request"""
        metrics = PerformanceMetrics()
        
        metrics.record_request(
            method="GET",
            path="/api/test",
            status_code=200,
            duration=0.5
        )
        
        assert len(metrics.request_times) == 1
        assert metrics.request_counts["GET /api/test"] == 1
        assert metrics.endpoint_counts["GET /api/test"] == 1
        assert len(metrics.endpoint_times["GET /api/test"]) == 1
    
    def test_record_request_error(self):
        """Test recording failed request"""
        metrics = PerformanceMetrics()
        error = Exception("Test error")
        
        metrics.record_request(
            method="POST",
            path="/api/test",
            status_code=500,
            duration=0.3,
            error=error
        )
        
        assert len(metrics.request_times) == 1
        assert metrics.error_counts["POST /api/test"] == 1
        assert metrics.endpoint_errors["POST /api/test"] == 1
        assert len(metrics.recent_errors) == 1
        assert "Test error" in metrics.recent_errors[0]['error']
    
    def test_record_slow_query(self):
        """Test detecting slow queries"""
        metrics = PerformanceMetrics()
        metrics.slow_query_threshold = 1.0
        
        # Fast query - should not be recorded as slow
        metrics.record_request(
            method="GET",
            path="/api/fast",
            status_code=200,
            duration=0.5
        )
        
        assert len(metrics.slow_queries) == 0
        
        # Slow query - should be recorded
        metrics.record_request(
            method="GET",
            path="/api/slow",
            status_code=200,
            duration=2.5
        )
        
        assert len(metrics.slow_queries) == 1
        assert metrics.slow_queries[0]['path'] == "/api/slow"
        assert metrics.slow_queries[0]['duration'] == 2.5
    
    def test_multiple_requests_same_endpoint(self):
        """Test recording multiple requests to same endpoint"""
        metrics = PerformanceMetrics()
        
        for i in range(5):
            metrics.record_request(
                method="GET",
                path="/api/test",
                status_code=200,
                duration=0.1 * (i + 1)
            )
        
        assert metrics.request_counts["GET /api/test"] == 5
        assert len(metrics.endpoint_times["GET /api/test"]) == 5
    
    def test_metrics_summary(self):
        """Test getting metrics summary"""
        metrics = PerformanceMetrics()
        
        # Record some requests
        for i in range(10):
            metrics.record_request(
                method="GET",
                path="/api/test",
                status_code=200 if i < 8 else 500,
                duration=0.1
            )
        
        summary = metrics.get_metrics_summary()
        
        assert summary['total_requests'] == 10
        assert summary['total_errors'] == 2
        assert summary['error_rate'] == 20.0
        assert summary['avg_response_time_ms'] > 0
        assert 'uptime_seconds' in summary
        assert 'throughput_rps' in summary
    
    def test_endpoint_metrics(self):
        """Test getting per-endpoint metrics"""
        metrics = PerformanceMetrics()
        
        # Record requests to different endpoints
        metrics.record_request("GET", "/api/endpoint1", 200, 0.1)
        metrics.record_request("GET", "/api/endpoint1", 200, 0.2)
        metrics.record_request("POST", "/api/endpoint2", 200, 0.3)
        
        endpoint_metrics = metrics.get_endpoint_metrics()
        
        assert len(endpoint_metrics) == 2
        assert endpoint_metrics[0]['endpoint'] == "GET /api/endpoint1"
        assert endpoint_metrics[0]['request_count'] == 2
        # Use approximate comparison for floating point
        assert abs(endpoint_metrics[0]['avg_response_time_ms'] - 150.0) < 0.01
    
    def test_slow_queries_retrieval(self):
        """Test retrieving slow queries"""
        metrics = PerformanceMetrics()
        metrics.slow_query_threshold = 1.0
        
        # Record some slow queries
        for i in range(5):
            metrics.record_request(
                method="GET",
                path=f"/api/slow{i}",
                status_code=200,
                duration=2.0 + i
            )
        
        slow_queries = metrics.get_slow_queries(limit=3)
        
        assert len(slow_queries) == 3
        # Should be sorted by duration (descending)
        assert slow_queries[0]['duration'] >= slow_queries[1]['duration']
    
    def test_recent_errors_retrieval(self):
        """Test retrieving recent errors"""
        metrics = PerformanceMetrics()
        
        # Record some errors
        for i in range(5):
            metrics.record_request(
                method="GET",
                path=f"/api/error{i}",
                status_code=500,
                duration=0.1,
                error=Exception(f"Error {i}")
            )
        
        errors = metrics.get_recent_errors(limit=3)
        
        assert len(errors) == 3
    
    def test_resource_usage_recording(self):
        """Test recording resource usage"""
        metrics = PerformanceMetrics()
        
        metrics.record_resource_usage()
        
        assert len(metrics.cpu_samples) == 1
        assert len(metrics.memory_samples) == 1
        assert 'cpu_percent' in metrics.cpu_samples[0]
        assert 'memory_percent' in metrics.memory_samples[0]
    
    def test_resource_usage_history(self):
        """Test getting resource usage history"""
        metrics = PerformanceMetrics()
        
        # Record multiple samples
        for i in range(3):
            metrics.record_resource_usage()
            time.sleep(0.1)
        
        history = metrics.get_resource_usage_history()
        
        assert 'cpu' in history
        assert 'memory' in history
        assert len(history['cpu']) == 3
        assert len(history['memory']) == 3
    
    def test_alerts_high_error_rate(self):
        """Test alert for high error rate"""
        metrics = PerformanceMetrics()
        metrics.error_alert_threshold = 5
        
        # Record many errors
        for i in range(10):
            metrics.record_request(
                method="GET",
                path="/api/test",
                status_code=500,
                duration=0.1,
                error=Exception("Test error")
            )
        
        alerts = metrics.check_alerts()
        
        # Should have high error rate alert
        assert any(a['type'] == 'high_error_rate' for a in alerts)
    
    def test_alerts_slow_queries(self):
        """Test alert for excessive slow queries"""
        metrics = PerformanceMetrics()
        metrics.slow_query_threshold = 1.0
        
        # Record many slow queries
        for i in range(10):
            metrics.record_request(
                method="GET",
                path=f"/api/slow{i}",
                status_code=200,
                duration=2.0
            )
        
        alerts = metrics.check_alerts()
        
        # Should have slow queries alert
        assert any(a['type'] == 'slow_queries' for a in alerts)
    
    def test_percentile_calculation(self):
        """Test percentile calculation"""
        metrics = PerformanceMetrics()
        
        values = [1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0, 9.0, 10.0]
        
        p50 = metrics._calculate_percentile(values, 50)
        p95 = metrics._calculate_percentile(values, 95)
        p99 = metrics._calculate_percentile(values, 99)
        
        # P50 should be around the middle (5 or 6)
        assert 5.0 <= p50 <= 6.0
        # P95 should be near the end (9 or 10)
        assert 9.0 <= p95 <= 10.0
        # P99 should be at the end
        assert p99 == 10.0
    
    def test_reset_metrics(self):
        """Test resetting all metrics"""
        metrics = PerformanceMetrics()
        
        # Record some data
        for i in range(5):
            metrics.record_request("GET", "/api/test", 200, 0.1)
        
        metrics.record_resource_usage()
        
        # Reset
        metrics.reset_metrics()
        
        assert len(metrics.request_times) == 0
        assert len(metrics.request_counts) == 0
        assert len(metrics.slow_queries) == 0
        assert len(metrics.cpu_samples) == 0
        assert len(metrics.memory_samples) == 0
    
    def test_max_history_limit(self):
        """Test that history respects max_history limit"""
        metrics = PerformanceMetrics(max_history=10)
        
        # Record more than max_history requests
        for i in range(20):
            metrics.record_request("GET", "/api/test", 200, 0.1)
        
        # Should only keep last 10
        assert len(metrics.request_times) == 10
    
    def test_endpoint_times_limit(self):
        """Test that endpoint times respect max_history limit"""
        metrics = PerformanceMetrics(max_history=5)
        
        # Record more than max_history requests to same endpoint
        for i in range(10):
            metrics.record_request("GET", "/api/test", 200, 0.1)
        
        # Should only keep last 5 times
        assert len(metrics.endpoint_times["GET /api/test"]) == 5


class TestPerformanceMonitoringMiddleware:
    """Test PerformanceMonitoringMiddleware class"""
    
    @pytest.fixture
    def metrics(self):
        """Create metrics for testing"""
        return PerformanceMetrics()
    
    @pytest.fixture
    def middleware(self, metrics):
        """Create middleware for testing"""
        app = Mock()
        return PerformanceMonitoringMiddleware(
            app=app,
            metrics=metrics,
            excluded_paths=["/docs", "/redoc"]
        )
    
    def test_excluded_paths(self, middleware):
        """Test that excluded paths are configured"""
        assert "/docs" in middleware.excluded_paths
        assert "/redoc" in middleware.excluded_paths
    
    def test_metrics_instance(self, middleware, metrics):
        """Test that middleware has metrics instance"""
        assert middleware.metrics is metrics


class TestPerformanceMonitoringIntegration:
    """Integration tests for performance monitoring"""
    
    def test_concurrent_request_tracking(self):
        """Test tracking concurrent requests"""
        metrics = PerformanceMetrics()
        
        # Simulate concurrent requests
        for i in range(10):
            metrics.record_request(
                method="GET",
                path="/api/test",
                status_code=200,
                duration=0.1
            )
        
        summary = metrics.get_metrics_summary()
        assert summary['total_requests'] == 10
    
    def test_mixed_success_and_error_requests(self):
        """Test tracking mix of successful and failed requests"""
        metrics = PerformanceMetrics()
        
        # Record mix of requests
        for i in range(20):
            status = 200 if i % 3 != 0 else 500
            error = Exception("Error") if status == 500 else None
            
            metrics.record_request(
                method="GET",
                path="/api/test",
                status_code=status,
                duration=0.1,
                error=error
            )
        
        summary = metrics.get_metrics_summary()
        
        assert summary['total_requests'] == 20
        assert summary['total_errors'] > 0
        assert 0 < summary['error_rate'] < 100
    
    def test_performance_over_time(self):
        """Test tracking performance over time"""
        metrics = PerformanceMetrics()
        
        # Record requests with varying durations
        durations = [0.1, 0.2, 0.5, 1.0, 2.0]
        for duration in durations:
            metrics.record_request(
                method="GET",
                path="/api/test",
                status_code=200,
                duration=duration
            )
        
        endpoint_metrics = metrics.get_endpoint_metrics()
        
        assert len(endpoint_metrics) == 1
        assert endpoint_metrics[0]['min_response_time_ms'] == 100.0
        assert endpoint_metrics[0]['max_response_time_ms'] == 2000.0
    
    def test_get_metrics_function(self):
        """Test global get_metrics function"""
        from app.middleware.metrics import get_metrics
        
        metrics1 = get_metrics()
        metrics2 = get_metrics()
        
        # Should return same instance
        assert metrics1 is metrics2


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
