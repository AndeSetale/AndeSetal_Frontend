import { inject } from '@angular/core';
import {
  HttpErrorResponse,
  HttpInterceptorFn
} from '@angular/common/http';
import { catchError, switchMap, throwError } from 'rxjs';

import { TokenStorage } from '../services/token-storage';
import { Auth } from '../services/auth';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {

  const tokenStorage = inject(TokenStorage);
  const auth = inject(Auth);

  const token = tokenStorage.recupererAccessToken();

  // Les requêtes publiques peuvent partir sans token.
  if (!token) {
    return next(req);
  }

  const requeteAvecToken = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });

  return next(requeteAvecToken).pipe(

    catchError((erreur: HttpErrorResponse) => {

      // Si ce n'est pas une erreur 401, on la laisse remonter.
      if (erreur.status !== 401) {
        return throwError(() => erreur);
      }

      // On tente de récupérer un nouvel access token.
      const refresh = auth.rafraichirToken();

      if (!refresh) {
        auth.deconnecter();
        return throwError(() => erreur);
      }

      return refresh.pipe(

        switchMap(reponse => {

          // Enregistrer le nouveau token.
          auth.enregistrerAccessToken(reponse.access);

          // Rejouer la requête avec le nouveau token.
          const nouvelleRequete = req.clone({
            setHeaders: {
              Authorization: `Bearer ${reponse.access}`
            }
          });

          return next(nouvelleRequete);
        }),

        catchError(erreurRefresh => {

          // Si le refresh échoue, la session n'est plus valide.
          auth.deconnecter();

          return throwError(() => erreurRefresh);
        })
      );
    })
  );
};