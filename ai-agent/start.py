#!/usr/bin/env python3
"""
Startup script for Community Car AI Agent
"""
import sys
import os
from pathlib import Path
import uvicorn
from app.core.config import settings

# Add the current directory to Python path
sys.path.insert(0, str(Path(__file__).parent))

if __name__ == "__main__":
    print("Starting FastAPI server...", flush=True)
    try:
        uvicorn.run(
            "main:app",
            host=settings.HOST,
            port=settings.PORT,
            reload=False,
            log_level="info"
        )
    except KeyboardInterrupt:
        print("\nShutting down AI Agent...")
    except Exception as e:
        print(f"Error starting AI Agent: {str(e)}")
        sys.exit(1)