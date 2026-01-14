import logging
from typing import List, Dict, Optional

logger = logging.getLogger(__name__)

try:
    from sqlalchemy.orm import Session
    from sqlalchemy import text, and_, or_
    from app.models.db_models import Vehicle, Post
    HAS_DB = True
except ImportError:
    HAS_DB = False
    logger.warning("SQLAlchemy not installed. Inventory Service disabled.")

class InventoryService:
    def search_vehicles(
        self, 
        db: "Session", 
        query: str,
        min_price: Optional[float] = None,
        max_price: Optional[float] = None,
        min_mileage: Optional[int] = None,
        max_mileage: Optional[int] = None,
        min_year: Optional[int] = None,
        max_year: Optional[int] = None,
        make: Optional[str] = None,
        model: Optional[str] = None,
        limit: int = 10
    ) -> List[Dict]:
        """
        Enhanced vehicle search with comprehensive filtering.
        
        Args:
            db: Database session
            query: Search query for Make/Model/Description
            min_price: Minimum price filter
            max_price: Maximum price filter
            min_mileage: Minimum mileage filter
            max_mileage: Maximum mileage filter
            min_year: Minimum year filter
            max_year: Maximum year filter
            make: Specific make filter
            model: Specific model filter
            limit: Maximum number of results
            
        Returns:
            List of vehicle dictionaries matching filters
        """
        if not HAS_DB:
            logger.warning("Inventory search skipped: SQLAlchemy missing.")
            return []
            
        try:
            # Start with base query
            query_obj = db.query(Vehicle)
            
            # Apply text search if query provided
            if query:
                search_term = f"%{query}%"
                query_obj = query_obj.filter(
                    or_(
                        Vehicle.Make.like(search_term),
                        Vehicle.Model.like(search_term),
                        Vehicle.Description.like(search_term)
                    )
                )
            
            # Apply price filters
            if min_price is not None:
                query_obj = query_obj.filter(Vehicle.Price >= min_price)
            if max_price is not None:
                query_obj = query_obj.filter(Vehicle.Price <= max_price)
            
            # Apply mileage filters
            if min_mileage is not None:
                query_obj = query_obj.filter(Vehicle.Mileage >= min_mileage)
            if max_mileage is not None:
                query_obj = query_obj.filter(Vehicle.Mileage <= max_mileage)
            
            # Apply year filters
            if min_year is not None:
                query_obj = query_obj.filter(Vehicle.Year >= min_year)
            if max_year is not None:
                query_obj = query_obj.filter(Vehicle.Year <= max_year)
            
            # Apply make filter
            if make:
                query_obj = query_obj.filter(Vehicle.Make.ilike(f"%{make}%"))
            
            # Apply model filter
            if model:
                query_obj = query_obj.filter(Vehicle.Model.ilike(f"%{model}%"))
            
            # Execute query with limit
            vehicles = query_obj.limit(limit).all()
            
            return [
                {
                    "id": v.Id,
                    "make": v.Make,
                    "model": v.Model,
                    "year": v.Year,
                    "price": v.Price,
                    "mileage": v.Mileage,
                    "description": v.Description,
                    "condition": getattr(v, 'Condition', None),
                    "fuel_type": getattr(v, 'FuelType', None),
                    "transmission": getattr(v, 'Transmission', None)
                }
                for v in vehicles
            ]
        except Exception as e:
            logger.error(f"Error searching vehicles: {e}")
            return []

    def get_latest_posts(self, db: Session, limit: int = 3) -> List[Dict]:
        """
        Get the latest community posts.
        """
        try:
            posts = db.query(Post).order_by(Post.Created.desc()).limit(limit).all()
            return [{"content": p.Content, "created": p.Created} for p in posts]
        except Exception as e:
            logger.error(f"Error fetching posts: {e}")
            return []
