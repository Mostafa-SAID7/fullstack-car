from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, scoped_session, declarative_base
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

# Use MSSQL Driver
# Format: mssql+pyodbc://ServerName/DatabaseName?driver=ODBC+Driver+17+for+SQL+Server&trusted_connection=yes
DATABASE_URL = "mssql+pyodbc://localhost/CCarDb?driver=SQL+Server&trusted_connection=yes"

try:
    engine = create_engine(DATABASE_URL)
except ImportError:
    logger.warning("MSSQL Driver (pyodbc) not found. Falling back to SQLite.")
    engine = create_engine("sqlite:///./community_car_ai.db")
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