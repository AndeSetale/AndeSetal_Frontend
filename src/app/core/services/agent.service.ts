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

export interface CreateAgent {
  nom_complet: string;
  email: string;
  password: string;
  telephone: string;
  departement: string;
  role: string;
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

  createAgent(data: CreateAgent): Observable<Agent> {
    return this.api.post<Agent>(this.endpoint, data);
  }

  deleteAgent(id: number): Observable<void> {
    return this.api.delete<void>(`${this.endpoint}${id}/`);
  }
}