import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { Api } from './api';

export interface EvenementSetSetal {
  id: number;
  titre: string;
  lieu: string;
  date: string;
  description: string | null;
}

/**
 * Événements Set-Setal créés par l'administrateur (admin Django).
 *
 * Endpoint : GET /api/dashboard/evenements/prochain/ (public)
 */
@Injectable({ providedIn: 'root' })
export class EvenementService {

  private readonly api = inject(Api);

  /** Prochain événement à venir, ou null */
  prochain(): Observable<EvenementSetSetal | null> {
    return this.api.get<EvenementSetSetal | null>('/dashboard/evenements/prochain/');
  }
}
