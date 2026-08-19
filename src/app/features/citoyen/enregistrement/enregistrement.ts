import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IncidentService } from '../../../core/services/incident.service';

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

  aiClassification = {
    type: 'Dépôt sauvage',
    urgence: 'Critique',
    confiance: '96%',
  };

  constructor(
    private router: Router,
    private incidentService: IncidentService
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
    this.incidentService.addIncident({
      titre: `Signalement ${this.aiClassification.type}`,
      description: this.description,
      type: 'depot_sauvage',
      urgence: 'critique',
    }).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.router.navigate(['/mobile/confirmation']);
      },
      error: () => {
        this.isSubmitting = false;
        this.router.navigate(['/mobile/confirmation']);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/mobile/scan']);
  }
}
