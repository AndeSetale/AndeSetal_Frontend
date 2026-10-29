import { Component, computed, inject, signal } from '@angular/core';

import { CarteKpi } from './components/carte-kpi/carte-kpi';
import { GraphiqueIncidents } from '../../components/graphique-incidents/graphique-incidents';
import { RepartitionIncidents } from '../../components/repartition-incidents/repartition-incidents';
import { IncidentsRecents } from '../../components/incidents-recents/incidents-recents';
import { PerformanceAgents } from '../../components/performance-agents/performance-agents';

import { DashboardStats, IncidentService } from '../../core/services/incident.service';
import type { Incident } from '../../core/services/incident.service';
import { COULEURS_TYPE } from '../../core/utils/libelles';

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
  // ÉTAT
  // =========================

  /** Stats globales depuis /api/dashboard/stats/ */
  stats = signal<DashboardStats | null>(null);

  /** Liste complète pour les graphiques de répartition */
  incidents = signal<Incident[]>([]);

  chargement = signal(true);

  erreur = signal<string | null>(null);


  constructor() {

    // 1. Statistiques consolidées côté serveur (admin uniquement)
    this.incidentService.getDashboardStats().subscribe({

      next: (data) => {
        this.stats.set(data);
        this.chargement.set(false);
      },

      error: (error) => {
        console.error('Erreur chargement stats dashboard :', error);
        this.erreur.set('Impossible de charger les statistiques.');
        this.chargement.set(false);
      }

    });

    // 2. Liste complète pour les graphiques (répartition par type, etc.)
    this.incidentService.getIncidents().subscribe({

      next: (data) => {
        this.incidents.set(data);
      },

      error: (error) => {
        console.error('Erreur chargement liste incidents :', error);
      }

    });

  }


  // =========================
  // KPI — depuis l'API stats
  // =========================

  incidentsCritiques = computed(() => {
    return this.stats()?.signalements.urgents ?? 0;
  });

  incidentsEnCours = computed(() => {
    return this.stats()?.signalements.en_cours ?? 0;
  });

  incidentsResolus = computed(() => {
    return this.stats()?.signalements.resolus ?? 0;
  });

  totalIncidents = computed(() => {
    return this.stats()?.signalements.total ?? 0;
  });


  // =========================
  // RÉPARTITION PAR TYPE
  // (calculée côté client depuis la liste complète)
  // =========================

  /** Donut : répartition calculée par le backend sur tous les incidents */
  incidentTypes = computed(() => {
    const repartition = this.stats()?.repartition_par_type ?? [];
    const total = repartition.reduce((somme, t) => somme + t.count, 0);

    if (total === 0) {
      return [];
    }

    return repartition.map(t => ({
      label: this.getTypeLabel(t.type),
      value: Math.round((t.count / total) * 100),
      color: COULEURS_TYPE[t.type] ?? '#9CA3AF',
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
