"""
Cache Management API Endpoints
"""
from fastapi import APIRouter, HTTPException
from typing import Dict, Any, Optional
from pydantic import BaseModel
from app.core.cache import cache_service
from app.services.cache_service import advanced_cache_service
import logging

logger = logging.getLogger(__name__)

router = APIRouter()

class CacheTTLConfig(BaseModel):
    """Cache TTL configuration model"""
    conversation: Optional[int] = None
    knowledge_search: Optional[int] = None
    llm_response: Optional[int] = None
    agent_config: Optional[int] = None
    user_context: Optional[int] = None

@router.get("/metrics",
    summary="Get Cache Metrics",
    description="Get comprehensive cache performance metrics",
    response_description="Cache metrics and statistics"
)
async def get_cache_metrics() -> Dict[str, Any]:
    """Get cache performance metrics"""
    try:
        metrics = cache_service.get_metrics()
        cache_size = await cache_service.get_cache_size()
        
        return {
            "status": "success",
            "metrics": metrics,
            "cache_size": cache_size
        }
    except Exception as e:
        logger.error(f"Error getting cache metrics: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/health",
    summary="Cache Health Check",
    description="Perform cache health check and get status",
    response_description="Cache health status"
)
async def cache_health_check() -> Dict[str, Any]:
    """Perform cache health check"""
    try:
        health = await advanced_cache_service.health_check()
        return {
            "status": "success",
            "health": health
        }
    except Exception as e:
        logger.error(f"Error in cache health check: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/optimization",
    summary="Get Cache Optimization Recommendations",
    description="Analyze cache usage and get optimization recommendations",
    response_description="Optimization analysis and recommendations"
)
async def get_cache_optimization() -> Dict[str, Any]:
    """Get cache optimization recommendations"""
    try:
        optimization = await advanced_cache_service.optimize_cache()
        return {
            "status": "success",
            "optimization": optimization
        }
    except Exception as e:
        logger.error(f"Error getting cache optimization: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/warm",
    summary="Warm Cache",
    description="Warm cache with common queries and configurations",
    response_description="Cache warming status"
)
async def warm_cache() -> Dict[str, Any]:
    """Warm cache with common queries"""
    try:
        await advanced_cache_service.warm_cache_startup()
        return {
            "status": "success",
            "message": "Cache warming completed"
        }
    except Exception as e:
        logger.error(f"Error warming cache: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/warm/predictive",
    summary="Predictive Cache Warming",
    description="Warm cache based on usage patterns and predictions",
    response_description="Predictive warming status"
)
async def predictive_cache_warm() -> Dict[str, Any]:
    """Warm cache based on usage patterns"""
    try:
        await advanced_cache_service.predictive_cache_warm()
        return {
            "status": "success",
            "message": "Predictive cache warming completed"
        }
    except Exception as e:
        logger.error(f"Error in predictive cache warming: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/invalidate/conversations",
    summary="Invalidate Conversation Caches",
    description="Invalidate all conversation caches",
    response_description="Invalidation status"
)
async def invalidate_conversation_caches() -> Dict[str, Any]:
    """Invalidate all conversation caches"""
    try:
        deleted = await cache_service.delete_pattern("conversation:*")
        return {
            "status": "success",
            "message": f"Invalidated {deleted} conversation caches"
        }
    except Exception as e:
        logger.error(f"Error invalidating conversation caches: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/invalidate/knowledge",
    summary="Invalidate Knowledge Search Caches",
    description="Invalidate all knowledge search caches",
    response_description="Invalidation status"
)
async def invalidate_knowledge_caches() -> Dict[str, Any]:
    """Invalidate all knowledge search caches"""
    try:
        await cache_service.invalidate_knowledge_searches()
        return {
            "status": "success",
            "message": "Invalidated all knowledge search caches"
        }
    except Exception as e:
        logger.error(f"Error invalidating knowledge caches: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/invalidate/llm",
    summary="Invalidate LLM Response Caches",
    description="Invalidate all LLM response caches",
    response_description="Invalidation status"
)
async def invalidate_llm_caches() -> Dict[str, Any]:
    """Invalidate all LLM response caches"""
    try:
        await cache_service.invalidate_llm_responses()
        return {
            "status": "success",
            "message": "Invalidated all LLM response caches"
        }
    except Exception as e:
        logger.error(f"Error invalidating LLM caches: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/invalidate/all",
    summary="Flush All Caches",
    description="Flush all cache entries (use with caution!)",
    response_description="Flush status"
)
async def flush_all_caches() -> Dict[str, Any]:
    """Flush all cache entries"""
    try:
        success = await cache_service.flush_all()
        if success:
            return {
                "status": "success",
                "message": "All caches flushed"
            }
        else:
            raise HTTPException(status_code=500, detail="Failed to flush caches")
    except Exception as e:
        logger.error(f"Error flushing caches: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/configure/ttl",
    summary="Configure Cache TTL",
    description="Configure TTL values for different cache types",
    response_description="Configuration status"
)
async def configure_cache_ttl(config: CacheTTLConfig) -> Dict[str, Any]:
    """Configure cache TTL values"""
    try:
        cache_service.configure_ttl(
            conversation=config.conversation,
            knowledge_search=config.knowledge_search,
            llm_response=config.llm_response,
            agent_config=config.agent_config,
            user_context=config.user_context
        )
        
        return {
            "status": "success",
            "message": "Cache TTL configuration updated",
            "config": cache_service.get_metrics()['ttl_config']
        }
    except Exception as e:
        logger.error(f"Error configuring cache TTL: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/reset/metrics",
    summary="Reset Cache Metrics",
    description="Reset cache performance metrics",
    response_description="Reset status"
)
async def reset_cache_metrics() -> Dict[str, Any]:
    """Reset cache metrics"""
    try:
        cache_service.reset_metrics()
        return {
            "status": "success",
            "message": "Cache metrics reset"
        }
    except Exception as e:
        logger.error(f"Error resetting cache metrics: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/popular-queries",
    summary="Get Popular Queries",
    description="Get most popular queries by type",
    response_description="Popular queries list"
)
async def get_popular_queries(
    query_type: str = "knowledge",
    limit: int = 10
) -> Dict[str, Any]:
    """Get popular queries"""
    try:
        queries = advanced_cache_service.get_popular_queries(query_type, limit)
        return {
            "status": "success",
            "query_type": query_type,
            "queries": queries
        }
    except Exception as e:
        logger.error(f"Error getting popular queries: {e}")
        raise HTTPException(status_code=500, detail=str(e))
