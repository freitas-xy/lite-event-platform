import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastContainerComponent } from "./shared/components/toast-container.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastContainerComponent],
  templateUrl: './app.html',
  standalone: true,
  styleUrls: ['./app.css']
})
export class App {
  protected readonly title = signal('lite-event-platform');
}
