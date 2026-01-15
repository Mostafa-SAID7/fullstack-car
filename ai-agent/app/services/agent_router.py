"""
Agent Router - Routes messages to appropriate specialized agents.
"""
from typing import Dict, Any, Optional, TYPE_CHECKING
from app.models.schemas import ConversationContext, AgentResponse, AgentType
from app.services.intent_classifier import IntentClassifier, Intent
import logging
from datetime import datetime

if TYPE_CHECKING:
    from app.agents.base_agent import BaseAgent

logger = logging.getLogger(__name__)


class AgentRouter:
    """
    Routes user messages to the most appropriate specialized agent.
    
    Features:
    - Intent-based routing
    - Explicit mode selection
    - Agent handoff support
    - Routing history tracking
    - Fallback to general agent
    """
    
    def __init__(self):
        # Lazy import to avoid circular dependencies
        from app.agents import get_available_agents
        
        # Initialize all agents
        self.agents: Dict[str, Any] = {}
        AVAILABLE_AGENTS = get_available_agents()
        for agent_type, agent_class in AVAILABLE_AGENTS.items():
            self.agents[agent_type] = agent_class()
            logger.info(f"Initialized {agent_type} agent")
        
        # Initialize intent classifier
        self.intent_classifier = IntentClassifier()
        
        # Routing history
        self.routing_history: Dict[str, list] = {}
        
        # Intent to agent mapping
        self.intent_to_agent = {
            'maintenance': 'mechanic',
            'diagnosis': 'mechanic',
            'buying': 'buyer_guide',
            'selling': 'seller_assistant',
            'modification': 'modification_expert',
            'community': 'community_helper',
            'general': 'general'
        }
        
        logger.info("AgentRouter initialized with all agents")
    
    async def route_message(
        self,
        message: str,
        context: ConversationContext,
        explicit_mode: Optional[str] = None
    ) -> AgentResponse:
        """
        Route message to appropriate agent and get response.
        
        Args:
            message: User's message
            context: Conversation context
            explicit_mode: Explicitly selected agent mode (overrides intent detection)
            
        Returns:
            AgentResponse from the selected agent
        """
        start_time = datetime.utcnow()
        
        # Step 1: Determine which agent to use
        if explicit_mode:
            agent_key = self._validate_explicit_mode(explicit_mode)
            intent = Intent(explicit_mode, 1.0, {'method': 'explicit'})
            logger.info(f"Explicit mode selected: {agent_key}")
        else:
            # Classify intent
            intent = await self.intent_classifier.classify(message, context)
            agent_key = self._map_intent_to_agent(intent)
            logger.info(f"Intent classified as '{intent.category}' (confidence: {intent.confidence:.2f}), routing to {agent_key}")
        
        # Step 2: Get the agent
        agent = self.agents.get(agent_key, self.agents['general'])
        
        # Step 3: Process message with agent
        try:
            response = await agent.process(message, context)
            
            # Step 4: Track routing decision
            self._track_routing(
                conversation_id=context.conversation_id,
                message=message,
                intent=intent,
                agent_key=agent_key,
                success=True,
                response_time=(datetime.utcnow() - start_time).total_seconds()
            )
            
            # Add routing metadata to response
            response.metadata['routing'] = {
                'intent': intent.category,
                'intent_confidence': intent.confidence,
                'agent_selected': agent_key,
                'explicit_mode': explicit_mode is not None
            }
            
            return response
            
        except Exception as e:
            logger.error(f"Agent processing failed: {e}")
            
            # Track failed routing
            self._track_routing(
                conversation_id=context.conversation_id,
                message=message,
                intent=intent,
                agent_key=agent_key,
                success=False,
                error=str(e),
                response_time=(datetime.utcnow() - start_time).total_seconds()
            )
            
            # Fallback to general agent
            if agent_key != 'general':
                logger.info("Falling back to general agent")
                general_agent = self.agents['general']
                return await general_agent.process(message, context)
            
            # If general agent also fails, return error response
            return AgentResponse(
                text="I apologize, but I'm having trouble processing your request right now. Please try again.",
                agent="system",
                confidence=0.0,
                metadata={'error': str(e)}
            )
    
    def _validate_explicit_mode(self, mode: str) -> str:
        """Validate and normalize explicit mode selection"""
        # Normalize mode string
        mode_lower = mode.lower().strip()
        
        # Check if it's a valid agent type
        if mode_lower in self.agents:
            return mode_lower
        
        # Try to map common variations
        mode_mapping = {
            'mechanic': 'mechanic',
            'maintenance': 'mechanic',
            'repair': 'mechanic',
            'buyer': 'buyer_guide',
            'buying': 'buyer_guide',
            'buy': 'buyer_guide',
            'seller': 'seller_assistant',
            'selling': 'seller_assistant',
            'sell': 'seller_assistant',
            'mod': 'modification_expert',
            'modification': 'modification_expert',
            'modifications': 'modification_expert',
            'community': 'community_helper',
            'help': 'community_helper',
            'platform': 'community_helper',
            'general': 'general',
            'chat': 'general'
        }
        
        return mode_mapping.get(mode_lower, 'general')
    
    def _map_intent_to_agent(self, intent: Intent) -> str:
        """Map detected intent to agent key"""
        agent_key = self.intent_to_agent.get(intent.category, 'general')
        
        # If confidence is low, use general agent
        if intent.confidence < 0.5:
            logger.info(f"Low confidence ({intent.confidence:.2f}), using general agent")
            return 'general'
        
        return agent_key
    
    def _track_routing(
        self,
        conversation_id: str,
        message: str,
        intent: Intent,
        agent_key: str,
        success: bool,
        response_time: float,
        error: Optional[str] = None
    ) -> None:
        """Track routing decision for analytics"""
        if conversation_id not in self.routing_history:
            self.routing_history[conversation_id] = []
        
        routing_record = {
            'timestamp': datetime.utcnow().isoformat(),
            'message_preview': message[:50],
            'intent': intent.category,
            'intent_confidence': intent.confidence,
            'intent_method': intent.metadata.get('method', 'unknown'),
            'agent_selected': agent_key,
            'success': success,
            'response_time': response_time,
            'error': error
        }
        
        self.routing_history[conversation_id].append(routing_record)
        
        # Keep only last 50 routing records per conversation
        if len(self.routing_history[conversation_id]) > 50:
            self.routing_history[conversation_id] = self.routing_history[conversation_id][-50:]
    
    def get_routing_history(self, conversation_id: str) -> list:
        """Get routing history for a conversation"""
        return self.routing_history.get(conversation_id, [])
    
    def clear_routing_history(self, conversation_id: str) -> None:
        """Clear routing history for a conversation"""
        if conversation_id in self.routing_history:
            del self.routing_history[conversation_id]
    
    def get_agent(self, agent_type: str) -> Optional[Any]:
        """Get agent instance by type"""
        return self.agents.get(agent_type)
    
    def list_agents(self) -> Dict[str, Dict[str, Any]]:
        """List all available agents with their info"""
        return {
            agent_type: agent.get_info()
            for agent_type, agent in self.agents.items()
        }
    
    def get_routing_stats(self) -> Dict[str, Any]:
        """Get routing statistics"""
        total_routings = sum(len(history) for history in self.routing_history.values())
        
        # Count routings by agent
        agent_counts = {}
        intent_counts = {}
        success_count = 0
        total_response_time = 0.0
        
        for history in self.routing_history.values():
            for record in history:
                # Agent counts
                agent = record['agent_selected']
                agent_counts[agent] = agent_counts.get(agent, 0) + 1
                
                # Intent counts
                intent = record['intent']
                intent_counts[intent] = intent_counts.get(intent, 0) + 1
                
                # Success rate
                if record['success']:
                    success_count += 1
                
                # Response time
                total_response_time += record['response_time']
        
        return {
            'total_conversations': len(self.routing_history),
            'total_routings': total_routings,
            'agent_distribution': agent_counts,
            'intent_distribution': intent_counts,
            'success_rate': success_count / total_routings if total_routings > 0 else 0,
            'average_response_time': total_response_time / total_routings if total_routings > 0 else 0,
            'available_agents': list(self.agents.keys())
        }
    
    def configure_agent(self, agent_type: str, config: Dict[str, Any]) -> bool:
        """Configure a specific agent"""
        agent = self.agents.get(agent_type)
        if agent:
            agent.configure(config)
            logger.info(f"Configured {agent_type} agent: {config}")
            return True
        return False
    
    def get_agent_config(self, agent_type: str) -> Optional[Dict[str, Any]]:
        """Get configuration for a specific agent"""
        agent = self.agents.get(agent_type)
        if agent:
            return agent.get_config()
        return None
