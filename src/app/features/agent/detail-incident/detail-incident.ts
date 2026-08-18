import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { HeaderAgent } from '../components/header-agent/header-agent';

import {
  LucideSparkles,
  LucideTrash2,
  LucideFlame,
  LucideMapPin,
  LucideInfo,
  LucideSend,
} from '@lucide/angular';


import { IncidentService } from '../../../core/services/incident';

@Component({
  selector: 'app-detail-incident',
  imports: [
  HeaderAgent,
  LucideSparkles,
  LucideTrash2,
  LucideFlame,
  LucideMapPin,
  LucideInfo,
  LucideSend,
],

  templateUrl: './detail-incident.html',
  styleUrl: './detail-incident.css',
})
export class DetailIncident {

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly incidentService = inject(IncidentService);


  // ============================================================
  // ID DE L'INCIDENT
  // ============================================================

  readonly incidentId = computed(() =>
    this.route.snapshot.paramMap.get('id')
  );


  // ============================================================
  // INCIDENT
  // ============================================================

  readonly incident = computed(() => {

    const id = this.incidentId();

    if (!id) {
      return this.incidentService.incidents()[0];
    }

    return (
      this.incidentService.getById(id)
      ?? this.incidentService.incidents()[0]
    );

  });


  // ============================================================
  // PRIORITÉ
  // ============================================================

  readonly prioriteLabel = computed(() => {

    const labels = {
      critique: 'CRITIQUE',
      urgent: 'URGENT',
      modere: 'MODÉRÉE',
      routine: 'ROUTINE',
    } as const;

    return labels[this.incident().priorite];

  });


  // ============================================================
  // SCORE DE CONFIANCE IA
  // ============================================================

  readonly confianceIA = computed(() =>
    this.incident().confianceIA ?? 0
  );


  // ============================================================
  // IMAGE
  // ============================================================

  readonly imageIncident = computed(() =>
    this.incident().image ?? null
  );


  // ============================================================
  // ACTIONS
  // ============================================================

  /**
   * Lance le parcours d'intervention pour l'incident
   * actuellement affiché.
   *
   * Pour le moment :
   * navigation vers la page de détail de l'intervention
   * en utilisant l'ID de l'incident.
   *
   * TODO BACKEND :
   * Lors du branchement Django, cette action devra
   * probablement créer ou récupérer l'intervention
   * associée à cet incident avant de naviguer vers
   * son détail.
   */
  intervenir(): void {

    const incident = this.incident();

    console.log(
      'Intervention sur l’incident :',
      incident
    );

    /*
     * TODO BACKEND :
     *
     * Une fois l'API Django branchée :
     *
     * 1. Envoyer l'ID de l'incident au backend.
     * 2. Créer ou récupérer l'intervention associée.
     * 3. Récupérer l'ID de l'intervention.
     * 4. Naviguer vers :
     *
     * /agent/interventions/:id
     *
     * Pour le moment, cette navigation sera faite
     * directement avec l'ID de l'incident.
     */

    this.router.navigate([
      '/agent/interventions',
      incident.id,
    ]);

  }

}
