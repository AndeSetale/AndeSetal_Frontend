import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth';
import { inject } from '@angular/core';

export const authDashGuard: CanActivateFn = () => {
    const auth = inject(Auth);
    const router = inject(Router);

    const utilisateur = auth.utilisateur();

    // L'utilisateur doit être connecté ET avoir le rôle admin.
    if (auth.estConnecte() && utilisateur?.role === 'admin') {
      return true;
    }

    // Pas connecté → page de connexion dashboard
    if (!auth.estConnecte()) {
      return router.createUrlTree(['/dash/connexion']);
    }

    // Connecté mais pas admin (citoyen ou agent) → redirection vers
    // le parcours qui correspond à son rôle.
    if (utilisateur?.role === 'agent') {
      return router.createUrlTree(['/agent']);
    }

    // Citoyen ou rôle inconnu → parcours mobile citoyen
    return router.createUrlTree(['/mobile']);
};
