import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';

interface Incident {
  id: string;
  type: string;
  quartier: string;
  adresse: string;
  date: string;
  urgence: 'CRITIQUE' | 'ELEVE' | 'MODERE' | 'ROUTINE';
  statut: 'NOUVEAU' | 'EN_COURS' | 'RESOLU';
  description: string;
}

@Component({
  selector: 'app-incidents',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './incidents.html',
  styleUrl: './incidents.css',
})
export class Incidents {

  incidents = signal<Incident[]>([
    {
      id: 'INC-2026-001',
      type: 'Dépôt sauvage de déchets',
      quartier: 'Plateau',
      adresse: 'Rue de Thiong, Plateau',
      date: '12 août 2026 à 08:30',
      urgence: 'CRITIQUE',
      statut: 'NOUVEAU',
      description: 'Accumulation importante de déchets sur la voie publique.',
    },
    {
      id: 'INC-2026-002',
      type: 'Éclairage public',
      quartier: 'Médina',
      adresse: 'Avenue Blaise Diagne',
      date: '11 août 2026 à 19:15',
      urgence: 'MODERE',
      statut: 'EN_COURS',
      description: 'Lampadaire hors service.',
    },
    {
      id: 'INC-2026-004',
      type: 'Dépôt sauvage de déchets',
      quartier: 'Plateau',
      adresse: 'Rue de Thiong, Plateau',
      date: '12 août 2026 à 08:30',
      urgence: 'CRITIQUE',
      statut: 'NOUVEAU',
      description: 'Accumulation importante de déchets sur la voie publique.',
    },
    {
      id: 'INC-2026-005',
      type: 'Dépôt sauvage de déchets',
      quartier: 'Plateau',
      adresse: 'Rue de Thiong, Plateau',
      date: '12 août 2026 à 08:30',
      urgence: 'CRITIQUE',
      statut: 'NOUVEAU',
      description: 'Accumulation importante de déchets sur la voie publique.',
    },
  ]);

  // -----------------------------
  // Filtres
  // -----------------------------

  search = signal('');

  selectedType = signal('Tous');

  selectedUrgence = signal('Tous');

  selectedStatut = signal('Tous');

  // -----------------------------
  // Valeurs disponibles
  // -----------------------------

  types = computed(() => [
    ...new Set(this.incidents().map(incident => incident.type))
  ]);

  urgences = [
    'CRITIQUE',
    'ELEVE',
    'MODERE',
    'ROUTINE'
  ];

  statuts = [
    'NOUVEAU',
    'EN_COURS',
    'RESOLU'
  ];

  // -----------------------------
  // Incidents filtrés
  // -----------------------------

  filteredIncidents = computed(() => {

    const search = this.search().toLowerCase().trim();
    const type = this.selectedType();
    const urgence = this.selectedUrgence();
    const statut = this.selectedStatut();

    return this.incidents().filter(incident => {

      const matchesSearch =
        !search ||
        incident.id.toLowerCase().includes(search) ||
        incident.type.toLowerCase().includes(search) ||
        incident.quartier.toLowerCase().includes(search) ||
        incident.adresse.toLowerCase().includes(search);

      const matchesType =
        type === 'Tous' ||
        incident.type === type;

      const matchesUrgence =
        urgence === 'Tous' ||
        incident.urgence === urgence;

      const matchesStatut =
        statut === 'Tous' ||
        incident.statut === statut;

      return (
        matchesSearch &&
        matchesType &&
        matchesUrgence &&
        matchesStatut
      );
    });
  });

  // -----------------------------
  // Incident sélectionné
  // -----------------------------

  selectedIncident = signal<Incident | null>(
    this.incidents()[0]
  );

  selectIncident(incident: Incident) {
    this.selectedIncident.set(incident);
  }

  // -----------------------------
  // Modification des filtres
  // -----------------------------

  setSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    this.search.set(input.value);
  }

  setType(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.selectedType.set(select.value);
  }

  setUrgence(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.selectedUrgence.set(select.value);
  }

  setStatut(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.selectedStatut.set(select.value);
  }

  // -----------------------------
  // Réinitialiser
  // -----------------------------

  resetFilters() {
    this.search.set('');
    this.selectedType.set('Tous');
    this.selectedUrgence.set('Tous');
    this.selectedStatut.set('Tous');
  }

  // -----------------------------
  // Badge urgence
  // -----------------------------

  badgeClass(level: Incident['urgence']) {

    switch (level) {

      case 'CRITIQUE':
        return 'bg-red-100 text-red-700';

      case 'ELEVE':
        return 'bg-orange-100 text-orange-700';

      case 'MODERE':
        return 'bg-yellow-100 text-yellow-700';

      default:
        return 'bg-green-100 text-green-700';
    }
  }
}