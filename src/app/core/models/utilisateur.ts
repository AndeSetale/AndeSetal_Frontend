export interface Utilisateur {
    id: number;
    nomComplet: string;
    email: string;
    telephone?: string;
    quartier?: string;
    role: 'citoyen' | 'agent' | 'admin';
    photoUrl: string;   
}
