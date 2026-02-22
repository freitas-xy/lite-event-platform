import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../components/sidebar.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  template: ` <div class="flex h-screen w-screen">
    <cmp-sidebar />
    <router-outlet></router-outlet>
  </div>`,
  imports: [RouterOutlet, SidebarComponent],
})
export class AppLayout {}
