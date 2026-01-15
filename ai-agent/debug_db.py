
import logging
import sys
import os
import asyncio

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

sys.path.append(os.getcwd())

async def test_db_init():
    print("--- DB Init Diagnosis ---")
    try:
        print("Importing database module...")
        from app.core import database
        print(f"Database module: {database}")
        print(f"Engine: {database.engine}")
        
        print("Importing models...")
        try:
            from app.models import db_models
            print("Models imported.")
        except Exception as e:
            print(f"FAILED to import models: {e}")
            raise

        # Run init_db()
        # Drop AI tables to clean up any broken schema
        print("Cleaning up old API tables...")
        from sqlalchemy import text
        with database.engine.connect() as conn:
            conn.execute(text("IF OBJECT_ID('feedback', 'U') IS NOT NULL DROP TABLE feedback"))
            conn.execute(text("IF OBJECT_ID('messages', 'U') IS NOT NULL DROP TABLE messages"))
            conn.execute(text("IF OBJECT_ID('conversation_metrics', 'U') IS NOT NULL DROP TABLE conversation_metrics"))
            conn.execute(text("IF OBJECT_ID('conversations', 'U') IS NOT NULL DROP TABLE conversations"))
            conn.execute(text("IF OBJECT_ID('knowledge_entries', 'U') IS NOT NULL DROP TABLE knowledge_entries"))
            conn.commit()
        print("Cleanup done.")

        print("Running init_db()...")
        try:
            await database.init_db()
            print("init_db() completed.")
        except Exception as e:
             print(f"init_db() raised exception: {e}")
             # It shouldn't raise because it swallows, but let's see logging.

        print("Verifying tables...")
        from sqlalchemy import inspect
        insp = inspect(database.engine)
        tables = insp.get_table_names()
        print(f"Tables found: {tables}")
        
        if "conversations" not in tables:
            print("CRITICAL: 'conversations' table MISSING!")
            # Try to force create
            print("Attempting forced create_all...")
            database.Base.metadata.create_all(bind=database.engine)
            print("Forced create_all done.")
            tables_after = insp.get_table_names()
            print(f"Tables after forced create: {tables_after}")
        
    except Exception as e:
        print(f"diagnosis failed: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    if sys.platform == 'win32':
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    asyncio.run(test_db_init())
