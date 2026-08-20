import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Api } from './api';

export interface Agent {
  id: number;
  matricule: string;
  nom_complet: string;
  email: string;
  telephone: string | null;
  departement: string;
  quartier: string;
  specialisation: string;
  disponible: boolean;
  score_satisfaction: number;
  taux_completion: number;
  ponctualite: number;
  taches_resolues_semaine: number;
  objectif_hebdo: number;
}

// ==========================================================
// DASHBOARD AGENT — AJOUTÉ POUR LE DASHBOARD DE L'AGENT
// ==========================================================

export interface AgentDashboardInfo {
  id: number;
  nom_complet: string;
  matricule: string;
  specialisation: string | null;
}

export interface AgentDashboardStats {
  taches_resolues_semaine: number;
  interventions_en_cours: number;
  taux_completion: number;
  ponctualite: number;
}

export interface AgentDashboardIntervention {
  id: number;
  numero_suivi: string;
  statut: string;
  date_debut: string | null;
  date_fin: string | null;

  incident_id: number;
  reference: string;
  type: string;
  description: string;
  niveau_urgence: string;
  quartier: string | null;
  adresse: string | null;
}

export interface AgentDashboard {
  agent: AgentDashboardInfo;
  statistiques: AgentDashboardStats;
  interventions_prioritaires: AgentDashboardIntervention[];
  interventions_recentes: AgentDashboardIntervention[];
}


export interface CreateAgent {
  nom_complet: string;
  email: string;
  password: string;
  telephone: string;
  departement: string;
  role: string;
}

// ============================================================
// AJOUT — DONNÉES D'UNE INTERVENTION AGENT
// ============================================================

export interface Intervention {
  id: number;
  numero_suivi: string;
  incident: any;
  agent: number;
  statut: string;
  date_debut: string | null;
  date_fin: string | null;
  rapport: any | null;
}


@Injectable({
  providedIn: 'root'
})
export class AgentService {

  private readonly api = inject(Api);

  private readonly endpoint = '/agents/';

  getAgents(): Observable<Agent[]> {
    return this.api.get<Agent[]>(this.endpoint);
  }

  getAgent(id: number): Observable<Agent> {
    return this.api.get<Agent>(`${this.endpoint}${id}/`);
  }
  
  // ============================================================
  // AJOUT — INTERVENTIONS DE L'AGENT CONNECTÉ
  // ============================================================

  getMesInterventions(): Observable<Intervention[]> {
    return this.api.get<Intervention[]>('/interventions/my/');
  }


// ==========================================================
// DASHBOARD AGENT — ENDPOINT DE L'AGENT CONNECTÉ
// ==========================================================

  getDashboard(): Observable<AgentDashboard> {
  return this.api.get<AgentDashboard>('/dashboard/agent/');
}


  createAgent(data: CreateAgent): Observable<Agent> {
    return this.api.post<Agent>(this.endpoint, data);
  }

  deleteAgent(id: number): Observable<void> {
    return this.api.delete<void>(`${this.endpoint}${id}/`);
  }
}