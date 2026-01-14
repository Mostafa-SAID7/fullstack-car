"""
Community Helper Agent - Specialized agent for platform navigation and features.
"""
from typing import Dict, Any, List
from app.agents.base_agent import BaseAgent
from app.models.schemas import ConversationContext, QuickAction
from app.services.prompt_templates import PromptTemplates
import logging

logger = logging.getLogger(__name__)


class CommunityHelperAgent(BaseAgent):
    """
    Specialized agent for community platform assistance.
    
    Expertise:
    - Navigating platform features
    - Creating posts and content
    - Joining groups and events
    - Connecting with other members
    - Using marketplace and QA sections
    """
    
    def __init__(self):
        super().__init__(
            name="Community Helper",
            agent_type="community_helper",
            expertise="community_help"
        )
        logger.info("CommunityHelperAgent initialized")
    
    def _get_system_prompt(self) -> str:
        """Get community helper system prompt"""
        return PromptTemplates.community_helper_prompt()
    
    def _extract_metadata(
        self,
        message: str,
        llm_response: Dict[str, Any],
        context: ConversationContext
    ) -> Dict[str, Any]:
        """Extract community-specific metadata"""
        metadata = super()._extract_metadata(message, llm_response, context)
        
        # Detect feature being asked about
        metadata['feature'] = self._detect_feature(message)
        
        # Detect if user needs step-by-step guide
        guide_keywords = ['how to', 'how do i', 'how can i', 'steps', 'guide']
        metadata['needs_guide'] = any(keyword in message.lower() for keyword in guide_keywords)
        
        # Detect if user is new
        new_user_keywords = ['new', 'first time', 'just joined', 'getting started']
        metadata['is_new_user'] = any(keyword in message.lower() for keyword in new_user_keywords)
        
        return metadata
    
    def _generate_quick_actions(
        self,
        message: str,
        llm_response: Dict[str, Any],
        context: ConversationContext
    ) -> List[QuickAction]:
        """Generate community-specific quick actions"""
        actions = []
        
        # Feedback actions
        actions.extend([
            QuickAction(
                label="👍 Helpful",
                action="feedback_positive",
                icon="thumbs-up"
            ),
            QuickAction(
                label="👎 Not Helpful",
                action="feedback_negative",
                icon="thumbs-down"
            )
        ])
        
        # Feature-specific actions based on detected feature
        feature = self._detect_feature(message)
        
        if feature == 'posts':
            actions.append(QuickAction(
                label="✍️ Create Post",
                action="create_post",
                icon="edit"
            ))
        
        elif feature == 'groups':
            actions.append(QuickAction(
                label="👥 Browse Groups",
                action="browse_groups",
                icon="users"
            ))
        
        elif feature == 'events':
            actions.append(QuickAction(
                label="📅 View Events",
                action="view_events",
                icon="calendar"
            ))
        
        elif feature == 'marketplace':
            actions.append(QuickAction(
                label="🛒 Browse Marketplace",
                action="browse_marketplace",
                icon="shopping-cart"
            ))
        
        elif feature == 'qa':
            actions.append(QuickAction(
                label="❓ Ask Question",
                action="ask_question",
                icon="question-circle"
            ))
        
        # Always include help center action
        actions.append(QuickAction(
            label="📚 Help Center",
            action="view_help_center",
            icon="book"
        ))
        
        # Video tutorial action for complex features
        if 'how to' in message.lower():
            actions.append(QuickAction(
                label="🎥 Video Tutorial",
                action="view_tutorial",
                icon="video",
                data={"feature": feature}
            ))
        
        return actions
    
    def _detect_feature(self, message: str) -> str:
        """Detect which platform feature is being asked about"""
        message_lower = message.lower()
        
        # Posts feature
        if any(word in message_lower for word in ['post', 'share', 'publish', 'write']):
            return 'posts'
        
        # Groups feature
        if any(word in message_lower for word in ['group', 'community', 'join', 'member']):
            return 'groups'
        
        # Events feature
        if any(word in message_lower for word in ['event', 'meetup', 'gathering', 'calendar']):
            return 'events'
        
        # Marketplace feature
        if any(word in message_lower for word in ['marketplace', 'buy', 'sell', 'listing', 'inventory']):
            return 'marketplace'
        
        # QA feature
        if any(word in message_lower for word in ['question', 'answer', 'qa', 'q&a', 'ask']):
            return 'qa'
        
        # Reviews feature
        if any(word in message_lower for word in ['review', 'rating', 'feedback']):
            return 'reviews'
        
        # Profile feature
        if any(word in message_lower for word in ['profile', 'account', 'settings', 'preferences']):
            return 'profile'
        
        # Notifications feature
        if any(word in message_lower for word in ['notification', 'alert', 'notify']):
            return 'notifications'
        
        # Messages feature
        if any(word in message_lower for word in ['message', 'chat', 'dm', 'direct message']):
            return 'messages'
        
        return 'general'
    
    def _calculate_confidence(
        self,
        message: str,
        context: ConversationContext
    ) -> float:
        """Calculate confidence for community helper responses"""
        base_confidence = super()._calculate_confidence(message, context)
        
        # Increase confidence for specific feature questions
        if self._detect_feature(message) != 'general':
            base_confidence += 0.1
        
        # Increase confidence for "how to" questions
        if 'how to' in message.lower() or 'how do i' in message.lower():
            base_confidence += 0.05
        
        # Increase confidence for new user questions
        new_user_keywords = ['new', 'first time', 'getting started']
        if any(keyword in message.lower() for keyword in new_user_keywords):
            base_confidence += 0.05
        
        return min(1.0, max(0.0, base_confidence))
