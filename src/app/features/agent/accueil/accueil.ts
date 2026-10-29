import { Component, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

import { AgentDetail, AgentService } from '../../../core/services/agent.service';
import { InterventionService } from '../../../core/services/intervention';
import { Intervention } from '../../../core/models/intervention';
import { urlMedia } from '../../../core/utils/media';

const ORDRE_PRIORITE = { critique: 0, urgent: 1, modere: 2, routine: 3 } as const;

const LIBELLES_URGENCE = {
  critique: 'URGENCE CRITIQUE',
  urgent: 'URGENCE ÉLEVÉE',
  modere: 'URGENCE MODÉRÉE',
  routine: 'ROUTINE',
} as const;

@Component({
  selector: 'app-accueil',
  imports: [DecimalPipe, RouterLink],
  templateUrl: './accueil.html',
  styleUrl: './accueil.css',
})
export class AccueilAgent {

  private readonly agentService = inject(AgentService);
  private readonly interventionService = inject(InterventionService);
  private readonly router = inject(Router);

  menuOuvert = false;

  readonly chargement = signal(true);

  /** Profil + indicateurs de l'agent connecté (GET /api/agents/me/) */
  private readonly profil = signal<AgentDetail | null>(null);

  constructor() {
    this.agentService.getMonProfil().subscribe(profil => this.profil.set(profil));
    this.interventionService.charger().subscribe({
      next: () => this.chargement.set(false),
      error: () => this.chargement.set(false),
    });
  }

  toggleMenu(): void {
    this.menuOuvert = !this.menuOuvert;
  }

  fermerMenu(): void {
    this.menuOuvert = false;
  }

  ouvrir(id: number): void {
    this.router.navigate(['/agent/interventions', id]);
  }

  get agent() {
    const profil = this.profil();
    const nom = profil?.nom_complet ?? '';

    return {
      nom: nom.split(' ')[0] || 'Agent',
      initiale: (nom.charAt(0) || 'A').toUpperCase(),
      matricule: profil ? `#${profil.matricule}` : '',
      zone: profil?.quartier || profil?.departement || 'Dakar Plateau',
      photo: urlMedia(profil?.photo_profil),
    };
  }

  get statistiques() {
    const profil = this.profil();

    return {
      interventionsTerminees: profil?.interventions_terminees ?? 0,
      interventionsEnAttente: (profil?.interventions_en_attente ?? 0) + (profil?.interventions_en_cours ?? 0),
    };
  }

  /**
   * Intervention à traiter en priorité : non terminée, la plus urgente
   * puis la plus ancienne.
   */
  get interventionPrioritaire() {
    const aTraiter = this.interventionService
      .interventions()
      .filter(intervention => intervention.statut !== 'terminee')
      .sort((a, b) =>
        ORDRE_PRIORITE[a.priorite] - ORDRE_PRIORITE[b.priorite]
        || (a.dateAssignation ?? '').localeCompare(b.dateAssignation ?? '')
      );

    const intervention = aTraiter[0];

    if (!intervention) {
      return null;
    }

    return {
      id: intervention.id,
      categorie: intervention.categorie.toUpperCase(),
      titre: intervention.titre,
      description: intervention.description,
      adresse: intervention.adresse,
      distance: intervention.distance ?? '',
      urgence: LIBELLES_URGENCE[intervention.priorite],
      sla: intervention.sla === 'Dépassé' ? 'Délai dépassé' : `${intervention.sla} restantes`,
      image: intervention.image,
      action: intervention.statut === 'en_cours' ? 'Envoyer le rapport' : "Démarrer l'intervention",
    };
  }

  /** Les 5 interventions les plus récentes */
  get interventionsRecentes() {
    return [...this.interventionService.interventions()]
      .sort((a, b) => (b.dateAssignation ?? '').localeCompare(a.dateAssignation ?? ''))
      .slice(0, 5)
      .map(intervention => ({
        id: intervention.id,
        titre: intervention.adresse,
        description: intervention.titre,
        image: intervention.image,
        date: dateRelative(intervention.dateFin ?? intervention.dateDebut ?? intervention.dateAssignation),
        ...styleStatut(intervention),
      }));
  }
}

function styleStatut(intervention: Intervention) {
  switch (intervention.statut) {
    case 'terminee':
      return { statut: 'Terminé', statutCouleur: '#E5EEEA', texteCouleur: '#004030' };
    case 'en_cours':
      return { statut: 'En cours', statutCouleur: '#FFE8DC', texteCouleur: '#92400E' };
    default:
      return { statut: 'À démarrer', statutCouleur: '#E0E7FF', texteCouleur: '#3730A3' };
  }
}

function dateRelative(date?: string): string {
  if (!date) {
    return '';
  }

  const d = new Date(date);
  const minutes = Math.round((Date.now() - d.getTime()) / 60000);
  const heure = d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

  if (minutes < 60) {
    return `Il y a ${Math.max(minutes, 1)} min`;
  }
  if (d.toDateString() === new Date().toDateString()) {
    return `Aujourd'hui, ${heure}`;
  }
  return `${d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}, ${heure}`;
}
