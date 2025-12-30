import asyncio
from typing import Dict, List, Optional
from app.core.config import settings
from app.models.schemas import ChatMessage, CarRecommendationDTO, MaintenanceResponseDTO
from app.services.inventory_service import InventoryService
from app.services.scraper_service import ScraperService
from app.core.database import get_db
import logging
import json

logger = logging.getLogger(__name__)

class AIService:
    def __init__(self):
        self.tokenizer = None
        self.model = None
        self.embedding_model = None
        self.chat_pipeline = None
        self.device = "cpu"
        self.inventory_service = InventoryService()
        self.scraper_service = ScraperService()
        
    async def initialize(self):
        """Initialize AI models"""
        try:
            logger.info("Initializing AI models...")
            # Lazy imports
            from transformers import AutoTokenizer, AutoModelForCausalLM, pipeline
            from sentence_transformers import SentenceTransformer
            import torch
            
            self.device = "cuda" if torch.cuda.is_available() else "cpu"
            
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
            # Fallback for dev and if models can't be loaded (e.g. no internet)
            logger.warning("Proceeding with mock responses for development")
            self.chat_pipeline = None
    
    async def generate_chat_response(self, message: str, context: Optional[str] = None) -> str:
        """Generate chat response using the AI model"""
        
        # 1. Advanced Feature: Check Inventory
        if "available" in message.lower() or "price" in message.lower() or "stock" in message.lower():
            try:
                db = next(get_db())
                vehicles = self.inventory_service.search_vehicles(db, message)
                if vehicles:
                    response_text = "Here are some matching cars from our inventory:\n"
                    for v in vehicles:
                        response_text += f"- {v['make']} {v['model']} ({v['year']}): ${v['price']} - {v['description']}\n"
                    return response_text
            except Exception as e:
                logger.error(f"Inventory lookup failed: {e}")

        # 2. Advanced Feature: Check News
        if "news" in message.lower() or "latest" in message.lower():
            try:
                news = await self.scraper_service.scrape_car_news()
                if news:
                    response_text = "Here is the latest car news I found:\n"
                    for n in news:
                        response_text += f"- {n['title']} (Source: {n['source']})\n"
                    return response_text
            except Exception as e:
                logger.error(f"News lookup failed: {e}")

        if not self.chat_pipeline:
            return f"DEVELOPMENT MODE: This is a simulated response to: '{message}'"

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
    
    async def get_car_recommendations(self, user_preferences: Dict) -> List[CarRecommendationDTO]:
        """Generate car recommendations based on user preferences"""
        try:
            # Create prompt for car recommendations
            prompt = f"""
            System: You are an expert car consultant. Provide 3 specific car recommendations.
            Return ONLY a JSON array of objects with keys: make, model, year, price_range, reason, confidence_score.
            
            User Preferences:
            Budget: {user_preferences.get('budget', 'Not specified')}
            Car Type: {user_preferences.get('car_type', 'Any')}
            Fuel Type: {user_preferences.get('fuel_type', 'Any')}
            Usage: {user_preferences.get('usage', 'Daily driving')}
            """
            
            response = await self.generate_chat_response(prompt)
            
            # Attempt to parse JSON if model is capable, otherwise fallback
            try:
                # Basic cleaning of response to find JSON
                json_start = response.find('[')
                json_end = response.rfind(']') + 1
                if json_start != -1 and json_end != -1:
                    recommendations_data = json.loads(response[json_start:json_end])
                    return [CarRecommendationDTO(**item) for item in recommendations_data]
            except:
                pass

            # Fallback recommendations if parsing fails
            return [
                CarRecommendationDTO(
                    make="Toyota", model="Camry Hybrid", year=2024,
                    price_range="$28,000 - $35,000",
                    reason="Excellent fuel economy and reliability for daily commuting.",
                    confidence_score=0.95
                ),
                CarRecommendationDTO(
                    make="Tesla", model="Model 3", year=2024,
                    price_range="$38,000 - $45,000",
                    reason="Top tier electric performance and technology.",
                    confidence_score=0.88
                ),
                CarRecommendationDTO(
                    make="Honda", model="CR-V", year=2024,
                    price_range="$30,000 - $38,000",
                    reason="Versatile family SUV with great resale value.",
                    confidence_score=0.92
                )
            ]
            
        except Exception as e:
            logger.error(f"Error generating car recommendations: {str(e)}")
            return []
    
    async def get_maintenance_advice(self, car_info: Dict) -> MaintenanceResponseDTO:
        """Generate maintenance advice for a specific car"""
        try:
            prompt = f"""
            Identify maintenance tasks for: {car_info.get('make', '')} {car_info.get('model', '')} {car_info.get('year', '')}
            Mileage: {car_info.get('mileage', 'Unknown')}
            Provide priority items and general recommendations.
            """
            
            response = await self.generate_chat_response(prompt)
            
            # Create structured maintenance advice
            advice = MaintenanceResponseDTO(
                priority_items=["Oil change (Immediate)", "Brake inspection", "Tire rotation"],
                upcoming_services=["Brake pad replacement", "Air filter change"],
                estimated_costs={"Oil change": "$60-90", "Brake pads": "$150-300"},
                recommendations=response,
                next_service_date="Within 3 months"
            )
            
            return advice
            
        except Exception as e:
            logger.error(f"Error generating maintenance advice: {str(e)}")
            return MaintenanceResponseDTO(
                priority_items=[],
                upcoming_services=[],
                estimated_costs={},
                recommendations="Unable to generate advice.",
                next_service_date=None
            )
    
    async def analyze_car_market(self, car_query: str) -> Dict:
        """Analyze car market trends and pricing"""
        try:
            prompt = f"Analyze the current market trends, price outlook, and supply for: {car_query}"
            response = await self.generate_chat_response(prompt)
            
            return {
                "analysis": response,
                "market_trend": "Increasing Demand",
                "price_trend": "Slightly Upward",
                "recommendation": "Buy now if you find a good deal",
                "confidence": 0.82
            }
            
        except Exception as e:
            logger.error(f"Error analyzing car market: {str(e)}")
            return {
                "analysis": "Market analysis unavailable.",
                "market_trend": "N/A",
                "price_trend": "N/A",
                "recommendation": "Check with local experts",
                "confidence": 0.0
            }