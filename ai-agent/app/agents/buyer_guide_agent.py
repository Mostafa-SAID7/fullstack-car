"""
Buyer's Guide Agent - Specialized agent for car buying assistance.
"""
from typing import Dict, Any, List
from app.agents.base_agent import BaseAgent
from app.models.schemas import ConversationContext, QuickAction
from app.services.prompt_templates import PromptTemplates
import re
import logging

logger = logging.getLogger(__name__)


class BuyerGuideAgent(BaseAgent):
    """
    Specialized agent for car buying assistance.
    
    Expertise:
    - Finding the perfect car for user needs
    - Comparing different options
    - Understanding pricing and value
    - Negotiation tips
    - Avoiding common buying mistakes
    """
    
    def __init__(self):
        super().__init__(
            name="Buyer's Guide",
            agent_type="buyer_guide",
            expertise="buying_guide"
        )
        logger.info("BuyerGuideAgent initialized")
    
    def _get_system_prompt(self) -> str:
        """Get buyer's guide system prompt"""
        return PromptTemplates.buyer_guide_prompt()
    
    def _extract_metadata(
        self,
        message: str,
        llm_response: Dict[str, Any],
        context: ConversationContext
    ) -> Dict[str, Any]:
        """Extract buyer-specific metadata"""
        metadata = super()._extract_metadata(message, llm_response, context)
        
        # Extract buying preferences
        preferences = self._extract_preferences(message, context)
        if preferences:
            metadata['preferences'] = preferences
        
        # Detect buying stage
        metadata['buying_stage'] = self._detect_buying_stage(message)
        
        # Check if inventory search is needed
        search_keywords = ['find', 'search', 'looking for', 'want to buy', 'available']
        metadata['needs_inventory_search'] = any(keyword in message.lower() for keyword in search_keywords)
        
        return metadata
    
    def _generate_quick_actions(
        self,
        message: str,
        llm_response: Dict[str, Any],
        context: ConversationContext
    ) -> List[QuickAction]:
        """Generate buyer-specific quick actions"""
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
        
        # Search inventory action
        actions.append(QuickAction(
            label="🔍 Search Inventory",
            action="search_inventory",
            icon="search",
            data={"preferences": self._extract_preferences(message, context)}
        ))
        
        # Compare cars action
        if 'compare' in message.lower() or 'vs' in message.lower():
            actions.append(QuickAction(
                label="⚖️ Compare Cars",
                action="compare_cars",
                icon="balance-scale"
            ))
        
        # Price check action
        if 'price' in message.lower() or 'cost' in message.lower() or 'budget' in message.lower():
            actions.append(QuickAction(
                label="💰 Check Market Price",
                action="check_price",
                icon="dollar-sign"
            ))
        
        # Save recommendation action
        actions.append(QuickAction(
            label="💾 Save Recommendation",
            action="save_recommendation",
            icon="bookmark"
        ))
        
        return actions
    
    def _extract_preferences(self, message: str, context: ConversationContext) -> Dict[str, Any]:
        """Extract buying preferences from message or context"""
        preferences = {}
        
        # Check context metadata first
        if 'preferences' in context.metadata:
            preferences = context.metadata['preferences'].copy()
        
        # Extract budget
        budget_patterns = [
            r'\$(\d+)k',
            r'\$(\d+),?(\d+)',
            r'budget.*?\$?(\d+)',
            r'under.*?\$?(\d+)',
            r'up to.*?\$?(\d+)'
        ]
        for pattern in budget_patterns:
            budget_match = re.search(pattern, message.lower())
            if budget_match:
                if 'k' in message.lower():
                    preferences['budget'] = int(budget_match.group(1)) * 1000
                else:
                    budget_str = ''.join(budget_match.groups())
                    preferences['budget'] = int(budget_str)
                break
        
        # Extract car type
        car_types = ['sedan', 'suv', 'truck', 'coupe', 'hatchback', 'van', 'minivan', 'crossover', 'convertible']
        message_lower = message.lower()
        for car_type in car_types:
            if car_type in message_lower:
                preferences['car_type'] = car_type
                break
        
        # Extract fuel type
        fuel_types = ['gas', 'gasoline', 'diesel', 'electric', 'hybrid', 'plug-in']
        for fuel_type in fuel_types:
            if fuel_type in message_lower:
                preferences['fuel_type'] = fuel_type
                break
        
        # Extract usage
        usage_keywords = {
            'family': 'family',
            'commute': 'commuting',
            'off-road': 'off-road',
            'sport': 'performance',
            'luxury': 'luxury',
            'work': 'work',
            'business': 'business'
        }
        for keyword, usage in usage_keywords.items():
            if keyword in message_lower:
                preferences['usage'] = usage
                break
        
        # Extract features
        features = []
        feature_keywords = [
            'awd', '4wd', 'sunroof', 'leather', 'navigation', 'backup camera',
            'heated seats', 'bluetooth', 'apple carplay', 'android auto'
        ]
        for feature in feature_keywords:
            if feature in message_lower:
                features.append(feature)
        if features:
            preferences['features'] = features
        
        return preferences if preferences else None
    
    def _detect_buying_stage(self, message: str) -> str:
        """Detect what stage of buying process user is in"""
        message_lower = message.lower()
        
        # Research stage
        if any(word in message_lower for word in ['what', 'which', 'should i', 'recommend', 'best']):
            return 'research'
        
        # Comparison stage
        if any(word in message_lower for word in ['compare', 'vs', 'versus', 'difference', 'better']):
            return 'comparison'
        
        # Ready to buy stage
        if any(word in message_lower for word in ['buy', 'purchase', 'available', 'find', 'looking for']):
            return 'ready_to_buy'
        
        # Negotiation stage
        if any(word in message_lower for word in ['negotiate', 'price', 'deal', 'offer']):
            return 'negotiation'
        
        return 'initial'
    
    def _calculate_confidence(
        self,
        message: str,
        context: ConversationContext
    ) -> float:
        """Calculate confidence for buyer's guide responses"""
        base_confidence = super()._calculate_confidence(message, context)
        
        # Increase confidence if preferences are clear
        if self._extract_preferences(message, context):
            base_confidence += 0.1
        
        # Increase confidence for common buying questions
        common_topics = ['budget', 'reliable', 'fuel efficient', 'family car', 'first car']
        if any(topic in message.lower() for topic in common_topics):
            base_confidence += 0.05
        
        # Decrease confidence if no budget or preferences
        if 'recommend' in message.lower() and not self._extract_preferences(message, context):
            base_confidence -= 0.1
        
        return min(1.0, max(0.0, base_confidence))
