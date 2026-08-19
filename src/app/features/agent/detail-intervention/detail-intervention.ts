import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { HeaderAgent } from '../components/header-agent/header-agent';

import {
  LucideMapPin,
  LucidePencil,
  LucideSend,
} from '@lucide/angular';

import { InterventionService } from '../../../core/services/intervention';
import { RapportEnvoiService } from '../../../core/services/rapport-envoi';

@Component({
  selector: 'app-detail-intervention',
  imports: [
    HeaderAgent,
    LucideMapPin,
    LucidePencil,
    LucideSend,
  ],
  templateUrl: './detail-intervention.html',
  styleUrl: './detail-intervention.css',
})
export class DetailIntervention {

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  private readonly interventionService =
    inject(InterventionService);

  private readonly rapportEnvoiService =
    inject(RapportEnvoiService);


  // ============================================================
  // ID
  // ============================================================

  readonly interventionId = computed(() =>
    this.route.snapshot.paramMap.get('id')
  );


  // ============================================================
  // INTERVENTION
  // ============================================================

  readonly intervention = computed(() => {

    const id = this.interventionId();

    if (!id) {
      return this.interventionService.interventions()[0];
    }

    return (
      this.interventionService.getById(id)
      ?? this.interventionService.interventions()[0]
    );

  });


  // ============================================================
  // PRIORITÉ
  // ============================================================

  readonly prioriteLabel = computed(() => {

    const labels = {
      critique: 'Critique',
      urgent: 'Urgent',
      modere: 'Modérée',
      routine: 'Routine',
    } as const;

    return labels[this.intervention().priorite];

  });


  // ============================================================
  // STATUT
  // ============================================================

  readonly statutLabel = computed(() => {

    const labels = {
      disponible: 'Disponible',
      assignee: 'Assignée',
      en_cours: 'En cours',
      terminee: 'Terminée',
      annulee: 'Annulée',
    } as const;

    return labels[this.intervention().statut];

  });


  // ============================================================
  // PROGRESSION
  // ============================================================

  readonly etapeProgression = computed(() => {

    switch (this.intervention().statut) {

      case 'disponible':
        return 0;

      case 'assignee':
        return 1;

      case 'en_cours':
        return 2;

      case 'terminee':
        return 3;

      case 'annulee':
        return 0;

      default:
        return 0;
    }

  });


  // ============================================================
  // PHOTOS
  // ============================================================

  readonly photoAvant = computed(() =>
    this.intervention().image ?? null
  );

  readonly photoApres = computed(() =>
    null
  );


  // ============================================================
  // ACTIONS
  // ============================================================

  /**
   * Envoie le rapport associé à l'intervention.
   *
   * Pour le moment :
   * l'envoi utilise RapportEnvoiService avec les données locales.
   *
   * TODO BACKEND :
   * RapportEnvoiService devra remplacer la logique locale
   * par un appel HttpClient vers l'API Django.
   *
   * Une fois l'envoi terminé, on navigue vers la page
   * de confirmation du rapport envoyé.
   */
  async envoyerRapport(): Promise<void> {

    const interventionId = this.interventionId();

    if (!interventionId) {
      console.error(
        "Impossible d'envoyer le rapport : ID de l'intervention manquant."
      );

      return;
    }

    /**
     * Pour le moment :
     * on utilise l'ID de l'intervention comme ID du rapport,
     * car les données locales du RapportService associent
     * le rapport à une intervention.
     *
     * TODO BACKEND :
     * Lors du branchement Django, utiliser l'identifiant
     * réel du rapport retourné par le backend.
     */
    const rapport = await this.rapportEnvoiService.envoyerRapport(
      interventionId
    );

    if (!rapport) {
      console.error(
        "Impossible d'envoyer le rapport : rapport introuvable."
      );

      return;
    }

    /**
     * Navigation vers la page de confirmation.
     *
     * TODO NAVIGATION :
     * La route pourra être adaptée si le parcours final
     * après l'envoi du rapport évolue.
     */
    await this.router.navigate([
      '/agent/rapport-envoye',
      rapport.id,
    ]);

  }


  /**
   * Modifie les détails de l'intervention.
   *
   * Pour le moment :
   * action temporaire en attendant le branchement
   * avec le backend.
   */
  modifierDetails(): void {

    console.log(
      "Modification de l'intervention :",
      this.intervention()
    );

  }

}
