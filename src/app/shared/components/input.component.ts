import { CommonModule } from '@angular/common';
import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { LabelComponent } from './label.component';

@Component({
  selector: 'cmp-input',
  imports: [CommonModule, LabelComponent],
  template: `<div class="mb-4">
    <cmp-label>
      <ng-content></ng-content>
    </cmp-label>

    <div class="relative">
      <input
        class="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 pr-10"
        [value]="value"
        (input)="onInput($event.target.value)"
        (blur)="onBlur()"
        [disabled]="disabled"
        [type]="type === 'password' && visible ? 'text' : type"
        [placeholder]="placeholder"
        [id]="id"
      />

      <button
        *ngIf="type === 'password'"
        class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
        type="button"
        (click)="$event.preventDefault(); toggleVisibility()"
        aria-label="Toggle password visibility"
      >
        <svg
          *ngIf="!visible"
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            d="M10 4.5c3.97 0 7.14 2.6 8.48 5.5C17.14 12.9 13.97 15.5 10 15.5S2.86 12.9 1.52 10c1.34-2.9 4.51-5.5 8.48-5.5zM10 13a3 3 0 100-6 3 3 0 000 6z"
          />
        </svg>
        <svg
          *ngIf="visible"
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M13.875 18.825A10.05 10.05 0 0110 19.5c-3.97 0-7.14-2.6-8.48-5.5a12.042 12.042 0 012.31-3.472M6.1 6.1A10.05 10.05 0 0110 4.5c3.97 0 7.14 2.6 8.48 5.5-.37.8-.86 1.54-1.44 2.2M15 12a3 3 0 11-3-3"
          />
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M3 3l18 18"
          />
        </svg>
      </button>
    </div>

    <div class="mt-1 text-xs text-gray-500">
      <ng-content select=".help"></ng-content>
    </div>

    <div class="mt-1 text-xs text-red-500">
      <ng-content select=".errorText"></ng-content>
    </div>
  </div>`,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
})
export class InputComponent implements ControlValueAccessor {
  @Input() type = 'text';
  @Input() placeholder = '';
  @Input() id?: string;

  value: string | null = null;
  disabled = false;
  visible = false;

  private onChange: (v: any) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(obj: any): void {
    this.value = obj ?? null;
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onInput(v: string) {
    this.value = v;
    this.onChange(v);
  }

  onBlur() {
    this.onTouched();
  }

  toggleVisibility() {
    this.visible = !this.visible;
  }
}
