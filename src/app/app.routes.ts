import { Routes } from '@angular/router';

export const routes: Routes = [{
    path: '',
    loadComponent: () => import('./pages/auth/create-account/create-account').then(m => m.CreateAccountComponent)
}];
