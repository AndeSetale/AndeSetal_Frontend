import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { Auth } from '../services/auth';
import { Utilisateur } from '../models/utilisateur';

/**
 * ============================================================
 * GUARD DE CONTRÔLE DES RÔLES
 * ============================================================
 *
 * Ce guard protège les différentes routes selon le rôle
 * de l'utilisateur connecté.
 *
 * admin   → /dashboard
 * agent   → /agent
 * citoyen → /mobile
 */
export const roleGuard = (
  rolesAutorises: Utilisateur['role'][],
  autoriserNonConnecte = false
): CanActivateFn => {

  return () => {

    const auth = inject(Auth);
    const router = inject(Router);


    // ============================================================
    // UTILISATEUR NON CONNECTÉ
    // ============================================================
    //
    // Le parcours citoyen peut être utilisé sans compte.
    // C'est pourquoi il peut appeler :
    //
    // roleGuard(['citoyen'], true)
    //
    if (!auth.estConnecte()) {

      if (autoriserNonConnecte) {
        return true;
      }

      // Les parcours privés redirigent vers la connexion.
      return router.createUrlTree(['/connexion']);
    }


    // ============================================================
    // RÉCUPÉRATION DU RÔLE
    // ============================================================
    //
    // Le rôle a été enregistré dans Auth lors de la connexion.
    //
    const role = auth.getRole();


    // ============================================================
    // SESSION INVALIDE
    // ============================================================
    //
    // Si un token existe mais que nous n'avons pas de rôle,
    // on considère que la session n'est pas exploitable.
    //
    if (!role) {

      auth.deconnecter();

      return router.createUrlTree(['/connexion']);
    }


    // ============================================================
    // VÉRIFICATION DU RÔLE
    // ============================================================
    //
    // Si le rôle de l'utilisateur correspond aux rôles autorisés,
    // l'accès à la route est accepté.
    //
    if (rolesAutorises.includes(role)) {
      return true;
    }


    // ============================================================
    // MAUVAIS PARCOURS
    // ============================================================
    //
    // L'utilisateur est connecté mais tente d'accéder au
    // parcours d'un autre rôle.
    //
    // Il est automatiquement renvoyé vers son propre espace.
    //
    return router.createUrlTree([
      auth.getRouteAccueilSelonRole()
    ]);
  };
};
