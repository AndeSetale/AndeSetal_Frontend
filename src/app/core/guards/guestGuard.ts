import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { Auth } from '../services/auth';

export const guestGuard: CanActivateFn = () => {
  const auth = inject(Auth);
  const router = inject(Router);

  if (!auth.estConnecte()) {
    return true;
  }

  const utilisateur = auth.utilisateur();

  // Redirection vers le bon espace selon le rôle
  switch (utilisateur?.role) {
    case 'admin':
      return router.createUrlTree(['/dashboard']);
    case 'agent':
      return router.createUrlTree(['/agent']);
    default:
      // citoyen ou indéfini
      return router.createUrlTree(['/mobile']);
  }
};