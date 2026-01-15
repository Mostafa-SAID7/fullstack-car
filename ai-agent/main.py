"""
AI Agent Main Application
Multi-agent system for car community assistance
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Community Car AI Agent",
    description="""
    ## AI-powered assistant for car enthusiasts with multi-agent support
    
    ### Features:
    - **Multi-Agent System**: 6 specialized agents (Mechanic, Buyer's Guide, Seller's Assistant, Modification Expert, Community Helper, General)
    - **Conversation Management**: Persistent conversation history and context
    - **Knowledge Base**: Vector-based knowledge search and retrieval
    - **Intent Classification**: Automatic routing to appropriate agents
    - **Learning System**: Continuous learning from user feedback
    - **Analytics**: Conversation analytics and metrics
    
    ### Available Endpoints:
    - **Chat API**: `/api/chat` - Chat with AI agents
    - **Conversations API**: `/api/conversations` - Manage conversations
    - **Agents API**: `/api/agents` - List and configure agents
    - **Knowledge API**: `/api/knowledge` - Search and manage knowledge base
    """,
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
    contact={
        "name": "AI Agent Support",
        "url": "http://localhost:8003",
    },
    license_info={
        "name": "MIT",
    }
)

app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"https?://.*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add rate limiting middleware
from app.middleware.rate_limiter import RateLimiterMiddleware, get_rate_limiter
rate_limiter = get_rate_limiter()
app.add_middleware(
    RateLimiterMiddleware,
    rate_limiter=rate_limiter,
    excluded_paths=["/", "/health", "/docs", "/redoc", "/openapi.json"]
)
logger.info("Rate limiting middleware enabled")

# Add performance monitoring middleware
from app.middleware.metrics import PerformanceMonitoringMiddleware, get_metrics
performance_metrics = get_metrics()
app.add_middleware(
    PerformanceMonitoringMiddleware,
    metrics=performance_metrics,
    excluded_paths=["/docs", "/redoc", "/openapi.json"]
)
logger.info("Performance monitoring middleware enabled")

# Middleware to ensure services are initialized
@app.middleware("http")
async def ensure_services(request, call_next):
    """Ensure services are initialized before processing requests"""
    if not _services_initialized and not request.url.path in ["/", "/health", "/docs", "/redoc", "/openapi.json"]:
        get_services()
    response = await call_next(request)
    return response

# Lazy service initialization
_services_initialized = False

def get_services():
    """Lazy initialize services on first request"""
    global _services_initialized
    if not _services_initialized:
        logger.info("Initializing services...")
        try:
            from app.services.agent_router import AgentRouter
            from app.services.conversation_manager import ConversationManager
            from app.services.knowledge_base import KnowledgeBase
            from app.services.learning_system import LearningSystem
            
            app.state.agent_router = AgentRouter()
            app.state.conversation_manager = ConversationManager()
            app.state.knowledge_base = KnowledgeBase()
            app.state.learning_system = LearningSystem()
            
            _services_initialized = True
            logger.info("Services initialized successfully!")
        except Exception as e:
            logger.error(f"Failed to initialize services: {e}", exc_info=True)
            raise
    return app.state

@app.on_event("startup")
async def startup_event():
    """Initialize services on startup"""
    logger.info("Server Starting version 1.1 (Fix Applied)")
    logger.info("=" * 70)
    logger.info("AI Agent Application Starting...")
    logger.info("Server: http://localhost:8003")
    logger.info("Swagger UI: http://localhost:8003/docs")
    logger.info("ReDoc: http://localhost:8003/redoc")
    logger.info("=" * 70)
    logger.info("=" * 70)
    
    # Initialize database
    try:
        from app.core.database import init_db
        await init_db()
    except Exception as e:
        logger.error(f"Failed to initialize database on startup: {e}")
    
    # Initialize cache service
    try:
        from app.core.cache import cache_service
        await cache_service.connect()
        logger.info("Cache service connected")
    except Exception as e:
        logger.error(f"Failed to connect cache service: {e}")

    # Initialize LLM with GPT-2
    try:
        from app.services.llm_client import LLMClient
        from transformers import pipeline, AutoTokenizer
        
        logger.info("Initializing GPT-2 model...")
        model_name = "gpt2"  # Lightweight model for testing
        tokenizer = AutoTokenizer.from_pretrained(model_name)
        # Add pad token if missing
        if tokenizer.pad_token is None:
            tokenizer.pad_token = tokenizer.eos_token
            
        llm_pipeline = pipeline(
            "text-generation", 
            model=model_name, 
            tokenizer=tokenizer,
            max_new_tokens=100
        )
        
        # Set as primary pipeline (shared globally)
        LLMClient.set_primary_pipeline(llm_pipeline, tokenizer)
        logger.info("GPT-2 model initialized successfully")
        
    except Exception as e:
        logger.error(f"Failed to initialize LLM: {e}")
        logger.warning("Agent will run in fallback mode (generic responses only)")
    
    # Initialize advanced cache service and warm cache
    try:
        from app.services.cache_service import advanced_cache_service
        await advanced_cache_service.initialize()
        
        # Warm cache with common queries
        await advanced_cache_service.warm_cache_startup()
        logger.info("Cache warming completed")
    except Exception as e:
        logger.error(f"Failed to initialize advanced cache service: {e}")
        
    logger.info("Services will be initialized on first request")

@app.get("/", 
    summary="Root Endpoint",
    description="Get API information and available endpoints",
    response_description="API information and endpoint list",
    tags=["General"]
)
async def root():
    return {
        "message": "Community Car AI Agent is running",
        "version": "2.0.0",
        "status": "online",
        "features": [
            "Multi-agent system with 6 specialized agents",
            "Conversation management and persistence",
            "Intent classification and routing",
            "Knowledge base with vector search",
            "Continuous learning from feedback"
        ],
        "documentation": {
            "swagger": "http://localhost:8003/docs",
            "redoc": "http://localhost:8003/redoc",
            "openapi": "http://localhost:8003/openapi.json"
        },
        "endpoints": {
            "chat": "POST /api/chat - Chat with AI agents",
            "conversations": "GET /api/conversations - List conversations",
            "agents": "GET /api/agents - List available agents",
            "knowledge": "GET /api/knowledge/search - Search knowledge base"
        }
    }

@app.get("/health",
    summary="Health Check",
    description="Check if the API is running and healthy",
    response_description="Health status information",
    tags=["General"]
)
async def health_check():
    services_status = "initialized" if _services_initialized else "not initialized"
    return {
        "status": "healthy",
        "version": "2.0.0",
        "server": "running",
        "database": "configured",
        "services": services_status,
        "documentation": {
            "swagger": "http://localhost:8003/docs",
            "redoc": "http://localhost:8003/redoc"
        }
    }

# Import and include API routes AFTER app creation
from app.api.routes import chat, conversations, agents, knowledge, cache, database, rate_limit, monitoring

app.include_router(chat.router, prefix="/api/chat", tags=["Chat"])
app.include_router(conversations.router, prefix="/api/conversations", tags=["Conversations"])
app.include_router(agents.router, prefix="/api/agents", tags=["Agents"])
app.include_router(knowledge.router, prefix="/api/knowledge", tags=["Knowledge"])
app.include_router(cache.router, prefix="/api/cache", tags=["Cache Management"])
app.include_router(database.router, tags=["Database Management"])
app.include_router(rate_limit.router, prefix="/api/rate-limit", tags=["Rate Limiting"])
app.include_router(monitoring.router, prefix="/api/monitoring", tags=["Performance Monitoring"])

logger.info("API routes registered successfully")

if __name__ == "__main__":
    from app.core.config import settings
    logger.info(f"Starting server on {settings.HOST}:{settings.PORT}")
    uvicorn.run(
        "main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=False,
        log_level="info"
    )
