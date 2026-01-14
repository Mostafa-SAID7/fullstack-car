"""
Unit tests for AgentRouter.
"""
import pytest
from unittest.mock import Mock, AsyncMock, patch
from app.services.agent_router import AgentRouter
from app.models.schemas import AgentType, ConversationContext, Message


class TestAgentRouter:
    """Test cases for AgentRouter"""
    
    @pytest.fixture
    def router(self, mock_llm_client, mock_knowledge_base):
        """Create AgentRouter instance for testing"""
        with patch('app.services.agent_router.LLMClient', return_value=mock_llm_client):
            with patch('app.services.agent_router.KnowledgeBase', return_value=mock_knowledge_base):
                return AgentRouter()
    
    @pytest.mark.asyncio
    async def test_route_maintenance_message(self, router, sample_conversation_context):
        """Test routing maintenance-related messages to Mechanic agent"""
        message = "My car is making a strange noise when I brake"
        
        response = await router.route_message(message, sample_conversation_context)
        
        assert response is not None
        assert response.agent == AgentType.MECHANIC
        assert response.confidence > 0.7
        assert len(response.text) > 0
    
    @pytest.mark.asyncio
    async def test_route_buying_message(self, router, sample_conversation_context):
        """Test routing buying-related messages to Buyer's Guide agent"""
        message = "I want to buy a used BMW 3 Series under $20,000"
        
        response = await router.route_message(message, sample_conversation_context)
        
        assert response is not None
        assert response.agent == AgentType.BUYER_GUIDE
        assert response.confidence > 0.7
    
    @pytest.mark.asyncio
    async def test_route_selling_message(self, router, sample_conversation_context):
        """Test routing selling-related messages to Seller's Assistant agent"""
        message = "How do I sell my car quickly and get the best price?"
        
        response = await router.route_message(message, sample_conversation_context)
        
        assert response is not None
        assert response.agent == AgentType.SELLER_ASSISTANT
        assert response.confidence > 0.7
    
    @pytest.mark.asyncio
    async def test_route_modification_message(self, router, sample_conversation_context):
        """Test routing modification-related messages to Modification Expert agent"""
        message = "Can I install a turbo on my Honda Civic?"
        
        response = await router.route_message(message, sample_conversation_context)
        
        assert response is not None
        assert response.agent == AgentType.MODIFICATION_EXPERT
        assert response.confidence > 0.7
    
    @pytest.mark.asyncio
    async def test_route_community_message(self, router, sample_conversation_context):
        """Test routing community-related messages to Community Helper agent"""
        message = "How do I join a car enthusiast group in my area?"
        
        response = await router.route_message(message, sample_conversation_context)
        
        assert response is not None
        assert response.agent == AgentType.COMMUNITY_HELPER
        assert response.confidence > 0.7
    
    @pytest.mark.asyncio
    async def test_route_general_message(self, router, sample_conversation_context):
        """Test routing general messages to General agent"""
        message = "Hello, how are you?"
        
        response = await router.route_message(message, sample_conversation_context)
        
        assert response is not None
        assert response.agent == AgentType.GENERAL
    
    @pytest.mark.asyncio
    async def test_explicit_mode_selection(self, router, sample_conversation_context):
        """Test explicit agent mode selection overrides intent detection"""
        message = "Tell me about maintenance"
        
        # Explicitly select Buyer's Guide agent
        response = await router.route_message(
            message, 
            sample_conversation_context,
            agent_mode=AgentType.BUYER_GUIDE
        )
        
        assert response is not None
        assert response.agent == AgentType.BUYER_GUIDE
    
    @pytest.mark.asyncio
    async def test_routing_with_empty_context(self, router):
        """Test routing with minimal context"""
        message = "My engine is overheating"
        context = ConversationContext(
            conversation_id="test-123",
            user_id="user-456",
            messages=[]
        )
        
        response = await router.route_message(message, context)
        
        assert response is not None
        assert response.agent == AgentType.MECHANIC
    
    @pytest.mark.asyncio
    async def test_all_agents_initialized(self, router):
        """Test that all 6 specialized agents are initialized"""
        assert len(router.agents) == 6
        assert AgentType.GENERAL in router.agents
        assert AgentType.MECHANIC in router.agents
        assert AgentType.BUYER_GUIDE in router.agents
        assert AgentType.SELLER_ASSISTANT in router.agents
        assert AgentType.MODIFICATION_EXPERT in router.agents
        assert AgentType.COMMUNITY_HELPER in router.agents
    
    @pytest.mark.asyncio
    async def test_routing_statistics(self, router, sample_conversation_context):
        """Test routing statistics tracking"""
        messages = [
            "My car won't start",
            "I want to buy a BMW",
            "How do I sell my car?"
        ]
        
        for message in messages:
            await router.route_message(message, sample_conversation_context)
        
        stats = router.get_statistics()
        
        assert stats['total_routes'] >= 3
        assert 'agent_distribution' in stats
        assert 'average_confidence' in stats
    
    @pytest.mark.asyncio
    async def test_error_handling(self, router, sample_conversation_context):
        """Test error handling when agent fails"""
        # Simulate agent failure
        with patch.object(router.agents[AgentType.MECHANIC], 'process', side_effect=Exception("Test error")):
            message = "My car is broken"
            
            response = await router.route_message(message, sample_conversation_context)
            
            # Should fallback to general agent
            assert response is not None
            assert response.agent == AgentType.GENERAL
    
    @pytest.mark.asyncio
    async def test_response_metadata(self, router, sample_conversation_context):
        """Test that response includes proper metadata"""
        message = "Check my oil level"
        
        response = await router.route_message(message, sample_conversation_context)
        
        assert response.metadata is not None
        assert 'tokens_used' in response.metadata
        assert 'cost' in response.metadata
        assert 'model' in response.metadata
        assert 'response_time' in response.metadata
    
    @pytest.mark.asyncio
    async def test_quick_actions_generated(self, router, sample_conversation_context):
        """Test that quick actions are generated in response"""
        message = "I need help with my car"
        
        response = await router.route_message(message, sample_conversation_context)
        
        assert response.quick_actions is not None
        assert len(response.quick_actions) > 0
        assert all(hasattr(action, 'label') for action in response.quick_actions)
        assert all(hasattr(action, 'action') for action in response.quick_actions)
