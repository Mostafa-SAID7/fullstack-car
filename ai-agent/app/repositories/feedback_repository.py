"""
Repository for user feedback management.
"""
from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import desc, and_
from datetime import datetime, timedelta
from app.models.db_models import Feedback
from app.repositories.base_repository import BaseRepository
import logging

logger = logging.getLogger(__name__)

class FeedbackRepository(BaseRepository[Feedback]):
    """Repository for feedback operations"""
    
    def __init__(self, db: Session):
        super().__init__(Feedback, db)
    
    def get_by_conversation(self, conversation_id: str) -> List[Feedback]:
        """Get all feedback for a conversation"""
        try:
            return self.db.query(Feedback).filter(
                Feedback.conversation_id == conversation_id
            ).order_by(Feedback.timestamp).all()
        except Exception as e:
            logger.error(f"Error getting feedback for conversation {conversation_id}: {e}")
            return []
    
    def get_by_message(self, message_id: str) -> Optional[Feedback]:
        """Get feedback for a specific message"""
        try:
            return self.db.query(Feedback).filter(
                Feedback.message_id == message_id
            ).first()
        except Exception as e:
            logger.error(f"Error getting feedback for message {message_id}: {e}")
            return None
    
    def get_by_type(self, feedback_type: str, skip: int = 0, limit: int = 100) -> List[Feedback]:
        """Get feedback by type"""
        try:
            return self.db.query(Feedback).filter(
                Feedback.type == feedback_type
            ).order_by(desc(Feedback.timestamp)).offset(skip).limit(limit).all()
        except Exception as e:
            logger.error(f"Error getting feedback by type {feedback_type}: {e}")
            return []
    
    def get_recent(self, days: int = 30, skip: int = 0, limit: int = 100) -> List[Feedback]:
        """Get recent feedback within specified days"""
        try:
            cutoff_date = datetime.utcnow() - timedelta(days=days)
            return self.db.query(Feedback).filter(
                Feedback.timestamp >= cutoff_date
            ).order_by(desc(Feedback.timestamp)).offset(skip).limit(limit).all()
        except Exception as e:
            logger.error(f"Error getting recent feedback: {e}")
            return []
    
    def count_by_type(self, feedback_type: str, days: Optional[int] = None) -> int:
        """Count feedback by type, optionally within specified days"""
        try:
            query = self.db.query(Feedback).filter(Feedback.type == feedback_type)
            
            if days:
                cutoff_date = datetime.utcnow() - timedelta(days=days)
                query = query.filter(Feedback.timestamp >= cutoff_date)
            
            return query.count()
        except Exception as e:
            logger.error(f"Error counting feedback by type {feedback_type}: {e}")
            return 0
    
    def get_corrections(self, skip: int = 0, limit: int = 50) -> List[Feedback]:
        """Get all correction feedback for learning"""
        try:
            return self.db.query(Feedback).filter(
                Feedback.type == 'correction'
            ).order_by(desc(Feedback.timestamp)).offset(skip).limit(limit).all()
        except Exception as e:
            logger.error(f"Error getting corrections: {e}")
            return []
    
    def get_negative_feedback(self, days: int = 7) -> List[Feedback]:
        """Get recent negative feedback for analysis"""
        try:
            cutoff_date = datetime.utcnow() - timedelta(days=days)
            return self.db.query(Feedback).filter(
                and_(
                    Feedback.type == 'negative',
                    Feedback.timestamp >= cutoff_date
                )
            ).order_by(desc(Feedback.timestamp)).all()
        except Exception as e:
            logger.error(f"Error getting negative feedback: {e}")
            return []
    
    def get_satisfaction_rate(self, days: int = 30) -> float:
        """Calculate satisfaction rate (positive / total)"""
        try:
            cutoff_date = datetime.utcnow() - timedelta(days=days)
            
            total = self.db.query(Feedback).filter(
                and_(
                    Feedback.timestamp >= cutoff_date,
                    Feedback.type.in_(['positive', 'negative'])
                )
            ).count()
            
            if total == 0:
                return 0.0
            
            positive = self.db.query(Feedback).filter(
                and_(
                    Feedback.timestamp >= cutoff_date,
                    Feedback.type == 'positive'
                )
            ).count()
            
            return positive / total
        except Exception as e:
            logger.error(f"Error calculating satisfaction rate: {e}")
            return 0.0
