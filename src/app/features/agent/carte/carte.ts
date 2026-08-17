import { AfterViewInit, Component } from '@angular/core';
import * as L from 'leaflet';
import { HeaderAgent } from '../components/header-agent/header-agent';

@Component({
  selector: 'app-carte',
  imports: [HeaderAgent],
  templateUrl: './carte.html',
  styleUrl: './carte.css',
})
export class Carte implements AfterViewInit {

  private map!: L.Map;
  retour(): void {
  window.history.back();
}

  ngAfterViewInit(): void {
    this.initialiserCarte();
    this.ajouterMarqueurs();
  }

  /**
   * Initialise la carte Leaflet
   */
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


  /**
   * Ajoute les signalements visibles sur la carte
   */
  private ajouterMarqueurs(): void {

    // Signalement critique
    this.ajouterMarqueur(
      [14.7167, -17.4677],
      '#ef4444'
    );


    // Deuxième signalement
    this.ajouterMarqueur(
      [14.7205, -17.4625],
      '#7c3aed'
    );


    // Troisième signalement
    this.ajouterMarqueur(
      [14.7135, -17.4705],
      '#004030'
    );

  }


  /**
   * Crée un marqueur circulaire personnalisé
   */
  private ajouterMarqueur(
    position: L.LatLngExpression,
    couleur: string
  ): void {

    const icone = L.divIcon({

      className: '',

      html: `
        <div
          style="
            width: 16px;
            height: 16px;
            border-radius: 9999px;
            background: ${couleur};
            border: 2px solid white;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
          "
        ></div>
      `,

      iconSize: [16, 16],
      iconAnchor: [8, 8],

    });

    L.marker(position, {
      icon: icone,
    }).addTo(this.map);

  }


}