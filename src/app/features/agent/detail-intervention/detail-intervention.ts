import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-detail-intervention',
  standalone: true,
  imports: [],
  templateUrl: './detail-intervention.html',
  styleUrl: './detail-intervention.css',
})
export class DetailIntervention {

  interventionId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.interventionId = this.route.snapshot.paramMap.get('id');
  }

  retour(): void {
    this.router.navigate(['/agent/interventions']);
  }

  demarrerIntervention(): void {
    console.log("Démarrage de l'intervention :", this.interventionId);
  }
}