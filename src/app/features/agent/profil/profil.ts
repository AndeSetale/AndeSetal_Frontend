import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { DatePipe } from '@angular/common';

import { HeaderAgent } from '../components/header-agent/header-agent';
import { Auth } from '../../../core/services/auth';
import { Api } from '../../../core/services/api';
import { InterventionService } from '../../../core/services/intervention';

import {
  LucideCircleCheck,
  LucideClock3,
  LucideLogOut,
} from '@lucide/angular';


// ============================================================
// Données du profil agent retournées par le backend
// ============================================================
interface AgentProfil {
  id: number;
  nom_complet: string;
  email: string;
  telephone: string;
  quartier: string;
  matricule: string;
  departement: string;
  specialisation: string;
  disponible: boolean;
  score_satisfaction: number;
  taux_completion: number;
  ponctualite: number;
  taches_resolues_semaine: number;
  objectif_hebdo: number;
}


@Component({
  selector: 'app-profil',

  imports: [
    RouterLink,
    LucideCircleCheck,
    LucideClock3,
    LucideLogOut,
    HeaderAgent,
    DatePipe,
  ],

  templateUrl: './profil.html',
  styleUrl: './profil.css',
})
export class Profil implements OnInit {

  private readonly auth = inject(Auth);
  private readonly api = inject(Api);
  private readonly router = inject(Router);
  private readonly interventionService = inject(InterventionService);


  // ============================================================
  // PROFIL DE L'AGENT
  // ============================================================
  //
  // Ces informations sont récupérées depuis le backend.
  //
  profil: AgentProfil | null = null;


  // ============================================================
  // DISPONIBILITÉ DU TOGGLE
  // ============================================================
  //
  // IMPORTANT :
  // Cette variable est volontairement locale.
  //
  // Le bouton de disponibilité ne fait PAS de requête PATCH
  // vers le backend.
  //
  disponible = true;


  // ============================================================
  // INTERVENTIONS RÉCENTES
  // ============================================================

  interventions: any[] = [];


  // ============================================================
  // INITIALISATION
  // ============================================================

  ngOnInit(): void {

    this.chargerProfil();

    this.chargerInterventions();
  }


  // ============================================================
  // CHARGEMENT DU PROFIL AGENT
  // ============================================================
  //
  // On récupère d'abord l'utilisateur connecté avec /auth/me/.
  //
  // Son id permet ensuite de récupérer les informations
  // spécifiques de l'agent avec :
  //
  // GET /api/agents/{id}/
  //
  // ============================================================

  private chargerProfil(): void {

    this.auth.me().subscribe({

      next: utilisateur => {

        this.api.get<AgentProfil>(
          `/agents/${utilisateur.id}/`
        ).subscribe({

          next: profil => {

            this.profil = profil;

            // On initialise le toggle avec la disponibilité
            // reçue du backend.
            //
            // Ensuite, les clics du bouton sont uniquement locaux.
            this.disponible = profil.disponible;

          },

          error: err => {

            console.error(
              'Erreur lors du chargement du profil agent',
              err
            );

          },

        });

      },

      error: err => {

        console.error(
          'Erreur lors de la récupération de l’utilisateur connecté',
          err
        );

      },

    });

  }


  // ============================================================
  // CHARGEMENT DES INTERVENTIONS
  // ============================================================
  //
  // On récupère les interventions accessibles à l'agent.
  //
  // Le backend applique les permissions nécessaires.
  //
  // On affiche seulement les 4 interventions les plus récentes
  // sur cette page.
  //
  // ============================================================

  private chargerInterventions(): void {

    this.interventionService.getInterventions().subscribe({

      next: interventions => {

        this.interventions = interventions.slice(0, 4);

      },

      error: err => {

        console.error(
          'Erreur lors du chargement des interventions',
          err
        );

      },

    });

  }


  // ============================================================
  // PROGRESSION HEBDOMADAIRE
  // ============================================================
  //
  // Exemple :
  //
  // tâches résolues = 18
  // objectif = 25
  //
  // 18 / 25 * 100 = 72 %
  //
  // Math.min() empêche la barre de dépasser 100 %.
  //
  // ============================================================

  get progressionHebdo(): number {

    if (
      !this.profil ||
      this.profil.objectif_hebdo <= 0
    ) {
      return 0;
    }

    return Math.min(
      100,
      (
        this.profil.taches_resolues_semaine /
        this.profil.objectif_hebdo
      ) * 100
    );

  }


  // ============================================================
  // TOGGLE DISPONIBILITÉ
  // ============================================================
  //
  // Cette méthode ne contacte PAS le backend.
  //
  // Elle inverse simplement l'état local :
  //
  // true  → false
  // false → true
  //
  // Le template Angular se met automatiquement à jour.
  //
  // ============================================================

  toggleDisponibilite(): void {

    this.disponible = !this.disponible;

  }


  // ============================================================
  // DÉCONNEXION
  // ============================================================

  deconnecter(): void {

    this.auth.deconnecter();

    this.router.navigate(['/connexion']);

  }

}
