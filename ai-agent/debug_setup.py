
import asyncio
import logging
import sys
import os

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Add current directory to path
sys.path.append(os.getcwd())

async def test_setup():
    print("--- Starting Diagnostic ---")
    
    # 1. Test Database Connection
    print("\n1. Testing Database Configuration...")
    try:
        from app.core.config import settings
        print(f"Database URL: {settings.DATABASE_URL}")
        
        from app.core.database import engine, init_db, get_db
        print(f"Engine Dialect: {engine.dialect.name}")
        
        print("Attempting to initialize DB...")
        await init_db()
        print("DB Initialization successful.")
    except Exception as e:
        print(f"ERROR: Database initialization failed: {e}")
        import traceback
        traceback.print_exc()

    # 2. Test Service Initialization
    print("\n2. Testing Service Initialization...")
    try:
        from app.services.conversation_manager import ConversationManager
        from app.services.agent_router import AgentRouter
        
        print("Initializing ConversationManager...")
        cm = ConversationManager()
        
        print("Testing Conversation Creation...")
        try:
            conv = await cm.create_conversation(user_id="test_user", title="Debug Chat")
            print(f"Conversation created: {conv.id}")
        except Exception as e:
             print(f"ERROR: Failed to create conversation: {e}")
             import traceback
             traceback.print_exc()

        print("Initializing AgentRouter (this loads agents)...")
        router = AgentRouter()
        print("AgentRouter initialized.")
        
    except Exception as e:
        print(f"ERROR: Service initialization failed: {e}")
        import traceback
        traceback.print_exc()

    print("\n--- Diagnostic Complete ---")

if __name__ == "__main__":
    if sys.platform == 'win32':
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    asyncio.run(test_setup())
