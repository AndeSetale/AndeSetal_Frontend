import { Observable, of, delay, map, expand, EMPTY, reduce } from 'rxjs';
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
  repartition_par_type: { type: string; label: string; count: number }[];
  evolution_30_jours: { date: string; nouveaux: number; resolus: number }[];
  performance_agents: { id: number; nom_complet: string; resolus: number; taux_completion: number }[];
}

export interface Incident {
  id: string; // reference Django, ex "INC-4F2A9B10"
  numericId: number; // pk numérique, utile pour PATCH /incidents/<id>/
  type: string; // libellé du type (ex "Dépôt sauvage de déchets")
  typeCode: string; // valeur backend (ex "DECHETS")
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
  assigneNom: string | null;
  signalePar: string; // "Anonyme" si non authentifié
  photoUrl: string | null; // URL de la première preuve, si dispo
  commentaire: string;
  confianceIA: number | null; // score IA en %
  descriptionIA: string | null;
}

export interface MiseAJourIncident {
  assigne_a?: number;
  niveau_urgence?: Incident['urgence'];
  statut?: Incident['statut'];
  commentaire?: string;
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
  signale_par?: number | null;
  signale_par_details?: { nom_complet: string } | null;
  assigne_a?: number | null;
  assigne_a_details?: { nom_complet: string } | null;
  commentaire?: string | null;
  analyse_ia?: { score_confiance: number; description_generee: string | null } | null;
  preuves?: {
    id: number;
    type: string;
    type_display: string;
    url: string;
    date_ajout: string;
}[];
}

type ListeApi = IncidentApi[] | { results: IncidentApi[]; next: string | null };

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
  private draftAddress: string = '';
  private draftLat: number | null = null;
  private draftLng: number | null = null;
  private lastTicketReference: string = '';

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

  setDraftLocation(address: string, lat: number | null, lng: number | null) {
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
  async fetchCurrentLocation(): Promise<{ address: string; lat: number | null; lng: number | null }> {
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
            this.setDraftLocation('', null, null);
            resolve({ address: '', lat: null, lng: null });
          },
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
      } else {
        this.setDraftLocation('', null, null);
        resolve({ address: '', lat: null, lng: null });
      }
    });
  }



  getIncidents(): Observable<Incident[]> {
    // L'API est paginée (20 par page) : on enchaîne les pages tant qu'il y a un `next`
    let page = 1;
    return this.api.get<ListeApi>('/incidents/').pipe(
      expand((res) =>
        !Array.isArray(res) && res.next
          ? this.api.get<ListeApi>(`/incidents/?page=${++page}`)
          : EMPTY,
      ),
      map((res) => (Array.isArray(res) ? res : res.results)),
      reduce((tous, liste) => tous.concat(liste), [] as IncidentApi[]),
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
      typeCode: item.type,
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
      signalePar: item.signale_par_details?.nom_complet ?? 'Anonyme',
      photoUrl: item.preuves?.[0]?.url
  ? `${environment.mediaUrl}${item.preuves[0].url}`
  : null,// idem, à vérifier côté PreuveSerializer
      assigne_a: item.assigne_a ?? null,
      assigneNom: item.assigne_a_details?.nom_complet ?? null,
      commentaire: item.commentaire ?? '',
      confianceIA: item.analyse_ia ? Math.round(item.analyse_ia.score_confiance * 100) : null,
      descriptionIA: item.analyse_ia?.description_generee ?? null,
    };
  }

  /**
   * Mise à jour par l'admin. Renseigner `assigne_a` (id du compte utilisateur
   * de l'agent) crée l'intervention côté backend et notifie l'agent.
   */
  mettreAJour(incidentId: number, payload: MiseAJourIncident): Observable<Incident> {
    return this.api.patch<IncidentApi>(`/incidents/${incidentId}/`, payload).pipe(
      map(item => this.mapToIncident(item)),
    );
  }
}
