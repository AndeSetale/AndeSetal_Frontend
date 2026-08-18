// ──────────────────────────────────────────────────────────────────────────────
// Écran : Historique des signalements du citoyen
// Liste tous les signalements avec filtrage par statut.
// Route : /mobile/signalements
// ──────────────────────────────────────────────────────────────────────────────
import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SignalementService } from '../../../../core/services/signalement.service';
import { Signalement, StatutSignalement } from '../../../../core/models/signalement';

// Type union des clés de filtre disponibles dans la barre de filtres
type Filtre = 'tous' | StatutSignalement;

@Component({
  selector: 'app-historique',
  imports: [CommonModule, RouterLink],
  templateUrl: './historique.html',
  styleUrl: './historique.css',
})
export class Historique implements OnInit {
  // ── Injection via inject() (style Angular moderne / signal-based) ─────────────
  private readonly signalementService = inject(SignalementService);

  // ── Signals d'état ────────────────────────────────────────────────────────────
  /** Liste complète des signalements chargés depuis le service */
  tous = signal<Signalement[]>([]);

  /** Filtre actif (tous / nouveau / en_cours / resolu) */
  filtre = signal<Filtre>('tous');

  // ── Configuration des boutons de filtre (ordre maquette) ─────────────────────
  readonly filtres: { cle: Filtre; label: string }[] = [
    { cle: 'tous',     label: 'Tous'      },
    { cle: 'nouveau',  label: 'Nouveaux'  },
    { cle: 'en_cours', label: 'En cours'  },
    { cle: 'resolu',   label: 'Résolus'   },
  ];

  // ── Signal computed : liste filtrée ──────────────────────────────────────────
  /** Recalculé automatiquement à chaque changement de `tous` ou `filtre` */
  resultats = computed(() => {
    const liste = this.tous();
    // Filtre par statut (ignoré si "tous" est sélectionné)
    if (this.filtre() !== 'tous') {
      return liste.filter(s => s.statut === this.filtre());
    }
    return liste;
  });

  // ── Cycle de vie ──────────────────────────────────────────────────────────────
  ngOnInit(): void {
    // Charge les signalements depuis le service au démarrage du composant
    this.signalementService.charger().subscribe(data => this.tous.set(data));
  }

  // ── Méthodes de mise à jour des signals ──────────────────────────────────────
  /** Met à jour le filtre actif depuis les boutons pill */
  setFiltre(f: Filtre): void { this.filtre.set(f); }

  // ── Helpers d'affichage ───────────────────────────────────────────────────────

  /**
   * Retourne les classes Tailwind du badge de statut.
   * Couleurs fidèles à la maquette :
   *   Nouveau  → fond orange vif
   *   En cours → fond vert clair
   *   Résolu   → fond vert foncé (couleur principale)
   */
  getStatutClasses(statut: string): string {
    const map: Record<string, string> = {
      tous:     'bg-[#004333] text-white',
      nouveau:  'bg-orange-500 text-white',
      en_cours: 'bg-[#4CAF82] text-white',
      resolu:   'bg-[#1B5E3B] text-white',
    };
    return map[statut] ?? 'bg-gray-200 text-gray-600';
  }

  /** Traduit la clé statut en libellé affiché dans le badge */
  getStatutLabel(statut: string): string {
    const map: Record<string, string> = {
      nouveau:  'Nouveau',
      en_cours: 'En cours',
      resolu:   'Résolu',
    };
    return map[statut] ?? statut;
  }

  /**
   * Retourne une date relative en français comme dans la maquette :
   * "Aujourd'hui", "Hier", ou "5 Octobre"
   */
  getDateRelative(dateIso: string): string {
    const date = new Date(dateIso);
    const aujourd = new Date();
    const hier    = new Date();
    hier.setDate(aujourd.getDate() - 1);

    // Comparer uniquement la partie date (sans heure)
    const same = (a: Date, b: Date) =>
      a.getDate() === b.getDate() &&
      a.getMonth() === b.getMonth() &&
      a.getFullYear() === b.getFullYear();

    if (same(date, aujourd)) return "Aujourd'hui";
    if (same(date, hier))    return 'Hier';

    // Sinon : "5 Octobre"
    const mois = [
      'Janvier','Février','Mars','Avril','Mai','Juin',
      'Juillet','Août','Septembre','Octobre','Novembre','Décembre'
    ];
    return `${date.getDate()} ${mois[date.getMonth()]}`;
  }
}