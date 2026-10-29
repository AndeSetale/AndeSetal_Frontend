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
  /** Id du compte utilisateur de l'agent (attendu par incident.assigne_a) */
  agentSelectionne = signal<number | null>(null);

  urgence = signal<Incident['urgence']>('ROUTINE');

  notes = signal('');

  enregistrement = signal(false);

  message = signal<{ ok: boolean; texte: string } | null>(null);

  readonly niveaux: { valeur: Incident['urgence']; libelle: string; actif: string }[] = [
    { valeur: 'CRITIQUE', libelle: 'Critique', actif: 'bg-red-50 text-red-700 border-red-500' },
    { valeur: 'ELEVE', libelle: 'Élevé', actif: 'bg-orange-50 text-orange-700 border-orange-500' },
    { valeur: 'MODERE', libelle: 'Modéré', actif: 'bg-amber-50 text-amber-700 border-amber-500' },
    { valeur: 'ROUTINE', libelle: 'Routine', actif: 'bg-green-50 text-green-700 border-green-600' },
  ];

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
      .getIncidentById(id)
      .subscribe((incident) => {
        this.afficher(incident);
        setTimeout(() => this.initMap(incident));
      });
  }

  private afficher(incident: Incident): void {
    this.incident.set(incident);
    this.agentSelectionne.set(incident.assigne_a ?? null);
    this.urgence.set(incident.urgence);
    this.notes.set(incident.commentaire);
  }

  selectionnerAgent(event: Event): void {

    const select = event.target as HTMLSelectElement;

    const agentId = Number(select.value);

    this.agentSelectionne.set(
      agentId || null
    );
  }


  // Assigner l'agent à l'incident
  /**
   * Enregistre priorité, notes et assignation. L'assignation crée
   * l'intervention dans l'application de l'agent.
   */
  assignerAgent(): void {
    const incident = this.incident();

    if (!incident) {
      return;
    }

    const agentId = this.agentSelectionne();
    this.enregistrement.set(true);
    this.message.set(null);

    this.incidentService
      .mettreAJour(incident.numericId, {
        niveau_urgence: this.urgence(),
        commentaire: this.notes(),
        ...(agentId ? { assigne_a: agentId } : {}),
      })
      .subscribe({
        next: (incidentMisAJour) => {
          this.afficher(incidentMisAJour);
          this.enregistrement.set(false);
          this.message.set({
            ok: true,
            texte: agentId
              ? `Intervention assignée à ${incidentMisAJour.assigneNom ?? "l'agent"}.`
              : 'Modifications enregistrées.',
          });
        },
        error: (error) => {
          this.enregistrement.set(false);
          this.message.set({
            ok: false,
            texte: error?.error?.assigne_a?.[0] ?? "L'enregistrement a échoué.",
          });
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