from fastapi import APIRouter, Depends, HTTPException, Request
from app.models.schemas import CarInfo, MaintenanceAdvice
from app.core.ai_service import AIService
import logging

logger = logging.getLogger(__name__)
router = APIRouter()

def get_ai_service(request: Request) -> AIService:
    return request.app.state.ai_service

@router.post("/advice", response_model=MaintenanceAdvice)
async def get_maintenance_advice(
    car_info: CarInfo,
    ai_service: AIService = Depends(get_ai_service)
):
    """
    Get personalized maintenance advice for a specific car
    """
    try:
        advice = await ai_service.get_maintenance_advice(
            car_info.dict(exclude_none=True)
        )
        
        return advice
        
    except Exception as e:
        logger.error(f"Error getting maintenance advice: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to generate maintenance advice")

@router.post("/schedule")
async def create_maintenance_schedule(
    car_info: CarInfo,
    ai_service: AIService = Depends(get_ai_service)
):
    """
    Create a comprehensive maintenance schedule for a car
    """
    try:
        schedule_prompt = f"""
        Create a maintenance schedule for:
        {car_info.make} {car_info.model} {car_info.year}
        Current mileage: {car_info.mileage or 'Unknown'}
        
        Provide:
        1. Immediate maintenance needs (next 1-3 months)
        2. Short-term schedule (3-12 months)
        3. Long-term maintenance plan (1-3 years)
        4. Seasonal maintenance reminders
        5. Cost estimates for each service
        """
        
        schedule = await ai_service.generate_chat_response(
            "Create comprehensive maintenance schedule",
            schedule_prompt
        )
        
        return {
            "car": f"{car_info.make} {car_info.model} {car_info.year}",
            "current_mileage": car_info.mileage,
            "schedule": schedule,
            "next_service_priority": "Oil change and inspection"
        }
        
    except Exception as e:
        logger.error(f"Error creating maintenance schedule: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to create maintenance schedule")

@router.post("/cost-estimate")
async def estimate_maintenance_costs(
    car_info: CarInfo,
    service_type: str,
    ai_service: AIService = Depends(get_ai_service)
):
    """
    Estimate costs for specific maintenance services
    """
    try:
        cost_prompt = f"""
        Estimate maintenance costs for:
        Car: {car_info.make} {car_info.model} {car_info.year}
        Service: {service_type}
        Mileage: {car_info.mileage or 'Unknown'}
        
        Provide:
        1. Typical cost range
        2. Factors affecting cost
        3. DIY vs professional service
        4. Regional cost variations
        5. Tips to save money
        """
        
        cost_analysis = await ai_service.generate_chat_response(
            "Provide maintenance cost estimate",
            cost_prompt
        )
        
        return {
            "service": service_type,
            "car": f"{car_info.make} {car_info.model} {car_info.year}",
            "cost_analysis": cost_analysis,
            "estimated_range": "$50 - $200"  # This would be dynamically calculated
        }
        
    except Exception as e:
        logger.error(f"Error estimating maintenance costs: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to estimate costs")

@router.post("/troubleshoot")
async def troubleshoot_issue(
    car_info: CarInfo,
    issue_description: str,
    ai_service: AIService = Depends(get_ai_service)
):
    """
    Help troubleshoot car issues and provide guidance
    """
    try:
        troubleshoot_prompt = f"""
        Troubleshoot car issue:
        Car: {car_info.make} {car_info.model} {car_info.year}
        Issue: {issue_description}
        Mileage: {car_info.mileage or 'Unknown'}
        
        Provide:
        1. Possible causes
        2. Diagnostic steps
        3. Urgency level (immediate, soon, routine)
        4. Estimated repair costs
        5. Whether it's safe to drive
        6. DIY vs professional repair recommendation
        """
        
        troubleshooting = await ai_service.generate_chat_response(
            "Help troubleshoot car issue",
            troubleshoot_prompt
        )
        
        return {
            "issue": issue_description,
            "car": f"{car_info.make} {car_info.model} {car_info.year}",
            "troubleshooting": troubleshooting,
            "urgency": "medium",  # This would be determined by AI analysis
            "safe_to_drive": True  # This would be determined by AI analysis
        }
        
    except Exception as e:
        logger.error(f"Error troubleshooting issue: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to troubleshoot issue")