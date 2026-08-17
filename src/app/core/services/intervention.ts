import { Injectable, computed, signal } from '@angular/core';
import { Intervention } from '../models/intervention';

@Injectable({
  providedIn: 'root',
})
export class InterventionService {

  /**
   * Source locale des interventions.
   *
   * Pour le moment les données sont statiques.
   * Plus tard, cette source sera remplacée par les données
   * provenant du backend via HttpClient.
   */
  private readonly interventionsSignal = signal<Intervention[]>([
    {
      id: 1,
      titre: 'Éclairage Public',
      description: "Panne d'éclairage signalée.",
      categorie: 'Éclairage',
      adresse: "Place de l'Indépendance",
      distance: '12 m',
      priorite: 'critique',
      statut: 'disponible',
      image: 'https://placehold.co/80x80',
      sla: '2h',
    },

    {
      id: 2,
      titre: 'Gestion des Déchets',
      description: 'Accumulation de déchets signalée.',
      categorie: 'Assainissement',
      adresse: 'Avenue Leopold Senghor',
      distance: '450 m',
      priorite: 'modere',
      statut: 'disponible',
      image: 'https://placehold.co/80x80',
      sla: '6h',
    },

    {
      id: 3,
      titre: 'Réparation Trottoir',
      description: 'Dégradation du trottoir.',
      categorie: 'Voirie',
      adresse: "Rue de l'Essart",
      distance: '1.2 km',
      priorite: 'routine',
      statut: 'disponible',
      image: 'https://placehold.co/80x80',
      sla: '24h',
    },
  ]);


  /**
   * Liste complète des interventions.
   *
   * Le signal est exposé en lecture seule aux composants.
   */
  readonly interventions = this.interventionsSignal.asReadonly();


  /**
   * Interventions actuellement disponibles
   * pour être prises en charge par un agent.
   */
  readonly interventionsDisponibles = computed(() =>
    this.interventionsSignal().filter(
      intervention => intervention.statut === 'disponible'
    )
  );


  /**
   * Interventions urgentes ou critiques.
   */
  readonly interventionsUrgentes = computed(() =>
    this.interventionsSignal().filter(
      intervention =>
        intervention.priorite === 'critique' ||
        intervention.priorite === 'urgent'
    )
  );


  /**
   * Interventions actuellement assignées.
   */
  readonly interventionsAssignees = computed(() =>
    this.interventionsSignal().filter(
      intervention => intervention.statut === 'assignee'
    )
  );


  /**
   * Interventions en cours.
   */
  readonly interventionsEnCours = computed(() =>
    this.interventionsSignal().filter(
      intervention => intervention.statut === 'en_cours'
    )
  );


  /**
   * Interventions terminées.
   */
  readonly interventionsTerminees = computed(() =>
    this.interventionsSignal().filter(
      intervention => intervention.statut === 'terminee'
    )
  );


  /**
   * Interventions triées par proximité.
   *
   * Pour l'instant, le tri est effectué dans le composant
   * car la distance est encore une valeur textuelle.
   *
   * Cette méthode pourra être améliorée lorsque le backend
   * fournira directement les coordonnées GPS.
   */
  readonly interventionsProches = computed(() =>
    this.interventionsSignal()
  );


  /**
   * Assigne une intervention à l'agent.
   */
  assignerIntervention(id: number | string): void {

    this.interventionsSignal.update(interventions =>
      interventions.map(intervention =>
        intervention.id === id
          ? {
              ...intervention,
              statut: 'assignee',
            }
          : intervention
      )
    );
  }


  /**
   * Passe une intervention assignée à l'état "en cours".
   */
  mettreEnCours(id: number | string): void {

    this.interventionsSignal.update(interventions =>
      interventions.map(intervention =>
        intervention.id === id
          ? {
              ...intervention,
              statut: 'en_cours',
            }
          : intervention
      )
    );
  }


  /**
   * Termine une intervention.
   */
  terminer(id: number | string): void {

    this.interventionsSignal.update(interventions =>
      interventions.map(intervention =>
        intervention.id === id
          ? {
              ...intervention,
              statut: 'terminee',
            }
          : intervention
      )
    );
  }
}