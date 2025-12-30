#!/usr/bin/env python3
"""
Startup script for Community Car AI Agent
"""
import asyncio
import sys
import os
from pathlib import Path

# Add the current directory to Python path
sys.path.insert(0, str(Path(__file__).parent))

async def main():
    """Main startup function"""
    try:
        print("DEBUG: Starting imports...", flush=True)
        from app.core.config import settings
        print("DEBUG: Config imported.", flush=True)
        print("DEBUG: Importing AIService (this may take a while)...", flush=True)
        from app.core.ai_service import AIService
        print("DEBUG: AIService imported.", flush=True)
        import uvicorn
        print("DEBUG: Uvicorn imported.", flush=True)
        
        print("🚗 Starting Community Car AI Agent...")
        print(f"📍 Host: {settings.HOST}:{settings.PORT}")
        print(f"🤖 Model: {settings.MODEL_NAME}")
        print(f"💾 Cache: {settings.CACHE_DIR}")
        
        # Test AI service initialization
        print("🔄 Initializing AI models...")
        ai_service = AIService()
        await ai_service.initialize()
        print("✅ AI models loaded successfully!")
        
        # Start the server
        print("🚀 Starting FastAPI server...")
        uvicorn.run(
            "main:app",
            host=settings.HOST,
            port=settings.PORT,
            reload=settings.DEBUG,
            log_level="info"
        )
        
    except KeyboardInterrupt:
        print("\n👋 Shutting down AI Agent...")
    except Exception as e:
        print(f"❌ Error starting AI Agent: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    asyncio.run(main())