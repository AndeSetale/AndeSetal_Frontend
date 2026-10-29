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
  quartier: '',
  matricule: '',
  departement: '',
  specialisation: '',
  disponible: true
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
        this.loading = false;

        this.error = this.messageErreur(error?.error);
      }

    });
  }

  /**
   * Transforme les erreurs de validation DRF ({ champ: [messages] })
   * en texte lisible, ex. « Mot de passe : Ce mot de passe est trop courant. »
   */
  private messageErreur(corps: unknown): string {
    if (!corps || typeof corps !== 'object') {
      return 'Impossible de créer l’agent (serveur injoignable).';
    }

    const libelles: Record<string, string> = {
      nom_complet: 'Nom complet',
      email: 'Email',
      password: 'Mot de passe',
      telephone: 'Téléphone',
      matricule: 'Matricule',
      departement: 'Département',
      specialisation: 'Spécialisation',
    };

    return Object.entries(corps as Record<string, string[] | string>)
      .map(([champ, messages]) => {
        const texte = Array.isArray(messages) ? messages.join(' ') : messages;
        return libelles[champ] ? `${libelles[champ]} : ${texte}` : texte;
      })
      .join('\n');
  }
}