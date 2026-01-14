import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of, BehaviorSubject } from 'rxjs';
import { catchError, retry, tap, delay } from 'rxjs/operators';
import {
    ChatRequest, ChatResponse,
    RecommendationRequest, RecommendationResponse,
    MaintenanceRequest, MaintenanceResponse,
    MarketAnalysisRequest, MarketAnalysisResponse,
    Conversation, ConversationListRequest, ConversationListResponse,
    CreateConversationRequest, Message,
    SubmitFeedbackRequest, FeedbackResponse,
    QueuedMessage, AIAgentError, AgentType
} from '../models/ai-agent.models';

@Injectable({
    providedIn: 'root'
})
export class AIAgentService {
    private apiUrl = 'http://localhost:8000/api';
    private offlineQueue: QueuedMessage[] = [];
    private isOnline$ = new BehaviorSubject<boolean>(true);
    private readonly MAX_RETRY_COUNT = 3;
    private readonly RETRY_DELAY = 1000; // 1 second

    constructor(private http: HttpClient) {
        // Monitor online/offline status
        window.addEventListener('online', () => this.handleOnline());
        window.addEventListener('offline', () => this.handleOffline());
        
        // Load offline queue from localStorage
        this.loadOfflineQueue();
    }

    // ==================== Chat Methods ====================

    /**
     * Send a chat message to the AI agent
     * Supports retry logic and offline queueing
     */
    chat(request: ChatRequest): Observable<ChatResponse> {
        if (!this.isOnline$.value) {
            return this.queueMessage(request);
        }

        return this.http.post<ChatResponse>(`${this.apiUrl}/chat`, request).pipe(
            retry({
                count: this.MAX_RETRY_COUNT,
                delay: (error, retryCount) => {
                    console.log(`Retry attempt ${retryCount} for chat request`);
                    return of(error).pipe(delay(this.RETRY_DELAY * retryCount));
                }
            }),
            catchError((error) => this.handleError(error, request))
        );
    }

    /**
     * Send a chat message with specific agent mode
     */
    chatWithAgent(message: string, agentType: AgentType, conversationId?: string, context?: Record<string, any>): Observable<ChatResponse> {
        const request: ChatRequest = {
            message,
            mode: agentType,
            conversationId,
            context
        };
        return this.chat(request);
    }

    // ==================== Conversation Management ====================

    /**
     * Create a new conversation
     */
    createConversation(request: CreateConversationRequest): Observable<Conversation> {
        return this.http.post<Conversation>(`${this.apiUrl}/conversations`, request).pipe(
            catchError((error) => this.handleGenericError(error))
        );
    }

    /**
     * Get a specific conversation by ID
     */
    getConversation(conversationId: string): Observable<Conversation> {
        return this.http.get<Conversation>(`${this.apiUrl}/conversations/${conversationId}`).pipe(
            catchError((error) => this.handleGenericError(error))
        );
    }

    /**
     * List conversations with pagination
     */
    listConversations(request: ConversationListRequest): Observable<ConversationListResponse> {
        const params: any = {
            page: request.page || 1,
            limit: request.limit || 20
        };

        if (request.isActive !== undefined) {
            params.is_active = request.isActive;
        }

        return this.http.get<ConversationListResponse>(`${this.apiUrl}/conversations`, { params }).pipe(
            catchError((error) => this.handleGenericError(error))
        );
    }

    /**
     * Update conversation title
     */
    updateConversation(conversationId: string, title: string): Observable<Conversation> {
        return this.http.put<Conversation>(`${this.apiUrl}/conversations/${conversationId}`, { title }).pipe(
            catchError((error) => this.handleGenericError(error))
        );
    }

    /**
     * Delete a conversation
     */
    deleteConversation(conversationId: string): Observable<{ success: boolean }> {
        return this.http.delete<{ success: boolean }>(`${this.apiUrl}/conversations/${conversationId}`).pipe(
            catchError((error) => this.handleGenericError(error))
        );
    }

    /**
     * Get conversation messages with pagination
     */
    getConversationMessages(conversationId: string, page: number = 1, limit: number = 50): Observable<{ messages: Message[], total: number }> {
        return this.http.get<{ messages: Message[], total: number }>(
            `${this.apiUrl}/conversations/${conversationId}/messages`,
            { params: { page: page.toString(), limit: limit.toString() } }
        ).pipe(
            catchError((error) => this.handleGenericError(error))
        );
    }

    /**
     * Search conversations by query
     */
    searchConversations(userId: string, query: string, page: number = 1, limit: number = 20): Observable<ConversationListResponse> {
        return this.http.get<ConversationListResponse>(`${this.apiUrl}/conversations/search`, {
            params: { 
                user_id: userId,
                q: query,
                page: page.toString(),
                limit: limit.toString()
            }
        }).pipe(
            catchError((error) => this.handleGenericError(error))
        );
    }

    // ==================== Feedback Methods ====================

    /**
     * Submit user feedback for a message
     */
    submitFeedback(request: SubmitFeedbackRequest): Observable<FeedbackResponse> {
        return this.http.post<FeedbackResponse>(`${this.apiUrl}/feedback`, request).pipe(
            tap(response => {
                if (response.success) {
                    console.log('Feedback submitted successfully:', response.message);
                }
            }),
            catchError((error) => this.handleGenericError(error))
        );
    }

    /**
     * Submit positive feedback (thumbs up)
     */
    submitPositiveFeedback(conversationId: string, messageId: string, rating?: number): Observable<FeedbackResponse> {
        return this.submitFeedback({
            conversationId,
            messageId,
            type: 'positive' as any,
            data: { rating }
        });
    }

    /**
     * Submit negative feedback (thumbs down)
     */
    submitNegativeFeedback(conversationId: string, messageId: string, comment?: string): Observable<FeedbackResponse> {
        return this.submitFeedback({
            conversationId,
            messageId,
            type: 'negative' as any,
            data: { comment }
        });
    }

    /**
     * Submit correction feedback
     */
    submitCorrection(conversationId: string, messageId: string, correction: string, query: string): Observable<FeedbackResponse> {
        return this.submitFeedback({
            conversationId,
            messageId,
            type: 'correction' as any,
            data: { correction, query }
        });
    }

    // ==================== Recommendation Methods ====================

    getRecommendations(request: RecommendationRequest): Observable<RecommendationResponse> {
        return this.http.post<RecommendationResponse>(`${this.apiUrl}/recommendations`, request).pipe(
            catchError((error) => this.handleGenericError(error))
        );
    }

    // ==================== Maintenance Methods ====================

    getMaintenanceAdvice(request: MaintenanceRequest): Observable<MaintenanceResponse> {
        return this.http.post<MaintenanceResponse>(`${this.apiUrl}/maintenance/advice`, request).pipe(
            catchError((error) => this.handleGenericError(error))
        );
    }

    // ==================== Market Analysis Methods ====================

    analyzeMarket(request: MarketAnalysisRequest): Observable<MarketAnalysisResponse> {
        return this.http.post<MarketAnalysisResponse>(`${this.apiUrl}/analysis/market`, request).pipe(
            catchError((error) => this.handleGenericError(error))
        );
    }

    // ==================== Offline Support ====================

    /**
     * Queue a message for later sending when offline
     */
    private queueMessage(request: ChatRequest): Observable<ChatResponse> {
        const queuedMessage: QueuedMessage = {
            id: this.generateId(),
            request,
            timestamp: new Date(),
            retryCount: 0
        };

        this.offlineQueue.push(queuedMessage);
        this.saveOfflineQueue();

        console.log('Message queued for offline sending:', queuedMessage.id);

        // Return a mock response indicating the message is queued
        return of({
            message: 'Your message has been queued and will be sent when you\'re back online.',
            messageId: queuedMessage.id,
            conversationId: request.conversationId || '',
            agent: 'system',
            metadata: { queued: true },
            timestamp: new Date()
        });
    }

    /**
     * Process offline queue when coming back online
     */
    private processOfflineQueue(): void {
        if (this.offlineQueue.length === 0) return;

        console.log(`Processing ${this.offlineQueue.length} queued messages`);

        const queue = [...this.offlineQueue];
        this.offlineQueue = [];
        this.saveOfflineQueue();

        for (const queuedMessage of queue) {
            this.chat(queuedMessage.request).subscribe({
                next: () => {
                    console.log('Queued message sent successfully:', queuedMessage.id);
                },
                error: (error) => {
                    console.error('Failed to send queued message:', queuedMessage.id, error);
                    
                    // Re-queue if retry count not exceeded
                    if (queuedMessage.retryCount < this.MAX_RETRY_COUNT) {
                        queuedMessage.retryCount++;
                        this.offlineQueue.push(queuedMessage);
                    }
                }
            });
        }

        this.saveOfflineQueue();
    }

    /**
     * Save offline queue to localStorage
     */
    private saveOfflineQueue(): void {
        try {
            localStorage.setItem('ai_agent_offline_queue', JSON.stringify(this.offlineQueue));
        } catch (error) {
            console.error('Failed to save offline queue:', error);
        }
    }

    /**
     * Load offline queue from localStorage
     */
    private loadOfflineQueue(): void {
        try {
            const stored = localStorage.getItem('ai_agent_offline_queue');
            if (stored) {
                this.offlineQueue = JSON.parse(stored);
                console.log(`Loaded ${this.offlineQueue.length} queued messages from storage`);
            }
        } catch (error) {
            console.error('Failed to load offline queue:', error);
            this.offlineQueue = [];
        }
    }

    /**
     * Handle online event
     */
    private handleOnline(): void {
        console.log('Connection restored - processing offline queue');
        this.isOnline$.next(true);
        this.processOfflineQueue();
    }

    /**
     * Handle offline event
     */
    private handleOffline(): void {
        console.log('Connection lost - entering offline mode');
        this.isOnline$.next(false);
    }

    /**
     * Get online status observable
     */
    getOnlineStatus(): Observable<boolean> {
        return this.isOnline$.asObservable();
    }

    /**
     * Get queued message count
     */
    getQueuedMessageCount(): number {
        return this.offlineQueue.length;
    }

    // ==================== Error Handling ====================

    /**
     * Handle HTTP errors with retry logic for chat requests
     */
    private handleError(error: HttpErrorResponse, originalRequest?: ChatRequest): Observable<never> {
        const aiError: AIAgentError = {
            code: error.status?.toString() || 'UNKNOWN',
            message: error.message || 'An unknown error occurred',
            details: error.error,
            timestamp: new Date()
        };

        console.error('AI Agent Service Error:', aiError);

        // If offline and it's a chat request, queue it
        if (!navigator.onLine && originalRequest) {
            return this.queueMessage(originalRequest) as any;
        }

        // Log error for analytics
        this.logError(aiError);

        return throwError(() => aiError);
    }

    /**
     * Handle HTTP errors for non-chat requests
     */
    private handleGenericError(error: HttpErrorResponse): Observable<never> {
        const aiError: AIAgentError = {
            code: error.status?.toString() || 'UNKNOWN',
            message: error.message || 'An unknown error occurred',
            details: error.error,
            timestamp: new Date()
        };

        console.error('AI Agent Service Error:', aiError);

        // Log error for analytics
        this.logError(aiError);

        return throwError(() => aiError);
    }

    /**
     * Log error for analytics
     */
    private logError(error: AIAgentError): void {
        // TODO: Send to analytics service
        console.log('Error logged for analytics:', error);
    }

    // ==================== Utility Methods ====================

    /**
     * Generate unique ID
     */
    private generateId(): string {
        return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
    }

    /**
     * Clear offline queue (for testing/debugging)
     */
    clearOfflineQueue(): void {
        this.offlineQueue = [];
        this.saveOfflineQueue();
        console.log('Offline queue cleared');
    }
}
