from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import uvicorn
from app.core.config import settings
from app.api.routes import chat, recommendations, maintenance, analysis, training, car_images, conversations, agents, knowledge
from app.core.ai_service import AIService
from app.core.database import init_db
from app.core.cache import cache_service
from app.services import AgentRouter, ConversationManager, KnowledgeBase, IntentClassifier
from app.services.llm_client import LLMClient
from app.services.embedding_service import EmbeddingService
import logging

logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info("Starting AI Agent application...")
    
    # Initialize database
    await init_db()
    logger.info("Database initialized")
    
    # Initialize cache
    await cache_service.connect()
    logger.info("Cache service connected")
    
    # Initialize core services
    embedding_service = EmbeddingService()
    knowledge_base = KnowledgeBase(embedding_service=embedding_service)
    llm_client = LLMClient()
    intent_classifier = IntentClassifier(llm_client=llm_client)
    
    # Initialize conversation manager
    conversation_manager = ConversationManager()
    logger.info("Conversation manager initialized")
    
    # Initialize agent router
    agent_router = AgentRouter(
        intent_classifier=intent_classifier,
        knowledge_base=knowledge_base,
        llm_client=llm_client
    )
    logger.info("Agent router initialized")
    
    # Initialize legacy AI service (for backward compatibility)
    ai_service = AIService()
    await ai_service.initialize()
    logger.info("Legacy AI service initialized")
    
    # Store services in app state
    app.state.ai_service = ai_service
    app.state.cache = cache_service
    app.state.agent_router = agent_router
    app.state.conversation_manager = conversation_manager
    app.state.knowledge_base = knowledge_base
    app.state.llm_client = llm_client
    
    logger.info("All services initialized successfully")
    
    yield
    
    # Shutdown
    logger.info("Shutting down AI Agent application...")
    await cache_service.disconnect()
    logger.info("Cache service disconnected")

app = FastAPI(
    title="Community Car AI Agent",
    description="AI-powered assistant for car enthusiasts with multi-agent support",
    version="2.0.0",
    lifespan=lifespan
)

# CORS middleware - Allow all origins
# Note: When allow_credentials=True, we cannot use ["*"] for origins
# Using regex pattern to allow all HTTP/HTTPS origins
app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"https?://.*",  # Allow all HTTP/HTTPS origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],  # Allow all headers
)

# Include routers
app.include_router(chat.router, prefix="/api/chat", tags=["chat"])
app.include_router(conversations.router, prefix="/api/conversations", tags=["conversations"])
app.include_router(agents.router, prefix="/api/agents", tags=["agents"])
app.include_router(knowledge.router, prefix="/api/knowledge", tags=["knowledge"])
app.include_router(recommendations.router, prefix="/api/recommendations", tags=["recommendations"])
app.include_router(maintenance.router, prefix="/api/maintenance", tags=["maintenance"])
app.include_router(analysis.router, prefix="/api/analysis", tags=["analysis"])
app.include_router(training.router, prefix="/api/training", tags=["training"])
app.include_router(car_images.router, prefix="/api/car-images", tags=["car-images"])

@app.get("/")
async def root():
    return {
        "message": "Community Car AI Agent is running",
        "version": "2.0.0",
        "features": [
            "Multi-agent system with 6 specialized agents",
            "Conversation management and persistence",
            "Intent classification and routing",
            "Knowledge base with vector search",
            "Continuous learning from feedback"
        ]
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy", 
        "version": "2.0.0",
        "cache_enabled": cache_service.enabled
    }

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG,
        log_level="info"
    )