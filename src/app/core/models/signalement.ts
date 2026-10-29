// ──────────────────────────────────────────────────────────────────────────────
// Modèle : Signalement (parcours citoyen)
// Représente un incident signalé par un citoyen.
// Le frontend utilise des types en minuscules (camelCase) ;
// le mapping depuis les données backend (snake_case, UPPERCASE) est
// effectué dans SignalementService.
// ──────────────────────────────────────────────────────────────────────────────

/** Types d'incidents — valeurs backend (UPPERCASE) */
export type TypeIncidentApi =
  | 'DECHETS'
  | 'CANAUX'
  | 'VOIRIE'
  | 'ECLAIRAGE_PUBLIC'
  | 'ARBRE'
  | 'FUITE_EAU';

/** Types affichés côté frontend (pour les icônes et labels) */
export type TypeSignalement =
  | 'DECHETS'
  | 'CANAUX'
  | 'VOIRIE'
  | 'ECLAIRAGE_PUBLIC'
  | 'ARBRE'
  | 'FUITE_EAU'
  | 'depot_sauvage'
  | 'ordures_menageres'
  | 'dechets_plastiques'
  | 'egouts_bouches'
  | 'autre';

/** Niveau d'urgence — valeurs backend */
export type NiveauUrgenceApi = 'CRITIQUE' | 'ELEVE' | 'MODERE' | 'ROUTINE';

/** Niveau d'urgence affiché (frontend) */
export type UrgenceSignalement = 'CRITIQUE' | 'ELEVE' | 'MODERE' | 'ROUTINE';

/** Statut — valeurs backend */
export type StatutApi = 'NOUVEAU' | 'EN_COURS' | 'RESOLU';

/** Statut affiché (frontend) */
export type StatutSignalement = 'NOUVEAU' | 'EN_COURS' | 'RESOLU';

// ── Interface backend brute (ce que retourne l'API) ──────────────────────────

export interface PreuveApi {
  id: number;
  type: string;
  url: string | null;      // correspond au champ "url" du PreuveSerializer backend
  date_ajout: string;
}

export interface SignalementApi {
  id: number;
  reference: string;
  type: TypeIncidentApi;
  description: string;
  statut: StatutApi;
  niveau_urgence: NiveauUrgenceApi;
  quartier: string | null;
  adresse: string | null;
  latitude: number | null;
  longitude: number | null;
  date_creation: string;
  date_estimation_heures: number | null;
  commentaire: string | null;
  signale_par: number | null;
  assigne_a: number | null;
  preuves: PreuveApi[];
  analyse_ia: unknown | null;
}

// ── Interface normalisée utilisée dans les templates ─────────────────────────

/**
 * Interface principale d'un signalement utilisée dans les templates.
 * Construite à partir de SignalementApi par le service.
 */
export interface Signalement {
  /** Identifiant unique fourni par le backend */
  id: number;

  /** Référence lisible (ex: INC-A1B2C3D4) */
  reference: string;

  /** Type de problème signalé */
  type: TypeSignalement;

  /** Niveau d'urgence */
  urgence: UrgenceSignalement;

  /** Statut courant dans le workflow */
  statut: StatutSignalement;

  /** Titre synthétisé depuis le type (pas un champ backend) */
  titre: string;

  /** Description détaillée */
  description?: string;

  /** Adresse textuelle */
  adresse: string;

  /** Coordonnées GPS */
  latitude?: number;
  longitude?: number;

  /** URL de la première photo (issue de preuves[0].image_url) */
  photoUrl?: string;

  /** Quartier */
  quartier?: string;

  /** Date ISO 8601 de création */
  dateCreation: string;

  /** Identifiant de l'agent assigné */
  agentId?: number | null;
}

/**
 * Payload envoyé au backend lors de la création d'un nouveau signalement.
 * Correspond exactement aux champs attendus par IncidentCreateSerializer.
 */
export interface CreerSignalementPayload {
  type: TypeIncidentApi;
  description: string;
  niveau_urgence: NiveauUrgenceApi;
  quartier?: string;
  adresse?: string;
  latitude?: number;
  longitude?: number;
}
