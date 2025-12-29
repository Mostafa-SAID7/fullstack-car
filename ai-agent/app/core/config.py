import os
from typing import List
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # API Configuration
    API_HOST: str = "0.0.0.0"
    API_PORT: int = 8000
    DEBUG: bool = True
    
    # HuggingFace Configuration
    HUGGINGFACE_API_KEY: str = ""
    MODEL_NAME: str = "microsoft/DialoGPT-medium"
    CACHE_DIR: str = "./models_cache"
    
    # Model Parameters
    MAX_TOKENS: int = 512
    TEMPERATURE: float = 0.7
    TOP_P: float = 0.9
    TOP_K: int = 50
    
    # Database
    DATABASE_URL: str = "sqlite:///./community_car_ai.db"
    
    # Backend Integration
    BACKEND_API_URL: str = "http://localhost:5000"
    BACKEND_API_KEY: str = ""
    
    # CORS
    ALLOWED_HOSTS: List[str] = ["*"]
    
    # Logging
    LOG_LEVEL: str = "INFO"
    LOG_FILE: str = "./logs/ai_agent.log"
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()