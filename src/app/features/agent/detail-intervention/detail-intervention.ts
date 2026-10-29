import { Component, OnDestroy, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as L from 'leaflet';

import { HeaderAgent } from '../components/header-agent/header-agent';

import {
  LucideCamera,
  LucideMapPin,
  LucideSend,
} from '@lucide/angular';

import { InterventionService } from '../../../core/services/intervention';
import { Intervention } from '../../../core/models/intervention';

type CotePhoto = 'avant' | 'apres';

@Component({
  selector: 'app-detail-intervention',
  imports: [
    HeaderAgent,
    LucideCamera,
    LucideMapPin,
    LucideSend,
  ],
  templateUrl: './detail-intervention.html',
  styleUrl: './detail-intervention.css',
})
export class DetailIntervention implements OnDestroy {

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly interventionService = inject(InterventionService);

  readonly cotesPhoto: { cle: CotePhoto; titre: string }[] = [
    { cle: 'avant', titre: 'Photo Avant' },
    { cle: 'apres', titre: 'Photo Après' },
  ];

  /**
   * Intervention chargée depuis GET /api/interventions/:id/
   */
  readonly intervention = signal<Intervention | null>(null);

  readonly erreur = signal<string | null>(null);

  /** Message d'échec d'une action (démarrage / envoi du rapport) */
  readonly message = signal<string | null>(null);

  /** Une requête est en cours : boutons désactivés */
  readonly envoi = signal(false);

  /** Photos choisies par l'agent, pas encore envoyées */
  private readonly fichiers = signal<Partial<Record<CotePhoto, File>>>({});
  private readonly apercus = signal<Partial<Record<CotePhoto, string>>>({});

  private map?: L.Map;

  readonly statutLabel = computed(() => {
    const labels = {
      disponible: 'Disponible',
      assignee: 'Assignée',
      en_cours: 'En cours',
      terminee: 'Terminée',
      annulee: 'Annulée',
    } as const;

    const intervention = this.intervention();
    return intervention ? labels[intervention.statut] : '';
  });

  /**
   * Étapes : 1. arrivée sur site → 2. rapport photo → 3. résolution
   */
  readonly etapeProgression = computed<number>(() => {
    switch (this.intervention()?.statut) {
      case 'en_cours':
        return 2;
      case 'terminee':
        return 3;
      default:
        return 0;
    }
  });

  readonly photosPretes = computed(() => {
    const fichiers = this.fichiers();
    return !!fichiers.avant && !!fichiers.apres;
  });

  constructor() {
    this.charger();
  }

  ngOnDestroy(): void {
    this.map?.remove();
  }

  /** Aperçu local d'une photo choisie, sinon la photo déjà envoyée */
  apercu(cote: CotePhoto): string | undefined {
    const intervention = this.intervention();
    return this.apercus()[cote]
      ?? (cote === 'avant' ? intervention?.photoAvant : intervention?.photoApres);
  }

  choisirPhoto(cote: CotePhoto, event: Event): void {
    const fichier = (event.target as HTMLInputElement).files?.[0];

    if (!fichier) {
      return;
    }

    const ancien = this.apercus()[cote];
    if (ancien) {
      URL.revokeObjectURL(ancien);
    }

    this.fichiers.update(f => ({ ...f, [cote]: fichier }));
    this.apercus.update(a => ({ ...a, [cote]: URL.createObjectURL(fichier) }));
  }

  demarrer(): void {
    const intervention = this.intervention();

    if (!intervention) {
      return;
    }

    this.lancer(this.interventionService.demarrer(intervention.id), maj => {
      this.intervention.set(maj);
    });
  }

  envoyerRapport(): void {
    const intervention = this.intervention();
    const { avant, apres } = this.fichiers();

    if (!intervention || !avant || !apres) {
      return;
    }

    this.lancer(this.interventionService.envoyerRapport(intervention.id, avant, apres), () => {
      this.router.navigate(['/agent/rapport-envoye', intervention.id]);
    });
  }

  voirRapport(): void {
    this.router.navigate(['/agent/historique', this.intervention()?.id]);
  }

  voirIncident(): void {
    this.router.navigate(['/agent/incidents', this.intervention()?.incidentId]);
  }

  formaterDate(date?: string): string {
    if (!date) {
      return '—';
    }

    return new Date(date).toLocaleString('fr-FR', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  private charger(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.erreur.set('Intervention introuvable.');
      return;
    }

    this.interventionService.getById(id).subscribe({
      next: intervention => {
        this.intervention.set(intervention);
        // La carte est dans un @if : attendre son rendu
        setTimeout(() => this.initialiserCarte(intervention));
      },
      error: () => this.erreur.set("Impossible de charger l'intervention."),
    });
  }

  private lancer(requete: ReturnType<InterventionService['demarrer']>, succes: (maj: Intervention) => void): void {
    this.envoi.set(true);
    this.message.set(null);

    requete.subscribe({
      next: maj => {
        this.envoi.set(false);
        succes(maj);
      },
      error: erreur => {
        this.envoi.set(false);
        this.message.set(erreur?.error?.detail ?? "L'opération a échoué, veuillez réessayer.");
      },
    });
  }

  private initialiserCarte(intervention: Intervention): void {
    if (this.map || intervention.latitude == null || intervention.longitude == null) {
      return;
    }

    const position: L.LatLngExpression = [intervention.latitude, intervention.longitude];

    this.map = L.map('intervention-map', {
      center: position,
      zoom: 16,
      zoomControl: false,
      attributionControl: false,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(this.map);

    L.circleMarker(position, {
      radius: 9,
      color: '#ffffff',
      weight: 2,
      fillColor: '#004030',
      fillOpacity: 1,
    }).addTo(this.map);
  }
}
