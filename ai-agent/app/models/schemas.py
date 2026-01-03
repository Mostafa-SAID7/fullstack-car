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