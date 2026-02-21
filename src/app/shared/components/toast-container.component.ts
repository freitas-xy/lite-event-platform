import { Component, inject, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastComponent } from './toast.component';
import { Toast, ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'cmp-toast-container',
  imports: [CommonModule, ToastComponent],
  template: `<div
    class="fixed bottom-4 right-4 flex flex-col gap-3 pointer-events-none z-50"
  >
    @for (toast of toasts(); track toast.id) {
      <div class="pointer-events-auto animate-slide-up">
        <cmp-toast
          [type]="toast.type"
          [message]="toast.message"
          [id]="toast.id"
          (click)="dismiss(toast.id)"
        >
        </cmp-toast>
      </div>
    }
  </div>`,
  styles: `
    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(16px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes slideDown {
      from {
        opacity: 1;
        transform: translateY(0);
      }
      to {
        opacity: 0;
        transform: translateY(16px);
      }
    }

    :global(.animate-slide-up) {
      animation: slideUp 0.3s ease-out forwards;
    }
  `,
})
export class ToastContainerComponent {
  private toastService: ToastService = inject(ToastService);

  toasts: WritableSignal<Toast[]> = this.toastService.toasts;

  dismiss(id: string): void {
    this.toastService.dismiss(id);
  }
}
