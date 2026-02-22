import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [CommonModule],
  template: `<div
    *ngIf="isOpen"
    (click)="close()"
    class="fixed inset-0 z-[999] grid h-screen w-screen place-items-center bg-black/25 backdrop-blur-sm transition-opacity duration-300
    "
  >
    <div
      (click)="$event.stopPropagation()"
      [class]="'relative m-4  rounded-lg bg-white shadow-xl' + size"
    >
      <div
        class="flex shrink-0 p-4 rounded-t-lg items-center bg-gray-100 pb-4 font-medium text-slate-800"
      >
        {{ title }}
      </div>
      <div
        class="relative border-t border-slate-200 leading-normal text-slate-600 font-light"
      >
        <ng-content></ng-content>
      </div>
      <div
        class=" flex justify-end shrink-0 p-4 py-2 rounded-b-lg items-center bg-gray-100 font-medium text-slate-800"
      >
        <button
          class="bg-white cursor-pointer disabled:opacity-50 hover:bg-gray-50 text-black border border-slate-200 py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="button"
          (click)="close()"
        >
          {{ cancelLabel }}
        </button>
        @if (!hiddenConfirm) {
          <button
            class="bg-blue-500 cursor-pointer disabled:opacity-50 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button"
            (click)="confirm()"
          >
            {{ confirmLabel }}
          </button>
        }
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
