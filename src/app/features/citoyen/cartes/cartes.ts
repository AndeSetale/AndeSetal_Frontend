import { Component, AfterViewInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import * as L from 'leaflet';
import { IncidentService, Incident } from '../../../core/services/incident.service';

@Component({
  selector: 'app-cartes',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './cartes.html',
  styleUrl: './cartes.css',
})
export class CartesComponent implements AfterViewInit, OnDestroy {
  private router = inject(Router);
  private incidentService = inject(IncidentService);

  map!: L.Map;
  searchQuery: string = '';
  activeFilter: 'tous' | 'dechets' | 'canaux' | 'voirie' = 'tous';
  
  incidents: Incident[] = [];
  filteredIncidents: Incident[] = [];
  selectedIncident: Incident | null = null;
  private markersMap: Map<number, L.Marker> = new Map();

  ngAfterViewInit(): void {
    this.initMap();
    this.loadIncidents();
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
  }

  private initMap(): void {
    // Coordonnées du Dakar Plateau / Médina (14.6937, -17.4441)
    this.map = L.map('map-container', {
      zoomControl: false,
    }).setView([14.6937, -17.4441], 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(this.map);
  }

  private loadIncidents(): void {
    this.incidentService.getIncidents().subscribe((data) => {
      this.incidents = data;
      this.applyFilters();
      if (this.incidents.length > 0) {
        this.selectIncident(this.incidents[0]);
      }
    });
  }

  setFilter(filter: 'tous' | 'dechets' | 'canaux' | 'voirie'): void {
    this.activeFilter = filter;
    this.applyFilters();
  }

  applyFilters(): void {
    const query = this.searchQuery.toLowerCase().trim();
    this.filteredIncidents = this.incidents.filter((inc) => {
      const matchCategory =
        this.activeFilter === 'tous' ||
        (this.activeFilter === 'dechets' && (inc.type === 'depot_sauvage' || inc.type === 'dechets_plastiques' || inc.type === 'ordures_menageres')) ||
        (this.activeFilter === 'canaux' && inc.type === 'egouts_bouches') ||
        (this.activeFilter === 'voirie' && inc.type === 'autre');

      const matchSearch =
        !query ||
        inc.titre.toLowerCase().includes(query) ||
        inc.adresse.toLowerCase().includes(query);

      return matchCategory && matchSearch;
    });

    this.updateMapMarkers();
  }

  private updateMapMarkers(): void {
    // Effacer les anciens marqueurs
    this.markersMap.forEach((marker) => marker.remove());
    this.markersMap.clear();

    this.filteredIncidents.forEach((inc) => {
      // Icône personnalisée stylisée
      const isSelected = this.selectedIncident?.id === inc.id;
      const color = inc.urgence === 'critique' ? '#ef4444' : inc.urgence === 'modere' ? '#f59e0b' : '#9333ea';
      
      const customIcon = L.divIcon({
        className: 'custom-leaflet-marker',
        html: `
          <div style="
            width: ${isSelected ? '32px' : '24px'};
            height: ${isSelected ? '32px' : '24px'};
            background-color: ${color};
            border: 3px solid white;
            border-radius: 50%;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s ease;
          ">
            <div style="width: 8px; height: 8px; background: white; border-radius: 50%;"></div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const marker = L.marker([inc.latitude, inc.longitude], { icon: customIcon }).addTo(this.map);
      marker.on('click', () => {
        this.selectIncident(inc);
      });

      this.markersMap.set(inc.id, marker);
    });
  }

  selectIncident(incident: Incident): void {
    this.selectedIncident = incident;
    this.map.panTo([incident.latitude, incident.longitude], { animate: true });
    this.updateMapMarkers();
  }

  recenterMap(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          this.map.setView([lat, lng], 16, { animate: true });
        },
        () => {
          this.map.setView([14.6937, -17.4441], 15, { animate: true });
        }
      );
    } else {
      this.map.setView([14.6937, -17.4441], 15, { animate: true });
    }
  }

  viewDetail(incident: Incident): void {
    this.router.navigate(['/dashboard/map/incidents', incident.id]);
  }
}
