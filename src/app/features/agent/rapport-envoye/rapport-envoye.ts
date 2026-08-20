import { Component, computed, inject } from '@angular/core';
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

import { RapportEnvoiService } from '../../../core/services/rapport-envoi';

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

  private readonly rapportEnvoiService =
    inject(RapportEnvoiService);

  private readonly route =
    inject(ActivatedRoute);

  private readonly router =
    inject(Router);


  // ============================================================
  // ID
  // ============================================================

  /**
   * ID de l'intervention récupéré depuis l'URL.
   *
   * Exemple :
   * /agent/rapport-envoye/1
   *
   * TODO BACKEND :
   * Selon la structure définitive de l'API Django,
   * cette route pourra éventuellement utiliser directement
   * l'identifiant du rapport.
   */
  readonly interventionId = this.route.snapshot.paramMap.get('id');


  // ============================================================
  // RAPPORT ENVOYÉ
  // ============================================================

  /**
   * Rapport envoyé actuellement affiché.
   *
   * Pour le moment :
   * les données sont récupérées depuis RapportEnvoiService.
   *
   * TODO BACKEND :
   * RapportEnvoiService récupérera les données depuis
   * l'API Django sans modifier le fonctionnement du composant.
   */
  readonly rapportEnvoye = computed(() => {

    const interventionId = this.interventionId;

    if (!interventionId) {
      return null;
    }

    return this.rapportEnvoiService.getByInterventionId(
      interventionId
    );

  });


  // ============================================================
  // NUMÉRO DE SUIVI
  // ============================================================

  /**
   * Numéro de suivi affiché sur la page.
   */
  readonly numeroSuivi = computed(() =>
    this.rapportEnvoye()?.numeroSuivi ?? ''
  );


  // ============================================================
  // DATE D'ENVOI
  // ============================================================

  /**
   * Date et heure d'envoi formatées pour l'affichage.
   *
   * TODO BACKEND :
   * La date sera fournie par Django après l'envoi réel
   * du rapport.
   */
  readonly dateEnvoi = computed(() => {

    const date = this.rapportEnvoye()?.dateEnvoi;

    if (!date) {
      return '';
    }

    const dateObj = new Date(date);

    const heure = dateObj.toLocaleTimeString(
      'fr-FR',
      {
        hour: '2-digit',
        minute: '2-digit',
      }
    );

    return `Aujourd'hui à ${heure}`;
  });


  // ============================================================
  // ACTIONS
  // ============================================================

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
