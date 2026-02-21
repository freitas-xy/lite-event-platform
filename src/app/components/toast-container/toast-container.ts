import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastComponent } from '../toast/toast';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'cmp-toast-container',
  imports: [CommonModule, ToastComponent],
  templateUrl: './toast-container.html',
  styleUrls: ['./toast-container.css']
})
export class ToastContainerComponent {
  private toastService = inject(ToastService);

  toasts = this.toastService.toasts;

  dismiss(id: string): void {
    this.toastService.dismiss(id);
  }
}
