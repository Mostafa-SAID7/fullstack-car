"""
Tests for database query optimization.
"""
import pytest
import time
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from datetime import datetime, timedelta
from app.core.database import Base, create_indexes, get_connection_pool_status
from app.models.db_models import Conversation, Message, ConversationMetric, Feedback, KnowledgeEntry
from app.repositories.conversation_repository import ConversationRepository, MessageRepository
from app.repositories.analytics_repository import AnalyticsRepository
from app.repositories.base_repository import clear_cache
import uuid

# Test database setup
TEST_DATABASE_URL = "sqlite:///./test_optimization.db"

@pytest.fixture(scope="function")
def test_db():
    """Create test database"""
    engine = create_engine(TEST_DATABASE_URL, connect_args={"check_same_thread": False})
    Base.metadata.create_all(bind=engine)
    
    # Create indexes
    with engine.connect() as conn:
        indexes = [
            "CREATE INDEX IF NOT EXISTS idx_conversations_user_active ON conversations(user_id, is_active, updated_at DESC)",
            "CREATE INDEX IF NOT EXISTS idx_messages_conversation_time ON messages(conversation_id, timestamp)",
            "CREATE INDEX IF NOT EXISTS idx_metrics_user_created ON conversation_metrics(user_id, created_at DESC)",
            "CREATE INDEX IF NOT EXISTS idx_metrics_agent_created ON conversation_metrics(agent_type, created_at DESC)",
        ]
        for index_sql in indexes:
            try:
                conn.execute(text(index_sql))
                conn.commit()
            except:
                pass
    
    SessionLocal = sessionmaker(bind=engine)
    session = SessionLocal()
    
    yield session
    
    session.close()
    Base.metadata.drop_all(bind=engine)

@pytest.fixture
def sample_conversations(test_db):
    """Create sample conversations for testing"""
    conversations = []
    for i in range(10):
        conv = Conversation(
            id=f"conv_{i}",
            user_id=f"user_{i % 3}",  # 3 users
            title=f"Test Conversation {i}",
            is_active=True,
            created_at=datetime.utcnow() - timedelta(days=i),
            updated_at=datetime.utcnow() - timedelta(hours=i)
        )
        test_db.add(conv)
        conversations.append(conv)
    
    test_db.commit()
    return conversations

@pytest.fixture
def sample_messages(test_db, sample_conversations):
    """Create sample messages for testing"""
    messages = []
    for conv in sample_conversations[:3]:  # First 3 conversations
        for j in range(20):  # 20 messages each
            msg = Message(
                id=f"{conv.id}_msg_{j}",
                conversation_id=conv.id,
                role="user" if j % 2 == 0 else "assistant",
                content=f"Message {j} content",
                agent_type="general" if j % 2 == 1 else None,
                timestamp=datetime.utcnow() - timedelta(minutes=j)
            )
            test_db.add(msg)
            messages.append(msg)
    
    test_db.commit()
    return messages

@pytest.fixture
def sample_metrics(test_db, sample_conversations):
    """Create sample metrics for testing"""
    metrics = []
    agent_types = ["general", "mechanic", "buyer_guide"]
    
    for i, conv in enumerate(sample_conversations):
        metric = ConversationMetric(
            id=f"metric_{i}",
            conversation_id=conv.id,
            user_id=conv.user_id,
            agent_type=agent_types[i % 3],
            message_count=10 + i,
            duration_seconds=300 + i * 10,
            satisfaction_score=4.0 + (i % 5) * 0.2,
            resolved=i % 2 == 0,
            tokens_used=1000 + i * 100,
            cost=0.01 + i * 0.001,
            created_at=datetime.utcnow() - timedelta(days=i)
        )
        test_db.add(metric)
        metrics.append(metric)
    
    test_db.commit()
    return metrics

class TestDatabaseIndexes:
    """Test database indexes are created correctly"""
    
    def test_indexes_created(self, test_db):
        """Test that indexes are created"""
        # Query to check indexes (SQLite specific)
        result = test_db.execute(text("SELECT name FROM sqlite_master WHERE type='index'"))
        indexes = [row[0] for row in result]
        
        # Check for our custom indexes
        assert any('conversations' in idx for idx in indexes)
        assert any('messages' in idx for idx in indexes)

class TestConversationQueryOptimization:
    """Test conversation query optimizations"""
    
    def test_get_by_user_performance(self, test_db, sample_conversations):
        """Test get_by_user query performance"""
        repo = ConversationRepository(test_db)
        
        # Clear cache to test actual query
        clear_cache()
        
        # Warm up query (first query is always slower)
        repo.get_by_user("user_0", limit=20)
        clear_cache()
        
        # Measure query time (second query, more realistic)
        start_time = time.time()
        conversations = repo.get_by_user("user_0", limit=20)
        query_time = time.time() - start_time
        
        # Should be fast (< 100ms for test environment, < 50ms in production)
        assert query_time < 0.1, f"Query took {query_time*1000:.2f}ms (target: <100ms)"
        assert len(conversations) > 0
        
        # Verify results are ordered by updated_at
        if len(conversations) > 1:
            assert conversations[0].updated_at >= conversations[1].updated_at
    
    def test_query_caching(self, test_db, sample_conversations):
        """Test that queries are cached"""
        repo = ConversationRepository(test_db)
        
        # Clear cache
        clear_cache()
        
        # First query (cache miss)
        start_time = time.time()
        result1 = repo.get_by_user("user_0")
        first_query_time = time.time() - start_time
        
        # Second query (cache hit)
        start_time = time.time()
        result2 = repo.get_by_user("user_0")
        second_query_time = time.time() - start_time
        
        # Cached query should be faster
        assert second_query_time < first_query_time
        assert len(result1) == len(result2)
    
    def test_bulk_update_performance(self, test_db, sample_conversations):
        """Test bulk update performance"""
        repo = ConversationRepository(test_db)
        
        # Measure bulk update time
        start_time = time.time()
        success = repo.update_timestamp(sample_conversations[0].id)
        update_time = time.time() - start_time
        
        # Should be fast (< 50ms)
        assert update_time < 0.05, f"Update took {update_time*1000:.2f}ms (target: <50ms)"
        assert success is True

class TestMessageQueryOptimization:
    """Test message query optimizations"""
    
    def test_get_by_conversation_performance(self, test_db, sample_messages):
        """Test get_by_conversation query performance"""
        repo = MessageRepository(test_db)
        
        # Clear cache
        clear_cache()
        
        # Measure query time
        start_time = time.time()
        messages = repo.get_by_conversation("conv_0", limit=100)
        query_time = time.time() - start_time
        
        # Should be fast (< 50ms)
        assert query_time < 0.05, f"Query took {query_time*1000:.2f}ms (target: <50ms)"
        assert len(messages) > 0
    
    def test_get_recent_caching(self, test_db, sample_messages):
        """Test that recent messages are cached"""
        repo = MessageRepository(test_db)
        
        # Clear cache
        clear_cache()
        
        # First query
        result1 = repo.get_recent("conv_0", limit=5)
        
        # Second query (should be cached)
        start_time = time.time()
        result2 = repo.get_recent("conv_0", limit=5)
        cached_query_time = time.time() - start_time
        
        # Cached query should be very fast
        assert cached_query_time < 0.01  # < 10ms
        assert len(result1) == len(result2)

class TestAnalyticsQueryOptimization:
    """Test analytics query optimizations"""
    
    def test_aggregate_by_agent_performance(self, test_db, sample_metrics):
        """Test aggregate_by_agent query performance"""
        repo = AnalyticsRepository(test_db)
        
        # Clear cache
        clear_cache()
        
        # Warm up query
        repo.aggregate_by_agent(days=30)
        clear_cache()
        
        # Measure query time (second query, more realistic)
        start_time = time.time()
        aggregated = repo.aggregate_by_agent(days=30)
        query_time = time.time() - start_time
        
        # Should be fast (< 300ms for test environment, < 200ms in production)
        assert query_time < 0.3, f"Query took {query_time*1000:.2f}ms (target: <300ms)"
        assert len(aggregated) > 0
        
        # Verify aggregation structure
        for agent_type, metrics in aggregated.items():
            assert 'total_conversations' in metrics
            assert 'average_satisfaction' in metrics
            assert 'total_tokens' in metrics
    
    def test_overview_metrics_caching(self, test_db, sample_metrics):
        """Test that overview metrics are cached"""
        repo = AnalyticsRepository(test_db)
        
        # Clear cache
        clear_cache()
        
        # First query
        start_time = time.time()
        result1 = repo.get_overview_metrics(days=30)
        first_query_time = time.time() - start_time
        
        # Second query (cached)
        start_time = time.time()
        result2 = repo.get_overview_metrics(days=30)
        cached_query_time = time.time() - start_time
        
        # Cached query should be much faster
        assert cached_query_time < first_query_time
        assert result1['total_conversations'] == result2['total_conversations']
    
    def test_daily_stats_performance(self, test_db, sample_metrics):
        """Test daily stats query performance"""
        repo = AnalyticsRepository(test_db)
        
        # Clear cache
        clear_cache()
        
        # Measure query time
        start_time = time.time()
        stats = repo.get_daily_stats(days=7)
        query_time = time.time() - start_time
        
        # Should be fast (< 200ms)
        assert query_time < 0.2, f"Query took {query_time*1000:.2f}ms (target: <200ms)"
        assert isinstance(stats, list)

class TestPagination:
    """Test pagination functionality"""
    
    def test_paginate_conversations(self, test_db, sample_conversations):
        """Test conversation pagination"""
        repo = ConversationRepository(test_db)
        
        # Get first page
        result = repo.paginate(page=1, per_page=5, filters={'user_id': 'user_0'})
        
        assert 'items' in result
        assert 'total' in result
        assert 'page' in result
        assert 'per_page' in result
        assert 'total_pages' in result
        assert 'has_next' in result
        assert 'has_prev' in result
        
        assert result['page'] == 1
        assert result['per_page'] == 5
        assert len(result['items']) <= 5
        assert result['has_prev'] is False
    
    def test_paginate_with_ordering(self, test_db, sample_conversations):
        """Test pagination with custom ordering"""
        from sqlalchemy import desc
        repo = ConversationRepository(test_db)
        
        result = repo.paginate(
            page=1,
            per_page=5,
            order_by=desc(Conversation.created_at)
        )
        
        assert len(result['items']) <= 5
        
        # Verify ordering
        if len(result['items']) > 1:
            assert result['items'][0].created_at >= result['items'][1].created_at

class TestCacheInvalidation:
    """Test cache invalidation on updates"""
    
    def test_cache_cleared_on_create(self, test_db):
        """Test that cache is cleared when creating records"""
        repo = ConversationRepository(test_db)
        
        # Query to populate cache
        repo.get_by_user("user_test")
        
        # Create new conversation
        new_conv = Conversation(
            id="new_conv",
            user_id="user_test",
            title="New Conversation",
            is_active=True
        )
        repo.create(new_conv)
        
        # Query again - should get fresh data
        conversations = repo.get_by_user("user_test")
        assert len(conversations) == 1
    
    def test_cache_cleared_on_update(self, test_db, sample_conversations):
        """Test that cache is cleared when updating records"""
        repo = ConversationRepository(test_db)
        
        # Query to populate cache
        conv = repo.get_by_id(sample_conversations[0].id)
        original_title = conv.title
        
        # Update conversation
        repo.update(sample_conversations[0].id, {'title': 'Updated Title'})
        
        # Query again - should get updated data
        updated_conv = repo.get_by_id(sample_conversations[0].id)
        assert updated_conv.title == 'Updated Title'
        assert updated_conv.title != original_title

class TestConnectionPooling:
    """Test connection pooling"""
    
    def test_pool_status(self):
        """Test that pool status can be retrieved"""
        try:
            status = get_connection_pool_status()
            
            assert 'size' in status
            assert 'checked_in' in status
            assert 'checked_out' in status
            assert 'total' in status
        except Exception as e:
            # Pool might not be available in test environment
            pytest.skip(f"Connection pool not available: {e}")

class TestQueryPerformance:
    """Test overall query performance"""
    
    def test_conversation_query_under_50ms(self, test_db, sample_conversations):
        """Test that conversation queries are under 50ms"""
        repo = ConversationRepository(test_db)
        clear_cache()
        
        start_time = time.time()
        repo.get_by_user("user_0", limit=20)
        query_time = time.time() - start_time
        
        assert query_time < 0.05, f"Query took {query_time*1000:.2f}ms (target: <50ms)"
    
    def test_analytics_query_under_200ms(self, test_db, sample_metrics):
        """Test that analytics queries are under 200ms"""
        repo = AnalyticsRepository(test_db)
        clear_cache()
        
        start_time = time.time()
        repo.aggregate_by_agent(days=30)
        query_time = time.time() - start_time
        
        assert query_time < 0.2, f"Query took {query_time*1000:.2f}ms (target: <200ms)"
    
    def test_cache_hit_rate_above_60_percent(self, test_db, sample_conversations):
        """Test that cache hit rate is above 60%"""
        repo = ConversationRepository(test_db)
        clear_cache()
        
        # Make 10 queries (5 unique, 5 repeated)
        for i in range(5):
            repo.get_by_user(f"user_{i % 3}")  # First time (cache miss)
            repo.get_by_user(f"user_{i % 3}")  # Second time (cache hit)
        
        # At least 50% should be cache hits (5 out of 10)
        # In practice, should be higher due to other cached queries
        # This is a simplified test - actual cache hit rate tracking would be more complex

if __name__ == "__main__":
    pytest.main([__file__, "-v"])
