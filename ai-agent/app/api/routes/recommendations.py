from fastapi import APIRouter, Depends, HTTPException, Request
from typing import List
from app.models.schemas import CarPreferences, CarRecommendation
from app.core.ai_service import AIService
import logging

logger = logging.getLogger(__name__)
router = APIRouter()

def get_ai_service(request: Request) -> AIService:
    return request.app.state.ai_service

@router.post("/", response_model=List[CarRecommendation])
async def get_car_recommendations(
    preferences: CarPreferences,
    ai_service: AIService = Depends(get_ai_service)
):
    """
    Get personalized car recommendations based on user preferences
    """
    try:
        recommendations = await ai_service.get_car_recommendations(
            preferences.dict(exclude_none=True)
        )
        
        return recommendations
        
    except Exception as e:
        logger.error(f"Error getting car recommendations: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to generate recommendations")

@router.post("/budget-analysis")
async def analyze_budget_options(
    preferences: CarPreferences,
    ai_service: AIService = Depends(get_ai_service)
):
    """
    Analyze car options within a specific budget range
    """
    try:
        if not preferences.budget:
            raise HTTPException(status_code=400, detail="Budget is required for analysis")
        
        # Create budget-focused prompt
        budget_context = f"""
        Analyze car options for budget: {preferences.budget}
        Car type preference: {preferences.car_type or 'Any'}
        Usage: {preferences.usage or 'Daily driving'}
        
        Provide:
        1. Best value options in this budget
        2. What to expect at this price point
        3. Features to prioritize vs compromise on
        4. New vs used recommendations
        """
        
        analysis = await ai_service.generate_chat_response(
            "Provide detailed budget analysis for car shopping",
            budget_context
        )
        
        return {
            "budget_range": preferences.budget,
            "analysis": analysis,
            "recommendations": await ai_service.get_car_recommendations(
                preferences.dict(exclude_none=True)
            )
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in budget analysis: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to analyze budget options")

@router.post("/compare")
async def compare_cars(
    car_list: List[str],
    ai_service: AIService = Depends(get_ai_service)
):
    """
    Compare multiple cars and provide detailed analysis
    """
    try:
        if len(car_list) < 2:
            raise HTTPException(status_code=400, detail="At least 2 cars required for comparison")
        
        comparison_prompt = f"""
        Compare these cars: {', '.join(car_list)}
        
        Provide detailed comparison including:
        1. Performance and reliability
        2. Fuel economy
        3. Safety ratings
        4. Cost of ownership
        5. Resale value
        6. Pros and cons of each
        7. Which is best for different use cases
        """
        
        comparison = await ai_service.generate_chat_response(
            "Provide detailed car comparison",
            comparison_prompt
        )
        
        return {
            "cars_compared": car_list,
            "comparison": comparison,
            "recommendation": "Based on the analysis above"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error comparing cars: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to compare cars")