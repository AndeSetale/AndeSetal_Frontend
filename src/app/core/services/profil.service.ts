// ──────────────────────────────────────────────────────────────────────────────
// Service : ProfilService
// Gère les données du profil citoyen connecté via le backend Django REST.
//
// Endpoints utilisés :
//   GET  /api/auth/me/       → profil de l'utilisateur connecté (UtilisateurSerializer)
//   GET  /api/incidents/my/  → incidents du citoyen (pour calculer les stats)
// ──────────────────────────────────────────────────────────────────────────────
import { Injectable, inject, signal } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Api } from './api';
import { UtilisateurApi } from '../models/auth-response';
import { SignalementApi } from '../models/signalement';

// ── Interfaces ────────────────────────────────────────────────────────────────

export interface ProfilCitoyen {
  id:        number;
  prenom:    string;
  nom:       string;
  telephone: string;
  email:     string;
  quartier:  string;
  role:      'citoyen' | 'agent' | 'admin';
  photoUrl?: string;
}

export interface StatsProfil {
  signalements: number;
  resolus:      number;
  setSetal:     number;
}

export interface PreferencesNotifs {
  push:  boolean;
  email: boolean;
  sms:   boolean;
}

export interface MettreAJourProfilPayload {
  prenom?:    string;
  nom?:       string;
  telephone?: string;
  email?:     string;
  quartier?:  string;
}

// ── Service ───────────────────────────────────────────────────────────────────
@Injectable({ providedIn: 'root' })
export class ProfilService {

  private readonly api = inject(Api);

  private readonly _profil = signal<ProfilCitoyen | null>(null);
  private readonly _stats  = signal<StatsProfil>({ signalements: 0, resolus: 0, setSetal: 0 });
  private readonly _notifs = signal<PreferencesNotifs>({ push: false, email: false, sms: false });

  readonly profil = this._profil.asReadonly();
  readonly stats  = this._stats.asReadonly();
  readonly notifs = this._notifs.asReadonly();

  // ── Mapping backend → frontend ──────────────────────────────────────────────

  /**
   * Convertit UtilisateurSerializer (backend) en ProfilCitoyen (frontend).
   * - first_name / last_name → prenom / nom
   * - photo_profil (URL relative) → photoUrl (URL absolue gérée par l'API)
   */
  private mapperUtilisateur(u: UtilisateurApi): ProfilCitoyen {
    return {
      id:        u.id,
      prenom:    u.first_name,
      nom:       u.last_name,
      telephone: u.telephone ?? '',
      email:     u.email,
      quartier:  u.quartier ?? '',
      role:      u.role,
      photoUrl:  u.photo_profil ?? undefined,
    };
  }

  // ── Méthodes publiques ──────────────────────────────────────────────────────

  /**
   * Charge le profil ET les stats du citoyen connecté.
   * - Profil → GET /api/auth/me/
   * - Stats  → GET /api/incidents/my/ (comptage local)
   */
  charger(): Observable<ProfilCitoyen> {
    return forkJoin({
      utilisateur: this.api.get<UtilisateurApi>('/auth/me/'),
      incidents:   this.api.get<SignalementApi[]>('/incidents/my/'),
    }).pipe(
      map(({ utilisateur, incidents }) => {
        const profil = this.mapperUtilisateur(utilisateur);

        // Calcul des stats à partir des incidents
        const total   = incidents.length;
        const resolus = incidents.filter(i => i.statut === 'RESOLU').length;

        this._profil.set(profil);
        this._stats.set({ signalements: total, resolus, setSetal: 0 });

        return profil;
      })
    );
  }

  /** Met à jour les préférences de notifications (stockage local, pas de backend dédié) */
  mettreAJourNotifs(prefs: PreferencesNotifs): Observable<PreferencesNotifs> {
    // Pas d'endpoint backend pour les notifs — on met à jour localement
    this._notifs.set(prefs);
    return new Observable(obs => { obs.next(prefs); obs.complete(); });
  }

  /** Met à jour les infos personnelles via PATCH /api/auth/me/
   *  (si un endpoint PATCH est ajouté côté backend ultérieurement)
   */
  mettreAJour(payload: MettreAJourProfilPayload): Observable<ProfilCitoyen> {
    // Traduit du format frontend vers le format backend (snake_case)
    const backendPayload: Record<string, unknown> = {};
    if (payload.prenom    !== undefined) backendPayload['first_name']  = payload.prenom;
    if (payload.nom       !== undefined) backendPayload['last_name']   = payload.nom;
    if (payload.telephone !== undefined) backendPayload['telephone']   = payload.telephone;
    if (payload.email     !== undefined) backendPayload['email']       = payload.email;
    if (payload.quartier  !== undefined) backendPayload['quartier']    = payload.quartier;

    return this.api.patch<UtilisateurApi>('/auth/me/', backendPayload).pipe(
      map(u => this.mapperUtilisateur(u)),
      tap(profil => this._profil.set(profil))
    );
  }
}
