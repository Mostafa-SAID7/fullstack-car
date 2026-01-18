"""
Sentiment Analyzer - Detects user mood and technical level using Gemini.
"""
import logging
from typing import Dict, Any, Optional
from app.services.llm_client import LLMClient
from app.models.schemas import ConversationContext

logger = logging.getLogger(__name__)

class SentimentAnalyzer:
    """
    Analyzes user sentiment and intent depth to help agents tailor their responses.
    """
    
    def __init__(self):
        self.llm_client = LLMClient()
        
    async def analyze(self, message: str, context: Optional[ConversationContext] = None) -> Dict[str, Any]:
        """
        Analyze user message for sentiment and technical depth.
        """
        prompt = f"""Analyze the user's sentiment and technical depth from this message:
"{message}"

Respond with ONLY a JSON object in this format:
{{
  "sentiment": "positive|neutral|negative|frustrated|happy",
  "technical_depth": "beginner|intermediate|advanced",
  "urgency": "low|medium|high",
  "emotional_context": "brief description of user's current feeling"
}}
"""
        try:
            # Use 1.5-flash for speed/cost
            response = await self.llm_client.generate(
                prompt=prompt,
                model_id="gemini-1.5-flash",
                temperature=0.1,
                max_tokens=100,
                use_cache=True
            )
            
            import json
            import re
            
            # Extract JSON from response
            text = response['text']
            json_match = re.search(r'\{.*\}', text, re.DOTALL)
            if json_match:
                return json.loads(json_match.group())
            
            return {
                "sentiment": "neutral",
                "technical_depth": "beginner",
                "urgency": "low",
                "emotional_context": "unknown"
            }
            
        except Exception as e:
            logger.error(f"Sentiment analysis failed: {e}")
            return {
                "sentiment": "neutral",
                "technical_depth": "beginner",
                "urgency": "low",
                "error": str(e)
            }

# Singleton
sentiment_analyzer = SentimentAnalyzer()
