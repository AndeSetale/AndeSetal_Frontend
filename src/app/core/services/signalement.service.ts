// ──────────────────────────────────────────────────────────────────────────────
// Service : SignalementService
// Gère les signalements du parcours citoyen via le backend Django REST.
//
// Endpoints backend :
//   GET  /api/incidents/my/    → liste des incidents du citoyen connecté
//   GET  /api/incidents/:id/   → détail d'un incident
//   POST /api/incidents/       → créer un incident
// ──────────────────────────────────────────────────────────────────────────────
import { Injectable, inject, signal, computed } from '@angular/core';
import { Observable, map } from 'rxjs';
import { tap } from 'rxjs/operators';

import { Api } from './api';
import {
  Signalement,
  SignalementApi,
  CreerSignalementPayload,
  StatutSignalement,
} from '../models/signalement';

@Injectable({ providedIn: 'root' })
export class SignalementService {

  private readonly api = inject(Api);

  /** Cache local alimenté après chaque appel réseau */
  private readonly _signalements = signal<Signalement[]>([]);

  readonly signalements = this._signalements.asReadonly();

  readonly nouveaux = computed(() =>
    this._signalements().filter(s => s.statut === 'NOUVEAU')
  );
  readonly enCours = computed(() =>
    this._signalements().filter(s => s.statut === 'EN_COURS')
  );
  readonly resolus = computed(() =>
    this._signalements().filter(s => s.statut === 'RESOLU')
  );

  // ── Mapping backend → frontend ──────────────────────────────────────────────

  /**
   * Génère un titre lisible à partir du type d'incident backend.
   */
  private titreDepuisType(type: string): string {
    const labels: Record<string, string> = {
      DECHETS:         'Dépôt de déchets',
      CANAUX:          'Canal bouché',
      VOIRIE:          'Problème de voirie',
      ECLAIRAGE_PUBLIC: 'Éclairage public défaillant',
      ARBRE:           'Arbre dangereux',
      FUITE_EAU:       'Fuite d\'eau',
    };
    return labels[type] ?? type;
  }

  /**
   * Convertit un incident API (snake_case, UPPERCASE) en Signalement frontend.
   */
  private mapper(inc: SignalementApi): Signalement {
    const premierePhoto = inc.preuves?.[0]?.url ?? undefined;

    return {
      id:           inc.id,
      reference:    inc.reference,
      type:         inc.type as any,
      urgence:      inc.niveau_urgence,
      statut:       inc.statut,
      titre:        this.titreDepuisType(inc.type),
      description:  inc.description || undefined,
      adresse:      inc.adresse ?? '',
      latitude:     inc.latitude ?? undefined,
      longitude:    inc.longitude ?? undefined,
      photoUrl:     premierePhoto ? premierePhoto : undefined,
      quartier:     inc.quartier ?? undefined,
      dateCreation: inc.date_creation,
      agentId:      inc.assigne_a,
    };
  }

  // ── Méthodes publiques ──────────────────────────────────────────────────────

  /** Charge tous les incidents du citoyen connecté */
  charger(): Observable<Signalement[]> {
    return this.api.get<SignalementApi[]>('/incidents/my/').pipe(
      map(data => data.map(inc => this.mapper(inc))),
      tap(data => this._signalements.set(data))
    );
  }

  /** Récupère un incident par id — cache local en priorité */
  getById(id: number): Observable<Signalement | undefined> {
    const cached = this._signalements().find(s => s.id === id);
    if (cached) {
      return new Observable(obs => { obs.next(cached); obs.complete(); });
    }
    return this.api.get<SignalementApi>(`/incidents/${id}/`).pipe(
      map(inc => this.mapper(inc))
    );
  }

  /** Crée un nouveau signalement */
  creer(payload: CreerSignalementPayload): Observable<Signalement> {
    return this.api.post<SignalementApi>('/incidents/', payload).pipe(
      map(inc => this.mapper(inc)),
      tap(n => this._signalements.update(l => [...l, n]))
    );
  }

  /** Met à jour le statut d'un signalement (agents/admin seulement) */
  mettreAJourStatut(id: number, statut: StatutSignalement): Observable<Signalement> {
    return this.api.patch<SignalementApi>(`/incidents/${id}/`, { statut }).pipe(
      map(inc => this.mapper(inc)),
      tap(maj => this._signalements.update(l => l.map(s => s.id === id ? maj : s)))
    );
  }
}
