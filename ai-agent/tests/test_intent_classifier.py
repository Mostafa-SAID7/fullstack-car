"""
Unit tests for IntentClassifier.
"""
import pytest
from unittest.mock import Mock, AsyncMock, patch
from app.services.intent_classifier import IntentClassifier, Intent
from app.models.schemas import ConversationContext, Message


class TestIntentClassifier:
    """Test cases for IntentClassifier"""
    
    @pytest.fixture
    def classifier(self, mock_llm_client):
        """Create IntentClassifier instance for testing"""
        with patch('app.services.intent_classifier.LLMClient', return_value=mock_llm_client):
            return IntentClassifier()
    
    @pytest.mark.asyncio
    async def test_classify_maintenance_intent(self, classifier, sample_conversation_context):
        """Test classification of maintenance-related messages"""
        test_cases = [
            "My car is making a strange noise",
            "When should I change my oil?",
            "My engine is overheating",
            "Check engine light is on",
            "My brakes are squeaking"
        ]
        
        for message in test_cases:
            intent = await classifier.classify(message, sample_conversation_context)
            
            assert intent.intent_type == 'maintenance'
            assert intent.confidence > 0.8
            assert intent.agent_type == 'mechanic'
    
    @pytest.mark.asyncio
    async def test_classify_buying_intent(self, classifier, sample_conversation_context):
        """Test classification of buying-related messages"""
        test_cases = [
            "I want to buy a used BMW",
            "Show me cars under $20,000",
            "Looking for a family SUV",
            "What's a good first car?",
            "Help me find a reliable sedan"
        ]
        
        for message in test_cases:
            intent = await classifier.classify(message, sample_conversation_context)
            
            assert intent.intent_type == 'buying'
            assert intent.confidence > 0.8
            assert intent.agent_type == 'buyer_guide'
    
    @pytest.mark.asyncio
    async def test_classify_selling_intent(self, classifier, sample_conversation_context):
        """Test classification of selling-related messages"""
        test_cases = [
            "How do I sell my car?",
            "What's my car worth?",
            "Help me list my vehicle",
            "Best way to sell quickly",
            "How to price my car for sale"
        ]
        
        for message in test_cases:
            intent = await classifier.classify(message, sample_conversation_context)
            
            assert intent.intent_type == 'selling'
            assert intent.confidence > 0.8
            assert intent.agent_type == 'seller_assistant'
    
    @pytest.mark.asyncio
    async def test_classify_modification_intent(self, classifier, sample_conversation_context):
        """Test classification of modification-related messages"""
        test_cases = [
            "Can I install a turbo?",
            "Best exhaust system for my car",
            "How to upgrade my suspension",
            "Performance chip installation",
            "Custom wheels compatibility"
        ]
        
        for message in test_cases:
            intent = await classifier.classify(message, sample_conversation_context)
            
            assert intent.intent_type == 'modification'
            assert intent.confidence > 0.8
            assert intent.agent_type == 'modification_expert'
    
    @pytest.mark.asyncio
    async def test_classify_community_intent(self, classifier, sample_conversation_context):
        """Test classification of community-related messages"""
        test_cases = [
            "How do I join a car group?",
            "Find car meets near me",
            "How to post in the forum?",
            "Connect with other enthusiasts",
            "Car club recommendations"
        ]
        
        for message in test_cases:
            intent = await classifier.classify(message, sample_conversation_context)
            
            assert intent.intent_type == 'community'
            assert intent.confidence > 0.8
            assert intent.agent_type == 'community_helper'
    
    @pytest.mark.asyncio
    async def test_classify_general_intent(self, classifier, sample_conversation_context):
        """Test classification of general messages"""
        test_cases = [
            "Hello",
            "Thank you",
            "What can you help me with?",
            "Tell me about yourself",
            "How does this work?"
        ]
        
        for message in test_cases:
            intent = await classifier.classify(message, sample_conversation_context)
            
            assert intent.intent_type == 'general'
            assert intent.agent_type == 'general'
    
    @pytest.mark.asyncio
    async def test_keyword_based_classification(self, classifier, sample_conversation_context):
        """Test keyword-based classification (fast path)"""
        # Messages with clear keywords should use keyword classification
        message = "oil change maintenance schedule"
        
        intent = await classifier.classify(message, sample_conversation_context)
        
        assert intent.intent_type == 'maintenance'
        assert intent.confidence > 0.7
    
    @pytest.mark.asyncio
    async def test_context_aware_classification(self, classifier):
        """Test classification uses conversation context"""
        # Create context with previous maintenance discussion
        context = ConversationContext(
            conversation_id="test-123",
            user_id="user-456",
            messages=[
                Message(
                    id="msg-1",
                    conversation_id="test-123",
                    role="user",
                    content="My car is making noise"
                ),
                Message(
                    id="msg-2",
                    conversation_id="test-123",
                    role="assistant",
                    content="Let me help diagnose that",
                    agent_type="mechanic"
                )
            ]
        )
        
        # Follow-up message should maintain maintenance context
        message = "It happens when I brake"
        intent = await classifier.classify(message, context)
        
        assert intent.intent_type == 'maintenance'
    
    @pytest.mark.asyncio
    async def test_classification_accuracy(self, classifier, sample_conversation_context):
        """Test overall classification accuracy > 90%"""
        test_dataset = [
            ("My engine won't start", "maintenance"),
            ("I want to buy a car", "buying"),
            ("How to sell my vehicle", "selling"),
            ("Install turbo kit", "modification"),
            ("Join car club", "community"),
            ("Hello there", "general"),
            ("Oil change needed", "maintenance"),
            ("Looking for SUV", "buying"),
            ("List my car", "selling"),
            ("Upgrade exhaust", "modification"),
            ("Find car meets", "community"),
            ("Thank you", "general")
        ]
        
        correct = 0
        total = len(test_dataset)
        
        for message, expected_intent in test_dataset:
            intent = await classifier.classify(message, sample_conversation_context)
            if intent.intent_type == expected_intent:
                correct += 1
        
        accuracy = (correct / total) * 100
        assert accuracy >= 90, f"Accuracy {accuracy}% is below 90% threshold"
    
    @pytest.mark.asyncio
    async def test_confidence_scoring(self, classifier, sample_conversation_context):
        """Test confidence scores are reasonable"""
        # Clear intent should have high confidence
        clear_message = "My car needs an oil change"
        clear_intent = await classifier.classify(clear_message, sample_conversation_context)
        assert clear_intent.confidence > 0.8
        
        # Ambiguous message should have lower confidence
        ambiguous_message = "I need help"
        ambiguous_intent = await classifier.classify(ambiguous_message, sample_conversation_context)
        assert ambiguous_intent.confidence < 0.8
    
    @pytest.mark.asyncio
    async def test_intent_history_tracking(self, classifier, sample_conversation_context):
        """Test intent history is tracked"""
        messages = [
            "My car won't start",
            "I want to buy a BMW",
            "How do I sell my car?"
        ]
        
        for message in messages:
            await classifier.classify(message, sample_conversation_context)
        
        # Check history is tracked (implementation dependent)
        assert hasattr(classifier, 'history') or hasattr(classifier, 'get_statistics')
    
    @pytest.mark.asyncio
    async def test_statistics(self, classifier, sample_conversation_context):
        """Test classification statistics"""
        messages = [
            "Oil change",
            "Buy car",
            "Sell vehicle",
            "Install turbo",
            "Join group"
        ]
        
        for message in messages:
            await classifier.classify(message, sample_conversation_context)
        
        stats = classifier.get_statistics()
        
        assert 'total_classifications' in stats
        assert stats['total_classifications'] >= 5
        assert 'intent_distribution' in stats
    
    @pytest.mark.asyncio
    async def test_error_handling(self, classifier, sample_conversation_context):
        """Test error handling with invalid input"""
        # Empty message
        intent = await classifier.classify("", sample_conversation_context)
        assert intent.intent_type == 'general'
        
        # Very long message
        long_message = "test " * 1000
        intent = await classifier.classify(long_message, sample_conversation_context)
        assert intent is not None
    
    @pytest.mark.asyncio
    async def test_llm_fallback(self, classifier, sample_conversation_context):
        """Test LLM fallback for complex cases"""
        # Complex message that requires LLM
        complex_message = "I'm thinking about either fixing my current car or buying a new one, what do you think?"
        
        intent = await classifier.classify(complex_message, sample_conversation_context)
        
        assert intent is not None
        assert intent.intent_type in ['maintenance', 'buying', 'general']
