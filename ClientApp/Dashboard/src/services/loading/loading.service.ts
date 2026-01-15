export interface LoadingState {
  key: string;
  message?: string;
  timeout?: number;
}

type LoadingListener = (state: Map<string, LoadingState>) => void;

export class LoadingService {
  private static instance: LoadingService;
  private listeners: LoadingListener[] = [];
  private loadingState = new Map<string, LoadingState>();
  private timeouts = new Map<string, NodeJS.Timeout>();

  private constructor() {}

  static getInstance(): LoadingService {
    if (!LoadingService.instance) {
      LoadingService.instance = new LoadingService();
    }
    return LoadingService.instance;
  }

  subscribe(listener: LoadingListener): () => void {
    this.listeners.push(listener);
    // Immediately notify with current state
    listener(new Map(this.loadingState));
    
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  show(key: string = 'global', message?: string, timeout?: number): void {
    this.loadingState.set(key, { key, message, timeout });
    this.notifyListeners();

    // Set timeout if specified
    if (timeout && timeout > 0) {
      const timeoutId = setTimeout(() => {
        this.hide(key);
      }, timeout);
      this.timeouts.set(key, timeoutId);
    }
  }

  hide(key: string = 'global'): void {
    this.loadingState.delete(key);
    this.notifyListeners();

    // Clear timeout if exists
    const timeoutId = this.timeouts.get(key);
    if (timeoutId) {
      clearTimeout(timeoutId);
      this.timeouts.delete(key);
    }
  }

  hideAll(): void {
    this.loadingState.clear();
    this.notifyListeners();
    
    // Clear all timeouts
    this.timeouts.forEach(timeoutId => clearTimeout(timeoutId));
    this.timeouts.clear();
  }

  isLoading(key: string = 'global'): boolean {
    return this.loadingState.has(key);
  }

  isAnyLoading(): boolean {
    return this.loadingState.size > 0;
  }

  private notifyListeners(): void {
    const stateCopy = new Map(this.loadingState);
    this.listeners.forEach(listener => listener(stateCopy));
  }
}

export const loadingService = LoadingService.getInstance();
