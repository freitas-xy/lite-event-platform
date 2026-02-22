import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../components/sidebar.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  template: ` <div class="flex h-screen w-screen">
    <cmp-sidebar />
    <main class="flex-1 overflow-auto">
      <router-outlet></router-outlet>
    </main>
  </div>`,
  imports: [RouterOutlet, SidebarComponent],
})
export class AppLayout {}
