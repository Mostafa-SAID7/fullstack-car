"""
Base repository with common CRUD operations and query optimization.
"""
from typing import TypeVar, Generic, Type, Optional, List, Dict, Any, Callable
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_, func
from app.core.database import Base
import logging
import hashlib
import json
from functools import wraps
import time

logger = logging.getLogger(__name__)

T = TypeVar('T', bound=Base)

# Simple in-memory cache for query results
_query_cache: Dict[str, tuple[Any, float]] = {}
CACHE_TTL = 300  # 5 minutes default

def cache_query(ttl: int = CACHE_TTL):
    """Decorator to cache query results"""
    def decorator(func: Callable):
        @wraps(func)
        def wrapper(self, *args, **kwargs):
            # Generate cache key from function name and arguments
            cache_key = f"{self.model.__name__}:{func.__name__}:{hashlib.md5(json.dumps(str(args) + str(kwargs), sort_keys=True).encode()).hexdigest()}"
            
            # Check cache
            if cache_key in _query_cache:
                result, timestamp = _query_cache[cache_key]
                if time.time() - timestamp < ttl:
                    logger.debug(f"Cache hit: {cache_key}")
                    return result
            
            # Execute query
            result = func(self, *args, **kwargs)
            
            # Store in cache
            _query_cache[cache_key] = (result, time.time())
            logger.debug(f"Cache miss: {cache_key}")
            
            return result
        return wrapper
    return decorator

def clear_cache(model_name: Optional[str] = None):
    """Clear query cache for a specific model or all models"""
    global _query_cache
    if model_name:
        _query_cache = {k: v for k, v in _query_cache.items() if not k.startswith(f"{model_name}:")}
    else:
        _query_cache.clear()

class BaseRepository(Generic[T]):
    """Base repository with common CRUD operations and query optimization"""
    
    def __init__(self, model: Type[T], db: Session):
        self.model = model
        self.db = db
    
    def create(self, obj: T) -> T:
        """Create a new record"""
        try:
            self.db.add(obj)
            self.db.commit()
            self.db.refresh(obj)
            
            # Clear cache for this model
            clear_cache(self.model.__name__)
            
            return obj
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error creating {self.model.__name__}: {e}")
            raise
    
    @cache_query(ttl=60)
    def get_by_id(self, id: Any) -> Optional[T]:
        """Get record by ID (cached)"""
        try:
            return self.db.query(self.model).filter(self.model.id == id).first()
        except Exception as e:
            logger.error(f"Error getting {self.model.__name__} by id {id}: {e}")
            return None
    
    def get_all(self, skip: int = 0, limit: int = 100, order_by: Optional[Any] = None) -> List[T]:
        """Get all records with pagination and optional ordering"""
        try:
            query = self.db.query(self.model)
            
            if order_by is not None:
                query = query.order_by(order_by)
            
            return query.offset(skip).limit(limit).all()
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
                
                # Clear cache for this model
                clear_cache(self.model.__name__)
            
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
                
                # Clear cache for this model
                clear_cache(self.model.__name__)
                
                return True
            return False
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error deleting {self.model.__name__} {id}: {e}")
            raise
    
    @cache_query(ttl=300)
    def count(self, filters: Optional[Dict[str, Any]] = None) -> int:
        """Count total records with optional filters (cached)"""
        try:
            query = self.db.query(func.count(self.model.id))
            
            if filters:
                for key, value in filters.items():
                    if hasattr(self.model, key):
                        query = query.filter(getattr(self.model, key) == value)
            
            return query.scalar()
        except Exception as e:
            logger.error(f"Error counting {self.model.__name__}: {e}")
            return 0
    
    def exists(self, id: Any) -> bool:
        """Check if record exists"""
        return self.get_by_id(id) is not None
    
    def bulk_create(self, objects: List[T]) -> List[T]:
        """Bulk create multiple records"""
        try:
            self.db.bulk_save_objects(objects)
            self.db.commit()
            
            # Clear cache for this model
            clear_cache(self.model.__name__)
            
            return objects
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error bulk creating {self.model.__name__}: {e}")
            raise
    
    def paginate(self, page: int = 1, per_page: int = 20, filters: Optional[Dict[str, Any]] = None, order_by: Optional[Any] = None) -> Dict[str, Any]:
        """Paginate results with metadata"""
        try:
            query = self.db.query(self.model)
            
            # Apply filters
            if filters:
                for key, value in filters.items():
                    if hasattr(self.model, key):
                        query = query.filter(getattr(self.model, key) == value)
            
            # Apply ordering
            if order_by is not None:
                query = query.order_by(order_by)
            
            # Get total count
            total = query.count()
            
            # Calculate pagination
            total_pages = (total + per_page - 1) // per_page
            skip = (page - 1) * per_page
            
            # Get page results
            items = query.offset(skip).limit(per_page).all()
            
            return {
                'items': items,
                'total': total,
                'page': page,
                'per_page': per_page,
                'total_pages': total_pages,
                'has_next': page < total_pages,
                'has_prev': page > 1
            }
        except Exception as e:
            logger.error(f"Error paginating {self.model.__name__}: {e}")
            return {
                'items': [],
                'total': 0,
                'page': page,
                'per_page': per_page,
                'total_pages': 0,
                'has_next': False,
                'has_prev': False
            }
