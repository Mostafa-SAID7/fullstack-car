"""
Database monitoring and management API endpoints.
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db, get_connection_pool_status, get_query_stats, reset_query_stats
from app.repositories.base_repository import clear_cache
from typing import Dict, Any
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/database", tags=["database"])

@router.get("/health")
async def get_database_health(db: Session = Depends(get_db)) -> Dict[str, Any]:
    """
    Get database health status.
    
    Returns connection pool status and query statistics.
    """
    try:
        # Test database connection
        from sqlalchemy import text
        db.execute(text("SELECT 1"))
        
        # Get pool status
        pool_status = get_connection_pool_status()
        
        # Get query stats
        query_stats = get_query_stats()
        
        return {
            "status": "healthy",
            "connection_pool": pool_status,
            "query_statistics": query_stats
        }
    except Exception as e:
        logger.error(f"Database health check failed: {e}")
        raise HTTPException(status_code=500, detail=f"Database unhealthy: {str(e)}")

@router.get("/pool-status")
async def get_pool_status() -> Dict[str, Any]:
    """
    Get connection pool status.
    
    Returns:
    - size: Total pool size
    - checked_in: Available connections
    - checked_out: Active connections
    - overflow: Overflow connections
    - total: Total connections
    """
    try:
        return get_connection_pool_status()
    except Exception as e:
        logger.error(f"Error getting pool status: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/query-stats")
async def get_query_statistics() -> Dict[str, Any]:
    """
    Get query performance statistics.
    
    Returns:
    - total_queries: Total queries executed
    - slow_queries: Number of slow queries (>50ms)
    - cache_hits: Repository cache hits
    - cache_misses: Repository cache misses
    """
    try:
        stats = get_query_stats()
        
        # Calculate cache hit rate
        total_cache_requests = stats['cache_hits'] + stats['cache_misses']
        cache_hit_rate = (stats['cache_hits'] / total_cache_requests * 100) if total_cache_requests > 0 else 0
        
        return {
            **stats,
            'cache_hit_rate': round(cache_hit_rate, 2)
        }
    except Exception as e:
        logger.error(f"Error getting query stats: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/query-stats/reset")
async def reset_statistics() -> Dict[str, str]:
    """
    Reset query statistics.
    
    Clears all query performance counters.
    """
    try:
        reset_query_stats()
        return {"message": "Query statistics reset successfully"}
    except Exception as e:
        logger.error(f"Error resetting query stats: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/cache/clear")
async def clear_repository_cache(model_name: str = None) -> Dict[str, str]:
    """
    Clear repository query cache.
    
    Parameters:
    - model_name: Optional model name to clear cache for specific model only
    
    If model_name is not provided, clears all caches.
    """
    try:
        clear_cache(model_name)
        
        if model_name:
            return {"message": f"Cache cleared for {model_name}"}
        else:
            return {"message": "All caches cleared"}
    except Exception as e:
        logger.error(f"Error clearing cache: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/performance-report")
async def get_performance_report(db: Session = Depends(get_db)) -> Dict[str, Any]:
    """
    Get comprehensive database performance report.
    
    Returns:
    - connection_pool: Pool status
    - query_stats: Query performance statistics
    - recommendations: Performance optimization recommendations
    """
    try:
        pool_status = get_connection_pool_status()
        query_stats = get_query_stats()
        
        # Calculate metrics
        total_cache_requests = query_stats['cache_hits'] + query_stats['cache_misses']
        cache_hit_rate = (query_stats['cache_hits'] / total_cache_requests * 100) if total_cache_requests > 0 else 0
        slow_query_rate = (query_stats['slow_queries'] / query_stats['total_queries'] * 100) if query_stats['total_queries'] > 0 else 0
        
        # Generate recommendations
        recommendations = []
        
        if cache_hit_rate < 60:
            recommendations.append({
                "type": "cache",
                "severity": "warning",
                "message": f"Cache hit rate is {cache_hit_rate:.1f}% (target: >60%). Consider increasing cache TTL or warming more queries."
            })
        
        if slow_query_rate > 10:
            recommendations.append({
                "type": "query",
                "severity": "warning",
                "message": f"Slow query rate is {slow_query_rate:.1f}% (target: <10%). Review slow queries and add indexes."
            })
        
        if pool_status['checked_out'] / pool_status['total'] > 0.8:
            recommendations.append({
                "type": "pool",
                "severity": "warning",
                "message": f"Connection pool usage is {pool_status['checked_out']}/{pool_status['total']} (>80%). Consider increasing pool size."
            })
        
        if not recommendations:
            recommendations.append({
                "type": "success",
                "severity": "info",
                "message": "Database performance is optimal."
            })
        
        return {
            "connection_pool": pool_status,
            "query_statistics": {
                **query_stats,
                'cache_hit_rate': round(cache_hit_rate, 2),
                'slow_query_rate': round(slow_query_rate, 2)
            },
            "recommendations": recommendations
        }
    except Exception as e:
        logger.error(f"Error generating performance report: {e}")
        raise HTTPException(status_code=500, detail=str(e))
