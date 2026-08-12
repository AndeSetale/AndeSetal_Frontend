import { Injectable, signal } from '@angular/core';
import { Utilisateur } from '../models/utilisateur';

@Injectable({
  providedIn: 'root'
})

export class Auth {
    // Utilisateur actuellement connecté
  private utilisateurConnecte = signal<Utilisateur | null>(null);

  // Token JWT de l'utilisateur connecté
  private token = signal<string | null>(null);

  // Permet aux composants de consulter l'utilisateur connecté
  utilisateur = this.utilisateurConnecte.asReadonly();

  // Vérifie si un utilisateur est connecté
  estConnecte(): boolean {
    return this.utilisateurConnecte() !== null;
  }

  // Connexion de l'utilisateur
  connecter(utilisateur: Utilisateur, token: string): void {

    // Simulation temporaire : cette partie sera remplacée par l'appel à l'API Django
    // lors de l'intégration du backend et de l'authentification JWT.
    this.utilisateurConnecte.set(utilisateur);
    this.token.set(token);
  }

  // Récupère le token JWT de l'utilisateur connecté
  getToken(): string | null {
    return this.token();
  }

  // Déconnexion de l'utilisateur
  deconnecter(): void {
    this.utilisateurConnecte.set(null);
    this.token.set(null);
  }
}
