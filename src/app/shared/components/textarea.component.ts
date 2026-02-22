import { CommonModule } from '@angular/common';
import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { LabelComponent } from './label.component';

@Component({
  selector: 'cmp-textarea',
  standalone: true,
  imports: [CommonModule, LabelComponent],
  template: `<div class="mb-4">
    <cmp-label>
      <ng-content></ng-content>
    </cmp-label>

    <div class="relative">
      <textarea
        class="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        [value]="value"
        (input)="onInput($any($event.target).value)"
        (blur)="onBlur()"
        [disabled]="disabled"
        [rows]="rows"
        [placeholder]="placeholder"
      ></textarea>
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
      useExisting: forwardRef(() => TextareaComponent),
      multi: true,
    },
  ],
})
export class TextareaComponent implements ControlValueAccessor {
  @Input() placeholder = '';
  @Input() rows = 4;

  value: string | null = null;
  disabled = false;

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
}
