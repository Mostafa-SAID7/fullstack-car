# AI Agent Backend Unit Tests

Comprehensive unit tests for the AI Agent backend components.

## Test Coverage

### Test Files

1. **test_agent_router.py** - Tests for AgentRouter
   - Routing to all 6 specialized agents
   - Explicit mode selection
   - Error handling and fallback
   - Statistics tracking
   - Response metadata

2. **test_intent_classifier.py** - Tests for IntentClassifier
   - Intent classification for all agent types
   - Keyword-based classification
   - Context-aware classification
   - Classification accuracy (>90% threshold)
   - Confidence scoring

3. **test_knowledge_base.py** - Tests for KnowledgeBase
   - Adding knowledge entries
   - Searching with similarity threshold (>0.7)
   - Category filtering
   - Bulk import
   - Update and delete operations
   - Embedding generation

4. **test_conversation_manager.py** - Tests for ConversationManager
   - CRUD operations (Create, Read, Update, Delete)
   - Conversation context building
   - Pagination
   - Search functionality
   - Cache management
   - Statistics

5. **test_llm_client.py** - Tests for LLMClient
   - Response generation
   - Retry logic with exponential backoff (3 retries, 2s backoff)
   - Fallback to alternative models
   - Response caching (7 days TTL)
   - Token counting and cost tracking
   - Rate limiting (100 requests/hour)
   - Streaming responses

6. **test_learning_system.py** - Tests for LearningSystem
   - Recording feedback (positive, negative, correction)
   - Processing corrections and adding to knowledge base
   - Pattern analysis
   - Knowledge gap identification
   - Improvement suggestions
   - Learning progress tracking

## Running Tests

### Install Test Dependencies

```bash
cd ai-agent
pip install -r tests/requirements-test.txt
```

### Run All Tests

```bash
pytest tests/
```

### Run Specific Test File

```bash
pytest tests/test_agent_router.py
```

### Run with Coverage Report

```bash
pytest tests/ --cov=app --cov-report=html
```

### Run with Verbose Output

```bash
pytest tests/ -v
```

### Run Specific Test

```bash
pytest tests/test_agent_router.py::TestAgentRouter::test_route_maintenance_message
```

## Test Fixtures

Common fixtures are defined in `conftest.py`:

- `sample_conversation_context` - Sample conversation for testing
- `sample_messages` - Sample messages for various intents
- `mock_llm_client` - Mocked LLM client
- `mock_knowledge_base` - Mocked knowledge base
- `mock_conversation_manager` - Mocked conversation manager
- `mock_feedback_repository` - Mocked feedback repository

## Acceptance Criteria

All tests must pass the following criteria:

✅ All agents tested with 10+ sample inputs each
✅ Intent classifier achieves >90% accuracy
✅ Knowledge base returns relevant results (similarity >0.7)
✅ Conversation CRUD operations work correctly
✅ LLM client handles failures gracefully with retries
✅ Feedback stored correctly in database
✅ Learning system processes corrections and adds to knowledge base
✅ Error handlers catch and log exceptions properly

## Test Statistics

- **Total Test Files**: 6
- **Total Test Cases**: 100+
- **Coverage Target**: >80%
- **Expected Runtime**: <30 seconds

## Continuous Integration

These tests are designed to run in CI/CD pipelines:

```yaml
# Example GitHub Actions workflow
- name: Run Tests
  run: |
    pip install -r tests/requirements-test.txt
    pytest tests/ --cov=app --cov-report=xml
```

## Troubleshooting

### Import Errors

If you encounter import errors, ensure you're running tests from the `ai-agent` directory:

```bash
cd ai-agent
python -m pytest tests/
```

### Async Test Failures

If async tests fail, ensure `pytest-asyncio` is installed:

```bash
pip install pytest-asyncio
```

### Mock Issues

If mocks aren't working, check that `pytest-mock` is installed:

```bash
pip install pytest-mock
```

## Contributing

When adding new tests:

1. Follow the existing test structure
2. Use descriptive test names
3. Add docstrings explaining what is being tested
4. Use appropriate fixtures from `conftest.py`
5. Ensure tests are independent and can run in any order
6. Mock external dependencies (database, APIs, etc.)
7. Test both success and failure cases
8. Aim for >80% code coverage

## Next Steps

After all tests pass:

1. Run integration tests (Task 37)
2. Test Dashboard components (Task 38)
3. Test Main App components (Task 39)
4. Perform end-to-end testing (Task 40)
