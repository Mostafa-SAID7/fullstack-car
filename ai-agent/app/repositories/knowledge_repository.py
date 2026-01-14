"""
Repository for knowledge base metadata.
"""
from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import desc, and_, or_
from datetime import datetime
from app.models.db_models import KnowledgeEntry
from app.repositories.base_repository import BaseRepository
import logging

logger = logging.getLogger(__name__)

class KnowledgeMetadataRepository(BaseRepository[KnowledgeEntry]):
    """Repository for knowledge base metadata operations"""
    
    def __init__(self, db: Session):
        super().__init__(KnowledgeEntry, db)
    
    def get_by_category(self, category: str, skip: int = 0, limit: int = 100) -> List[KnowledgeEntry]:
        """Get knowledge entries by category"""
        try:
            return self.db.query(KnowledgeEntry).filter(
                KnowledgeEntry.category == category
            ).order_by(desc(KnowledgeEntry.created_at)).offset(skip).limit(limit).all()
        except Exception as e:
            logger.error(f"Error getting knowledge by category {category}: {e}")
            return []
    
    def get_by_source(self, source: str, skip: int = 0, limit: int = 100) -> List[KnowledgeEntry]:
        """Get knowledge entries by source"""
        try:
            return self.db.query(KnowledgeEntry).filter(
                KnowledgeEntry.source == source
            ).order_by(desc(KnowledgeEntry.created_at)).offset(skip).limit(limit).all()
        except Exception as e:
            logger.error(f"Error getting knowledge by source {source}: {e}")
            return []
    
    def get_verified(self, category: Optional[str] = None, skip: int = 0, limit: int = 100) -> List[KnowledgeEntry]:
        """Get verified knowledge entries"""
        try:
            query = self.db.query(KnowledgeEntry).filter(KnowledgeEntry.verified == True)
            
            if category:
                query = query.filter(KnowledgeEntry.category == category)
            
            return query.order_by(desc(KnowledgeEntry.created_at)).offset(skip).limit(limit).all()
        except Exception as e:
            logger.error(f"Error getting verified knowledge: {e}")
            return []
    
    def get_unverified(self, skip: int = 0, limit: int = 100) -> List[KnowledgeEntry]:
        """Get unverified knowledge entries for review"""
        try:
            return self.db.query(KnowledgeEntry).filter(
                KnowledgeEntry.verified == False
            ).order_by(desc(KnowledgeEntry.created_at)).offset(skip).limit(limit).all()
        except Exception as e:
            logger.error(f"Error getting unverified knowledge: {e}")
            return []
    
    def search_metadata(self, search_term: str, category: Optional[str] = None, limit: int = 20) -> List[KnowledgeEntry]:
        """Search knowledge entries by content"""
        try:
            query = self.db.query(KnowledgeEntry).filter(
                KnowledgeEntry.content.ilike(f"%{search_term}%")
            )
            
            if category:
                query = query.filter(KnowledgeEntry.category == category)
            
            return query.order_by(desc(KnowledgeEntry.created_at)).limit(limit).all()
        except Exception as e:
            logger.error(f"Error searching knowledge metadata: {e}")
            return []
    
    def verify_entry(self, entry_id: str) -> bool:
        """Mark a knowledge entry as verified"""
        try:
            entry = self.get_by_id(entry_id)
            if entry:
                entry.verified = True
                entry.updated_at = datetime.utcnow()
                self.db.commit()
                return True
            return False
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error verifying knowledge entry {entry_id}: {e}")
            return False
    
    def unverify_entry(self, entry_id: str) -> bool:
        """Mark a knowledge entry as unverified"""
        try:
            entry = self.get_by_id(entry_id)
            if entry:
                entry.verified = False
                entry.updated_at = datetime.utcnow()
                self.db.commit()
                return True
            return False
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error unverifying knowledge entry {entry_id}: {e}")
            return False
    
    def count_by_category(self, category: str) -> int:
        """Count knowledge entries by category"""
        try:
            return self.db.query(KnowledgeEntry).filter(
                KnowledgeEntry.category == category
            ).count()
        except Exception as e:
            logger.error(f"Error counting knowledge by category {category}: {e}")
            return 0
    
    def count_by_source(self, source: str) -> int:
        """Count knowledge entries by source"""
        try:
            return self.db.query(KnowledgeEntry).filter(
                KnowledgeEntry.source == source
            ).count()
        except Exception as e:
            logger.error(f"Error counting knowledge by source {source}: {e}")
            return 0
    
    def get_recent_additions(self, days: int = 7, limit: int = 50) -> List[KnowledgeEntry]:
        """Get recently added knowledge entries"""
        try:
            from datetime import timedelta
            cutoff_date = datetime.utcnow() - timedelta(days=days)
            
            return self.db.query(KnowledgeEntry).filter(
                KnowledgeEntry.created_at >= cutoff_date
            ).order_by(desc(KnowledgeEntry.created_at)).limit(limit).all()
        except Exception as e:
            logger.error(f"Error getting recent knowledge additions: {e}")
            return []
    
    def get_user_corrections(self, limit: int = 100) -> List[KnowledgeEntry]:
        """Get knowledge entries from user corrections"""
        try:
            return self.db.query(KnowledgeEntry).filter(
                KnowledgeEntry.source == 'user_correction'
            ).order_by(desc(KnowledgeEntry.created_at)).limit(limit).all()
        except Exception as e:
            logger.error(f"Error getting user corrections: {e}")
            return []
