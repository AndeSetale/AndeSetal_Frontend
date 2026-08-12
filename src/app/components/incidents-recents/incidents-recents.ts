import { Component, signal } from '@angular/core';

interface Incident {
  id: string;
  type: string;
  quartier: string;
  urgence: 'CRITIQUE' | 'MODÉRÉ' | 'LÉGER';
  statut: 'Nouveau' | 'En cours' | 'Résolu';
}

@Component({
  selector: 'app-incidents-recents',
  standalone: true,
  imports: [],
  templateUrl: './incidents-recents.html',
  styleUrl: './incidents-recents.css',
})
export class IncidentsRecents {

  readonly incidents = signal<Incident[]>([
    {
      id: '#4092',
      type: 'Dépôt sauvage',
      quartier: 'Médina',
      urgence: 'CRITIQUE',
      statut: 'Nouveau',
    },
    {
      id: '#4091',
      type: 'Canal bouché',
      quartier: 'Plateau',
      urgence: 'MODÉRÉ',
      statut: 'En cours',
    },
    {
      id: '#4090',
      type: 'Graffiti',
      quartier: 'Fass',
      urgence: 'LÉGER',
      statut: 'Résolu',
    },
    {
      id: '#4089',
      type: 'Éclairage',
      quartier: 'Point E',
      urgence: 'MODÉRÉ',
      statut: 'En cours',
    },
  ]);
}