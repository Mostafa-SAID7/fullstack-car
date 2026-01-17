// Agent Types
export enum AgentType {
    GENERAL = 'general',
    MECHANIC = 'mechanic',
    BUYER_GUIDE = 'buyer_guide',
    SELLER_ASSISTANT = 'seller_assistant',
    MODIFICATION_EXPERT = 'modification_expert',
    COMMUNITY_HELPER = 'community_helper'
}

// Chat Models
export interface ChatRequest {
    message: string;
    conversationId?: string;
    userId?: string;
    mode?: AgentType;
    context?: Record<string, any>;
}

export interface ChatResponse {
    message: string;
    messageId: string;
    conversationId: string;
    agent: string;
    metadata?: Record<string, any>;
    timestamp: string;
}

export interface Message {
    id: string;
    conversationId: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    agentType?: AgentType;
    metadata?: Record<string, any>;
    timestamp: Date;
}

// Conversation Models
export interface Conversation {
    id: string;
    userId: string;
    title: string;
    messages: Message[];
    createdAt: Date;
    updatedAt: Date;
    metadata?: Record<string, any>;
    isActive: boolean;
}

export interface ConversationListRequest {
    userId: string;
    page?: number;
    limit?: number;
    isActive?: boolean;
}

export interface ConversationListResponse {
    conversations: Conversation[];
    total: number;
    page: number;
    limit: number;
}

export interface CreateConversationRequest {
    userId: string;
    title?: string;
    metadata?: Record<string, any>;
}

// Feedback Models
export enum FeedbackType {
    POSITIVE = 'positive',
    NEGATIVE = 'negative',
    CORRECTION = 'correction'
}

export interface SubmitFeedbackRequest {
    conversationId: string;
    messageId: string;
    type: FeedbackType;
    data?: {
        rating?: number;
        comment?: string;
        correction?: string;
        query?: string;
    };
}

export interface FeedbackResponse {
    id: string;
    success: boolean;
    message: string;
}

// Recommendation Models
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

// Maintenance Models
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

// Market Analysis Models
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

// Offline Queue Models
export interface QueuedMessage {
    id: string;
    request: ChatRequest;
    timestamp: Date;
    retryCount: number;
}

// Error Models
export interface AIAgentError {
    code: string;
    message: string;
    details?: any;
    timestamp: Date;
}
