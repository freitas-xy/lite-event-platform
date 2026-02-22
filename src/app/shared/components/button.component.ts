import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ButtonVariant = 'primary' | 'outline' | 'danger' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'cmp-button',
  standalone: true,
  imports: [CommonModule],
  template: `<button
    [ngClass]="getButtonClasses()"
    [disabled]="disabled"
    [type]="type"
  >
    <ng-content></ng-content>
  </button>`,
})
export class ButtonComponent {
  @Input() variant: ButtonVariant = 'primary';
  @Input() size: ButtonSize = 'md';
  @Input() disabled = false;
  @Input() type: 'button' | 'submit' | 'reset' = 'button';

  getButtonClasses(): string {
    const baseClasses = `font-medium cursor-pointer transition-colors focus:outline-none 
      focus:ring-2 focus:ring-offset-2 rounded disabled:opacity-50 disabled:cursor-not-allowed`;

    const sizeClasses = this.getSizeClasses();
    const variantClasses = this.getVariantClasses();

    return `${baseClasses} ${sizeClasses} ${variantClasses}`;
  }

  private getSizeClasses(): string {
    switch (this.size) {
      case 'sm':
        return 'px-3 py-1.5 text-sm';
      case 'lg':
        return 'px-6 py-3 text-lg';
      case 'md':
      default:
        return 'px-4 py-2 text-base';
    }
  }

  private getVariantClasses(): string {
    switch (this.variant) {
      case 'primary':
        return 'bg-blue-500 text-white hover:bg-blue-700 ';
      case 'outline':
        return 'border border-gray-300 text-gray-700 bg-white hover:bg-gray-50';
      case 'danger':
        return 'bg-red-600 text-white hover:bg-red-700';
      case 'ghost':
        return 'bg-transparent text-gray-700 hover:bg-gray-100';
      default:
        return 'bg-blue-600 text-white hover:bg-blue-700';
    }
  }
}
