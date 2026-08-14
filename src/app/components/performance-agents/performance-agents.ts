import { Component, signal } from '@angular/core';

interface Agent {
  name: string;
  resolved: number;
  percentage: number;
}

@Component({
  selector: 'app-performance-agents',
  standalone: true,
  imports: [],
  templateUrl: './performance-agents.html',
  styleUrl: './performance-agents.css',
})
export class PerformanceAgents {

  readonly agents = signal<Agent[]>([
    {
      name: 'Amadou Diallo',
      resolved: 42,
      percentage: 72,
    },
    {
      name: 'Aissata Sow',
      resolved: 38,
      percentage: 66,
    },
    {
      name: 'Abdoulaye Ndiaye',
      resolved: 24,
      percentage: 42,
    },
    {
      name: 'Bassirou Dieye',
      resolved: 56,
      percentage: 100,
    },
  ]);
}