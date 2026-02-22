import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'cmp-card',
  imports: [CommonModule],
  template: `
    <div class="max-w-sm rounded overflow-hidden border border-gray-200 p-4 shadow-lg bg-white">
      @if (title) {
        <div class="font-bold text-xl mb-2">{{ title }}</div>
      }
      <ng-content></ng-content>
    </div>
  `,
})
export class CardComponent {
  @Input() public title: string | null = null;
}
