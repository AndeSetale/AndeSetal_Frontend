import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { Api } from './api';
import { Incident } from '../models/incident';
import { PrioriteIntervention } from '../models/intervention';
import { urlMedia } from '../utils/media';
import { libelleType } from '../utils/libelles';

interface IncidentApi {
  id: number;
  reference: string;
  type: string;
  description: string;
  niveau_urgence: string;
  adresse: string | null;
  quartier: string | null;
  latitude: number | null;
  longitude: number | null;
  date_creation: string;
  preuves: { url: string | null }[];
  analyse_ia: { score_confiance: number } | null;
}

const PRIORITES: Record<string, PrioriteIntervention> = {
  CRITIQUE: 'critique',
  ELEVE: 'urgent',
  MODERE: 'modere',
  ROUTINE: 'routine',
};

/**
 * Détail d'un incident pour l'application agent.
 *
 * Endpoint : GET /api/incidents/:id/
 */
@Injectable({
  providedIn: 'root',
})
export class IncidentService {

  private readonly api = inject(Api);

  getById(id: number | string): Observable<Incident> {
    return this.api.get<IncidentApi>(`/incidents/${id}/`).pipe(
      map(item => ({
        id: item.id,
        titre: libelleType(item.type),
        description: item.description,
        categorie: libelleType(item.type),
        adresse: item.adresse || item.quartier || 'Dakar Plateau',
        image: urlMedia(item.preuves?.[0]?.url),
        priorite: PRIORITES[item.niveau_urgence] ?? 'routine',
        confianceIA: item.analyse_ia
          ? Math.round(item.analyse_ia.score_confiance * 100)
          : undefined,
        latitude: item.latitude ?? undefined,
        longitude: item.longitude ?? undefined,
        dateCreation: item.date_creation,
        iaAnalyse: item.analyse_ia !== null,
      })),
    );
  }
}
