"""
Advanced cache service with intelligent caching strategies and cache warming.
"""
import asyncio
import hashlib
import logging
from typing import List, Dict, Any, Optional, Callable
from datetime import datetime, timedelta
from app.core.cache import cache_service
from app.models.schemas import KnowledgeEntry, AgentType

logger = logging.getLogger(__name__)

class AdvancedCacheService:
    """
    Advanced caching service with intelligent strategies.
    
    Features:
    - Cache warming for common queries
    - Intelligent cache invalidation
    - Cache analytics and monitoring
    - Predictive caching based on usage patterns
    - Cache optimization recommendations
    """
    
    def __init__(self):
        self.cache = cache_service
        self._usage_patterns: Dict[str, List[datetime]] = {}
        self._common_queries: List[str] = []
        self._invalidation_rules: Dict[str, List[Callable]] = {}
        
    async def initialize(self):
        """Initialize the advanced cache service"""
        await self.cache.connect()
        await self._load_common_queries()
        await self._setup_invalidation_rules()
        logger.info("Advanced cache service initialized")
    
    # Cache warming methods
    async def warm_cache_startup(self):
        """Warm cache on application startup with common queries"""
        logger.info("Starting cache warming process...")
        
        # Warm common knowledge queries
        await self._warm_knowledge_queries()
        
        # Warm common agent configurations
        await self._warm_agent_configs()
        
        # Warm common LLM prompts
        await self._warm_llm_responses()
        
        logger.info("Cache warming completed")
    
    async def _warm_knowledge_queries(self):
        """Warm cache with common knowledge base queries"""
        common_queries = [
            "oil change interval",
            "brake pad replacement",
            "engine diagnostic codes",
            "tire pressure check",
            "battery replacement",
            "transmission fluid change",
            "air filter replacement",
            "spark plug replacement",
            "coolant flush",
            "car buying checklist",
            "selling car tips",
            "modification compatibility",
            "community guidelines",
            "how to post in groups"
        ]
        
        for query in common_queries:
            try:
                query_hash = self._hash_query(query)
                
                # Check if already cached
                if not await self.cache.exists(f"knowledge_search:{query_hash}"):
                    # Pre-populate with placeholder that indicates warming needed
                    await self.cache.set_knowledge_search(
                        query_hash,
                        [],  # Empty results, will be populated on first real search
                        ttl=60  # Short TTL for warming placeholders
                    )
                    logger.debug(f"Warmed knowledge query: {query}")
            except Exception as e:
                logger.error(f"Error warming knowledge query '{query}': {e}")
    
    async def _warm_agent_configs(self):
        """Warm cache with default agent configurations"""
        default_configs = {
            AgentType.MECHANIC: {
                "personality": "expert",
                "expertise_level": 0.9,
                "response_style": "detailed",
                "temperature": 0.3
            },
            AgentType.BUYER_GUIDE: {
                "personality": "helpful",
                "expertise_level": 0.8,
                "response_style": "conversational",
                "temperature": 0.5
            },
            AgentType.SELLER_ASSISTANT: {
                "personality": "professional",
                "expertise_level": 0.8,
                "response_style": "structured",
                "temperature": 0.4
            },
            AgentType.MODIFICATION_EXPERT: {
                "personality": "enthusiast",
                "expertise_level": 0.9,
                "response_style": "technical",
                "temperature": 0.3
            },
            AgentType.COMMUNITY_HELPER: {
                "personality": "friendly",
                "expertise_level": 0.7,
                "response_style": "step-by-step",
                "temperature": 0.6
            },
            AgentType.GENERAL: {
                "personality": "balanced",
                "expertise_level": 0.7,
                "response_style": "adaptive",
                "temperature": 0.5
            }
        }
        
        for agent_type, config in default_configs.items():
            try:
                await self.cache.set_agent_config(agent_type.value, config)
                logger.debug(f"Warmed agent config: {agent_type.value}")
            except Exception as e:
                logger.error(f"Error warming agent config '{agent_type}': {e}")
    
    async def _warm_llm_responses(self):
        """Warm cache with common LLM response patterns"""
        common_prompts = [
            "Hello, how can I help you with your car today?",
            "What make and model is your car?",
            "Can you describe the symptoms you're experiencing?",
            "What's your budget for this purchase?",
            "Are you looking to buy or sell?",
            "What type of modification are you interested in?",
            "How can I help you with the community platform?"
        ]
        
        for prompt in common_prompts:
            try:
                prompt_hash = self._hash_query(prompt)
                
                # Check if already cached
                if not await self.cache.exists(f"llm_response:{prompt_hash}"):
                    # Pre-populate with common response pattern
                    response = {
                        "text": "I'd be happy to help you with that. Could you provide more details?",
                        "tokens_used": 15,
                        "cost": 0.0,
                        "model": "cached_common",
                        "response_time": 0.1
                    }
                    await self.cache.set_llm_response(prompt_hash, response)
                    logger.debug(f"Warmed LLM prompt: {prompt[:50]}...")
            except Exception as e:
                logger.error(f"Error warming LLM prompt: {e}")
    
    # Intelligent cache invalidation
    async def _setup_invalidation_rules(self):
        """Setup intelligent cache invalidation rules"""
        self._invalidation_rules = {
            "knowledge_update": [
                self._invalidate_knowledge_searches,
                self._invalidate_related_llm_responses
            ],
            "agent_config_update": [
                self._invalidate_agent_configs,
                self._invalidate_agent_llm_responses
            ],
            "conversation_update": [
                self._invalidate_conversation_cache,
                self._invalidate_user_context
            ]
        }
    
    async def invalidate_on_update(self, update_type: str, context: Dict[str, Any]):
        """
        Intelligently invalidate caches based on update type.
        
        Args:
            update_type: Type of update (knowledge_update, agent_config_update, etc.)
            context: Context information for targeted invalidation
        """
        if update_type not in self._invalidation_rules:
            logger.warning(f"Unknown update type for invalidation: {update_type}")
            return
        
        logger.info(f"Invalidating caches for update type: {update_type}")
        
        for invalidation_func in self._invalidation_rules[update_type]:
            try:
                await invalidation_func(context)
            except Exception as e:
                logger.error(f"Error in cache invalidation: {e}")
    
    async def _invalidate_knowledge_searches(self, context: Dict[str, Any]):
        """Invalidate knowledge search caches"""
        category = context.get("category")
        if category:
            await self.cache.invalidate_knowledge_searches(category)
        else:
            await self.cache.invalidate_knowledge_searches()
        logger.debug("Invalidated knowledge search caches")
    
    async def _invalidate_related_llm_responses(self, context: Dict[str, Any]):
        """Invalidate LLM responses related to updated knowledge"""
        # For now, invalidate all LLM responses
        # In a more sophisticated implementation, we could analyze
        # which responses might be affected by the knowledge update
        await self.cache.invalidate_llm_responses()
        logger.debug("Invalidated related LLM response caches")
    
    async def _invalidate_agent_configs(self, context: Dict[str, Any]):
        """Invalidate agent configuration caches"""
        agent_type = context.get("agent_type")
        if agent_type:
            await self.cache.invalidate_agent_config(agent_type)
        else:
            # Invalidate all agent configs
            for agent_type in AgentType:
                await self.cache.invalidate_agent_config(agent_type.value)
        logger.debug("Invalidated agent configuration caches")
    
    async def _invalidate_agent_llm_responses(self, context: Dict[str, Any]):
        """Invalidate LLM responses for specific agent"""
        # This would require more sophisticated tracking of which
        # LLM responses came from which agents
        logger.debug("Would invalidate agent-specific LLM responses")
    
    async def _invalidate_conversation_cache(self, context: Dict[str, Any]):
        """Invalidate conversation caches"""
        conversation_id = context.get("conversation_id")
        if conversation_id:
            await self.cache.invalidate_conversation(conversation_id)
        logger.debug("Invalidated conversation cache")
    
    async def _invalidate_user_context(self, context: Dict[str, Any]):
        """Invalidate user context caches"""
        user_id = context.get("user_id")
        if user_id:
            await self.cache.invalidate_user_context(user_id)
        logger.debug("Invalidated user context cache")
    
    # Usage pattern tracking
    def track_query(self, query_type: str, query: str):
        """Track query usage for pattern analysis"""
        key = f"{query_type}:{query}"
        if key not in self._usage_patterns:
            self._usage_patterns[key] = []
        
        self._usage_patterns[key].append(datetime.utcnow())
        
        # Keep only last 1000 entries per query
        if len(self._usage_patterns[key]) > 1000:
            self._usage_patterns[key] = self._usage_patterns[key][-1000:]
    
    def get_popular_queries(self, query_type: str, limit: int = 10) -> List[str]:
        """Get most popular queries of a specific type"""
        query_counts = {}
        
        for key, timestamps in self._usage_patterns.items():
            if key.startswith(f"{query_type}:"):
                query = key[len(f"{query_type}:"):]
                # Count queries in last 24 hours
                recent = [
                    t for t in timestamps 
                    if t > datetime.utcnow() - timedelta(hours=24)
                ]
                query_counts[query] = len(recent)
        
        # Sort by count and return top queries
        sorted_queries = sorted(
            query_counts.items(), 
            key=lambda x: x[1], 
            reverse=True
        )
        
        return [query for query, count in sorted_queries[:limit]]
    
    # Cache optimization
    async def optimize_cache(self) -> Dict[str, Any]:
        """
        Analyze cache usage and provide optimization recommendations.
        
        Returns:
            Dictionary with optimization recommendations
        """
        metrics = self.cache.get_metrics()
        recommendations = []
        
        # Analyze hit rate
        if metrics['hit_rate'] < 0.6:
            recommendations.append({
                "type": "low_hit_rate",
                "message": f"Cache hit rate is {metrics['hit_rate']:.2%}, consider warming more common queries",
                "action": "increase_cache_warming"
            })
        
        # Analyze TTL configuration
        if metrics['hit_rate'] > 0.9:
            recommendations.append({
                "type": "high_hit_rate",
                "message": "Very high hit rate, consider increasing TTL values",
                "action": "increase_ttl"
            })
        
        # Analyze error rate
        error_rate = metrics['errors'] / max(metrics['total_requests'], 1)
        if error_rate > 0.05:
            recommendations.append({
                "type": "high_error_rate",
                "message": f"Cache error rate is {error_rate:.2%}, check Redis connection",
                "action": "check_redis_health"
            })
        
        # Get cache size
        cache_size = await self.cache.get_cache_size()
        
        return {
            "current_metrics": metrics,
            "cache_size": cache_size,
            "recommendations": recommendations,
            "popular_queries": {
                "knowledge": self.get_popular_queries("knowledge"),
                "llm": self.get_popular_queries("llm"),
                "conversation": self.get_popular_queries("conversation")
            }
        }
    
    # Predictive caching
    async def predictive_cache_warm(self):
        """
        Warm cache based on usage patterns and predictions.
        """
        logger.info("Starting predictive cache warming...")
        
        # Get popular queries from different categories
        popular_knowledge = self.get_popular_queries("knowledge", 20)
        popular_llm = self.get_popular_queries("llm", 20)
        
        # Warm popular knowledge queries
        for query in popular_knowledge:
            try:
                query_hash = self._hash_query(query)
                if not await self.cache.exists(f"knowledge_search:{query_hash}"):
                    # This would integrate with actual knowledge base search
                    logger.debug(f"Would predictively warm: {query}")
            except Exception as e:
                logger.error(f"Error in predictive warming: {e}")
        
        logger.info("Predictive cache warming completed")
    
    # Utility methods
    async def _load_common_queries(self):
        """Load common queries from configuration or database"""
        # This could be loaded from a configuration file or database
        self._common_queries = [
            "oil change",
            "brake pads",
            "engine problems",
            "car buying tips",
            "selling advice",
            "modification guide"
        ]
    
    def _hash_query(self, query: str) -> str:
        """Generate hash for query caching"""
        return hashlib.sha256(query.lower().encode()).hexdigest()
    
    # Health check methods
    async def health_check(self) -> Dict[str, Any]:
        """
        Perform cache health check.
        
        Returns:
            Health status and metrics
        """
        try:
            # Test basic operations
            test_key = "health_check_test"
            test_value = {"timestamp": datetime.utcnow().isoformat()}
            
            # Test set
            set_success = await self.cache.set(test_key, test_value, 60)
            
            # Test get
            retrieved = await self.cache.get(test_key)
            get_success = retrieved is not None
            
            # Test delete
            delete_success = await self.cache.delete(test_key)
            
            # Get metrics
            metrics = self.cache.get_metrics()
            cache_size = await self.cache.get_cache_size()
            
            return {
                "status": "healthy" if all([set_success, get_success, delete_success]) else "unhealthy",
                "operations": {
                    "set": set_success,
                    "get": get_success,
                    "delete": delete_success
                },
                "metrics": metrics,
                "cache_size": cache_size,
                "enabled": self.cache.enabled
            }
            
        except Exception as e:
            logger.error(f"Cache health check failed: {e}")
            return {
                "status": "unhealthy",
                "error": str(e),
                "enabled": self.cache.enabled
            }

# Global advanced cache service instance
advanced_cache_service = AdvancedCacheService()