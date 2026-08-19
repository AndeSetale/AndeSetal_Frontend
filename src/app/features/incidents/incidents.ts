import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { IncidentService } from '../../core/services/incident.service';

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

    private readonly incidentService = inject(IncidentService);

  incidents = signal<Incident[]>([]);
  chargement = signal(true);
  erreur = signal<string | null>(null);
  selectedIncident = signal<Incident | null>(null);

  constructor() {
    this.incidentService.getIncidents().subscribe({
      next: (data) => {
        this.incidents.set(data);
        this.selectedIncident.set(data[0] ?? null);
        this.chargement.set(false);
      },
      error: () => {
        this.erreur.set("Impossible de charger les incidents.");
        this.chargement.set(false);
      },
    });
  }
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



  selectIncident(incident: Incident) {
    this.selectedIncident.set(incident);
  }

  // -----------------------------
  // Modification des filtres
  // -----------------------------

 setSearch(event: Event) {
  const input = event.target as HTMLInputElement;

  this.search.set(input.value);
  this.currentPage.set(1);
}

setType(event: Event) {
  const select = event.target as HTMLSelectElement;

  this.selectedType.set(select.value);
  this.currentPage.set(1);
}

setUrgence(event: Event) {
  const select = event.target as HTMLSelectElement;

  this.selectedUrgence.set(select.value);
  this.currentPage.set(1);
}

setStatut(event: Event) {
  const select = event.target as HTMLSelectElement;

  this.selectedStatut.set(select.value);
  this.currentPage.set(1);
}

  // -----------------------------
  // Réinitialiser
  // -----------------------------

  resetFilters() {
  this.search.set('');
  this.selectedType.set('Tous');
  this.selectedUrgence.set('Tous');
  this.selectedStatut.set('Tous');

  this.currentPage.set(1);
}

  currentPage = signal(1);
pageSize = 6;

totalPages = computed(() =>
  Math.ceil(this.filteredIncidents().length / this.pageSize)
);

paginatedIncidents = computed(() => {
  const incidents = this.filteredIncidents();
  const start = (this.currentPage() - 1) * this.pageSize;

  return incidents.slice(start, start + this.pageSize);
});

paginationStart = computed(() => {
  const total = this.filteredIncidents().length;

  if (total === 0) {
    return 0;
  }

  return (this.currentPage() - 1) * this.pageSize + 1;
});

paginationEnd = computed(() => {
  const total = this.filteredIncidents().length;

  return Math.min(
    this.currentPage() * this.pageSize,
    total
  );
});

nextPage() {
  if (this.currentPage() < this.totalPages()) {
    this.currentPage.update(page => page + 1);
  }
}

previousPage() {
  if (this.currentPage() > 1) {
    this.currentPage.update(page => page - 1);
  }
}

goToPage(page: number) {
  if (page >= 1 && page <= this.totalPages()) {
    this.currentPage.set(page);
  }
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