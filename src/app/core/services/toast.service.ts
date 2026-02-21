import { Injectable, signal } from '@angular/core';

export interface Toast {
  id: string;
  type: 'success' | 'danger' | 'warning';
  message: string;
  duration?: number;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  toasts = signal<Toast[]>([]);
  private nextId = 0;

  show(
    message: string,
    type: 'success' | 'danger' | 'warning' = 'success',
    duration: number = 5000,
  ): void {
    const id = `toast-${this.nextId++}`;
    const toast: Toast = { id, type, message, duration };

    this.toasts.update((toasts) => [...toasts, toast]);

    if (duration > 0) {
      setTimeout(() => this.dismiss(id), duration);
    }
  }

  success(message: string, duration?: number): void {
    this.show(message, 'success', duration);
  }

  danger(message: string, duration?: number): void {
    this.show(message, 'danger', duration);
  }

  warning(message: string, duration?: number): void {
    this.show(message, 'warning', duration);
  }

  dismiss(id: string): void {
    this.toasts.update((toasts) => toasts.filter((t) => t.id !== id));
  }

  clear(): void {
    this.toasts.set([]);
  }
}
