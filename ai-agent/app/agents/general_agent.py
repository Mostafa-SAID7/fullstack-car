"""
General Agent - Default agent for general car-related conversations.
"""
from typing import Dict, Any, List
from app.agents.base_agent import BaseAgent
from app.models.schemas import ConversationContext, QuickAction
from app.services.prompt_templates import PromptTemplates
import logging

logger = logging.getLogger(__name__)


class GeneralAgent(BaseAgent):
    """
    General-purpose agent for car community assistance.
    
    Handles:
    - General car-related questions
    - Platform navigation
    - Community engagement
    - Routing to specialized agents when appropriate
    """
    
    def __init__(self):
        super().__init__(
            name="General Assistant",
            agent_type="general",
            expertise="general"
        )
        logger.info("GeneralAgent initialized")
    
    def _get_system_prompt(self) -> str:
        """Get general agent system prompt"""
        return PromptTemplates.general_prompt()
    
    def _extract_metadata(
        self,
        message: str,
        llm_response: Dict[str, Any],
        context: ConversationContext
    ) -> Dict[str, Any]:
        """Extract general metadata"""
        metadata = super()._extract_metadata(message, llm_response, context)
        
        # Detect if message might need specialized agent
        metadata['suggested_agent'] = self._suggest_specialized_agent(message)
        
        # Detect conversation topic
        metadata['topic'] = self._detect_topic(message)
        
        return metadata
    
    def _generate_quick_actions(
        self,
        message: str,
        llm_response: Dict[str, Any],
        context: ConversationContext
    ) -> List[QuickAction]:
        """Generate general quick actions"""
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
        
        # Suggest specialized agent if detected
        suggested_agent = self._suggest_specialized_agent(message)
        if suggested_agent:
            agent_labels = {
                'mechanic': '🔧 Talk to Mechanic',
                'buyer_guide': '🛒 Get Buying Help',
                'seller_assistant': '💰 Get Selling Help',
                'modification_expert': '⚙️ Ask Mod Expert',
                'community_helper': '👥 Platform Help'
            }
            if suggested_agent in agent_labels:
                actions.append(QuickAction(
                    label=agent_labels[suggested_agent],
                    action="switch_agent",
                    icon="exchange-alt",
                    data={"agent": suggested_agent}
                ))
        
        # Common helpful actions
        actions.append(QuickAction(
            label="🔍 Search Community",
            action="search_community",
            icon="search"
        ))
        
        return actions
    
    def _suggest_specialized_agent(self, message: str) -> str:
        """Suggest a specialized agent based on message content"""
        message_lower = message.lower()
        
        # Mechanic keywords
        mechanic_keywords = [
            'repair', 'fix', 'problem', 'issue', 'maintenance', 'service',
            'oil change', 'brake', 'engine', 'noise', 'smell', 'warning light'
        ]
        if any(keyword in message_lower for keyword in mechanic_keywords):
            return 'mechanic'
        
        # Buyer's guide keywords
        buyer_keywords = [
            'buy', 'purchase', 'looking for', 'recommend', 'best car',
            'budget', 'should i buy', 'which car', 'compare'
        ]
        if any(keyword in message_lower for keyword in buyer_keywords):
            return 'buyer_guide'
        
        # Seller's assistant keywords
        seller_keywords = [
            'sell', 'selling', 'list', 'price my car', 'worth',
            'how much can i sell', 'listing'
        ]
        if any(keyword in message_lower for keyword in seller_keywords):
            return 'seller_assistant'
        
        # Modification expert keywords
        mod_keywords = [
            'modify', 'modification', 'upgrade', 'tune', 'turbo',
            'exhaust', 'intake', 'performance', 'custom'
        ]
        if any(keyword in message_lower for keyword in mod_keywords):
            return 'modification_expert'
        
        # Community helper keywords
        community_keywords = [
            'how to', 'how do i', 'post', 'group', 'event',
            'join', 'create', 'platform', 'feature'
        ]
        if any(keyword in message_lower for keyword in community_keywords):
            return 'community_helper'
        
        return None
    
    def _detect_topic(self, message: str) -> str:
        """Detect general topic of conversation"""
        message_lower = message.lower()
        
        # Car-related topics
        if any(word in message_lower for word in ['car', 'vehicle', 'auto']):
            return 'automotive'
        
        # Community-related topics
        if any(word in message_lower for word in ['community', 'member', 'group', 'event']):
            return 'community'
        
        # Buying/selling topics
        if any(word in message_lower for word in ['buy', 'sell', 'price', 'market']):
            return 'marketplace'
        
        # Technical topics
        if any(word in message_lower for word in ['technical', 'spec', 'engine', 'performance']):
            return 'technical'
        
        return 'general'
    
    def _calculate_confidence(
        self,
        message: str,
        context: ConversationContext
    ) -> float:
        """Calculate confidence for general responses"""
        base_confidence = super()._calculate_confidence(message, context)
        
        # Decrease confidence if specialized agent would be better
        if self._suggest_specialized_agent(message):
            base_confidence -= 0.2
        
        # Increase confidence for simple greetings and general questions
        simple_keywords = ['hello', 'hi', 'thanks', 'thank you', 'help']
        if any(keyword in message.lower() for keyword in simple_keywords):
            base_confidence += 0.1
        
        return min(1.0, max(0.0, base_confidence))
