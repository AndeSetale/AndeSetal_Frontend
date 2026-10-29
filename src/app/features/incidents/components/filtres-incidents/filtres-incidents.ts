import { Component, EventEmitter, Output } from '@angular/core';

export interface FiltresIncidents {
  type: string;
  urgence: string;
  statut: string;
}

@Component({
  selector: 'app-filtres-incidents',
  standalone: true,
  imports: [],
  templateUrl: './filtres-incidents.html',
  styleUrl: './filtres-incidents.css',
})
export class FiltresIncidentsComponent {

  type = 'tous';
  urgence = 'toutes';
  statut = 'tous';

  @Output()
  filtresChange = new EventEmitter<FiltresIncidents>();

  appliquerFiltres(): void {
    this.filtresChange.emit({
      type: this.type,
      urgence: this.urgence,
      statut: this.statut,
    });
  }
}