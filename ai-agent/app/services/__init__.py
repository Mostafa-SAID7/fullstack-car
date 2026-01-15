"""
Service modules for AI Agent business logic.

This package contains:
- KnowledgeBase: Vector-based knowledge storage and retrieval
- EmbeddingService: Text embedding generation
- IntentClassifier: Intent classification for agent routing
- AgentRouter: Routes messages to appropriate agents
- ConversationManager: Manages conversation state and persistence
- LearningSystem: Continuous learning from user feedback
- InventoryService: Vehicle inventory search
- CommunityService: Community integration (groups, events, QA, posts, members)
- ScraperService: Web scraping for car news
- CarImageService: Car image analysis

Note: Services are imported lazily to avoid circular dependencies and heavy loading.
"""

# Lazy imports - only import when accessed
def __getattr__(name):
    """Lazy import services to avoid heavy loading at module level"""
    if name == 'KnowledgeBase':
        from app.services.knowledge_base import KnowledgeBase
        return KnowledgeBase
    elif name == 'EmbeddingService':
        from app.services.embedding_service import EmbeddingService
        return EmbeddingService
    elif name == 'IntentClassifier':
        from app.services.intent_classifier import IntentClassifier
        return IntentClassifier
    elif name == 'Intent':
        from app.services.intent_classifier import Intent
        return Intent
    elif name == 'AgentRouter':
        from app.services.agent_router import AgentRouter
        return AgentRouter
    elif name == 'ConversationManager':
        from app.services.conversation_manager import ConversationManager
        return ConversationManager
    elif name == 'LearningSystem':
        from app.services.learning_system import LearningSystem
        return LearningSystem
    elif name == 'LearningReport':
        from app.services.learning_system import LearningReport
        return LearningReport
    elif name == 'CommunityService':
        from app.services.community_service import CommunityService
        return CommunityService
    raise AttributeError(f"module '{__name__}' has no attribute '{name}'")

__all__ = [
    'KnowledgeBase',
    'EmbeddingService',
    'IntentClassifier',
    'Intent',
    'AgentRouter',
    'ConversationManager',
    'LearningSystem',
    'LearningReport',
    'CommunityService'
]
