import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from './button.component';

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  template: `<div
    *ngIf="isOpen"
    (click)="close()"
    class="fixed inset-0 z-[999] grid h-screen w-screen place-items-center bg-black/25 backdrop-blur-sm transition-opacity duration-300
    "
  >
    <div
      *ngIf="isOpen"
      (click)="close()"
      class="fixed inset-0 z-[999] flex items-center justify-center bg-black/30 backdrop-blur-sm p-4"
    >
      <div
        (click)="$event.stopPropagation()"
        class="relative w-full max-h-[90vh] rounded-xl bg-white shadow-2xl flex flex-col"
        [ngClass]="size"
      >
        <div
          class="shrink-0 px-5 py-4 bg-gray-50 border-b border-gray-300 font-semibold text-gray-800 rounded-t-xl"
        >
          {{ title }}
        </div>

        <div class="overflow-y-auto text-gray-600">
          <ng-content></ng-content>
        </div>

        <div
          class="shrink-0 flex justify-end gap-2 px-5 py-3 bg-gray-50 border-t border-gray-300 rounded-b-xl"
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
  </div>`,
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

  open() {
    this.isOpen = true;
  }

  close() {
    this.closed.emit();
    this.isOpen = false;
  }

  confirm() {
    this.confirmed.emit();
    this.close();
  }
}
