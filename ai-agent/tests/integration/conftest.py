"""
Pytest fixtures for integration tests.
"""
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.core.database import Base, get_db
from app.core.cache import cache_service
import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))

# Test database URL (in-memory SQLite)
TEST_DATABASE_URL = "sqlite:///:memory:"

@pytest.fixture(scope="function")
def test_db():
    """Create a test database for each test."""
    engine = create_engine(TEST_DATABASE_URL, connect_args={"check_same_thread": False})
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    
    # Create tables
    Base.metadata.create_all(bind=engine)
    
    yield TestingSessionLocal()
    
    # Drop tables
    Base.metadata.drop_all(bind=engine)

@pytest.fixture(scope="function")
def client(test_db):
    """Create a test client with dependency overrides."""
    from main import app
    
    # Override database dependency
    def override_get_db():
        try:
            yield test_db
        finally:
            test_db.close()
    
    app.dependency_overrides[get_db] = override_get_db
    
    # Create test client
    with TestClient(app) as test_client:
        yield test_client
    
    # Clean up
    app.dependency_overrides.clear()

@pytest.fixture(scope="function")
async def mock_cache():
    """Mock cache service for testing."""
    # Disable cache for tests
    cache_service.enabled = False
    yield cache_service
    cache_service.enabled = True

@pytest.fixture
def sample_user_id():
    """Sample user ID for testing."""
    return "test_user_123"

@pytest.fixture
def sample_conversation_data():
    """Sample conversation data for testing."""
    return {
        "user_id": "test_user_123",
        "title": "Test Conversation"
    }

@pytest.fixture
def sample_chat_message():
    """Sample chat message for testing."""
    return {
        "message": "What's the best oil for my Honda Civic?",
        "user_id": "test_user_123",
        "context": {"car_make": "Honda", "car_model": "Civic"}
    }

@pytest.fixture
def sample_knowledge_entry():
    """Sample knowledge entry for testing."""
    return {
        "content": "Regular oil changes are essential for engine health. Change oil every 5,000-7,500 miles.",
        "category": "maintenance",
        "source": "test",
        "metadata": {"topic": "oil_change"}
    }
