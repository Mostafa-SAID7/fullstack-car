import os
from typing import List
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # API Configuration
    HOST: str = "0.0.0.0"
    PORT: int = 8000
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
    DATABASE_URL: str = "mssql+pyodbc://localhost/CCarDb?driver=SQL+Server&trusted_connection=yes"
    
    # Redis Cache
    REDIS_URL: str = "redis://localhost:6379/0"
    
    # ChromaDB
    CHROMA_PERSIST_DIR: str = "./chroma_db"
    CHROMA_COLLECTION_NAME: str = "automotive_knowledge"
    
    # OpenAI (optional, for fallback)
    OPENAI_API_KEY: str = ""
    
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