import { Component, computed, inject, signal } from '@angular/core';
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

import { RapportService } from '../../../core/services/rapport';
import { Rapport } from '../../../core/models/rapport';

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
export class RapportEnvoye {

  private readonly rapportService = inject(RapportService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  /**
   * /agent/rapport-envoye/:id — id de l'intervention dont le rapport vient d'être envoyé
   */
  readonly rapportEnvoye = signal<Rapport | null>(null);

  readonly numeroSuivi = computed(() =>
    this.rapportEnvoye()?.numeroSuivi ?? ''
  );

  readonly dateEnvoi = computed(() => {
    const date = this.rapportEnvoye()?.dateEnvoi;

    if (!date) {
      return '';
    }

    const dateObj = new Date(date);
    const heure = dateObj.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

    return dateObj.toDateString() === new Date().toDateString()
      ? `Aujourd'hui à ${heure}`
      : `${dateObj.toLocaleDateString('fr-FR')} à ${heure}`;
  });

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.rapportService.getByInterventionId(id).subscribe(rapport =>
        this.rapportEnvoye.set(rapport)
      );
    }
  }

  /**
   * Ferme la page de confirmation.
   *
   * Pour le moment :
   * retour vers la liste des interventions.
   *
   * TODO NAVIGATION :
   * Adapter la destination lorsque le parcours définitif
   * après l'envoi du rapport sera validé.
   */
  fermer(): void {

    this.router.navigate([
      '/agent/interventions',
    ]);

  }


  /**
   * Retour à l'accueil.
   *
   * Pour le moment :
   * retour vers la liste des interventions.
   *
   * TODO NAVIGATION :
   * Remplacer par la route réelle de l'accueil de l'agent
   * lorsque la navigation définitive sera mise en place.
   */
  retourAccueil(): void {

    this.router.navigate([
      '/agent/interventions',
    ]);

  }


  /**
   * Copie le numéro de suivi.
   *
   * Pour le moment :
   * utilisation de l'API Clipboard du navigateur.
   *
   * TODO BACKEND :
   * Le numéro de suivi devra provenir du backend
   * après l'envoi réel du rapport.
   */
  async copierNumeroSuivi(): Promise<void> {

    const numero = this.numeroSuivi();

    if (!numero) {
      return;
    }

    try {

      await navigator.clipboard.writeText(numero);

      console.log(
        'Numéro de suivi copié',
        numero
      );

    } catch (error) {

      console.error(
        'Impossible de copier le numéro de suivi',
        error
      );

    }

  }

}
