import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

import { NavigationAgent } from '../../components/navigation-agent/navigation-agent';

@Component({
  selector: 'app-agent',
  standalone: true,
  imports: [
    RouterOutlet,
    NavigationAgent,
  ],
  templateUrl: './agent.html',
  styleUrl: './agent.css',
})
export class Agent {

  private readonly router = inject(Router);

  /**
   * Détermine si la navigation principale
   * de l'agent doit être affichée.
   *
   * Elle est masquée sur /agent/carte
   * car cette page possède son propre Bottom Sheet.
   */
  afficherNavigation(): boolean {
    const url = this.router.url;

    return !(
      url === '/agent/carte' ||
      url.startsWith('/agent/carte/')
    );
  }
}