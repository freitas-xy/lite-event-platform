import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { entityGuard } from './core/guards/entity.guard';

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
    canMatch: [authGuard, entityGuard],
    canActivate: [authGuard, entityGuard],
    loadComponent: () =>
      import('./shared/layouts/app.layout').then((m) => m.AppLayout),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/home/home.component').then((m) => m.HomePage),
      },
      {
        path: 'events',

        children: [
          {
            path: '',
            loadComponent: () =>
              import('./features/list-events/list-events.component').then(
                (m) => m.ListEventsComponent,
              ),
          },
          {
            path: ':id',
            children: [
              {
                path: 'participants',
                loadComponent: () =>
                  import('./features/event/participants/participants.component').then(
                    (m) => m.ParticipantsComponent,
                  ),
              },
              {
                path: 'tickets',
                loadComponent: () =>
                  import('./features/event/ticket/ticket.component').then(
                    (m) => m.TicketComponent,
                  ),
              },
              {
                path: 'forms',
                loadComponent: () =>
                  import('./features/event/form/form.component').then(
                    (m) => m.FormComponent,
                  ),
              },
            ],
          },
        ],
      },
      {
        path: '**',
        redirectTo: '',
      },
    ],
  },
  {
    path: 'create-entities',
    canMatch: [authGuard],
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/entities/create-entity.component').then(
        (m) => m.CreateEntityPage,
      ),
  },
  {
    path: '**',
    redirectTo: 'auth/login',
  },
];
