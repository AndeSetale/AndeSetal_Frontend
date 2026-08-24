export type PreuveType =
  | 'PHOTO_INITIALE'
  | 'PHOTO_AVANT'
  | 'PHOTO_APRES';

export interface Preuve {
  id: number;
  type: PreuveType;
  image_url: string;
  date_ajout: string;
}
