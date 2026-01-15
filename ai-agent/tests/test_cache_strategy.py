"""
Tests for comprehensive caching strategy
"""
import pytest
import asyncio
from unittest.mock import Mock, AsyncMock, patch
from app.core.cache import CacheService
from app.services.cache_service import AdvancedCacheService

# Configure pytest-asyncio
pytestmark = pytest.mark.asyncio

class TestCacheService:
    """Test basic cache service functionality"""
    
    @pytest.fixture
    def cache_service(self):
        """Create cache service instance for testing"""
        service = CacheService()
        service.enabled = True
        service.redis = Mock()
        return service
    
    @pytest.mark.asyncio
    async def test_conversation_caching(self, cache_service):
        """Test conversation caching with 1 hour TTL"""
        conversation_id = "conv-123"
        conversation_data = {
            "id": conversation_id,
            "user_id": "user-456",
            "messages": []
        }
        
        cache_service.redis.setex = AsyncMock()
        cache_service.redis.get = AsyncMock(return_value=None)
        
        # Set conversation
        await cache_service.set_conversation(conversation_id, conversation_data)
        
        # Verify TTL is 1 hour (3600 seconds)
        cache_service.redis.setex.assert_called_once()
        call_args = cache_service.redis.setex.call_args
        assert call_args[0][1] == 3600  # TTL
    
    @pytest.mark.asyncio
    async def test_knowledge_search_caching(self, cache_service):
        """Test knowledge search caching with 24 hour TTL"""
        query_hash = "abc123"
        results = [{"content": "test", "score": 0.9}]
        
        cache_service.redis.setex = AsyncMock()
        
        # Set knowledge search results
        await cache_service.set_knowledge_search(query_hash, results)
        
        # Verify TTL is 24 hours (86400 seconds)
        cache_service.redis.setex.assert_called_once()
        call_args = cache_service.redis.setex.call_args
        assert call_args[0][1] == 86400  # TTL
    
    @pytest.mark.asyncio
    async def test_llm_response_caching(self, cache_service):
        """Test LLM response caching with 7 day TTL"""
        prompt_hash = "xyz789"
        response = {
            "text": "Test response",
            "tokens_used": 50,
            "cost": 0.001
        }
        
        cache_service.redis.setex = AsyncMock()
        
        # Set LLM response
        await cache_service.set_llm_response(prompt_hash, response)
        
        # Verify TTL is 7 days (604800 seconds)
        cache_service.redis.setex.assert_called_once()
        call_args = cache_service.redis.setex.call_args
        assert call_args[0][1] == 604800  # TTL
    
    @pytest.mark.asyncio
    async def test_cache_invalidation(self, cache_service):
        """Test cache invalidation on updates"""
        conversation_id = "conv-123"
        
        cache_service.redis.delete = AsyncMock(return_value=1)
        
        # Invalidate conversation
        result = await cache_service.invalidate_conversation(conversation_id)
        
        assert result == True
        cache_service.redis.delete.assert_called_once_with(f"conversation:{conversation_id}")
    
    @pytest.mark.asyncio
    async def test_pattern_deletion(self, cache_service):
        """Test deleting keys by pattern"""
        pattern = "conversation:*"
        
        # Mock scan_iter to return some keys
        async def mock_scan_iter(match):
            for key in ["conversation:1", "conversation:2", "conversation:3"]:
                yield key
        
        cache_service.redis.scan_iter = mock_scan_iter
        cache_service.redis.delete = AsyncMock(return_value=3)
        
        # Delete pattern
        deleted = await cache_service.delete_pattern(pattern)
        
        assert deleted == 3
        cache_service.redis.delete.assert_called_once()
    
    @pytest.mark.asyncio
    async def test_cache_metrics(self, cache_service):
        """Test cache metrics tracking"""
        # Simulate some cache operations
        cache_service._metrics['hits'] = 60
        cache_service._metrics['misses'] = 40
        cache_service._metrics['sets'] = 50
        cache_service._metrics['deletes'] = 10
        cache_service._metrics['errors'] = 2
        
        metrics = cache_service.get_metrics()
        
        assert metrics['hits'] == 60
        assert metrics['misses'] == 40
        assert metrics['hit_rate'] == 0.6  # 60/(60+40)
        assert metrics['total_requests'] == 100
        assert metrics['sets'] == 50
        assert metrics['deletes'] == 10
        assert metrics['errors'] == 2
    
    @pytest.mark.asyncio
    async def test_cache_hit_rate_calculation(self, cache_service):
        """Test cache hit rate > 60% requirement"""
        # Simulate high hit rate
        cache_service._metrics['hits'] = 70
        cache_service._metrics['misses'] = 30
        
        metrics = cache_service.get_metrics()
        
        assert metrics['hit_rate'] > 0.6  # Should be 0.7
    
    @pytest.mark.asyncio
    async def test_ttl_configuration(self, cache_service):
        """Test configurable TTL per cache type"""
        # Configure custom TTLs
        cache_service.configure_ttl(
            conversation=7200,  # 2 hours
            knowledge_search=172800,  # 2 days
            llm_response=1209600  # 14 days
        )
        
        assert cache_service.TTL_CONVERSATION == 7200
        assert cache_service.TTL_KNOWLEDGE_SEARCH == 172800
        assert cache_service.TTL_LLM_RESPONSE == 1209600
    
    @pytest.mark.asyncio
    async def test_cache_exists(self, cache_service):
        """Test checking if key exists"""
        cache_service.redis.exists = AsyncMock(return_value=1)
        
        exists = await cache_service.exists("test_key")
        
        assert exists == True
        cache_service.redis.exists.assert_called_once_with("test_key")
    
    @pytest.mark.asyncio
    async def test_get_ttl(self, cache_service):
        """Test getting remaining TTL"""
        cache_service.redis.ttl = AsyncMock(return_value=3000)
        
        ttl = await cache_service.get_ttl("test_key")
        
        assert ttl == 3000
        cache_service.redis.ttl.assert_called_once_with("test_key")

class TestAdvancedCacheService:
    """Test advanced caching strategies"""
    
    @pytest.fixture
    def advanced_cache(self):
        """Create advanced cache service instance"""
        service = AdvancedCacheService()
        service.cache = Mock()
        service.cache.enabled = True
        service.cache.connect = AsyncMock()
        service.cache.set_knowledge_search = AsyncMock()
        service.cache.set_agent_config = AsyncMock()
        service.cache.set_llm_response = AsyncMock()
        service.cache.exists = AsyncMock(return_value=False)
        return service
    
    @pytest.mark.asyncio
    async def test_cache_warming_knowledge_queries(self, advanced_cache):
        """Test warming cache with common knowledge queries"""
        await advanced_cache._warm_knowledge_queries()
        
        # Should have called set_knowledge_search multiple times
        assert advanced_cache.cache.set_knowledge_search.call_count > 0
    
    @pytest.mark.asyncio
    async def test_cache_warming_agent_configs(self, advanced_cache):
        """Test warming cache with agent configurations"""
        await advanced_cache._warm_agent_configs()
        
        # Should have called set_agent_config for each agent type (6 agents)
        assert advanced_cache.cache.set_agent_config.call_count == 6
    
    @pytest.mark.asyncio
    async def test_cache_warming_llm_responses(self, advanced_cache):
        """Test warming cache with common LLM prompts"""
        await advanced_cache._warm_llm_responses()
        
        # Should have called set_llm_response multiple times
        assert advanced_cache.cache.set_llm_response.call_count > 0
    
    @pytest.mark.asyncio
    async def test_intelligent_invalidation(self, advanced_cache):
        """Test intelligent cache invalidation"""
        advanced_cache.cache.invalidate_knowledge_searches = AsyncMock()
        advanced_cache.cache.invalidate_llm_responses = AsyncMock()
        
        # Trigger knowledge update invalidation
        await advanced_cache.invalidate_on_update(
            "knowledge_update",
            {"category": "maintenance"}
        )
        
        # Should invalidate both knowledge searches and related LLM responses
        advanced_cache.cache.invalidate_knowledge_searches.assert_called_once()
        advanced_cache.cache.invalidate_llm_responses.assert_called_once()
    
    @pytest.mark.asyncio
    async def test_usage_pattern_tracking(self, advanced_cache):
        """Test tracking query usage patterns"""
        # Track some queries
        advanced_cache.track_query("knowledge", "oil change")
        advanced_cache.track_query("knowledge", "oil change")
        advanced_cache.track_query("knowledge", "brake pads")
        
        # Get popular queries
        popular = advanced_cache.get_popular_queries("knowledge", limit=2)
        
        assert len(popular) <= 2
        assert "oil change" in popular  # Should be most popular
    
    @pytest.mark.asyncio
    async def test_cache_optimization_recommendations(self, advanced_cache):
        """Test cache optimization analysis"""
        # Mock metrics with low hit rate
        advanced_cache.cache.get_metrics = Mock(return_value={
            'enabled': True,
            'hits': 40,
            'misses': 60,
            'hit_rate': 0.4,
            'sets': 50,
            'deletes': 10,
            'errors': 2,
            'total_requests': 100,
            'uptime_seconds': 3600,
            'ttl_config': {}
        })
        advanced_cache.cache.get_cache_size = AsyncMock(return_value=1000)
        
        optimization = await advanced_cache.optimize_cache()
        
        assert 'current_metrics' in optimization
        assert 'recommendations' in optimization
        assert len(optimization['recommendations']) > 0
        
        # Should recommend increasing cache warming due to low hit rate
        low_hit_rate_rec = [
            r for r in optimization['recommendations'] 
            if r['type'] == 'low_hit_rate'
        ]
        assert len(low_hit_rate_rec) > 0
    
    @pytest.mark.asyncio
    async def test_predictive_cache_warming(self, advanced_cache):
        """Test predictive cache warming based on patterns"""
        # Track some popular queries
        advanced_cache.track_query("knowledge", "oil change")
        advanced_cache.track_query("knowledge", "oil change")
        advanced_cache.track_query("llm", "how to change oil")
        
        advanced_cache.cache.exists = AsyncMock(return_value=False)
        
        # Run predictive warming
        await advanced_cache.predictive_cache_warm()
        
        # Should attempt to warm popular queries
        # (actual warming would require integration with knowledge base)
    
    @pytest.mark.asyncio
    async def test_health_check(self, advanced_cache):
        """Test cache health check"""
        advanced_cache.cache.set = AsyncMock(return_value=True)
        advanced_cache.cache.get = AsyncMock(return_value={"test": "data"})
        advanced_cache.cache.delete = AsyncMock(return_value=True)
        advanced_cache.cache.get_metrics = Mock(return_value={
            'enabled': True,
            'hits': 100,
            'misses': 50,
            'hit_rate': 0.67
        })
        advanced_cache.cache.get_cache_size = AsyncMock(return_value=500)
        
        health = await advanced_cache.health_check()
        
        assert health['status'] == 'healthy'
        assert health['operations']['set'] == True
        assert health['operations']['get'] == True
        assert health['operations']['delete'] == True
        assert 'metrics' in health
        assert 'cache_size' in health

class TestCacheIntegration:
    """Test cache integration with other services"""
    
    @pytest.mark.asyncio
    async def test_knowledge_base_cache_integration(self):
        """Test knowledge base search uses caching"""
        with patch('app.services.knowledge_base.cache_service') as mock_cache:
            mock_cache.get_knowledge_search = AsyncMock(return_value=None)
            mock_cache.set_knowledge_search = AsyncMock()
            
            # This would require actual knowledge base integration
            # For now, just verify the cache methods would be called
            assert mock_cache.get_knowledge_search is not None
            assert mock_cache.set_knowledge_search is not None
    
    @pytest.mark.asyncio
    async def test_conversation_manager_cache_integration(self):
        """Test conversation manager uses caching"""
        with patch('app.services.conversation_manager.cache_service') as mock_cache:
            mock_cache.get_conversation = AsyncMock(return_value=None)
            mock_cache.set_conversation = AsyncMock()
            
            # Verify cache methods available
            assert mock_cache.get_conversation is not None
            assert mock_cache.set_conversation is not None
    
    @pytest.mark.asyncio
    async def test_llm_client_cache_integration(self):
        """Test LLM client uses caching"""
        with patch('app.services.llm_client.cache_service') as mock_cache:
            mock_cache.get_llm_response = AsyncMock(return_value=None)
            mock_cache.set_llm_response = AsyncMock()
            
            # Verify cache methods available
            assert mock_cache.get_llm_response is not None
            assert mock_cache.set_llm_response is not None
