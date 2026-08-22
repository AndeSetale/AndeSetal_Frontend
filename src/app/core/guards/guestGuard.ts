import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { Auth } from '../services/auth';

export const guestGuard: CanActivateFn = () => {

  const auth = inject(Auth);
  const router = inject(Router);


  // ============================================================
  // Si l'utilisateur est déjà connecté, on le redirige
  // automatiquement vers son espace selon son rôle.
  // ============================================================

  if (auth.estConnecte()) {

    return router.createUrlTree(
      [auth.getRouteAccueilSelonRole()]
    );
  }

  // ============================================================
  // un utilisateur non connecté peut accéder à la connexion.
  // ============================================================

  return true;
};

