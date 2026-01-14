import { QASignalRConnectionService } from '../qa-signalr-connection.service';
import type { 
  ConnectionStatus, 
  ConnectionHealth, 
  ConnectionReliability, 
  ActiveConnection,
  ConnectionError 
} from '../qa-signalr-connection.service';

/**
 * QA SignalR Service extending existing HttpClient patterns
 * Provides real-time QA functionality for React Dashboard
 * Integrates with existing authentication hooks and context
 */
export class QASignalRService {
  private connectionService: QASignalRConnectionService;
  private eventListeners: Map<string, Set<(data: any) => void>> = new Map();
  private statusListeners: Set<(status: ConnectionStatus) => void> = new Set();
  private errorListeners: Set<(error: ConnectionError) => void> = new Set();

  // Connection state
  private isInitialized = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  constructor(getAuthToken: () => string | null) {
    this.connectionService = new QASignalRConnectionService(getAuthToken);
    this.setupEventHandlers();
  }

  // ============================================================================
  // CONNECTION MANAGEMENT (Following existing HttpClient patterns)
  // ============================================================================

  /**
   * Initialize the SignalR connection
   * Follows existing service initialization patterns
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    try {
      await this.connectionService.startConnection();
      this.isInitialized = true;
      this.reconnectAttempts = 0;
      console.log('[QASignalRService] Initialized successfully');
    } catch (error) {
      console.error('[QASignalRService] Initialization failed:', error);
      throw error;
    }
  }

  /**
   * Disconnect and cleanup
   * Follows existing service cleanup patterns
   */
  async disconnect(): Promise<void> {
    try {
      await this.connectionService.stopConnection();
      this.isInitialized = false;
      this.reconnectAttempts = 0;
      console.log('[QASignalRService] Disconnected successfully');
    } catch (error) {
      console.error('[QASignalRService] Disconnect failed:', error);
      throw error;
    }
  }

  /**
   * Force reconnection
   * Similar to HttpClient retry logic
   */
  async reconnect(): Promise<void> {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      throw new Error('Maximum reconnection attempts exceeded');
    }

    this.reconnectAttempts++;
    
    try {
      this.connectionService.forceReconnect();
      console.log(`[QASignalRService] Reconnection attempt ${this.reconnectAttempts}`);
    } catch (error) {
      console.error(`[QASignalRService] Reconnection attempt ${this.reconnectAttempts} failed:`, error);
      throw error;
    }
  }

  // ============================================================================
  // EVENT SUBSCRIPTION (Following existing event patterns)
  // ============================================================================

  /**
   * Subscribe to QA events
   * Returns unsubscribe function following React patterns
   */
  onNewAnswer(callback: (data: any) => void): () => void {
    return this.addEventListener('newAnswer', callback);
  }

  onVoteUpdate(callback: (data: any) => void): () => void {
    return this.addEventListener('voteUpdate', callback);
  }

  onQuestionUpdate(callback: (data: any) => void): () => void {
    return this.addEventListener('questionUpdate', callback);
  }

  onAnswerAccepted(callback: (data: any) => void): () => void {
    return this.addEventListener('answerAccepted', callback);
  }

  onReputationUpdate(callback: (data: any) => void): () => void {
    return this.addEventListener('reputationUpdate', callback);
  }

  onQuestionClosed(callback: (data: any) => void): () => void {
    return this.addEventListener('questionClosed', callback);
  }

  onExpertNotification(callback: (data: any) => void): () => void {
    return this.addEventListener('expertNotification', callback);
  }

  onTypingIndicator(callback: (data: any) => void): () => void {
    return this.addEventListener('typingIndicator', callback);
  }

  // ============================================================================
  // CONNECTION STATUS (Following existing state management patterns)
  // ============================================================================

  /**
   * Subscribe to connection status changes
   * Returns unsubscribe function following React patterns
   */
  onConnectionStatusChange(callback: (status: ConnectionStatus) => void): () => void {
    this.statusListeners.add(callback);
    
    // Immediately call with current status
    callback(this.connectionService.currentStatus);
    
    return () => {
      this.statusListeners.delete(callback);
    };
  }

  /**
   * Subscribe to connection errors
   * Returns unsubscribe function following React patterns
   */
  onConnectionError(callback: (error: ConnectionError) => void): () => void {
    this.errorListeners.add(callback);
    
    return () => {
      this.errorListeners.delete(callback);
    };
  }

  // ============================================================================
  // GROUP MANAGEMENT (Dashboard-specific features)
  // ============================================================================

  /**
   * Join moderators group for dashboard features
   */
  async joinModeratorsGroup(): Promise<void> {
    try {
      await this.connectionService.joinGroup('moderators');
      console.log('[QASignalRService] Joined moderators group');
    } catch (error) {
      console.error('[QASignalRService] Failed to join moderators group:', error);
      throw error;
    }
  }

  /**
   * Leave moderators group
   */
  async leaveModeratorsGroup(): Promise<void> {
    try {
      await this.connectionService.leaveGroup('moderators');
      console.log('[QASignalRService] Left moderators group');
    } catch (error) {
      console.error('[QASignalRService] Failed to leave moderators group:', error);
      throw error;
    }
  }

  /**
   * Join experts group for expert notifications
   */
  async joinExpertsGroup(): Promise<void> {
    try {
      await this.connectionService.joinGroup('experts');
      console.log('[QASignalRService] Joined experts group');
    } catch (error) {
      console.error('[QASignalRService] Failed to join experts group:', error);
      throw error;
    }
  }

  /**
   * Leave experts group
   */
  async leaveExpertsGroup(): Promise<void> {
    try {
      await this.connectionService.leaveGroup('experts');
      console.log('[QASignalRService] Left experts group');
    } catch (error) {
      console.error('[QASignalRService] Failed to leave experts group:', error);
      throw error;
    }
  }

  /**
   * Join category-specific group for notifications
   */
  async joinCategoryGroup(category: string): Promise<void> {
    try {
      await this.connectionService.joinGroup(`category_${category}`);
      console.log(`[QASignalRService] Joined category group: ${category}`);
    } catch (error) {
      console.error(`[QASignalRService] Failed to join category group ${category}:`, error);
      throw error;
    }
  }

  /**
   * Leave category-specific group
   */
  async leaveCategoryGroup(category: string): Promise<void> {
    try {
      await this.connectionService.leaveGroup(`category_${category}`);
      console.log(`[QASignalRService] Left category group: ${category}`);
    } catch (error) {
      console.error(`[QASignalRService] Failed to leave category group ${category}:`, error);
      throw error;
    }
  }

  /**
   * Join question-specific group for real-time updates
   */
  async joinQuestionGroup(questionId: string): Promise<void> {
    try {
      await this.connectionService.joinGroup(`question_${questionId}`);
      console.log(`[QASignalRService] Joined question group: ${questionId}`);
    } catch (error) {
      console.error(`[QASignalRService] Failed to join question group ${questionId}:`, error);
      throw error;
    }
  }

  /**
   * Leave question-specific group
   */
  async leaveQuestionGroup(questionId: string): Promise<void> {
    try {
      await this.connectionService.leaveGroup(`question_${questionId}`);
      console.log(`[QASignalRService] Left question group: ${questionId}`);
    } catch (error) {
      console.error(`[QASignalRService] Failed to leave question group ${questionId}:`, error);
      throw error;
    }
  }

  // ============================================================================
  // HEALTH MONITORING (Following existing monitoring patterns)
  // ============================================================================

  /**
   * Get connection health information
   * Similar to existing health check patterns
   */
  async getConnectionHealth(): Promise<ConnectionHealth | null> {
    try {
      return await this.connectionService.getConnectionHealth();
    } catch (error) {
      console.error('[QASignalRService] Failed to get connection health:', error);
      return null;
    }
  }

  /**
   * Get connection reliability metrics
   * Following existing analytics patterns
   */
  getConnectionReliability(): ConnectionReliability | null {
    return this.connectionService.currentReliabilityMetrics;
  }

  /**
   * Get active connections (admin feature)
   */
  async getActiveConnections(): Promise<ActiveConnection[]> {
    try {
      return await this.connectionService.getActiveConnections();
    } catch (error) {
      console.error('[QASignalRService] Failed to get active connections:', error);
      return [];
    }
  }

  /**
   * Test connection
   * Similar to existing ping/health check patterns
   */
  async testConnection(): Promise<boolean> {
    try {
      await this.connectionService.testConnection('dashboard-health-check');
      return true;
    } catch (error) {
      console.error('[QASignalRService] Connection test failed:', error);
      return false;
    }
  }

  // ============================================================================
  // STATE GETTERS (Following existing service patterns)
  // ============================================================================

  /**
   * Check if service is connected
   */
  get isConnected(): boolean {
    return this.connectionService.isConnected;
  }

  /**
   * Get current connection status
   */
  get connectionStatus(): ConnectionStatus {
    return this.connectionService.currentStatus;
  }

  /**
   * Check if currently reconnecting
   */
  get isReconnecting(): boolean {
    return this.connectionService.isCurrentlyReconnecting;
  }

  /**
   * Get connection statistics
   * Following existing analytics patterns
   */
  getConnectionStats(): any {
    return this.connectionService.getConnectionStats();
  }

  // ============================================================================
  // PRIVATE METHODS
  // ============================================================================

  private setupEventHandlers(): void {
    // Set up connection status handler
    this.connectionService.onStatusChange((status) => {
      this.statusListeners.forEach(listener => {
        try {
          listener(status);
        } catch (error) {
          console.error('[QASignalRService] Error in status listener:', error);
        }
      });
    });

    // Set up error handler
    this.connectionService.onError((error) => {
      this.errorListeners.forEach(listener => {
        try {
          listener(error);
        } catch (err) {
          console.error('[QASignalRService] Error in error listener:', err);
        }
      });
    });

    // Set up QA event handlers
    this.connectionService.onEvent('newAnswer', (data) => {
      this.emitEvent('newAnswer', data);
    });

    this.connectionService.onEvent('voteUpdate', (data) => {
      this.emitEvent('voteUpdate', data);
    });

    this.connectionService.onEvent('questionUpdate', (data) => {
      this.emitEvent('questionUpdate', data);
    });

    this.connectionService.onEvent('answerAccepted', (data) => {
      this.emitEvent('answerAccepted', data);
    });

    this.connectionService.onEvent('reputationUpdate', (data) => {
      this.emitEvent('reputationUpdate', data);
    });

    this.connectionService.onEvent('questionClosed', (data) => {
      this.emitEvent('questionClosed', data);
    });

    this.connectionService.onEvent('expertNotification', (data) => {
      this.emitEvent('expertNotification', data);
    });

    this.connectionService.onEvent('typingIndicator', (data) => {
      this.emitEvent('typingIndicator', data);
    });
  }

  private addEventListener(eventName: string, callback: (data: any) => void): () => void {
    if (!this.eventListeners.has(eventName)) {
      this.eventListeners.set(eventName, new Set());
    }
    
    this.eventListeners.get(eventName)!.add(callback);
    
    return () => {
      const listeners = this.eventListeners.get(eventName);
      if (listeners) {
        listeners.delete(callback);
        if (listeners.size === 0) {
          this.eventListeners.delete(eventName);
        }
      }
    };
  }

  private emitEvent(eventName: string, data: any): void {
    const listeners = this.eventListeners.get(eventName);
    if (listeners) {
      listeners.forEach(listener => {
        try {
          listener(data);
        } catch (error) {
          console.error(`[QASignalRService] Error in ${eventName} listener:`, error);
        }
      });
    }
  }

  // ============================================================================
  // CLEANUP (Following existing cleanup patterns)
  // ============================================================================

  /**
   * Dispose of the service and cleanup resources
   * Following existing service disposal patterns
   */
  dispose(): void {
    this.connectionService.dispose();
    this.eventListeners.clear();
    this.statusListeners.clear();
    this.errorListeners.clear();
    this.isInitialized = false;
    this.reconnectAttempts = 0;
    console.log('[QASignalRService] Disposed successfully');
  }
}

// Factory function following existing service patterns
export const createQASignalRService = (getAuthToken: () => string | null): QASignalRService => {
  return new QASignalRService(getAuthToken);
};