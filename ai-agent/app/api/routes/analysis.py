from fastapi import APIRouter, Depends, HTTPException
from app.models.schemas import MarketAnalysisRequestDTO, MarketAnalysisResponseDTO
from app.core.ai_service import AIService
from starlette.requests import Request

router = APIRouter()

@router.post("/market", response_model=MarketAnalysisResponseDTO)
async def analyze_market(requestDTO: MarketAnalysisRequestDTO, request: Request):
    ai_service: AIService = request.app.state.ai_service
    try:
        analysis = await ai_service.analyze_car_market(requestDTO.car_query)
        return MarketAnalysisResponseDTO(**analysis)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))