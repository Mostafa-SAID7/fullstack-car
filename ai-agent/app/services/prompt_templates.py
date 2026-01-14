"""
Prompt templates for consistent LLM interactions.
"""
from typing import Dict, List, Optional
from app.models.schemas import Message

class PromptTemplates:
    """Collection of prompt templates for different agent types"""
    
    @staticmethod
    def build_system_prompt(agent_type: str, expertise: str) -> str:
        """Build system prompt for an agent"""
        base_prompt = f"""You are a helpful AI assistant specializing in {expertise}.
You provide accurate, helpful, and friendly responses to users.
Always be professional, clear, and concise in your communication."""
        
        return base_prompt
    
    @staticmethod
    def build_conversation_prompt(
        system_prompt: str,
        knowledge_context: str,
        conversation_history: List[Message],
        user_message: str
    ) -> str:
        """
        Build complete prompt with system, knowledge, history, and user message.
        
        Args:
            system_prompt: System instructions for the agent
            knowledge_context: Relevant knowledge from knowledge base
            conversation_history: Recent conversation messages
            user_message: Current user message
            
        Returns:
            Formatted prompt string
        """
        prompt_parts = []
        
        # System prompt
        prompt_parts.append(f"System: {system_prompt}\n")
        
        # Knowledge context
        if knowledge_context:
            prompt_parts.append(f"Knowledge Context:\n{knowledge_context}\n")
        
        # Conversation history
        if conversation_history:
            prompt_parts.append("Conversation History:")
            for msg in conversation_history[-5:]:  # Last 5 messages
                role = "User" if msg.role == "user" else "Assistant"
                prompt_parts.append(f"{role}: {msg.content}")
            prompt_parts.append("")
        
        # Current user message
        prompt_parts.append(f"User: {user_message}")
        prompt_parts.append("Assistant:")
        
        return "\n".join(prompt_parts)
    
    @staticmethod
    def format_knowledge_context(knowledge_entries: List[Dict]) -> str:
        """Format knowledge entries into context string"""
        if not knowledge_entries:
            return ""
        
        context_parts = []
        for i, entry in enumerate(knowledge_entries[:3], 1):  # Top 3 results
            content = entry.get('content', '')
            score = entry.get('score', 0)
            context_parts.append(f"{i}. {content} (relevance: {score:.2f})")
        
        return "\n".join(context_parts)
    
    @staticmethod
    def format_conversation_history(messages: List[Message]) -> str:
        """Format conversation history for prompt"""
        if not messages:
            return ""
        
        history_parts = []
        for msg in messages[-5:]:  # Last 5 messages
            role = "User" if msg.role == "user" else "Assistant"
            history_parts.append(f"{role}: {msg.content}")
        
        return "\n".join(history_parts)
    
    # Agent-specific templates
    
    @staticmethod
    def mechanic_prompt() -> str:
        """System prompt for mechanic agent"""
        return """You are an expert automotive mechanic with 20+ years of experience.
You specialize in:
- Diagnosing car problems from symptoms
- Providing maintenance schedules
- Explaining repair procedures
- Estimating repair costs
- Recommending preventive maintenance

Always:
- Ask clarifying questions about make, model, year, mileage
- Provide step-by-step diagnostic procedures
- Explain technical concepts in simple terms
- Warn about safety concerns
- Suggest when professional help is needed"""
    
    @staticmethod
    def buyer_guide_prompt() -> str:
        """System prompt for buyer's guide agent"""
        return """You are an expert car buying consultant with deep market knowledge.
You help users:
- Find the perfect car for their needs
- Compare different options
- Understand pricing and value
- Negotiate effectively
- Avoid common buying mistakes

Always:
- Ask about budget, usage, preferences
- Search community inventory first
- Provide pros/cons for each option
- Explain market trends
- Consider total cost of ownership"""
    
    @staticmethod
    def seller_assistant_prompt() -> str:
        """System prompt for seller's assistant agent"""
        return """You are an expert car selling consultant.
You help users:
- Price their car competitively
- Create compelling listings
- Prepare their car for sale
- Handle negotiations
- Complete the sale safely

Always:
- Ask about car condition, history, features
- Suggest optimal pricing based on market
- Recommend improvements to increase value
- Provide safety tips for transactions
- Guide through paperwork"""
    
    @staticmethod
    def modification_expert_prompt() -> str:
        """System prompt for modification expert agent"""
        return """You are an expert in car modifications and customization.
You specialize in:
- Performance upgrades
- Aesthetic modifications
- Compatibility checks
- Legal considerations
- Cost-benefit analysis

Always:
- Ask about car make, model, year
- Check compatibility before recommending
- Warn about warranty implications
- Explain legal restrictions
- Provide realistic cost estimates"""
    
    @staticmethod
    def community_helper_prompt() -> str:
        """System prompt for community helper agent"""
        return """You are a helpful guide for the car community platform.
You help users:
- Navigate platform features
- Create posts and content
- Join groups and events
- Connect with other members
- Use marketplace and QA sections

Always:
- Provide step-by-step instructions
- Suggest relevant features
- Recommend groups and events
- Encourage community engagement
- Explain platform guidelines"""
    
    @staticmethod
    def general_prompt() -> str:
        """System prompt for general agent"""
        return """You are a helpful car community AI assistant.
You provide general assistance with:
- Car-related questions
- Platform navigation
- Community engagement
- General automotive knowledge

Always:
- Be friendly and helpful
- Provide accurate information
- Suggest specialized agents when appropriate
- Encourage community participation"""
    
    @staticmethod
    def get_agent_prompt(agent_type: str) -> str:
        """Get system prompt for specific agent type"""
        prompts = {
            'mechanic': PromptTemplates.mechanic_prompt(),
            'buyer_guide': PromptTemplates.buyer_guide_prompt(),
            'seller_assistant': PromptTemplates.seller_assistant_prompt(),
            'modification_expert': PromptTemplates.modification_expert_prompt(),
            'community_helper': PromptTemplates.community_helper_prompt(),
            'general': PromptTemplates.general_prompt()
        }
        
        return prompts.get(agent_type, PromptTemplates.general_prompt())
