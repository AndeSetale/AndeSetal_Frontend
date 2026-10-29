import { Component, computed, inject, input } from '@angular/core';
import { Router } from '@angular/router';

import { AgentDetail } from '../../../core/services/agent.service';

interface Activity {
  id: string;
  incidentId: number;
  type: string;
  quartier: string;
  date: string;
  statut: 'Résolu' | 'En cours' | 'En attente';
}

const STATUTS: Record<string, Activity['statut']> = {
  TERMINEE: 'Résolu',
  EN_COURS: 'En cours',
  EN_ATTENTE: 'En attente',
};

@Component({
  selector: 'app-recent-activity-table',
  imports: [],
  templateUrl: './recent-activity-table.html',
  styleUrl: './recent-activity-table.css',
})
export class RecentActivityTable {

  private readonly router = inject(Router);

  /** Dernières interventions de l'agent (GET /agents/:id/ → activites_recentes) */
  readonly recentes = input<AgentDetail['activites_recentes']>([]);

  readonly activities = computed<Activity[]>(() =>
    this.recentes().map(a => ({
      id: a.reference,
      incidentId: a.incident_id,
      type: a.type,
      quartier: a.quartier,
      date: a.date
        ? new Date(a.date).toLocaleString('fr-FR', {
            day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
          })
        : '—',
      statut: STATUTS[a.statut] ?? 'En attente',
    }))
  );

  voirIncident(activity: Activity): void {
    this.router.navigate(['/dashboard/map/incidents', activity.incidentId]);
  }
}
