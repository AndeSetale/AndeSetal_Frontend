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

// Réponse du backend après une inscription
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
  private utilisateurConnecte = signal<Utilisateur | null>(
    JSON.parse(localStorage.getItem('utilisateur') || 'null')
  );


  // Permet aux composants de consulter l'utilisateur connecté
  utilisateur = this.utilisateurConnecte.asReadonly();


  // Vérifie si un utilisateur est connecté
  estConnecte(): boolean {
    return this.tokenStorage.recupererAccessToken() !== null;
  }


  // ============================================================
  // récupérer le rôle de l'utilisateur connecté
  // ============================================================
  //
  // Cette méthode permet aux guards et à la connexion de savoir
  // quel parcours doit être utilisé :
  //
  // - citoyen → parcours citoyen
  // - agent   → parcours agent
  // - admin   → dashboard administration
  //
  // Le rôle est déjà enregistré dans localStorage lors de la
  // connexion grâce à enregistrerSession().
  //
  getRole(): Utilisateur['role'] | null {
    return this.utilisateurConnecte()?.role ?? null;
  }


  // ============================================================
  // déterminer la page d'accueil selon le rôle
  // ============================================================
  //
  // Cette méthode centralise la logique de redirection.
  // Ainsi, on évite d'avoir plusieurs composants qui connaissent
  // les URLs des différents parcours.
  //
  getRouteAccueilSelonRole(): string {
    const role = this.getRole();

    switch (role) {

      case 'agent':
        return '/agent';

      case 'admin':
        return '/dashboard';

      case 'citoyen':
        return '/mobile';

      default:
        // Si aucun rôle n'est disponible, on renvoie vers
        // la page de connexion.
        return '/connexion';
    }
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


  // ============================================================
  // Enregistre la session après une connexion réussie
  // ============================================================
  //
  // On enregistre :
  // - access token
  // - refresh token
  // - informations de l'utilisateur
  // - rôle de l'utilisateur
  //
  // Le rôle sera ensuite utilisé par les redirections et les guards.
  //
  enregistrerSession(reponse: AuthResponse): void {

    this.tokenStorage.enregistrerAccessToken(reponse.access);
    this.tokenStorage.enregistrerRefreshToken(reponse.refresh);

    const utilisateur = this.convertirUtilisateur(reponse.user);

    this.utilisateurConnecte.set(utilisateur);

    localStorage.setItem(
      'utilisateur',
      JSON.stringify(utilisateur)
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

      // Le rôle envoyé par Django est conservé tel quel :
      // citoyen | agent | admin
      role: this.convertirRole(utilisateur.role),

      photoUrl: utilisateur.photo_profil ?? ''
    };
  }


  // ============================================================
  // Conversion du rôle Django → rôle Angular
  // ============================================================
  //
  // Pour le moment les deux utilisent les mêmes valeurs.
  // On conserve cette méthode afin de pouvoir adapter facilement
  // le mapping si le backend change ses valeurs plus tard.
  //
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


  // ============================================================
  // DÉCONNEXION
  // ============================================================
  //
  // On supprime les tokens ainsi que les informations de
  // l'utilisateur connecté.
  //
  deconnecter(): void {

    this.tokenStorage.supprimerTokens();

    localStorage.removeItem('utilisateur');

    this.utilisateurConnecte.set(null);
  }
}
