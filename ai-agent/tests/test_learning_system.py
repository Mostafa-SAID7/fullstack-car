"""
Unit tests for LearningSystem.
"""
import pytest
from unittest.mock import Mock, AsyncMock, patch
from app.services.learning_system import LearningSystem
from app.models.schemas import FeedbackType, KnowledgeCategory


class TestLearningSystem:
    """Test cases for LearningSystem"""
    
    @pytest.fixture
    def learning_system(self, mock_feedback_repository, mock_knowledge_base):
        """Create LearningSystem instance for testing"""
        with patch('app.services.learning_system.FeedbackRepository', return_value=mock_feedback_repository):
            with patch('app.services.learning_system.KnowledgeBase', return_value=mock_knowledge_base):
                return LearningSystem()
    
    @pytest.mark.asyncio
    async def test_record_positive_feedback(self, learning_system):
        """Test recording positive feedback"""
        feedback_data = {
            'conversation_id': 'conv-123',
            'message_id': 'msg-456',
            'type': FeedbackType.POSITIVE,
            'rating': 5,
            'comment': 'Very helpful!'
        }
        
        learning_system.feedback_repo.save = AsyncMock(return_value=True)
        
        result = await learning_system.record_feedback(feedback_data)
        
        assert result == True
        learning_system.feedback_repo.save.assert_called_once()
    
    @pytest.mark.asyncio
    async def test_record_negative_feedback(self, learning_system):
        """Test recording negative feedback"""
        feedback_data = {
            'conversation_id': 'conv-123',
            'message_id': 'msg-456',
            'type': FeedbackType.NEGATIVE,
            'rating': 2,
            'comment': 'Not accurate'
        }
        
        learning_system.feedback_repo.save = AsyncMock(return_value=True)
        
        result = await learning_system.record_feedback(feedback_data)
        
        assert result == True
        learning_system.feedback_repo.save.assert_called_once()
    
    @pytest.mark.asyncio
    async def test_process_correction(self, learning_system):
        """Test processing user correction and adding to knowledge base"""
        correction_data = {
            'conversation_id': 'conv-123',
            'message_id': 'msg-456',
            'type': FeedbackType.CORRECTION,
            'query': 'What oil should I use?',
            'correction': 'Use 5W-30 synthetic oil for modern engines'
        }
        
        learning_system.feedback_repo.save = AsyncMock(return_value=True)
        learning_system.knowledge_base.add_knowledge = AsyncMock(return_value='kb-789')
        
        result = await learning_system.record_feedback(correction_data)
        
        assert result == True
        learning_system.feedback_repo.save.assert_called_once()
        learning_system.knowledge_base.add_knowledge.assert_called_once()
        
        # Check that correction was added to knowledge base
        call_args = learning_system.knowledge_base.add_knowledge.call_args
        assert 'correction' in str(call_args)
    
    @pytest.mark.asyncio
    async def test_analyze_patterns(self, learning_system):
        """Test analyzing feedback patterns"""
        # Mock feedback data
        learning_system.feedback_repo.get_recent = AsyncMock(return_value=[
            {'type': FeedbackType.NEGATIVE, 'comment': 'Wrong information about oil'},
            {'type': FeedbackType.NEGATIVE, 'comment': 'Incorrect maintenance schedule'},
            {'type': FeedbackType.POSITIVE, 'comment': 'Great help!'},
            {'type': FeedbackType.NEGATIVE, 'comment': 'Oil recommendation was wrong'}
        ])
        
        patterns = await learning_system.analyze_patterns(days=30)
        
        assert 'negative_patterns' in patterns
        assert 'common_issues' in patterns
        assert len(patterns['negative_patterns']) > 0
        # Should identify 'oil' as a common issue
        assert any('oil' in str(pattern).lower() for pattern in patterns['negative_patterns'])
    
    @pytest.mark.asyncio
    async def test_identify_knowledge_gaps(self, learning_system):
        """Test identifying knowledge gaps from feedback"""
        learning_system.feedback_repo.get_by_type = AsyncMock(return_value=[
            {
                'type': FeedbackType.CORRECTION,
                'query': 'What is the best tire pressure?',
                'correction': '32 PSI for most cars'
            },
            {
                'type': FeedbackType.NEGATIVE,
                'comment': 'No information about electric cars'
            }
        ])
        
        gaps = await learning_system.identify_knowledge_gaps()
        
        assert len(gaps) > 0
        assert any('tire pressure' in str(gap).lower() for gap in gaps)
    
    @pytest.mark.asyncio
    async def test_generate_improvement_suggestions(self, learning_system):
        """Test generating improvement suggestions"""
        learning_system.feedback_repo.get_recent = AsyncMock(return_value=[
            {'type': FeedbackType.NEGATIVE, 'comment': 'Response too technical'},
            {'type': FeedbackType.NEGATIVE, 'comment': 'Too much jargon'},
            {'type': FeedbackType.POSITIVE, 'comment': 'Clear explanation'}
        ])
        
        suggestions = await learning_system.generate_improvement_suggestions()
        
        assert len(suggestions) > 0
        assert any('technical' in str(s).lower() or 'jargon' in str(s).lower() for s in suggestions)
    
    @pytest.mark.asyncio
    async def test_learning_progress_tracking(self, learning_system):
        """Test tracking learning progress over time"""
        learning_system.feedback_repo.get_statistics = AsyncMock(return_value={
            'total_feedback': 100,
            'positive': 70,
            'negative': 20,
            'corrections': 10
        })
        
        progress = await learning_system.get_learning_progress()
        
        assert 'satisfaction_rate' in progress
        assert progress['satisfaction_rate'] == 0.7  # 70/100
        assert 'total_corrections' in progress
        assert progress['total_corrections'] == 10
    
    @pytest.mark.asyncio
    async def test_correction_export(self, learning_system):
        """Test exporting corrections for review"""
        learning_system.feedback_repo.get_by_type = AsyncMock(return_value=[
            {
                'id': 'fb-1',
                'query': 'Oil type?',
                'correction': '5W-30 synthetic',
                'timestamp': '2024-01-01'
            },
            {
                'id': 'fb-2',
                'query': 'Tire pressure?',
                'correction': '32 PSI',
                'timestamp': '2024-01-02'
            }
        ])
        
        corrections = await learning_system.export_corrections()
        
        assert len(corrections) == 2
        assert all('query' in c and 'correction' in c for c in corrections)
    
    @pytest.mark.asyncio
    async def test_feedback_analytics(self, learning_system):
        """Test feedback analytics"""
        learning_system.feedback_repo.get_all = AsyncMock(return_value=[
            {'type': FeedbackType.POSITIVE, 'rating': 5},
            {'type': FeedbackType.POSITIVE, 'rating': 4},
            {'type': FeedbackType.NEGATIVE, 'rating': 2},
            {'type': FeedbackType.CORRECTION}
        ])
        
        analytics = await learning_system.get_feedback_analytics()
        
        assert 'total_feedback' in analytics
        assert analytics['total_feedback'] == 4
        assert 'positive_rate' in analytics
        assert analytics['positive_rate'] == 0.5  # 2/4
        assert 'average_rating' in analytics
    
    @pytest.mark.asyncio
    async def test_learning_report_generation(self, learning_system):
        """Test generating comprehensive learning report"""
        learning_system.feedback_repo.get_statistics = AsyncMock(return_value={
            'total_feedback': 100,
            'positive': 75,
            'negative': 15,
            'corrections': 10
        })
        learning_system.feedback_repo.get_recent = AsyncMock(return_value=[])
        learning_system.feedback_repo.get_by_type = AsyncMock(return_value=[])
        
        report = await learning_system.generate_learning_report(days=30)
        
        assert 'satisfaction_rate' in report
        assert 'total_feedback' in report
        assert 'knowledge_gaps' in report
        assert 'improvement_suggestions' in report
        assert 'patterns' in report
    
    @pytest.mark.asyncio
    async def test_correction_verification(self, learning_system):
        """Test correction verification before adding to knowledge base"""
        correction_data = {
            'type': FeedbackType.CORRECTION,
            'query': 'Test query',
            'correction': 'Test correction'
        }
        
        learning_system.feedback_repo.save = AsyncMock(return_value=True)
        learning_system.knowledge_base.add_knowledge = AsyncMock(return_value='kb-123')
        
        # Correction should be added with verified=False initially
        await learning_system.record_feedback(correction_data)
        
        call_args = learning_system.knowledge_base.add_knowledge.call_args
        assert call_args[1]['verified'] == False
    
    @pytest.mark.asyncio
    async def test_feedback_trends(self, learning_system):
        """Test analyzing feedback trends over time"""
        learning_system.feedback_repo.get_by_date_range = AsyncMock(return_value=[
            {'type': FeedbackType.POSITIVE, 'timestamp': '2024-01-01'},
            {'type': FeedbackType.POSITIVE, 'timestamp': '2024-01-02'},
            {'type': FeedbackType.NEGATIVE, 'timestamp': '2024-01-03'},
            {'type': FeedbackType.POSITIVE, 'timestamp': '2024-01-04'}
        ])
        
        trends = await learning_system.analyze_feedback_trends(days=7)
        
        assert 'daily_feedback' in trends
        assert 'satisfaction_trend' in trends
        # Trend should show improvement (more positive over time)
    
    @pytest.mark.asyncio
    async def test_agent_specific_learning(self, learning_system):
        """Test learning specific to each agent type"""
        learning_system.feedback_repo.get_by_agent = AsyncMock(return_value=[
            {'agent_type': 'mechanic', 'type': FeedbackType.NEGATIVE},
            {'agent_type': 'mechanic', 'type': FeedbackType.POSITIVE},
            {'agent_type': 'mechanic', 'type': FeedbackType.POSITIVE'}
        ])
        
        agent_learning = await learning_system.get_agent_learning_stats('mechanic')
        
        assert 'total_feedback' in agent_learning
        assert agent_learning['total_feedback'] == 3
        assert 'satisfaction_rate' in agent_learning
        assert agent_learning['satisfaction_rate'] > 0.5
    
    @pytest.mark.asyncio
    async def test_error_handling_invalid_feedback(self, learning_system):
        """Test error handling with invalid feedback data"""
        invalid_feedback = {
            'type': 'invalid_type'
        }
        
        with pytest.raises(ValueError):
            await learning_system.record_feedback(invalid_feedback)
    
    @pytest.mark.asyncio
    async def test_statistics(self, learning_system):
        """Test learning system statistics"""
        learning_system.feedback_repo.get_statistics = AsyncMock(return_value={
            'total_feedback': 200,
            'positive': 150,
            'negative': 30,
            'corrections': 20
        })
        
        stats = await learning_system.get_statistics()
        
        assert stats['total_feedback'] == 200
        assert stats['satisfaction_rate'] == 0.75
        assert stats['correction_rate'] == 0.1
