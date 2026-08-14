// incident.service.ts
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
  getIncidents(): Observable<Incident[]> {
    return of(MOCK_INCIDENTS).pipe(delay(300)); // simule la latence réseau
  }
}