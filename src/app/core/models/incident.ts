import { AnalyseIA } from './analyse-ia';
import { Preuve } from './preuve';

export type TypeIncident =
  | 'DECHETS'
  | 'CANAUX'
  | 'VOIRIE'
  | 'ECLAIRAGE_PUBLIC'
  | 'ARBRE'
  | 'FUITE_EAU';

export type StatutIncident =
  | 'NOUVEAU'
  | 'EN_COURS'
  | 'RESOLU';

export type NiveauUrgenceIncident =
  | 'CRITIQUE'
  | 'ELEVE'
  | 'MODERE'
  | 'ROUTINE';

export interface Incident {
  id: number;

  reference: string;

  type: TypeIncident;

  description: string;

  statut: StatutIncident;

  niveau_urgence: NiveauUrgenceIncident;

  quartier: string | null;

  adresse: string | null;

  latitude: number | null;

  longitude: number | null;

  date_creation: string;

  date_estimation_heures: number | null;

  commentaire: string | null;

  signale_par: number | null;

  assigne_a: number | null;

  preuves: Preuve[];

  analyse_ia: AnalyseIA | null;
}
