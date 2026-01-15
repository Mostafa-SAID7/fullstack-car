from fastapi import APIRouter, Depends, HTTPException
from typing import Any
from app.models.schemas import ChatRequest, ChatResponse, AgentType
from app.core.database import get_db
from sqlalchemy.orm import Session
from starlette.requests import Request
import uuid
import logging

logger = logging.getLogger(__name__)
router = APIRouter()

@router.post("/", response_model=ChatResponse)
async def chat(chat_request: ChatRequest, request: Request, db: Session = Depends(get_db)):
    """
    Enhanced chat endpoint with agent routing and conversation management.
    
    Supports:
    - Automatic intent detection and agent routing
    - Explicit agent mode selection
    - Conversation persistence
    - Message history context
    """
    try:
        # Initialize services if not already done
        from main import get_services
        get_services()
        
        # Get services from app state
        agent_router = request.app.state.agent_router
        conversation_manager = request.app.state.conversation_manager
        
        # Get or create conversation
        conversation_id = chat_request.conversation_id
        if not conversation_id:
            # Create new conversation
            user_id = chat_request.user_id or "anonymous"
            conversation = await conversation_manager.create_conversation(
                user_id=user_id,
                title=chat_request.message[:50] + "..." if len(chat_request.message) > 50 else chat_request.message
            )
            conversation_id = conversation.id
        
        # Add user message to conversation
        await conversation_manager.add_message(
            conversation_id=conversation_id,
            role="user",
            content=chat_request.message,
            agent_type=None
        )
        
        # Get conversation context
        context = await conversation_manager.get_context(conversation_id)
        
        # Route message to appropriate agent
        agent_response = await agent_router.route_message(
            message=chat_request.message,
            context=context,
            explicit_mode=chat_request.mode
        )
        
        # Add assistant message to conversation
        message_id = str(uuid.uuid4())
        
        # Get agent type safely from metadata or default to GENERAL
        agent_type_str = agent_response.metadata.get('agent_type', 'general')
        try:
            agent_type_enum = AgentType(agent_type_str)
        except ValueError:
            agent_type_enum = AgentType.GENERAL
            
        await conversation_manager.add_message(
            conversation_id=conversation_id,
            role="assistant",
            content=agent_response.text,
            agent_type=agent_type_enum,
            metadata=agent_response.metadata
        )
        
        # Return response
        return ChatResponse(
            message=agent_response.text,
            message_id=message_id,
            conversation_id=conversation_id,
            agent=agent_response.agent,
            metadata=agent_response.metadata,
            quick_actions=agent_response.quick_actions
        )
        
    except Exception as e:
        logger.error(f"Error in chat endpoint: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Chat processing failed: {str(e)}")