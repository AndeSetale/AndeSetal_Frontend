// ──────────────────────────────────────────────────────────────────────────────
// Service : SignalementService
// Gère les signalements du parcours citoyen.
//
// ÉTAT ACTUEL  → données mockées en local (signal)
// BACKEND PRÊT → décommenter les blocs "TODO BACKEND" et supprimer les mocks
//
// Endpoints attendus (Django REST Framework) :
//   GET    /api/signalements/          → liste des signalements du citoyen connecté
//   GET    /api/signalements/:id/      → détail d'un signalement
//   POST   /api/signalements/          → créer un signalement
//   PATCH  /api/signalements/:id/      → mettre à jour (statut, etc.)
//   DELETE /api/signalements/:id/      → supprimer un signalement
// ──────────────────────────────────────────────────────────────────────────────
import { Injectable, inject, signal, computed } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { tap } from 'rxjs/operators';

import { Api } from './api';
import {
  Signalement,
  CreerSignalementPayload,
  StatutSignalement,
} from '../models/signalement';

// ── Données mock (à retirer quand le backend est prêt) ────────────────────────
const MOCK_SIGNALEMENTS: Signalement[] = [
  {
    id: 1,
    type: 'depot_sauvage',
    urgence: 'critique',
    statut: 'nouveau',
    titre: 'Dépôt sauvage massif',
    description: 'Un amas de déchets encombre le bas de la rue depuis 3 jours.',
    adresse: 'Rue de Thiong x Rue Vincens, Dakar',
    latitude: 14.6937,
    longitude: -17.4441,
    signalePar: 'Anonyme',
    dateCreation: '2026-08-13T08:45:00',
  },
  {
    id: 2,
    type: 'dechets_plastiques',
    urgence: 'modere',
    statut: 'en_cours',
    titre: 'Déchets plastiques accumulés',
    description: 'Bouteilles et sachets plastiques accumulés près du poste de santé.',
    adresse: 'Grand Yoff, près du poste de santé',
    latitude: 14.6989,
    longitude: -17.4595,
    signalePar: 'Fatou D.',
    dateCreation: '2026-08-12T14:20:00',
    dateMiseAJour: '2026-08-13T09:00:00',
    agentId: 42,
  },
  {
    id: 3,
    type: 'ordures_menageres',
    urgence: 'leger',
    statut: 'resolu',
    titre: 'Ordures ménagères non collectées',
    description: 'Poubelles non vidées depuis plusieurs jours.',
    adresse: 'Sicap Liberté, Dakar',
    latitude: 14.7102,
    longitude: -17.4780,
    signalePar: 'Moussa S.',
    dateCreation: '2026-08-10T09:00:00',
    dateMiseAJour: '2026-08-11T15:30:00',
    agentId: 7,
  },
  {
    id: 4,
    type: 'egouts_bouches',
    urgence: 'critique',
    statut: 'nouveau',
    titre: 'Égouts bouchés',
    description: 'Les égouts débordent et inondent le trottoir.',
    adresse: 'Dieupeul-Derklé, Dakar',
    latitude: 14.6870,
    longitude: -17.4450,
    signalePar: 'Anonyme',
    dateCreation: '2026-08-13T07:10:00',
  },
];

// ── Service ───────────────────────────────────────────────────────────────────
@Injectable({ providedIn: 'root' })
export class SignalementService {

  // Injection du service Api générique (HttpClient wrappé)
  private readonly api = inject(Api);

  // ── Store local en signal ────────────────────────────────────────────────────
  /**
   * Cache local de tous les signalements chargés.
   * Mis à jour après chaque appel réseau (ou mock).
   * Exposé en readonly aux composants via les computed ci-dessous.
   */
  private readonly _signalements = signal<Signalement[]>([]);

  /** Liste complète en lecture seule */
  readonly signalements = this._signalements.asReadonly();

  /** Signalements en attente de traitement */
  readonly nouveaux = computed(() =>
    this._signalements().filter(s => s.statut === 'nouveau')
  );

  /** Signalements en cours de traitement par un agent */
  readonly enCours = computed(() =>
    this._signalements().filter(s => s.statut === 'en_cours')
  );

  /** Signalements clôturés */
  readonly resolus = computed(() =>
    this._signalements().filter(s => s.statut === 'resolu')
  );

  // ── MÉTHODES PUBLIQUES ───────────────────────────────────────────────────────

  /**
   * Charge tous les signalements du citoyen connecté.
   *
   * TODO BACKEND → remplacer le bloc mock par :
   *   return this.api.get<Signalement[]>('/signalements/').pipe(
   *     tap(data => this._signalements.set(data))
   *   );
   */
  charger(): Observable<Signalement[]> {
    // ── MOCK ──
    return of(MOCK_SIGNALEMENTS).pipe(
      delay(300),
      tap(data => this._signalements.set(data))
    );
  }

  /**
   * Récupère un signalement par son id.
   * Cherche d'abord dans le cache local, sinon appel réseau.
   *
   * TODO BACKEND → remplacer par :
   *   return this.api.get<Signalement>(`/signalements/${id}/`);
   */
  getById(id: number): Observable<Signalement | undefined> {
    // ── MOCK : cherche dans le cache ou dans les données statiques ──
    const cached = this._signalements().find(s => s.id === id);
    if (cached) return of(cached).pipe(delay(100));

    const fromMock = MOCK_SIGNALEMENTS.find(s => s.id === id);
    return of(fromMock).pipe(delay(200));
  }

  /**
   * Crée un nouveau signalement.
   *
   * TODO BACKEND → remplacer par :
   *   return this.api.post<Signalement>('/signalements/', payload).pipe(
   *     tap(nouveau => this._signalements.update(liste => [...liste, nouveau]))
   *   );
   */
  creer(payload: CreerSignalementPayload): Observable<Signalement> {
    // ── MOCK : génère un id temporaire et ajoute au cache ──
    const nouveau: Signalement = {
      ...payload,
      id: Date.now(),
      statut: 'nouveau',
      dateCreation: new Date().toISOString(),
    };
    this._signalements.update(liste => [...liste, nouveau]);
    return of(nouveau).pipe(delay(400));
  }

  /**
   * Met à jour le statut d'un signalement (usage admin/agent principalement,
   * mais exposé ici pour la cohérence côté frontend).
   *
   * TODO BACKEND → remplacer par :
   *   return this.api.patch<Signalement>(`/signalements/${id}/`, { statut }).pipe(
   *     tap(maj => this._signalements.update(liste =>
   *       liste.map(s => s.id === id ? maj : s)
   *     ))
   *   );
   */
  mettreAJourStatut(id: number, statut: StatutSignalement): Observable<Signalement> {
    // ── MOCK ──
    const maj = this._signalements().find(s => s.id === id);
    if (!maj) throw new Error(`Signalement #${id} introuvable`);

    const updated: Signalement = { ...maj, statut, dateMiseAJour: new Date().toISOString() };
    this._signalements.update(liste => liste.map(s => s.id === id ? updated : s));
    return of(updated).pipe(delay(200));
  }

  /**
   * Supprime un signalement.
   *
   * TODO BACKEND → remplacer par :
   *   return this.api.delete<void>(`/signalements/${id}/`).pipe(
   *     tap(() => this._signalements.update(liste => liste.filter(s => s.id !== id)))
   *   );
   */
  supprimer(id: number): Observable<void> {
    // ── MOCK ──
    this._signalements.update(liste => liste.filter(s => s.id !== id));
    return of(undefined).pipe(delay(200));
  }
}
