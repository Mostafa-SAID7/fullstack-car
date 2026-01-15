
import asyncio
import logging
import sys
import os

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

sys.path.append(os.getcwd())

async def fix_schema():
    print("--- Fixing Database Schema ---")
    try:
        from app.core import database
        from app.models.db_models import Conversation, Message, Feedback, ConversationMetric, KnowledgeEntry
        
        # Define tables to reset in dependency order (reverse)
        # 1. Tables with FKs to others
        # 2. Tables referenced by others
        
        print("Dropping AI tables manually to ensure order...")
        from sqlalchemy import text
        with database.engine.connect() as conn:
            # Disable constraints temporarily? No, just drop in order.
            
            # 1. Feedback (references Conversation and Message)
            conn.execute(text("IF OBJECT_ID('feedback', 'U') IS NOT NULL DROP TABLE feedback"))
            
            # 2. Metrics (references Conversation)
            conn.execute(text("IF OBJECT_ID('conversation_metrics', 'U') IS NOT NULL DROP TABLE conversation_metrics"))
            
            # 3. Messages (references Conversation)
            conn.execute(text("IF OBJECT_ID('messages', 'U') IS NOT NULL DROP TABLE messages"))
            
            # 4. Conversations (referenced by above)
            conn.execute(text("IF OBJECT_ID('conversations', 'U') IS NOT NULL DROP TABLE conversations"))
            
            # 5. Knowledge (independent)
            conn.execute(text("IF OBJECT_ID('knowledge_entries', 'U') IS NOT NULL DROP TABLE knowledge_entries"))
            
            conn.commit()
        print("AI tables dropped successfully.")
        
        print("Recreating AI tables with correct schema...")
        # target_tables must be Table objects
        database.Base.metadata.create_all(bind=database.engine, tables=[m.__table__ for m in [Conversation, Message, Feedback, ConversationMetric, KnowledgeEntry]])
        print("AI tables created successfully.")
        
    except Exception as e:
        print(f"Schema fix failed: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    if sys.platform == 'win32':
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    asyncio.run(fix_schema())
