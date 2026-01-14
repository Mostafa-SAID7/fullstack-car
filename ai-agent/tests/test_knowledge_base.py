"""
Unit tests for KnowledgeBase.
"""
import pytest
from unittest.mock import Mock, patch, MagicMock
from app.services.knowledge_base import KnowledgeBase
from app.models.schemas import KnowledgeCategory


class TestKnowledgeBase:
    """Test cases for KnowledgeBase"""
    
    @pytest.fixture
    def knowledge_base(self):
        """Create KnowledgeBase instance for testing"""
        with patch('app.services.knowledge_base.chromadb'):
            with patch('app.services.knowledge_base.SentenceTransformer'):
                kb = KnowledgeBase()
                # Mock the collection
                kb.collection = MagicMock()
                return kb
    
    @pytest.mark.asyncio
    async def test_add_knowledge(self, knowledge_base):
        """Test adding knowledge entry"""
        content = "Regular oil changes are important for engine health"
        category = KnowledgeCategory.MAINTENANCE
        
        result = await knowledge_base.add_knowledge(
            content=content,
            category=category,
            source="test",
            verified=True
        )
        
        assert result is not None
        knowledge_base.collection.add.assert_called_once()
    
    @pytest.mark.asyncio
    async def test_search_knowledge(self, knowledge_base):
        """Test searching knowledge base"""
        # Mock search results
        knowledge_base.collection.query.return_value = {
            'documents': [[
                'Regular oil changes are important',
                'Check your oil every month'
            ]],
            'metadatas': [[
                {'category': 'maintenance', 'source': 'manual'},
                {'category': 'maintenance', 'source': 'expert'}
            ]],
            'distances': [[0.15, 0.25]]  # Lower distance = higher similarity
        }
        
        query = "How often should I change oil?"
        results = await knowledge_base.search(query, category=KnowledgeCategory.MAINTENANCE)
        
        assert len(results) > 0
        assert results[0]['similarity'] > 0.7  # 1 - 0.15 = 0.85
        assert results[0]['category'] == KnowledgeCategory.MAINTENANCE
        knowledge_base.collection.query.assert_called_once()
    
    @pytest.mark.asyncio
    async def test_search_with_category_filter(self, knowledge_base):
        """Test searching with category filter"""
        knowledge_base.collection.query.return_value = {
            'documents': [['Turbo installation guide']],
            'metadatas': [[{'category': 'modifications', 'source': 'expert'}]],
            'distances': [[0.1]]
        }
        
        query = "How to install turbo"
        results = await knowledge_base.search(
            query, 
            category=KnowledgeCategory.MODIFICATIONS,
            limit=5
        )
        
        assert len(results) > 0
        assert all(r['category'] == KnowledgeCategory.MODIFICATIONS for r in results)
    
    @pytest.mark.asyncio
    async def test_search_relevance_threshold(self, knowledge_base):
        """Test that only relevant results are returned (similarity > 0.7)"""
        knowledge_base.collection.query.return_value = {
            'documents': [['Result 1', 'Result 2', 'Result 3']],
            'metadatas': [[
                {'category': 'maintenance', 'source': 'test'},
                {'category': 'maintenance', 'source': 'test'},
                {'category': 'maintenance', 'source': 'test'}
            ]],
            'distances': [[0.1, 0.4, 0.6]]  # Similarities: 0.9, 0.6, 0.4
        }
        
        results = await knowledge_base.search("test query")
        
        # Only results with similarity > 0.7 should be returned
        assert len(results) == 1
        assert results[0]['similarity'] > 0.7
    
    @pytest.mark.asyncio
    async def test_bulk_import(self, knowledge_base):
        """Test bulk import of knowledge entries"""
        entries = [
            {
                'content': 'Oil change every 5000 miles',
                'category': KnowledgeCategory.MAINTENANCE,
                'source': 'manual'
            },
            {
                'content': 'Check tire pressure monthly',
                'category': KnowledgeCategory.MAINTENANCE,
                'source': 'manual'
            },
            {
                'content': 'BMW 3 Series is reliable',
                'category': KnowledgeCategory.BUYING_GUIDE,
                'source': 'reviews'
            }
        ]
        
        result = await knowledge_base.bulk_import(entries)
        
        assert result['success'] == True
        assert result['imported'] == 3
        assert knowledge_base.collection.add.call_count == 3
    
    @pytest.mark.asyncio
    async def test_update_knowledge(self, knowledge_base):
        """Test updating existing knowledge entry"""
        entry_id = "test-entry-123"
        new_content = "Updated: Oil change every 3000 miles for older cars"
        
        result = await knowledge_base.update_knowledge(
            entry_id=entry_id,
            content=new_content,
            verified=True
        )
        
        assert result is not None
        knowledge_base.collection.update.assert_called_once()
    
    @pytest.mark.asyncio
    async def test_delete_knowledge(self, knowledge_base):
        """Test deleting knowledge entry"""
        entry_id = "test-entry-123"
        
        result = await knowledge_base.delete_knowledge(entry_id)
        
        assert result == True
        knowledge_base.collection.delete.assert_called_once_with(ids=[entry_id])
    
    @pytest.mark.asyncio
    async def test_get_by_category(self, knowledge_base):
        """Test retrieving entries by category"""
        knowledge_base.collection.get.return_value = {
            'documents': ['Entry 1', 'Entry 2'],
            'metadatas': [
                {'category': 'maintenance', 'verified': True},
                {'category': 'maintenance', 'verified': True}
            ],
            'ids': ['id1', 'id2']
        }
        
        results = await knowledge_base.get_by_category(KnowledgeCategory.MAINTENANCE)
        
        assert len(results) == 2
        assert all(r['category'] == KnowledgeCategory.MAINTENANCE for r in results)
    
    @pytest.mark.asyncio
    async def test_embedding_generation(self, knowledge_base):
        """Test that embeddings are generated for content"""
        # Mock embedding model
        knowledge_base.embedding_model = MagicMock()
        knowledge_base.embedding_model.encode.return_value = [[0.1, 0.2, 0.3]]
        
        content = "Test content for embedding"
        await knowledge_base.add_knowledge(content, KnowledgeCategory.MAINTENANCE)
        
        knowledge_base.embedding_model.encode.assert_called_once()
    
    @pytest.mark.asyncio
    async def test_search_with_no_results(self, knowledge_base):
        """Test search with no matching results"""
        knowledge_base.collection.query.return_value = {
            'documents': [[]],
            'metadatas': [[]],
            'distances': [[]]
        }
        
        results = await knowledge_base.search("nonexistent query")
        
        assert len(results) == 0
    
    @pytest.mark.asyncio
    async def test_verified_knowledge_only(self, knowledge_base):
        """Test filtering for verified knowledge only"""
        knowledge_base.collection.query.return_value = {
            'documents': [['Verified entry', 'Unverified entry']],
            'metadatas': [[
                {'category': 'maintenance', 'verified': True},
                {'category': 'maintenance', 'verified': False}
            ]],
            'distances': [[0.1, 0.15]]
        }
        
        results = await knowledge_base.search("test", verified_only=True)
        
        # Should only return verified entries
        assert len(results) == 1
        assert results[0]['verified'] == True
    
    @pytest.mark.asyncio
    async def test_knowledge_statistics(self, knowledge_base):
        """Test knowledge base statistics"""
        knowledge_base.collection.count.return_value = 150
        
        stats = await knowledge_base.get_statistics()
        
        assert 'total_entries' in stats
        assert stats['total_entries'] == 150
    
    @pytest.mark.asyncio
    async def test_error_handling_invalid_category(self, knowledge_base):
        """Test error handling with invalid category"""
        with pytest.raises(ValueError):
            await knowledge_base.add_knowledge(
                content="Test",
                category="invalid_category"
            )
    
    @pytest.mark.asyncio
    async def test_error_handling_empty_content(self, knowledge_base):
        """Test error handling with empty content"""
        with pytest.raises(ValueError):
            await knowledge_base.add_knowledge(
                content="",
                category=KnowledgeCategory.MAINTENANCE
            )
    
    @pytest.mark.asyncio
    async def test_search_limit(self, knowledge_base):
        """Test search respects limit parameter"""
        knowledge_base.collection.query.return_value = {
            'documents': [['R1', 'R2', 'R3', 'R4', 'R5']],
            'metadatas': [[{'category': 'maintenance'}] * 5],
            'distances': [[0.1, 0.15, 0.2, 0.25, 0.3]]
        }
        
        results = await knowledge_base.search("test", limit=3)
        
        assert len(results) <= 3
