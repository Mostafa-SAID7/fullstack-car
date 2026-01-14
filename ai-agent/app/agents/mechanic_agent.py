"""
Mechanic Agent - Specialized agent for car maintenance and diagnostics.
"""
from typing import Dict, Any, List
from app.agents.base_agent import BaseAgent
from app.models.schemas import ConversationContext, QuickAction
from app.services.prompt_templates import PromptTemplates
import re
import logging

logger = logging.getLogger(__name__)


class MechanicAgent(BaseAgent):
    """
    Specialized agent for automotive maintenance and diagnostics.
    
    Expertise:
    - Diagnosing car problems from symptoms
    - Providing maintenance schedules
    - Explaining repair procedures
    - Estimating repair costs
    - Recommending preventive maintenance
    """
    
    def __init__(self):
        super().__init__(
            name="Mechanic Expert",
            agent_type="mechanic",
            expertise="maintenance"
        )
        logger.info("MechanicAgent initialized")
    
    def _get_system_prompt(self) -> str:
        """Get mechanic-specific system prompt"""
        return PromptTemplates.mechanic_prompt()
    
    def _extract_metadata(
        self,
        message: str,
        llm_response: Dict[str, Any],
        context: ConversationContext
    ) -> Dict[str, Any]:
        """Extract mechanic-specific metadata"""
        metadata = super()._extract_metadata(message, llm_response, context)
        
        # Extract car information from message
        car_info = self._extract_car_info(message, context)
        if car_info:
            metadata['car_info'] = car_info
        
        # Detect if this is a diagnostic request
        diagnostic_keywords = ['problem', 'issue', 'noise', 'smell', 'warning', 'light', 'error']
        is_diagnostic = any(keyword in message.lower() for keyword in diagnostic_keywords)
        metadata['is_diagnostic'] = is_diagnostic
        
        # Detect if this is a maintenance request
        maintenance_keywords = ['service', 'maintenance', 'oil change', 'schedule', 'when should']
        is_maintenance = any(keyword in message.lower() for keyword in maintenance_keywords)
        metadata['is_maintenance'] = is_maintenance
        
        return metadata
    
    def _generate_quick_actions(
        self,
        message: str,
        llm_response: Dict[str, Any],
        context: ConversationContext
    ) -> List[QuickAction]:
        """Generate mechanic-specific quick actions"""
        actions = []
        
        # Always include feedback actions
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
        
        # Add maintenance schedule action
        if 'maintenance' in message.lower() or 'service' in message.lower():
            actions.append(QuickAction(
                label="📅 Schedule Service",
                action="schedule_maintenance",
                icon="calendar",
                data={"type": "maintenance"}
            ))
        
        # Add find mechanic action
        if 'repair' in message.lower() or 'fix' in message.lower():
            actions.append(QuickAction(
                label="🔧 Find Mechanic",
                action="find_mechanic",
                icon="wrench",
                data={"type": "repair"}
            ))
        
        # Add DIY guide action
        if 'how to' in message.lower() or 'diy' in message.lower():
            actions.append(QuickAction(
                label="📖 DIY Guide",
                action="view_diy_guide",
                icon="book",
                data={"type": "diy"}
            ))
        
        return actions
    
    def _extract_car_info(self, message: str, context: ConversationContext) -> Dict[str, Any]:
        """Extract car information from message or context"""
        car_info = {}
        
        # Check context metadata first
        if 'car_info' in context.metadata:
            car_info = context.metadata['car_info'].copy()
        
        # Extract year (4 digits)
        year_match = re.search(r'\b(19|20)\d{2}\b', message)
        if year_match:
            car_info['year'] = int(year_match.group())
        
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
                    car_info['mileage'] = int(mileage_match.group(1) + mileage_match.group(2))
                else:
                    mileage_str = mileage_match.group(1)
                    if 'k' in message.lower():
                        car_info['mileage'] = int(mileage_str) * 1000
                    else:
                        car_info['mileage'] = int(mileage_str)
                break
        
        # Extract common car makes (basic detection)
        common_makes = [
            'toyota', 'honda', 'ford', 'chevrolet', 'nissan', 'bmw', 'mercedes',
            'audi', 'volkswagen', 'hyundai', 'kia', 'mazda', 'subaru', 'lexus',
            'jeep', 'ram', 'gmc', 'dodge', 'chrysler', 'buick', 'cadillac'
        ]
        message_lower = message.lower()
        for make in common_makes:
            if make in message_lower:
                car_info['make'] = make.title()
                break
        
        return car_info if car_info else None
    
    def _calculate_confidence(
        self,
        message: str,
        context: ConversationContext
    ) -> float:
        """Calculate confidence for mechanic responses"""
        base_confidence = super()._calculate_confidence(message, context)
        
        # Increase confidence if car info is available
        if self._extract_car_info(message, context):
            base_confidence += 0.1
        
        # Increase confidence for common maintenance questions
        common_topics = ['oil change', 'tire rotation', 'brake', 'battery', 'filter']
        if any(topic in message.lower() for topic in common_topics):
            base_confidence += 0.05
        
        # Decrease confidence for complex diagnostics without car info
        if 'diagnose' in message.lower() and not self._extract_car_info(message, context):
            base_confidence -= 0.1
        
        return min(1.0, max(0.0, base_confidence))
