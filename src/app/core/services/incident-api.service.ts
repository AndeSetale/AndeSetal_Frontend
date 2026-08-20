import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

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
  private apiUrl = `${environment.apiUrl}/incidents/`;

  constructor(private http: HttpClient) {}

  /**
   * Crée un nouvel incident en envoyant les données et la photo initiale au Backend Django.
   */
  createIncident(payload: IncidentCreatePayload): Observable<IncidentResponse> {
    const formData = new FormData();
    formData.append('description', payload.description || 'Signalement d\'incident citoyen avec photo');
    if (payload.adresse) formData.append('adresse', payload.adresse);
    if (payload.latitude) formData.append('latitude', payload.latitude.toString());
    if (payload.longitude) formData.append('longitude', payload.longitude.toString());
    if (payload.type) formData.append('type', payload.type);
    if (payload.niveau_urgence) formData.append('niveau_urgence', payload.niveau_urgence);

    if (payload.file) {
      formData.append('image', payload.file, payload.file.name || 'incident.jpg');
      return this.http.post<IncidentResponse>(this.apiUrl, formData);
    } else if (payload.photoUrl && payload.photoUrl.startsWith('data:')) {
      // Conversion DataURL (Base64) de la caméra en fichier File pour multipart/form-data
      return from(this.dataUrlToFile(payload.photoUrl, 'incident_photo.jpg')).pipe(
        switchMap(file => {
          formData.append('image', file, file.name);
          return this.http.post<IncidentResponse>(this.apiUrl, formData);
        })
      );
    } else {
      return this.http.post<IncidentResponse>(this.apiUrl, formData);
    }
  }

  /**
   * Convertit une DataURL base64 (caméra HTML canvas) en objet File
   */
  private async dataUrlToFile(dataUrl: string, filename: string): Promise<File> {
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    return new File([blob], filename, { type: blob.type || 'image/jpeg' });
  }
}
