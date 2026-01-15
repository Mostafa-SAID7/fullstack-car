from fastapi import APIRouter, Depends, HTTPException, Query
from typing import List
from app.models.schemas import (
    Conversation,
    ConversationListResponse,
    CreateConversationRequest
)
from app.core.database import get_db
from sqlalchemy.orm import Session
from starlette.requests import Request
import logging

logger = logging.getLogger(__name__)
router = APIRouter()

@router.get("/", response_model=ConversationListResponse)
async def list_conversations(
    request: Request,
    user_id: str = Query(..., description="User ID to filter conversations"),
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(20, ge=1, le=100, description="Items per page"),
    db: Session = Depends(get_db)
):
    """
    List user's conversations with pagination.
    
    Returns conversations ordered by most recent first.
    """
    try:
        conversation_manager: ConversationManager = request.app.state.conversation_manager
        
        # Get conversations for user
        conversations = await conversation_manager.list_conversations(
            user_id=user_id,
            page=page,
            page_size=page_size
        )
        
        # Get total count
        total = await conversation_manager.count_conversations(user_id=user_id)
        
        return ConversationListResponse(
            conversations=conversations,
            total=total,
            page=page,
            page_size=page_size
        )
        
    except Exception as e:
        logger.error(f"Error listing conversations: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Failed to list conversations: {str(e)}")

@router.get("/{conversation_id}", response_model=Conversation)
async def get_conversation(
    conversation_id: str,
    request: Request,
    db: Session = Depends(get_db)
):
    """
    Get a specific conversation with full message history.
    """
    try:
        conversation_manager: ConversationManager = request.app.state.conversation_manager
        
        conversation = await conversation_manager.get_conversation(conversation_id)
        
        if not conversation:
            raise HTTPException(status_code=404, detail="Conversation not found")
        
        return conversation
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting conversation: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Failed to get conversation: {str(e)}")

@router.post("/", response_model=Conversation)
async def create_conversation(
    create_request: CreateConversationRequest,
    request: Request,
    db: Session = Depends(get_db)
):
    """
    Create a new conversation.
    """
    try:
        conversation_manager: ConversationManager = request.app.state.conversation_manager
        
        conversation = await conversation_manager.create_conversation(
            user_id=create_request.user_id,
            title=create_request.title or "New Conversation"
        )
        
        return conversation
        
    except Exception as e:
        logger.error(f"Error creating conversation: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Failed to create conversation: {str(e)}")

@router.delete("/{conversation_id}")
async def delete_conversation(
    conversation_id: str,
    request: Request,
    db: Session = Depends(get_db)
):
    """
    Delete a conversation and all its messages.
    """
    try:
        conversation_manager: ConversationManager = request.app.state.conversation_manager
        
        success = await conversation_manager.delete_conversation(conversation_id)
        
        if not success:
            raise HTTPException(status_code=404, detail="Conversation not found")
        
        return {"message": "Conversation deleted successfully", "conversation_id": conversation_id}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting conversation: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Failed to delete conversation: {str(e)}")

@router.post("/{conversation_id}/archive")
async def archive_conversation(
    conversation_id: str,
    request: Request,
    db: Session = Depends(get_db)
):
    """
    Archive a conversation (soft delete - sets is_active to False).
    """
    try:
        conversation_manager: ConversationManager = request.app.state.conversation_manager
        
        success = await conversation_manager.archive_conversation(conversation_id)
        
        if not success:
            raise HTTPException(status_code=404, detail="Conversation not found")
        
        return {"message": "Conversation archived successfully", "conversation_id": conversation_id}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error archiving conversation: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Failed to archive conversation: {str(e)}")

@router.get("/{conversation_id}/messages")
async def get_conversation_messages(
    conversation_id: str,
    request: Request,
    limit: int = Query(50, ge=1, le=200, description="Maximum number of messages"),
    offset: int = Query(0, ge=0, description="Number of messages to skip"),
    db: Session = Depends(get_db)
):
    """
    Get messages from a conversation with pagination.
    """
    try:
        conversation_manager: ConversationManager = request.app.state.conversation_manager
        
        messages = await conversation_manager.get_messages(
            conversation_id=conversation_id,
            limit=limit,
            offset=offset
        )
        
        return {
            "conversation_id": conversation_id,
            "messages": messages,
            "count": len(messages),
            "limit": limit,
            "offset": offset
        }
        
    except Exception as e:
        logger.error(f"Error getting messages: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Failed to get messages: {str(e)}")
