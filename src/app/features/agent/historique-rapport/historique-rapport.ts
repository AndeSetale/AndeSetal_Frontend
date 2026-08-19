import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import {
  LucideCircleCheck,
  LucideMapPin,
  LucideCamera,
  LucideUsersRound,
  LucideInbox,
  LucideSend,
  LucideDownload,
  LucideImage,
  LucideEye,
  LucideArchive,
  LucideShare2,
} from '@lucide/angular';

import { RapportService } from '../../../core/services/rapport';
import { HeaderAgent } from '../components/header-agent/header-agent';

@Component({
  selector: 'app-historique-rapport',
  imports: [
    HeaderAgent,
    LucideCircleCheck,
    LucideMapPin,
    LucideCamera,
    LucideUsersRound,
    LucideInbox,
    LucideSend,
    LucideDownload,
    LucideImage,
    LucideEye,
    LucideArchive,
    LucideShare2,
  ],
  templateUrl: './historique-rapport.html',
  styleUrl: './historique-rapport.css',
})
export class HistoriqueRapport {

  private readonly rapportService = inject(RapportService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  /**
   * ID du rapport récupéré depuis l'URL.
   */
  readonly rapportId = computed(() =>
    this.route.snapshot.paramMap.get('id')
  );

  /**
   * Rapport actuellement affiché.
   */
  readonly rapport = computed(() => {
    const id = this.rapportId();

    return this.rapportService.getById(id ?? '');
  });

  /**
   * Nombre d'événements du rapport.
   */
  readonly nombreEvenements = computed(() =>
    this.rapport()?.evenements.length ?? 0
  );

  /**
   * Retour à la page précédente.
   */
  retour(): void {
    this.router.navigate(['/agent/interventions']);
  }

  /**
   * Archive le rapport.
   *
   * Pour le moment :
   * action temporaire en attendant le backend.
   *
   * TODO BACKEND :
   * Remplacer cette logique par l'appel au service/API
   * permettant d'archiver réellement le rapport.
   */
  archiver(): void {
    console.log('Archivage du rapport', this.rapport());
  }

  /**
   * Partage le rapport.
   *
   * Pour le moment :
   * action temporaire en attendant le backend.
   *
   * TODO BACKEND :
   * Remplacer cette logique par la logique de partage
   * lorsque le backend sera branché.
   */
  partager(): void {
    console.log('Partage du rapport', this.rapport());
  }

  /**
   * Téléchargement du PDF.
   *
   * Pour le moment :
   * action temporaire en attendant le backend.
   *
   * TODO BACKEND :
   * Remplacer cette logique par la récupération/téléchargement
   * réel du fichier PDF depuis le backend.
   */
  telechargerPdf(): void {
    console.log('Téléchargement du PDF', this.rapport());
  }

  /**
   * Affichage des photos.
   *
   * Pour le moment :
   * action temporaire en attendant le backend.
   *
   * TODO BACKEND :
   * Remplacer cette logique par la récupération des photos
   * depuis le backend / stockage distant.
   */
  voirPhotos(): void {
    console.log('Affichage des photos', this.rapport());
  }

  /**
   * Partage du rapport depuis le header.
   *
   * Pour le moment :
   * action temporaire en attendant le backend.
   *
   * TODO BACKEND :
   * Brancher cette action sur la vraie fonctionnalité
   * de partage lorsque le backend sera disponible.
   */
  partagerRapport(): void {
    console.log('Partage du rapport');
  }
}
