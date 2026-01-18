from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
from enum import Enum

class ChatMessage(BaseModel):
    role: str
    content: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class ChatRequestDTO(BaseModel):
    message: str
    context: Optional[str] = None
    user_id: Optional[str] = None

class ChatResponseDTO(BaseModel):
    message: str
    conversation_id: Optional[str] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class RecommendationRequestDTO(BaseModel):
    budget: Optional[str] = None
    car_type: Optional[str] = None
    fuel_type: Optional[str] = None
    usage: Optional[str] = None
    features: Optional[List[str]] = None

class CarRecommendationDTO(BaseModel):
    make: str
    model: str
    year: int
    price_range: Optional[str] = None
    reason: Optional[str] = None
    confidence_score: float

class RecommendationResponseDTO(BaseModel):
    recommendations: List[CarRecommendationDTO] = []
    total_count: int

class MaintenanceRequestDTO(BaseModel):
    make: str
    model: str
    year: int
    mileage: Optional[int] = None
    last_service: Optional[str] = None
    service_history: Optional[List[str]] = None

class MaintenanceResponseDTO(BaseModel):
    priority_items: List[str] = []
    upcoming_services: List[str] = []
    estimated_costs: Dict[str, str] = {}
    recommendations: str
    next_service_date: Optional[str] = None

class MarketAnalysisRequestDTO(BaseModel):
    car_query: str
    location: Optional[str] = None
    time_frame: Optional[str] = None

class MarketAnalysisResponseDTO(BaseModel):
    analysis: str
    market_trend: str
    price_trend: str
    recommendation: str
    confidence: float

class TrainingRequestDTO(BaseModel):
    base_model: Optional[str] = "gpt2"
    epochs: Optional[int] = 3
    dataset_name: Optional[str] = "car_knowledge.json"
    learning_rate: Optional[float] = 5e-5
    batch_size: Optional[int] = 8

class TrainingMetric(BaseModel):
    epoch: int
    loss: float
    accuracy: float
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class TrainingStatusDTO(BaseModel):
    is_training: bool
    progress: float
    status: str
    metrics: List[TrainingMetric] = []
    results: Optional[Dict[str, Any]] = None

class TrainingHistoryDTO(BaseModel):
    history: List[Dict[str, Any]] = []

# Car Image Analysis Schemas
class BoundingBox(BaseModel):
    x: float
    y: float
    width: float
    height: float

class CarDetection(BaseModel):
    bbox: BoundingBox
    confidence: float
    car_class: Optional[str] = None
    make: Optional[str] = None
    model: Optional[str] = None

class ImageAnalysisRequestDTO(BaseModel):
    image_url: Optional[str] = None
    image_base64: Optional[str] = None
    dataset_index: Optional[int] = None
    analyze_type: str = "detection"  # detection, classification, both

class ImageAnalysisResponseDTO(BaseModel):
    detections: List[CarDetection] = []
    image_info: Dict[str, Any] = {}
    analysis_summary: str
    processing_time: float

class DatasetSampleRequestDTO(BaseModel):
    dataset_name: str = "SaulLu/Stanford-Cars"
    index: int = 100
    split: str = "train"

class DatasetSampleResponseDTO(BaseModel):
    image_url: str
    bbox: List[float]
    car_class: str
    image_info: Dict[str, Any]
    visualization_path: Optional[str] = None


# ============================================================================
# Multi-Agent System Models (Task 2)
# ============================================================================

# Enums

class AgentType(str, Enum):
    """Types of specialized AI agents"""
    GENERAL = "general"
    MECHANIC = "mechanic"
    BUYER_GUIDE = "buyer_guide"
    SELLER_ASSISTANT = "seller_assistant"
    MODIFICATION_EXPERT = "modification_expert"
    COMMUNITY_HELPER = "community_helper"

class KnowledgeCategory(str, Enum):
    """Categories for knowledge base entries"""
    MAINTENANCE = "maintenance"
    DIAGNOSTICS = "diagnostics"
    BUYING_GUIDE = "buying_guide"
    SELLING_TIPS = "selling_tips"
    MODIFICATIONS = "modifications"
    CAR_SPECS = "car_specs"
    COMMUNITY_HELP = "community_help"

class FeedbackType(str, Enum):
    """Types of user feedback"""
    POSITIVE = "positive"
    NEGATIVE = "negative"
    CORRECTION = "correction"

# Conversation Models

class Message(BaseModel):
    """Individual message in a conversation"""
    id: str
    conversation_id: str
    role: str  # 'user', 'assistant', 'system'
    content: str
    agent_type: Optional[AgentType] = None
    metadata: Optional[Dict[str, Any]] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        use_enum_values = True

class Conversation(BaseModel):
    """Conversation with message history"""
    id: str
    user_id: str
    title: str
    messages: List[Message] = []
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    metadata: Dict[str, Any] = {}
    is_active: bool = True
    
    class Config:
        use_enum_values = True

class ConversationContext(BaseModel):
    """Context for agent processing"""
    conversation_id: str
    user_id: str
    messages: List[Message]
    metadata: Dict[str, Any] = {}
    
    def get_recent_messages(self, limit: int = 5) -> List[Message]:
        """Get the most recent messages"""
        return self.messages[-limit:] if len(self.messages) > limit else self.messages
    
    def get_user_info(self) -> Dict[str, Any]:
        """Get user information from metadata"""
        return self.metadata.get('user_info', {})
    
    class Config:
        use_enum_values = True

# Knowledge Base Models

class KnowledgeEntry(BaseModel):
    """Knowledge base entry"""
    id: str
    content: str
    category: KnowledgeCategory
    metadata: Dict[str, Any] = {}
    embedding: Optional[List[float]] = None
    source: str  # 'manual', 'user_correction', 'community_post', 'external'
    verified: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    score: Optional[float] = None  # Relevance score from search
    
    class Config:
        use_enum_values = True

class Document(BaseModel):
    """Document for bulk import"""
    content: str
    metadata: Dict[str, Any]
    category: KnowledgeCategory
    
    class Config:
        use_enum_values = True

# Agent Response Models

class QuickAction(BaseModel):
    """Quick action button for user"""
    label: str
    action: str
    icon: Optional[str] = None
    data: Optional[Dict[str, Any]] = None

class AgentResponse(BaseModel):
    """Response from an AI agent"""
    text: str
    agent: str
    confidence: float = 1.0
    metadata: Dict[str, Any] = {}
    quick_actions: List[QuickAction] = []
    
    class Config:
        use_enum_values = True

class ChatRequest(BaseModel):
    """Enhanced chat request with agent mode"""
    message: str
    conversation_id: Optional[str] = None
    user_id: Optional[str] = None
    mode: Optional[AgentType] = None
    context: Optional[Dict[str, Any]] = None
    model_id: Optional[str] = None
    system_instructions: Optional[str] = None
    safety_settings: Optional[List[Dict[str, str]]] = None
    images: Optional[List[str]] = None  # Base64 encoded images
    
    class Config:
        use_enum_values = True

class ChatResponse(BaseModel):
    """Enhanced chat response with agent info"""
    message: str
    message_id: str
    conversation_id: str
    agent: str
    metadata: Optional[Dict[str, Any]] = None
    quick_actions: List[QuickAction] = []
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        use_enum_values = True

# Feedback Models

class Feedback(BaseModel):
    """User feedback on agent response"""
    id: str
    conversation_id: str
    message_id: str
    type: FeedbackType
    data: Optional[Dict[str, Any]] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        use_enum_values = True

class FeedbackRequest(BaseModel):
    """Request to submit feedback"""
    conversation_id: str
    message_id: str
    type: FeedbackType
    data: Optional[Dict[str, Any]] = None
    
    class Config:
        use_enum_values = True

# Analytics Models

class ConversationMetrics(BaseModel):
    """Metrics for a conversation"""
    conversation_id: str
    user_id: str
    agent_type: AgentType
    message_count: int
    duration_seconds: int
    satisfaction_score: Optional[float] = None
    resolved: bool = False
    tokens_used: int
    cost: float
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        use_enum_values = True

class AgentPerformanceMetrics(BaseModel):
    """Performance metrics for an agent"""
    agent_type: AgentType
    total_conversations: int
    average_satisfaction: float
    average_response_time: float
    success_rate: float
    common_topics: List[str]
    period_start: datetime
    period_end: datetime
    
    class Config:
        use_enum_values = True

class AnalyticsOverview(BaseModel):
    """Overall analytics overview"""
    total_conversations: int
    active_conversations: int
    average_response_time: float
    satisfaction_score: float
    tokens_used: int
    error_rate: float
    uptime: float
    period_start: datetime
    period_end: datetime

# API Request/Response Models

class CreateConversationRequest(BaseModel):
    """Request to create a new conversation"""
    user_id: str
    title: Optional[str] = None

class ConversationListResponse(BaseModel):
    """List of conversations"""
    conversations: List[Conversation]
    total: int
    page: int = 1
    page_size: int = 20

class AddKnowledgeRequest(BaseModel):
    """Request to add knowledge entry"""
    content: str
    category: KnowledgeCategory
    metadata: Dict[str, Any] = {}
    source: str = "manual"
    
    class Config:
        use_enum_values = True

class KnowledgeSearchRequest(BaseModel):
    """Request to search knowledge base"""
    query: str
    category: Optional[KnowledgeCategory] = None
    limit: int = 10
    
    class Config:
        use_enum_values = True

class KnowledgeSearchResponse(BaseModel):
    """Response from knowledge search"""
    results: List[KnowledgeEntry]
    total: int

class AgentConfigRequest(BaseModel):
    """Request to configure an agent"""
    agent_type: AgentType
    config: Dict[str, Any]
    
    class Config:
        use_enum_values = True

class AgentStatusResponse(BaseModel):
    """Agent status information"""
    agent_type: AgentType
    is_active: bool
    total_conversations: int
    average_satisfaction: float
    last_used: Optional[datetime] = None
    
    class Config:
        use_enum_values = True

class AgentListResponse(BaseModel):
    """List of available agents"""
    agents: List[AgentStatusResponse]

# Training and Learning Models

class LearningReport(BaseModel):
    """Report from learning system analysis"""
    negative_patterns: List[Dict[str, Any]]
    knowledge_gaps: List[str]
    suggestions: List[str]
    period_start: datetime
    period_end: datetime

class TrainingSessionRequest(BaseModel):
    """Request to start training session"""
    config: Dict[str, Any] = {}

class TrainingSessionStatus(BaseModel):
    """Status of training session"""
    id: str
    status: str  # 'pending', 'running', 'completed', 'failed'
    progress: float
    start_time: datetime
    end_time: Optional[datetime] = None
    metrics: Dict[str, Any] = {}
