from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

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