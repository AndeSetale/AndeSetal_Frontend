import { PrioriteIntervention } from './intervention';

export interface Incident {
  id: number | string;

  titre: string;

  description: string;

  categorie: string;

  adresse: string;

  image?: string;

  priorite: PrioriteIntervention;

  confianceIA?: number;

  latitude?: number;

  longitude?: number;

  dateCreation?: string;

  iaAnalyse?: boolean;
}
