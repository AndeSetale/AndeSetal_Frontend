import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnDestroy,
  inject,
  signal
} from '@angular/core';

import * as L from 'leaflet';

import {
  Incident,
  IncidentService
} from '../../../core/services/incident.service';
import { FiltresIncidents, FiltresIncidentsComponent } from "../../incidents/components/filtres-incidents/filtres-incidents";
import {  PopupIncidentComponent } from '../../incidents/components/popup-incident/popup-incident';

@Component({
  selector: 'app-carte-incidents',
  standalone: true,
  imports: [FiltresIncidentsComponent, PopupIncidentComponent],
  templateUrl: './carte-incidents.html',
  styleUrl: './carte-incidents.css',
})
export class CarteIncidentsComponent implements AfterViewInit, OnDestroy {

  @ViewChild('mapContainer', { static: true })
  mapContainer!: ElementRef<HTMLDivElement>;
incidentSelectionne = signal<Incident | null>(null);

  private incidents: Incident[] = [];

  private incidentService = inject(IncidentService);

  private map!: L.Map;

  private markers = new Map<number, L.Marker>();

  ngAfterViewInit(): void {

    // 1. Création de la carte
    this.map = L.map(this.mapContainer.nativeElement, {
      center: [14.6928, -17.4467],
      zoom: 14,
      zoomControl: false,
    });

    // 2. Fond de carte OpenStreetMap
    L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19,
      }
    ).addTo(this.map);

    // 3. Récupération des incidents
    this.incidentService.getIncidents().subscribe((incidents) => {

      this.incidents = incidents;

      // 4. Ajouter chaque incident sur la carte
      incidents.forEach((incident) => {
        this.addMarker(incident);
      });

    });
  }

 private addMarker(incident: Incident): void {

  const marker = L.marker(
    [
      incident.latitude,
      incident.longitude
    ],
    {
      icon: this.getIcon(incident),
    }
  ).addTo(this.map);

   marker.bindTooltip(
    `
      <div class="incident-tooltip">
        <strong>${incident.titre}</strong>
        <br>
        <span>${incident.adresse}</span>
      </div>
    `,
    {
      direction: 'top',
      offset: [0, -15],
      opacity: 1,
      className: 'incident-tooltip-container',
    }
  );

  

  // Clic sur le pin
  marker.on('click', () => {
    this.onPinClick(incident);
  });
  
  this.markers.set(
    incident.id,
    marker
  );
}
  private getIcon(incident: Incident): L.DivIcon {

    const couleur =
      incident.statut === 'resolu'
        ? '#2F6F4E'
        : incident.urgence === 'critique'
          ? '#D64545'
          : incident.urgence === 'modere'
            ? '#E0A82E'
            : '#8A8A8A';

    return L.divIcon({
      className: 'incident-marker',

      html: `
        <span
          class="incident-pin"
          style="background:${couleur}">
        </span>
      `,

      iconSize: [22, 22],

      iconAnchor: [11, 22],
    });
  }

  onFiltresChange(filtres: FiltresIncidents): void {
  console.log('Filtres reçus :', filtres);

  // Supprimer les anciens marqueurs
  this.markers.forEach((marker) => {
    this.map.removeLayer(marker);
  });

  this.markers.clear();

  // Filtrer les incidents
  const incidentsFiltres = this.incidents.filter((incident) => {

    const typeOk =
      filtres.type === 'tous' ||
      incident.type === filtres.type;

    const urgenceOk =
      filtres.urgence === 'toutes' ||
      incident.urgence === filtres.urgence;

    const statutOk =
      filtres.statut === 'tous' ||
      incident.statut === filtres.statut;

    return typeOk && urgenceOk && statutOk;
  });

  // Ajouter uniquement les incidents filtrés
  incidentsFiltres.forEach((incident) => {
    this.addMarker(incident);
  });
}



  onPinClick(incident: Incident): void {
  console.log('Pin cliqué :', incident);

  this.incidentSelectionne.set(incident);
}
  

 fermerPopup(): void {
  this.incidentSelectionne.set(null);
}

  ngOnDestroy(): void {
    this.map?.remove();
  }
}