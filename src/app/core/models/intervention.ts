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
  
  agent_nom: string | null;

  statut: StatutIntervention;

  date_debut: string | null;

  date_fin: string | null;

  rapport: Rapport | null;
}
