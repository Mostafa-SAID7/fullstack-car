import logging
from typing import List, Dict

logger = logging.getLogger(__name__)

try:
    from sqlalchemy.orm import Session
    from sqlalchemy import text
    from app.models.db_models import Vehicle, Post
    HAS_DB = True
except ImportError:
    HAS_DB = False
    logger.warning("SQLAlchemy not installed. Inventory Service disabled.")

class InventoryService:
    def search_vehicles(self, db: "Session", query: str) -> List[Dict]:
        """
        Search for vehicles in the database matching the query.
        """
        if not HAS_DB:
            logger.warning("Inventory search skipped: SQLAlchemy missing.")
            return []
            
        try:
            # Simple keyword search on Make/Model/Description
            # Using raw SQL for flexibility with MSSQL full-text or LIKE
            search_term = f"%{query}%"
            vehicles = db.query(Vehicle).filter(
                (Vehicle.Make.like(search_term)) | 
                (Vehicle.Model.like(search_term)) |
                (Vehicle.Description.like(search_term))
            ).limit(5).all()
            
            return [
                {
                    "make": v.Make,
                    "model": v.Model,
                    "year": v.Year,
                    "price": v.Price,
                    "mileage": v.Mileage,
                    "description": v.Description
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
