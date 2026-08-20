import { Injectable, inject, signal } from '@angular/core';

import { RapportEnvoi } from '../models/rapport-envoi';
import { RapportService } from './rapport';

@Injectable({
  providedIn: 'root',
})
export class RapportEnvoiService {

  private readonly rapportService = inject(RapportService);

  /**
   * Rapport envoyé actuellement affiché sur la page de confirmation.
   *
   * Le composant pourra observer cette valeur avec un signal.
   */
  private readonly rapportEnvoyeSignal =
    signal<RapportEnvoi | null>(null);

  /**
   * Rapport envoyé en lecture seule.
   */
  readonly rapportEnvoye =
    this.rapportEnvoyeSignal.asReadonly();


  /**
   * Envoie le rapport associé à une intervention.
   *
   * Pour le moment :
   * les données sont générées localement à partir du rapport
   * existant dans RapportService.
   *
   * TODO BACKEND :
   * Remplacer cette logique par un appel HttpClient vers
   * l'API Django permettant d'envoyer le rapport associé
   * à l'intervention.
   *
   * La méthode devra conserver la même responsabilité :
   * recevoir l'identifiant de l'intervention et retourner
   * les données du rapport envoyé, notamment le numéro
   * de suivi et la date d'envoi retournés par le backend.
   */
  async envoyerRapport(
    interventionId: number | string
  ): Promise<RapportEnvoi | null> {

    const rapport =
      this.rapportService.getByInterventionId(interventionId);

    if (!rapport) {

      this.rapportEnvoyeSignal.set(null);

      return null;
    }


    /**
     * Numéro de suivi temporaire.
     *
     * TODO BACKEND :
     * Cette valeur devra être fournie par Django après
     * l'envoi réel du rapport.
     */
    const numeroSuivi =
      `REP-2024-${rapport.id}`;


    /**
     * Date d'envoi temporaire.
     *
     * TODO BACKEND :
     * Cette valeur devra être fournie par Django après
     * l'envoi réel du rapport.
     */
    const dateEnvoi =
      new Date().toISOString();


    const rapportEnvoi: RapportEnvoi = {
      ...rapport,
      numeroSuivi,
      dateEnvoi,
    };


    this.rapportEnvoyeSignal.set(rapportEnvoi);

    return rapportEnvoi;
  }


  /**
   * Récupère un rapport envoyé à partir de l'ID de
   * l'intervention correspondante.
   *
   * Pour le moment :
   * recherche dans les données locales de RapportService.
   *
   * TODO BACKEND :
   * Remplacer cette logique par une récupération depuis
   * l'API Django à partir de l'identifiant de l'intervention
   * ou du rapport.
   *
   * Cette méthode est volontairement sans effet de bord :
   * elle ne modifie aucun signal.
   *
   * Cela permet au composant RapportEnvoye de l'utiliser
   * à l'intérieur d'un computed().
   */
  getByInterventionId(
    interventionId: number | string
  ): RapportEnvoi | null {

    const rapport =
      this.rapportService.getByInterventionId(interventionId);

    if (!rapport) {
      return null;
    }


    /**
     * Si le rapport vient d'être envoyé dans cette session,
     * on conserve ses informations d'envoi existantes.
     */
    const rapportEnvoye =
      this.rapportEnvoyeSignal();


    if (
      rapportEnvoye &&
      String(rapportEnvoye.interventionId) ===
        String(interventionId)
    ) {

      return rapportEnvoye;
    }


    /**
     * Données temporaires utilisées uniquement pour permettre
     * l'affichage de la page lorsqu'elle est ouverte directement.
     *
     * TODO BACKEND :
     * Le numéro de suivi et la date d'envoi devront être
     * retournés par Django.
     */
    return {
      ...rapport,

      numeroSuivi:
        `REP-2024-${rapport.id}`,

      dateEnvoi:
        new Date().toISOString(),
    };
  }


  /**
   * Recherche le rapport envoyé actuellement conservé.
   *
   * Pour le moment :
   * recherche dans le signal local.
   *
   * TODO BACKEND :
   * Cette méthode pourra éventuellement être remplacée
   * par une récupération depuis l'API Django si la page
   * de confirmation doit pouvoir être rechargée directement
   * depuis son URL.
   */
  getRapportEnvoye(): RapportEnvoi | null {

    return this.rapportEnvoyeSignal();
  }


  /**
   * Réinitialise le rapport envoyé actuellement conservé.
   *
   * Utile notamment lorsqu'on quitte la page de confirmation.
   */
  clear(): void {

    this.rapportEnvoyeSignal.set(null);
  }

}
