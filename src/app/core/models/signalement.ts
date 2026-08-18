// ──────────────────────────────────────────────────────────────────────────────
// Modèle : Signalement (parcours citoyen)
// Représente un incident signalé par un citoyen.
// Ce modèle doit correspondre exactement aux champs retournés par le backend.
// ──────────────────────────────────────────────────────────────────────────────

/** Types d'incidents possibles */
export type TypeSignalement =
  | 'depot_sauvage'
  | 'ordures_menageres'
  | 'dechets_plastiques'
  | 'egouts_bouches'
  | 'autre';

/** Niveau d'urgence d'un signalement */
export type UrgenceSignalement = 'critique' | 'modere' | 'leger';

/** Statut du cycle de vie d'un signalement */
export type StatutSignalement = 'nouveau' | 'en_cours' | 'resolu';

/**
 * Interface principale d'un signalement.
 * Les champs marqués "?" sont optionnels côté backend
 * (non encore renseignés au moment de la création).
 */
export interface Signalement {
  /** Identifiant unique fourni par le backend */
  id: number;

  /** Type de problème signalé */
  type: TypeSignalement;

  /** Niveau d'urgence évalué (par l'admin ou auto-détecté) */
  urgence: UrgenceSignalement;

  /** Statut courant dans le workflow de traitement */
  statut: StatutSignalement;

  /** Titre court décrivant le signalement */
  titre: string;

  /** Description détaillée rédigée par le citoyen */
  description?: string;

  /** Adresse textuelle du lieu du problème */
  adresse: string;

  /** Coordonnées GPS (latitude) */
  latitude?: number;

  /** Coordonnées GPS (longitude) */
  longitude?: number;

  /** URL de la photo jointe (hébergée sur le backend / CDN) */
  photoUrl?: string;

  /** Nom ou identifiant du citoyen qui a signalé ("Anonyme" si non connecté) */
  signalePar: string;

  /** Date ISO 8601 de création du signalement */
  dateCreation: string;

  /** Date ISO 8601 de la dernière mise à jour du statut */
  dateMiseAJour?: string;

  /** Identifiant de l'agent assigné au traitement (null si non assigné) */
  agentId?: number | null;
}

/**
 * Payload envoyé au backend lors de la création d'un nouveau signalement.
 * On n'inclut que les champs que le citoyen renseigne ;
 * id, statut, agentId sont générés côté serveur.
 */
export interface CreerSignalementPayload {
  type: TypeSignalement;
  urgence: UrgenceSignalement;
  titre: string;
  description?: string;
  adresse: string;
  latitude?: number;
  longitude?: number;
  photoUrl?: string;
  signalePar: string;
}
