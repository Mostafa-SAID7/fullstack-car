"""
AI Agent modules for specialized car community assistance.

This package contains:
- BaseAgent: Abstract base class for all agents
- Specialized agents: Mechanic, Buyer's Guide, Seller's Assistant, etc.
"""

from typing import Dict, Type

# Lazy loading to avoid circular imports
_AVAILABLE_AGENTS = None

def get_available_agents():
    """
    Lazy load available agents to avoid circular imports.
    Only imports agents when first accessed.
    """
    global _AVAILABLE_AGENTS
    if _AVAILABLE_AGENTS is None:
        from app.agents.base_agent import BaseAgent
        from app.agents.mechanic_agent import MechanicAgent
        from app.agents.buyer_guide_agent import BuyerGuideAgent
        from app.agents.seller_assistant_agent import SellerAssistantAgent
        from app.agents.modification_expert_agent import ModificationExpertAgent
        from app.agents.community_helper_agent import CommunityHelperAgent
        from app.agents.general_agent import GeneralAgent
        
        _AVAILABLE_AGENTS = {
            'mechanic': MechanicAgent,
            'buyer_guide': BuyerGuideAgent,
            'seller_assistant': SellerAssistantAgent,
            'modification_expert': ModificationExpertAgent,
            'community_helper': CommunityHelperAgent,
            'general': GeneralAgent
        }
    return _AVAILABLE_AGENTS

# For backward compatibility - but this will trigger lazy loading
def __getattr__(name):
    if name == 'AVAILABLE_AGENTS':
        return get_available_agents()
    elif name == 'BaseAgent':
        from app.agents.base_agent import BaseAgent
        return BaseAgent
    elif name == 'MechanicAgent':
        from app.agents.mechanic_agent import MechanicAgent
        return MechanicAgent
    elif name == 'BuyerGuideAgent':
        from app.agents.buyer_guide_agent import BuyerGuideAgent
        return BuyerGuideAgent
    elif name == 'SellerAssistantAgent':
        from app.agents.seller_assistant_agent import SellerAssistantAgent
        return SellerAssistantAgent
    elif name == 'ModificationExpertAgent':
        from app.agents.modification_expert_agent import ModificationExpertAgent
        return ModificationExpertAgent
    elif name == 'CommunityHelperAgent':
        from app.agents.community_helper_agent import CommunityHelperAgent
        return CommunityHelperAgent
    elif name == 'GeneralAgent':
        from app.agents.general_agent import GeneralAgent
        return GeneralAgent
    raise AttributeError(f"module '{__name__}' has no attribute '{name}'")

__all__ = [
    'BaseAgent',
    'MechanicAgent',
    'BuyerGuideAgent',
    'SellerAssistantAgent',
    'ModificationExpertAgent',
    'CommunityHelperAgent',
    'GeneralAgent',
    'AVAILABLE_AGENTS',
    'get_available_agents'
]
