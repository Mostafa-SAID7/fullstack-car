"""
Base repository with common CRUD operations.
"""
from typing import TypeVar, Generic, Type, Optional, List, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_
from app.core.database import Base
import logging

logger = logging.getLogger(__name__)

T = TypeVar('T', bound=Base)

class BaseRepository(Generic[T]):
    """Base repository with common CRUD operations"""
    
    def __init__(self, model: Type[T], db: Session):
        self.model = model
        self.db = db
    
    def create(self, obj: T) -> T:
        """Create a new record"""
        try:
            self.db.add(obj)
            self.db.commit()
            self.db.refresh(obj)
            return obj
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error creating {self.model.__name__}: {e}")
            raise
    
    def get_by_id(self, id: Any) -> Optional[T]:
        """Get record by ID"""
        try:
            return self.db.query(self.model).filter(self.model.id == id).first()
        except Exception as e:
            logger.error(f"Error getting {self.model.__name__} by id {id}: {e}")
            return None
    
    def get_all(self, skip: int = 0, limit: int = 100) -> List[T]:
        """Get all records with pagination"""
        try:
            return self.db.query(self.model).offset(skip).limit(limit).all()
        except Exception as e:
            logger.error(f"Error getting all {self.model.__name__}: {e}")
            return []
    
    def update(self, id: Any, data: Dict[str, Any]) -> Optional[T]:
        """Update a record"""
        try:
            obj = self.get_by_id(id)
            if obj:
                for key, value in data.items():
                    if hasattr(obj, key):
                        setattr(obj, key, value)
                self.db.commit()
                self.db.refresh(obj)
            return obj
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error updating {self.model.__name__} {id}: {e}")
            raise
    
    def delete(self, id: Any) -> bool:
        """Delete a record"""
        try:
            obj = self.get_by_id(id)
            if obj:
                self.db.delete(obj)
                self.db.commit()
                return True
            return False
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error deleting {self.model.__name__} {id}: {e}")
            raise
    
    def count(self) -> int:
        """Count total records"""
        try:
            return self.db.query(self.model).count()
        except Exception as e:
            logger.error(f"Error counting {self.model.__name__}: {e}")
            return 0
    
    def exists(self, id: Any) -> bool:
        """Check if record exists"""
        return self.get_by_id(id) is not None
