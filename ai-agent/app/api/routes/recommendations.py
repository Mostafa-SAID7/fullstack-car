from fastapi import APIRouter, Depends, HTTPException
from typing import List
from app.models.schemas import RecommendationRequestDTO, RecommendationResponseDTO
from app.core.ai_service import AIService
from starlette.requests import Request

router = APIRouter()

@router.post("/", response_model=RecommendationResponseDTO)
async def get_recommendations(requestDTO: RecommendationRequestDTO, request: Request):
    ai_service: AIService = request.app.state.ai_service
    try:
        recommendations = await ai_service.get_car_recommendations(requestDTO.dict())
        return RecommendationResponseDTO(
            recommendations=recommendations,
            total_count=len(recommendations)
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))