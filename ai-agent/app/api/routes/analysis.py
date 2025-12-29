from fastapi import APIRouter, Depends, HTTPException, Request
from app.models.schemas import MarketAnalysisRequest, MarketAnalysis, PriceAnalysisRequest, PriceAnalysis
from app.core.ai_service import AIService
import logging

logger = logging.getLogger(__name__)
router = APIRouter()

def get_ai_service(request: Request) -> AIService:
    return request.app.state.ai_service

@router.post("/market", response_model=MarketAnalysis)
async def analyze_market(
    request: MarketAnalysisRequest,
    ai_service: AIService = Depends(get_ai_service)
):
    """
    Analyze car market trends and provide insights
    """
    try:
        analysis = await ai_service.analyze_car_market(request.car_query)
        
        return MarketAnalysis(
            analysis=analysis["analysis"],
            market_trend=analysis["market_trend"],
            price_trend=analysis["price_trend"],
            recommendation=analysis["recommendation"],
            confidence=analysis["confidence"],
            data_sources=["Market data", "Historical trends", "Expert analysis"]
        )
        
    except Exception as e:
        logger.error(f"Error analyzing market: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to analyze market")

@router.post("/price", response_model=PriceAnalysis)
async def analyze_price(
    request: PriceAnalysisRequest,
    ai_service: AIService = Depends(get_ai_service)
):
    """
    Analyze car pricing and provide valuation insights
    """
    try:
        price_prompt = f"""
        Analyze pricing for:
        {request.make} {request.model} {request.year}
        Mileage: {request.mileage or 'Unknown'}
        Condition: {request.condition or 'Good'}
        Location: {request.location or 'National average'}
        
        Provide:
        1. Current market value estimate
        2. Price range (low to high)
        3. Factors affecting value
        4. Comparison with similar vehicles
        5. Best selling strategy
        """
        
        price_analysis = await ai_service.generate_chat_response(
            "Provide detailed price analysis",
            price_prompt
        )
        
        return PriceAnalysis(
            estimated_value=f"${25000} - ${30000}",  # This would be calculated
            market_range=f"${22000} - ${35000}",
            factors=["Mileage", "Condition", "Market demand", "Location"],
            comparison=price_analysis,
            recommendation="Price competitively at $27,500 for quick sale"
        )
        
    except Exception as e:
        logger.error(f"Error analyzing price: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to analyze price")

@router.post("/investment")
async def analyze_investment_potential(
    car_query: str,
    ai_service: AIService = Depends(get_ai_service)
):
    """
    Analyze a car's potential as an investment
    """
    try:
        investment_prompt = f"""
        Analyze investment potential for: {car_query}
        
        Consider:
        1. Historical appreciation trends
        2. Rarity and collectibility
        3. Market demand factors
        4. Maintenance and storage costs
        5. Liquidity (ease of selling)
        6. 5-year outlook
        7. Risk factors
        """
        
        investment_analysis = await ai_service.generate_chat_response(
            "Analyze car investment potential",
            investment_prompt
        )
        
        return {
            "car": car_query,
            "investment_analysis": investment_analysis,
            "investment_grade": "B+",  # This would be calculated
            "risk_level": "Medium",
            "time_horizon": "5-10 years recommended",
            "key_factors": ["Rarity", "Brand reputation", "Historical significance"]
        }
        
    except Exception as e:
        logger.error(f"Error analyzing investment potential: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to analyze investment potential")

@router.post("/depreciation")
async def analyze_depreciation(
    request: PriceAnalysisRequest,
    ai_service: AIService = Depends(get_ai_service)
):
    """
    Analyze car depreciation trends and future value
    """
    try:
        depreciation_prompt = f"""
        Analyze depreciation for:
        {request.make} {request.model} {request.year}
        Current mileage: {request.mileage or 'Unknown'}
        
        Provide:
        1. Historical depreciation curve
        2. Current depreciation rate
        3. Future value projections (1, 3, 5 years)
        4. Factors affecting depreciation
        5. Comparison with similar models
        6. Best time to sell to minimize loss
        """
        
        depreciation_analysis = await ai_service.generate_chat_response(
            "Analyze car depreciation trends",
            depreciation_prompt
        )
        
        return {
            "car": f"{request.make} {request.model} {request.year}",
            "current_value": "$25,000",  # This would be calculated
            "depreciation_analysis": depreciation_analysis,
            "annual_depreciation_rate": "15%",
            "projected_values": {
                "1_year": "$21,250",
                "3_years": "$15,300",
                "5_years": "$11,050"
            },
            "optimal_sell_time": "Within 2 years for best value retention"
        }
        
    except Exception as e:
        logger.error(f"Error analyzing depreciation: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to analyze depreciation")