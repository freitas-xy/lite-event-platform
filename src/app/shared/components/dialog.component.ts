import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [CommonModule],
  template: `<div
    *ngIf="isOpen"
    (click)="close()"
    class="fixed inset-0 z-[999] grid h-screen w-screen place-items-center bg-black/25 backdrop-blur-sm transition-opacity duration-300"
  >
    <div
      (click)="$event.stopPropagation()"
      class="relative m-4 p-4 w-2/5 min-w-[40%] max-w-[40%] rounded-lg bg-white shadow-xl"
    >
      <div
        class="flex shrink-0 items-center pb-4 text-xl font-medium text-slate-800"
      >
        {{ title }}
      </div>
      <div
        class="relative border-t border-slate-200 py-4 leading-normal text-slate-600 font-light"
      >
        <ng-content></ng-content>
      </div>
      <div class="flex shrink-0 flex-wrap items-center pt-4 justify-end">
        <button
          (click)="close()"
          class="rounded-md border border-transparent py-2 px-4 text-center text-sm transition-all text-slate-600 hover:bg-slate-100 focus:bg-slate-100 active:bg-slate-100 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
          type="button"
        >
          {{ cancelLabel }}
        </button>
        <button
          (click)="confirm()"
          class="rounded-md bg-green-600 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-green-700 focus:shadow-none active:bg-green-700 hover:bg-green-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2"
          type="button"
        >
          {{ confirmLabel }}
        </button>
      </div>
    </div>
  </div>`,
})
export class DialogComponent {
  @Input() title = 'Dialog';
  @Input() cancelLabel = 'Cancel';
  @Input() confirmLabel = 'Confirm';

  @Output() confirmed = new EventEmitter<void>();

  isOpen = false;

  open() {
    this.isOpen = true;
  }

  close() {
    this.isOpen = false;
  }

  confirm() {
    this.confirmed.emit();
    this.close();
  }
}
