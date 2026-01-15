import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface LoadingState {
  key: string;
  message?: string;
  timeout?: number;
}

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loadingSubject = new BehaviorSubject<Map<string, LoadingState>>(new Map());
  public loading$ = this.loadingSubject.asObservable();
  
  private timeouts = new Map<string, any>();

  show(key: string = 'global', message?: string, timeout?: number): void {
    const currentState = this.loadingSubject.value;
    currentState.set(key, { key, message, timeout });
    this.loadingSubject.next(new Map(currentState));

    // Set timeout if specified
    if (timeout && timeout > 0) {
      const timeoutId = setTimeout(() => {
        this.hide(key);
      }, timeout);
      this.timeouts.set(key, timeoutId);
    }
  }

  hide(key: string = 'global'): void {
    const currentState = this.loadingSubject.value;
    currentState.delete(key);
    this.loadingSubject.next(new Map(currentState));

    // Clear timeout if exists
    const timeoutId = this.timeouts.get(key);
    if (timeoutId) {
      clearTimeout(timeoutId);
      this.timeouts.delete(key);
    }
  }

  hideAll(): void {
    this.loadingSubject.next(new Map());
    
    // Clear all timeouts
    this.timeouts.forEach(timeoutId => clearTimeout(timeoutId));
    this.timeouts.clear();
  }

  isLoading(key: string = 'global'): Observable<boolean> {
    return new Observable(observer => {
      const subscription = this.loading$.subscribe(state => {
        observer.next(state.has(key));
      });
      return () => subscription.unsubscribe();
    });
  }

  isAnyLoading(): Observable<boolean> {
    return new Observable(observer => {
      const subscription = this.loading$.subscribe(state => {
        observer.next(state.size > 0);
      });
      return () => subscription.unsubscribe();
    });
  }
}
