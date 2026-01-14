"""
Pytest configuration and fixtures for AI Agent tests.
"""
import pytest
import asyncio
from unittest.mock import Mock, AsyncMock
from app.models.schemas import (
    ConversationContext, Message, AgentType, 
    KnowledgeCategory, FeedbackType
)


@pytest.fixture
def sample_conversation_context():
    """Sample conversation context for testing"""
    return ConversationContext(
        conversation_id="test-conv-123",
        user_id="test-user-456",
        messages=[
            Message(
                id="msg-1",
                conversation_id="test-conv-123",
                role="user",
                content="My car is making a strange noise"
            ),
            Message(
                id="msg-2",
                conversation_id="test-conv-123",
                role="assistant",
                content="I can help diagnose that. What kind of noise is it?",
                agent_type=AgentType.MECHANIC
            )
        ],
        metadata={"car_make": "Toyota", "car_model": "Camry", "car_year": 2020}
    )


@pytest.fixture
def sample_messages():
    """Sample messages for testing"""
    return [
        "My car won't start",
        "I want to buy a used BMW",
        "How do I sell my car quickly?",
        "Can I install a turbo on my Honda?",
        "How do I join a car group?",
        "What's the best oil for my engine?"
    ]


@pytest.fixture
def mock_llm_client():
    """Mock LLM client for testing"""
    client = Mock()
    client.generate = AsyncMock(return_value={
        'text': 'This is a test response from the LLM',
        'tokens_used': 50,
        'cost': 0.001,
        'model': 'test-model',
        'response_time': 0.5
    })
    return client


@pytest.fixture
def mock_knowledge_base():
    """Mock knowledge base for testing"""
    kb = Mock()
    kb.search = AsyncMock(return_value=[
        {
            'content': 'Regular oil changes are important for engine health',
            'category': KnowledgeCategory.MAINTENANCE,
            'similarity': 0.85
        }
    ])
    return kb


@pytest.fixture
def mock_conversation_manager():
    """Mock conversation manager for testing"""
    manager = Mock()
    manager.create_conversation = AsyncMock(return_value="conv-123")
    manager.add_message = AsyncMock()
    manager.get_conversation = AsyncMock(return_value={
        'id': 'conv-123',
        'messages': []
    })
    return manager


@pytest.fixture
def mock_feedback_repository():
    """Mock feedback repository for testing"""
    repo = Mock()
    repo.save = AsyncMock(return_value=True)
    repo.get_by_conversation = AsyncMock(return_value=[])
    return repo


@pytest.fixture
def event_loop():
    """Create event loop for async tests"""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()
