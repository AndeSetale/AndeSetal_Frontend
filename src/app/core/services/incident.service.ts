import { Observable, of, delay,map } from 'rxjs';
import { Injectable, inject } from '@angular/core';
import { Api } from './api';
import { environment } from '../../../environments/environment';

export interface DashboardStats {
  signalements: {
    total: number;
    en_cours: number;
    resolus: number;
    urgents: number;
  };
  incidents_par_statut: { statut: string; count: number }[];
  agents_disponibles: number;
}

export interface Incident {
  id: string; // reference Django, ex "INC-4F2A9B10"
  numericId: number; // pk numérique, utile pour PATCH /incidents/<id>/
  type: string; // libellé du type (ex "Dépôt sauvage de déchets")
  titre: string; // alias de type, pour compat avec detail/popup
  quartier: string;
  adresse: string;
  latitude: number;
  longitude: number;
  date: string; // date formatée pour affichage
  dateCreation: string; // alias de date, pour compat avec popup-incident
  urgence: 'CRITIQUE' | 'ELEVE' | 'MODERE' | 'ROUTINE';
  statut: 'NOUVEAU' | 'EN_COURS' | 'RESOLU';
  description: string;
  assigne_a?: number | null;
  signalePar: string; // "Anonyme" si non authentifié
  photoUrl: string | null; // URL de la première preuve, si dispo
}

interface IncidentApi {
  id: number;
  reference: string;
  type: string;
  description: string;
  statut: 'NOUVEAU' | 'EN_COURS' | 'RESOLU';
  niveau_urgence: 'CRITIQUE' | 'ELEVE' | 'MODERE' | 'ROUTINE';
  quartier: string | null;
  adresse: string | null;
  latitude: number;
  longitude: number;
  date_creation: string;
  signale_par?: string | null;
  assigne_a?: number | null;
  preuves?: {
    id: number;
    type: string;
    type_display: string;
    url: string;
    date_ajout: string;
}[];
}

type ListeApi = IncidentApi[] | { results: IncidentApi[] };

const LABELS_TYPE: Record<string, string> = {
  DECHETS: 'Dépôt sauvage de déchets',
  CANAUX: 'Canaux obstrués',
  VOIRIE: 'Voirie endommagée',
  ECLAIRAGE_PUBLIC: 'Éclairage public',
  ARBRE: 'Arbre dangereux',
  FUITE_EAU: "Fuite d'eau",
};

@Injectable({ providedIn: 'root' })
export class IncidentService {
  private readonly api = inject(Api);


  // State pour le signalement en cours
  private draftPhotoUrl: string | null = null;
  private draftAddress: string = 'Rue 10, Médina, Dakar';
  private draftLat: number = 14.6937;
  private draftLng: number = -17.4441;
  private lastTicketReference: string = 'AS-2024-047';

  setLastTicketReference(ref: string) {
    this.lastTicketReference = ref;
  }

  getLastTicketReference(): string {
    return this.lastTicketReference;
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



  getIncidents(): Observable<Incident[]> {
    return this.api.get<ListeApi>('/incidents/').pipe(
      map((res) => (Array.isArray(res) ? res : res.results)),
      map((liste) => liste.map(this.mapToIncident)),
    );
  }

  getDashboardStats(): Observable<DashboardStats> {
    return this.api.get<DashboardStats>('/dashboard/stats/');
  }

  getIncidentById(id: number): Observable<Incident> {
    return this.api.get<IncidentApi>(`/incidents/${id}/`).pipe(map(this.mapToIncident));
  }

  /**
   * Récupère les incidents géolocalisés pour la carte admin.
   * Utilise l'endpoint dédié /dashboard/incidents-carte/ qui retourne
   * uniquement les incidents ayant des coordonnées GPS.
   */
  getIncidentsCarte(): Observable<Incident[]> {
    return this.api.get<IncidentApi[]>('/dashboard/incidents-carte/').pipe(
      map((liste) => liste.map(this.mapToIncident)),
    );
  }

  private mapToIncident(item: IncidentApi): Incident {
    const libelle = LABELS_TYPE[item.type] ?? item.type;
    const dateFormatee = new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(item.date_creation));

    return {
      id: item.reference,
      numericId: item.id,
      type: libelle,
      titre: libelle,
      quartier: item.quartier ?? '—',
      adresse: item.adresse ?? '—',
      latitude: item.latitude,
      longitude: item.longitude,
      date: dateFormatee,
      dateCreation: dateFormatee,
      urgence: item.niveau_urgence,
      statut: item.statut,
      description: item.description,
      signalePar: item.signale_par ?? 'Anonyme', // ajuste selon ce que renvoie ton serializer
      photoUrl: item.preuves?.[0]?.url
  ? `${environment.mediaUrl}${item.preuves[0].url}`
  : null,// idem, à vérifier côté PreuveSerializer
      assigne_a: item.assigne_a ?? null,
    };
  }

  assignerAgent(incidentId: number, agentId: number) {
    return this.api.patch(`/incidents/${incidentId}/`, {
      assigne_a: agentId,
    });
  }
}
