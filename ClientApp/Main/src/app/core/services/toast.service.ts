import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  duration?: number;
  persistent?: boolean;
}

export interface ToastMessage {
  id?: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  duration?: number;
  persistent?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toasts: Toast[] = [];
  private toastsSubject = new BehaviorSubject<Toast[]>([]);
  
  public toasts$: Observable<Toast[]> = this.toastsSubject.asObservable();

  show(toast: ToastMessage) {
    const id = toast.id || this.generateId();
    const duration = toast.duration || 5000;
    
    const toastWithId: Toast = { ...toast, id };
    this.toasts.push(toastWithId);
    this.toastsSubject.next([...this.toasts]);

    if (!toast.persistent) {
      setTimeout(() => {
        this.removeToast(id);
      }, duration);
    }

    console.log(`Toast [${toast.type.toUpperCase()}]: ${toast.message}`);
  }

  success(message: string, title?: string) {
    this.show({ type: 'success', message, title });
  }

  error(message: string, title?: string) {
    this.show({ type: 'error', message, title, persistent: true });
  }

  warning(message: string, title?: string) {
    this.show({ type: 'warning', message, title });
  }

  info(message: string, title?: string) {
    this.show({ type: 'info', message, title });
  }

  removeToast(id: string) {
    this.toasts = this.toasts.filter(toast => toast.id !== id);
    this.toastsSubject.next([...this.toasts]);
  }

  remove(id: string) {
    this.removeToast(id);
  }

  clear() {
    this.toasts = [];
    this.toastsSubject.next([]);
  }

  getToasts(): Toast[] {
    return this.toasts;
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}