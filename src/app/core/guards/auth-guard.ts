import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = () => {
    const auth = inject(Auth);
    const router = inject(Router);

    if (auth.estConnecte()) {
      return true;
    }

    // Redirection vers la connexion si l'utilisateur n'est pas authentifié.
    return router.createUrlTree(['/connexion']);
};
