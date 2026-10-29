import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import {
  LucideCircleCheck,
  LucideMapPin,
  LucideCamera,
  LucideUsersRound,
  LucideInbox,
  LucideSend,
  LucideImage,
  LucideEye,
  LucideArchive,
  LucideShare2,
} from '@lucide/angular';

import { RapportService } from '../../../core/services/rapport';
import { Rapport } from '../../../core/models/rapport';
import { HeaderAgent } from '../components/header-agent/header-agent';

@Component({
  selector: 'app-historique-rapport',
  imports: [
    HeaderAgent,
    LucideCircleCheck,
    LucideMapPin,
    LucideCamera,
    LucideUsersRound,
    LucideInbox,
    LucideSend,
    LucideImage,
    LucideEye,
    LucideArchive,
    LucideShare2,
  ],
  templateUrl: './historique-rapport.html',
  styleUrl: './historique-rapport.css',
})
export class HistoriqueRapport {

  private readonly rapportService = inject(RapportService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  /**
   * Rapport de l'intervention /agent/historique/:id (id = intervention)
   */
  readonly rapport = signal<Rapport | null>(null);

  readonly chargement = signal(true);

  readonly nombreEvenements = computed(() =>
    this.rapport()?.evenements.length ?? 0
  );

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.chargement.set(false);
      return;
    }

    this.rapportService.getByInterventionId(id).subscribe({
      next: rapport => {
        this.rapport.set(rapport);
        this.chargement.set(false);
      },
      error: () => this.chargement.set(false),
    });
  }

  retour(): void {
    this.router.navigate(['/agent/interventions']);
  }

  /** Le rapport est déjà archivé côté serveur : retour à la liste */
  archiver(): void {
    this.retour();
  }

  partager(): void {
    this.partagerRapport();
  }

  /** Ouvre les photos avant / après dans un nouvel onglet */
  voirPhotos(): void {
    this.rapport()?.photos.forEach(url => window.open(url, '_blank'));
  }

  /** Partage natif du téléphone, sinon copie du numéro de suivi */
  async partagerRapport(): Promise<void> {
    const rapport = this.rapport();

    if (!rapport) {
      return;
    }

    const texte = `Rapport ${rapport.numeroSuivi} — ${rapport.titre}, ${rapport.adresse}`;

    try {
      if (navigator.share) {
        await navigator.share({ title: 'Rapport d’intervention', text: texte });
      } else {
        await navigator.clipboard.writeText(texte);
      }
    } catch {
      // Partage annulé par l'utilisateur
    }
  }
}
