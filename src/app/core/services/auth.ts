import { Injectable, inject, signal } from '@angular/core';
import { Api } from './api';
import { TokenStorage } from './token-storage';
import { Utilisateur } from '../models/utilisateur';
import { AuthResponse, UtilisateurApi } from '../models/auth-response';

@Injectable({
  providedIn: 'root'
})
export class Auth {

  private readonly api = inject(Api);
  private readonly tokenStorage = inject(TokenStorage);

  // Utilisateur actuellement connecté
  private utilisateurConnecte = signal<Utilisateur | null>(null);

  // Permet aux composants de consulter l'utilisateur connecté
  utilisateur = this.utilisateurConnecte.asReadonly();

  // Vérifie si un utilisateur est connecté
  estConnecte(): boolean {
    return this.tokenStorage.recupererAccessToken() !== null;
  }

  // Connexion auprès du backend Django
  connecter(email: string, motDePasse: string) {
    return this.api.post<AuthResponse>(
      '/auth/login/',
      {
        username: email,
        password: motDePasse
      }
    );
  }

  // Enregistre la session après une connexion réussie
  enregistrerSession(reponse: AuthResponse): void {
    this.tokenStorage.enregistrerAccessToken(reponse.access);
    this.tokenStorage.enregistrerRefreshToken(reponse.refresh);

    this.utilisateurConnecte.set(
      this.convertirUtilisateur(reponse.user)
    );
  }

  // Transforme le format utilisateur du backend vers celui du frontend
  private convertirUtilisateur(
    utilisateur: UtilisateurApi
  ): Utilisateur {
    return {
      id: utilisateur.id,
      nomComplet: `${utilisateur.first_name} ${utilisateur.last_name}`.trim(),
      email: utilisateur.email,
      telephone: utilisateur.telephone,
      quartier: utilisateur.quartier,
      role: this.convertirRole(utilisateur.role)
    };
  }

  // Convertit les rôles Django vers les rôles utilisés par Angular
  private convertirRole(
    role: UtilisateurApi['role']
  ): Utilisateur['role'] {

    switch (role) {
      case 'CITOYEN':
        return 'citoyen';

      case 'AGENT':
        return 'agent';

      case 'ADMIN':
        return 'admin';
    }
  }

  rafraichirToken() {
    const refreshToken = this.tokenStorage.recupererRefreshToken();

    if (!refreshToken) {
      return null;
    }

    return this.api.post<{ access: string }>(
      '/auth/token/refresh/',
      {
        refresh: refreshToken
      }
    );
  }

  enregistrerAccessToken(token: string): void {
    this.tokenStorage.enregistrerAccessToken(token);
  }

  // Déconnexion
  deconnecter(): void {
    this.tokenStorage.supprimerTokens();
    this.utilisateurConnecte.set(null);
  }
}