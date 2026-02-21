import { CommonModule } from '@angular/common';
import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { LabelComponent } from "../label/label";

@Component({
  selector: 'cmp-input',
  imports: [CommonModule, LabelComponent],
  templateUrl: './input.html',
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

  private onChange: (v: any) => void = () => { };
  private onTouched: () => void = () => { };

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
