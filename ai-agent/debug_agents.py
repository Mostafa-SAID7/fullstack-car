
import asyncio
import inspect
import sys
import os

# Add current directory to path
sys.path.append(os.getcwd())

from app.agents.general_agent import GeneralAgent
from app.models.schemas import ConversationContext, Message
from app.services.knowledge_base import KnowledgeBase
from app.services.llm_client import LLMClient

async def check_signatures():
    print("Checking signatures...")
    
    agent = GeneralAgent()
    
    # Check KnowledgeBase
    print(f"KnowledgeBase.search is coroutine function: {inspect.iscoroutinefunction(agent.knowledge_base.search)}")
    print(f"KnowledgeBase.search type: {type(agent.knowledge_base.search)}")
    
    # Check LLMClient
    print(f"LLMClient.generate is coroutine function: {inspect.iscoroutinefunction(agent.llm_client.generate)}")
    
    # Check agent methods
    print(f"BaseAgent.process is coroutine function: {inspect.iscoroutinefunction(agent.process)}")
    print(f"BaseAgent._build_prompt is coroutine function: {inspect.iscoroutinefunction(agent._build_prompt)}")
    
    # Attempt to reproduce
    print("\nAttempting to run agent.process...")
    context = ConversationContext(
        conversation_id="test",
        user_id="test",
        messages=[Message(id="1", conversation_id="test", role="user", content="hi")]
    )
    
    try:
        # We expect this to fail or succeed, but print traceback if fail
        await agent.process("hi", context)
        print("Agent process finished successfully (unexpected given the bugs)")
    except TypeError as e:
        if "'list' object can't be awaited" in str(e):
             print("\n!!! CAUGHT REPRODUCED ERROR !!!")
             import traceback
             traceback.print_exc()
        else:
             print(f"Caught TypeError: {e}")
             import traceback
             traceback.print_exc()
    except Exception as e:
        print(f"Caught other exception: {e}")
        # traceback.print_exc()

if __name__ == "__main__":
    if sys.platform == "win32":
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    asyncio.run(check_signatures())
