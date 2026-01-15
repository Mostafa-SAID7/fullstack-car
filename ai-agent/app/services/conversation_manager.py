"""
Conversation Manager - Manages conversation state, history, and persistence.
"""
import uuid
import logging
from typing import Optional, List, Dict, Any
from datetime import datetime

from app.models.schemas import (
    Conversation as ConversationSchema,
    Message as MessageSchema,
    ConversationContext
)
from app.models.db_models import Conversation, Message
from app.repositories.conversation_repository import (
    ConversationRepository,
    MessageRepository
)
from app.core.cache import cache_service
from app.core.database import get_db

logger = logging.getLogger(__name__)


class ConversationManager:
    """
    Manages conversation state and persistence.

    Features:
    - Create and manage conversations
    - Add and retrieve messages
    - Build conversation context
    - Cache conversation data
    - Search and archive conversations
    """

    def __init__(self):
        """Initialize conversation manager without db session"""
        logger.info("ConversationManager initialized")

    async def create_conversation(
        self,
        user_id: str,
        title: Optional[str] = None
    ) -> ConversationSchema:
        """
        Create a new conversation.

        Args:
            user_id: User ID
            title: Optional conversation title

        Returns:
            Created Conversation object
        """
        conversation_id = str(uuid.uuid4())

        # Create SQLAlchemy model
        conversation = Conversation(
            id=conversation_id,
            user_id=user_id,
            title=title or "New Conversation",
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow(),
            metadata_={},
            is_active=True
        )

        # Save to database
        db = next(get_db())
        try:
            conversation_repo = ConversationRepository(db)
            conversation_repo.create(conversation)
            logger.info(
                "Created conversation %s for user %s",
                conversation_id,
                user_id
            )

            # Convert to schema for return
            conversation_schema = ConversationSchema(
                id=conversation.id,
                user_id=conversation.user_id,
                title=conversation.title,
                messages=[],
                created_at=conversation.created_at,
                updated_at=conversation.updated_at,
                metadata=conversation.metadata_ or {},
                is_active=conversation.is_active
            )

            # Cache the conversation
            await self._cache_conversation(conversation_schema)

            return conversation_schema
        finally:
            db.close()

    async def add_message(
        self,
        conversation_id: str,
        role: str,
        content: str,
        agent_type: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None
    ) -> None:
        """
        Add message to conversation.

        Args:
            conversation_id: Conversation ID
            role: Message role ('user', 'assistant', 'system')
            content: Message content
            agent_type: Optional agent type that generated the message
            metadata: Optional message metadata
        """
        message_id = str(uuid.uuid4())
        
        # Create SQLAlchemy model
        message = Message(
            id=message_id,
            conversation_id=conversation_id,
            role=role,
            content=content,
            agent_type=agent_type,
            metadata_=metadata or {},
            timestamp=datetime.utcnow()
        )

        db = next(get_db())
        try:
            message_repo = MessageRepository(db)
            conversation_repo = ConversationRepository(db)

            # Save message to database
            message_repo.create(message)
            logger.info(
                "Added message %s to conversation %s",
                message.id,
                conversation_id
            )

            # Update conversation timestamp
            conversation_repo.update_timestamp(conversation_id)

            # Invalidate cache (will be refreshed on next get)
            await self._invalidate_cache(conversation_id)

        finally:
            db.close()

    async def get_conversation(
        self,
        conversation_id: str,
        include_messages: bool = True
    ) -> Optional[ConversationSchema]:
        """
        Get conversation with messages.

        Args:
            conversation_id: Conversation ID
            include_messages: Whether to include messages

        Returns:
            Conversation object or None if not found
        """
        # Try cache first
        cached = await self._get_cached_conversation(conversation_id)
        if cached:
            logger.info(
                "Retrieved conversation %s from cache",
                conversation_id
            )
            return cached

        # Load from database
        db = next(get_db())
        try:
            conversation_repo = ConversationRepository(db)
            conversation = conversation_repo.get_by_id(conversation_id)
            if not conversation:
                logger.warning("Conversation %s not found", conversation_id)
                return None

            messages_list = []
            if include_messages:
                # Load messages
                message_repo = MessageRepository(db)
                db_messages = message_repo.get_by_conversation(conversation_id)
                messages_list = [
                    MessageSchema(
                        id=msg.id,
                        conversation_id=msg.conversation_id,
                        role=msg.role,
                        content=msg.content,
                        agent_type=msg.agent_type,
                        metadata=msg.metadata_ or {},
                        timestamp=msg.timestamp
                    )
                    for msg in db_messages
                ]

            # Convert to schema
            conversation_schema = ConversationSchema(
                id=conversation.id,
                user_id=conversation.user_id,
                title=conversation.title,
                messages=messages_list,
                created_at=conversation.created_at,
                updated_at=conversation.updated_at,
                metadata=conversation.metadata_ or {},
                is_active=conversation.is_active
            )

            # Cache for future requests
            await self._cache_conversation(conversation_schema)

            logger.info(
                "Retrieved conversation %s from database",
                conversation_id
            )
            return conversation_schema

        finally:
            db.close()

    async def get_context(
        self,
        conversation_id: str,
        message_limit: int = 5
    ) -> ConversationContext:
        """
        Build conversation context for agent processing.

        Args:
            conversation_id: Conversation ID
            message_limit: Number of recent messages to include

        Returns:
            ConversationContext object
        """
        conversation = await self.get_conversation(conversation_id)

        if not conversation:
            # Return empty context for new conversations
            return ConversationContext(
                conversation_id=conversation_id,
                user_id="unknown",
                messages=[],
                metadata={}
            )

        # Get recent messages
        recent_messages = (
            conversation.messages[-message_limit:]
            if conversation.messages else []
        )

        return ConversationContext(
            conversation_id=conversation_id,
            user_id=conversation.user_id,
            messages=recent_messages,
            metadata=conversation.metadata
        )

    async def list_conversations(
        self,
        user_id: str,
        page: int = 1,
        page_size: int = 20,
        include_archived: bool = False
    ) -> List[ConversationSchema]:
        """
        List conversations for a user with pagination.

        Args:
            user_id: User ID
            page: Page number (1-indexed)
            page_size: Number of conversations per page
            include_archived: Whether to include archived conversations

        Returns:
            List of conversations
        """
        db = next(get_db())
        try:
            conversation_repo = ConversationRepository(db)
            skip = (page - 1) * page_size
            db_conversations = conversation_repo.get_by_user(
                user_id,
                skip=skip,
                limit=page_size,
                active_only=not include_archived
            )

            # Convert to schemas
            conversations = [
                ConversationSchema(
                    id=conv.id,
                    user_id=conv.user_id,
                    title=conv.title,
                    messages=[],
                    created_at=conv.created_at,
                    updated_at=conv.updated_at,
                    metadata=conv.metadata_ or {},
                    is_active=conv.is_active
                )
                for conv in db_conversations
            ]

            logger.info(
                "Listed %d conversations for user %s (page %d)",
                len(conversations),
                user_id,
                page
            )
            return conversations

        finally:
            db.close()

    async def count_conversations(
        self,
        user_id: str,
        include_archived: bool = False
    ) -> int:
        """
        Count total conversations for a user.

        Args:
            user_id: User ID
            include_archived: Whether to include archived conversations

        Returns:
            Total count
        """
        db = next(get_db())
        try:
            conversation_repo = ConversationRepository(db)
            total = conversation_repo.count_by_user(
                user_id,
                active_only=not include_archived
            )
            return total
        finally:
            db.close()

    async def get_messages(
        self,
        conversation_id: str,
        limit: int = 50,
        offset: int = 0
    ) -> List[MessageSchema]:
        """
        Get messages from a conversation with pagination.

        Args:
            conversation_id: Conversation ID
            limit: Maximum number of messages
            offset: Number of messages to skip

        Returns:
            List of messages
        """
        db = next(get_db())
        try:
            message_repo = MessageRepository(db)
            db_messages = message_repo.get_by_conversation(
                conversation_id,
                skip=offset,
                limit=limit
            )
            
            # Convert to schemas
            messages = [
                MessageSchema(
                    id=msg.id,
                    conversation_id=msg.conversation_id,
                    role=msg.role,
                    content=msg.content,
                    agent_type=msg.agent_type,
                    metadata=msg.metadata_ or {},
                    timestamp=msg.timestamp
                )
                for msg in db_messages
            ]
            return messages
        finally:
            db.close()

    async def search_conversations(
        self,
        user_id: str,
        query: str,
        limit: int = 10
    ) -> List[ConversationSchema]:
        """
        Search conversations by title or content.

        Args:
            user_id: User ID
            query: Search query
            limit: Maximum number of results

        Returns:
            List of matching conversations
        """
        db = next(get_db())
        try:
            conversation_repo = ConversationRepository(db)
            db_conversations = conversation_repo.search_by_title(
                user_id,
                query,
                limit=limit
            )

            # Convert to schemas
            conversations = [
                ConversationSchema(
                    id=conv.id,
                    user_id=conv.user_id,
                    title=conv.title,
                    messages=[],
                    created_at=conv.created_at,
                    updated_at=conv.updated_at,
                    metadata=conv.metadata_ or {},
                    is_active=conv.is_active
                )
                for conv in db_conversations
            ]

            logger.info(
                "Found %d conversations matching '%s' for user %s",
                len(conversations),
                query,
                user_id
            )
            return conversations

        finally:
            db.close()

    async def update_conversation(
        self,
        conversation_id: str,
        title: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None
    ) -> bool:
        """
        Update conversation details.

        Args:
            conversation_id: Conversation ID
            title: New title (optional)
            metadata: New metadata (optional)

        Returns:
            True if updated successfully
        """
        db = next(get_db())
        try:
            conversation_repo = ConversationRepository(db)
            
            # Build update data
            update_data = {'updated_at': datetime.utcnow()}
            if title:
                update_data['title'] = title
            if metadata:
                update_data['metadata_'] = metadata

            # Update using repository method
            result = conversation_repo.update(conversation_id, update_data)

            if result:
                # Invalidate cache
                await self._invalidate_cache(conversation_id)
                logger.info("Updated conversation %s", conversation_id)
                return True
            
            return False

        finally:
            db.close()

    async def archive_conversation(
        self,
        conversation_id: str
    ) -> bool:
        """
        Archive conversation (soft delete).

        Args:
            conversation_id: Conversation ID

        Returns:
            True if archived successfully
        """
        db = next(get_db())
        try:
            conversation_repo = ConversationRepository(db)
            success = conversation_repo.archive(conversation_id)

            if success:
                # Invalidate cache
                await self._invalidate_cache(conversation_id)
                logger.info("Archived conversation %s", conversation_id)

            return success

        finally:
            db.close()

    async def delete_conversation(
        self,
        conversation_id: str
    ) -> bool:
        """
        Permanently delete a conversation and all its messages.

        Args:
            conversation_id: Conversation ID

        Returns:
            True if deleted successfully
        """
        db = next(get_db())
        try:
            conversation_repo = ConversationRepository(db)
            message_repo = MessageRepository(db)

            # Delete messages first
            message_repo.delete_by_conversation(conversation_id)

            # Delete conversation
            deleted = conversation_repo.delete(conversation_id)

            if deleted:
                # Invalidate cache
                await self._invalidate_cache(conversation_id)
                logger.info("Deleted conversation %s", conversation_id)

            return deleted

        finally:
            db.close()

    async def _cache_conversation(
        self,
        conversation: ConversationSchema
    ) -> None:
        """Cache conversation data"""
        try:
            cache_key = f"conversation:{conversation.id}"
            await cache_service.set_conversation(
                cache_key,
                conversation,
                ttl=3600
            )
        except Exception as e:
            logger.warning("Failed to cache conversation: %s", e)

    async def _get_cached_conversation(
        self,
        conversation_id: str
    ) -> Optional[ConversationSchema]:
        """Get conversation from cache"""
        try:
            cache_key = f"conversation:{conversation_id}"
            return await cache_service.get_conversation(cache_key)
        except Exception as e:
            logger.warning("Failed to get cached conversation: %s", e)
            return None

    async def _invalidate_cache(self, conversation_id: str) -> None:
        """Invalidate conversation cache"""
        try:
            cache_key = f"conversation:{conversation_id}"
            await cache_service.delete(cache_key)
        except Exception as e:
            logger.warning("Failed to invalidate cache: %s", e)

    def get_stats(self) -> Dict[str, Any]:
        """Get conversation manager statistics"""
        db = next(get_db())
        try:
            conversation_repo = ConversationRepository(db)
            message_repo = MessageRepository(db)

            # Get counts
            all_conversations = conversation_repo.get_all()
            total_conversations = len(all_conversations)
            active_conversations = len([
                c for c in all_conversations if c.is_active
            ])
            total_messages = len(message_repo.get_all())

            return {
                'total_conversations': total_conversations,
                'active_conversations': active_conversations,
                'archived_conversations': (
                    total_conversations - active_conversations
                ),
                'total_messages': total_messages,
                'average_messages_per_conversation': (
                    total_messages / total_conversations
                    if total_conversations > 0 else 0
                )
            }
        finally:
            db.close()
