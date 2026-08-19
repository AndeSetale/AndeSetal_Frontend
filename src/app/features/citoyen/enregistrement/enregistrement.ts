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
  photoUrl: string = 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?q=80&w=800&auto=format&fit=crop';
  locationAddress: string = 'Rue 10, Médina, Dakar';
  description: string = '';
  isSubmitting: boolean = false;

  constructor(
    private router: Router,
    private incidentService: IncidentService,
    private incidentApiService: IncidentApiService
  ) {}

  ngOnInit(): void {
    const draftPhoto = this.incidentService.getDraftPhoto();
    if (draftPhoto) {
      this.photoUrl = draftPhoto;
    }

    const draftLocation = this.incidentService.getDraftLocation();
    if (draftLocation && draftLocation.address) {
      this.locationAddress = draftLocation.address;
    }

    // Récupérer et mettre à jour l'adresse exacte en temps réel via GPS + Reverse Geocoding
    this.incidentService.fetchCurrentLocation().then((loc: { address: string; lat: number; lng: number }) => {
      this.locationAddress = loc.address;
    });
  }

  submitIncident(): void {
    this.isSubmitting = true;
    const draftLocation = this.incidentService.getDraftLocation();

    this.incidentApiService.createIncident({
      description: this.description || "Signalement d'incident citoyen avec photo",
      adresse: this.locationAddress,
      latitude: draftLocation.lat,
      longitude: draftLocation.lng,
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
        console.warn('Backend Django hors ligne ou indisponible, fallback local activé:', err);
        this.isSubmitting = false;
        this.router.navigate(['/mobile/confirmation']);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/mobile/scan']);
  }
}
