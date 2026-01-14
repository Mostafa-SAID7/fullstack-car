"""
Conversation Manager - Manages conversation state, history, and persistence.
"""
from typing import Optional, List, Dict, Any
from app.models.schemas import Conversation, Message, ConversationContext
from app.repositories.conversation_repository import ConversationRepository
from app.repositories.base_repository import MessageRepository
from app.core.cache import cache_service
from app.core.database import get_db
import uuid
from datetime import datetime
import logging

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
        self.conversation_repo = ConversationRepository()
        self.message_repo = MessageRepository()
        logger.info("ConversationManager initialized")
    
    async def create_conversation(
        self,
        user_id: str,
        title: Optional[str] = None
    ) -> Conversation:
        """
        Create a new conversation.
        
        Args:
            user_id: User ID
            title: Optional conversation title
            
        Returns:
            Created Conversation object
        """
        conversation_id = str(uuid.uuid4())
        
        conversation = Conversation(
            id=conversation_id,
            user_id=user_id,
            title=title or "New Conversation",
            messages=[],
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow(),
            metadata={},
            is_active=True
        )
        
        # Save to database
        db = next(get_db())
        try:
            self.conversation_repo.create(db, conversation)
            logger.info(f"Created conversation {conversation_id} for user {user_id}")
            
            # Cache the conversation
            await self._cache_conversation(conversation)
            
            return conversation
        finally:
            db.close()
    
    async def add_message(
        self,
        conversation_id: str,
        role: str,
        content: str,
        agent_type: Optional[Any] = None,
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
        message = Message(
            id=message_id,
            conversation_id=conversation_id,
            role=role,
            content=content,
            agent_type=agent_type,
            metadata=metadata or {},
            timestamp=datetime.utcnow()
        )
        
        db = next(get_db())
        try:
            # Save message to database
            self.message_repo.add_message(db, conversation_id, message)
            logger.info(f"Added message {message.id} to conversation {conversation_id}")
            
            # Update conversation timestamp
            self.conversation_repo.update_timestamp(db, conversation_id)
            
            # Invalidate cache (will be refreshed on next get)
            await self._invalidate_cache(conversation_id)
            
        finally:
            db.close()
    
    async def get_conversation(
        self,
        conversation_id: str,
        include_messages: bool = True
    ) -> Optional[Conversation]:
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
            logger.info(f"Retrieved conversation {conversation_id} from cache")
            return cached
        
        # Load from database
        db = next(get_db())
        try:
            conversation = self.conversation_repo.get(db, conversation_id)
            if not conversation:
                logger.warning(f"Conversation {conversation_id} not found")
                return None
            
            if include_messages:
                # Load messages
                messages = self.message_repo.get_messages(db, conversation_id)
                conversation.messages = messages
            
            # Cache for future requests
            await self._cache_conversation(conversation)
            
            logger.info(f"Retrieved conversation {conversation_id} from database")
            return conversation
            
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
        recent_messages = conversation.messages[-message_limit:] if conversation.messages else []
        
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
    ) -> List[Conversation]:
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
            conversations = self.conversation_repo.list_by_user(
                db,
                user_id,
                page=page,
                page_size=page_size,
                include_archived=include_archived
            )
            
            logger.info(f"Listed {len(conversations)} conversations for user {user_id} (page {page})")
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
            total = self.conversation_repo.count_by_user(db, user_id, include_archived)
            return total
        finally:
            db.close()
    
    async def get_messages(
        self,
        conversation_id: str,
        limit: int = 50,
        offset: int = 0
    ) -> List[Message]:
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
            messages = self.message_repo.get_messages(
                db,
                conversation_id,
                limit=limit,
                offset=offset
            )
            return messages
        finally:
            db.close()
    
    async def search_conversations(
        self,
        user_id: str,
        query: str,
        limit: int = 10
    ) -> List[Conversation]:
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
            conversations = self.conversation_repo.search(
                db,
                user_id,
                query,
                limit=limit
            )
            
            logger.info(f"Found {len(conversations)} conversations matching '{query}' for user {user_id}")
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
            updated = self.conversation_repo.update(
                db,
                conversation_id,
                title=title,
                metadata=metadata
            )
            
            if updated:
                # Invalidate cache
                await self._invalidate_cache(conversation_id)
                logger.info(f"Updated conversation {conversation_id}")
            
            return updated
            
        finally:
            db.close()
    
    async def archive_conversation(
        self,
        conversation_id: str
    ) -> bool:
        """
        Archive a conversation (soft delete).
        
        Args:
            conversation_id: Conversation ID
            
        Returns:
            True if archived successfully
        """
        db = next(get_db())
        try:
            archived = self.conversation_repo.archive(db, conversation_id)
            
            if archived:
                # Invalidate cache
                await self._invalidate_cache(conversation_id)
                logger.info(f"Archived conversation {conversation_id}")
            
            return archived
            
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
            deleted = self.conversation_repo.delete(db, conversation_id)
            
            if deleted:
                # Invalidate cache
                await self._invalidate_cache(conversation_id)
                logger.info(f"Deleted conversation {conversation_id}")
            
            return deleted
            
        finally:
            db.close()
    
    async def _cache_conversation(self, conversation: Conversation) -> None:
        """Cache conversation data"""
        try:
            cache_key = f"conversation:{conversation.id}"
            await cache_service.set_conversation(cache_key, conversation, ttl=3600)  # 1 hour
        except Exception as e:
            logger.warning(f"Failed to cache conversation: {e}")
    
    async def _get_cached_conversation(self, conversation_id: str) -> Optional[Conversation]:
        """Get conversation from cache"""
        try:
            cache_key = f"conversation:{conversation_id}"
            return await cache_service.get_conversation(cache_key)
        except Exception as e:
            logger.warning(f"Failed to get cached conversation: {e}")
            return None
    
    async def _invalidate_cache(self, conversation_id: str) -> None:
        """Invalidate conversation cache"""
        try:
            cache_key = f"conversation:{conversation_id}"
            await cache_service.delete(cache_key)
        except Exception as e:
            logger.warning(f"Failed to invalidate cache: {e}")
    
    def get_stats(self) -> Dict[str, Any]:
        """Get conversation manager statistics"""
        db = next(get_db())
        try:
            total_conversations = self.conversation_repo.count_all(db)
            active_conversations = self.conversation_repo.count_active(db)
            total_messages = self.message_repo.count_all(db)
            
            return {
                'total_conversations': total_conversations,
                'active_conversations': active_conversations,
                'archived_conversations': total_conversations - active_conversations,
                'total_messages': total_messages,
                'average_messages_per_conversation': total_messages / total_conversations if total_conversations > 0 else 0
            }
        finally:
            db.close()
