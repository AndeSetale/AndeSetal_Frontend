import { Component, computed, inject, signal } from '@angular/core';

import { CarteKpi } from './components/carte-kpi/carte-kpi';
import { GraphiqueIncidents } from '../../components/graphique-incidents/graphique-incidents';
import { RepartitionIncidents } from '../../components/repartition-incidents/repartition-incidents';
import { IncidentsRecents } from '../../components/incidents-recents/incidents-recents';
import { PerformanceAgents } from '../../components/performance-agents/performance-agents';

import { IncidentService } from '../../core/services/incident.service';

@Component({
  selector: 'app-accueil',
  standalone: true,
  imports: [
    CarteKpi,
    GraphiqueIncidents,
    RepartitionIncidents,
    IncidentsRecents,
    PerformanceAgents
  ],
  templateUrl: './accueil.html',
  styleUrl: './accueil.css',
})
export class Accueil {

  private readonly incidentService = inject(IncidentService);

  // =========================
  // INCIDENTS
  // =========================

  incidents = signal<any[]>([]);

  chargement = signal(true);

  erreur = signal<string | null>(null);


  constructor() {

    this.incidentService.getIncidents().subscribe({

      next: (data) => {

        this.incidents.set(data);

        this.chargement.set(false);

      },

      error: (error) => {

        console.error(
          'Erreur chargement incidents dashboard :',
          error
        );

        this.erreur.set(
          'Impossible de charger les statistiques.'
        );

        this.chargement.set(false);

      }

    });

  }


  // =========================
  // KPI
  // =========================

  incidentsCritiques = computed(() => {

    return this.incidents().filter(
      incident => incident.urgence === 'CRITIQUE'
    ).length;

  });


  incidentsEnCours = computed(() => {

    return this.incidents().filter(
      incident => incident.statut === 'EN_COURS'
    ).length;

  });


  incidentsResolus = computed(() => {

    return this.incidents().filter(
      incident => incident.statut === 'RESOLU'
    ).length;

  });


  totalIncidents = computed(() => {

    return this.incidents().length;

  });


  // =========================
  // RÉPARTITION PAR TYPE
  // =========================

  incidentTypes = computed(() => {

    const incidents = this.incidents();

    const total = incidents.length;

    if (total === 0) {
      return [];
    }

    const types = new Map<string, number>();

    incidents.forEach(incident => {

      const type = incident.type;

      types.set(
        type,
        (types.get(type) ?? 0) + 1
      );

    });


    const couleurs: Record<string, string> = {

      'DECHETS': '#1F2937',

      'CANAUX': '#F97316',

      'VOIRIE': '#9CA3AF',

      'ECLAIRAGE_PUBLIC': '#EAB308',

      'ARBRE': '#16A34A',

      'FUITE_EAU': '#3B82F6',

    };


    return Array.from(types.entries())
      .map(([type, value]) => ({

        label: this.getTypeLabel(type),

        value: Math.round(
          (value / total) * 100
        ),

        color: couleurs[type] ?? '#9CA3AF',

      }));

  });


  private getTypeLabel(type: string): string {

    const labels: Record<string, string> = {

      DECHETS: 'Déchets',

      CANAUX: 'Canaux bouchés',

      VOIRIE: 'Voirie',

      ECLAIRAGE_PUBLIC: 'Éclairage public',

      ARBRE: 'Arbre dangereux',

      FUITE_EAU: "Fuite d'eau",

    };

    return labels[type] ?? type;

  }

}