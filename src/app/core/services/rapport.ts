import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { Api } from './api';
import {
  Rapport,
  RapportCreate,
  RapportUpdate,
} from '../models/rapport';

@Injectable({
  providedIn: 'root',
})
export class RapportService {
  private readonly api = inject(Api);

  /**
   * Récupère le rapport de clôture d'une intervention.
   *
   * GET /interventions/{intervention_id}/rapport/
   *
   * Le backend détermine l'intervention à partir de l'URL.
   */
  getByIntervention(
    interventionId: number | string
  ): Observable<Rapport> {
    return this.api.get<Rapport>(
      `/interventions/${interventionId}/rapport/`
    );
  }

  /**
   * Crée un rapport de clôture.
   *
   * POST /interventions/{intervention_id}/rapport/
   *
   * Le backend attend :
   * - photo_avant
   * - photo_apres
   * - statut
   *
   * L'intervention n'est PAS envoyée dans le body :
   * elle est déterminée par l'URL.
   *
   * Les photos sont envoyées sous forme de fichiers
   * via multipart/form-data.
   */
  create(
    interventionId: number | string,
    data: RapportCreate
  ): Observable<Rapport> {
    const formData = new FormData();

    formData.append('photo_avant', data.photo_avant);
    formData.append('photo_apres', data.photo_apres);
    formData.append('statut', data.statut);

    return this.api.post<Rapport>(
      `/interventions/${interventionId}/rapport/`,
      formData
    );
  }

  /**
   * Modifie un rapport de clôture.
   *
   * PATCH /interventions/{intervention_id}/rapport/
   *
   * PATCH étant partiel, les champs sont ajoutés uniquement
   * lorsqu'ils sont présents dans la requête.
   *
   * Les fichiers sont envoyés sous forme de multipart/form-data.
   */
  update(
    interventionId: number | string,
    data: RapportUpdate
  ): Observable<Rapport> {
    const formData = new FormData();

    if (data.photo_avant !== undefined) {
      if (data.photo_avant !== null) {
        formData.append('photo_avant', data.photo_avant);
      }
    }

    if (data.photo_apres !== undefined) {
      if (data.photo_apres !== null) {
        formData.append('photo_apres', data.photo_apres);
      }
    }

    if (data.statut !== undefined) {
      formData.append('statut', data.statut);
    }

    return this.api.patch<Rapport>(
      `/interventions/${interventionId}/rapport/`,
      formData
    );
  }
}
