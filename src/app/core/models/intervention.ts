export type PrioriteIntervention =
  | 'critique'
  | 'urgent'
  | 'modere'
  | 'routine';


export type StatutIntervention =
  | 'disponible'
  | 'assignee'
  | 'en_cours'
  | 'terminee'
  | 'annulee';


export interface Intervention {
  id: number | string;

  titre: string;

  description: string;

  categorie: string;

  adresse: string;

  distance?: string;

  priorite: PrioriteIntervention;

  statut: StatutIntervention;

  image?: string;

  dateCreation?: string;

  sla?: string;
}