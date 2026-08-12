import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'connexion',
    pathMatch: 'full'
  },

  {
    path: 'connexion',
    loadComponent: () =>
      import('./features/authentification/connexion/connexion')
        .then(m => m.Connexion)
  },

  {
    path: 'inscription',
    loadComponent: () =>
      import('./features/authentification/inscription/inscription')
        .then(m => m.Inscription)
  },

];
