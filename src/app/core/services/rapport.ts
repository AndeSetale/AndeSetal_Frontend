import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { Rapport, RapportEvenement } from '../models/rapport';
import { Intervention } from '../models/intervention';
import { InterventionService } from './intervention';

/**
 * Rapport de clôture d'une intervention, reconstruit à partir de
 * GET /api/interventions/:id/ (dates de l'intervention + photos du rapport).
 */
@Injectable({
  providedIn: 'root',
})
export class RapportService {

  private readonly interventionService = inject(InterventionService);

  getByInterventionId(interventionId: number | string): Observable<Rapport> {
    return this.interventionService.getById(interventionId).pipe(
      map(intervention => this.construire(intervention)),
    );
  }

  private construire(intervention: Intervention): Rapport {
    const photos = [intervention.photoAvant, intervention.photoApres]
      .filter((url): url is string => !!url);

    // Chronologie, de l'événement le plus récent au plus ancien
    const evenements: (RapportEvenement & { date: string })[] = [];
    const ajouter = (type: RapportEvenement['type'], titre: string, description: string, date?: string) => {
      if (date) {
        evenements.push({ type, titre, description, heure: formaterHeure(date), date });
      }
    };

    ajouter('resolution', 'Intervention terminée', 'Incident marqué comme résolu', intervention.dateFin);
    ajouter('photo', 'Photos avant / après', `${photos.length} photo(s) ajoutée(s)`, intervention.dateRapport);
    ajouter('soumission', 'Rapport soumis', `Suivi ${intervention.numeroSuivi}`, intervention.dateRapport);
    ajouter('assignation', 'Intervention démarrée', 'Arrivée sur site confirmée', intervention.dateDebut);
    ajouter('assignation', 'Intervention assignée', 'Par le superviseur', intervention.dateAssignation);
    ajouter('reception', 'Signalement reçu', `Référence ${intervention.reference}`, intervention.dateCreation);

    evenements.sort((a, b) => b.date.localeCompare(a.date));

    return {
      id: intervention.id,
      interventionId: intervention.id,
      numeroSuivi: intervention.numeroSuivi,
      titre: intervention.titre,
      adresse: intervention.adresse,
      statut: intervention.statut === 'terminee' ? 'resolu' : 'soumis',
      dateEnvoi: intervention.dateRapport,
      photos,
      evenements: evenements.map(({ date, ...evenement }) => evenement),
      documents: photos.length
        ? [{ type: 'photos', nom: 'Photos avant / après', nombreFichiers: photos.length }]
        : [],
    };
  }
}

function formaterHeure(date: string): string {
  const d = new Date(date);
  const aujourdHui = new Date().toDateString() === d.toDateString();
  const heure = d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  return aujourdHui ? heure : `${d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })} ${heure}`;
}
