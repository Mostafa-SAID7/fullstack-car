import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
    ChatRequest, ChatResponse,
    RecommendationRequest, RecommendationResponse,
    MaintenanceRequest, MaintenanceResponse,
    MarketAnalysisRequest, MarketAnalysisResponse
} from '../models/ai-agent.models';

@Injectable({
    providedIn: 'root'
})
export class AIAgentService {
    private apiUrl = `${environment.apiUrl}/v5.0/ai-agent`;

    constructor(private http: HttpClient) { }

    chat(request: ChatRequest): Observable<ChatResponse> {
        return this.http.post<ChatResponse>(`${this.apiUrl}/chat`, request);
    }

    getRecommendations(request: RecommendationRequest): Observable<RecommendationResponse> {
        return this.http.post<RecommendationResponse>(`${this.apiUrl}/recommendations`, request);
    }

    getMaintenanceAdvice(request: MaintenanceRequest): Observable<MaintenanceResponse> {
        return this.http.post<MaintenanceResponse>(`${this.apiUrl}/maintenance/advice`, request);
    }

    analyzeMarket(request: MarketAnalysisRequest): Observable<MarketAnalysisResponse> {
        return this.http.post<MarketAnalysisResponse>(`${this.apiUrl}/analysis/market`, request);
    }
}
