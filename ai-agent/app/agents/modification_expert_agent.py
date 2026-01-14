"""
Modification Expert Agent - Specialized agent for car modifications.
"""
from typing import Dict, Any, List
from app.agents.base_agent import BaseAgent
from app.models.schemas import ConversationContext, QuickAction
from app.services.prompt_templates import PromptTemplates
import re
import logging

logger = logging.getLogger(__name__)


class ModificationExpertAgent(BaseAgent):
    """
    Specialized agent for car modifications and customization.
    
    Expertise:
    - Performance upgrades
    - Aesthetic modifications
    - Compatibility checks
    - Legal considerations
    - Cost-benefit analysis
    """
    
    def __init__(self):
        super().__init__(
            name="Modification Expert",
            agent_type="modification_expert",
            expertise="modifications"
        )
        logger.info("ModificationExpertAgent initialized")
    
    def _get_system_prompt(self) -> str:
        """Get modification expert system prompt"""
        return PromptTemplates.modification_expert_prompt()
    
    def _extract_metadata(
        self,
        message: str,
        llm_response: Dict[str, Any],
        context: ConversationContext
    ) -> Dict[str, Any]:
        """Extract modification-specific metadata"""
        metadata = super()._extract_metadata(message, llm_response, context)
        
        # Extract car info
        car_info = self._extract_car_info(message, context)
        if car_info:
            metadata['car_info'] = car_info
        
        # Detect modification type
        metadata['modification_type'] = self._detect_modification_type(message)
        
        # Check if compatibility check is needed
        compatibility_keywords = ['compatible', 'fit', 'work with', 'install']
        metadata['needs_compatibility_check'] = any(keyword in message.lower() for keyword in compatibility_keywords)
        
        # Check if legal concerns mentioned
        legal_keywords = ['legal', 'illegal', 'law', 'regulation', 'emissions']
        metadata['has_legal_concerns'] = any(keyword in message.lower() for keyword in legal_keywords)
        
        return metadata
    
    def _generate_quick_actions(
        self,
        message: str,
        llm_response: Dict[str, Any],
        context: ConversationContext
    ) -> List[QuickAction]:
        """Generate modification-specific quick actions"""
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
        
        # Compatibility check action
        actions.append(QuickAction(
            label="🔍 Check Compatibility",
            action="check_compatibility",
            icon="check-circle",
            data={"car_info": self._extract_car_info(message, context)}
        ))
        
        # Cost estimate action
        if 'cost' in message.lower() or 'price' in message.lower() or 'how much' in message.lower():
            actions.append(QuickAction(
                label="💰 Cost Estimate",
                action="estimate_cost",
                icon="dollar-sign"
            ))
        
        # Legal info action
        if 'legal' in message.lower() or 'law' in message.lower():
            actions.append(QuickAction(
                label="⚖️ Legal Information",
                action="view_legal_info",
                icon="gavel"
            ))
        
        # Find parts action
        actions.append(QuickAction(
            label="🛒 Find Parts",
            action="find_parts",
            icon="shopping-cart"
        ))
        
        # Installation guide action
        if 'install' in message.lower() or 'how to' in message.lower():
            actions.append(QuickAction(
                label="📖 Installation Guide",
                action="view_install_guide",
                icon="book"
            ))
        
        return actions
    
    def _extract_car_info(self, message: str, context: ConversationContext) -> Dict[str, Any]:
        """Extract car information for modification compatibility"""
        car_info = {}
        
        # Check context metadata first
        if 'car_info' in context.metadata:
            car_info = context.metadata['car_info'].copy()
        
        # Extract year
        year_match = re.search(r'\b(19|20)\d{2}\b', message)
        if year_match:
            car_info['year'] = int(year_match.group())
        
        # Extract make
        common_makes = [
            'toyota', 'honda', 'ford', 'chevrolet', 'nissan', 'bmw', 'mercedes',
            'audi', 'volkswagen', 'hyundai', 'kia', 'mazda', 'subaru', 'lexus',
            'porsche', 'ferrari', 'lamborghini', 'corvette', 'mustang'
        ]
        message_lower = message.lower()
        for make in common_makes:
            if make in message_lower:
                car_info['make'] = make.title()
                break
        
        # Extract engine info
        engine_patterns = [
            r'(\d\.\d)l',
            r'v(\d)',
            r'(\d) cylinder',
            r'turbo',
            r'supercharged'
        ]
        for pattern in engine_patterns:
            engine_match = re.search(pattern, message_lower)
            if engine_match:
                car_info['engine_info'] = engine_match.group()
                break
        
        return car_info if car_info else None
    
    def _detect_modification_type(self, message: str) -> str:
        """Detect type of modification being discussed"""
        message_lower = message.lower()
        
        # Performance modifications
        performance_keywords = [
            'turbo', 'supercharger', 'exhaust', 'intake', 'tune', 'chip',
            'suspension', 'brake', 'horsepower', 'hp', 'torque', 'boost'
        ]
        if any(keyword in message_lower for keyword in performance_keywords):
            return 'performance'
        
        # Aesthetic modifications
        aesthetic_keywords = [
            'paint', 'wrap', 'body kit', 'spoiler', 'wheels', 'rims',
            'lights', 'led', 'tint', 'interior', 'seats', 'steering wheel'
        ]
        if any(keyword in message_lower for keyword in aesthetic_keywords):
            return 'aesthetic'
        
        # Audio/electronics
        audio_keywords = [
            'stereo', 'speakers', 'subwoofer', 'amp', 'amplifier',
            'head unit', 'navigation', 'dash cam'
        ]
        if any(keyword in message_lower for keyword in audio_keywords):
            return 'audio_electronics'
        
        # Off-road modifications
        offroad_keywords = [
            'lift kit', 'off-road', 'winch', 'bumper', 'skid plate',
            'rock sliders', 'snorkel', 'all-terrain'
        ]
        if any(keyword in message_lower for keyword in offroad_keywords):
            return 'off_road'
        
        return 'general'
    
    def _calculate_confidence(
        self,
        message: str,
        context: ConversationContext
    ) -> float:
        """Calculate confidence for modification expert responses"""
        base_confidence = super()._calculate_confidence(message, context)
        
        # Increase confidence if car info is available
        if self._extract_car_info(message, context):
            base_confidence += 0.1
        
        # Increase confidence for common modifications
        common_mods = ['exhaust', 'intake', 'wheels', 'suspension', 'tune']
        if any(mod in message.lower() for mod in common_mods):
            base_confidence += 0.05
        
        # Decrease confidence for complex compatibility without car info
        if 'compatible' in message.lower() and not self._extract_car_info(message, context):
            base_confidence -= 0.15
        
        # Decrease confidence for legal questions (requires specific jurisdiction)
        if 'legal' in message.lower():
            base_confidence -= 0.1
        
        return min(1.0, max(0.0, base_confidence))
