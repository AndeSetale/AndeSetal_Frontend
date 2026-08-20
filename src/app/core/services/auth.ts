import { Injectable, inject, signal } from '@angular/core';
import { Api } from './api';
import { TokenStorage } from './token-storage';
import { Utilisateur } from '../models/utilisateur';
import { AuthResponse, UtilisateurApi } from '../models/auth-response';


export interface InscriptionRequest {
  nom_complet: string;
  email_ou_telephone: string;
  quartier: string;
  password: string;
  accepte_conditions: boolean;
  recevoir_alertes: boolean;
}

export interface InscriptionResponse {
  message: string;
  user: UtilisateurApi;
}


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
  connecter(identifiant: string, motDePasse: string) {
    return this.api.post<AuthResponse>(
      '/auth/login/',
      {
        identifiant,
        password: motDePasse
      }
    );
  }

  inscrire(donnees: InscriptionRequest) {
    return this.api.post<InscriptionResponse>(
      '/auth/register/',
      donnees
    );
  }

  verifierEmail(email: string, code: string) {
    return this.api.post(
      '/auth/verify-email/',
      {
        email,
        code
      }
    );
  }

  renvoyerCode(email: string) {
    return this.api.post(
      '/auth/resend-otp/',
      {
        email
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

    return role;
  }

  // ============================================================
// RÉCUPÉRER L'UTILISATEUR CONNECTÉ
// ============================================================

  me() {
    return this.api.get<UtilisateurApi>('/auth/me/');
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