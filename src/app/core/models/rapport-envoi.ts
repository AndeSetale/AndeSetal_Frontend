import { Rapport } from './rapport';

export interface RapportEnvoi extends Rapport {
  /**
   * Numéro de suivi généré lors de l'envoi du rapport.
   *
   * Pour le moment :
   * cette valeur pourra être générée côté frontend.
   *
   * TODO BACKEND :
   * Cette valeur devra provenir de la réponse du backend
   * après l'envoi réel du rapport.
   */
  numeroSuivi: string;

  /**
   * Date et heure auxquelles le rapport a été envoyé.
   *
   * Pour le moment :
   * cette valeur pourra être générée côté frontend.
   *
   * TODO BACKEND :
   * Cette valeur devra provenir de la réponse du backend
   * après l'envoi réel du rapport.
   */
  dateEnvoi: string;
}
