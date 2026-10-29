import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { InterventionService } from '../../../core/services/intervention';

import {
  Intervention,
  PrioriteIntervention,
} from '../../../core/models/intervention';


type FiltreIntervention =
  | 'tous'
  | 'urgences'
  | 'proximite';


@Component({
  selector: 'app-interventions',
  imports: [RouterLink],
  templateUrl: './interventions.html',
  styleUrl: './interventions.css',
})
export class Interventions implements OnInit {

  /**
   * Service métier des interventions.
   *
   * Pour l'instant, les données viennent du service.
   * Plus tard, le service pourra être branché au backend
   * sans modifier le fonctionnement du composant.
   */
  private readonly interventionService = inject(InterventionService);


  /**
   * Filtre actuellement sélectionné.
   */
  readonly filtreActif = signal<FiltreIntervention>('tous');


  /**
   * Liste complète des interventions.
   *
   * Le signal provient directement du service.
   */
  readonly interventions = this.interventionService.interventions;


  /**
   * Liste affichée selon le filtre sélectionné.
   */
  readonly interventionsFiltrees = computed(() => {

    const interventions = this.interventions();
    const filtre = this.filtreActif();

    switch (filtre) {

      /**
       * URGENCES
       *
       * On affiche les interventions critiques
       * et urgentes.
       */
      case 'urgences':

        return interventions.filter(
          intervention =>
            intervention.priorite === 'critique' ||
            intervention.priorite === 'urgent'
        );


      /**
       * PROXIMITÉ
       *
       * On trie les interventions de la plus proche
       * à la plus éloignée.
       */
      case 'proximite':

        return [...interventions].sort(
          (a, b) =>
            this.distanceEnMetres(a.distance) -
            this.distanceEnMetres(b.distance)
        );


      /**
       * TOUS
       */
      case 'tous':
      default:

        return interventions;
    }
  });


  /**
   * Change le filtre actif.
   */
  changerFiltre(filtre: FiltreIntervention): void {
    this.filtreActif.set(filtre);
  }


  /**
   * Vérifie si un filtre est actuellement actif.
   */
  estFiltreActif(filtre: FiltreIntervention): boolean {
    return this.filtreActif() === filtre;
  }


  /**
   * Retourne le libellé lisible d'une priorité.
   */
  libellePriorite(priorite: PrioriteIntervention): string {

    switch (priorite) {

      case 'critique':
        return 'Critique';

      case 'urgent':
        return 'Urgent';

      case 'modere':
        return 'Modéré';

      case 'routine':
        return 'Routine';

      default:
        return 'Inconnue';
    }
  }


  /**
   * Retourne les classes Tailwind correspondant
   * à la priorité de l'intervention.
   */
  classesPriorite(priorite: PrioriteIntervention): string {

    switch (priorite) {

      case 'critique':
        return 'bg-rose-200 text-red-800';

      case 'urgent':
        return 'bg-rose-200 text-red-800';

      case 'modere':
        return 'bg-amber-100 text-amber-900';

      case 'routine':
        return 'bg-neutral-200 text-neutral-700';

      default:
        return 'bg-neutral-200 text-neutral-700';
    }
  }
  /** Identifiant de l'intervention en cours de démarrage (bouton désactivé) */
  readonly enCours = signal<number | null>(null);

  readonly chargement = signal(true);

  readonly erreur = signal<string | null>(null);

  ngOnInit(): void {
    this.interventionService.charger().subscribe({
      next: () => this.chargement.set(false),
      error: () => {
        this.erreur.set('Impossible de charger vos interventions.');
        this.chargement.set(false);
      },
    });
  }

  /** Démarre l'intervention (statut EN_COURS côté backend) */
  demarrer(intervention: Intervention): void {
    this.enCours.set(intervention.id);
    this.interventionService.demarrer(intervention.id).subscribe({
      next: () => this.enCours.set(null),
      error: () => this.enCours.set(null),
    });
  }


  /**
   * Convertit une distance textuelle en mètres.
   *
   * Exemples :
   *
   * "12 m"   → 12
   * "450 m"  → 450
   * "1.2 km" → 1200
   *
   * Si aucune distance n'est disponible,
   * on considère la valeur comme infinie afin
   * qu'elle apparaisse à la fin du tri.
   */
  private distanceEnMetres(distance?: string): number {

    if (!distance) {
      return Number.POSITIVE_INFINITY;
    }

    const valeur = Number.parseFloat(
      distance.replace(',', '.')
    );

    if (Number.isNaN(valeur)) {
      return Number.POSITIVE_INFINITY;
    }

    if (distance.toLowerCase().includes('km')) {
      return valeur * 1000;
    }

    return valeur;
  }
}