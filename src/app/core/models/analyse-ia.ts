export interface AnalyseIA {
  id: number;
  type_detecte: string | null;
  score_confiance: number;
  niveau_urgence_detecte: string | null;
  description_generee: string | null;
  recommandations: string | null;
  date_analyse: string;
}
