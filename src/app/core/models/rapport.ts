export interface Rapport {
  id: number;
  intervention: number;
  photo_avant: string | null;
  photo_apres: string | null;
  date_envoi: string;
  statut: string;
}

export interface RapportCreate {
  photo_avant: File;
  photo_apres: File;
  statut: string;
}

export interface RapportUpdate {
  photo_avant?: File | null;
  photo_apres?: File | null;
  statut?: string;
}
