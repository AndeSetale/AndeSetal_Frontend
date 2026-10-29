// ──────────────────────────────────────────────────────────────────────────────
// Écran : Profil citoyen
// Affiche avatar + nom + rôle + localisation, stats (3 compteurs),
// infos personnelles éditables, sécurité, préférences notifs, déconnexion.
// Route : /mobile/profil
// ──────────────────────────────────────────────────────────────────────────────
import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProfilService, PreferencesNotifs } from '../../../core/services/profil.service';
import { Auth } from '../../../core/services/auth';

@Component({
  selector: 'app-profil',
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './profil.html',
  styleUrl: './profil.css',
})
export class ProfilCitoyen implements OnInit {
  // ── Injection ────────────────────────────────────────────────────────────────
  private readonly profilService = inject(ProfilService);
  private readonly auth          = inject(Auth);

  // ── Signals exposés au template ──────────────────────────────────────────────
  /** Données du profil (nom, email, téléphone, quartier…) */
  readonly profil = this.profilService.profil;

  /** Compteurs : signalements / résolus / set-setal */
  readonly stats  = this.profilService.stats;

  /** Préférences de notifications (push / email / sms) */
  readonly notifs = this.profilService.notifs;

  /** true pendant le chargement initial */
  chargement = signal(true);

  /** Champs info personnelles pour le @for dans le template */
  readonly champsInfos = computed(() => {
    const p = this.profil();
    if (!p) return [];
    return [
      { cle: 'prenom',    label: 'PRÉNOM',    valeur: p.prenom },
      { cle: 'nom',       label: 'NOM',       valeur: p.nom },
      { cle: 'telephone', label: 'TÉLÉPHONE', valeur: p.telephone },
      { cle: 'email',     label: 'EMAIL',     valeur: p.email },
      { cle: 'quartier',  label: 'QUARTIER',  valeur: p.quartier },
    ];
  });

  // ── Cycle de vie ──────────────────────────────────────────────────────────────
  ngOnInit(): void {
    // Charge le profil depuis le service au démarrage du composant
    this.profilService.charger().subscribe(() => this.chargement.set(false));
  }

  // ── Gestion des notifications ─────────────────────────────────────────────────
  /**
   * Bascule un toggle de notification et sauvegarde les préférences.
   * @param cle  'push' | 'email' | 'sms'
   */
  toggleNotif(cle: keyof PreferencesNotifs): void {
    const actuel = this.notifs();
    const maj: PreferencesNotifs = { ...actuel, [cle]: !actuel[cle] };
    // Appel au service (mock ou backend selon l'état du projet)
    this.profilService.mettreAJourNotifs(maj).subscribe();
  }

  // ── Déconnexion ───────────────────────────────────────────────────────────────
  /** Déconnecte le citoyen et redirige vers la page de connexion */
  deconnecter(): void {
    this.auth.deconnecter();
    // Navigation gérée côté template via routerLink sur le bouton
  }

  // ── Helper ────────────────────────────────────────────────────────────────────
  /** Retourne les initiales du nom complet pour l'avatar placeholder */
  getInitiales(): string {
    const p = this.profil();
    if (!p) return '?';
    return `${p.prenom.charAt(0)}${p.nom.charAt(0)}`.toUpperCase();
  }
}
