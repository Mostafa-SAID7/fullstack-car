"""
Enhanced LLM client with retry logic, fallback, caching, and cost tracking.
"""
import asyncio
import hashlib
import time
from typing import Optional, Dict, Any, List
from app.core.config import settings
from app.core.cache import cache_service
from app.core.exceptions import LLMException, LLMTimeoutException, LLMRateLimitException
import logging

logger = logging.getLogger(__name__)

class LLMClient:
    """Enhanced LLM client with retry, fallback, and caching"""
    
    def __init__(self):
        self.primary_pipeline = None
        self.openai_client = None
        self.tokenizer = None
        self.max_retries = 3
        self.backoff_factor = 2.0
        self.cache_ttl = 604800  # 7 days in seconds
        self.rate_limit_per_hour = 100
        self.rate_limit_tracker: Dict[str, List[float]] = {}
        
        # Token costs (example rates, adjust based on actual pricing)
        self.token_costs = {
            'local': 0.0,  # Local models are free
            'gpt-3.5-turbo': 0.002 / 1000,  # $0.002 per 1K tokens
            'gpt-4': 0.03 / 1000  # $0.03 per 1K tokens
        }
    
    def set_primary_pipeline(self, pipeline, tokenizer):
        """Set the primary local model pipeline"""
        self.primary_pipeline = pipeline
        self.tokenizer = tokenizer
        logger.info("Primary LLM pipeline set")
    
    def set_openai_client(self, client):
        """Set OpenAI client for fallback"""
        self.openai_client = client
        logger.info("OpenAI fallback client set")
    
    async def generate(
        self,
        prompt: str,
        max_tokens: int = 200,
        temperature: float = 0.7,
        user_id: Optional[str] = None,
        use_cache: bool = True
    ) -> Dict[str, Any]:
        """
        Generate response with retry, fallback, and caching.
        
        Args:
            prompt: Input prompt
            max_tokens: Maximum tokens to generate
            temperature: Sampling temperature
            user_id: User ID for rate limiting
            use_cache: Whether to use cached responses
            
        Returns:
            Dictionary with response text, tokens used, cost, and model used
        """
        # Check rate limit
        if user_id and not self._check_rate_limit(user_id):
            raise LLMRateLimitException(
                f"Rate limit exceeded for user {user_id}",
                {"user_id": user_id, "limit": self.rate_limit_per_hour}
            )
        
        # Check cache
        if use_cache:
            cached_response = await self._get_cached_response(prompt)
            if cached_response:
                logger.info("Returning cached LLM response")
                return cached_response
        
        # Try primary model with retries
        response = await self._generate_with_retry(
            prompt, max_tokens, temperature
        )
        
        # Cache the response
        if use_cache:
            await self._cache_response(prompt, response)
        
        # Track rate limit
        if user_id:
            self._track_request(user_id)
        
        return response
    
    async def _generate_with_retry(
        self,
        prompt: str,
        max_tokens: int,
        temperature: float
    ) -> Dict[str, Any]:
        """Generate with exponential backoff retry"""
        last_exception = None
        
        for attempt in range(self.max_retries):
            try:
                # Try primary model first
                if self.primary_pipeline:
                    return await self._generate_primary(prompt, max_tokens, temperature)
                
                # Fallback to OpenAI if primary not available
                if self.openai_client:
                    return await self._generate_openai(prompt, max_tokens, temperature)
                
                # No models available
                raise LLMException(
                    "No LLM models available",
                    {"primary_available": False, "openai_available": False}
                )
                
            except LLMRateLimitException:
                # Don't retry on rate limit
                raise
                
            except Exception as e:
                last_exception = e
                logger.warning(f"LLM generation attempt {attempt + 1} failed: {e}")
                
                if attempt < self.max_retries - 1:
                    # Exponential backoff
                    wait_time = self.backoff_factor ** attempt
                    logger.info(f"Retrying in {wait_time} seconds...")
                    await asyncio.sleep(wait_time)
                else:
                    # Last attempt failed, try fallback
                    if self.primary_pipeline and self.openai_client:
                        logger.info("Primary model failed, trying OpenAI fallback")
                        try:
                            return await self._generate_openai(prompt, max_tokens, temperature)
                        except Exception as fallback_error:
                            logger.error(f"Fallback also failed: {fallback_error}")
        
        # All retries failed
        raise LLMException(
            f"LLM generation failed after {self.max_retries} retries",
            {"last_error": str(last_exception), "attempts": self.max_retries}
        )
    
    async def _generate_primary(
        self,
        prompt: str,
        max_tokens: int,
        temperature: float
    ) -> Dict[str, Any]:
        """Generate using primary local model"""
        try:
            start_time = time.time()
            
            # Generate response
            response = self.primary_pipeline(
                prompt,
                max_new_tokens=max_tokens,
                temperature=temperature,
                do_sample=True,
                pad_token_id=self.tokenizer.eos_token_id if self.tokenizer else None
            )
            
            generated_text = response[0]['generated_text']
            
            # Extract only the new text (remove prompt)
            if "Assistant:" in generated_text:
                response_text = generated_text.split("Assistant:")[-1].strip()
            else:
                response_text = generated_text[len(prompt):].strip()
            
            # Count tokens (approximate)
            tokens_used = len(self.tokenizer.encode(generated_text)) if self.tokenizer else len(generated_text.split())
            
            elapsed_time = time.time() - start_time
            
            return {
                'text': response_text,
                'tokens_used': tokens_used,
                'cost': 0.0,  # Local model is free
                'model': 'local',
                'response_time': elapsed_time
            }
            
        except Exception as e:
            logger.error(f"Primary model generation failed: {e}")
            raise LLMException(f"Primary model error: {str(e)}")
    
    async def _generate_openai(
        self,
        prompt: str,
        max_tokens: int,
        temperature: float
    ) -> Dict[str, Any]:
        """Generate using OpenAI API"""
        try:
            if not self.openai_client:
                raise LLMException("OpenAI client not configured")
            
            start_time = time.time()
            
            # Call OpenAI API
            response = await asyncio.to_thread(
                self.openai_client.chat.completions.create,
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=max_tokens,
                temperature=temperature
            )
            
            response_text = response.choices[0].message.content
            tokens_used = response.usage.total_tokens
            cost = tokens_used * self.token_costs['gpt-3.5-turbo']
            
            elapsed_time = time.time() - start_time
            
            return {
                'text': response_text,
                'tokens_used': tokens_used,
                'cost': cost,
                'model': 'gpt-3.5-turbo',
                'response_time': elapsed_time
            }
            
        except Exception as e:
            logger.error(f"OpenAI generation failed: {e}")
            raise LLMException(f"OpenAI error: {str(e)}")
    
    async def _get_cached_response(self, prompt: str) -> Optional[Dict[str, Any]]:
        """Get cached response for prompt"""
        try:
            prompt_hash = self._hash_prompt(prompt)
            cached = await cache_service.get_llm_response(prompt_hash)
            return cached
        except Exception as e:
            logger.warning(f"Cache retrieval failed: {e}")
            return None
    
    async def _cache_response(self, prompt: str, response: Dict[str, Any]):
        """Cache response for prompt"""
        try:
            prompt_hash = self._hash_prompt(prompt)
            await cache_service.set_llm_response(prompt_hash, response, self.cache_ttl)
        except Exception as e:
            logger.warning(f"Cache storage failed: {e}")
    
    def _hash_prompt(self, prompt: str) -> str:
        """Generate hash for prompt (for caching)"""
        return hashlib.sha256(prompt.encode()).hexdigest()
    
    def _check_rate_limit(self, user_id: str) -> bool:
        """Check if user is within rate limit"""
        current_time = time.time()
        hour_ago = current_time - 3600
        
        # Get user's request history
        if user_id not in self.rate_limit_tracker:
            self.rate_limit_tracker[user_id] = []
        
        # Remove requests older than 1 hour
        self.rate_limit_tracker[user_id] = [
            t for t in self.rate_limit_tracker[user_id] if t > hour_ago
        ]
        
        # Check if under limit
        return len(self.rate_limit_tracker[user_id]) < self.rate_limit_per_hour
    
    def _track_request(self, user_id: str):
        """Track a request for rate limiting"""
        current_time = time.time()
        
        if user_id not in self.rate_limit_tracker:
            self.rate_limit_tracker[user_id] = []
        
        self.rate_limit_tracker[user_id].append(current_time)
    
    def count_tokens(self, text: str) -> int:
        """Count tokens in text"""
        if self.tokenizer:
            return len(self.tokenizer.encode(text))
        else:
            # Approximate: 1 token ≈ 4 characters
            return len(text) // 4
    
    def estimate_cost(self, tokens: int, model: str = 'local') -> float:
        """Estimate cost for token count"""
        cost_per_token = self.token_costs.get(model, 0.0)
        return tokens * cost_per_token
    
    async def stream_generate(
        self,
        prompt: str,
        max_tokens: int = 200,
        temperature: float = 0.7
    ):
        """
        Generate response with streaming (for real-time display).
        
        Note: This is a simplified implementation. Full streaming would require
        more complex integration with the model.
        """
        # For now, generate normally and yield in chunks
        response = await self.generate(prompt, max_tokens, temperature, use_cache=False)
        
        # Yield response in chunks
        text = response['text']
        chunk_size = 10
        
        for i in range(0, len(text), chunk_size):
            chunk = text[i:i + chunk_size]
            yield {
                'chunk': chunk,
                'done': i + chunk_size >= len(text)
            }
            await asyncio.sleep(0.05)  # Small delay for streaming effect
    
    def get_stats(self) -> Dict[str, Any]:
        """Get LLM client statistics"""
        return {
            'primary_available': self.primary_pipeline is not None,
            'openai_available': self.openai_client is not None,
            'max_retries': self.max_retries,
            'cache_ttl_days': self.cache_ttl / 86400,
            'rate_limit_per_hour': self.rate_limit_per_hour,
            'active_users': len(self.rate_limit_tracker)
        }
