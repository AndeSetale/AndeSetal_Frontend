import {
  Component,
  computed,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';

import { HeaderAgent } from '../components/header-agent/header-agent';

import {
  LucideMapPin,
  LucidePencil,
  LucideSend,
} from '@lucide/angular';

import { Intervention } from '../../../core/models/intervention';
import { Rapport } from '../../../core/models/rapport';

import { InterventionService } from '../../../core/services/intervention';
import { RapportService } from '../../../core/services/rapport';

@Component({
  selector: 'app-detail-intervention',

  imports: [
    HeaderAgent,
    LucideMapPin,
    LucidePencil,
    LucideSend,
  ],

  templateUrl: './detail-intervention.html',
  styleUrl: './detail-intervention.css',
})
export class DetailIntervention implements OnInit, OnDestroy {

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  private readonly interventionService =
    inject(InterventionService);

  private readonly rapportService =
    inject(RapportService);


  /**
   * ID de l'intervention récupéré depuis l'URL.
   */
  readonly id = signal(0);


  /**
   * Intervention récupérée depuis le backend.
   */
  readonly intervention =
    signal<Intervention | null>(null);


  /**
   * Rapport associé à l'intervention.
   */
  readonly rapport =
    signal<Rapport | null>(null);


  /**
   * Fichier sélectionné pour la photo avant.
   */
  readonly photoAvant =
    signal<File | null>(null);


  /**
   * Fichier sélectionné pour la photo après.
   */
  readonly photoApres =
    signal<File | null>(null);


  /**
   * Aperçu de la photo avant.
   */
  readonly photoAvantPreview =
    signal<string | null>(null);


  /**
   * Aperçu de la photo après.
   */
  readonly photoApresPreview =
    signal<string | null>(null);


  /**
   * État de chargement.
   */
  readonly isLoading =
    signal(false);


  /**
   * État d'envoi ou de modification du rapport.
   */
  readonly envoiEnCours =
    signal(false);


  /**
   * Message d'erreur.
   */
  readonly errorMessage =
    signal<string | null>(null);


  /**
   * Photo principale de l'incident.
   *
   * Le modèle Incident ne possède pas directement
   * de propriété "photo".
   *
   * Les photos sont stockées dans "preuves".
   *
   * Priorité :
   * 1. PHOTO_INITIALE
   * 2. PHOTO_AVANT
   * 3. première preuve disponible
   */
  readonly photoIncident = computed(() => {

    const incident =
      this.intervention()?.incident;

    if (!incident) {
      return null;
    }

    const preuveInitiale =
      incident.preuves.find(
        (preuve) =>
          preuve.type === 'PHOTO_INITIALE'
      );

    if (preuveInitiale) {
      return preuveInitiale.image_url;
    }

    const preuveAvant =
      incident.preuves.find(
        (preuve) =>
          preuve.type === 'PHOTO_AVANT'
      );

    if (preuveAvant) {
      return preuveAvant.image_url;
    }

    return incident.preuves[0]?.image_url ?? null;
  });


  /**
   * Libellé lisible du type d'incident.
   */
  readonly titreIncident = computed(() => {

    const type =
      this.intervention()?.incident.type;

    if (!type) {
      return 'Intervention';
    }

    const libelles: Record<string, string> = {
      DECHETS: 'Déchets',
      CANAUX: 'Canaux',
      VOIRIE: 'Voirie',
      ECLAIRAGE_PUBLIC: 'Éclairage public',
      ARBRE: 'Arbre',
      FUITE_EAU: 'Fuite d’eau',
    };

    return libelles[type] ?? type;
  });


  /**
   * Statut de l'intervention sous forme lisible.
   */
  readonly statutIntervention = computed(() => {

    const statut =
      this.intervention()?.statut;

    switch (statut) {

      case 'EN_ATTENTE':
        return 'En attente';

      case 'EN_COURS':
        return 'En cours';

      case 'TERMINEE':
        return 'Terminée';

      default:
        return 'En cours';
    }
  });


  /**
   * Indique si un rapport existe déjà.
   */
  readonly rapportExiste = computed(() => {
    return this.rapport() !== null;
  });


  /**
   * Libellé du bouton principal.
   */
  readonly libelleBoutonRapport = computed(() => {

    if (this.envoiEnCours()) {
      return this.rapportExiste()
        ? 'Modification en cours...'
        : 'Envoi en cours...';
    }

    return this.rapportExiste()
      ? 'Modifier le rapport'
      : 'Envoyer le rapport';
  });


  /**
   * Initialisation du composant.
   */
  ngOnInit(): void {

    const id =
      this.route.snapshot.paramMap.get('id');

    if (!id) {

      this.errorMessage.set(
        'Identifiant de l’intervention introuvable.'
      );

      return;
    }


    const interventionId =
      Number(id);

    if (Number.isNaN(interventionId)) {

      this.errorMessage.set(
        'Identifiant de l’intervention invalide.'
      );

      return;
    }


    this.id.set(interventionId);

    this.chargerIntervention();
  }


  /**
   * Récupère l'intervention depuis le backend.
   *
   * GET /interventions/{id}/
   */
  private chargerIntervention(): void {

    this.isLoading.set(true);
    this.errorMessage.set(null);


    this.interventionService
      .getById(this.id())
      .subscribe({

        next: (intervention) => {

          this.intervention.set(intervention);

          /*
           * Le backend peut déjà renvoyer
           * le rapport directement.
           */
          this.rapport.set(
            intervention.rapport
          );

          this.isLoading.set(false);


          /*
           * Si aucun rapport n'est inclus,
           * on vérifie avec l'endpoint dédié.
           */
          if (!intervention.rapport) {
            this.chargerRapport();
          }
        },


        error: (error) => {

          console.error(
            'Erreur lors du chargement de l’intervention :',
            error
          );

          this.isLoading.set(false);

          this.errorMessage.set(
            'Impossible de récupérer l’intervention.'
          );
        },
      });
  }


  /**
   * Récupère le rapport associé à l'intervention.
   *
   * GET /interventions/{id}/rapport/
   */
  private chargerRapport(): void {

    this.rapportService
      .getByIntervention(this.id())
      .subscribe({

        next: (rapport) => {

          this.rapport.set(rapport);
        },


        error: (error) => {

          /*
           * 404 = aucun rapport existant.
           */
          if (error.status === 404) {

            this.rapport.set(null);

            return;
          }


          console.error(
            'Erreur lors du chargement du rapport :',
            error
          );
        },
      });
  }


  /**
   * Sélection de la photo avant.
   */
  selectionnerPhotoAvant(event: Event): void {

    const input =
      event.target as HTMLInputElement;

    const file =
      input.files?.[0];

    if (!file) {
      return;
    }


    if (!file.type.startsWith('image/')) {

      this.errorMessage.set(
        'Veuillez sélectionner une image valide pour la photo avant.'
      );

      return;
    }


    const anciennePreview =
      this.photoAvantPreview();

    if (anciennePreview) {
      URL.revokeObjectURL(anciennePreview);
    }


    this.photoAvant.set(file);

    this.photoAvantPreview.set(
      URL.createObjectURL(file)
    );

    this.errorMessage.set(null);
  }


  /**
   * Sélection de la photo après.
   */
  selectionnerPhotoApres(event: Event): void {

    const input =
      event.target as HTMLInputElement;

    const file =
      input.files?.[0];

    if (!file) {
      return;
    }


    if (!file.type.startsWith('image/')) {

      this.errorMessage.set(
        'Veuillez sélectionner une image valide pour la photo après.'
      );

      return;
    }


    const anciennePreview =
      this.photoApresPreview();

    if (anciennePreview) {
      URL.revokeObjectURL(anciennePreview);
    }


    this.photoApres.set(file);

    this.photoApresPreview.set(
      URL.createObjectURL(file)
    );

    this.errorMessage.set(null);
  }


  /**
   * Envoie ou modifie le rapport.
   *
   * Aucun rapport :
   * POST /interventions/{id}/rapport/
   *
   * Rapport existant :
   * PATCH /interventions/{id}/rapport/
   */
  envoyerRapport(): void {

    const photoAvant =
      this.photoAvant();

    const photoApres =
      this.photoApres();

    const rapportExistant =
      this.rapport();


    /*
     * Pour une création, les deux photos sont obligatoires.
     */
    if (!rapportExistant && (!photoAvant || !photoApres)) {

      this.errorMessage.set(
        'Veuillez sélectionner les deux photos avant d’envoyer le rapport.'
      );

      return;
    }


    /*
     * Pour une modification, on peut modifier
     * une seule photo ou les deux.
     */
    if (rapportExistant && !photoAvant && !photoApres) {

      this.errorMessage.set(
        'Veuillez sélectionner au moins une photo à modifier.'
      );

      return;
    }


    this.envoiEnCours.set(true);
    this.errorMessage.set(null);


    /*
     * =====================================================
     * MODIFICATION
     * =====================================================
     */
    if (rapportExistant) {

      this.rapportService
        .update(this.id(), {

          photo_avant:
            photoAvant ?? undefined,

          photo_apres:
            photoApres ?? undefined,

          statut:
            rapportExistant.statut,
        })

        .subscribe({

          next: (rapport) => {

            this.rapport.set(rapport);

            this.envoiEnCours.set(false);

            this.router.navigate([
              '/agent/rapport-envoye',
              this.id(),
            ]);
          },


          error: (error) => {

            console.error(
              'Erreur lors de la modification du rapport :',
              error
            );

            this.envoiEnCours.set(false);

            this.errorMessage.set(
              this.getMessageErreurRapport(error)
            );
          },
        });

      return;
    }


    /*
     * =====================================================
     * CRÉATION
     * =====================================================
     */
    this.rapportService
      .create(this.id(), {

        photo_avant: photoAvant!,
        photo_apres: photoApres!,

        /*
         * À adapter si le backend utilise
         * une autre valeur.
         */
        statut: 'termine',
      })

      .subscribe({

        next: (rapport) => {

          this.rapport.set(rapport);

          this.envoiEnCours.set(false);

          this.router.navigate([
            '/agent/rapport-envoye',
            this.id(),
          ]);
        },


        error: (error) => {

          console.error(
            'Erreur lors de la création du rapport :',
            error
          );

          this.envoiEnCours.set(false);

          this.errorMessage.set(
            this.getMessageErreurRapport(error)
          );
        },
      });
  }


  /**
   * Transforme les erreurs backend en message lisible.
   */
  private getMessageErreurRapport(error: any): string {

    if (error?.error?.detail) {
      return error.error.detail;
    }

    if (error?.error?.message) {
      return error.error.message;
    }

    if (typeof error?.error === 'string') {
      return error.error;
    }

    if (error?.status === 400) {
      return 'Les données du rapport sont invalides.';
    }

    if (error?.status === 401) {
      return 'Votre session a expiré. Veuillez vous reconnecter.';
    }

    if (error?.status === 403) {
      return 'Vous n’avez pas les droits pour modifier ce rapport.';
    }

    if (error?.status === 404) {
      return 'Le rapport ou l’intervention est introuvable.';
    }

    return 'Impossible d’enregistrer le rapport.';
  }


  /**
   * Nettoyage des ObjectURL.
   */
  ngOnDestroy(): void {

    const photoAvantPreview =
      this.photoAvantPreview();

    const photoApresPreview =
      this.photoApresPreview();


    if (photoAvantPreview) {
      URL.revokeObjectURL(photoAvantPreview);
    }

    if (photoApresPreview) {
      URL.revokeObjectURL(photoApresPreview);
    }
  }
}
