import { Component, signal } from '@angular/core';

interface IncidentType {
  label: string;
  value: number;
  color: string;
}

@Component({
  selector: 'app-repartition-incidents',
  standalone: true,
  imports: [],
  templateUrl: './repartition-incidents.html',
  styleUrl: './repartition-incidents.css',
})
export class RepartitionIncidents {

  readonly totalIncidents = signal(184);

  readonly incidentTypes = signal<IncidentType[]>([
    {
      label: 'Dépôt sauvage',
      value: 45,
      color: '#00A878',
    },
    {
      label: 'Canal bouché',
      value: 25,
      color: '#16A34A',
    },
    {
      label: 'Graffiti',
      value: 20,
      color: '#64748B',
    },
    {
      label: 'Autre',
      value: 10,
      color: '#CBD5E1',
    },
  ]);

  readonly donutStyle = signal({
    background: `
      conic-gradient(
        #00A878 0% 45%,
        #16A34A 45% 70%,
        #64748B 70% 90%,
        #CBD5E1 90% 100%
      )
    `,
  });
}