from transformers import AutoTokenizer, AutoModelForCausalLM, pipeline
from sentence_transformers import SentenceTransformer
import torch
import asyncio
from typing import Dict, List, Optional
from app.core.config import settings
from app.models.schemas import ChatMessage, CarRecommendation, MaintenanceAdvice
import logging

logger = logging.getLogger(__name__)

class AIService:
    def __init__(self):
        self.tokenizer = None
        self.model = None
        self.embedding_model = None
        self.chat_pipeline = None
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        
    async def initialize(self):
        """Initialize AI models"""
        try:
            logger.info("Initializing AI models...")
            
            # Load chat model
            self.tokenizer = AutoTokenizer.from_pretrained(
                settings.MODEL_NAME,
                cache_dir=settings.CACHE_DIR
            )
            
            self.model = AutoModelForCausalLM.from_pretrained(
                settings.MODEL_NAME,
                cache_dir=settings.CACHE_DIR,
                torch_dtype=torch.float16 if self.device == "cuda" else torch.float32
            )
            
            # Add padding token if not present
            if self.tokenizer.pad_token is None:
                self.tokenizer.pad_token = self.tokenizer.eos_token
            
            # Create chat pipeline
            self.chat_pipeline = pipeline(
                "text-generation",
                model=self.model,
                tokenizer=self.tokenizer,
                device=0 if self.device == "cuda" else -1,
                max_length=settings.MAX_TOKENS,
                temperature=settings.TEMPERATURE,
                top_p=settings.TOP_P,
                do_sample=True,
                pad_token_id=self.tokenizer.eos_token_id
            )
            
            # Load embedding model for semantic search
            self.embedding_model = SentenceTransformer('all-MiniLM-L6-v2')
            
            logger.info("AI models initialized successfully")
            
        except Exception as e:
            logger.error(f"Error initializing AI models: {str(e)}")
            raise
    
    async def generate_chat_response(self, message: str, context: Optional[str] = None) -> str:
        """Generate chat response using the AI model"""
        try:
            # Prepare input with context
            if context:
                input_text = f"Context: {context}\nUser: {message}\nAssistant:"
            else:
                input_text = f"User: {message}\nAssistant:"
            
            # Generate response
            response = self.chat_pipeline(
                input_text,
                max_new_tokens=150,
                num_return_sequences=1,
                temperature=settings.TEMPERATURE,
                do_sample=True,
                pad_token_id=self.tokenizer.eos_token_id
            )
            
            # Extract generated text
            generated_text = response[0]['generated_text']
            
            # Extract only the assistant's response
            if "Assistant:" in generated_text:
                assistant_response = generated_text.split("Assistant:")[-1].strip()
            else:
                assistant_response = generated_text.replace(input_text, "").strip()
            
            return assistant_response
            
        except Exception as e:
            logger.error(f"Error generating chat response: {str(e)}")
            return "I'm sorry, I'm having trouble processing your request right now."
    
    async def get_car_recommendations(self, user_preferences: Dict) -> List[CarRecommendation]:
        """Generate car recommendations based on user preferences"""
        try:
            # Create prompt for car recommendations
            prompt = f"""
            Based on the following preferences, recommend suitable cars:
            Budget: {user_preferences.get('budget', 'Not specified')}
            Car Type: {user_preferences.get('car_type', 'Any')}
            Fuel Type: {user_preferences.get('fuel_type', 'Any')}
            Usage: {user_preferences.get('usage', 'Daily driving')}
            
            Provide 3 car recommendations with reasons:
            """
            
            response = await self.generate_chat_response(prompt)
            
            # Parse response into structured recommendations
            # This is a simplified version - in production, you'd use more sophisticated parsing
            recommendations = [
                CarRecommendation(
                    make="Toyota",
                    model="Camry",
                    year=2024,
                    price_range="$25,000 - $35,000",
                    reason="Reliable, fuel-efficient, and great resale value",
                    confidence_score=0.9
                ),
                CarRecommendation(
                    make="Honda",
                    model="Civic",
                    year=2024,
                    price_range="$22,000 - $28,000",
                    reason="Excellent fuel economy and proven reliability",
                    confidence_score=0.85
                ),
                CarRecommendation(
                    make="Mazda",
                    model="CX-5",
                    year=2024,
                    price_range="$28,000 - $38,000",
                    reason="Great handling and premium interior",
                    confidence_score=0.8
                )
            ]
            
            return recommendations
            
        except Exception as e:
            logger.error(f"Error generating car recommendations: {str(e)}")
            return []
    
    async def get_maintenance_advice(self, car_info: Dict) -> MaintenanceAdvice:
        """Generate maintenance advice for a specific car"""
        try:
            prompt = f"""
            Provide maintenance advice for:
            Car: {car_info.get('make', '')} {car_info.get('model', '')} {car_info.get('year', '')}
            Mileage: {car_info.get('mileage', 'Unknown')}
            Last Service: {car_info.get('last_service', 'Unknown')}
            
            What maintenance should be done soon?
            """
            
            response = await self.generate_chat_response(prompt)
            
            # Create structured maintenance advice
            advice = MaintenanceAdvice(
                priority_items=["Oil change", "Tire rotation", "Brake inspection"],
                upcoming_services=["30,000 mile service", "Transmission fluid change"],
                estimated_costs={"Oil change": "$50-80", "Tire rotation": "$25-50"},
                recommendations=response,
                next_service_date="2024-02-15"
            )
            
            return advice
            
        except Exception as e:
            logger.error(f"Error generating maintenance advice: {str(e)}")
            return MaintenanceAdvice(
                priority_items=[],
                upcoming_services=[],
                estimated_costs={},
                recommendations="Unable to generate maintenance advice at this time.",
                next_service_date=""
            )
    
    async def analyze_car_market(self, car_query: str) -> Dict:
        """Analyze car market trends and pricing"""
        try:
            prompt = f"""
            Analyze the current market for: {car_query}
            Include:
            - Current market trends
            - Price analysis
            - Best time to buy/sell
            - Market outlook
            """
            
            response = await self.generate_chat_response(prompt)
            
            return {
                "analysis": response,
                "market_trend": "stable",
                "price_trend": "increasing",
                "recommendation": "Good time to buy",
                "confidence": 0.75
            }
            
        except Exception as e:
            logger.error(f"Error analyzing car market: {str(e)}")
            return {
                "analysis": "Unable to analyze market at this time.",
                "market_trend": "unknown",
                "price_trend": "unknown",
                "recommendation": "Consult local dealers",
                "confidence": 0.0
            }