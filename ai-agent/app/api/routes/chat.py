from fastapi import APIRouter, Depends, HTTPException, Request
from app.models.schemas import ChatMessage, ChatResponse
from app.core.ai_service import AIService
import logging

logger = logging.getLogger(__name__)
router = APIRouter()

def get_ai_service(request: Request) -> AIService:
    return request.app.state.ai_service

@router.post("/", response_model=ChatResponse)
async def chat(
    message: ChatMessage,
    ai_service: AIService = Depends(get_ai_service)
):
    """
    Chat with the AI assistant about cars, maintenance, and automotive topics
    """
    try:
        response = await ai_service.generate_chat_response(
            message.message,
            message.context
        )
        
        return ChatResponse(
            response=response,
            confidence=0.8  # You can implement actual confidence scoring
        )
        
    except Exception as e:
        logger.error(f"Error in chat endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.post("/context")
async def chat_with_context(
    message: ChatMessage,
    ai_service: AIService = Depends(get_ai_service)
):
    """
    Chat with additional context about user's car or preferences
    """
    try:
        # Enhanced context handling for car-specific conversations
        enhanced_context = f"""
        You are an AI assistant specialized in automotive advice for the Community Car platform.
        You help car enthusiasts with:
        - Car recommendations based on preferences and budget
        - Maintenance scheduling and advice
        - Market analysis and pricing insights
        - Technical automotive questions
        - Community engagement tips
        
        User context: {message.context or 'No additional context provided'}
        
        Provide helpful, accurate, and friendly responses focused on automotive topics.
        """
        
        response = await ai_service.generate_chat_response(
            message.message,
            enhanced_context
        )
        
        return ChatResponse(
            response=response,
            confidence=0.85
        )
        
    except Exception as e:
        logger.error(f"Error in context chat endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")