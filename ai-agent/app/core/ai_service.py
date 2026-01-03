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
        """Generate chat response with intelligent routing and context awareness"""
        
        # 0. Handle Mode Prefixes (sent by frontend)
        routing_mode = "chat"
        clean_message = message
        if message.startswith("[") and "]" in message:
            mode_tag = message[1:message.find("]")]
            routing_mode = mode_tag.lower().replace(" mode", "")
            clean_message = message[message.find("]") + 1:].strip()

        # 1. Specialized Logic Routing
        if routing_mode == "maintenance":
            # Extract basic car info if possible from message or use context
            advice = await self.get_maintenance_advice({"make": "Toyota", "model": "Camry", "year": 2020}) # Mock extraction
            return f"{advice.recommendations}\n\n**Priority Tasks:**\n" + "\n".join([f"- {i}" for i in advice.priority_items])
        
        if routing_mode == "recommendation":
            recs = await self.get_car_recommendations({"usage": clean_message})
            response = "Based on your needs, I recommend:\n\n"
            for r in recs:
                response += f"### {r.year} {r.make} {r.model}\n- **Why:** {r.reason}\n- **Confidence:** {int(r.confidence_score * 100)}%\n\n"
            return response

        if routing_mode == "analysis":
            analysis = await self.analyze_car_market(clean_message)
            return f"### Market Analysis for {clean_message}\n\n{analysis['analysis']}\n\n**Trend:** {analysis['market_trend']}\n**Price Outlook:** {analysis['price_trend']}\n**Confidence:** {int(analysis['confidence'] * 100)}%"

        # 2. General Chat with dynamic lookups
        if "available" in clean_message.lower() or "price" in clean_message.lower():
            try:
                db = next(get_db())
                vehicles = self.inventory_service.search_vehicles(db, clean_message)
                if vehicles:
                    response_text = "I found some matching cars in our community inventory:\n\n"
                    for v in vehicles:
                        response_text += f"- **{v['year']} {v['make']} {v['model']}**: ${v['price']} ({v['mileage']} miles)\n"
                    return response_text
            except Exception as e:
                logger.error(f"Inventory lookup failed: {e}")

        # 3. Fallback to LLM
        if not self.chat_pipeline:
            return f"Community AI [DEV]: I processed your request for '{clean_message}' in {routing_mode} mode."

        try:
            full_prompt = f"System: You are a helpful car community assistant. Mode: {routing_mode}.\n"
            if context:
                full_prompt += f"Context: {context}\n"
            full_prompt += f"User: {clean_message}\nAssistant:"
            
            response = self.chat_pipeline(
                full_prompt,
                max_new_tokens=200,
                num_return_sequences=1,
                temperature=0.7,
                do_sample=True,
                pad_token_id=self.tokenizer.eos_token_id
            )
            
            generated_text = response[0]['generated_text']
            return generated_text.split("Assistant:")[-1].strip()
            
        except Exception as e:
            logger.error(f"Error generating chat response: {str(e)}")
            return "I'm sorry, I'm having trouble thinking right now. Please try again."
    
    async def get_car_recommendations(self, user_preferences: Dict) -> List[CarRecommendationDTO]:
        """Generate car recommendations by combining DB search and AI ranking"""
        try:
            # 1. Search physical inventory
            db = next(get_db())
            usage = user_preferences.get('usage', '')
            query = f"{user_preferences.get('car_type', '')} {usage}".strip()
            
            db_vehicles = self.inventory_service.search_vehicles(db, query)
            recommendations = []

            for v in db_vehicles:
                recommendations.append(CarRecommendationDTO(
                    make=v['make'], model=v['model'], year=v['year'],
                    price_range=f"${v['price']}",
                    reason=f"Available in our inventory: {v['description'][:100]}...",
                    confidence_score=0.9
                ))

            # 2. Add AI suggestions if inventory is low
            if len(recommendations) < 3:
                prompt = f"Expert Car Matcher. Suggest 2 more cars for someone who needs it for: {usage}."
                ai_suggest = await self.generate_chat_response(prompt)
                # (Simplified parsing for demo)
                recommendations.append(CarRecommendationDTO(
                    make="Toyota", model="Camry", year=2024,
                    price_range="$28k-35k", reason=ai_suggest[:150], confidence_score=0.8
                ))

            return recommendations[:3]
            
        except Exception as e:
            logger.error(f"Error generating car recommendations: {str(e)}")
            return []
    
    async def get_maintenance_advice(self, car_info: Dict) -> MaintenanceResponseDTO:
        """Generate structured maintenance advice based on mileage and car info"""
        try:
            mileage = car_info.get('mileage', 0)
            make = car_info.get('make', 'General')
            model = car_info.get('model', 'Vehicle')
            year = car_info.get('year', 2020)

            priority_items = []
            upcoming_services = []
            estimated_costs = {}

            # Simple rule-based logic for demo/fallback
            if mileage > 0:
                priority_items.append("Oil & Filter Change")
                estimated_costs["Oil Change"] = "$60-120"
                if mileage > 30000:
                    priority_items.append("Air Filter Replacement")
                    upcoming_services.append("Transmission Fluid Check")
                if mileage > 60000:
                    priority_items.append("Brake Pad Inspection")
                if mileage > 100000:
                    priority_items.append("Timing Belt/Chain Replacement")
            
            prompt = f"System: Mechanic Advisor. Summarize maintenance for {year} {make} {model} with {mileage} miles."
            summary = await self.generate_chat_response(prompt)
            
            return MaintenanceResponseDTO(
                priority_items=priority_items or ["Standard Inspection"],
                upcoming_services=upcoming_services or ["Regular maintenance"],
                estimated_costs=estimated_costs,
                recommendations=summary,
                next_service_date="Within 3 months" if mileage > 50000 else "Within 6 months"
            )
            
        except Exception as e:
            logger.error(f"Error generating maintenance advice: {str(e)}")
            return MaintenanceResponseDTO(
                priority_items=[], upcoming_services=[], estimated_costs={},
                recommendations="Unable to generate advice.", next_service_date=None
            )
    
    async def analyze_car_market(self, car_query: str) -> Dict:
        """Analyze car market by merging live news and AI insights"""
        try:
            # 1. Get live news contextual info
            news = await self.scraper_service.scrape_car_news()
            news_context = "\n".join([f"- {n['title']}" for n in news[:3]])

            prompt = f"System: Market Analyst. Analyze the market for {car_query} considering these headlines:\n{news_context}"
            response = await self.generate_chat_response(prompt)
            
            return {
                "analysis": response,
                "market_trend": "Highly Active" if news else "Stable",
                "price_trend": "Increasing" if "price" in response.lower() else "Fluctuating",
                "recommendation": "Great time to research and compare" if news else "Monitor for better deals",
                "confidence": 0.85
            }
            
        except Exception as e:
            logger.error(f"Error analyzing car market: {str(e)}")
            return {
                "analysis": "Market analysis unavailable.",
                "market_trend": "N/A", "price_trend": "N/A",
                "recommendation": "Check independent reports", "confidence": 0.0
            }