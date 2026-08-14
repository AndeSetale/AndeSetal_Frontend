import {
  Component,
  inject,
  signal
} from '@angular/core';

import { ActivatedRoute } from '@angular/router';


import * as L from 'leaflet';

import {
  Incident,
  IncidentService
} from '../../core/services/incident.service';


@Component({
  selector: 'app-detail-incident',
  standalone: true,
  imports: [],
  templateUrl: './detail-incident.html',
  styleUrl: './detail-incident.css',
})
export class DetailIncident {

  private route = inject(ActivatedRoute);

  private incidentService = inject(IncidentService);

  incident = signal<Incident | null>(null);

  private map?: L.Map;


  constructor() {

    // 1. Récupérer l'ID dans l'URL
    const id = Number(
      this.route.snapshot.paramMap.get('id')
    );


    // 2. Récupérer les incidents
    this.incidentService
      .getIncidents()
      .subscribe((incidents) => {


        // 3. Trouver l'incident correspondant à l'ID
        const trouve =
          incidents.find(i => i.id === id) || null;


        // 4. Stocker l'incident dans le signal
        this.incident.set(trouve);


        // 5. Initialiser la carte
        if (trouve) {

          setTimeout(() => {
            this.initMap(trouve);
          });

        }

      });

  }


  private initMap(incident: Incident): void {

    // Créer la carte
    this.map = L.map('incident-map').setView(
      [
        incident.latitude,
        incident.longitude
      ],
      16
    );


    // Ajouter OpenStreetMap
    L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        attribution: '&copy; OpenStreetMap contributors'
      }
    ).addTo(this.map);


    // Ajouter le marqueur
    const markerIcon = L.divIcon({
  className: 'custom-marker',
  html: `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="36"
      height="36"
      viewBox="0 0 24 24"
      fill="white"
      stroke="#ef4444"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="M20 10c0 4.993-8 12-8 12S4 14.993 4 10a8 8 0 1 1 16 0Z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
  `,
  iconSize: [36, 36],
  iconAnchor: [18, 36],
  popupAnchor: [0, -36]
});

L.marker(
  [
    incident.latitude,
    incident.longitude
  ],
  {
    icon: markerIcon
  }
)
  .addTo(this.map)
  .bindPopup(incident.adresse)
  .openPopup();
      

  }


  formatDate(date: string): string {

    return new Date(date).toLocaleString(
      'fr-FR',
      {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }
    );

  }

}