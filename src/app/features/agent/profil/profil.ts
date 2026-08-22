import { Component, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { HeaderAgent } from '../components/header-agent/header-agent';
import { Auth } from '../../../core/services/auth';


import {
  LucideCircleCheck,
  LucideClock3,
  LucideLogOut,
} from '@lucide/angular';


@Component({
  selector: 'app-profil',
  imports: [
    RouterLink,
    LucideCircleCheck,
    LucideClock3,
    LucideLogOut,
    HeaderAgent,
  ],
  templateUrl: './profil.html',
  styleUrl: './profil.css',
})
export class Profil {
  private readonly auth = inject(Auth);
  private readonly router = inject(Router);

  deconnecter(): void {
  this.auth.deconnecter();
  this.router.navigate(['/mobile']);
}


  agent = {
    nom: 'Moussa Diop',
    role: 'Agent de terrain Senior',
    photo: 'https://placehold.co/96x96',
    disponible: true,
  };

  performance = {
    tachesResolues: 24,
    objectifTaches: 30,
    ponctualite: 98,
    messagePonctualite: 'Excellent travail',
  };

  interventionsRecentes = [
    {
      id: 1,
      titre: 'Zone Marché Sandaga',
      description: 'Collecte de déchets volumineux',
      statut: 'Terminé',
      date: "Aujourd'hui, 09:15",
      image: 'https://placehold.co/64x64',
    },
    {
      id: 2,
      titre: "Place de l'Indépendance",
      description: 'Entretien des espaces verts',
      statut: 'En cours',
      date: 'Il y a 2 heures',
      image: 'https://placehold.co/64x64',
    },
  ];

  get pourcentageTachesResolues(): number {
    if (this.performance.objectifTaches <= 0) {
      return 0;
    }

    return Math.min(
      100,
      (this.performance.tachesResolues / this.performance.objectifTaches) * 100
    );
  }

  toggleDisponibilite(): void {
    this.agent.disponible = !this.agent.disponible;
  }
}