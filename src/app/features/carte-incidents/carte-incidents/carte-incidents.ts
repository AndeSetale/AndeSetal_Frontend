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
import { HttpClient } from '@angular/common/http';

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

private readonly http = inject(HttpClient);
private plateauLayer?: L.GeoJSON;

  private incidents: Incident[] = [];

  private incidentService = inject(IncidentService);

  private map!: L.Map;

  private markers = new Map<number, L.Marker>();

 private chargerPerimetre(): void {

  console.log('Chargement du périmètre...');

  this.http
    .get<any>('assets/plateau_polygon.geojson')
    .subscribe({

      next: (data) => {

        console.log('GeoJSON reçu :', data);

        const geometry = Array.isArray(data)
          ? data[0]?.geojson
          : data;

        if (!geometry) {
          console.error('❌ Aucune géométrie trouvée dans le GeoJSON');
          return;
        }

        console.log('Géométrie :', geometry);

        this.plateauLayer = L.geoJSON(geometry, {

         style: {
  color: '#0F766E',
  weight: 2,
  opacity: 0.55,
  fillColor: '#14B8A6',
  fillOpacity: 0.09
}

        }).addTo(this.map);

        console.log('✅ Périmètre Dakar-Plateau ajouté');

        const bounds = this.plateauLayer.getBounds();

        console.log('Bounds :', bounds);

        this.map.fitBounds(bounds, {
          padding: [30, 30]
        });
      },

      error: (error) => {

        console.error(
          ' Erreur chargement GeoJSON :',
          error
        );

      }

    });
}
 ngAfterViewInit(): void {

  this.map = L.map(this.mapContainer.nativeElement, {
    center: [14.667317, -17.437966],
    zoom: 19,
    zoomControl: false,
  });

  L.tileLayer(
    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19,
    }
  ).addTo(this.map);

  // Charger le périmètre
  this.chargerPerimetre();

  // Charger les incidents
  this.incidentService.getIncidentsCarte().subscribe((incidents) => {

    this.incidents = incidents;

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
    incident.numericId,
    marker
  );
}
  private getIcon(incident: Incident): L.DivIcon {

     let couleur = '#8A8A8A';

  // Statut résolu = vert
  if (incident.statut === 'RESOLU') {
    couleur = '#2F6F4E';
  }

  // Sinon couleur selon l'urgence
  else if (incident.urgence === 'CRITIQUE') {
    couleur = '#D64545';
  }

  else if (incident.urgence === 'ELEVE') {
    couleur = '#F97316';
  }

  else if (incident.urgence === 'MODERE') {
    couleur = '#E0A82E';
  }

  else if (incident.urgence === 'ROUTINE') {
    couleur = 'green';
  }

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
  this.markers.forEach(marker => {
    this.map.removeLayer(marker);
  });

  this.markers.clear();

  // Normalisation
  const urgence = filtres.urgence.toUpperCase();
  const statut = filtres.statut.toUpperCase();

  const incidentsFiltres = this.incidents.filter(incident => {

    // =========================
    // URGENCE
    // =========================
    const urgenceOk =
      filtres.urgence === 'toutes' ||
      incident.urgence === urgence;


    // =========================
    // STATUT
    // =========================
    const statutOk =
      filtres.statut === 'tous' ||
      incident.statut === statut;


    // =========================
    // TYPE
    // =========================
    let typeOk = true;

    if (filtres.type !== 'tous') {

      switch (filtres.type) {

        case 'depot_sauvage':
          typeOk = incident.type === 'Dépôt sauvage de déchets';
          break;

        case 'dechets_plastiques':
          typeOk =
            incident.type.toLowerCase().includes('plastique');
          break;

        case 'egouts_bouches':
          typeOk =
            incident.type.toLowerCase().includes('canaux') ||
            incident.type.toLowerCase().includes('égout');
          break;

        default:
          typeOk = true;
      }
    }


    return (
      typeOk &&
      urgenceOk &&
      statutOk
    );
  });

  console.log(
    'Incidents après filtrage :',
    incidentsFiltres
  );


  // Ajouter les nouveaux marqueurs
  incidentsFiltres.forEach(incident => {
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