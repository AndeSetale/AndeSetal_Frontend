export interface Rapport {
  /** Identifiant de l'intervention (le rapport n'existe qu'une fois par intervention) */
  id: number;

  interventionId: number;

  numeroSuivi: string;

  titre: string;

  adresse: string;

  statut: 'soumis' | 'resolu' | 'archive';

  dateEnvoi?: string;

  photos: string[];

  evenements: RapportEvenement[];

  documents: RapportDocument[];
}

export interface RapportEvenement {
  type:
  | 'resolution'
  | 'photo'
  | 'assignation'
  | 'reception'
  | 'soumission';

  titre: string;

  description: string;

  heure: string;
}

export interface RapportDocument {
  type: 'pdf' | 'photos';

  nom: string;

  taille?: string;

  nombreFichiers?: number;
}
