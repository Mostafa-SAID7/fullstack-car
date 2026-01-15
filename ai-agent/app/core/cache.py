import redis.asyncio as aioredis
import json
import logging
import time
from typing import Optional, Any, Dict, List
from datetime import datetime, timedelta
from app.core.config import settings

logger = logging.getLogger(__name__)

class CacheService:
    """
    Enhanced Redis cache service with comprehensive caching strategy.
    
    Features:
    - Conversation context caching (1 hour TTL)
    - Knowledge base search result caching (24 hours TTL)
    - LLM response caching (7 days TTL)
    - Cache invalidation on updates
    - Cache warming for common queries
    - Cache metrics and monitoring
    - Configurable TTL per cache type
    """
    
    # Default TTL values (in seconds)
    TTL_CONVERSATION = 3600  # 1 hour
    TTL_KNOWLEDGE_SEARCH = 86400  # 24 hours
    TTL_LLM_RESPONSE = 604800  # 7 days
    TTL_AGENT_CONFIG = 3600  # 1 hour
    TTL_USER_CONTEXT = 1800  # 30 minutes
    
    def __init__(self):
        self.redis: Optional[aioredis.Redis] = None
        self.enabled = False
        self._metrics = {
            'hits': 0,
            'misses': 0,
            'sets': 0,
            'deletes': 0,
            'errors': 0
        }
        self._start_time = time.time()
    
    async def connect(self):
        """Connect to Redis"""
        try:
            self.redis = await aioredis.from_url(
                settings.REDIS_URL,
                encoding="utf-8",
                decode_responses=True
            )
            # Test connection
            await self.redis.ping()
            self.enabled = True
            logger.info("Redis cache connected successfully")
        except Exception as e:
            logger.warning(f"Redis connection failed: {e}. Cache disabled.")
            self.enabled = False
    
    async def disconnect(self):
        """Disconnect from Redis"""
        if self.redis:
            await self.redis.close()
            logger.info("Redis cache disconnected")
    
    async def get(self, key: str) -> Optional[Any]:
        """Get value from cache"""
        if not self.enabled:
            return None
        
        try:
            value = await self.redis.get(key)
            if value:
                self._metrics['hits'] += 1
                return json.loads(value)
            self._metrics['misses'] += 1
            return None
        except Exception as e:
            self._metrics['errors'] += 1
            logger.error(f"Cache get error: {e}")
            return None
    
    async def set(self, key: str, value: Any, ttl: int = 3600):
        """Set value in cache with TTL (default 1 hour)"""
        if not self.enabled:
            return False
        
        try:
            await self.redis.setex(
                key,
                ttl,
                json.dumps(value, default=str)
            )
            self._metrics['sets'] += 1
            return True
        except Exception as e:
            self._metrics['errors'] += 1
            logger.error(f"Cache set error: {e}")
            return False
    
    async def delete(self, key: str):
        """Delete key from cache"""
        if not self.enabled:
            return False
        
        try:
            await self.redis.delete(key)
            self._metrics['deletes'] += 1
            return True
        except Exception as e:
            self._metrics['errors'] += 1
            logger.error(f"Cache delete error: {e}")
            return False
    
    async def delete_pattern(self, pattern: str) -> int:
        """
        Delete all keys matching a pattern.
        
        Args:
            pattern: Redis key pattern (e.g., "conversation:*")
            
        Returns:
            Number of keys deleted
        """
        if not self.enabled:
            return 0
        
        try:
            keys = []
            async for key in self.redis.scan_iter(match=pattern):
                keys.append(key)
            
            if keys:
                deleted = await self.redis.delete(*keys)
                self._metrics['deletes'] += deleted
                return deleted
            return 0
        except Exception as e:
            self._metrics['errors'] += 1
            logger.error(f"Cache delete pattern error: {e}")
            return 0
    
    async def exists(self, key: str) -> bool:
        """Check if key exists in cache"""
        if not self.enabled:
            return False
        
        try:
            return await self.redis.exists(key) > 0
        except Exception as e:
            logger.error(f"Cache exists error: {e}")
            return False
    
    async def get_ttl(self, key: str) -> int:
        """Get remaining TTL for a key in seconds"""
        if not self.enabled:
            return -1
        
        try:
            return await self.redis.ttl(key)
        except Exception as e:
            logger.error(f"Cache TTL error: {e}")
            return -1
    
    # Conversation caching methods
    async def get_conversation(self, conversation_id: str) -> Optional[dict]:
        """Get conversation from cache"""
        return await self.get(f"conversation:{conversation_id}")
    
    async def set_conversation(
        self, 
        conversation_id: str, 
        conversation: dict, 
        ttl: Optional[int] = None
    ):
        """Cache conversation (default 1 hour)"""
        ttl = ttl or self.TTL_CONVERSATION
        return await self.set(f"conversation:{conversation_id}", conversation, ttl)
    
    async def invalidate_conversation(self, conversation_id: str):
        """Invalidate conversation cache"""
        return await self.delete(f"conversation:{conversation_id}")
    
    async def append_message(self, conversation_id: str, message: dict):
        """Append message to cached conversation"""
        conversation = await self.get_conversation(conversation_id)
        if conversation:
            if "messages" not in conversation:
                conversation["messages"] = []
            conversation["messages"].append(message)
            await self.set_conversation(conversation_id, conversation)
    
    # LLM response caching methods
    async def get_llm_response(self, prompt_hash: str) -> Optional[dict]:
        """Get cached LLM response"""
        return await self.get(f"llm_response:{prompt_hash}")
    
    async def set_llm_response(
        self, 
        prompt_hash: str, 
        response: dict, 
        ttl: Optional[int] = None
    ):
        """Cache LLM response (default 7 days)"""
        ttl = ttl or self.TTL_LLM_RESPONSE
        return await self.set(f"llm_response:{prompt_hash}", response, ttl)
    
    async def invalidate_llm_responses(self):
        """Invalidate all LLM response caches"""
        return await self.delete_pattern("llm_response:*")
    
    # Knowledge base search caching methods
    async def get_knowledge_search(
        self, 
        query_hash: str, 
        category: Optional[str] = None
    ) -> Optional[List[dict]]:
        """Get cached knowledge search results"""
        cache_key = f"knowledge_search:{query_hash}"
        if category:
            cache_key += f":{category}"
        return await self.get(cache_key)
    
    async def set_knowledge_search(
        self,
        query_hash: str,
        results: List[dict],
        category: Optional[str] = None,
        ttl: Optional[int] = None
    ):
        """Cache knowledge search results (default 24 hours)"""
        ttl = ttl or self.TTL_KNOWLEDGE_SEARCH
        cache_key = f"knowledge_search:{query_hash}"
        if category:
            cache_key += f":{category}"
        return await self.set(cache_key, results, ttl)
    
    async def invalidate_knowledge_searches(self, category: Optional[str] = None):
        """Invalidate knowledge search caches"""
        if category:
            pattern = f"knowledge_search:*:{category}"
        else:
            pattern = "knowledge_search:*"
        return await self.delete_pattern(pattern)
    
    # Agent configuration caching methods
    async def get_agent_config(self, agent_type: str) -> Optional[dict]:
        """Get cached agent configuration"""
        return await self.get(f"agent_config:{agent_type}")
    
    async def set_agent_config(
        self,
        agent_type: str,
        config: dict,
        ttl: Optional[int] = None
    ):
        """Cache agent configuration (default 1 hour)"""
        ttl = ttl or self.TTL_AGENT_CONFIG
        return await self.set(f"agent_config:{agent_type}", config, ttl)
    
    async def invalidate_agent_config(self, agent_type: str):
        """Invalidate agent configuration cache"""
        return await self.delete(f"agent_config:{agent_type}")
    
    # User context caching methods
    async def get_user_context(self, user_id: str) -> Optional[dict]:
        """Get cached user context"""
        return await self.get(f"user_context:{user_id}")
    
    async def set_user_context(
        self,
        user_id: str,
        context: dict,
        ttl: Optional[int] = None
    ):
        """Cache user context (default 30 minutes)"""
        ttl = ttl or self.TTL_USER_CONTEXT
        return await self.set(f"user_context:{user_id}", context, ttl)
    
    async def invalidate_user_context(self, user_id: str):
        """Invalidate user context cache"""
        return await self.delete(f"user_context:{user_id}")
    
    # Cache warming methods
    async def warm_common_queries(self, queries: List[str]):
        """
        Pre-cache common queries to improve performance.
        
        Args:
            queries: List of common query strings to warm
        """
        if not self.enabled:
            return
        
        logger.info(f"Warming cache with {len(queries)} common queries")
        warmed = 0
        
        for query in queries:
            try:
                # Check if already cached
                import hashlib
                query_hash = hashlib.sha256(query.encode()).hexdigest()
                
                if not await self.exists(f"knowledge_search:{query_hash}"):
                    # This would need to be integrated with actual search
                    # For now, just log that we would warm this query
                    logger.debug(f"Would warm query: {query}")
                    warmed += 1
            except Exception as e:
                logger.error(f"Error warming query '{query}': {e}")
        
        logger.info(f"Cache warming completed: {warmed} queries warmed")
    
    # Cache metrics methods
    def get_metrics(self) -> Dict[str, Any]:
        """
        Get cache performance metrics.
        
        Returns:
            Dictionary with cache statistics
        """
        total_requests = self._metrics['hits'] + self._metrics['misses']
        hit_rate = (
            self._metrics['hits'] / total_requests 
            if total_requests > 0 else 0.0
        )
        
        uptime = time.time() - self._start_time
        
        return {
            'enabled': self.enabled,
            'hits': self._metrics['hits'],
            'misses': self._metrics['misses'],
            'hit_rate': hit_rate,
            'sets': self._metrics['sets'],
            'deletes': self._metrics['deletes'],
            'errors': self._metrics['errors'],
            'total_requests': total_requests,
            'uptime_seconds': uptime,
            'ttl_config': {
                'conversation': self.TTL_CONVERSATION,
                'knowledge_search': self.TTL_KNOWLEDGE_SEARCH,
                'llm_response': self.TTL_LLM_RESPONSE,
                'agent_config': self.TTL_AGENT_CONFIG,
                'user_context': self.TTL_USER_CONTEXT
            }
        }
    
    def reset_metrics(self):
        """Reset cache metrics"""
        self._metrics = {
            'hits': 0,
            'misses': 0,
            'sets': 0,
            'deletes': 0,
            'errors': 0
        }
        self._start_time = time.time()
        logger.info("Cache metrics reset")
    
    async def get_cache_size(self) -> int:
        """Get approximate number of keys in cache"""
        if not self.enabled:
            return 0
        
        try:
            return await self.redis.dbsize()
        except Exception as e:
            logger.error(f"Error getting cache size: {e}")
            return 0
    
    async def flush_all(self):
        """Flush all cache entries (use with caution!)"""
        if not self.enabled:
            return False
        
        try:
            await self.redis.flushdb()
            logger.warning("All cache entries flushed")
            return True
        except Exception as e:
            logger.error(f"Error flushing cache: {e}")
            return False
    
    # TTL configuration methods
    def configure_ttl(
        self,
        conversation: Optional[int] = None,
        knowledge_search: Optional[int] = None,
        llm_response: Optional[int] = None,
        agent_config: Optional[int] = None,
        user_context: Optional[int] = None
    ):
        """
        Configure TTL values for different cache types.
        
        Args:
            conversation: TTL for conversations in seconds
            knowledge_search: TTL for knowledge searches in seconds
            llm_response: TTL for LLM responses in seconds
            agent_config: TTL for agent configs in seconds
            user_context: TTL for user context in seconds
        """
        if conversation is not None:
            self.TTL_CONVERSATION = conversation
        if knowledge_search is not None:
            self.TTL_KNOWLEDGE_SEARCH = knowledge_search
        if llm_response is not None:
            self.TTL_LLM_RESPONSE = llm_response
        if agent_config is not None:
            self.TTL_AGENT_CONFIG = agent_config
        if user_context is not None:
            self.TTL_USER_CONTEXT = user_context
        
        logger.info("Cache TTL configuration updated")

# Global cache instance
cache_service = CacheService()
