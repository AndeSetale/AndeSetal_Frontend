import { Injectable, computed, signal } from '@angular/core';
import { Rapport } from '../models/rapport';

@Injectable({
  providedIn: 'root',
})
export class RapportService {

  /**
   * Source locale des rapports.
   *
   * Pour le moment les données sont statiques.
   * Plus tard, cette source sera remplacée par les données
   * provenant du backend via HttpClient.
   */
  private readonly rapportsSignal = signal<Rapport[]>([
    {
      id: 1,
      interventionId: 1,

      titre: 'Réfection Chaussée',
      adresse: 'Avenue Lamine Guèye, Dakar',

      statut: 'resolu',

      evenements: [
        {
          type: 'resolution',
          titre: 'Résolution confirmée',
          description: 'par Superviseur Martin',
          heure: '14:32',
        },
        {
          type: 'photo',
          titre: 'Photos après-travaux',
          description: '3 photos ajoutées',
          heure: '13:15',
        },
        {
          type: 'assignation',
          titre: 'Équipe B assignée',
          description: 'Intervention sur site',
          heure: '10:48',
        },
        {
          type: 'reception',
          titre: 'Rapport reçu',
          description: 'par Agent Municipal',
          heure: '09:25',
        },
        {
          type: 'soumission',
          titre: 'Rapport soumis',
          description: 'par Agent Municipal',
          heure: '09:24',
        },
      ],

      documents: [
        {
          type: 'pdf',
          nom: 'Rapport PDF',
          taille: '2.4 MB',
        },
        {
          type: 'photos',
          nom: 'Photos',
          nombreFichiers: 5,
        },
      ],
    },
  ]);

  /**
   * Liste complète des rapports.
   */
  readonly rapports = this.rapportsSignal.asReadonly();

  /**
   * Rapports résolus.
   */
  readonly rapportsResolus = computed(() =>
    this.rapportsSignal().filter(
      rapport => rapport.statut === 'resolu'
    )
  );

  /**
   * Recherche un rapport par son ID.
   */
  getById(id: number | string): Rapport | undefined {
    return this.rapportsSignal().find(
      rapport => String(rapport.id) === String(id)
    );
  }

  /**
   * Recherche un rapport à partir de l'ID
   * de l'intervention correspondante.
   */
  getByInterventionId(
    interventionId: number | string
  ): Rapport | undefined {
    return this.rapportsSignal().find(
      rapport =>
        String(rapport.interventionId) === String(interventionId)
    );
  }
}