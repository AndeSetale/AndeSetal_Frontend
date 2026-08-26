import {
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';

import { RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';
import {
  Intervention,
  StatutIntervention,
} from '../../../core/models/intervention';

import {
  InterventionService,
} from '../../../core/services/intervention';

import {
  TypeIncident,
  NiveauUrgenceIncident,
} from '../../../core/models/incident';


// ============================================================
// TYPES DES FILTRES
// ============================================================

type FiltreIntervention =
  | 'TOUS'
  | 'URGENCES'
  | 'EN_ATTENTE'
  | 'EN_COURS'
  | 'TERMINEE';


// ============================================================
// COMPOSANT
// ============================================================

@Component({
  selector: 'app-interventions',
  standalone: true,
  imports: [
    RouterLink,
    NgClass,
  ],
  templateUrl: './interventions.html',
  styleUrl: './interventions.css',
})
export class Interventions {

  // ============================================================
  // SERVICES
  // ============================================================

  private readonly interventionService =
    inject(InterventionService);


  // ============================================================
  // ÉTAT
  // ============================================================

  readonly interventions =
    signal<Intervention[]>([]);

  readonly chargement =
    signal<boolean>(true);

  readonly erreur =
    signal<boolean>(false);

  readonly filtreActif =
    signal<FiltreIntervention>('TOUS');

  readonly interventionEnCours =
    signal<number | null>(null);


  // ============================================================
  // INTERVENTIONS FILTRÉES
  // ============================================================

  readonly interventionsFiltrees =
    computed(() => {

      const interventions =
        this.interventions();

      const filtre =
        this.filtreActif();


      switch (filtre) {

        case 'URGENCES':

          return interventions.filter(
            (intervention: Intervention) => {

              const urgence =
                intervention.incident.niveau_urgence;

              return (
                urgence === 'CRITIQUE' ||
                urgence === 'ELEVE'
              );
            }
          );


        case 'EN_ATTENTE':

          return interventions.filter(
            (intervention: Intervention) =>
              intervention.statut === 'EN_ATTENTE'
          );


        case 'EN_COURS':

          return interventions.filter(
            (intervention: Intervention) =>
              intervention.statut === 'EN_COURS'
          );


        case 'TERMINEE':

          return interventions.filter(
            (intervention: Intervention) =>
              intervention.statut === 'TERMINEE'
          );


        case 'TOUS':
        default:

          return interventions;
      }

    });


  // ============================================================
  // INITIALISATION
  // ============================================================

  constructor() {

    this.chargerInterventions();
  }


  // ============================================================
  // CHARGEMENT
  // ============================================================

  chargerInterventions(): void {

    this.chargement.set(true);

    this.erreur.set(false);


    this.interventionService
      .getInterventions()
      .subscribe({

        next: (
          interventions: Intervention[]
        ) => {

          console.log(
            'INTERVENTIONS AGENT :',
            interventions
          );

          this.interventions.set(
            interventions
          );

          this.chargement.set(false);
        },


        error: (error: unknown) => {

          console.error(
            'Erreur lors du chargement des interventions :',
            error
          );

          this.erreur.set(true);

          this.chargement.set(false);
        },

      });
  }


  // ============================================================
  // FILTRE
  // ============================================================

  selectionnerFiltre(
    filtre: FiltreIntervention
  ): void {

    this.filtreActif.set(filtre);
  }


  // ============================================================
  // CHANGEMENT DU STATUT
  // ============================================================

  changerStatut(
    intervention: Intervention,
    nouveauStatut: StatutIntervention
  ): void {

    if (
      this.interventionEnCours() !== null
    ) {
      return;
    }


    // ----------------------------------------------------------
    // Protection côté frontend
    // Le backend reste la source de vérité.
    // ----------------------------------------------------------

    if (
      intervention.statut === 'EN_ATTENTE' &&
      nouveauStatut !== 'EN_COURS'
    ) {
      return;
    }


    if (
      intervention.statut === 'EN_COURS' &&
      nouveauStatut !== 'TERMINEE'
    ) {
      return;
    }


    if (
      intervention.statut === 'TERMINEE'
    ) {
      return;
    }


    this.interventionEnCours.set(
      intervention.id
    );


    this.interventionService
      .update(
        intervention.id,
        {
          statut: nouveauStatut,
        }
      )
      .subscribe({

        next: (
          interventionMiseAJour: Intervention
        ) => {

          this.interventions.update(
            (liste) =>
              liste.map(
                (item) =>
                  item.id === interventionMiseAJour.id
                    ? interventionMiseAJour
                    : item
              )
          );


          this.interventionEnCours.set(
            null
          );
        },


        error: (error: unknown) => {

          console.error(
            'Erreur lors de la mise à jour de l’intervention :',
            error
          );


          this.interventionEnCours.set(
            null
          );
        },

      });
  }


  // ============================================================
  // TYPE INCIDENT
  // ============================================================

  libelleTypeIncident(
    type: TypeIncident
  ): string {

    switch (type) {

      case 'DECHETS':
        return 'Déchets';

      case 'CANAUX':
        return 'Canaux';

      case 'VOIRIE':
        return 'Voirie';

      case 'ECLAIRAGE_PUBLIC':
        return 'Éclairage public';

      case 'ARBRE':
        return 'Arbre';

      case 'FUITE_EAU':
        return "Fuite d'eau";

      default:
        return type;
    }
  }


  // ============================================================
  // URGENCE
  // ============================================================

  libelleUrgence(
    urgence: NiveauUrgenceIncident
  ): string {

    switch (urgence) {

      case 'CRITIQUE':
        return 'Critique';

      case 'ELEVE':
        return 'Élevé';

      case 'MODERE':
        return 'Modéré';

      case 'ROUTINE':
        return 'Routine';

      default:
        return urgence;
    }
  }


  // ============================================================
  // CLASSES COULEUR URGENCE
  // ============================================================

  classeUrgence(
    urgence: NiveauUrgenceIncident
  ): string {

    switch (urgence) {

      case 'CRITIQUE':
        return 'bg-red-100 text-red-700';

      case 'ELEVE':
        return 'bg-orange-100 text-orange-700';

      case 'MODERE':
        return 'bg-yellow-100 text-yellow-700';

      case 'ROUTINE':
        return 'bg-green-100 text-green-700';

      default:
        return 'bg-neutral-100 text-neutral-500';
    }
  }


  // ============================================================
  // STATUT
  // ============================================================

  libelleStatut(
    statut: StatutIntervention
  ): string {

    switch (statut) {

      case 'EN_ATTENTE':
        return 'En attente';

      case 'EN_COURS':
        return 'En cours';

      case 'TERMINEE':
        return 'Terminée';

      default:
        return statut;
    }
  }


  // ============================================================
  // IMAGE INCIDENT
  // ============================================================

  imageIncident(
    intervention: Intervention
  ): string {

    const preuves =
      intervention.incident?.preuves ?? [];


    const preuve =
      preuves.find(
        (item) =>
          item.type === 'PHOTO_INITIALE' ||
          item.type === 'PHOTO_AVANT'
      );


    if (
      preuve?.image_url
    ) {
      return preuve.image_url;
    }


    return 'images/incident-1.webp';
  }


  // ============================================================
  // LOCALISATION
  // ============================================================

  localisation(
    intervention: Intervention
  ): string {

    const incident =
      intervention.incident;


    if (incident.adresse) {
      return incident.adresse;
    }


    if (incident.quartier) {
      return incident.quartier;
    }


    return 'Localisation non renseignée';
  }


  // ============================================================
  // FORMAT DATE
  // ============================================================

  formatDate(
    date: string | null
  ): string {

    if (!date) {
      return 'Date non renseignée';
    }


    const valeur =
      new Date(date);


    if (
      Number.isNaN(
        valeur.getTime()
      )
    ) {
      return 'Date non renseignée';
    }


    return valeur.toLocaleDateString(
      'fr-FR',
      {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }
    );
  }


  // ============================================================
  // TRACK BY
  // ============================================================

  trackByIntervention(
    _index: number,
    intervention: Intervention
  ): number {

    return intervention.id;
  }
}
