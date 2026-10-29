import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { Auth } from '../services/auth';
import { Utilisateur } from '../models/utilisateur';

/**
 * Réserve une zone à un rôle. Non connecté → page de connexion ;
 * connecté avec un autre rôle → accueil de son propre parcours.
 */
export function roleGuard(role: Utilisateur['role']): CanActivateFn {
  return () => {
    const auth = inject(Auth);
    const router = inject(Router);
    const utilisateur = auth.utilisateur();

    if (!auth.estConnecte() || !utilisateur) {
      return router.createUrlTree(['/connexion']);
    }

    if (utilisateur.role === role) {
      return true;
    }

    return router.createUrlTree([auth.accueilDuRole(utilisateur.role)]);
  };
}
