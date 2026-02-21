import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'cmp-label',
  imports: [CommonModule],
  template: `<div class="block text-gray-500 text-sm font-medium mb-2">
    <ng-content></ng-content>
  </div>`,
})
export class LabelComponent {}
