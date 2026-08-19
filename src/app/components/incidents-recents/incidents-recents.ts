import { Component, inject, signal } from '@angular/core';

import {
  Incident,
  IncidentService
} from '../../core/services/incident.service';


@Component({
  selector: 'app-incidents-recents',
  standalone: true,
  imports: [],
  templateUrl: './incidents-recents.html',
  styleUrl: './incidents-recents.css',
})
export class IncidentsRecents {

  private readonly incidentService = inject(IncidentService);

  readonly incidents = signal<Incident[]>([]);

  readonly chargement = signal(true);

  readonly erreur = signal<string | null>(null);


  constructor() {

    this.chargerIncidents();

  }


  private chargerIncidents(): void {

    this.incidentService.getIncidents().subscribe({

      next: (data) => {

        // Les plus récents en premier
        const incidentsRecents = [...data]
          .sort(
            (a, b) =>
              new Date(b.dateCreation).getTime() -
              new Date(a.dateCreation).getTime()
          )
          .slice(0, 4);

        this.incidents.set(incidentsRecents);

        this.chargement.set(false);

      },

      error: (error) => {

        console.error(
          'Erreur chargement incidents récents :',
          error
        );

        this.erreur.set(
          'Impossible de charger les incidents récents.'
        );

        this.chargement.set(false);

      }

    });

  }


  badgeUrgence(
    urgence: Incident['urgence']
  ): string {

    switch (urgence) {

      case 'CRITIQUE':
        return 'bg-red-100 text-red-700';

      case 'ELEVE':
        return 'bg-orange-100 text-orange-700';

      case 'MODERE':
        return 'bg-yellow-100 text-yellow-700';

      case 'ROUTINE':
        return 'bg-gray-100 text-gray-600';

      default:
        return 'bg-gray-100 text-gray-600';

    }

  }


  labelUrgence(
    urgence: Incident['urgence']
  ): string {

    switch (urgence) {

      case 'CRITIQUE':
        return 'Critique';

      case 'ELEVE':
        return 'Élevé';

      case 'MODERE':
        return 'Modéré';

      case 'ROUTINE':
        return 'Routine';

    }

  }


  labelStatut(
    statut: Incident['statut']
  ): string {

    switch (statut) {

      case 'NOUVEAU':
        return 'Nouveau';

      case 'EN_COURS':
        return 'En cours';

      case 'RESOLU':
        return 'Résolu';

    }

  }

}