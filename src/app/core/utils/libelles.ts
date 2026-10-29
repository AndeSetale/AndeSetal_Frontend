// Libellés partagés des valeurs backend (types d'incident, urgences, statuts)

export const LIBELLES_TYPE: Record<string, string> = {
  DECHETS: 'Dépôt de déchets',
  CANAUX: 'Canal bouché',
  VOIRIE: 'Problème de voirie',
  ECLAIRAGE_PUBLIC: 'Éclairage public',
  ARBRE: 'Arbre dangereux',
  FUITE_EAU: "Fuite d'eau",
};

export const COULEURS_TYPE: Record<string, string> = {
  DECHETS: '#1F2937',
  CANAUX: '#F97316',
  VOIRIE: '#9CA3AF',
  ECLAIRAGE_PUBLIC: '#EAB308',
  ARBRE: '#16A34A',
  FUITE_EAU: '#3B82F6',
};

export function libelleType(type: string): string {
  return LIBELLES_TYPE[type] ?? type;
}
