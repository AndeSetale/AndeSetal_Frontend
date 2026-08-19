import {
  Component,
  computed,
  inject,
  signal
} from '@angular/core';

import {
  AddAgentModal
} from '../../components/add-agent-modal/add-agent-modal';

import {
  AgentService,
  Agent
} from '../../core/services/agent.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-gestion-agents',
  standalone: true,
  imports: [AddAgentModal],
  templateUrl: './gestion-agents.html',
  styleUrl: './gestion-agents.css',
})
export class GestionAgents {

  private readonly agentService = inject(AgentService);

  // =========================
  // État
  // =========================
  private readonly router = inject(Router);

  agents = signal<Agent[]>([]);

  loading = signal(false);

  error = signal<string | null>(null);

  currentPage = signal(1);

  pageSize = 6;

  showAddAgentModal = false;


  // =========================
  // Statistiques
  // =========================

  totalAgents = computed(() =>
    this.agents().length
  );

  sessionsActives = computed(() =>
    this.agents().filter(agent => agent.disponible).length
  );

  agentsSuspendus = computed(() =>
    this.agents().filter(agent => !agent.disponible).length
  );


  // =========================
  // Pagination
  // =========================

  totalPages = computed(() =>
    Math.ceil(
      this.totalAgents() / this.pageSize
    )
  );

  agentsAffiches = computed(() => {

    const start =
      (this.currentPage() - 1) *
      this.pageSize;

    const end =
      start + this.pageSize;

    return this.agents().slice(start, end);
  });


  // =========================
  // Initialisation
  // =========================

  constructor() {
    this.chargerAgents();
  }


  // =========================
  // Récupération des agents
  // =========================

  chargerAgents(): void {

    this.loading.set(true);

    this.error.set(null);

    this.agentService.getAgents().subscribe({

      next: (agents) => {

        this.agents.set(agents);

        console.log(agents)

        this.loading.set(false);

      },

      error: (error) => {

        console.error(
          'Erreur récupération agents :',
          error
        );

        this.error.set(
          'Impossible de récupérer les agents.'
        );

        this.loading.set(false);

      }

    });
  }


  // =========================
  // Modal
  // =========================

  openAddAgentModal(): void {
    this.showAddAgentModal = true;
  }

  closeAddAgentModal(): void {
    this.showAddAgentModal = false;
  }


  // =========================
  // Actions
  // =========================

  voirAgent(agent: Agent): void {

    console.log(
      'Voir agent :',
      agent
    );
     this.router.navigate(['/dashboard/agents', agent.id]);

  }


  modifierAgent(agent: Agent): void {

    console.log(
      'Modifier agent :',
      agent
    );

  }


  supprimerAgent(agent: Agent): void {

    if (!agent.id) {
      return;
    }

    const confirmation = confirm(
      `Voulez-vous supprimer ${agent.nom_complet} ?`
    );

    if (!confirmation) {
      return;
    }

    this.agentService.deleteAgent(agent.id).subscribe({

      next: () => {

        this.agents.update(
          agents =>
            agents.filter(
              a => a.id !== agent.id
            )
        );

        // Si on supprime le dernier élément
        // de la dernière page
        if (
          this.currentPage() > this.totalPages() &&
          this.totalPages() > 0
        ) {
          this.currentPage.set(
            this.totalPages()
          );
        }

      },

      error: (error) => {

        console.error(
          'Erreur suppression agent :',
          error
        );

      }

    });
  }


  // =========================
  // Pagination
  // =========================

  changerPage(page: number): void {

    if (
      page < 1 ||
      page > this.totalPages()
    ) {
      return;
    }

    this.currentPage.set(page);
  }

}