export interface Rapport {
  id: number;
  interventionId: number;

  titre: string;
  adresse: string;

  statut: 'soumis' | 'resolu' | 'archive';

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