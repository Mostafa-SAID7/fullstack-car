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
"""

from app.services.knowledge_base import KnowledgeBase
from app.services.embedding_service import EmbeddingService
from app.services.intent_classifier import IntentClassifier, Intent
from app.services.agent_router import AgentRouter
from app.services.conversation_manager import ConversationManager
from app.services.learning_system import LearningSystem, LearningReport
from app.services.community_service import CommunityService

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
