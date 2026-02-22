import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'cmp-skeleton',
  standalone: true,
  imports: [CommonModule],
  template: `<div
    [style.width]="width"
    [style.height]="height"
    class="animate-pulse bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded"
  ></div>`,
})
export class SkeletonComponent {
  @Input() width: string = '100%';
  @Input() height: string = '20px';
}
