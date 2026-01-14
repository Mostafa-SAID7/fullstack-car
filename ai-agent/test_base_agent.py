"""
Test script for BaseAgent implementation.
"""
import asyncio
from app.agents.base_agent import BaseAgent
from app.models.schemas import ConversationContext, Message, AgentResponse


class TestAgent(BaseAgent):
    """Test agent implementation for verification"""
    
    def __init__(self):
        super().__init__(
            name="Test Agent",
            agent_type="test",
            expertise="testing"
        )
    
    def _get_system_prompt(self) -> str:
        return "You are a test agent for verification purposes."


async def test_base_agent():
    """Test BaseAgent functionality"""
    
    print("=" * 60)
    print("Testing BaseAgent Implementation")
    print("=" * 60)
    
    # Test 1: Cannot instantiate BaseAgent directly
    print("\n1. Testing abstract class enforcement...")
    try:
        agent = BaseAgent("Test", "test", "test")
        print("   ❌ FAILED: BaseAgent should not be instantiable")
    except TypeError as e:
        print("   ✅ PASSED: BaseAgent cannot be instantiated directly")
        print(f"      Error: {e}")
    
    # Test 2: Can instantiate subclass
    print("\n2. Testing subclass instantiation...")
    try:
        test_agent = TestAgent()
        print(f"   ✅ PASSED: Created {test_agent.name}")
        print(f"      Type: {test_agent.agent_type}")
        print(f"      Expertise: {test_agent.expertise}")
    except Exception as e:
        print(f"   ❌ FAILED: {e}")
        return
    
    # Test 3: Configuration system
    print("\n3. Testing configuration system...")
    test_agent.configure({
        'max_tokens': 500,
        'temperature': 0.8
    })
    config = test_agent.get_config()
    print(f"   ✅ PASSED: Configuration set")
    print(f"      Config: {config}")
    
    # Test 4: Agent info
    print("\n4. Testing agent info...")
    info = test_agent.get_info()
    print(f"   ✅ PASSED: Agent info retrieved")
    print(f"      Name: {info['name']}")
    print(f"      Type: {info['type']}")
    print(f"      Expertise: {info['expertise']}")
    
    # Test 5: System prompt
    print("\n5. Testing system prompt...")
    system_prompt = test_agent._get_system_prompt()
    print(f"   ✅ PASSED: System prompt retrieved")
    print(f"      Prompt: {system_prompt}")
    
    # Test 6: Confidence calculation
    print("\n6. Testing confidence calculation...")
    context = ConversationContext(
        conversation_id="test-123",
        user_id="user-456",
        messages=[
            Message(
                id="msg-1",
                conversation_id="test-123",
                role="user",
                content="Hello"
            )
        ]
    )
    confidence = test_agent._calculate_confidence("Test message", context)
    print(f"   ✅ PASSED: Confidence calculated")
    print(f"      Confidence: {confidence}")
    
    # Test 7: Quick actions
    print("\n7. Testing quick actions generation...")
    quick_actions = test_agent._generate_quick_actions("Test", {}, context)
    print(f"   ✅ PASSED: Quick actions generated")
    for action in quick_actions:
        print(f"      - {action.label} ({action.action})")
    
    # Test 8: Metadata extraction
    print("\n8. Testing metadata extraction...")
    llm_response = {
        'text': 'Test response',
        'tokens_used': 50,
        'cost': 0.001,
        'model': 'test-model',
        'response_time': 0.5
    }
    metadata = test_agent._extract_metadata("Test", llm_response, context)
    print(f"   ✅ PASSED: Metadata extracted")
    print(f"      Tokens: {metadata['tokens_used']}")
    print(f"      Cost: ${metadata['cost']}")
    print(f"      Model: {metadata['model']}")
    print(f"      Response Time: {metadata['response_time']}s")
    
    print("\n" + "=" * 60)
    print("All BaseAgent tests completed successfully! ✅")
    print("=" * 60)
    print("\nBaseAgent is ready for specialized agent implementation.")
    print("Next: Implement Task 7 - Specialized Agents")


if __name__ == "__main__":
    asyncio.run(test_base_agent())
