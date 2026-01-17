import { Injectable, inject, signal, computed } from '@angular/core';
import { PWAService } from './pwa.service';
import { BehaviorSubject, Observable, fromEvent, merge } from 'rxjs';
import { map, startWith, distinctUntilChanged, filter } from 'rxjs/operators';

export interface OfflineAction {
  id: string;
  type: 'message' | 'post' | 'like' | 'comment' | 'join_group' | 'update_profile';
  data: any;
  timestamp: number;
  retryCount: number;
  maxRetries: number;
}

export interface OfflineData {
  conversations: any[];
  messages: any[];
  groups: any[];
  profile: any;
  lastSync: number;
}

@Injectable({
  providedIn: 'root'
})
export class OfflineService {
  private pwaService = inject(PWAService);

  // Reactive state
  private _isOnline = signal(navigator.onLine);
  private _pendingActions = signal<OfflineAction[]>([]);
  private _offlineData = signal<OfflineData>({
    conversations: [],
    messages: [],
    groups: [],
    profile: null,
    lastSync: 0
  });

  // Public readonly signals
  readonly isOnline = this._isOnline.asReadonly();
  readonly isOffline = computed(() => !this._isOnline());
  readonly pendingActions = this._pendingActions.asReadonly();
  readonly offlineData = this._offlineData.asReadonly();
  readonly hasPendingActions = computed(() => this._pendingActions().length > 0);

  // Storage keys
  private readonly OFFLINE_DATA_KEY = 'offline_data';
  private readonly PENDING_ACTIONS_KEY = 'pending_actions';

  // Online status observable
  readonly onlineStatus$: Observable<boolean> = merge(
    fromEvent(window, 'online').pipe(map(() => true)),
    fromEvent(window, 'offline').pipe(map(() => false))
  ).pipe(
    startWith(navigator.onLine),
    distinctUntilChanged()
  );

  constructor() {
    this.initializeOfflineService();
  }

  private initializeOfflineService(): void {
    // Load offline data from storage
    this.loadOfflineData();
    this.loadPendingActions();

    // Listen to online/offline events
    this.onlineStatus$.subscribe(isOnline => {
      this._isOnline.set(isOnline);
      
      if (isOnline) {
        this.syncPendingActions();
      }
    });

    // Auto-sync every 30 seconds when online
    setInterval(() => {
      if (this._isOnline() && this.hasPendingActions()) {
        this.syncPendingActions();
      }
    }, 30000);
  }

  /**
   * Store data for offline access
   */
  storeOfflineData(data: Partial<OfflineData>): void {
    const currentData = this._offlineData();
    const updatedData = {
      ...currentData,
      ...data,
      lastSync: Date.now()
    };
    
    this._offlineData.set(updatedData);
    localStorage.setItem(this.OFFLINE_DATA_KEY, JSON.stringify(updatedData));
  }

  /**
   * Get offline data
   */
  getOfflineData<T>(key: keyof OfflineData): T[] {
    return this._offlineData()[key] as T[];
  }

  /**
   * Add action to pending queue
   */
  addPendingAction(action: Omit<OfflineAction, 'id' | 'timestamp' | 'retryCount'>): void {
    const pendingAction: OfflineAction = {
      ...action,
      id: this.generateId(),
      timestamp: Date.now(),
      retryCount: 0
    };

    this._pendingActions.update(actions => [...actions, pendingAction]);
    this.savePendingActions();

    // Try to sync immediately if online
    if (this._isOnline()) {
      this.syncPendingActions();
    }
  }

  /**
   * Remove action from pending queue
   */
  removePendingAction(actionId: string): void {
    this._pendingActions.update(actions => 
      actions.filter(action => action.id !== actionId)
    );
    this.savePendingActions();
  }

  /**
   * Sync pending actions with server
   */
  async syncPendingActions(): Promise<void> {
    if (!this._isOnline() || !this.hasPendingActions()) {
      return;
    }

    const actions = this._pendingActions();
    const failedActions: OfflineAction[] = [];

    for (const action of actions) {
      try {
        await this.executeAction(action);
        this.removePendingAction(action.id);
      } catch (error) {
        console.error('Failed to sync action:', action, error);
        
        // Increment retry count
        const updatedAction = {
          ...action,
          retryCount: action.retryCount + 1
        };

        if (updatedAction.retryCount < updatedAction.maxRetries) {
          failedActions.push(updatedAction);
        } else {
          console.warn('Max retries reached for action:', action);
          this.removePendingAction(action.id);
        }
      }
    }

    // Update failed actions with incremented retry count
    if (failedActions.length > 0) {
      this._pendingActions.update(actions => 
        actions.map(action => {
          const failedAction = failedActions.find(fa => fa.id === action.id);
          return failedAction || action;
        })
      );
      this.savePendingActions();
    }
  }

  /**
   * Execute a pending action
   */
  private async executeAction(action: OfflineAction): Promise<void> {
    // This would integrate with your actual API services
    switch (action.type) {
      case 'message':
        // await this.messagingService.sendMessage(action.data);
        break;
      case 'post':
        // await this.postService.createPost(action.data);
        break;
      case 'like':
        // await this.socialService.likeContent(action.data);
        break;
      case 'comment':
        // await this.commentService.createComment(action.data);
        break;
      case 'join_group':
        // await this.groupService.joinGroup(action.data.groupId);
        break;
      case 'update_profile':
        // await this.profileService.updateProfile(action.data);
        break;
      default:
        throw new Error(`Unknown action type: ${action.type}`);
    }
  }

  /**
   * Clear all offline data
   */
  clearOfflineData(): void {
    this._offlineData.set({
      conversations: [],
      messages: [],
      groups: [],
      profile: null,
      lastSync: 0
    });
    localStorage.removeItem(this.OFFLINE_DATA_KEY);
  }

  /**
   * Clear all pending actions
   */
  clearPendingActions(): void {
    this._pendingActions.set([]);
    localStorage.removeItem(this.PENDING_ACTIONS_KEY);
  }

  /**
   * Get offline storage usage
   */
  getStorageUsage(): { used: number; available: number; percentage: number } {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      navigator.storage.estimate().then(estimate => {
        return {
          used: estimate.usage || 0,
          available: estimate.quota || 0,
          percentage: estimate.usage && estimate.quota 
            ? (estimate.usage / estimate.quota) * 100 
            : 0
        };
      });
    }
    
    // Fallback for browsers without storage API
    const used = this.calculateLocalStorageUsage();
    return {
      used,
      available: 10 * 1024 * 1024, // Assume 10MB limit
      percentage: (used / (10 * 1024 * 1024)) * 100
    };
  }

  /**
   * Check if content is available offline
   */
  isContentAvailableOffline(type: string, id: string): boolean {
    const data = this._offlineData();
    
    switch (type) {
      case 'conversation':
        return data.conversations.some((c: any) => c.id === id);
      case 'message':
        return data.messages.some((m: any) => m.id === id);
      case 'group':
        return data.groups.some((g: any) => g.id === id);
      default:
        return false;
    }
  }

  /**
   * Get offline content by type and ID
   */
  getOfflineContent(type: string, id: string): any {
    const data = this._offlineData();
    
    switch (type) {
      case 'conversation':
        return data.conversations.find((c: any) => c.id === id);
      case 'message':
        return data.messages.find((m: any) => m.id === id);
      case 'group':
        return data.groups.find((g: any) => g.id === id);
      default:
        return null;
    }
  }

  /**
   * Force sync with server
   */
  async forceSync(): Promise<void> {
    if (!this._isOnline()) {
      throw new Error('Cannot sync while offline');
    }

    await this.syncPendingActions();
    
    // Trigger data refresh in services
    // This would be implemented by each service
    console.log('Force sync completed');
  }

  // Private helper methods

  private loadOfflineData(): void {
    try {
      const stored = localStorage.getItem(this.OFFLINE_DATA_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        this._offlineData.set(data);
      }
    } catch (error) {
      console.error('Failed to load offline data:', error);
    }
  }

  private loadPendingActions(): void {
    try {
      const stored = localStorage.getItem(this.PENDING_ACTIONS_KEY);
      if (stored) {
        const actions = JSON.parse(stored);
        this._pendingActions.set(actions);
      }
    } catch (error) {
      console.error('Failed to load pending actions:', error);
    }
  }

  private savePendingActions(): void {
    try {
      localStorage.setItem(
        this.PENDING_ACTIONS_KEY, 
        JSON.stringify(this._pendingActions())
      );
    } catch (error) {
      console.error('Failed to save pending actions:', error);
    }
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private calculateLocalStorageUsage(): number {
    let total = 0;
    for (const key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        total += localStorage[key].length + key.length;
      }
    }
    return total;
  }
}