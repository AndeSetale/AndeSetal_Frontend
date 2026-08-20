import { Component, EventEmitter, Output, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AgentService, CreateAgent } from '../../core/services/agent.service';

@Component({
  selector: 'app-add-agent-modal',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './add-agent-modal.html',
  styleUrl: './add-agent-modal.css',
})
export class AddAgentModal {

  private readonly agentService = inject(AgentService);

  @Output() close = new EventEmitter<void>();
  @Output() created = new EventEmitter<void>();

  loading = false;
  error = '';

  form: CreateAgent = {
    nom_complet: '',
    email: '',
    password: '',
    telephone: '',
    departement: '',
    role: 'agent',
  };

  onClose(): void {
    this.close.emit();
  }

  inscrire(): void {

    this.loading = true;
    this.error = '';

    this.agentService.createAgent(this.form).subscribe({

      next: () => {
        this.loading = false;

        this.created.emit();
        this.close.emit();
      },

      error: (error) => {
        console.error('Erreur création agent :', error);

        this.loading = false;

        this.error =
          error?.error?.detail ||
          'Impossible de créer l’agent.';
      }

    });
  }
}