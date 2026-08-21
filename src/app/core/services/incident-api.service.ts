import { Injectable, inject } from '@angular/core';
import { Observable, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Api } from './api';

export interface IncidentCreatePayload {
  description: string;
  adresse?: string;
  latitude?: number;
  longitude?: number;
  type?: string;
  niveau_urgence?: string;
  photoUrl?: string;
  file?: File;
}

export interface IncidentResponse {
  id: number;
  reference: string;
  type: string;
  description: string;
  statut: string;
  niveau_urgence: string;
  quartier?: string;
  adresse?: string;
  latitude?: number;
  longitude?: number;
  date_creation: string;
  preuves?: Array<{
    id: number;
    type: string;
    image: string;
  }>;
  analyse_ia?: {
    id: number;
    type_detecte: string;
    score_confiance: number;
    niveau_urgence_detecte: string;
    description_generee: string;
    recommandations: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class IncidentApiService {

  private readonly api = inject(Api);

  /**
   * Crée un nouvel incident via le service Api (avec token JWT).
   * Cela garantit que le citoyen connecté est bien enregistré
   * comme signale_par côté backend, et que le signalement
   * apparaît dans GET /api/incidents/my/ (historique).
   */
  createIncident(payload: IncidentCreatePayload): Observable<IncidentResponse> {
    const formData = new FormData();
    formData.append('description', payload.description || "Signalement d'incident citoyen avec photo");
    if (payload.adresse)        formData.append('adresse', payload.adresse);
    if (payload.latitude)       formData.append('latitude', payload.latitude.toString());
    if (payload.longitude)      formData.append('longitude', payload.longitude.toString());
    if (payload.type)           formData.append('type', payload.type);
    if (payload.niveau_urgence) formData.append('niveau_urgence', payload.niveau_urgence);

    if (payload.file) {
      formData.append('image', payload.file, payload.file.name || 'incident.jpg');
      return this.api.post<IncidentResponse>('/incidents/', formData);

    } else if (payload.photoUrl && payload.photoUrl.startsWith('data:')) {
      // Conversion DataURL base64 (caméra) → File pour multipart/form-data
      return from(this.dataUrlToFile(payload.photoUrl, 'incident_photo.jpg')).pipe(
        switchMap(file => {
          formData.append('image', file, file.name);
          return this.api.post<IncidentResponse>('/incidents/', formData);
        })
      );

    } else {
      return this.api.post<IncidentResponse>('/incidents/', formData);
    }
  }

  /**
   * Convertit une DataURL base64 (caméra HTML canvas) en objet File.
   */
  private async dataUrlToFile(dataUrl: string, filename: string): Promise<File> {
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    return new File([blob], filename, { type: blob.type || 'image/jpeg' });
  }
}
