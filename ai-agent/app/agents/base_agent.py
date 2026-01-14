"""
Base Agent Class - Abstract base for all specialized agents.
"""
from abc import ABC, abstractmethod
from typing import Dict, Any, List, Optional
from app.models.schemas import ConversationContext, AgentResponse, Message, QuickAction
from app.services.knowledge_base import KnowledgeBase
from app.services.llm_client import LLMClient
from app.services.prompt_templates import PromptTemplates
import logging

logger = logging.getLogger(__name__)


class BaseAgent(ABC):
    """
    Abstract base class for all specialized AI agents.
    
    Provides common functionality:
    - Knowledge base integration
    - LLM client integration
    - Prompt building with context
    - Response generation
    - Metadata extraction
    """
    
    def __init__(self, name: str, agent_type: str, expertise: str):
        """
        Initialize base agent.
        
        Args:
            name: Display name of the agent
            agent_type: Agent type identifier (matches AgentType enum)
            expertise: Area of expertise for knowledge base filtering
        """
        self.name = name
        self.agent_type = agent_type
        self.expertise = expertise
        self.knowledge_base = KnowledgeBase()
        self.llm_client = LLMClient()
        self.config: Dict[str, Any] = {}
        
        logger.info(f"Initialized {self.name} agent (type: {agent_type})")
    
    async def process(
        self, 
        message: str, 
        context: ConversationContext
    ) -> AgentResponse:
        """
        Process user message and generate response.
        
        This is the main entry point for agent processing.
        
        Args:
            message: User's message
            context: Conversation context with history
            
        Returns:
            AgentResponse with text, metadata, and quick actions
        """
        try:
            logger.info(f"{self.name} processing message: {message[:50]}...")
            
            # Build prompt with context and knowledge
            prompt = await self._build_prompt(message, context)
            
            # Generate response using LLM
            llm_response = await self.llm_client.generate(
                prompt=prompt,
                max_tokens=self.config.get('max_tokens', 300),
                temperature=self.config.get('temperature', 0.7),
                user_id=context.user_id
            )
            
            # Extract metadata from response
            metadata = self._extract_metadata(message, llm_response, context)
            
            # Generate quick actions
            quick_actions = self._generate_quick_actions(message, llm_response, context)
            
            # Build agent response
            response = AgentResponse(
                text=llm_response['text'],
                agent=self.name,
                confidence=self._calculate_confidence(message, context),
                metadata=metadata,
                quick_actions=quick_actions
            )
            
            logger.info(f"{self.name} generated response successfully")
            return response
            
        except Exception as e:
            logger.error(f"{self.name} processing failed: {e}")
            # Return fallback response
            return AgentResponse(
                text="I apologize, but I'm having trouble processing your request right now. Please try again.",
                agent=self.name,
                confidence=0.0,
                metadata={'error': str(e)}
            )
    
    async def _build_prompt(
        self, 
        message: str, 
        context: ConversationContext
    ) -> str:
        """
        Build LLM prompt with system instructions, knowledge, and history.
        
        Args:
            message: User's message
            context: Conversation context
            
        Returns:
            Formatted prompt string
        """
        # Get system prompt for this agent
        system_prompt = self._get_system_prompt()
        
        # Search knowledge base for relevant information
        knowledge_entries = await self.knowledge_base.search(
            query=message,
            category=self.expertise if self.expertise != "general" else None,
            limit=3
        )
        
        # Format knowledge context
        knowledge_context = PromptTemplates.format_knowledge_context(
            [
                {
                    'content': entry.content,
                    'score': entry.score
                }
                for entry in knowledge_entries
            ]
        )
        
        # Get recent conversation history
        recent_messages = context.get_recent_messages(limit=5)
        
        # Build complete prompt
        prompt = PromptTemplates.build_conversation_prompt(
            system_prompt=system_prompt,
            knowledge_context=knowledge_context,
            conversation_history=recent_messages,
            user_message=message
        )
        
        return prompt
    
    @abstractmethod
    def _get_system_prompt(self) -> str:
        """
        Get agent-specific system prompt.
        
        This must be implemented by each specialized agent to define
        their unique personality, expertise, and behavior.
        
        Returns:
            System prompt string
        """
        pass
    
    def _extract_metadata(
        self,
        message: str,
        llm_response: Dict[str, Any],
        context: ConversationContext
    ) -> Dict[str, Any]:
        """
        Extract metadata from the interaction.
        
        Can be overridden by specialized agents to add custom metadata.
        
        Args:
            message: User's message
            llm_response: LLM response dictionary
            context: Conversation context
            
        Returns:
            Metadata dictionary
        """
        return {
            'tokens_used': llm_response.get('tokens_used', 0),
            'cost': llm_response.get('cost', 0.0),
            'model': llm_response.get('model', 'unknown'),
            'response_time': llm_response.get('response_time', 0.0),
            'agent_type': self.agent_type
        }
    
    def _generate_quick_actions(
        self,
        message: str,
        llm_response: Dict[str, Any],
        context: ConversationContext
    ) -> List[QuickAction]:
        """
        Generate quick action buttons for the user.
        
        Can be overridden by specialized agents to provide custom actions.
        
        Args:
            message: User's message
            llm_response: LLM response dictionary
            context: Conversation context
            
        Returns:
            List of QuickAction objects
        """
        # Default quick actions
        return [
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
        ]
    
    def _calculate_confidence(
        self,
        message: str,
        context: ConversationContext
    ) -> float:
        """
        Calculate confidence score for the response.
        
        Can be overridden by specialized agents for custom confidence calculation.
        
        Args:
            message: User's message
            context: Conversation context
            
        Returns:
            Confidence score (0.0 to 1.0)
        """
        # Default confidence based on message length and context
        base_confidence = 0.8
        
        # Reduce confidence for very short messages (might be unclear)
        if len(message.split()) < 3:
            base_confidence -= 0.1
        
        # Increase confidence if we have conversation history
        if len(context.messages) > 2:
            base_confidence += 0.1
        
        return min(1.0, max(0.0, base_confidence))
    
    def _format_history(self, messages: List[Message]) -> str:
        """
        Format conversation history for prompt.
        
        Args:
            messages: List of messages
            
        Returns:
            Formatted history string
        """
        return PromptTemplates.format_conversation_history(messages)
    
    def configure(self, config: Dict[str, Any]) -> None:
        """
        Configure agent settings.
        
        Args:
            config: Configuration dictionary
        """
        self.config.update(config)
        logger.info(f"{self.name} configuration updated: {config}")
    
    def get_config(self) -> Dict[str, Any]:
        """
        Get current agent configuration.
        
        Returns:
            Configuration dictionary
        """
        return self.config.copy()
    
    def get_info(self) -> Dict[str, Any]:
        """
        Get agent information.
        
        Returns:
            Agent info dictionary
        """
        return {
            'name': self.name,
            'type': self.agent_type,
            'expertise': self.expertise,
            'config': self.config
        }
