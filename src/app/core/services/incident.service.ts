import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Api } from './api';


export interface Incident {
  id: string;               // reference Django, ex "INC-4F2A9B10"
  numericId: number;        // pk numérique, utile pour PATCH /incidents/<id>/
  type: string;             // libellé du type (ex "Dépôt sauvage de déchets")
  titre: string;            // alias de type, pour compat avec detail/popup
  quartier: string;
  adresse: string;
  latitude: number ;
  longitude: number ;
  date: string;              // date formatée pour affichage
  dateCreation: string;      // alias de date, pour compat avec popup-incident
  urgence: 'CRITIQUE' | 'ELEVE' | 'MODERE' | 'ROUTINE';
  statut: 'NOUVEAU' | 'EN_COURS' | 'RESOLU';
  description: string;
  signalePar: string;        // "Anonyme" si non authentifié
  photoUrl: string | null;   // URL de la première preuve, si dispo
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
  latitude: number ;
  longitude: number ;
  date_creation: string;
  signale_par?: string | null;
  preuves?: { image: string }[];
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

  getIncidents(): Observable<Incident[]> {
    return this.api.get<ListeApi>('/incidents/').pipe(
      map(res => (Array.isArray(res) ? res : res.results)),
      map(liste => liste.map(this.mapToIncident))
    );
  }

  getIncidentById(id: number): Observable<Incident> {
    return this.api.get<IncidentApi>(`/incidents/${id}/`).pipe(map(this.mapToIncident));
  }

  private mapToIncident(item: IncidentApi): Incident {
  const libelle = LABELS_TYPE[item.type] ?? item.type;
  const dateFormatee = new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  }).format(new Date(item.date_creation));

  return {
    id: item.reference,
    numericId: item.id,
    type: libelle,
    titre: libelle,
    quartier: item.quartier ?? '—',
    adresse: item.adresse ?? '—',
    latitude: item.latitude,
    longitude: item.longitude ,
    date: dateFormatee,
    dateCreation: dateFormatee,
    urgence: item.niveau_urgence,
    statut: item.statut,
    description: item.description,
    signalePar: item.signale_par ?? 'Anonyme', // ajuste selon ce que renvoie ton serializer
    photoUrl: item.preuves?.[0]?.image ?? null, // idem, à vérifier côté PreuveSerializer
  };
}
  }
