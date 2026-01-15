"""
Performance Monitoring Middleware
Tracks request timing, metrics collection, and performance monitoring
"""
import time
import logging
import psutil
import traceback
from typing import Dict, List, Optional, Any
from datetime import datetime, timedelta
from collections import defaultdict, deque
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.types import ASGIApp

logger = logging.getLogger(__name__)


class PerformanceMetrics:
    """
    Collects and stores performance metrics
    """
    
    def __init__(self, max_history: int = 1000):
        """
        Initialize metrics collector
        
        Args:
            max_history: Maximum number of requests to keep in history
        """
        self.max_history = max_history
        
        # Request metrics
        self.request_times: deque = deque(maxlen=max_history)
        self.request_counts: Dict[str, int] = defaultdict(int)
        self.error_counts: Dict[str, int] = defaultdict(int)
        self.slow_queries: List[Dict[str, Any]] = []
        
        # Endpoint metrics
        self.endpoint_times: Dict[str, List[float]] = defaultdict(list)
        self.endpoint_counts: Dict[str, int] = defaultdict(int)
        self.endpoint_errors: Dict[str, int] = defaultdict(int)
        
        # Error tracking
        self.recent_errors: deque = deque(maxlen=100)
        
        # Resource metrics
        self.cpu_samples: deque = deque(maxlen=100)
        self.memory_samples: deque = deque(maxlen=100)
        
        # Thresholds
        self.slow_query_threshold = 2.0  # seconds
        self.error_alert_threshold = 10  # errors per minute
        
        # Timestamps
        self.start_time = datetime.utcnow()
        self.last_alert_time = datetime.utcnow()
        
        logger.info("Performance metrics initialized")
    
    def record_request(
        self,
        method: str,
        path: str,
        status_code: int,
        duration: float,
        error: Optional[Exception] = None
    ):
        """Record a request with its metrics"""
        timestamp = datetime.utcnow()
        
        # Record request time
        self.request_times.append({
            'timestamp': timestamp,
            'method': method,
            'path': path,
            'status_code': status_code,
            'duration': duration,
            'error': str(error) if error else None
        })
        
        # Update counts
        endpoint_key = f"{method} {path}"
        self.request_counts[endpoint_key] += 1
        self.endpoint_counts[endpoint_key] += 1
        
        # Record endpoint timing
        if len(self.endpoint_times[endpoint_key]) >= self.max_history:
            self.endpoint_times[endpoint_key].pop(0)
        self.endpoint_times[endpoint_key].append(duration)
        
        # Track errors
        if status_code >= 400:
            self.error_counts[endpoint_key] += 1
            self.endpoint_errors[endpoint_key] += 1
            
            if error:
                self.recent_errors.append({
                    'timestamp': timestamp,
                    'method': method,
                    'path': path,
                    'status_code': status_code,
                    'error': str(error),
                    'traceback': traceback.format_exc() if error else None
                })
        
        # Detect slow queries
        if duration > self.slow_query_threshold:
            self.slow_queries.append({
                'timestamp': timestamp,
                'method': method,
                'path': path,
                'duration': duration,
                'status_code': status_code
            })
            
            # Keep only recent slow queries
            if len(self.slow_queries) > 100:
                self.slow_queries.pop(0)
            
            logger.warning(
                f"Slow query detected: {method} {path} took {duration:.2f}s"
            )
    
    def record_resource_usage(self):
        """Record current resource usage"""
        try:
            cpu_percent = psutil.cpu_percent(interval=0.1)
            memory = psutil.virtual_memory()
            
            self.cpu_samples.append({
                'timestamp': datetime.utcnow(),
                'cpu_percent': cpu_percent
            })
            
            self.memory_samples.append({
                'timestamp': datetime.utcnow(),
                'memory_percent': memory.percent,
                'memory_used_mb': memory.used / (1024 * 1024),
                'memory_available_mb': memory.available / (1024 * 1024)
            })
        except Exception as e:
            logger.error(f"Failed to record resource usage: {e}")
    
    def get_metrics_summary(self) -> Dict[str, Any]:
        """Get summary of all metrics"""
        now = datetime.utcnow()
        uptime = (now - self.start_time).total_seconds()
        
        # Calculate request statistics
        total_requests = sum(self.request_counts.values())
        total_errors = sum(self.error_counts.values())
        
        # Calculate average response time
        recent_times = [r['duration'] for r in list(self.request_times)[-100:]]
        avg_response_time = sum(recent_times) / len(recent_times) if recent_times else 0
        
        # Calculate throughput (requests per second)
        recent_requests = [
            r for r in self.request_times
            if (now - r['timestamp']).total_seconds() < 60
        ]
        throughput = len(recent_requests) / 60 if recent_requests else 0
        
        # Get resource usage
        recent_cpu = [s['cpu_percent'] for s in list(self.cpu_samples)[-10:]]
        recent_memory = [s['memory_percent'] for s in list(self.memory_samples)[-10:]]
        
        avg_cpu = sum(recent_cpu) / len(recent_cpu) if recent_cpu else 0
        avg_memory = sum(recent_memory) / len(recent_memory) if recent_memory else 0
        
        return {
            'uptime_seconds': uptime,
            'total_requests': total_requests,
            'total_errors': total_errors,
            'error_rate': (total_errors / total_requests * 100) if total_requests > 0 else 0,
            'avg_response_time_ms': avg_response_time * 1000,
            'throughput_rps': throughput,
            'slow_queries_count': len(self.slow_queries),
            'recent_errors_count': len(self.recent_errors),
            'cpu_usage_percent': avg_cpu,
            'memory_usage_percent': avg_memory,
            'endpoints_tracked': len(self.endpoint_counts)
        }
    
    def get_endpoint_metrics(self) -> List[Dict[str, Any]]:
        """Get metrics for each endpoint"""
        metrics = []
        
        for endpoint, times in self.endpoint_times.items():
            if times:
                metrics.append({
                    'endpoint': endpoint,
                    'request_count': self.endpoint_counts[endpoint],
                    'error_count': self.endpoint_errors[endpoint],
                    'avg_response_time_ms': (sum(times) / len(times)) * 1000,
                    'min_response_time_ms': min(times) * 1000,
                    'max_response_time_ms': max(times) * 1000,
                    'p95_response_time_ms': self._calculate_percentile(times, 95) * 1000,
                    'p99_response_time_ms': self._calculate_percentile(times, 99) * 1000
                })
        
        # Sort by request count
        metrics.sort(key=lambda x: x['request_count'], reverse=True)
        return metrics
    
    def get_slow_queries(self, limit: int = 20) -> List[Dict[str, Any]]:
        """Get recent slow queries"""
        return sorted(
            self.slow_queries[-limit:],
            key=lambda x: x['duration'],
            reverse=True
        )
    
    def get_recent_errors(self, limit: int = 20) -> List[Dict[str, Any]]:
        """Get recent errors"""
        return list(self.recent_errors)[-limit:]
    
    def get_resource_usage_history(self) -> Dict[str, List[Dict[str, Any]]]:
        """Get resource usage history"""
        return {
            'cpu': list(self.cpu_samples),
            'memory': list(self.memory_samples)
        }
    
    def check_alerts(self) -> List[Dict[str, Any]]:
        """Check for performance alerts"""
        alerts = []
        now = datetime.utcnow()
        
        # Check error rate
        recent_errors = [
            e for e in self.recent_errors
            if (now - e['timestamp']).total_seconds() < 60
        ]
        
        if len(recent_errors) > self.error_alert_threshold:
            alerts.append({
                'type': 'high_error_rate',
                'severity': 'warning',
                'message': f"High error rate: {len(recent_errors)} errors in last minute",
                'timestamp': now
            })
        
        # Check slow queries
        recent_slow = [
            q for q in self.slow_queries
            if (now - q['timestamp']).total_seconds() < 300
        ]
        
        if len(recent_slow) > 5:
            alerts.append({
                'type': 'slow_queries',
                'severity': 'warning',
                'message': f"{len(recent_slow)} slow queries in last 5 minutes",
                'timestamp': now
            })
        
        # Check CPU usage
        if self.cpu_samples:
            recent_cpu = [s['cpu_percent'] for s in list(self.cpu_samples)[-5:]]
            avg_cpu = sum(recent_cpu) / len(recent_cpu)
            
            if avg_cpu > 80:
                alerts.append({
                    'type': 'high_cpu',
                    'severity': 'critical',
                    'message': f"High CPU usage: {avg_cpu:.1f}%",
                    'timestamp': now
                })
        
        # Check memory usage
        if self.memory_samples:
            recent_memory = [s['memory_percent'] for s in list(self.memory_samples)[-5:]]
            avg_memory = sum(recent_memory) / len(recent_memory)
            
            if avg_memory > 85:
                alerts.append({
                    'type': 'high_memory',
                    'severity': 'critical',
                    'message': f"High memory usage: {avg_memory:.1f}%",
                    'timestamp': now
                })
        
        return alerts
    
    def _calculate_percentile(self, values: List[float], percentile: int) -> float:
        """Calculate percentile of values"""
        if not values:
            return 0.0
        
        sorted_values = sorted(values)
        index = int(len(sorted_values) * percentile / 100)
        return sorted_values[min(index, len(sorted_values) - 1)]
    
    def reset_metrics(self):
        """Reset all metrics"""
        self.request_times.clear()
        self.request_counts.clear()
        self.error_counts.clear()
        self.slow_queries.clear()
        self.endpoint_times.clear()
        self.endpoint_counts.clear()
        self.endpoint_errors.clear()
        self.recent_errors.clear()
        self.cpu_samples.clear()
        self.memory_samples.clear()
        self.start_time = datetime.utcnow()
        logger.info("Performance metrics reset")


class PerformanceMonitoringMiddleware(BaseHTTPMiddleware):
    """
    FastAPI middleware for performance monitoring
    """
    
    def __init__(
        self,
        app: ASGIApp,
        metrics: PerformanceMetrics,
        excluded_paths: Optional[List[str]] = None
    ):
        """
        Initialize middleware
        
        Args:
            app: ASGI application
            metrics: PerformanceMetrics instance
            excluded_paths: Paths to exclude from monitoring
        """
        super().__init__(app)
        self.metrics = metrics
        self.excluded_paths = excluded_paths or [
            "/docs",
            "/redoc",
            "/openapi.json"
        ]
        logger.info(f"Performance monitoring middleware initialized")
    
    async def dispatch(self, request: Request, call_next):
        """Monitor request performance"""
        # Skip monitoring for excluded paths
        if request.url.path in self.excluded_paths:
            return await call_next(request)
        
        # Record start time
        start_time = time.time()
        error = None
        status_code = 500
        
        try:
            # Process request
            response = await call_next(request)
            status_code = response.status_code
            return response
            
        except Exception as e:
            error = e
            logger.error(f"Request failed: {e}", exc_info=True)
            raise
            
        finally:
            # Calculate duration
            duration = time.time() - start_time
            
            # Record metrics
            self.metrics.record_request(
                method=request.method,
                path=request.url.path,
                status_code=status_code,
                duration=duration,
                error=error
            )
            
            # Periodically record resource usage
            if len(self.metrics.request_times) % 10 == 0:
                self.metrics.record_resource_usage()


# Global metrics instance
_metrics: Optional[PerformanceMetrics] = None


def get_metrics() -> PerformanceMetrics:
    """Get or create global metrics instance"""
    global _metrics
    if _metrics is None:
        _metrics = PerformanceMetrics()
    return _metrics
