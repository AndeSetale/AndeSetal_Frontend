import { Component } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-accueil-agent',
  imports: [DecimalPipe, RouterLink],
  templateUrl: './accueil-agent.html',
  styleUrl: './accueil-agent.css',
})
export class AccueilAgent {

    menuOuvert = false;

  toggleMenu(): void {
    this.menuOuvert = !this.menuOuvert;
  }

  fermerMenu(): void {
    this.menuOuvert = false;
  }

  agent = {
    nom: 'Moussa',
    matricule: '#SN-204',
    zone: 'Plateau',
    photo: 'https://placehold.co/40x40'
  };

  statistiques = {
    interventionsTerminees: 12,
    interventionsEnAttente: 4
  };

  interventionPrioritaire = {
    categorie: 'ASSAINISSEMENT',
    titre: 'Obstruction majeure du caniveau',
    description:
      'Obstruction majeure signalée près du marché Sandaga. Risque d’inondation sur la voie principale.',
    adresse: 'Avenue Lamine Gueye',
    distance: '1.2 km',
    urgence: 'URGENCE CRITIQUE',
    sla: '2h restantes',
    image: 'https://placehold.co/354x160'
  };

interventionsRecentes = [
  {
    titre: 'Zone Marché Sandaga',
    description: 'Collecte de déchets volumineux',
    statut: 'Terminé',
    date: "Aujourd'hui, 09:15",
    image: 'https://placehold.co/64x64',
    statutCouleur: '#E5EEEA',
    texteCouleur: '#004030'
  },
  {
    titre: "Place de l'Indépendance",
    description: 'Entretien des espaces verts',
    statut: 'En cours',
    date: 'Il y a 2 heures',
    image: 'https://placehold.co/64x64',
    statutCouleur: '#FFE8DC',
    texteCouleur: '#92400E'
  }
];

}