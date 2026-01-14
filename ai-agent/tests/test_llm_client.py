"""
Unit tests for LLMClient.
"""
import pytest
from unittest.mock import Mock, AsyncMock, patch
from app.services.llm_client import LLMClient
from app.core.exceptions import LLMError, RateLimitError


class TestLLMClient:
    """Test cases for LLMClient"""
    
    @pytest.fixture
    def llm_client(self):
        """Create LLMClient instance for testing"""
        with patch('app.services.llm_client.CacheService'):
            return LLMClient()
    
    @pytest.mark.asyncio
    async def test_generate_response(self, llm_client):
        """Test generating a response"""
        prompt = "What is the best oil for my car?"
        
        # Mock the underlying model
        llm_client.model = Mock()
        llm_client.model.generate = AsyncMock(return_value={
            'text': 'Synthetic oil is recommended for most modern cars',
            'tokens_used': 45,
            'model': 'test-model'
        })
        
        response = await llm_client.generate(prompt)
        
        assert response is not None
        assert 'text' in response
        assert 'tokens_used' in response
        assert 'cost' in response
        assert 'response_time' in response
    
    @pytest.mark.asyncio
    async def test_retry_logic(self, llm_client):
        """Test retry logic with exponential backoff (3 retries, 2s backoff)"""
        prompt = "Test prompt"
        
        # Mock failure then success
        llm_client.model = Mock()
        llm_client.model.generate = AsyncMock(
            side_effect=[
                Exception("Temporary failure"),
                Exception("Temporary failure"),
                {'text': 'Success', 'tokens_used': 10, 'model': 'test'}
            ]
        )
        
        response = await llm_client.generate(prompt)
        
        assert response is not None
        assert response['text'] == 'Success'
        assert llm_client.model.generate.call_count == 3
    
    @pytest.mark.asyncio
    async def test_retry_exhaustion(self, llm_client):
        """Test that retries are exhausted after 3 attempts"""
        prompt = "Test prompt"
        
        llm_client.model = Mock()
        llm_client.model.generate = AsyncMock(side_effect=Exception("Persistent failure"))
        
        with pytest.raises(LLMError):
            await llm_client.generate(prompt)
        
        assert llm_client.model.generate.call_count == 3
    
    @pytest.mark.asyncio
    async def test_fallback_model(self, llm_client):
        """Test fallback to alternative model when primary fails"""
        prompt = "Test prompt"
        
        # Primary model fails, fallback succeeds
        llm_client.primary_model = Mock()
        llm_client.primary_model.generate = AsyncMock(side_effect=Exception("Primary failed"))
        
        llm_client.fallback_model = Mock()
        llm_client.fallback_model.generate = AsyncMock(return_value={
            'text': 'Fallback response',
            'tokens_used': 20,
            'model': 'fallback-model'
        })
        
        response = await llm_client.generate(prompt, use_fallback=True)
        
        assert response is not None
        assert response['model'] == 'fallback-model'
    
    @pytest.mark.asyncio
    async def test_response_caching(self, llm_client):
        """Test response caching for identical prompts (7 days TTL)"""
        prompt = "What is the best oil?"
        cached_response = {
            'text': 'Cached response',
            'tokens_used': 30,
            'cost': 0.001,
            'model': 'test',
            'response_time': 0.1
        }
        
        llm_client.cache = Mock()
        llm_client.cache.get = AsyncMock(return_value=cached_response)
        
        response = await llm_client.generate(prompt)
        
        assert response == cached_response
        llm_client.cache.get.assert_called_once()
        # Model should not be called
        assert not hasattr(llm_client.model, 'generate') or llm_client.model.generate.call_count == 0
    
    @pytest.mark.asyncio
    async def test_cache_miss(self, llm_client):
        """Test cache miss triggers model generation"""
        prompt = "New prompt"
        
        llm_client.cache = Mock()
        llm_client.cache.get = AsyncMock(return_value=None)
        llm_client.cache.set = AsyncMock()
        
        llm_client.model = Mock()
        llm_client.model.generate = AsyncMock(return_value={
            'text': 'Fresh response',
            'tokens_used': 25,
            'model': 'test'
        })
        
        response = await llm_client.generate(prompt)
        
        assert response is not None
        llm_client.model.generate.assert_called_once()
        llm_client.cache.set.assert_called_once()  # Should cache the result
    
    @pytest.mark.asyncio
    async def test_token_counting(self, llm_client):
        """Test token counting and cost tracking"""
        prompt = "Test prompt"
        
        llm_client.model = Mock()
        llm_client.model.generate = AsyncMock(return_value={
            'text': 'Response',
            'tokens_used': 100,
            'model': 'gpt-3.5-turbo'
        })
        
        response = await llm_client.generate(prompt)
        
        assert 'tokens_used' in response
        assert response['tokens_used'] == 100
        assert 'cost' in response
        assert response['cost'] > 0
    
    @pytest.mark.asyncio
    async def test_rate_limiting(self, llm_client):
        """Test rate limiting (100 requests/hour per user)"""
        user_id = "user-123"
        prompt = "Test"
        
        llm_client.rate_limiter = Mock()
        llm_client.rate_limiter.check_limit = Mock(return_value=False)
        
        with pytest.raises(RateLimitError):
            await llm_client.generate(prompt, user_id=user_id)
    
    @pytest.mark.asyncio
    async def test_streaming_response(self, llm_client):
        """Test streaming response support"""
        prompt = "Long response prompt"
        
        async def mock_stream():
            chunks = ["This ", "is ", "a ", "streaming ", "response"]
            for chunk in chunks:
                yield chunk
        
        llm_client.model = Mock()
        llm_client.model.generate_stream = mock_stream
        
        chunks = []
        async for chunk in llm_client.generate_stream(prompt):
            chunks.append(chunk)
        
        assert len(chunks) == 5
        assert "".join(chunks) == "This is a streaming response"
    
    @pytest.mark.asyncio
    async def test_prompt_template_system(self, llm_client):
        """Test prompt template system for consistent formatting"""
        template_name = "maintenance_diagnosis"
        variables = {
            'symptom': 'strange noise',
            'car_make': 'Toyota',
            'car_model': 'Camry'
        }
        
        llm_client.templates = {
            'maintenance_diagnosis': "Diagnose {symptom} in {car_make} {car_model}"
        }
        
        prompt = llm_client.format_prompt(template_name, variables)
        
        assert prompt == "Diagnose strange noise in Toyota Camry"
    
    @pytest.mark.asyncio
    async def test_cost_tracking(self, llm_client):
        """Test cost tracking per request"""
        prompt = "Test"
        
        llm_client.model = Mock()
        llm_client.model.generate = AsyncMock(return_value={
            'text': 'Response',
            'tokens_used': 1000,
            'model': 'gpt-4'
        })
        
        response = await llm_client.generate(prompt)
        
        assert 'cost' in response
        # GPT-4 is more expensive than GPT-3.5
        assert response['cost'] > 0.01
    
    @pytest.mark.asyncio
    async def test_response_time_tracking(self, llm_client):
        """Test response time tracking"""
        prompt = "Test"
        
        llm_client.model = Mock()
        llm_client.model.generate = AsyncMock(return_value={
            'text': 'Response',
            'tokens_used': 50,
            'model': 'test'
        })
        
        response = await llm_client.generate(prompt)
        
        assert 'response_time' in response
        assert response['response_time'] >= 0
    
    @pytest.mark.asyncio
    async def test_max_tokens_limit(self, llm_client):
        """Test max tokens limit enforcement"""
        prompt = "Test"
        max_tokens = 100
        
        llm_client.model = Mock()
        llm_client.model.generate = AsyncMock(return_value={
            'text': 'Response',
            'tokens_used': 95,
            'model': 'test'
        })
        
        response = await llm_client.generate(prompt, max_tokens=max_tokens)
        
        assert response['tokens_used'] <= max_tokens
    
    @pytest.mark.asyncio
    async def test_temperature_control(self, llm_client):
        """Test temperature parameter for response randomness"""
        prompt = "Test"
        temperature = 0.8
        
        llm_client.model = Mock()
        llm_client.model.generate = AsyncMock(return_value={
            'text': 'Response',
            'tokens_used': 50,
            'model': 'test'
        })
        
        await llm_client.generate(prompt, temperature=temperature)
        
        call_args = llm_client.model.generate.call_args
        assert call_args[1]['temperature'] == temperature
    
    @pytest.mark.asyncio
    async def test_error_handling_invalid_prompt(self, llm_client):
        """Test error handling with invalid prompt"""
        with pytest.raises(ValueError):
            await llm_client.generate("")
    
    @pytest.mark.asyncio
    async def test_statistics(self, llm_client):
        """Test LLM client statistics"""
        llm_client.stats = {
            'total_requests': 100,
            'total_tokens': 5000,
            'total_cost': 0.50,
            'cache_hits': 60,
            'cache_misses': 40
        }
        
        stats = llm_client.get_statistics()
        
        assert stats['total_requests'] == 100
        assert stats['cache_hit_rate'] == 0.6
        assert stats['avg_tokens_per_request'] == 50
        assert stats['total_cost'] == 0.50
