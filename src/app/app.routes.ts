import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    loadComponent: () =>
      import('./features/auth/auth.component').then((m) => m.AuthPage),
    children: [
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
      },
      {
        path: 'login',
        loadComponent: () =>
          import('./features/auth/login/login.component').then(
            (m) => m.LoginPage,
          ),
      },
      {
        path: 'create-account',
        loadComponent: () =>
          import('./features/auth/create-account/create-account.component').then(
            (m) => m.CreateAccountPage,
          ),
      },
    ],
  },
  {
    path: 'app',
    canMatch: [authGuard],
    canActivate: [authGuard],
    loadComponent: () =>
      import('./layouts/app.layout').then((m) => m.AppLayout),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/home/home.component').then((m) => m.HomePage),
      },
      {
        path: '**',
        redirectTo: '',
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'auth/login',
  },
];
