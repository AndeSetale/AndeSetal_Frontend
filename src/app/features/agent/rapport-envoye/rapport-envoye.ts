import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import {
  LucideX,
  LucideCheck,
  LucideCircleCheck,
  LucideMapPin,
  LucideClock3,
  LucideCopy,
  LucideHouse,
} from '@lucide/angular';

import { Rapport } from '../../../core/models/rapport';
import { RapportService } from '../../../core/services/rapport';

@Component({
  selector: 'app-rapport-envoye',
  imports: [
    LucideX,
    LucideCheck,
    LucideCircleCheck,
    LucideMapPin,
    LucideClock3,
    LucideCopy,
    LucideHouse,
  ],
  templateUrl: './rapport-envoye.html',
  styleUrl: './rapport-envoye.css',
})
export class RapportEnvoye implements OnInit {

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly rapportService = inject(RapportService);

  /**
   * ID de l'intervention récupéré depuis l'URL.
   */
  readonly interventionId = signal<number | null>(null);

  /**
   * Rapport récupéré depuis le backend.
   */
  readonly rapport = signal<Rapport | null>(null);

  /**
   * État de chargement.
   */
  readonly isLoading = signal(false);

  /**
   * Message d'erreur.
   */
  readonly errorMessage = signal<string | null>(null);

  /**
   * Numéro de suivi.
   *
   * Pour le moment le backend ne fournit pas encore
   * de numéro de suivi.
   *
   * Il est donc généré côté frontend à partir de
   * l'identifiant du rapport.
   */
  readonly numeroSuivi = signal<string>('');

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.errorMessage.set(
        'Identifiant de l’intervention introuvable.'
      );
      return;
    }

    const interventionId = Number(id);

    if (Number.isNaN(interventionId)) {
      this.errorMessage.set(
        'Identifiant de l’intervention invalide.'
      );
      return;
    }

    this.interventionId.set(interventionId);

    this.chargerRapport(interventionId);
  }

  /**
   * Récupère le rapport envoyé depuis le backend.
   */
  private chargerRapport(interventionId: number): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.rapportService
      .getByIntervention(interventionId)
      .subscribe({
        next: (rapport) => {
          this.rapport.set(rapport);

          /*
           * Le backend ne fournit pas encore de numéro
           * de suivi.
           *
           * On utilise donc l'ID du rapport.
           *
           * Exemple :
           * rapport.id = 4402
           * => REP-2024-4402
           */
          this.numeroSuivi.set(
            `REP-2024-${rapport.id}`
          );

          this.isLoading.set(false);
        },

        error: (error) => {
          console.error(
            'Erreur lors du chargement du rapport envoyé :',
            error
          );

          this.isLoading.set(false);

          this.errorMessage.set(
            'Impossible de récupérer le rapport envoyé.'
          );
        },
      });
  }

  /**
   * Copie le numéro de suivi dans le presse-papiers.
   */
  copierNumeroSuivi(): void {
    const numero = this.numeroSuivi();

    if (!numero) {
      return;
    }

    navigator.clipboard
      .writeText(numero)
      .catch((error) => {
        console.error(
          'Impossible de copier le numéro de suivi :',
          error
        );
      });
  }

  /**
   * Retour à l'accueil de l'agent.
   */
  retourAccueil(): void {
    this.router.navigate(['/agent']);
  }

  /**
   * Ferme la page du rapport et retourne à l'accueil.
   */
  fermer(): void {
    this.retourAccueil();
  }
}