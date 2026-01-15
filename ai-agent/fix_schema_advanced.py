
import asyncio
import logging
import sys
import os
from sqlalchemy import text

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

sys.path.append(os.getcwd())

async def fix_schema_advanced():
    print("--- Advanced Schema Fix ---")
    try:
        from app.core import database
        from app.models.db_models import Conversation, Message, Feedback, ConversationMetric, KnowledgeEntry
        
        print("Finding dependencies for 'conversations'...")
        with database.engine.connect() as conn:
            # Query to find tables referencing 'conversations'
            query = text("""
                SELECT 
                    OBJECT_NAME(f.parent_object_id) AS TableName,
                    COL_NAME(fc.parent_object_id,fc.parent_column_id) AS ColumnName
                FROM 
                    sys.foreign_keys AS f
                INNER JOIN 
                    sys.foreign_key_columns AS fc 
                        ON f.object_id = fc.constraint_object_id
                INNER JOIN 
                    sys.tables AS t 
                        ON t.object_id = fc.referenced_object_id
                WHERE 
                    OBJECT_NAME(f.referenced_object_id) = 'conversations'
            """)
            result = conn.execute(query).fetchall()
            
            print(f"Found {len(result)} referencing tables:")
            for row in result:
                print(f" - {row[0]}.{row[1]}")
                # Drop referencing table
                print(f"Dropping referencing table: {row[0]}")
                conn.execute(text(f"DROP TABLE {row[0]}"))
            
            conn.commit()
            
            # Now try to drop conversations
            print("Dropping conversations table...")
            conn.execute(text("IF OBJECT_ID('conversations', 'U') IS NOT NULL DROP TABLE conversations"))
            
            # Drop knowledge entries too just in case
            conn.execute(text("IF OBJECT_ID('knowledge_entries', 'U') IS NOT NULL DROP TABLE knowledge_entries"))
            
            conn.commit()
            print("Old tables dropped.")
            
            print("Recreating AI tables with correct schema...")
            # target_tables must be Table objects
            database.Base.metadata.create_all(bind=database.engine, tables=[m.__table__ for m in [Conversation, Message, Feedback, ConversationMetric, KnowledgeEntry]])
            print("AI tables created successfully.")
        
    except Exception as e:
        print(f"Advanced fix failed: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    if sys.platform == 'win32':
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    asyncio.run(fix_schema_advanced())
