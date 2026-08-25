import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { Api } from './api';
import {
  Incident,
  NiveauUrgenceIncident,
  StatutIncident,
  TypeIncident,
} from '../models/incident';

interface IncidentListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Incident[];
}

@Injectable({
  providedIn: 'root',
})
export class IncidentService {
  private readonly api = inject(Api);

  /**
   * Récupère la liste des incidents.
   *
   * GET /incidents/
   *
   * Filtres disponibles selon Swagger :
   * - niveau_urgence
   * - statut
   * - type
   */
  getIncidents(
    niveau_urgence?: NiveauUrgenceIncident,
    statut?: StatutIncident,
    type?: TypeIncident
  ): Observable<IncidentListResponse> {

    const params = new URLSearchParams();

    if (niveau_urgence) {
      params.set('niveau_urgence', niveau_urgence);
    }

    if (statut) {
      params.set('statut', statut);
    }

    if (type) {
      params.set('type', type);
    }

    const queryString = params.toString();

    const endpoint = queryString
      ? `/incidents/?${queryString}`
      : '/incidents/';

    return this.api.get<IncidentListResponse>(endpoint);
  }

  /**
   * Récupère un incident par son identifiant.
   *
   * GET /incidents/{id}/
   */
  getById(id: number | string): Observable<Incident> {
    return this.api.get<Incident>(
      `/incidents/${id}/`
    );
  }
}
