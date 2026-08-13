import { AfterViewInit, Component } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-carte',
  imports: [],
  templateUrl: './carte.html',
  styleUrl: './carte.css',
})
export class Carte implements AfterViewInit {

  private map!: L.Map;

  ngAfterViewInit(): void {
    this.initialiserCarte();
  }

  private initialiserCarte(): void {
    this.map = L.map('map', {
      center: [14.7167, -17.4677],
      zoom: 13,
      zoomControl: false,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(this.map);
  }
}