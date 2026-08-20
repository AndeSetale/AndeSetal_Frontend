import { Component, inject } from '@angular/core';
import { AccueilComponent } from '../accueil/accueil';
import { AccueilConnecte } from '../accueil-connecte/accueil-connecte';
import { Auth } from '../../../core/services/auth';


@Component({
  selector: 'app-accueil-parent',
  standalone: true,
  imports: [
    AccueilComponent,
    AccueilConnecte
  ],
  templateUrl: './accueil-parent.html',
})
export class AccueilParent {

  private readonly auth = inject(Auth);

  estConnecte(): boolean {
    return this.auth.estConnecte();
  }
}