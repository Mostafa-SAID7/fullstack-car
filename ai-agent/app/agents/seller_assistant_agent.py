"""
Seller's Assistant Agent - Specialized agent for car selling help.
"""
from typing import Dict, Any, List
from app.agents.base_agent import BaseAgent
from app.models.schemas import ConversationContext, QuickAction
from app.services.prompt_templates import PromptTemplates
import re
import logging

logger = logging.getLogger(__name__)


class SellerAssistantAgent(BaseAgent):
    """
    Specialized agent for car selling assistance.
    
    Expertise:
    - Pricing cars competitively
    - Creating compelling listings
    - Preparing cars for sale
    - Handling negotiations
    - Completing sales safely
    """
    
    def __init__(self):
        super().__init__(
            name="Seller's Assistant",
            agent_type="seller_assistant",
            expertise="selling_tips"
        )
        logger.info("SellerAssistantAgent initialized")
    
    def _get_system_prompt(self) -> str:
        """Get seller's assistant system prompt"""
        return PromptTemplates.seller_assistant_prompt()
    
    def _extract_metadata(
        self,
        message: str,
        llm_response: Dict[str, Any],
        context: ConversationContext
    ) -> Dict[str, Any]:
        """Extract seller-specific metadata"""
        metadata = super()._extract_metadata(message, llm_response, context)
        
        # Extract car details for selling
        car_details = self._extract_car_details(message, context)
        if car_details:
            metadata['car_details'] = car_details
        
        # Detect selling stage
        metadata['selling_stage'] = self._detect_selling_stage(message)
        
        # Check if pricing help is needed
        pricing_keywords = ['price', 'worth', 'value', 'how much', 'sell for']
        metadata['needs_pricing'] = any(keyword in message.lower() for keyword in pricing_keywords)
        
        return metadata
    
    def _generate_quick_actions(
        self,
        message: str,
        llm_response: Dict[str, Any],
        context: ConversationContext
    ) -> List[QuickAction]:
        """Generate seller-specific quick actions"""
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
        
        # Create listing action
        actions.append(QuickAction(
            label="📝 Create Listing",
            action="create_listing",
            icon="edit",
            data={"car_details": self._extract_car_details(message, context)}
        ))
        
        # Price check action
        if 'price' in message.lower() or 'worth' in message.lower():
            actions.append(QuickAction(
                label="💰 Get Price Estimate",
                action="estimate_price",
                icon="dollar-sign"
            ))
        
        # Preparation checklist action
        if 'prepare' in message.lower() or 'ready' in message.lower():
            actions.append(QuickAction(
                label="✅ Preparation Checklist",
                action="view_checklist",
                icon="check-square"
            ))
        
        # Photo tips action
        if 'photo' in message.lower() or 'picture' in message.lower():
            actions.append(QuickAction(
                label="📸 Photo Tips",
                action="photo_tips",
                icon="camera"
            ))
        
        return actions
    
    def _extract_car_details(self, message: str, context: ConversationContext) -> Dict[str, Any]:
        """Extract car details for selling"""
        details = {}
        
        # Check context metadata first
        if 'car_details' in context.metadata:
            details = context.metadata['car_details'].copy()
        
        # Extract year
        year_match = re.search(r'\b(19|20)\d{2}\b', message)
        if year_match:
            details['year'] = int(year_match.group())
        
        # Extract mileage
        mileage_patterns = [
            r'(\d+)k\s*(?:miles|km)',
            r'(\d+),?(\d+)\s*(?:miles|km)',
            r'mileage.*?(\d+)'
        ]
        for pattern in mileage_patterns:
            mileage_match = re.search(pattern, message.lower())
            if mileage_match:
                if len(mileage_match.groups()) > 1:
                    details['mileage'] = int(mileage_match.group(1) + mileage_match.group(2))
                else:
                    mileage_str = mileage_match.group(1)
                    if 'k' in message.lower():
                        details['mileage'] = int(mileage_str) * 1000
                    else:
                        details['mileage'] = int(mileage_str)
                break
        
        # Extract condition
        conditions = ['excellent', 'good', 'fair', 'poor', 'like new', 'mint']
        message_lower = message.lower()
        for condition in conditions:
            if condition in message_lower:
                details['condition'] = condition
                break
        
        # Extract make and model
        common_makes = [
            'toyota', 'honda', 'ford', 'chevrolet', 'nissan', 'bmw', 'mercedes',
            'audi', 'volkswagen', 'hyundai', 'kia', 'mazda', 'subaru', 'lexus'
        ]
        for make in common_makes:
            if make in message_lower:
                details['make'] = make.title()
                break
        
        # Extract modifications
        if 'modified' in message_lower or 'upgrade' in message_lower:
            details['has_modifications'] = True
        
        # Extract accident history
        if 'accident' in message_lower or 'damage' in message_lower:
            details['has_accident_history'] = True
        elif 'clean' in message_lower or 'no accident' in message_lower:
            details['has_accident_history'] = False
        
        return details if details else None
    
    def _detect_selling_stage(self, message: str) -> str:
        """Detect what stage of selling process user is in"""
        message_lower = message.lower()
        
        # Preparation stage
        if any(word in message_lower for word in ['prepare', 'ready', 'clean', 'fix']):
            return 'preparation'
        
        # Pricing stage
        if any(word in message_lower for word in ['price', 'worth', 'value', 'how much']):
            return 'pricing'
        
        # Listing stage
        if any(word in message_lower for word in ['list', 'post', 'advertise', 'description']):
            return 'listing'
        
        # Negotiation stage
        if any(word in message_lower for word in ['negotiate', 'offer', 'buyer', 'deal']):
            return 'negotiation'
        
        # Closing stage
        if any(word in message_lower for word in ['paperwork', 'title', 'transfer', 'payment']):
            return 'closing'
        
        return 'initial'
    
    def _calculate_confidence(
        self,
        message: str,
        context: ConversationContext
    ) -> float:
        """Calculate confidence for seller's assistant responses"""
        base_confidence = super()._calculate_confidence(message, context)
        
        # Increase confidence if car details are available
        if self._extract_car_details(message, context):
            base_confidence += 0.1
        
        # Increase confidence for common selling topics
        common_topics = ['listing', 'price', 'photos', 'description', 'negotiate']
        if any(topic in message.lower() for topic in common_topics):
            base_confidence += 0.05
        
        # Decrease confidence for pricing without car details
        if 'price' in message.lower() and not self._extract_car_details(message, context):
            base_confidence -= 0.1
        
        return min(1.0, max(0.0, base_confidence))
