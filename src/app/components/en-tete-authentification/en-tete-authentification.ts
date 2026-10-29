import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-en-tete-authentification',
  imports: [],
  templateUrl: './en-tete-authentification.html',
  styleUrl: './en-tete-authentification.css',
})
export class EnTeteAuthentification {

  private router = inject(Router);

  allerVersConnexion(): void {
    this.router.navigate(['/connexion']);
  }
    allerVersInscription(): void {
    this.router.navigate(['/inscription']);
  }

  retourner(): void {
    this.router.navigate(['/']);
  }

  estSurConnexion(): boolean {
    return this.router.url === '/connexion';
  }

  estSurInscription(): boolean {
    return this.router.url === '/inscription';
  }
}
