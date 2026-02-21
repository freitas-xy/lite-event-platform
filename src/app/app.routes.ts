import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'auth',
        pathMatch: 'full'
    },
    {
        path: 'auth',
        loadComponent: () => import('./pages/auth/auth').then(m => m.AuthPage),
        children: [
            {
                path: '',
                redirectTo: 'login',
                pathMatch: 'full'
            },
            {
                path: 'login',
                loadComponent: () =>
                    import('./pages/auth/login/login').then(m => m.LoginPage)
            },
            {
                path: 'create-account',
                loadComponent: () =>
                    import('./pages/auth/create-account/create-account').then(m => m.CreateAccountPage)
            }
        ]
    }
];