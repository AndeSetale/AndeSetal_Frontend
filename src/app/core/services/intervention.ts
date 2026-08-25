import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { Api } from './api';
import {
  Intervention,
  StatutIntervention,
} from '../models/intervention';

export interface InterventionCreate {
  incident: number;
  agent: number;
  statut: StatutIntervention;
  date_debut: string;
  date_fin: string;
  numero_suivi: string;
}

export interface InterventionUpdate {
  statut?: StatutIntervention;
  date_debut?: string;
  date_fin?: string;
}

@Injectable({
  providedIn: 'root',
})
export class InterventionService {
  private readonly api = inject(Api);

  /**
   * GET /interventions/
   */
  getInterventions(): Observable<Intervention[]> {
    return this.api.get<Intervention[]>(
      '/interventions/'
    );
  }

  /**
   * GET /interventions/{id}/
   */
  getById(
    id: number | string
  ): Observable<Intervention> {
    return this.api.get<Intervention>(
      `/interventions/${id}/`
    );
  }

  /**
   * POST /interventions/
   */
  create(
    data: InterventionCreate
  ): Observable<Intervention> {
    return this.api.post<Intervention>(
      '/interventions/',
      data
    );
  }

  /**
   * PATCH /interventions/{id}/
   */
  update(
    id: number | string,
    data: InterventionUpdate
  ): Observable<Intervention> {
    return this.api.patch<Intervention>(
      `/interventions/${id}/`,
      data
    );
  }
}
