from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import uvicorn
from app.core.config import settings
from app.api.routes import chat, recommendations, maintenance, analysis, training, car_images
from app.core.ai_service import AIService
from app.core.database import init_db

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    await init_db()
    ai_service = AIService()
    await ai_service.initialize()
    app.state.ai_service = ai_service
    yield
    # Shutdown
    pass

app = FastAPI(
    title="Community Car AI Agent",
    description="AI-powered assistant for car enthusiasts",
    version="1.0.0",
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
app.include_router(recommendations.router, prefix="/api/recommendations", tags=["recommendations"])
app.include_router(maintenance.router, prefix="/api/maintenance", tags=["maintenance"])
app.include_router(analysis.router, prefix="/api/analysis", tags=["analysis"])
app.include_router(training.router, prefix="/api/training", tags=["training"])
app.include_router(car_images.router, prefix="/api/car-images", tags=["car-images"])

@app.get("/")
async def root():
    return {"message": "Community Car AI Agent is running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "version": "1.0.0"}

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG,
        log_level="info"
    )