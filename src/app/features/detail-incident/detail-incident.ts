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
import { Agent, AgentService } from '../../core/services/agent.service';


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
  private agentService = inject(AgentService);

  agents = signal<Agent[]>([]);
  agentSelectionne = signal<number | null>(null);

  incident = signal<Incident | null>(null);

  private map?: L.Map;


  constructor() {
    

    const id = Number(
      this.route.snapshot.paramMap.get('id')
    );

    // Charger les agents
    this.agentService.getAgents().subscribe({
      next: (agents) => {
        this.agents.set(agents);
      },
      error: (error) => {
        console.error('Erreur lors du chargement des agents', error);
      }
    });


    // Charger l'incident
    this.incidentService
      .getIncidents()
      .subscribe((incidents) => {

        const trouve =
          incidents.find(i => i.numericId === id) || null;

        this.incident.set(trouve);

        if (trouve) {
          setTimeout(() => {
            this.initMap(trouve);
          });
        }
      });
  }


  // Quand on sélectionne un agent
  selectionnerAgent(event: Event): void {

    const select = event.target as HTMLSelectElement;

    const agentId = Number(select.value);

    this.agentSelectionne.set(
      agentId || null
    );
  }


  // Assigner l'agent à l'incident
  assignerAgent(): void {

    const incident = this.incident();
    const agentId = this.agentSelectionne();

    if (!incident || !agentId) {
      return;
    }

    this.incidentService
      .assignerAgent(
        incident.numericId,
        agentId
      )
      .subscribe({
        next: (response) => {

          console.log(
            'Agent assigné avec succès',
            response
          );

          // Optionnel : recharger l'incident
          this.incidentService
            .getIncidentById(incident.numericId)
            .subscribe((incidentMisAJour) => {
              this.incident.set(incidentMisAJour);
            });

        },

        error: (error) => {
          console.error(
            'Erreur lors de l’assignation',
            error
          );
        }
      });
  }


  private initMap(incident: Incident): void {
    

    this.map = L.map('incident-map').setView(
      [
        incident.latitude,
        incident.longitude
      ],
      16
    );

    L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        attribution: '&copy; OpenStreetMap contributors'
      }
    ).addTo(this.map);


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