// Priorité affichée côté agent (dérivée du niveau d'urgence backend)
export type PrioriteIntervention =
  | 'critique'
  | 'urgent'
  | 'modere'
  | 'routine';

// Statut affiché côté agent (dérivé du statut backend)
//   EN_ATTENTE → assignee | EN_COURS → en_cours | TERMINEE → terminee
export type StatutIntervention =
  | 'disponible'
  | 'assignee'
  | 'en_cours'
  | 'terminee'
  | 'annulee';

export interface Intervention {
  id: number;

  numeroSuivi: string;

  incidentId: number;

  reference: string;

  titre: string;

  description: string;

  categorie: string;

  adresse: string;

  latitude?: number;

  longitude?: number;

  distance?: string;

  priorite: PrioriteIntervention;

  statut: StatutIntervention;

  image?: string;

  dateCreation?: string;

  dateAssignation?: string;

  dateDebut?: string;

  dateFin?: string;

  sla?: string;

  confianceIA?: number;

  photoAvant?: string;

  photoApres?: string;

  dateRapport?: string;
}

// ── Format brut renvoyé par /api/interventions/ ──────────────────────────────

export interface InterventionApi {
  id: number;
  numero_suivi: string;
  incident: number;
  incident_details: {
    id: number;
    reference: string;
    type: string;
    description: string;
    niveau_urgence: string;
    quartier: string | null;
    adresse: string | null;
    latitude: number | null;
    longitude: number | null;
    date_creation: string;
    preuves: { url: string | null }[];
    analyse_ia: { score_confiance: number } | null;
  };
  agent: number | null;
  agent_nom: string | null;
  statut: 'EN_ATTENTE' | 'EN_COURS' | 'TERMINEE';
  date_assignation: string | null;
  date_debut: string | null;
  date_fin: string | null;
  rapport: {
    id: number;
    photo_avant: string | null;
    photo_apres: string | null;
    date_envoi: string;
    statut: string;
  } | null;
}
