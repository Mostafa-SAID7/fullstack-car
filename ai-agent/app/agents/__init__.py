"""
AI Agent modules for specialized car community assistance.

This package contains:
- BaseAgent: Abstract base class for all agents
- Specialized agents: Mechanic, Buyer's Guide, Seller's Assistant, etc.
"""

from typing import Dict, Type
from app.agents.base_agent import BaseAgent
from app.agents.mechanic_agent import MechanicAgent
from app.agents.buyer_guide_agent import BuyerGuideAgent
from app.agents.seller_assistant_agent import SellerAssistantAgent
from app.agents.modification_expert_agent import ModificationExpertAgent
from app.agents.community_helper_agent import CommunityHelperAgent
from app.agents.general_agent import GeneralAgent

# Registry of available agents
AVAILABLE_AGENTS: Dict[str, Type[BaseAgent]] = {
    'mechanic': MechanicAgent,
    'buyer_guide': BuyerGuideAgent,
    'seller_assistant': SellerAssistantAgent,
    'modification_expert': ModificationExpertAgent,
    'community_helper': CommunityHelperAgent,
    'general': GeneralAgent
}

__all__ = [
    'BaseAgent',
    'MechanicAgent',
    'BuyerGuideAgent',
    'SellerAssistantAgent',
    'ModificationExpertAgent',
    'CommunityHelperAgent',
    'GeneralAgent',
    'AVAILABLE_AGENTS'
]
