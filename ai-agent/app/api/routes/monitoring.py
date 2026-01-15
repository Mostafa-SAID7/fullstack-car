"""
Performance Monitoring API
Endpoints for viewing performance metrics and monitoring system health
"""
from fastapi import APIRouter, HTTPException, status
from typing import Dict, List, Any
import logging

logger = logging.getLogger(__name__)

router = APIRouter()


@router.get(
    "/metrics",
    summary="Get Performance Metrics",
    description="Get comprehensive performance metrics including response times, throughput, and error rates",
    response_description="Performance metrics summary"
)
async def get_performance_metrics() -> Dict[str, Any]:
    """
    Get performance metrics summary
    
    Returns metrics including:
    - Uptime
    - Total requests and errors
    - Average response time
    - Throughput (requests per second)
    - Slow queries count
    - Resource usage (CPU, memory)
    """
    try:
        from app.middleware.metrics import get_metrics
        metrics = get_metrics()
        summary = metrics.get_metrics_summary()
        
        return {
            "success": True,
            "metrics": summary
        }
    except Exception as e:
        logger.error(f"Failed to get performance metrics: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get metrics: {str(e)}"
        )


@router.get(
    "/metrics/endpoints",
    summary="Get Endpoint Metrics",
    description="Get detailed metrics for each API endpoint",
    response_description="Per-endpoint performance metrics"
)
async def get_endpoint_metrics() -> Dict[str, Any]:
    """
    Get metrics for each endpoint
    
    Returns for each endpoint:
    - Request count
    - Error count
    - Average/min/max response times
    - P95 and P99 response times
    """
    try:
        from app.middleware.metrics import get_metrics
        metrics = get_metrics()
        endpoint_metrics = metrics.get_endpoint_metrics()
        
        return {
            "success": True,
            "endpoints": endpoint_metrics,
            "total_endpoints": len(endpoint_metrics)
        }
    except Exception as e:
        logger.error(f"Failed to get endpoint metrics: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get endpoint metrics: {str(e)}"
        )


@router.get(
    "/metrics/slow-queries",
    summary="Get Slow Queries",
    description="Get list of recent slow queries (requests taking longer than threshold)",
    response_description="List of slow queries"
)
async def get_slow_queries(limit: int = 20) -> Dict[str, Any]:
    """
    Get recent slow queries
    
    Args:
        limit: Maximum number of slow queries to return (default: 20)
    
    Returns list of slow queries with:
    - Timestamp
    - Method and path
    - Duration
    - Status code
    """
    try:
        from app.middleware.metrics import get_metrics
        metrics = get_metrics()
        slow_queries = metrics.get_slow_queries(limit=limit)
        
        return {
            "success": True,
            "slow_queries": slow_queries,
            "count": len(slow_queries),
            "threshold_seconds": metrics.slow_query_threshold
        }
    except Exception as e:
        logger.error(f"Failed to get slow queries: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get slow queries: {str(e)}"
        )


@router.get(
    "/metrics/errors",
    summary="Get Recent Errors",
    description="Get list of recent errors with full context and tracebacks",
    response_description="List of recent errors"
)
async def get_recent_errors(limit: int = 20) -> Dict[str, Any]:
    """
    Get recent errors
    
    Args:
        limit: Maximum number of errors to return (default: 20)
    
    Returns list of errors with:
    - Timestamp
    - Method and path
    - Status code
    - Error message
    - Traceback (if available)
    """
    try:
        from app.middleware.metrics import get_metrics
        metrics = get_metrics()
        errors = metrics.get_recent_errors(limit=limit)
        
        return {
            "success": True,
            "errors": errors,
            "count": len(errors)
        }
    except Exception as e:
        logger.error(f"Failed to get recent errors: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get recent errors: {str(e)}"
        )


@router.get(
    "/metrics/resources",
    summary="Get Resource Usage",
    description="Get CPU and memory usage history",
    response_description="Resource usage metrics"
)
async def get_resource_usage() -> Dict[str, Any]:
    """
    Get resource usage history
    
    Returns:
    - CPU usage samples (percent)
    - Memory usage samples (percent and MB)
    """
    try:
        from app.middleware.metrics import get_metrics
        metrics = get_metrics()
        resources = metrics.get_resource_usage_history()
        
        return {
            "success": True,
            "resources": resources,
            "cpu_samples": len(resources['cpu']),
            "memory_samples": len(resources['memory'])
        }
    except Exception as e:
        logger.error(f"Failed to get resource usage: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get resource usage: {str(e)}"
        )


@router.get(
    "/alerts",
    summary="Get Performance Alerts",
    description="Get active performance alerts (high error rate, slow queries, resource usage)",
    response_description="List of active alerts"
)
async def get_performance_alerts() -> Dict[str, Any]:
    """
    Get performance alerts
    
    Checks for:
    - High error rate
    - Excessive slow queries
    - High CPU usage
    - High memory usage
    
    Returns list of alerts with:
    - Type
    - Severity (warning/critical)
    - Message
    - Timestamp
    """
    try:
        from app.middleware.metrics import get_metrics
        metrics = get_metrics()
        alerts = metrics.check_alerts()
        
        return {
            "success": True,
            "alerts": alerts,
            "count": len(alerts),
            "has_critical": any(a['severity'] == 'critical' for a in alerts)
        }
    except Exception as e:
        logger.error(f"Failed to get performance alerts: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get alerts: {str(e)}"
        )


@router.post(
    "/metrics/reset",
    summary="Reset Performance Metrics",
    description="Reset all performance metrics and counters",
    response_description="Success confirmation"
)
async def reset_performance_metrics() -> Dict[str, Any]:
    """
    Reset all performance metrics
    
    Clears:
    - Request history
    - Error history
    - Slow queries
    - Resource usage samples
    - All counters
    """
    try:
        from app.middleware.metrics import get_metrics
        metrics = get_metrics()
        metrics.reset_metrics()
        
        return {
            "success": True,
            "message": "Performance metrics reset successfully"
        }
    except Exception as e:
        logger.error(f"Failed to reset performance metrics: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to reset metrics: {str(e)}"
        )


@router.get(
    "/health",
    summary="Health Check with Metrics",
    description="Comprehensive health check including performance metrics",
    response_description="Health status with metrics"
)
async def health_check_with_metrics() -> Dict[str, Any]:
    """
    Comprehensive health check
    
    Returns:
    - Overall health status
    - Performance metrics summary
    - Active alerts
    - Resource usage
    """
    try:
        from app.middleware.metrics import get_metrics
        metrics = get_metrics()
        
        summary = metrics.get_metrics_summary()
        alerts = metrics.check_alerts()
        
        # Determine health status
        has_critical_alerts = any(a['severity'] == 'critical' for a in alerts)
        error_rate = summary['error_rate']
        
        if has_critical_alerts or error_rate > 10:
            health_status = "unhealthy"
        elif alerts or error_rate > 5:
            health_status = "degraded"
        else:
            health_status = "healthy"
        
        return {
            "status": health_status,
            "timestamp": metrics.start_time.isoformat(),
            "uptime_seconds": summary['uptime_seconds'],
            "metrics": {
                "total_requests": summary['total_requests'],
                "error_rate": summary['error_rate'],
                "avg_response_time_ms": summary['avg_response_time_ms'],
                "throughput_rps": summary['throughput_rps'],
                "cpu_usage_percent": summary['cpu_usage_percent'],
                "memory_usage_percent": summary['memory_usage_percent']
            },
            "alerts": alerts,
            "alert_count": len(alerts)
        }
    except Exception as e:
        logger.error(f"Health check failed: {e}", exc_info=True)
        return {
            "status": "unhealthy",
            "error": str(e)
        }
