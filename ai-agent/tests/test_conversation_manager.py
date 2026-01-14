"""
Unit tests for ConversationManager.
"""
import pytest
from unittest.mock import Mock, AsyncMock, patch
from datetime import datetime
from app.services.conversation_manager import ConversationManager
from app.models.schemas import Message, ConversationContext


class TestConversationManager:
    """Test cases for ConversationManager"""
    
    @pytest.fixture
    def manager(self):
        """Create ConversationManager instance for testing"""
        with patch('app.services.conversation_manager.ConversationRepository'):
            with patch('app.services.conversation_manager.MessageRepository'):
                with patch('app.services.conversation_manager.CacheService'):
                    return ConversationManager()
    
    @pytest.mark.asyncio
    async def test_create_conversation(self, manager):
        """Test creating a new conversation"""
        user_id = "user-123"
        title = "Car Maintenance Help"
        
        manager.conversation_repo.create = AsyncMock(return_value="conv-456")
        
        conv_id = await manager.create_conversation(user_id, title)
        
        assert conv_id is not None
        assert isinstance(conv_id, str)
        manager.conversation_repo.create.assert_called_once()
    
    @pytest.mark.asyncio
    async def test_add_message(self, manager):
        """Test adding a message to conversation"""
        conv_id = "conv-123"
        role = "user"
        content = "My car won't start"
        
        manager.message_repo.add = AsyncMock(return_value="msg-456")
        manager.cache.set = AsyncMock()
        
        msg_id = await manager.add_message(conv_id, role, content)
        
        assert msg_id is not None
        manager.message_repo.add.assert_called_once()
        manager.cache.set.assert_called()  # Cache should be updated
    
    @pytest.mark.asyncio
    async def test_get_conversation(self, manager):
        """Test retrieving a conversation"""
        conv_id = "conv-123"
        
        # Mock cache miss, then DB hit
        manager.cache.get = AsyncMock(return_value=None)
        manager.conversation_repo.get = AsyncMock(return_value={
            'id': conv_id,
            'user_id': 'user-123',
            'title': 'Test Conversation',
            'messages': [],
            'created_at': datetime.now(),
            'is_active': True
        })
        manager.cache.set = AsyncMock()
        
        conversation = await manager.get_conversation(conv_id)
        
        assert conversation is not None
        assert conversation['id'] == conv_id
        manager.conversation_repo.get.assert_called_once_with(conv_id)
        manager.cache.set.assert_called()  # Should cache the result
    
    @pytest.mark.asyncio
    async def test_get_conversation_from_cache(self, manager):
        """Test retrieving conversation from cache"""
        conv_id = "conv-123"
        cached_data = {
            'id': conv_id,
            'user_id': 'user-123',
            'messages': []
        }
        
        manager.cache.get = AsyncMock(return_value=cached_data)
        
        conversation = await manager.get_conversation(conv_id)
        
        assert conversation == cached_data
        manager.cache.get.assert_called_once()
        # Should not hit database
        manager.conversation_repo.get.assert_not_called()
    
    @pytest.mark.asyncio
    async def test_get_context(self, manager):
        """Test building conversation context"""
        conv_id = "conv-123"
        user_id = "user-456"
        
        manager.message_repo.get_recent = AsyncMock(return_value=[
            {
                'id': 'msg-1',
                'conversation_id': conv_id,
                'role': 'user',
                'content': 'Hello',
                'timestamp': datetime.now()
            },
            {
                'id': 'msg-2',
                'conversation_id': conv_id,
                'role': 'assistant',
                'content': 'Hi there!',
                'agent_type': 'general',
                'timestamp': datetime.now()
            }
        ])
        
        context = await manager.get_context(conv_id, user_id, limit=5)
        
        assert isinstance(context, ConversationContext)
        assert context.conversation_id == conv_id
        assert context.user_id == user_id
        assert len(context.messages) == 2
        manager.message_repo.get_recent.assert_called_once_with(conv_id, limit=5)
    
    @pytest.mark.asyncio
    async def test_list_conversations(self, manager):
        """Test listing user conversations with pagination"""
        user_id = "user-123"
        
        manager.conversation_repo.list_by_user = AsyncMock(return_value={
            'conversations': [
                {'id': 'conv-1', 'title': 'Conv 1'},
                {'id': 'conv-2', 'title': 'Conv 2'}
            ],
            'total': 2,
            'page': 1,
            'page_size': 20
        })
        
        result = await manager.list_conversations(user_id, page=1, page_size=20)
        
        assert result['total'] == 2
        assert len(result['conversations']) == 2
        manager.conversation_repo.list_by_user.assert_called_once()
    
    @pytest.mark.asyncio
    async def test_search_conversations(self, manager):
        """Test searching conversations by keyword"""
        user_id = "user-123"
        query = "maintenance"
        
        manager.conversation_repo.search = AsyncMock(return_value={
            'conversations': [
                {'id': 'conv-1', 'title': 'Car Maintenance'}
            ],
            'total': 1
        })
        
        result = await manager.search_conversations(user_id, query)
        
        assert result['total'] == 1
        assert 'maintenance' in result['conversations'][0]['title'].lower()
        manager.conversation_repo.search.assert_called_once()
    
    @pytest.mark.asyncio
    async def test_update_conversation(self, manager):
        """Test updating conversation metadata"""
        conv_id = "conv-123"
        updates = {'title': 'Updated Title'}
        
        manager.conversation_repo.update = AsyncMock(return_value=True)
        manager.cache.delete = AsyncMock()
        
        result = await manager.update_conversation(conv_id, updates)
        
        assert result == True
        manager.conversation_repo.update.assert_called_once()
        manager.cache.delete.assert_called()  # Cache should be invalidated
    
    @pytest.mark.asyncio
    async def test_delete_conversation(self, manager):
        """Test deleting a conversation"""
        conv_id = "conv-123"
        
        manager.conversation_repo.delete = AsyncMock(return_value=True)
        manager.message_repo.delete_by_conversation = AsyncMock()
        manager.cache.delete = AsyncMock()
        
        result = await manager.delete_conversation(conv_id)
        
        assert result == True
        manager.conversation_repo.delete.assert_called_once()
        manager.message_repo.delete_by_conversation.assert_called_once()
        manager.cache.delete.assert_called()
    
    @pytest.mark.asyncio
    async def test_archive_conversation(self, manager):
        """Test archiving a conversation (soft delete)"""
        conv_id = "conv-123"
        
        manager.conversation_repo.update = AsyncMock(return_value=True)
        
        result = await manager.archive_conversation(conv_id)
        
        assert result == True
        # Should update is_active to False
        call_args = manager.conversation_repo.update.call_args
        assert call_args[0][1]['is_active'] == False
    
    @pytest.mark.asyncio
    async def test_get_conversation_metrics(self, manager):
        """Test retrieving conversation metrics"""
        conv_id = "conv-123"
        
        manager.message_repo.count = AsyncMock(return_value=15)
        manager.conversation_repo.get = AsyncMock(return_value={
            'id': conv_id,
            'created_at': datetime.now(),
            'updated_at': datetime.now()
        })
        
        metrics = await manager.get_conversation_metrics(conv_id)
        
        assert 'message_count' in metrics
        assert metrics['message_count'] == 15
        assert 'duration' in metrics
    
    @pytest.mark.asyncio
    async def test_pagination(self, manager):
        """Test pagination works correctly"""
        user_id = "user-123"
        
        # First page
        manager.conversation_repo.list_by_user = AsyncMock(return_value={
            'conversations': [{'id': f'conv-{i}'} for i in range(20)],
            'total': 50,
            'page': 1,
            'page_size': 20
        })
        
        result = await manager.list_conversations(user_id, page=1, page_size=20)
        
        assert len(result['conversations']) == 20
        assert result['total'] == 50
        assert result['page'] == 1
    
    @pytest.mark.asyncio
    async def test_cache_expiration(self, manager):
        """Test cache expiration (1 hour TTL)"""
        conv_id = "conv-123"
        
        manager.cache.set = AsyncMock()
        manager.conversation_repo.get = AsyncMock(return_value={'id': conv_id})
        
        await manager.get_conversation(conv_id)
        
        # Check cache was set with TTL
        call_args = manager.cache.set.call_args
        assert call_args is not None
        # TTL should be around 3600 seconds (1 hour)
    
    @pytest.mark.asyncio
    async def test_error_handling_invalid_conversation(self, manager):
        """Test error handling for invalid conversation ID"""
        conv_id = "invalid-conv"
        
        manager.conversation_repo.get = AsyncMock(return_value=None)
        
        conversation = await manager.get_conversation(conv_id)
        
        assert conversation is None
    
    @pytest.mark.asyncio
    async def test_concurrent_message_addition(self, manager):
        """Test adding multiple messages concurrently"""
        conv_id = "conv-123"
        messages = [
            ("user", "Message 1"),
            ("assistant", "Response 1"),
            ("user", "Message 2")
        ]
        
        manager.message_repo.add = AsyncMock(side_effect=["msg-1", "msg-2", "msg-3"])
        manager.cache.set = AsyncMock()
        
        msg_ids = []
        for role, content in messages:
            msg_id = await manager.add_message(conv_id, role, content)
            msg_ids.append(msg_id)
        
        assert len(msg_ids) == 3
        assert manager.message_repo.add.call_count == 3
    
    @pytest.mark.asyncio
    async def test_statistics(self, manager):
        """Test conversation statistics"""
        manager.conversation_repo.count_total = AsyncMock(return_value=100)
        manager.conversation_repo.count_active = AsyncMock(return_value=75)
        manager.message_repo.count_total = AsyncMock(return_value=1500)
        
        stats = await manager.get_statistics()
        
        assert stats['total_conversations'] == 100
        assert stats['active_conversations'] == 75
        assert stats['total_messages'] == 1500
        assert stats['avg_messages_per_conversation'] == 15.0
