import redis.asyncio as aioredis
import json
import logging
from typing import Optional, Any
from app.core.config import settings

logger = logging.getLogger(__name__)

class CacheService:
    """Redis cache service for conversation context and responses"""
    
    def __init__(self):
        self.redis: Optional[aioredis.Redis] = None
        self.enabled = False
    
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
                return json.loads(value)
            return None
        except Exception as e:
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
            return True
        except Exception as e:
            logger.error(f"Cache set error: {e}")
            return False
    
    async def delete(self, key: str):
        """Delete key from cache"""
        if not self.enabled:
            return False
        
        try:
            await self.redis.delete(key)
            return True
        except Exception as e:
            logger.error(f"Cache delete error: {e}")
            return False
    
    async def get_conversation(self, conversation_id: str) -> Optional[dict]:
        """Get conversation from cache"""
        return await self.get(f"conversation:{conversation_id}")
    
    async def set_conversation(self, conversation_id: str, conversation: dict, ttl: int = 3600):
        """Cache conversation (default 1 hour)"""
        return await self.set(f"conversation:{conversation_id}", conversation, ttl)
    
    async def append_message(self, conversation_id: str, message: dict):
        """Append message to cached conversation"""
        conversation = await self.get_conversation(conversation_id)
        if conversation:
            if "messages" not in conversation:
                conversation["messages"] = []
            conversation["messages"].append(message)
            await self.set_conversation(conversation_id, conversation)
    
    async def get_llm_response(self, prompt_hash: str) -> Optional[str]:
        """Get cached LLM response"""
        return await self.get(f"llm_response:{prompt_hash}")
    
    async def set_llm_response(self, prompt_hash: str, response: str, ttl: int = 604800):
        """Cache LLM response (default 7 days)"""
        return await self.set(f"llm_response:{prompt_hash}", response, ttl)

# Global cache instance
cache_service = CacheService()
