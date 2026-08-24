import { AnalyseIA } from './analyse-ia';
import { Preuve } from './preuve';

export type AgentIncidentStatut =
  | 'NOUVEAU'
  | 'EN_COURS'
  | 'RESOLU';

export type AgentIncidentUrgence =
  | 'CRITIQUE'
  | 'ELEVE'
  | 'MODERE'
  | 'ROUTINE';

export interface AgentIncident {
  id: number;
  reference: string;

  type: string;
  description: string;

  statut: AgentIncidentStatut;
  niveau_urgence: AgentIncidentUrgence;

  quartier: string | null;
  adresse: string | null;

  latitude: number | null;
  longitude: number | null;

  date_creation: string;

  date_estimation_heures: number | null;
  commentaire: string | null;

  signale_par: unknown | null;
  assigne_a: number | null;

  preuves: Preuve[];

  analyse_ia: AnalyseIA | null;
}
