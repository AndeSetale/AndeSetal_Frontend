import { environment } from '../../../environments/environment';

/**
 * Le backend renvoie des chemins relatifs (/media/...) servis par Django.
 * Les préfixer avec l'hôte du backend, sinon le navigateur les cherche sur le frontend.
 */
export function urlMedia(chemin: string | null | undefined): string | undefined {
  if (!chemin) {
    return undefined;
  }
  if (/^(https?:|data:|blob:)/.test(chemin)) {
    return chemin;
  }
  return `${environment.mediaUrl}${chemin.startsWith('/') ? '' : '/'}${chemin}`;
}
