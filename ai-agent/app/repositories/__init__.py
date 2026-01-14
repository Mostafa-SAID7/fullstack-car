"""
Database repository modules for AI Agent data access.

This package contains:
- BaseRepository: Common CRUD operations
- ConversationRepository: Conversation management
- MessageRepository: Message management
- FeedbackRepository: User feedback storage
- AnalyticsRepository: Metrics and analytics
- KnowledgeMetadataRepository: Knowledge base metadata
"""

from app.repositories.base_repository import BaseRepository
from app.repositories.conversation_repository import ConversationRepository, MessageRepository
from app.repositories.feedback_repository import FeedbackRepository
from app.repositories.analytics_repository import AnalyticsRepository
from app.repositories.knowledge_repository import KnowledgeMetadataRepository

__all__ = [
    'BaseRepository',
    'ConversationRepository',
    'MessageRepository',
    'FeedbackRepository',
    'AnalyticsRepository',
    'KnowledgeMetadataRepository'
]
