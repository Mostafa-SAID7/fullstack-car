"""
Intent Classifier - Routes messages to appropriate agents based on intent detection.
"""
from typing import Dict, Any, Optional, List
from app.models.schemas import ConversationContext
from app.services.llm_client import LLMClient
import logging
import re

logger = logging.getLogger(__name__)


class Intent:
    """Represents a detected intent"""
    
    def __init__(self, category: str, confidence: float, metadata: Dict[str, Any] = None):
        self.category = category
        self.confidence = confidence
        self.metadata = metadata or {}
    
    def __repr__(self):
        return f"Intent(category='{self.category}', confidence={self.confidence:.2f})"


class IntentClassifier:
    """
    Classifies user messages to determine appropriate agent routing.
    
    Uses a hybrid approach:
    1. Keyword-based classification (fast, reliable for clear intents)
    2. LLM-based classification (for complex or ambiguous cases)
    """
    
    def __init__(self):
        self.llm_client = LLMClient()
        self.intent_history: Dict[str, List[Intent]] = {}
        
        # Define keyword patterns for each intent
        self.intent_keywords = {
            'maintenance': {
                'primary': ['oil change', 'tire rotation', 'service', 'maintenance', 'tune-up', 'inspection'],
                'secondary': ['schedule', 'when should', 'how often', 'interval', 'due']
            },
            'diagnosis': {
                'primary': ['problem', 'issue', 'noise', 'smell', 'warning light', 'error', 'broken', 'not working'],
                'secondary': ['diagnose', 'check', 'fix', 'repair', 'wrong']
            },
            'buying': {
                'primary': ['buy', 'purchase', 'looking for', 'want to buy', 'shopping for', 'need a car'],
                'secondary': ['recommend', 'best car', 'which car', 'should i buy', 'budget']
            },
            'selling': {
                'primary': ['sell', 'selling', 'list my car', 'price my car', 'how much is my car worth'],
                'secondary': ['listing', 'advertise', 'market value', 'trade-in']
            },
            'modification': {
                'primary': ['modify', 'modification', 'upgrade', 'tune', 'turbo', 'exhaust', 'intake', 'custom'],
                'secondary': ['performance', 'mod', 'install', 'compatible', 'aftermarket']
            },
            'community': {
                'primary': ['how to', 'how do i', 'create post', 'join group', 'find event'],
                'secondary': ['platform', 'feature', 'help', 'guide', 'tutorial']
            }
        }
        
        # Intent confidence thresholds
        self.high_confidence_threshold = 0.8
        self.medium_confidence_threshold = 0.5
        
        logger.info("IntentClassifier initialized")
    
    async def classify(
        self, 
        message: str, 
        context: ConversationContext,
        use_llm_fallback: bool = True
    ) -> Intent:
        """
        Classify user message to determine intent.
        
        Args:
            message: User's message
            context: Conversation context
            use_llm_fallback: Whether to use LLM for ambiguous cases
            
        Returns:
            Intent object with category and confidence
        """
        logger.info(f"Classifying message: {message[:50]}...")
        
        # Step 1: Try keyword-based classification
        keyword_intent = self._classify_by_keywords(message)
        
        # If high confidence, return immediately
        if keyword_intent.confidence >= self.high_confidence_threshold:
            logger.info(f"High confidence keyword match: {keyword_intent}")
            self._track_intent(context.conversation_id, keyword_intent)
            return keyword_intent
        
        # Step 2: Check conversation history for context
        history_intent = self._classify_by_history(message, context)
        if history_intent and history_intent.confidence >= self.medium_confidence_threshold:
            logger.info(f"Intent inferred from history: {history_intent}")
            self._track_intent(context.conversation_id, history_intent)
            return history_intent
        
        # Step 3: Use LLM for complex cases (if enabled)
        if use_llm_fallback and keyword_intent.confidence < self.medium_confidence_threshold:
            logger.info("Using LLM for intent classification")
            llm_intent = await self._classify_by_llm(message, context)
            if llm_intent.confidence >= self.medium_confidence_threshold:
                self._track_intent(context.conversation_id, llm_intent)
                return llm_intent
        
        # Step 4: Return best available intent (or default to general)
        if keyword_intent.confidence > 0:
            logger.info(f"Returning keyword intent with medium confidence: {keyword_intent}")
            self._track_intent(context.conversation_id, keyword_intent)
            return keyword_intent
        
        # Default to general intent
        default_intent = Intent('general', 0.5, {'reason': 'no_clear_intent'})
        logger.info(f"Defaulting to general intent: {default_intent}")
        self._track_intent(context.conversation_id, default_intent)
        return default_intent
    
    def _classify_by_keywords(self, message: str) -> Intent:
        """Classify using keyword matching"""
        message_lower = message.lower()
        scores = {}
        
        for intent_category, keywords in self.intent_keywords.items():
            score = 0.0
            matched_keywords = []
            
            # Check primary keywords (higher weight)
            for keyword in keywords['primary']:
                if keyword in message_lower:
                    score += 0.4
                    matched_keywords.append(keyword)
            
            # Check secondary keywords (lower weight)
            for keyword in keywords['secondary']:
                if keyword in message_lower:
                    score += 0.2
                    matched_keywords.append(keyword)
            
            # Cap score at 1.0
            score = min(1.0, score)
            
            if score > 0:
                scores[intent_category] = {
                    'score': score,
                    'matched_keywords': matched_keywords
                }
        
        # Find highest scoring intent
        if scores:
            best_intent = max(scores.items(), key=lambda x: x[1]['score'])
            category = best_intent[0]
            confidence = best_intent[1]['score']
            metadata = {
                'method': 'keyword',
                'matched_keywords': best_intent[1]['matched_keywords']
            }
            return Intent(category, confidence, metadata)
        
        return Intent('general', 0.0, {'method': 'keyword', 'reason': 'no_keywords_matched'})
    
    def _classify_by_history(
        self, 
        message: str, 
        context: ConversationContext
    ) -> Optional[Intent]:
        """Classify based on conversation history"""
        
        # Get recent intents for this conversation
        conversation_id = context.conversation_id
        if conversation_id not in self.intent_history:
            return None
        
        recent_intents = self.intent_history[conversation_id][-3:]  # Last 3 intents
        if not recent_intents:
            return None
        
        # Check if message is a follow-up (short, no clear keywords)
        is_followup = len(message.split()) < 5 and not any(
            keyword in message.lower() 
            for keywords in self.intent_keywords.values() 
            for keyword in keywords['primary']
        )
        
        if is_followup and recent_intents:
            # Assume same intent as previous message
            last_intent = recent_intents[-1]
            return Intent(
                last_intent.category,
                0.7,  # Medium-high confidence for follow-ups
                {'method': 'history', 'reason': 'follow_up'}
            )
        
        # Check for intent consistency
        if len(recent_intents) >= 2:
            # If last 2 intents are the same, boost confidence
            if recent_intents[-1].category == recent_intents[-2].category:
                return Intent(
                    recent_intents[-1].category,
                    0.6,
                    {'method': 'history', 'reason': 'consistent_intent'}
                )
        
        return None
    
    async def _classify_by_llm(
        self, 
        message: str, 
        context: ConversationContext
    ) -> Intent:
        """Classify using LLM for complex cases"""
        
        # Build prompt for intent classification
        prompt = self._build_classification_prompt(message, context)
        
        try:
            # Generate classification
            response = await self.llm_client.generate(
                prompt=prompt,
                max_tokens=50,
                temperature=0.1,  # Lower temperature for deterministic classification
                user_id=context.user_id,
                use_cache=True,
                model_id="gemini-1.5-flash"
            )
            
            # Parse response
            intent = self._parse_llm_response(response['text'])
            intent.metadata['method'] = 'llm'
            
            return intent
            
        except Exception as e:
            logger.error(f"LLM classification failed: {e}")
            return Intent('general', 0.3, {'method': 'llm', 'error': str(e)})
    
    def _build_classification_prompt(
        self, 
        message: str, 
        context: ConversationContext
    ) -> str:
        """Build prompt for LLM-based classification"""
        
        intent_descriptions = {
            'maintenance': 'Regular car maintenance, service schedules, oil changes, tire rotations',
            'diagnosis': 'Car problems, issues, strange noises, warning lights, repairs',
            'buying': 'Looking to buy a car, car recommendations, budget, features',
            'selling': 'Selling a car, pricing, creating listings, market value',
            'modification': 'Car modifications, upgrades, performance, customization',
            'community': 'Platform features, how to use the app, creating posts, joining groups',
            'general': 'General questions, greetings, unclear intent'
        }
        
        # Get recent messages for context
        recent_messages = context.get_recent_messages(limit=3)
        history_text = ""
        if recent_messages:
            history_text = "Recent conversation:\n"
            for msg in recent_messages:
                role = "User" if msg.role == "user" else "Assistant"
                history_text += f"{role}: {msg.content}\n"
        
        prompt = f"""Classify the user's intent from the following message.

Available intents:
{chr(10).join(f'- {intent}: {desc}' for intent, desc in intent_descriptions.items())}

{history_text}
Current message: {message}

Respond with ONLY the intent category (one word) and confidence (0.0-1.0) in this format:
INTENT: <category>
CONFIDENCE: <0.0-1.0>

Classification:"""
        
        return prompt
    
    def _parse_llm_response(self, response: str) -> Intent:
        """Parse LLM classification response"""
        
        # Extract intent category
        intent_match = re.search(r'INTENT:\s*(\w+)', response, re.IGNORECASE)
        category = intent_match.group(1).lower() if intent_match else 'general'
        
        # Validate category
        valid_categories = list(self.intent_keywords.keys()) + ['general']
        if category not in valid_categories:
            category = 'general'
        
        # Extract confidence
        confidence_match = re.search(r'CONFIDENCE:\s*([\d.]+)', response, re.IGNORECASE)
        confidence = float(confidence_match.group(1)) if confidence_match else 0.5
        confidence = max(0.0, min(1.0, confidence))  # Clamp to [0, 1]
        
        return Intent(category, confidence)
    
    def _track_intent(self, conversation_id: str, intent: Intent) -> None:
        """Track intent for conversation history"""
        if conversation_id not in self.intent_history:
            self.intent_history[conversation_id] = []
        
        self.intent_history[conversation_id].append(intent)
        
        # Keep only last 10 intents per conversation
        if len(self.intent_history[conversation_id]) > 10:
            self.intent_history[conversation_id] = self.intent_history[conversation_id][-10:]
    
    def get_intent_history(self, conversation_id: str) -> List[Intent]:
        """Get intent history for a conversation"""
        return self.intent_history.get(conversation_id, [])
    
    def clear_history(self, conversation_id: str) -> None:
        """Clear intent history for a conversation"""
        if conversation_id in self.intent_history:
            del self.intent_history[conversation_id]
    
    def get_stats(self) -> Dict[str, Any]:
        """Get classifier statistics"""
        total_conversations = len(self.intent_history)
        total_intents = sum(len(intents) for intents in self.intent_history.values())
        
        # Count intents by category
        intent_counts = {}
        for intents in self.intent_history.values():
            for intent in intents:
                intent_counts[intent.category] = intent_counts.get(intent.category, 0) + 1
        
        return {
            'total_conversations': total_conversations,
            'total_intents_classified': total_intents,
            'intent_distribution': intent_counts,
            'available_intents': list(self.intent_keywords.keys()) + ['general']
        }
