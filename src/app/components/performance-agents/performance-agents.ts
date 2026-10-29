import { Component, computed, input } from '@angular/core';

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

  /** Classement fourni par /dashboard/stats/ (performance_agents) */
  readonly performances = input<{ nom_complet: string; resolus: number }[]>([]);

  /** Barre proportionnelle au meilleur agent */
  readonly agents = computed<Agent[]>(() => {
    const liste = this.performances();
    const max = Math.max(1, ...liste.map(a => a.resolus));

    return liste.map(a => ({
      name: a.nom_complet,
      resolved: a.resolus,
      percentage: Math.round((a.resolus / max) * 100),
    }));
  });
}
