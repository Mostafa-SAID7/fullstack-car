"""
Repository for analytics and metrics with optimized queries.
"""
from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy import desc, func, and_, case
from datetime import datetime, timedelta
from app.models.db_models import ConversationMetric
from app.repositories.base_repository import BaseRepository, cache_query
import logging

logger = logging.getLogger(__name__)

class AnalyticsRepository(BaseRepository[ConversationMetric]):
    """Repository for analytics operations with query optimization"""
    
    def __init__(self, db: Session):
        super().__init__(ConversationMetric, db)
    
    @cache_query(ttl=60)
    def get_by_conversation(self, conversation_id: str) -> Optional[ConversationMetric]:
        """Get metrics for a specific conversation (cached)"""
        try:
            return self.db.query(ConversationMetric).filter(
                ConversationMetric.conversation_id == conversation_id
            ).first()
        except Exception as e:
            logger.error(f"Error getting metrics for conversation {conversation_id}: {e}")
            return None
    
    @cache_query(ttl=120)
    def get_by_user(self, user_id: str, skip: int = 0, limit: int = 100) -> List[ConversationMetric]:
        """Get metrics for a specific user (cached, uses composite index)"""
        try:
            # Uses composite index: idx_metrics_user_created
            return self.db.query(ConversationMetric).filter(
                ConversationMetric.user_id == user_id
            ).order_by(desc(ConversationMetric.created_at)).offset(skip).limit(limit).all()
        except Exception as e:
            logger.error(f"Error getting metrics for user {user_id}: {e}")
            return []
    
    @cache_query(ttl=120)
    def get_by_agent_type(self, agent_type: str, skip: int = 0, limit: int = 100) -> List[ConversationMetric]:
        """Get metrics for a specific agent type (cached, uses composite index)"""
        try:
            # Uses composite index: idx_metrics_agent_created
            return self.db.query(ConversationMetric).filter(
                ConversationMetric.agent_type == agent_type
            ).order_by(desc(ConversationMetric.created_at)).offset(skip).limit(limit).all()
        except Exception as e:
            logger.error(f"Error getting metrics for agent {agent_type}: {e}")
            return []
    
    @cache_query(ttl=300)
    def get_by_period(self, start_date: datetime, end_date: datetime) -> List[ConversationMetric]:
        """Get metrics within a time period (cached, uses composite index)"""
        try:
            # Uses composite index: idx_metrics_created_agent
            return self.db.query(ConversationMetric).filter(
                and_(
                    ConversationMetric.created_at >= start_date,
                    ConversationMetric.created_at <= end_date
                )
            ).order_by(ConversationMetric.created_at).all()
        except Exception as e:
            logger.error(f"Error getting metrics for period: {e}")
            return []
    
    @cache_query(ttl=300)
    def aggregate_by_agent(self, days: int = 30) -> Dict[str, Dict[str, Any]]:
        """Aggregate metrics by agent type (cached, optimized query)"""
        try:
            cutoff_date = datetime.utcnow() - timedelta(days=days)
            
            # Single optimized query with all aggregations
            results = self.db.query(
                ConversationMetric.agent_type,
                func.count(ConversationMetric.id).label('total_conversations'),
                func.avg(ConversationMetric.satisfaction_score).label('avg_satisfaction'),
                func.avg(ConversationMetric.duration_seconds).label('avg_duration'),
                func.sum(ConversationMetric.tokens_used).label('total_tokens'),
                func.sum(ConversationMetric.cost).label('total_cost'),
                func.sum(case((ConversationMetric.resolved == True, 1), else_=0)).label('resolved_count')
            ).filter(
                ConversationMetric.created_at >= cutoff_date
            ).group_by(ConversationMetric.agent_type).all()
            
            aggregated = {}
            for row in results:
                agent_type = row.agent_type
                total = row.total_conversations
                aggregated[agent_type] = {
                    'total_conversations': total,
                    'average_satisfaction': float(row.avg_satisfaction) if row.avg_satisfaction else 0.0,
                    'average_duration': float(row.avg_duration) if row.avg_duration else 0.0,
                    'total_tokens': int(row.total_tokens) if row.total_tokens else 0,
                    'total_cost': float(row.total_cost) if row.total_cost else 0.0,
                    'success_rate': float(row.resolved_count / total) if total > 0 else 0.0
                }
            
            return aggregated
        except Exception as e:
            logger.error(f"Error aggregating metrics by agent: {e}")
            return {}
    
    @cache_query(ttl=300)
    def get_overview_metrics(self, days: int = 30) -> Dict[str, Any]:
        """Get overview metrics for dashboard (cached, single query)"""
        try:
            cutoff_date = datetime.utcnow() - timedelta(days=days)
            
            # Single optimized query
            result = self.db.query(
                func.count(ConversationMetric.id).label('total_conversations'),
                func.avg(ConversationMetric.satisfaction_score).label('avg_satisfaction'),
                func.avg(ConversationMetric.duration_seconds).label('avg_duration'),
                func.sum(ConversationMetric.tokens_used).label('total_tokens'),
                func.sum(ConversationMetric.cost).label('total_cost')
            ).filter(
                ConversationMetric.created_at >= cutoff_date
            ).first()
            
            return {
                'total_conversations': result.total_conversations if result.total_conversations else 0,
                'average_satisfaction': float(result.avg_satisfaction) if result.avg_satisfaction else 0.0,
                'average_duration': float(result.avg_duration) if result.avg_duration else 0.0,
                'total_tokens': int(result.total_tokens) if result.total_tokens else 0,
                'total_cost': float(result.total_cost) if result.total_cost else 0.0,
                'period_days': days
            }
        except Exception as e:
            logger.error(f"Error getting overview metrics: {e}")
            return {}
    
    @cache_query(ttl=600)
    def get_daily_stats(self, days: int = 7) -> List[Dict[str, Any]]:
        """Get daily statistics for charts (cached, optimized grouping)"""
        try:
            cutoff_date = datetime.utcnow() - timedelta(days=days)
            
            # Optimized query with date grouping
            results = self.db.query(
                func.date(ConversationMetric.created_at).label('date'),
                func.count(ConversationMetric.id).label('count'),
                func.avg(ConversationMetric.satisfaction_score).label('avg_satisfaction')
            ).filter(
                ConversationMetric.created_at >= cutoff_date
            ).group_by(func.date(ConversationMetric.created_at)).order_by('date').all()
            
            return [
                {
                    'date': str(row.date),
                    'count': row.count,
                    'average_satisfaction': float(row.avg_satisfaction) if row.avg_satisfaction else 0.0
                }
                for row in results
            ]
        except Exception as e:
            logger.error(f"Error getting daily stats: {e}")
            return []
    
    @cache_query(ttl=600)
    def get_top_users(self, limit: int = 10, days: int = 30) -> List[Dict[str, Any]]:
        """Get top users by conversation count (cached, optimized query)"""
        try:
            cutoff_date = datetime.utcnow() - timedelta(days=days)
            
            # Optimized query with grouping and ordering
            results = self.db.query(
                ConversationMetric.user_id,
                func.count(ConversationMetric.id).label('conversation_count'),
                func.avg(ConversationMetric.satisfaction_score).label('avg_satisfaction')
            ).filter(
                ConversationMetric.created_at >= cutoff_date
            ).group_by(ConversationMetric.user_id).order_by(
                desc('conversation_count')
            ).limit(limit).all()
            
            return [
                {
                    'user_id': row.user_id,
                    'conversation_count': row.conversation_count,
                    'average_satisfaction': float(row.avg_satisfaction) if row.avg_satisfaction else 0.0
                }
                for row in results
            ]
        except Exception as e:
            logger.error(f"Error getting top users: {e}")
            return []
    
    @cache_query(ttl=300)
    def calculate_cost_by_agent(self, days: int = 30) -> Dict[str, float]:
        """Calculate total cost by agent type (cached, optimized query)"""
        try:
            cutoff_date = datetime.utcnow() - timedelta(days=days)
            
            # Optimized query with grouping
            results = self.db.query(
                ConversationMetric.agent_type,
                func.sum(ConversationMetric.cost).label('total_cost')
            ).filter(
                ConversationMetric.created_at >= cutoff_date
            ).group_by(ConversationMetric.agent_type).all()
            
            return {
                row.agent_type: float(row.total_cost) if row.total_cost else 0.0
                for row in results
            }
        except Exception as e:
            logger.error(f"Error calculating cost by agent: {e}")
            return {}
