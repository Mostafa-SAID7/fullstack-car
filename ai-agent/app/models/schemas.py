from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
from enum import Enum

class MessageRole(str, Enum):
    USER = "user"
    ASSISTANT = "assistant"
    SYSTEM = "system"

class ChatMessage(BaseModel):
    role: MessageRole
    content: str
    timestamp: Optional[datetime] = None
    metadata: Optional[Dict[str, Any]] = None

class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=1000)
    conversation_id: Optional[str] = None
    user_id: Optional[str] = None
    context: Optional[Dict[str, Any]] = None

class ChatResponse(BaseModel):
    message: str
    conversation_id: str
    timestamp: datetime
    confidence: Optional[float] = None
    suggestions: Optional[List[str]] = None

class CarRecommendation(BaseModel):
    car_id: Optional[str] = None
    make: str
    model: str
    year: int
    price_range: Optional[str] = None
    fuel_type: str
    body_type: str
    transmission: str
    engine_size: Optional[str] = None
    mileage: Optional[int] = None
    rating: Optional[float] = None
    reasons: List[str] = []
    pros: List[str] = []
    cons: List[str] = []
    image_url: Optional[str] = None

class RecommendationRequest(BaseModel):
    budget_min: Optional[float] = None
    budget_max: Optional[float] = None
    preferred_fuel_type: Optional[str] = None
    preferred_body_type: Optional[str] = None
    preferred_transmission: Optional[str] = None
    usage_type: Optional[str] = None  # daily, weekend, family, sport
    experience_level: Optional[str] = None  # beginner, intermediate, expert
    priorities: Optional[List[str]] = None  # fuel_economy, performance, reliability, comfort

class RecommendationResponse(BaseModel):
    recommendations: List[CarRecommendation]
    total_count: int
    criteria_used: Dict[str, Any]
    timestamp: datetime

class MaintenanceAdvice(BaseModel):
    task: str
    priority: str  # low, medium, high, urgent
    description: str
    estimated_cost: Optional[str] = None
    frequency: Optional[str] = None
    diy_possible: bool = False
    tools_required: Optional[List[str]] = None
    difficulty_level: Optional[str] = None
    warning_signs: Optional[List[str]] = None

class MaintenanceRequest(BaseModel):
    car_make: str
    car_model: str
    car_year: int
    mileage: int
    last_service_date: Optional[datetime] = None
    reported_issues: Optional[List[str]] = None
    maintenance_history: Optional[List[str]] = None

class MaintenanceResponse(BaseModel):
    immediate_tasks: List[MaintenanceAdvice]
    upcoming_tasks: List[MaintenanceAdvice]
    general_tips: List[str]
    estimated_total_cost: Optional[str] = None
    next_service_date: Optional[datetime] = None
    timestamp: datetime

class PriceAnalysisRequest(BaseModel):
    make: str
    model: str
    year: int
    mileage: int
    condition: str  # excellent, good, fair, poor
    location: Optional[str] = None
    features: Optional[List[str]] = None

class PriceAnalysis(BaseModel):
    estimated_value: float
    price_range_min: float
    price_range_max: float
    market_trend: str  # increasing, stable, decreasing
    confidence_level: float
    factors_affecting_price: List[str]
    comparable_listings: Optional[List[Dict[str, Any]]] = None
    recommendation: str

class PriceAnalysisResponse(BaseModel):
    analysis: PriceAnalysis
    market_insights: List[str]
    selling_tips: Optional[List[str]] = None
    buying_tips: Optional[List[str]] = None
    timestamp: datetime

class CommunityInsight(BaseModel):
    insight_type: str  # trend, popular_car, common_issue, tip
    title: str
    description: str
    relevance_score: float
    source: str
    timestamp: datetime

class InsightsRequest(BaseModel):
    user_interests: Optional[List[str]] = None
    car_preferences: Optional[Dict[str, Any]] = None
    location: Optional[str] = None

class InsightsResponse(BaseModel):
    insights: List[CommunityInsight]
    trending_topics: List[str]
    popular_cars: List[str]
    community_stats: Dict[str, Any]
    timestamp: datetime

class HealthCheckResponse(BaseModel):
    status: str
    version: str
    timestamp: datetime
    models_loaded: bool
    database_connected: bool
    memory_usage: Optional[str] = None