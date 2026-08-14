import { Component, signal, computed } from '@angular/core';
import { AddAgentModal } from "../../components/add-agent-modal/add-agent-modal";

interface Agent {
  nom: string;
  identifiant: string;
  departement: string;
  derniereActivite: string;
  statut: 'Actif' | 'Inactif' | 'Suspendu';
}

@Component({
  selector: 'app-gestion-agents',
  standalone: true,
  imports: [AddAgentModal],
  templateUrl: './gestion-agents.html',
  styleUrl: './gestion-agents.css',
})
export class GestionAgents {

  agents = signal<Agent[]>([
    {
      nom: 'Amadou Diallo',
      identifiant: 'AGT-2024-001',
      departement: 'Gestion des déchets',
      derniereActivite: 'Il y a 2 min',
      statut: 'Actif',
    },
    {
      nom: 'Fatou Sall',
      identifiant: 'AGT-2024-002',
      departement: 'Éclairage public',
      derniereActivite: 'Il y a 15 min',
      statut: 'Actif',
    },
    {
      nom: 'Ousmane Ba',
      identifiant: 'AGT-2024-003',
      departement: 'Voirie et Infrastructures',
      derniereActivite: 'Il y a 1h',
      statut: 'Inactif',
    },
    {
      nom: 'Mariama Ndiaye',
      identifiant: 'AGT-2024-004',
      departement: 'Parcs et Espaces verts',
      derniereActivite: 'Il y a 3h',
      statut: 'Actif',
    },
    {
      nom: 'Ibrahima Sarr',
      identifiant: 'AGT-2024-005',
      departement: 'Sécurité',
      derniereActivite: 'Il y a 2 jours',
      statut: 'Suspendu',
    },
  ]);

  currentPage = signal(1);

  totalAgents = signal(6);

  sessionsActives = signal(4);

  agentsSuspendus = signal(3);

  totalPages = computed(() => Math.ceil(this.totalAgents() / 6));

   showAddAgentModal = false;

openAddAgentModal(): void {
  this.showAddAgentModal = true;
}

closeAddAgentModal(): void {
  this.showAddAgentModal = false;
}


  voirAgent(agent: Agent): void {
    console.log('Voir agent :', agent);
  }

  modifierAgent(agent: Agent): void {
    console.log('Modifier agent :', agent);
  }

  supprimerAgent(agent: Agent): void {
    console.log('Supprimer agent :', agent);
  }

  changerPage(page: number): void {
    if (page < 1 || page > this.totalPages()) {
      return;
    }

    this.currentPage.set(page);
  }
}