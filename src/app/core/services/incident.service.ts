import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';

export interface Incident {
  id: number;
  latitude: number;
  longitude: number;
  type: 'depot_sauvage' | 'ordures_menageres' | 'dechets_plastiques' | 'egouts_bouches' | 'autre';
  urgence: 'critique' | 'modere' | 'leger';
  statut: 'nouveau' | 'en_cours' | 'resolu';
  titre: string;
  adresse: string;
  photoUrl?: string;
  signalePar: string; // "Anonyme" ou nom
  dateCreation: string;
}

const MOCK_INCIDENTS: Incident[] = [
  {
    id: 1, latitude: 14.6937, longitude: -17.4441,
    type: 'depot_sauvage', urgence: 'critique', statut: 'nouveau',
    titre: 'Dépôt du massif sauvage',
    adresse: 'Rue de Thionq x Rue Vincens',
    signalePar: 'Anonyme', dateCreation: '2026-08-13T08:45:00',
  },
  {
    id: 2, latitude: 14.6989, longitude: -17.4595,
    type: 'dechets_plastiques', urgence: 'modere', statut: 'en_cours',
    titre: 'Déchets plastiques accumulés',
    adresse: 'Grand Yoff, près du poste de santé',
    signalePar: 'Fatou D.', dateCreation: '2026-08-12T14:20:00',
  },
  {
    id: 3, latitude: 14.7102, longitude: -17.4780,
    type: 'ordures_menageres', urgence: 'leger', statut: 'resolu',
    titre: 'Ordures ménagères ramassées',
    adresse: 'Sicap Liberté',
    signalePar: 'Moussa S.', dateCreation: '2026-08-10T09:00:00',
  },
  {
    id: 4, latitude: 14.6870, longitude: -17.4450,
    type: 'egouts_bouches', urgence: 'critique', statut: 'nouveau',
    titre: 'Égouts bouchés',
    adresse: 'Dieupeul-Derklé',
    signalePar: 'Anonyme', dateCreation: '2026-08-13T07:10:00',
  },
];

@Injectable({ providedIn: 'root' })
export class IncidentService {
  private incidents: Incident[] = [...MOCK_INCIDENTS];

  // State pour le signalement en cours
  private draftPhotoUrl: string | null = null;
  private draftAddress: string = 'Rue 10, Médina, Dakar';
  private draftLat: number = 14.6937;
  private draftLng: number = -17.4441;

  getIncidents(): Observable<Incident[]> {
    return of(this.incidents).pipe(delay(300));
  }

  setDraftPhoto(photoUrl: string) {
    this.draftPhotoUrl = photoUrl;
  }

  getDraftPhoto(): string | null {
    return this.draftPhotoUrl;
  }

  setDraftLocation(address: string, lat: number, lng: number) {
    this.draftAddress = address;
    this.draftLat = lat;
    this.draftLng = lng;
  }

  getDraftLocation() {
    return {
      address: this.draftAddress,
      lat: this.draftLat,
      lng: this.draftLng,
    };
  }

  // Reverse Geocoding dynamique via API OpenStreetMap Nominatim
  async reverseGeocode(lat: number, lng: number): Promise<string> {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`, {
        headers: { 'Accept-Language': 'fr' }
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.address) {
          const road = data.address.road || data.address.pedestrian || data.address.suburb || data.address.neighbourhood || data.address.quarter || '';
          const suburb = data.address.suburb || data.address.city_district || data.address.county || 'Dakar Plateau';
          const city = data.address.city || data.address.town || 'Dakar';
          
          if (road) {
            return `${road}, ${suburb}, ${city}`;
          } else if (data.display_name) {
            return data.display_name.split(',').slice(0, 3).join(',');
          }
        }
      }
    } catch (err) {
      console.warn('Reverse geocoding impossible, utilisation des coordonnées GPS:', err);
    }
    return `Position GPS (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
  }

  // Détection GPS temps réel lors de la prise de photo
  async fetchCurrentLocation(): Promise<{ address: string; lat: number; lng: number }> {
    return new Promise((resolve) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            const lat = pos.coords.latitude;
            const lng = pos.coords.longitude;
            const address = await this.reverseGeocode(lat, lng);
            this.setDraftLocation(address, lat, lng);
            resolve({ address, lat, lng });
          },
          (err) => {
            console.warn('Accès GPS refusé ou indisponible:', err);
            const fallbackAddress = 'Rue 10, Médina, Dakar Plateau';
            this.setDraftLocation(fallbackAddress, 14.6937, -17.4441);
            resolve({ address: fallbackAddress, lat: 14.6937, lng: -17.4441 });
          },
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
      } else {
        const fallbackAddress = 'Rue 10, Médina, Dakar Plateau';
        this.setDraftLocation(fallbackAddress, 14.6937, -17.4441);
        resolve({ address: fallbackAddress, lat: 14.6937, lng: -17.4441 });
      }
    });
  }

  addIncident(incidentData: { titre?: string; description?: string; type?: Incident['type']; urgence?: Incident['urgence'] }): Observable<Incident> {
    const newId = this.incidents.length + 1;
    const newIncident: Incident = {
      id: newId,
      latitude: this.draftLat,
      longitude: this.draftLng,
      type: incidentData.type || 'depot_sauvage',
      urgence: incidentData.urgence || 'modere',
      statut: 'nouveau',
      titre: incidentData.titre || 'Signalement citoyen',
      adresse: this.draftAddress,
      photoUrl: this.draftPhotoUrl || undefined,
      signalePar: 'Citoyen (Anonyme)',
      dateCreation: new Date().toISOString(),
    };
    this.incidents.unshift(newIncident);
    return of(newIncident).pipe(delay(400));
  }
}