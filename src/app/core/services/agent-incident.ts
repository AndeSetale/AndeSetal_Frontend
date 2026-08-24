import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { Api } from './api';
import { AgentIncident } from '../models/agent-incident';

interface AgentIncidentListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: AgentIncident[];
}

@Injectable({
  providedIn: 'root',
})
export class AgentIncidentService {
  private readonly api = inject(Api);

  getIncidents(): Observable<AgentIncident[]> {
    return this.api
      .get<AgentIncidentListResponse>('/incidents/')
      .pipe(
        map(response => response.results)
      );
  }
}
