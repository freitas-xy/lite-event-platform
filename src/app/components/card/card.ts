import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'cmp-card',
  imports: [CommonModule],
  templateUrl: './card.html'
})
export class CardComponent {
  @Input() public title: string | null = null;
}
