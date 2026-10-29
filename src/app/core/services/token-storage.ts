import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenStorage {

  // ============================================================
  // Clés utilisées pour identifier les tokens dans sessionStorage
  // ============================================================
  //
  // Le backend Django retourne deux tokens après la connexion :
  //
  // - access_token  → utilisé pour accéder aux endpoints protégés
  // - refresh_token → utilisé pour obtenir un nouvel access_token
  //
  private readonly cleAccessToken = 'access_token';
  private readonly cleRefreshToken = 'refresh_token';


  // ============================================================
  // Enregistrer l'access token
  // ============================================================
  //
  // L'access token est envoyé par l'interceptor dans les requêtes
  // nécessitant une authentification :
  //
  // Authorization: Bearer <access_token>
  //
  enregistrerAccessToken(token: string): void {
    sessionStorage.setItem(this.cleAccessToken, token);
  }


  // ============================================================
  // Enregistrer le refresh token
  // ============================================================
  //
  // Le refresh token permet de demander un nouvel access token
  // lorsqu'il expire.
  //
  enregistrerRefreshToken(token: string): void {
    sessionStorage.setItem(this.cleRefreshToken, token);
  }


  // ============================================================
  // Récupérer l'access token
  // ============================================================
  //
  // Utilisé principalement par le JWT interceptor pour récupérer
  // le token avant d'ajouter le header Authorization à une requête.
  //
  recupererAccessToken(): string | null {
    return sessionStorage.getItem(this.cleAccessToken);
  }


  // ============================================================
  // Récupérer le refresh token
  // ============================================================
  //
  // Utilisé par le mécanisme de renouvellement du token lorsque
  // l'access token arrive à expiration.
  //
  recupererRefreshToken(): string | null {
    return sessionStorage.getItem(this.cleRefreshToken);
  }


  // ============================================================
  // Supprimer tous les tokens
  // ============================================================
  //
  // Appelé lors de la déconnexion afin de supprimer les données
  // d'authentification de la session courante.
  //
  supprimerTokens(): void {
    sessionStorage.removeItem(this.cleAccessToken);
    sessionStorage.removeItem(this.cleRefreshToken);
  }
}