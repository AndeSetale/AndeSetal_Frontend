import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, map, switchMap, tap } from 'rxjs';

import { Api } from './api';
import {
  Intervention,
  InterventionApi,
  PrioriteIntervention,
  StatutIntervention,
} from '../models/intervention';
import { urlMedia } from '../utils/media';
import { libelleType } from '../utils/libelles';

// Délai de résolution attendu par niveau d'urgence (identique au backend)
const SLA_HEURES: Record<string, number> = {
  CRITIQUE: 24,
  ELEVE: 48,
  MODERE: 72,
  ROUTINE: 168,
};

const PRIORITES: Record<string, PrioriteIntervention> = {
  CRITIQUE: 'critique',
  ELEVE: 'urgent',
  MODERE: 'modere',
  ROUTINE: 'routine',
};

const STATUTS: Record<InterventionApi['statut'], StatutIntervention> = {
  EN_ATTENTE: 'assignee',
  EN_COURS: 'en_cours',
  TERMINEE: 'terminee',
};

/**
 * Interventions de l'agent connecté.
 *
 * Endpoints :
 *   GET   /api/interventions/my/             → interventions assignées à l'agent
 *   GET   /api/interventions/:id/            → détail
 *   PATCH /api/interventions/:id/            → démarrage (statut EN_COURS)
 *   POST  /api/interventions/:id/rapport/    → rapport photo (clôture l'intervention)
 */
@Injectable({
  providedIn: 'root',
})
export class InterventionService {

  private readonly api = inject(Api);

  private readonly interventionsSignal = signal<Intervention[]>([]);

  /** Position GPS de l'agent (pour le calcul de distance), si autorisée */
  private readonly position = signal<{ lat: number; lng: number } | null>(null);

  readonly interventions = computed(() =>
    this.interventionsSignal().map(intervention => this.avecDistance(intervention))
  );

  readonly interventionsAssignees = computed(() =>
    this.interventions().filter(intervention => intervention.statut === 'assignee')
  );

  readonly interventionsEnCours = computed(() =>
    this.interventions().filter(intervention => intervention.statut === 'en_cours')
  );

  readonly interventionsTerminees = computed(() =>
    this.interventions().filter(intervention => intervention.statut === 'terminee')
  );

  readonly interventionsUrgentes = computed(() =>
    this.interventions().filter(
      intervention =>
        intervention.statut !== 'terminee' &&
        (intervention.priorite === 'critique' || intervention.priorite === 'urgent')
    )
  );

  /** Charge les interventions de l'agent connecté */
  charger(): Observable<Intervention[]> {
    this.localiser();
    return this.api.get<InterventionApi[]>('/interventions/my/').pipe(
      map(liste => liste.map(item => this.mapper(item))),
      tap(liste => this.interventionsSignal.set(liste)),
    );
  }

  /** Détail d'une intervention (toujours relu depuis le backend) */
  getById(id: number | string): Observable<Intervention> {
    return this.api.get<InterventionApi>(`/interventions/${id}/`).pipe(
      map(item => this.avecDistance(this.mapper(item))),
      tap(intervention => this.remplacer(intervention)),
    );
  }

  /** L'agent démarre l'intervention (arrivée sur site) */
  demarrer(id: number | string): Observable<Intervention> {
    return this.api.patch<InterventionApi>(`/interventions/${id}/`, { statut: 'EN_COURS' }).pipe(
      map(item => this.mapper(item)),
      tap(intervention => this.remplacer(intervention)),
    );
  }

  /** Envoie le rapport photo avant/après : le backend clôture l'intervention */
  envoyerRapport(id: number | string, photoAvant: File, photoApres: File): Observable<Intervention> {
    const formData = new FormData();
    formData.append('photo_avant', photoAvant, photoAvant.name);
    formData.append('photo_apres', photoApres, photoApres.name);

    return this.api.post(`/interventions/${id}/rapport/`, formData).pipe(
      // Relit l'intervention pour récupérer le statut TERMINEE et les URLs des photos
      switchMap(() => this.getById(id)),
    );
  }

  private remplacer(intervention: Intervention): void {
    this.interventionsSignal.update(liste =>
      liste.some(i => i.id === intervention.id)
        ? liste.map(i => (i.id === intervention.id ? intervention : i))
        : [...liste, intervention]
    );
  }

  private mapper(item: InterventionApi): Intervention {
    const incident = item.incident_details;
    const libelle = libelleType(incident.type);

    return {
      id: item.id,
      numeroSuivi: item.numero_suivi,
      incidentId: incident.id,
      reference: incident.reference,
      titre: libelle,
      description: incident.description,
      categorie: libelle,
      adresse: incident.adresse || incident.quartier || 'Dakar Plateau',
      latitude: incident.latitude ?? undefined,
      longitude: incident.longitude ?? undefined,
      priorite: PRIORITES[incident.niveau_urgence] ?? 'routine',
      statut: STATUTS[item.statut],
      image: urlMedia(incident.preuves?.[0]?.url),
      dateCreation: incident.date_creation,
      dateAssignation: item.date_assignation ?? undefined,
      dateDebut: item.date_debut ?? undefined,
      dateFin: item.date_fin ?? undefined,
      sla: item.statut === 'TERMINEE' ? undefined : this.slaRestant(item),
      confianceIA: incident.analyse_ia
        ? Math.round(incident.analyse_ia.score_confiance * 100)
        : undefined,
      photoAvant: urlMedia(item.rapport?.photo_avant),
      photoApres: urlMedia(item.rapport?.photo_apres),
      dateRapport: item.rapport?.date_envoi,
    };
  }

  /** Temps restant avant l'échéance SLA, ex. « 5h » ou « Dépassé » */
  private slaRestant(item: InterventionApi): string {
    const debut = new Date(item.date_assignation ?? item.incident_details.date_creation).getTime();
    const heures = SLA_HEURES[item.incident_details.niveau_urgence] ?? 168;
    const restantMs = debut + heures * 3_600_000 - Date.now();
    if (restantMs <= 0) {
      return 'Dépassé';
    }
    const restantH = Math.floor(restantMs / 3_600_000);
    return restantH >= 24 ? `${Math.floor(restantH / 24)}j` : `${Math.max(restantH, 1)}h`;
  }

  private localiser(): void {
    if (this.position() || typeof navigator === 'undefined' || !navigator.geolocation) {
      return;
    }
    navigator.geolocation.getCurrentPosition(
      pos => this.position.set({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => undefined,
      { timeout: 10000 },
    );
  }

  private avecDistance(intervention: Intervention): Intervention {
    const position = this.position();
    if (!position || intervention.latitude == null || intervention.longitude == null) {
      return intervention;
    }
    const metres = distanceMetres(position.lat, position.lng, intervention.latitude, intervention.longitude);
    return {
      ...intervention,
      distance: metres < 1000 ? `${Math.round(metres)} m` : `${(metres / 1000).toFixed(1)} km`,
    };
  }
}

/** Distance à vol d'oiseau (formule de haversine) */
function distanceMetres(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const rad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = rad(lat2 - lat1);
  const dLng = rad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 6_371_000 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
