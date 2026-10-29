import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { BreadcrumbAgent } from '../../components/agent-detail/breadcrumb-agent/breadcrumb-agent';
import { AgentProfileHeader } from '../../components/agent-detail/agent-profile-header/agent-profile-header';
import { AgentStatsGrid } from '../../components/agent-detail/agent-stats-grid/agent-stats-grid';
import { GraphiqueIncidents } from '../../components/graphique-incidents/graphique-incidents';
import { RepartitionIncidents } from '../../components/repartition-incidents/repartition-incidents';
import { ActivityChart } from '../../components/agent-detail/activity-chart/activity-chart';
import { RecentActivityTable } from '../../components/agent-detail/recent-activity-table/recent-activity-table';

import { AgentService, AgentDetail as FicheAgent } from '../../core/services/agent.service';
import { COULEURS_TYPE } from '../../core/utils/libelles';

@Component({
  selector: 'app-agent-detail',
  standalone: true,
  imports: [
    AgentProfileHeader,
    AgentStatsGrid,
    RepartitionIncidents,
    ActivityChart,
    RecentActivityTable
  ],
  templateUrl: './agent-detail.html',
  styleUrl: './agent-detail.css',
})
export class AgentDetail {

  private readonly route = inject(ActivatedRoute);
  private readonly agentService = inject(AgentService);

  agent = signal<FicheAgent | null>(null);

  loading = signal(false);

  error = signal<string | null>(null);

  /** Part (%) de chaque type d'incident dans les interventions de l'agent */
  readonly specialisationTypes = computed(() => {
    const agent = this.agent();
    const total = agent?.interventions_total ?? 0;

    if (!agent || total === 0) {
      return [];
    }

    return agent.repartition_types.map(t => ({
      label: t.label,
      value: Math.round((t.total / total) * 100),
      color: COULEURS_TYPE[t.type] ?? '#9CA3AF',
    }));
  });

  constructor() {
    this.chargerAgent();
  }

  chargerAgent(): void {

    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.error.set('Identifiant de l’agent invalide.');
      return;
    }

    this.loading.set(true);

    this.agentService.getAgent(Number(id)).subscribe({

      next: (agent) => {


        this.agent.set(agent);

        this.loading.set(false);
      },

      error: (error) => {

        console.error(
          'Erreur récupération agent :',
          error
        );

        this.error.set(
          'Impossible de récupérer les informations de l’agent.'
        );

        this.loading.set(false);
      }

    });
  }
}