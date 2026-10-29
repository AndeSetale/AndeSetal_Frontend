import { AfterViewInit, Component, OnDestroy, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import * as L from 'leaflet';

import { HeaderAgent } from '../components/header-agent/header-agent';
import { InterventionService } from '../../../core/services/intervention';
import { Intervention } from '../../../core/models/intervention';

const COULEURS_PRIORITE = {
  critique: '#ef4444',
  urgent: '#f97316',
  modere: '#7c3aed',
  routine: '#004030',
} as const;

@Component({
  selector: 'app-carte',
  standalone: true,
  imports: [HeaderAgent],
  templateUrl: './carte.html',
  styleUrl: './carte.css',
})
export class Carte implements AfterViewInit, OnDestroy {

  private readonly interventionService = inject(InterventionService);
  private readonly router = inject(Router);

  /** Intervention affichée dans la fiche du bas (la plus urgente par défaut) */
  readonly selection = signal<Intervention | null>(null);

  readonly libellePriorite = computed(() => {
    const libelles = { critique: 'Critique', urgent: 'Urgent', modere: 'Modéré', routine: 'Routine' } as const;
    const selection = this.selection();
    return selection ? libelles[selection.priorite] : '';
  });

  ouvrirSelection(): void {
    const selection = this.selection();
    if (selection) {
      this.router.navigate(['/agent/interventions', selection.id]);
    }
  }

  private map!: L.Map;


  // ============================================================
  // INITIALISATION
  // ============================================================

  ngAfterViewInit(): void {
    this.initialiserCarte();
    this.ajouterMarqueurs();
  }


  // ============================================================
  // NETTOYAGE
  // ============================================================

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
  }


  // ============================================================
  // CARTE LEAFLET
  // ============================================================

  private initialiserCarte(): void {

    this.map = L.map('map', {
      center: [14.668, -17.437], // Dakar Plateau
      zoom: 14,
      zoomControl: false,
      attributionControl: true,
    });


    L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19,
      }
    ).addTo(this.map);
  }


  // ============================================================
  // MARQUEURS
  // ============================================================

  private ajouterMarqueurs(): void {
    this.interventionService.charger().subscribe(interventions => {
      const aTraiter = interventions.filter(
        (i): i is Intervention & { latitude: number; longitude: number } =>
          i.statut !== 'terminee' && i.latitude != null && i.longitude != null
      );

      aTraiter.forEach(intervention =>
        this.ajouterMarqueur(
          [intervention.latitude, intervention.longitude],
          COULEURS_PRIORITE[intervention.priorite],
          intervention,
        )
      );

      const ordre = { critique: 0, urgent: 1, modere: 2, routine: 3 } as const;
      this.selection.set(
        [...aTraiter].sort((a, b) => ordre[a.priorite] - ordre[b.priorite])[0] ?? null
      );

      if (aTraiter.length) {
        this.map.fitBounds(
          L.latLngBounds(aTraiter.map(i => [i.latitude, i.longitude] as L.LatLngTuple)),
          { padding: [40, 40], maxZoom: 16 },
        );
      }
    });
  }

  private ajouterMarqueur(
    position: L.LatLngExpression,
    couleur: string,
    intervention: Intervention,
  ): void {

    const icone = L.divIcon({

      className: '',

      html: `
        <div
          style="
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: ${couleur};
            border: 2px solid white;
            border-radius: 50%;
            box-shadow: 0 2px 8px rgba(0,0,0,0.30);
            box-sizing: border-box;
          "
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8 1.5
                 C5.5 1.5 3.5 3.5 3.5 6
                 C3.5 9.2 8 14 8 14
                 C8 14 12.5 9.2 12.5 6
                 C12.5 3.5 10.5 1.5 8 1.5Z"
              fill="white"
            />

            <circle
              cx="8"
              cy="6"
              r="1.8"
              fill="${couleur}"
            />
          </svg>
        </div>
      `,

      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });


    L.marker(position, {
      icon: icone,
      title: `${intervention.titre} — ${intervention.adresse}`,
    })
      .on('click', () => this.selection.set(intervention))
      .addTo(this.map);
  }
}