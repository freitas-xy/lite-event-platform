import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'auth',
        loadComponent: () => import('./pages/auth/auth').then(m => m.AuthComponent),
        children: [
            {
                path: 'login',
                loadComponent: () => import('./pages/auth/login/login').then(m => m.LoginComponent)
            },
            {
                path: 'create-account',
                loadComponent: () => import('./pages/auth/create-account/create-account').then(m => m.CreateAccountComponent)
            }
        ]
    }
];
