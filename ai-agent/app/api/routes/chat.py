from fastapi import APIRouter, Depends, HTTPException
from typing import Any
from app.models.schemas import ChatRequestDTO, ChatResponseDTO
from app.core.ai_service import AIService
from starlette.requests import Request

router = APIRouter()

@router.post("/", response_model=ChatResponseDTO)
async def chat(requestDTO: ChatRequestDTO, request: Request):
    ai_service: AIService = request.app.state.ai_service
    try:
        response_text = await ai_service.generate_chat_response(
            requestDTO.message, 
            requestDTO.context
        )
        return ChatResponseDTO(
            message=response_text,
            conversation_id=None # To be implemented with DB
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))