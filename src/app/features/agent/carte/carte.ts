import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import * as L from 'leaflet';

import { HeaderAgent } from '../components/header-agent/header-agent';

@Component({
  selector: 'app-carte',
  standalone: true,
  imports: [HeaderAgent],
  templateUrl: './carte.html',
  styleUrl: './carte.css',
})
export class Carte implements AfterViewInit, OnDestroy {

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
      center: [14.7167, -17.4677],
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

    // Dépôt sauvage — rouge
    this.ajouterMarqueur(
      [14.7167, -17.4677],
      '#ef4444'
    );


    // Déchet — violet
    this.ajouterMarqueur(
      [14.7205, -17.4625],
      '#7c3aed'
    );


    // Voirie / autre — vert foncé
    this.ajouterMarqueur(
      [14.7135, -17.4705],
      '#004030'
    );
  }


  // ============================================================
  // CRÉATION D'UN MARQUEUR
  // ============================================================

  private ajouterMarqueur(
    position: L.LatLngExpression,
    couleur: string
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
    }).addTo(this.map);
  }
}