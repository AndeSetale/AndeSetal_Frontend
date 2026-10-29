import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IncidentService } from '../../../core/services/incident.service';
import { IncidentApiService, IncidentResponse } from '../../../core/services/incident-api.service';

@Component({
  selector: 'app-enregistrement',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './enregistrement.html',
  styleUrl: './enregistrement.css',
})
export class EnregistrementComponent implements OnInit {
  photoUrl: string = '';
  locationAddress: string = '';
  /** true si la position vient du GPS (sinon le citoyen saisit l'adresse) */
  gpsDisponible: boolean = false;
  localisationEnCours: boolean = true;
  erreur: string | null = null;
  /** Coordonnées réellement envoyées au backend, affichées pour contrôle */
  coordonnees: string = '';
  description: string = '';
  isSubmitting: boolean = false;

  constructor(
    private router: Router,
    private incidentService: IncidentService,
    private incidentApiService: IncidentApiService
  ) {}

  ngOnInit(): void {
    const draftPhoto = this.incidentService.getDraftPhoto();
    if (!draftPhoto) {
      // Pas de photo prise : retour à l'écran de capture
      this.router.navigate(['/mobile/scan']);
      return;
    }
    this.photoUrl = draftPhoto;

    const draftLocation = this.incidentService.getDraftLocation();
    if (draftLocation && draftLocation.address) {
      this.locationAddress = draftLocation.address;
    }

    // Récupérer et mettre à jour l'adresse exacte en temps réel via GPS + Reverse Geocoding
    this.localiser();
  }

  /** Lit la position GPS actuelle (relançable si la position a changé) */
  localiser(): void {
    this.localisationEnCours = true;
    this.incidentService.fetchCurrentLocation().then(loc => {
      this.gpsDisponible = loc.lat !== null;
      this.locationAddress = loc.address || this.locationAddress;
      this.coordonnees = loc.lat !== null && loc.lng !== null
        ? `${loc.lat.toFixed(5)}, ${loc.lng.toFixed(5)}`
        : '';
      this.localisationEnCours = false;
    });
  }

  submitIncident(): void {
    this.isSubmitting = true;
    this.erreur = null;
    const draftLocation = this.incidentService.getDraftLocation();

    this.incidentApiService.createIncident({
      description: this.description || "Signalement d'incident citoyen avec photo",
      adresse: this.locationAddress,
      latitude: draftLocation.lat ?? undefined,
      longitude: draftLocation.lng ?? undefined,
      photoUrl: this.photoUrl,
    }).subscribe({
      next: (res: IncidentResponse) => {
        this.isSubmitting = false;
        if (res && res.reference) {
          this.incidentService.setLastTicketReference(res.reference);
        }
        this.router.navigate(['/mobile/confirmation']);
      },
      error: (err) => {
        // Le signalement n'est PAS enregistré : on reste sur la page avec le motif
        this.isSubmitting = false;
        const detail = err?.error;
        this.erreur =
          detail?.non_field_errors?.[0]
          ?? detail?.image?.[0]
          ?? detail?.detail
          ?? (err?.status === 0
            ? 'Serveur injoignable. Vérifiez votre connexion puis réessayez.'
            : "L'envoi du signalement a échoué, veuillez réessayer.");
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/mobile/scan']);
  }
}
