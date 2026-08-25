import { Incident } from './incident';
import { Rapport } from './rapport';

export type StatutIntervention =
  | 'EN_ATTENTE'
  | 'EN_COURS'
  | 'TERMINEE';

export interface Intervention {
  id: number;

  numero_suivi: string;

  incident: Incident;

  agent: number;

  statut: StatutIntervention;

  date_debut: string;

  date_fin: string;

  rapport: Rapport | null;
}
