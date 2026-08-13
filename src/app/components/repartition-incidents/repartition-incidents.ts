import { Component, input } from '@angular/core';

export interface IncidentType {
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

  title = input('Répartition par type');

  subtitle = input('Types d’incidents traités');

  totalIncidents = input.required<number>();

  incidentTypes = input.required<IncidentType[]>();

  get donutBackground(): string {
    let current = 0;

    const segments = this.incidentTypes().map((type) => {
      const start = current;
      current += type.value;

      return `${type.color} ${start}% ${current}%`;
    });

    return `conic-gradient(${segments.join(', ')})`;
  }
}