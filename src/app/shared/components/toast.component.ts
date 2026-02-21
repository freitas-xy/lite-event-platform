import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

export type ToastType = 'success' | 'danger' | 'warning';

@Component({
  selector: 'cmp-toast',
  standalone: true,
  imports: [CommonModule],
  template: `<div
    [id]="id"
    role="alert"
    class="group flex items-center gap-3 w-full max-w-sm min-w-sm p-4 rounded-xl shadow-xl border backdrop-blur-sm transition-all duration-200"
    [ngClass]="getContainerClasses()"
  >
    <div
      class="flex items-center justify-center shrink-0 w-8 h-8 rounded-lg"
      [ngClass]="getIconContainerClasses()"
    >
      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none">
        <path
          [attr.d]="getIconPath()"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
      <span class="sr-only">{{ getIconLabel() }}</span>
    </div>

    <div class="flex-1 text-sm leading-relaxed p-0 mb-0">
      {{ message }}
    </div>

    <button
      type="button"
      (click)="close.emit()"
      class="opacity-60 hover:opacity-100 transition-opacity rounded-md p-1 hover:bg-black/5"
      aria-label="Close toast"
    >
      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none">
        <path
          d="M6 18 18 6M6 6l12 12"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
        />
      </svg>
    </button>
  </div>`,
})
export class ToastComponent {
  @Input() type: ToastType = 'success';
  @Input() message = '';
  @Input() id = '';
  @Output() close = new EventEmitter<void>();

  getIconPath(): string {
    const icons = {
      success: 'M5 11.917 9.724 16.5 19 7.5',
      danger: 'M6 18 17.94 6M18 18 6.06 6',
      warning: 'M12 13V8m0 8h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
    };
    return icons[this.type];
  }

  getIconLabel(): string {
    return {
      success: 'Success',
      danger: 'Error',
      warning: 'Warning',
    }[this.type];
  }

  getContainerClasses(): string {
    return {
      success: 'bg-emerald-50 text-emerald-900 border-emerald-200',
      danger: 'bg-red-50 text-red-900 border-red-200',
      warning: 'bg-amber-50 text-amber-900 border-amber-200',
    }[this.type];
  }

  getIconContainerClasses(): string {
    return {
      success: 'bg-emerald-100 text-emerald-600',
      danger: 'bg-red-100 text-red-600',
      warning: 'bg-amber-100 text-amber-600',
    }[this.type];
  }
}
