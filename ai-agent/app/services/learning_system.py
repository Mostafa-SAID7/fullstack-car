"""
Learning System - Continuous learning from user interactions and feedback.
"""
from typing import Dict, Any, List, Optional
from datetime import datetime, timedelta
from app.repositories.feedback_repository import FeedbackRepository
from app.repositories.analytics_repository import AnalyticsRepository
from app.services.knowledge_base import KnowledgeBase
from app.models.schemas import Feedback, FeedbackType, KnowledgeCategory
import logging
import uuid

logger = logging.getLogger(__name__)


class LearningReport:
    """Report from learning system analysis"""
    
    def __init__(
        self,
        negative_patterns: List[Dict[str, Any]],
        knowledge_gaps: List[str],
        suggestions: List[str],
        period_start: datetime,
        period_end: datetime
    ):
        self.negative_patterns = negative_patterns
        self.knowledge_gaps = knowledge_gaps
        self.suggestions = suggestions
        self.period_start = period_start
        self.period_end = period_end
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            'negative_patterns': self.negative_patterns,
            'knowledge_gaps': self.knowledge_gaps,
            'suggestions': self.suggestions,
            'period_start': self.period_start.isoformat(),
            'period_end': self.period_end.isoformat()
        }


class LearningSystem:
    """
    Continuous learning system that improves agent responses through user feedback.
    
    Features:
    - Records and processes user feedback
    - Identifies patterns in negative feedback
    - Detects knowledge gaps
    - Adds corrections to knowledge base
    - Generates improvement suggestions
    - Provides learning analytics
    """
    
    def __init__(self):
        self.feedback_repo = FeedbackRepository()
        self.analytics_repo = AnalyticsRepository()
        self.knowledge_base = KnowledgeBase()
        
        # Learning statistics
        self.stats = {
            'total_feedback': 0,
            'positive_feedback': 0,
            'negative_feedback': 0,
            'corrections_processed': 0,
            'knowledge_added': 0
        }
        
        logger.info("LearningSystem initialized")
    
    async def record_feedback(
        self,
        conversation_id: str,
        message_id: str,
        feedback_type: FeedbackType,
        feedback_data: Optional[Dict[str, Any]] = None
    ) -> str:
        """
        Record user feedback on agent response.
        
        Args:
            conversation_id: ID of the conversation
            message_id: ID of the message being rated
            feedback_type: Type of feedback (positive, negative, correction)
            feedback_data: Additional feedback data (correction text, reason, etc.)
            
        Returns:
            Feedback ID
        """
        logger.info(f"Recording {feedback_type} feedback for message {message_id}")
        
        # Create feedback object
        feedback = Feedback(
            id=str(uuid.uuid4()),
            conversation_id=conversation_id,
            message_id=message_id,
            type=feedback_type,
            data=feedback_data or {},
            timestamp=datetime.utcnow()
        )
        
        # Save to database
        await self.feedback_repo.save(feedback)
        
        # Update statistics
        self.stats['total_feedback'] += 1
        if feedback_type == FeedbackType.POSITIVE:
            self.stats['positive_feedback'] += 1
        elif feedback_type == FeedbackType.NEGATIVE:
            self.stats['negative_feedback'] += 1
        
        # Process correction immediately
        if feedback_type == FeedbackType.CORRECTION:
            await self._process_correction(feedback)
        
        logger.info(f"Feedback recorded: {feedback.id}")
        return feedback.id
    
    async def _process_correction(self, feedback: Feedback) -> None:
        """
        Process user correction and add to knowledge base.
        
        Args:
            feedback: Feedback object with correction data
        """
        logger.info(f"Processing correction from feedback {feedback.id}")
        
        try:
            # Extract correction data
            correction_text = feedback.data.get('correction')
            original_query = feedback.data.get('query')
            original_response = feedback.data.get('response')
            category = feedback.data.get('category', 'general')
            
            if not correction_text or not original_query:
                logger.warning("Correction missing required data")
                return
            
            # Build knowledge entry content
            content = f"Q: {original_query}\nA: {correction_text}"
            
            if original_response:
                content += f"\n\nNote: Original response was: {original_response[:100]}..."
            
            # Map category string to KnowledgeCategory enum
            category_mapping = {
                'maintenance': KnowledgeCategory.MAINTENANCE,
                'diagnostics': KnowledgeCategory.DIAGNOSTICS,
                'buying_guide': KnowledgeCategory.BUYING_GUIDE,
                'selling_tips': KnowledgeCategory.SELLING_TIPS,
                'modifications': KnowledgeCategory.MODIFICATIONS,
                'car_specs': KnowledgeCategory.CAR_SPECS,
                'community_help': KnowledgeCategory.COMMUNITY_HELP
            }
            knowledge_category = category_mapping.get(category, KnowledgeCategory.COMMUNITY_HELP)
            
            # Add to knowledge base
            metadata = {
                'source': 'user_correction',
                'feedback_id': feedback.id,
                'conversation_id': feedback.conversation_id,
                'timestamp': feedback.timestamp.isoformat(),
                'verified': False,  # Requires manual verification
                'category': category
            }
            
            knowledge_id = await self.knowledge_base.add_knowledge(
                content=content,
                category=knowledge_category,
                metadata=metadata
            )
            
            # Update statistics
            self.stats['corrections_processed'] += 1
            self.stats['knowledge_added'] += 1
            
            logger.info(f"Correction added to knowledge base: {knowledge_id}")
            
        except Exception as e:
            logger.error(f"Failed to process correction: {e}")
    
    async def analyze_patterns(
        self,
        days: int = 30
    ) -> LearningReport:
        """
        Analyze feedback patterns to identify improvement opportunities.
        
        Args:
            days: Number of days to analyze
            
        Returns:
            LearningReport with patterns, gaps, and suggestions
        """
        logger.info(f"Analyzing feedback patterns for last {days} days")
        
        period_end = datetime.utcnow()
        period_start = period_end - timedelta(days=days)
        
        # Get recent feedback
        recent_feedback = await self.feedback_repo.get_recent(days=days)
        
        # Identify negative patterns
        negative_patterns = self._identify_negative_patterns(recent_feedback)
        
        # Identify knowledge gaps
        knowledge_gaps = self._identify_knowledge_gaps(recent_feedback)
        
        # Generate improvement suggestions
        suggestions = self._generate_suggestions(negative_patterns, knowledge_gaps)
        
        report = LearningReport(
            negative_patterns=negative_patterns,
            knowledge_gaps=knowledge_gaps,
            suggestions=suggestions,
            period_start=period_start,
            period_end=period_end
        )
        
        logger.info(f"Analysis complete: {len(negative_patterns)} patterns, {len(knowledge_gaps)} gaps, {len(suggestions)} suggestions")
        
        return report
    
    def _identify_negative_patterns(
        self,
        feedback_list: List[Feedback]
    ) -> List[Dict[str, Any]]:
        """Identify patterns in negative feedback"""
        patterns = []
        
        # Filter negative feedback
        negative_feedback = [
            f for f in feedback_list 
            if f.type == FeedbackType.NEGATIVE
        ]
        
        if not negative_feedback:
            return patterns
        
        # Group by reason
        reason_counts: Dict[str, List[Feedback]] = {}
        for feedback in negative_feedback:
            reason = feedback.data.get('reason', 'unspecified')
            if reason not in reason_counts:
                reason_counts[reason] = []
            reason_counts[reason].append(feedback)
        
        # Identify significant patterns (>= 3 occurrences)
        for reason, feedbacks in reason_counts.items():
            if len(feedbacks) >= 3:
                patterns.append({
                    'reason': reason,
                    'count': len(feedbacks),
                    'percentage': len(feedbacks) / len(negative_feedback) * 100,
                    'examples': [
                        {
                            'conversation_id': f.conversation_id,
                            'message_id': f.message_id,
                            'timestamp': f.timestamp.isoformat()
                        }
                        for f in feedbacks[:3]  # First 3 examples
                    ]
                })
        
        # Sort by count (most common first)
        patterns.sort(key=lambda x: x['count'], reverse=True)
        
        return patterns
    
    def _identify_knowledge_gaps(
        self,
        feedback_list: List[Feedback]
    ) -> List[str]:
        """Identify knowledge gaps from feedback"""
        gaps = []
        
        # Look for corrections and negative feedback with specific topics
        for feedback in feedback_list:
            if feedback.type == FeedbackType.CORRECTION:
                query = feedback.data.get('query', '')
                if query:
                    gaps.append(f"User correction needed for: {query[:100]}")
            
            elif feedback.type == FeedbackType.NEGATIVE:
                reason = feedback.data.get('reason', '')
                if 'incorrect' in reason.lower() or 'wrong' in reason.lower():
                    topic = feedback.data.get('topic', 'unknown topic')
                    gaps.append(f"Incorrect information about: {topic}")
                elif 'incomplete' in reason.lower() or 'missing' in reason.lower():
                    topic = feedback.data.get('topic', 'unknown topic')
                    gaps.append(f"Incomplete information about: {topic}")
        
        # Remove duplicates and limit to top 10
        gaps = list(set(gaps))[:10]
        
        return gaps
    
    def _generate_suggestions(
        self,
        negative_patterns: List[Dict[str, Any]],
        knowledge_gaps: List[str]
    ) -> List[str]:
        """Generate improvement suggestions based on analysis"""
        suggestions = []
        
        # Suggestions based on negative patterns
        for pattern in negative_patterns[:5]:  # Top 5 patterns
            reason = pattern['reason']
            count = pattern['count']
            
            if 'incorrect' in reason.lower():
                suggestions.append(
                    f"Review and update knowledge base entries related to '{reason}' "
                    f"({count} occurrences)"
                )
            elif 'unhelpful' in reason.lower():
                suggestions.append(
                    f"Improve response quality for queries related to '{reason}' "
                    f"({count} occurrences)"
                )
            elif 'incomplete' in reason.lower():
                suggestions.append(
                    f"Add more detailed information for '{reason}' "
                    f"({count} occurrences)"
                )
            else:
                suggestions.append(
                    f"Investigate and address feedback reason: '{reason}' "
                    f"({count} occurrences)"
                )
        
        # Suggestions based on knowledge gaps
        if len(knowledge_gaps) > 5:
            suggestions.append(
                f"Add knowledge base entries for {len(knowledge_gaps)} identified gaps"
            )
        
        # General suggestions
        if not suggestions:
            suggestions.append("Continue monitoring feedback for improvement opportunities")
        
        return suggestions
    
    async def get_feedback_analytics(
        self,
        days: int = 30
    ) -> Dict[str, Any]:
        """
        Get feedback analytics for specified period.
        
        Args:
            days: Number of days to analyze
            
        Returns:
            Analytics dictionary
        """
        logger.info(f"Getting feedback analytics for last {days} days")
        
        # Get recent feedback
        recent_feedback = await self.feedback_repo.get_recent(days=days)
        
        # Calculate metrics
        total = len(recent_feedback)
        positive = sum(1 for f in recent_feedback if f.type == FeedbackType.POSITIVE)
        negative = sum(1 for f in recent_feedback if f.type == FeedbackType.NEGATIVE)
        corrections = sum(1 for f in recent_feedback if f.type == FeedbackType.CORRECTION)
        
        # Calculate satisfaction rate
        satisfaction_rate = (positive / total * 100) if total > 0 else 0
        
        # Group by conversation
        conversations = set(f.conversation_id for f in recent_feedback)
        
        # Group by date
        feedback_by_date: Dict[str, int] = {}
        for feedback in recent_feedback:
            date_key = feedback.timestamp.date().isoformat()
            feedback_by_date[date_key] = feedback_by_date.get(date_key, 0) + 1
        
        return {
            'period_days': days,
            'total_feedback': total,
            'positive_count': positive,
            'negative_count': negative,
            'corrections_count': corrections,
            'satisfaction_rate': round(satisfaction_rate, 2),
            'unique_conversations': len(conversations),
            'feedback_by_date': feedback_by_date,
            'average_per_day': round(total / days, 2) if days > 0 else 0
        }
    
    async def get_learning_progress(self) -> Dict[str, Any]:
        """Get overall learning progress metrics"""
        
        # Get knowledge base stats
        kb_stats = await self.knowledge_base.get_statistics()
        
        # Get feedback stats
        feedback_stats = await self.get_feedback_analytics(days=90)  # Last 90 days
        
        return {
            'knowledge_base': {
                'total_entries': kb_stats.get('total_entries', 0),
                'verified_entries': kb_stats.get('verified_entries', 0),
                'user_contributed': self.stats['knowledge_added']
            },
            'feedback': {
                'total_received': self.stats['total_feedback'],
                'positive_rate': (
                    self.stats['positive_feedback'] / self.stats['total_feedback'] * 100
                    if self.stats['total_feedback'] > 0 else 0
                ),
                'corrections_processed': self.stats['corrections_processed']
            },
            'recent_activity': feedback_stats
        }
    
    async def export_corrections(
        self,
        days: int = 30,
        verified_only: bool = False
    ) -> List[Dict[str, Any]]:
        """
        Export corrections for review.
        
        Args:
            days: Number of days to export
            verified_only: Only export verified corrections
            
        Returns:
            List of correction data
        """
        logger.info(f"Exporting corrections for last {days} days")
        
        # Get corrections from feedback
        recent_feedback = await self.feedback_repo.get_recent(days=days)
        corrections = [
            f for f in recent_feedback 
            if f.type == FeedbackType.CORRECTION
        ]
        
        # Format for export
        export_data = []
        for correction in corrections:
            data = {
                'id': correction.id,
                'conversation_id': correction.conversation_id,
                'message_id': correction.message_id,
                'timestamp': correction.timestamp.isoformat(),
                'query': correction.data.get('query', ''),
                'correction': correction.data.get('correction', ''),
                'original_response': correction.data.get('response', ''),
                'category': correction.data.get('category', 'general'),
                'verified': correction.data.get('verified', False)
            }
            
            if not verified_only or data['verified']:
                export_data.append(data)
        
        logger.info(f"Exported {len(export_data)} corrections")
        return export_data
    
    def get_stats(self) -> Dict[str, Any]:
        """Get learning system statistics"""
        return {
            **self.stats,
            'satisfaction_rate': (
                self.stats['positive_feedback'] / self.stats['total_feedback'] * 100
                if self.stats['total_feedback'] > 0 else 0
            )
        }
    
    def reset_stats(self) -> None:
        """Reset statistics (for testing)"""
        self.stats = {
            'total_feedback': 0,
            'positive_feedback': 0,
            'negative_feedback': 0,
            'corrections_processed': 0,
            'knowledge_added': 0
        }
        logger.info("Learning system statistics reset")
