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
  role: 'CITOYEN' | 'AGENT' | 'ADMIN';
  telephone?: string;
  quartier?: string;
}