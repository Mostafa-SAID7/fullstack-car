from sqlalchemy import create_engine, text, event
from sqlalchemy.orm import sessionmaker, scoped_session, declarative_base
from sqlalchemy.pool import NullPool, QueuePool
from app.core.config import settings
import logging
import time
from typing import Optional

logger = logging.getLogger(__name__)

# Use DATABASE_URL from settings
DATABASE_URL = settings.DATABASE_URL

# Determine if using SQL Server
is_sql_server = "mssql" in DATABASE_URL.lower()

# Query performance tracking
SLOW_QUERY_THRESHOLD = 0.05  # 50ms

def log_slow_query(conn, cursor, statement, parameters, context, executemany):
    """Log slow queries for performance monitoring"""
    duration = time.time() - context._query_start_time
    if duration > SLOW_QUERY_THRESHOLD:
        logger.warning(
            f"Slow query detected ({duration*1000:.2f}ms): {statement[:200]}..."
        )

try:
    # Create engine with appropriate settings
    if is_sql_server:
        # SQL Server specific configuration with optimized pooling
        engine = create_engine(
            DATABASE_URL,
            poolclass=QueuePool,
            pool_size=10,  # Number of connections to maintain
            max_overflow=20,  # Additional connections when pool is full
            pool_timeout=30,  # Timeout for getting connection from pool
            pool_recycle=3600,  # Recycle connections after 1 hour
            pool_pre_ping=True,  # Verify connections before using
            echo=settings.DEBUG,
            connect_args={
                "timeout": 30,
                "autocommit": False
            }
        )
        logger.info("Using SQL Server database with connection pooling")
    else:
        # SQLite or other databases with optimized settings
        engine = create_engine(
            DATABASE_URL,
            poolclass=QueuePool if "sqlite" not in DATABASE_URL else None,
            pool_size=5 if "sqlite" not in DATABASE_URL else None,
            max_overflow=10 if "sqlite" not in DATABASE_URL else None,
            pool_pre_ping=True if "sqlite" not in DATABASE_URL else False,
            echo=settings.DEBUG,
            connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {}
        )
        logger.info("Using SQLite database")
    
    # Add query performance monitoring
    @event.listens_for(engine, "before_cursor_execute")
    def receive_before_cursor_execute(conn, cursor, statement, parameters, context, executemany):
        context._query_start_time = time.time()
    
    @event.listens_for(engine, "after_cursor_execute")
    def receive_after_cursor_execute(conn, cursor, statement, parameters, context, executemany):
        log_slow_query(conn, cursor, statement, parameters, context, executemany)
    
    # Test connection
    with engine.connect() as conn:
        conn.execute(text("SELECT 1"))
    logger.info(f"Database connected successfully: {DATABASE_URL.split('@')[-1] if '@' in DATABASE_URL else DATABASE_URL}")
    
except Exception as e:
    logger.warning(f"Database connection failed: {e}. Falling back to SQLite.")
    engine = create_engine(
        "sqlite:///./community_car_ai.db",
        connect_args={"check_same_thread": False}
    )
    is_sql_server = False
    
SessionLocal = scoped_session(sessionmaker(autocommit=False, autoflush=False, bind=engine))
Base = declarative_base()

# Query statistics
query_stats = {
    'total_queries': 0,
    'slow_queries': 0,
    'cache_hits': 0,
    'cache_misses': 0
}

def get_query_stats():
    """Get query performance statistics"""
    return query_stats.copy()

def reset_query_stats():
    """Reset query statistics"""
    global query_stats
    query_stats = {
        'total_queries': 0,
        'slow_queries': 0,
        'cache_hits': 0,
        'cache_misses': 0
    }

async def init_db():
    """Initialize database and create tables"""
    try:
        # Import models to register them with Base
        from app.models import db_models
        
        # Create all tables
        Base.metadata.create_all(bind=engine)
        logger.info("Database tables created successfully")
        
        # Create indexes for performance
        create_indexes()
        
        # Verify connection
        with engine.connect() as conn:
            result = conn.execute(text("SELECT 1"))
            logger.info(f"Database connection successful: {result.scalar()}")
    except Exception as e:
        logger.error(f"Database initialization failed: {e}")

def create_indexes():
    """Create additional indexes for query optimization"""
    try:
        with engine.connect() as conn:
            # Composite indexes for common query patterns
            indexes = [
                # Conversations - user queries with filtering
                "CREATE INDEX IF NOT EXISTS idx_conversations_user_active ON conversations(user_id, is_active, updated_at DESC)",
                "CREATE INDEX IF NOT EXISTS idx_conversations_user_created ON conversations(user_id, created_at DESC)",
                
                # Messages - conversation queries
                "CREATE INDEX IF NOT EXISTS idx_messages_conversation_time ON messages(conversation_id, timestamp)",
                "CREATE INDEX IF NOT EXISTS idx_messages_agent_type ON messages(conversation_id, agent_type)",
                
                # Feedback - analysis queries
                "CREATE INDEX IF NOT EXISTS idx_feedback_conversation_type ON feedback(conversation_id, type, timestamp DESC)",
                "CREATE INDEX IF NOT EXISTS idx_feedback_type_time ON feedback(type, timestamp DESC)",
                
                # Metrics - analytics queries
                "CREATE INDEX IF NOT EXISTS idx_metrics_user_created ON conversation_metrics(user_id, created_at DESC)",
                "CREATE INDEX IF NOT EXISTS idx_metrics_agent_created ON conversation_metrics(agent_type, created_at DESC)",
                "CREATE INDEX IF NOT EXISTS idx_metrics_created_agent ON conversation_metrics(created_at, agent_type)",
                
                # Knowledge - search queries
                "CREATE INDEX IF NOT EXISTS idx_knowledge_category_verified ON knowledge_entries(category, verified, created_at DESC)",
                "CREATE INDEX IF NOT EXISTS idx_knowledge_source_created ON knowledge_entries(source, created_at DESC)",
            ]
            
            for index_sql in indexes:
                try:
                    conn.execute(text(index_sql))
                    conn.commit()
                except Exception as e:
                    # Index might already exist
                    if "already exists" not in str(e).lower():
                        logger.warning(f"Could not create index: {e}")
            
            logger.info("Database indexes created successfully")
    except Exception as e:
        logger.error(f"Error creating indexes: {e}")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_connection_pool_status():
    """Get connection pool status for monitoring"""
    pool = engine.pool
    return {
        'size': pool.size(),
        'checked_in': pool.checkedin(),
        'checked_out': pool.checkedout(),
        'overflow': pool.overflow(),
        'total': pool.size() + pool.overflow()
    }
