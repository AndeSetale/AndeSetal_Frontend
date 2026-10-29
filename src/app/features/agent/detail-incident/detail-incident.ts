import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderAgent } from '../components/header-agent/header-agent';
import {
  LucideSparkles,
  LucideTrash2,
  LucideFlame,
  LucideMapPin,
} from '@lucide/angular';

import { IncidentService } from '../../../core/services/incident';
import { InterventionService } from '../../../core/services/intervention';
import { Incident } from '../../../core/models/incident';

@Component({
  selector: 'app-detail-incident',
  imports: [
  HeaderAgent,
  LucideSparkles,
  LucideTrash2,
  LucideFlame,
  LucideMapPin,
],
  templateUrl: './detail-incident.html',
  styleUrl: './detail-incident.css',
})
export class DetailIncident {

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly incidentService = inject(IncidentService);
  private readonly interventionService = inject(InterventionService);

  /**
   * Incident chargé depuis GET /api/incidents/:id/
   */
  readonly incident = signal<Incident | null>(null);

  readonly erreur = signal<string | null>(null);

  readonly prioriteLabel = computed(() => {
    const labels = {
      critique: 'CRITIQUE',
      urgent: 'URGENT',
      modere: 'MODÉRÉE',
      routine: 'ROUTINE',
    } as const;

    const incident = this.incident();
    return incident ? labels[incident.priorite] : '';
  });

  readonly confianceIA = computed(() =>
    this.incident()?.confianceIA ?? 0
  );

  readonly imageIncident = computed(() =>
    this.incident()?.image ?? null
  );

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.erreur.set('Incident introuvable.');
      return;
    }

    this.incidentService.getById(id).subscribe({
      next: incident => this.incident.set(incident),
      error: () => this.erreur.set("Impossible de charger l'incident."),
    });
  }

  /**
   * Ouvre l'intervention de l'agent liée à cet incident.
   */
  intervenir(): void {
    const incident = this.incident();

    if (!incident) {
      return;
    }

    this.interventionService.charger().subscribe(interventions => {
      const intervention = interventions.find(
        item => String(item.incidentId) === String(incident.id)
      );

      this.router.navigate(
        intervention
          ? ['/agent/interventions', intervention.id]
          : ['/agent/interventions']
      );
    });
  }
}
