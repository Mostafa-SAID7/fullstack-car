export interface ChatRequest {
    message: string;
    context?: string;
    userId?: string;
}

export interface ChatResponse {
    message: string;
    conversationId?: string;
    timestamp: Date;
}

export interface RecommendationRequest {
    budget?: string;
    carType?: string;
    fuelType?: string;
    usage?: string;
    features?: string[];
}

export interface CarRecommendation {
    make: string;
    model: string;
    year: number;
    priceRange?: string;
    reason?: string;
    confidenceScore: number;
}

export interface RecommendationResponse {
    recommendations: CarRecommendation[];
    totalCount: number;
}

export interface MaintenanceRequest {
    make: string;
    model: string;
    year: number;
    mileage?: number;
    lastService?: string;
    serviceHistory?: string[];
}

export interface MaintenanceResponse {
    priorityItems: string[];
    upcomingServices: string[];
    estimatedCosts: { [key: string]: string };
    recommendations: string;
    nextServiceDate?: string;
}

export interface MarketAnalysisRequest {
    carQuery: string;
    location?: string;
    timeFrame?: string;
}

export interface MarketAnalysisResponse {
    analysis: string;
    marketTrend: string;
    priceTrend: string;
    recommendation: string;
    confidence: number;
}
