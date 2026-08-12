import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface NavItem {
  label: string;
  route: string;
  icon: string;
  exact?: boolean;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  readonly navItems: NavItem[] = [
    {
      label: 'Tableau de bord',
      route: '/dashboard',
      icon: 'dashboard',
      exact: true,
    },
    {
      label: 'Carte des incidents',
      route: '/dashboard/map',
      icon: 'map',
    },
    {
      label: 'Gestion des agents',
      route: '/dashboard/agents',
      icon: 'agents',
    },
    {
      label: 'Gestion des incidents',
      route: '/dashboard/incidents',
      icon: 'incident',
    },
    {
      label: 'Set-Setal',
      route: '/dashboard/set-setal',
      icon: 'set-setal',
    },
    {
      label: 'Financement participatif',
      route: '/dashboard/financement',
      icon: 'financement',
    },
    {
      label: 'Paramètres',
      route: '/dashboard/settings',
      icon: 'settings',
    },
  ];
}