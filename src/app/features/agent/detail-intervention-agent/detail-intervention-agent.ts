import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-detail-intervention-agent',
  standalone: true,
  imports: [],
  templateUrl: './detail-intervention-agent.html',
  styleUrl: './detail-intervention-agent.css',
})
export class DetailInterventionAgent {

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