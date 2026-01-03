from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, scoped_session, declarative_base
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, scoped_session, declarative_base
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

# Use DATABASE_URL from settings
DATABASE_URL = settings.DATABASE_URL

try:
    engine = create_engine(DATABASE_URL)
    # Test connection
    with engine.connect() as conn:
        conn.execute(text("SELECT 1"))
    logger.info(f"Database connected successfully: {DATABASE_URL}")
except Exception as e:
    logger.warning(f"Database connection failed: {e}. Falling back to SQLite.")
    engine = create_engine("sqlite:///./community_car_ai.db")
    
SessionLocal = scoped_session(sessionmaker(autocommit=False, autoflush=False, bind=engine))
Base = declarative_base()

async def init_db():
    try:
        # Verify connection
        with engine.connect() as conn:
            result = conn.execute(text("SELECT 1"))
            logger.info(f"Database connection successful: {result.scalar()}")
    except Exception as e:
        logger.error(f"Database connection failed: {e}")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()