"""
Repository for conversation management with optimized queries.
"""
from typing import List, Optional
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import desc, func
from datetime import datetime
from app.models.db_models import Conversation, Message
from app.repositories.base_repository import BaseRepository, cache_query, clear_cache
import logging

logger = logging.getLogger(__name__)

class ConversationRepository(BaseRepository[Conversation]):
    """Repository for conversation operations with query optimization"""
    
    def __init__(self, db: Session):
        super().__init__(Conversation, db)
    
    @cache_query(ttl=60)
    def get_by_user(self, user_id: str, skip: int = 0, limit: int = 20, active_only: bool = True) -> List[Conversation]:
        """Get conversations for a specific user (optimized with composite index)"""
        try:
            query = self.db.query(Conversation).filter(Conversation.user_id == user_id)
            
            if active_only:
                query = query.filter(Conversation.is_active == True)
            
            # Use composite index: idx_conversations_user_active
            return query.order_by(desc(Conversation.updated_at)).offset(skip).limit(limit).all()
        except Exception as e:
            logger.error(f"Error getting conversations for user {user_id}: {e}")
            return []
    
    @cache_query(ttl=300)
    def count_by_user(self, user_id: str, active_only: bool = True) -> int:
        """Count conversations for a user (cached)"""
        try:
            query = self.db.query(func.count(Conversation.id)).filter(Conversation.user_id == user_id)
            
            if active_only:
                query = query.filter(Conversation.is_active == True)
            
            return query.scalar()
        except Exception as e:
            logger.error(f"Error counting conversations for user {user_id}: {e}")
            return 0
    
    def get_with_messages(self, conversation_id: str, message_limit: int = 100) -> Optional[Conversation]:
        """Get conversation with messages loaded (optimized with eager loading)"""
        try:
            # Use joinedload to fetch messages in single query
            return self.db.query(Conversation).options(
                joinedload(Conversation.messages)
            ).filter(
                Conversation.id == conversation_id
            ).first()
        except Exception as e:
            logger.error(f"Error getting conversation {conversation_id} with messages: {e}")
            return None
    
    def update_timestamp(self, conversation_id: str) -> bool:
        """Update the updated_at timestamp (optimized bulk update)"""
        try:
            # Use bulk update instead of loading object
            result = self.db.query(Conversation).filter(
                Conversation.id == conversation_id
            ).update({
                'updated_at': datetime.utcnow()
            })
            self.db.commit()
            
            # Clear cache
            clear_cache('Conversation')
            
            return result > 0
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error updating timestamp for conversation {conversation_id}: {e}")
            return False
    
    def archive(self, conversation_id: str) -> bool:
        """Archive a conversation (soft delete with bulk update)"""
        try:
            result = self.db.query(Conversation).filter(
                Conversation.id == conversation_id
            ).update({
                'is_active': False
            })
            self.db.commit()
            
            # Clear cache
            clear_cache('Conversation')
            
            return result > 0
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error archiving conversation {conversation_id}: {e}")
            return False
    
    def restore(self, conversation_id: str) -> bool:
        """Restore an archived conversation (bulk update)"""
        try:
            result = self.db.query(Conversation).filter(
                Conversation.id == conversation_id
            ).update({
                'is_active': True
            })
            self.db.commit()
            
            # Clear cache
            clear_cache('Conversation')
            
            return result > 0
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error restoring conversation {conversation_id}: {e}")
            return False
    
    @cache_query(ttl=60)
    def search_by_title(self, user_id: str, search_term: str, limit: int = 10) -> List[Conversation]:
        """Search conversations by title (cached)"""
        try:
            return self.db.query(Conversation).filter(
                Conversation.user_id == user_id,
                Conversation.title.ilike(f"%{search_term}%"),
                Conversation.is_active == True
            ).order_by(desc(Conversation.updated_at)).limit(limit).all()
        except Exception as e:
            logger.error(f"Error searching conversations for user {user_id}: {e}")
            return []
    
    def get_recent_active(self, limit: int = 10) -> List[Conversation]:
        """Get recently active conversations (for monitoring)"""
        try:
            return self.db.query(Conversation).filter(
                Conversation.is_active == True
            ).order_by(desc(Conversation.updated_at)).limit(limit).all()
        except Exception as e:
            logger.error(f"Error getting recent active conversations: {e}")
            return []

class MessageRepository(BaseRepository[Message]):
    """Repository for message operations with query optimization"""
    
    def __init__(self, db: Session):
        super().__init__(Message, db)
    
    @cache_query(ttl=30)
    def get_by_conversation(self, conversation_id: str, skip: int = 0, limit: int = 100) -> List[Message]:
        """Get messages for a conversation (cached, uses composite index)"""
        try:
            # Uses composite index: idx_messages_conversation_time
            return self.db.query(Message).filter(
                Message.conversation_id == conversation_id
            ).order_by(Message.timestamp).offset(skip).limit(limit).all()
        except Exception as e:
            logger.error(f"Error getting messages for conversation {conversation_id}: {e}")
            return []
    
    @cache_query(ttl=30)
    def get_recent(self, conversation_id: str, limit: int = 5) -> List[Message]:
        """Get recent messages for a conversation (cached)"""
        try:
            return self.db.query(Message).filter(
                Message.conversation_id == conversation_id
            ).order_by(desc(Message.timestamp)).limit(limit).all()[::-1]  # Reverse to chronological order
        except Exception as e:
            logger.error(f"Error getting recent messages for conversation {conversation_id}: {e}")
            return []
    
    @cache_query(ttl=300)
    def count_by_conversation(self, conversation_id: str) -> int:
        """Count messages in a conversation (cached)"""
        try:
            return self.db.query(func.count(Message.id)).filter(
                Message.conversation_id == conversation_id
            ).scalar()
        except Exception as e:
            logger.error(f"Error counting messages for conversation {conversation_id}: {e}")
            return 0
    
    def delete_by_conversation(self, conversation_id: str) -> bool:
        """Delete all messages in a conversation (bulk delete)"""
        try:
            self.db.query(Message).filter(
                Message.conversation_id == conversation_id
            ).delete()
            self.db.commit()
            
            # Clear cache
            clear_cache('Message')
            
            return True
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error deleting messages for conversation {conversation_id}: {e}")
            return False
    
    @cache_query(ttl=60)
    def get_by_agent_type(self, conversation_id: str, agent_type: str) -> List[Message]:
        """Get messages by agent type (cached, uses composite index)"""
        try:
            # Uses composite index: idx_messages_agent_type
            return self.db.query(Message).filter(
                Message.conversation_id == conversation_id,
                Message.agent_type == agent_type
            ).order_by(Message.timestamp).all()
        except Exception as e:
            logger.error(f"Error getting messages by agent type for conversation {conversation_id}: {e}")
            return []
