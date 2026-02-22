import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { UserService } from '../../core/services/user.service';
import { ToastService } from '../../core/services/toast.service';
import { EntitySwitchDialog } from '../../features/entities/dialogs/entity-switch.dialog';

interface SidebarItem {
  label: string;
  iconSVG: SafeHtml;
  route: string;
}

@Component({
  selector: 'cmp-sidebar',
  standalone: true,
  template: `
    <div
      class="relative flex h-screen w-full max-w-[20rem] flex-col rounded-xl bg-white bg-clip-border p-4 text-gray-700 shadow-xl shadow-blue-gray-900/5"
    >
      <div class="p-4 mb-2">
        <h5
          class="block font-sans text-xl antialiased font-semibold leading-snug tracking-normal "
        >
          Event Lite
        </h5>
      </div>
      <nav
        class="flex min-w-[240px] flex-col gap-1 p-2 font-sans text-base font-normal text-blue-gray-700"
      >
        @for (item of itemsSidebar; track $index) {
          <div
            [ngClass]="
              isActive(item.route)
                ? 'bg-indigo-50 text-indigo-600 font-medium'
                : 'text-gray-600 hover:bg-gray-50'
            "
            role="button"
            class="flex items-center w-full p-3 cursor-pointer hover:bg-gray-50 leading-tight transition-all rounded-lg outline-none text-start hover:bg-blue-gray-50 hover:bg-opacity-80 hover:text-blue-gray-900 focus:bg-blue-gray-50 focus:bg-opacity-80 
            focus:text-blue-gray-900 active:bg-blue-gray-50 active:bg-opacity-80 active:text-blue-gray-900"
            (click)="navigateTo(item.route)"
          >
            <div
              class="grid mr-4 place-items-center"
              [innerHTML]="item.iconSVG"
            ></div>
            {{ item.label }}
          </div>
        }
      </nav>
      <div class="absolute bottom-0 left-0 w-full p-4">
        <hr class="mb-4 border-b-0.5 border-gray-300" />

        <div
          class="flex items-center justify-between cursor-pointer select-none"
          (click)="toggleUserMenu()"
        >
          <div class="flex flex-col">
            <p class="text-sm font-bold text-gray-700">
              {{ userData.name }}
            </p>
            <p class="text-xs text-gray-500">
              {{ userData.email }}
            </p>
          </div>

          <svg
            class="w-4 h-4 text-gray-400 transition-transform duration-200"
            [ngClass]="{ 'rotate-180': userMenuOpen }"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>

        <div
          class="overflow-hidden transition-all duration-200"
          [ngClass]="userMenuOpen ? 'max-h-40 mt-3' : 'max-h-0'"
        >
          <div class="flex flex-col gap-1 text-sm">
            <button
              class="text-left cursor-pointer py-2 rounded-lg text-gray-600 hover:bg-gray-50"
              (click)="openDialogEntitySwitch = true"
            >
              Unidades
            </button>
            <button
              class="text-left cursor-pointer py-2 rounded-lg hover:bg-red-50 text-red-500"
              (click)="logout()"
            >
              Sair
            </button>
          </div>
        </div>
      </div>
    </div>
    <app-entity-switch-dialog
      [open]="openDialogEntitySwitch"
      (close)="openDialogEntitySwitch = false"
    />
  `,
  imports: [CommonModule, EntitySwitchDialog],
})
export class SidebarComponent {
  protected userService: UserService = inject(UserService);
  protected sanitizer: DomSanitizer = inject(DomSanitizer);
  protected toast: ToastService = inject(ToastService);
  protected router: Router = inject(Router);

  openDialogEntitySwitch: boolean = false;
  userMenuOpen = false;
  itemsSidebar: SidebarItem[] = [
    {
      label: 'Dashboard',
      iconSVG: this.sanitizer.bypassSecurityTrustHtml(`
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
      </svg>
      `),
      route: '',
    },
  ];

  toggleUserMenu(): void {
    this.userMenuOpen = !this.userMenuOpen;
  }

  logout(): void {
    this.userService.clear();
    this.router.navigate(['/auth/login']);
    this.toast.show('Desconectado com sucesso', 'success');
  }

  isActive(route: string): boolean {
    return this.router.url === `/app${route}`;
  }

  navigateTo(route: string): void {
    this.router.navigate([`app${route}`]);
  }

  public get userData(): { email: string; name: string } {
    const user = this.userService.getUser();
    return {
      email: user?.email || '',
      name: user?.displayName || '',
    };
  }
}
