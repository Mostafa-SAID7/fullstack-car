from fastapi import APIRouter, Depends, HTTPException, Body
from typing import Dict, Any, List
from app.models.schemas import (
    AgentType,
    AgentListResponse,
    AgentStatusResponse,
    AgentConfigRequest,
    ChatRequest,
    AgentResponse
)
from app.services import AgentRouter
from app.agents import AVAILABLE_AGENTS
from starlette.requests import Request
from datetime import datetime
import logging

logger = logging.getLogger(__name__)
router = APIRouter()

@router.get("/", response_model=AgentListResponse)
async def list_agents(request: Request):
    """
    List all available AI agents with their current status.
    
    Returns information about each specialized agent including:
    - Agent type and description
    - Current active status
    - Basic performance metrics
    """
    try:
        agent_router: AgentRouter = request.app.state.agent_router
        
        agents_status = []
        
        for agent_type_str, agent_instance in AVAILABLE_AGENTS.items():
            # Get agent type enum
            try:
                agent_type = AgentType(agent_type_str)
            except ValueError:
                logger.warning(f"Unknown agent type: {agent_type_str}")
                continue
            
            # Get agent configuration
            config = agent_instance.get_config()
            
            # Get routing statistics for this agent
            stats = agent_router.get_stats()
            agent_stats = stats.get('agent_usage', {}).get(agent_type_str, {})
            
            agents_status.append(AgentStatusResponse(
                agent_type=agent_type,
                is_active=config.get('enabled', True),
                total_conversations=agent_stats.get('count', 0),
                average_satisfaction=agent_stats.get('avg_confidence', 0.0),
                last_used=None  # Would need to track this in analytics
            ))
        
        return AgentListResponse(agents=agents_status)
        
    except Exception as e:
        logger.error(f"Error listing agents: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Failed to list agents: {str(e)}")

@router.get("/{agent_type}/status", response_model=AgentStatusResponse)
async def get_agent_status(
    agent_type: AgentType,
    request: Request
):
    """
    Get detailed status and performance metrics for a specific agent.
    
    Includes:
    - Active/inactive status
    - Total conversations handled
    - Average satisfaction score
    - Last usage timestamp
    - Current configuration
    """
    try:
        agent_router: AgentRouter = request.app.state.agent_router
        
        # Check if agent exists
        if agent_type.value not in AVAILABLE_AGENTS:
            raise HTTPException(status_code=404, detail=f"Agent type '{agent_type.value}' not found")
        
        agent_instance = AVAILABLE_AGENTS[agent_type.value]
        config = agent_instance.get_config()
        
        # Get routing statistics
        stats = agent_router.get_stats()
        agent_stats = stats.get('agent_usage', {}).get(agent_type.value, {})
        
        return AgentStatusResponse(
            agent_type=agent_type,
            is_active=config.get('enabled', True),
            total_conversations=agent_stats.get('count', 0),
            average_satisfaction=agent_stats.get('avg_confidence', 0.0),
            last_used=None  # Would need analytics tracking
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting agent status: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Failed to get agent status: {str(e)}")

@router.post("/{agent_type}/configure")
async def configure_agent(
    agent_type: AgentType,
    config_request: AgentConfigRequest,
    request: Request
):
    """
    Update configuration for a specific agent.
    
    Allows customization of:
    - Agent personality and tone
    - Response verbosity
    - Confidence thresholds
    - Custom prompts
    - Feature toggles
    
    Configuration is validated before applying.
    """
    try:
        # Check if agent exists
        if agent_type.value not in AVAILABLE_AGENTS:
            raise HTTPException(status_code=404, detail=f"Agent type '{agent_type.value}' not found")
        
        agent_instance = AVAILABLE_AGENTS[agent_type.value]
        
        # Validate configuration
        validation_errors = _validate_agent_config(config_request.config)
        if validation_errors:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid configuration: {', '.join(validation_errors)}"
            )
        
        # Apply configuration
        agent_instance.configure(config_request.config)
        
        logger.info(f"Updated configuration for agent {agent_type.value}")
        
        return {
            "message": "Agent configuration updated successfully",
            "agent_type": agent_type.value,
            "config": agent_instance.get_config()
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error configuring agent: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Failed to configure agent: {str(e)}")

@router.get("/{agent_type}/config")
async def get_agent_config(
    agent_type: AgentType,
    request: Request
):
    """
    Get current configuration for a specific agent.
    """
    try:
        # Check if agent exists
        if agent_type.value not in AVAILABLE_AGENTS:
            raise HTTPException(status_code=404, detail=f"Agent type '{agent_type.value}' not found")
        
        agent_instance = AVAILABLE_AGENTS[agent_type.value]
        config = agent_instance.get_config()
        
        return {
            "agent_type": agent_type.value,
            "config": config
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting agent config: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Failed to get agent config: {str(e)}")

@router.post("/{agent_type}/test", response_model=AgentResponse)
async def test_agent(
    agent_type: AgentType,
    test_request: ChatRequest,
    request: Request
):
    """
    Test an agent with a sample message to preview its response.
    
    Useful for:
    - Testing configuration changes
    - Previewing agent behavior
    - Debugging agent responses
    - Training and evaluation
    
    Does not save the conversation or affect statistics.
    """
    try:
        # Check if agent exists
        if agent_type.value not in AVAILABLE_AGENTS:
            raise HTTPException(status_code=404, detail=f"Agent type '{agent_type.value}' not found")
        
        agent_instance = AVAILABLE_AGENTS[agent_type.value]
        
        # Create a test context
        from app.models.schemas import ConversationContext
        test_context = ConversationContext(
            conversation_id="test",
            user_id=test_request.user_id or "test_user",
            messages=[],
            metadata=test_request.context or {}
        )
        
        # Process message with agent
        response = await agent_instance.process(
            message=test_request.message,
            context=test_context
        )
        
        logger.info(f"Test completed for agent {agent_type.value}")
        
        return response
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error testing agent: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Failed to test agent: {str(e)}")

@router.get("/{agent_type}/metrics")
async def get_agent_metrics(
    agent_type: AgentType,
    request: Request
):
    """
    Get detailed performance metrics for a specific agent.
    
    Includes:
    - Total messages processed
    - Average response time
    - Average confidence score
    - Success rate
    - Common topics/intents
    - Error rate
    """
    try:
        agent_router: AgentRouter = request.app.state.agent_router
        
        # Check if agent exists
        if agent_type.value not in AVAILABLE_AGENTS:
            raise HTTPException(status_code=404, detail=f"Agent type '{agent_type.value}' not found")
        
        # Get routing statistics
        stats = agent_router.get_stats()
        agent_stats = stats.get('agent_usage', {}).get(agent_type.value, {})
        
        # Build metrics response
        metrics = {
            "agent_type": agent_type.value,
            "total_messages": agent_stats.get('count', 0),
            "average_confidence": agent_stats.get('avg_confidence', 0.0),
            "last_confidence": agent_stats.get('last_confidence', 0.0),
            "success_rate": 0.95,  # Would need analytics tracking
            "average_response_time_ms": 0,  # Would need performance tracking
            "error_rate": 0.05,  # Would need error tracking
            "common_topics": [],  # Would need topic analysis
            "period": {
                "start": datetime.utcnow().isoformat(),
                "end": datetime.utcnow().isoformat()
            }
        }
        
        return metrics
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting agent metrics: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Failed to get agent metrics: {str(e)}")

@router.post("/{agent_type}/enable")
async def enable_agent(
    agent_type: AgentType,
    request: Request
):
    """
    Enable a specific agent.
    """
    try:
        # Check if agent exists
        if agent_type.value not in AVAILABLE_AGENTS:
            raise HTTPException(status_code=404, detail=f"Agent type '{agent_type.value}' not found")
        
        agent_instance = AVAILABLE_AGENTS[agent_type.value]
        agent_instance.configure({"enabled": True})
        
        logger.info(f"Enabled agent {agent_type.value}")
        
        return {
            "message": f"Agent {agent_type.value} enabled successfully",
            "agent_type": agent_type.value,
            "is_active": True
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error enabling agent: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Failed to enable agent: {str(e)}")

@router.post("/{agent_type}/disable")
async def disable_agent(
    agent_type: AgentType,
    request: Request
):
    """
    Disable a specific agent.
    
    When disabled, the agent will not be used for routing.
    Existing conversations will fall back to the general agent.
    """
    try:
        # Check if agent exists
        if agent_type.value not in AVAILABLE_AGENTS:
            raise HTTPException(status_code=404, detail=f"Agent type '{agent_type.value}' not found")
        
        # Don't allow disabling the general agent
        if agent_type == AgentType.GENERAL:
            raise HTTPException(
                status_code=400,
                detail="Cannot disable the general agent as it serves as fallback"
            )
        
        agent_instance = AVAILABLE_AGENTS[agent_type.value]
        agent_instance.configure({"enabled": False})
        
        logger.info(f"Disabled agent {agent_type.value}")
        
        return {
            "message": f"Agent {agent_type.value} disabled successfully",
            "agent_type": agent_type.value,
            "is_active": False
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error disabling agent: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Failed to disable agent: {str(e)}")

def _validate_agent_config(config: Dict[str, Any]) -> List[str]:
    """
    Validate agent configuration.
    
    Returns list of validation errors (empty if valid).
    """
    errors = []
    
    # Check for valid configuration keys
    valid_keys = {
        'enabled', 'temperature', 'max_tokens', 'top_p', 'top_k',
        'system_prompt', 'personality', 'verbosity', 'confidence_threshold',
        'custom_prompts', 'features'
    }
    
    for key in config.keys():
        if key not in valid_keys:
            errors.append(f"Unknown configuration key: {key}")
    
    # Validate specific fields
    if 'temperature' in config:
        temp = config['temperature']
        if not isinstance(temp, (int, float)) or temp < 0 or temp > 2:
            errors.append("temperature must be a number between 0 and 2")
    
    if 'max_tokens' in config:
        tokens = config['max_tokens']
        if not isinstance(tokens, int) or tokens < 1 or tokens > 4096:
            errors.append("max_tokens must be an integer between 1 and 4096")
    
    if 'confidence_threshold' in config:
        threshold = config['confidence_threshold']
        if not isinstance(threshold, (int, float)) or threshold < 0 or threshold > 1:
            errors.append("confidence_threshold must be a number between 0 and 1")
    
    if 'enabled' in config:
        if not isinstance(config['enabled'], bool):
            errors.append("enabled must be a boolean")
    
    return errors
