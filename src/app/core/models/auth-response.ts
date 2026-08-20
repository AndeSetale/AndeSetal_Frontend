export interface AuthResponse {
  access: string;
  refresh: string;
  user: UtilisateurApi;
}

export interface UtilisateurApi {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: 'citoyen' | 'agent' | 'admin';
  telephone?: string;
  quartier?: string;
  photo_profil?: string;
  email_verifie?: boolean;
  date_joined?: string;
}