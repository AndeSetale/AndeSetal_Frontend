import { Component } from '@angular/core';

interface Activity {
  id: string;
  type: string;
  quartier: string;
  date: string;
  statut: 'Validé' | 'Résolu' | 'En attente';
}

@Component({
  selector: 'app-recent-activity-table',
  imports: [],
  templateUrl: './recent-activity-table.html',
  styleUrl: './recent-activity-table.css',
})
export class RecentActivityTable {

  activities: Activity[] = [
    {
      id: '#4092',
      type: 'Dépôt sauvage',
      quartier: 'Médina',
      date: '06 Mai 2026, 14:30',
      statut: 'Validé',
    },
    {
      id: '#4089',
      type: 'Canal bouché',
      quartier: 'Plateau',
      date: '06 Mai 2026, 11:15',
      statut: 'Validé',
    },
    {
      id: '#4085',
      type: 'Éclairage défectueux',
      quartier: 'Médina',
      date: '05 Mai 2026, 16:45',
      statut: 'Résolu',
    },
    {
      id: '#4082',
      type: 'Canal bouché',
      quartier: 'Fass',
      date: '05 Mai 2026, 09:20',
      statut: 'Validé',
    },
    {
      id: '#4078',
      type: 'Dépôt sauvage',
      quartier: 'Médina',
      date: '04 Mai 2026, 15:30',
      statut: 'En attente',
    },
    {
      id: '#4074',
      type: 'Graffiti',
      quartier: 'Point E',
      date: '04 Mai 2026, 10:10',
      statut: 'Validé',
    },
  ];
}