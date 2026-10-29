import { Component, inject, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-header-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './header-dashboard.html',
  styleUrl: './header-dashboard.css',
})
export class HeaderDashboard {
  private readonly router = inject(Router);

  title = signal<string>('Tableau de bord');

  private readonly titles: Record<string, string> = {
    '/dashboard': 'Tableau de bord',
    '/dashboard/map': 'Carte des incidents',
   
    '/dashboard/incidents': 'Gestion des incidents',
    '/dashboard/agents': 'Gestion des agents',

  };

  constructor() {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd)
      )
      .subscribe((event) => {
        const url = event.urlAfterRedirects;

        // Détail d'un agent
        if (url.startsWith('/dashboard/agents/')) {
          this.title.set('Gestion des agents');
          return;
        }
         if (url.startsWith('/dashboard/map/incidents')) {
          this.title.set('Detail incident');
          return;
        }

        // Routes normales
        this.title.set(
          this.titles[url] ?? 'Tableau de bord'
        );
      });
  }
}