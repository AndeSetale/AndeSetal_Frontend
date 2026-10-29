import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HeaderAgent } from '../components/header-agent/header-agent';

import {
  LucideCircleCheck,
  LucideClock3,
  LucideLogOut,
} from '@lucide/angular';

import { AgentDetail, AgentService } from '../../../core/services/agent.service';
import { Auth } from '../../../core/services/auth';
import { InterventionService } from '../../../core/services/intervention';
import { urlMedia } from '../../../core/utils/media';

@Component({
  selector: 'app-profil',
  imports: [
    RouterLink,
    LucideCircleCheck,
    LucideClock3,
    LucideLogOut,
    HeaderAgent,
  ],
  templateUrl: './profil.html',
  styleUrl: './profil.css',
})
export class Profil {

  private readonly agentService = inject(AgentService);
  private readonly interventionService = inject(InterventionService);
  private readonly auth = inject(Auth);

  /** Profil + indicateurs de l'agent connecté (GET /api/agents/me/) */
  private readonly profil = signal<AgentDetail | null>(null);

  constructor() {
    this.agentService.getMonProfil().subscribe(profil => this.profil.set(profil));
    this.interventionService.charger().subscribe();
  }

  get agent() {
    const profil = this.profil();
    const nom = profil?.nom_complet ?? '';

    return {
      nom: nom || 'Agent',
      initiale: (nom.charAt(0) || 'A').toUpperCase(),
      role: profil?.departement || 'Agent de terrain',
      photo: urlMedia(profil?.photo_profil),
      disponible: profil?.disponible ?? false,
    };
  }

  get performance() {
    const profil = this.profil();
    const ponctualite = profil?.ponctualite ?? 0;

    return {
      tachesResolues: profil?.taches_resolues_semaine ?? 0,
      // Objectif défini par l'admin ; à défaut, le nombre d'interventions assignées
      objectifTaches: profil?.objectif_hebdo || profil?.interventions_total || 0,
      ponctualite,
      messagePonctualite:
        !profil?.interventions_terminees ? 'Pas encore d’intervention terminée'
          : ponctualite >= 90 ? 'Excellent travail'
          : ponctualite >= 70 ? 'Bon rythme'
          : 'Des délais à améliorer',
    };
  }

  get interventionsRecentes() {
    return [...this.interventionService.interventions()]
      .sort((a, b) => (b.dateAssignation ?? '').localeCompare(a.dateAssignation ?? ''))
      .slice(0, 3)
      .map(intervention => ({
        id: intervention.id,
        titre: intervention.adresse,
        description: intervention.titre,
        image: intervention.image,
        statut: intervention.statut === 'terminee' ? 'Terminé'
          : intervention.statut === 'en_cours' ? 'En cours'
          : 'À démarrer',
        date: intervention.dateAssignation
          ? new Date(intervention.dateAssignation).toLocaleString('fr-FR', {
              day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit',
            })
          : '',
      }));
  }

  get pourcentageTachesResolues(): number {
    if (this.performance.objectifTaches <= 0) {
      return 0;
    }

    return Math.min(
      100,
      (this.performance.tachesResolues / this.performance.objectifTaches) * 100
    );
  }

  toggleDisponibilite(): void {
    this.agentService
      .changerDisponibilite(!this.agent.disponible)
      .subscribe(profil => this.profil.set(profil));
  }

  deconnecter(): void {
    this.auth.deconnecter();
  }
}
