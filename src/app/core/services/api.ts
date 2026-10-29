import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Api {

  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  // Requête GET vers l'API
  get<T>(endpoint: string) {
    return this.http.get<T>(`${this.baseUrl}${endpoint}`);
  }

  // Requête POST vers l'API
  post<T>(endpoint: string, body: unknown) {
    return this.http.post<T>(
      `${this.baseUrl}${endpoint}`,
      body
    );
  }

  // Requête PATCH vers l'API
  patch<T>(endpoint: string, body: unknown) {
    return this.http.patch<T>(
      `${this.baseUrl}${endpoint}`,
      body
    );
  }

  // Requête DELETE vers l'API
  delete<T>(endpoint: string) {
    return this.http.delete<T>(
      `${this.baseUrl}${endpoint}`
    );
  }
}