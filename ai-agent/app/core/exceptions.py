"""
Custom exceptions for AI Agent system.
"""

class AIAgentException(Exception):
    """Base exception for AI agent errors"""
    def __init__(self, message: str, code: str, details: dict = None):
        self.message = message
        self.code = code
        self.details = details or {}
        super().__init__(self.message)

class LLMException(AIAgentException):
    """Raised when LLM API calls fail"""
    def __init__(self, message: str, details: dict = None):
        super().__init__(message, "LLM_ERROR", details)

class LLMTimeoutException(LLMException):
    """Raised when LLM API call times out"""
    def __init__(self, message: str = "LLM API call timed out", details: dict = None):
        super().__init__(message, details)

class LLMRateLimitException(LLMException):
    """Raised when LLM API rate limit is exceeded"""
    def __init__(self, message: str = "LLM API rate limit exceeded", details: dict = None):
        super().__init__(message, details)

class AgentNotFoundException(AIAgentException):
    """Raised when agent is not found"""
    def __init__(self, agent_type: str):
        super().__init__(
            f"Agent {agent_type} not found",
            "AGENT_NOT_FOUND",
            {"agent_type": agent_type}
        )

class KnowledgeBaseException(AIAgentException):
    """Raised when knowledge base operations fail"""
    def __init__(self, message: str, details: dict = None):
        super().__init__(message, "KNOWLEDGE_BASE_ERROR", details)

class ConversationNotFoundException(AIAgentException):
    """Raised when conversation is not found"""
    def __init__(self, conversation_id: str):
        super().__init__(
            f"Conversation {conversation_id} not found",
            "CONVERSATION_NOT_FOUND",
            {"conversation_id": conversation_id}
        )

class ValidationException(AIAgentException):
    """Raised when input validation fails"""
    def __init__(self, message: str, details: dict = None):
        super().__init__(message, "VALIDATION_ERROR", details)
