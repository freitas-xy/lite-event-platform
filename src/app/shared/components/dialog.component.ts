import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from './button.component';

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  template: `
    @if (visible) {
      <div
        class="fixed inset-0 z-[999] flex items-center justify-center p-4 transition-all duration-200"
        [class.bg-black/40]="isOpen"
        [class.bg-black/0]="!isOpen"
        (click)="close()"
      >
        <div class="absolute inset-0 backdrop-blur-sm"></div>

        <div
          (click)="$event.stopPropagation()"
          class="relative flex max-h-[90vh] w-full flex-col rounded-xl bg-white shadow-2xl transition-all duration-200 ease-out"
          [ngClass]="size"
          [class.opacity-0]="!isOpen"
          [class.opacity-100]="isOpen"
          [class.scale-95]="!isOpen"
          [class.scale-100]="isOpen"
        >
          <div
            class="shrink-0 rounded-t-xl border-b border-gray-300 bg-gray-50 px-5 py-4 font-semibold text-gray-800"
          >
            {{ title }}
          </div>

          <div class="overflow-y-auto text-gray-600">
            <ng-content></ng-content>
          </div>

          <div
            class="shrink-0 flex justify-end gap-2 rounded-b-xl border-t border-gray-300 bg-gray-50 px-5 py-3"
          >
            <cmp-button variant="outline" (click)="close()">
              {{ cancelLabel }}
            </cmp-button>

            @if (!hiddenConfirm) {
              <cmp-button (click)="confirm()">
                {{ confirmLabel }}
              </cmp-button>
            }
          </div>
        </div>
      </div>
    }
  `,
})
export class DialogComponent {
  @Input() title = 'Dialog';
  @Input() cancelLabel = 'Cancelar';
  @Input() confirmLabel = 'Confirmar';
  @Input() hiddenConfirm = false;
  @Input() size = 'w-2/5 min-w-[40%] max-w-[40%]';

  @Output() confirmed = new EventEmitter<void>();
  @Output() closed = new EventEmitter<void>();

  isOpen = false;
  visible = false;

  open() {
    this.visible = true;

    requestAnimationFrame(() => {
      this.isOpen = true;
    });
  }

  close() {
    this.isOpen = false;
    this.closed.emit();

    setTimeout(() => {
      this.visible = false;
    }, 200);
  }

  confirm() {
    this.confirmed.emit();
    this.close();
  }
}
