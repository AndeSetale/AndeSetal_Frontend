import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-accueil-citoyen',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './accueil.html',
  styleUrl: './accueil.css',
})
export class AccueilComponent {
  private router = inject(Router);

  goToScan(): void {
    this.router.navigate(['/mobile/scan']);
  }

  goToConnexion(): void {
    this.router.navigate(['/connexion']);
  }
}
