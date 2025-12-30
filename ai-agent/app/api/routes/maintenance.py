from fastapi import APIRouter, Depends, HTTPException
from app.models.schemas import MaintenanceRequestDTO, MaintenanceResponseDTO
from app.core.ai_service import AIService
from starlette.requests import Request

router = APIRouter()

@router.post("/advice", response_model=MaintenanceResponseDTO)
async def get_maintenance_advice(requestDTO: MaintenanceRequestDTO, request: Request):
    ai_service: AIService = request.app.state.ai_service
    try:
        advice = await ai_service.get_maintenance_advice(requestDTO.dict())
        return advice
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))