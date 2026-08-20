import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { BreadcrumbAgent } from '../../components/agent-detail/breadcrumb-agent/breadcrumb-agent';
import { AgentProfileHeader } from '../../components/agent-detail/agent-profile-header/agent-profile-header';
import { AgentStatsGrid } from '../../components/agent-detail/agent-stats-grid/agent-stats-grid';
import { GraphiqueIncidents } from '../../components/graphique-incidents/graphique-incidents';
import { RepartitionIncidents } from '../../components/repartition-incidents/repartition-incidents';
import { ActivityChart } from '../../components/agent-detail/activity-chart/activity-chart';
import { RecentActivityTable } from '../../components/agent-detail/recent-activity-table/recent-activity-table';

import { AgentService, Agent } from '../../core/services/agent.service';

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

  agent = signal<Agent | null>(null);

  loading = signal(false);

  error = signal<string | null>(null);

  readonly specialisationTypes = [
    {
      label: 'Canal bouché',
      value: 60,
      color: '#1F2937',
    },
    {
      label: 'Dépôt sauvage',
      value: 25,
      color: '#F97316',
    },
    {
      label: 'Graffiti',
      value: 10,
      color: '#9CA3AF',
    },
    {
      label: 'Éclairage',
      value: 5,
      color: '#EAB308',
    },
  ];

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

        console.log('Agent récupéré :', agent);

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