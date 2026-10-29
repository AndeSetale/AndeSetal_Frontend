// ──────────────────────────────────────────────────────────────────────────────
// Écran : Accueil citoyen
// Affiche la salutation, le prochain événement Set-Setal et les 3 derniers
// signalements du citoyen connecté.
// Route : /mobile  (layout Mobile)
// ──────────────────────────────────────────────────────────────────────────────
import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SignalementService } from '../../core/services/signalement.service';
import { Signalement } from '../../core/models/signalement';

/** Représente un événement Set-Setal à venir */
interface EvenementSetSetal {
  mois: string;   // ex: "OCT"
  jour: number;   // ex: 14
  titre: string;
  lieu: string;
}

@Component({
  selector: 'app-accueil',
  imports: [CommonModule, RouterLink],
  templateUrl: './accueil.html',
  styleUrl: './accueil.css',
})
export class Accueil implements OnInit {
  // ── Injection ────────────────────────────────────────────────────────────────
  private readonly signalementService = inject(SignalementService);

  // ── Données mockées — prochain événement ─────────────────────────────────────
  // TODO BACKEND → remplacer par un appel à EvenementService quand disponible
  readonly evenement: EvenementSetSetal = {
    mois: 'OCT',
    jour: 14,
    titre: 'Nettoyage Marché Sandaga',
    lieu: 'Dakar Plateau',
  };

  // ── Nom du citoyen connecté ───────────────────────────────────────────────────
  // TODO BACKEND → récupérer depuis AuthService / ProfilService
  readonly nomCitoyen = signal('Citoyen');

  // ── Signalements récents (3 derniers) ────────────────────────────────────────
  private readonly tousSignalements = signal<Signalement[]>([]);

  /** Les 3 signalements les plus récents affichés dans la section "Récents" */
  readonly signalementsRecents = computed(() =>
    this.tousSignalements().slice(0, 3)
  );

  // ── Cycle de vie ──────────────────────────────────────────────────────────────
  ngOnInit(): void {
    // Charge les signalements et alimente le signal local
    this.signalementService.charger().subscribe(data =>
      this.tousSignalements.set(data)
    );
  }

  // ── Helpers d'affichage ───────────────────────────────────────────────────────

  /** Retourne les classes Tailwind du badge de statut */
  getStatutClasses(statut: string): string {
    const map: Record<string, string> = {
      nouveau:  'bg-orange-500 text-white',
      en_cours: 'bg-[#4CAF82] text-white',
      resolu:   'bg-[#1B5E3B] text-white',
    };
    return map[statut] ?? 'bg-gray-200 text-gray-600';
  }

  /** Traduit la clé statut en libellé français */
  getStatutLabel(statut: string): string {
    const map: Record<string, string> = {
      nouveau:  'Nouveau',
      en_cours: 'En cours',
      resolu:   'Résolu',
    };
    return map[statut] ?? statut;
  }

  /**
   * Retourne une date relative courte pour la liste des signalements récents.
   * ex: "hier", "10 Oct"
   */
  getDateCourte(dateIso: string): string {
    const date = new Date(dateIso);
    const aujourd = new Date();
    const hier    = new Date();
    hier.setDate(aujourd.getDate() - 1);

    const same = (a: Date, b: Date) =>
      a.getDate()    === b.getDate()    &&
      a.getMonth()   === b.getMonth()   &&
      a.getFullYear() === b.getFullYear();

    if (same(date, aujourd)) return "aujourd'hui";
    if (same(date, hier))    return 'hier';

    const mois = ['Jan','Fév','Mar','Avr','Mai','Juin',
                  'Juil','Août','Sep','Oct','Nov','Déc'];
    return `${date.getDate()} ${mois[date.getMonth()]}`;
  }

  /** Retourne le SVG inline de l'icône selon le type du signalement */
  getTypeIconSvg(type: string): string {
    const s = `stroke="#374151" stroke-width="1.8" stroke-linecap="round"`;
    const w = `width="20" height="20" viewBox="0 0 24 24" fill="none" ${s}`;
    const icons: Record<string, string> = {
      depot_sauvage: `<svg ${w}>
        <polyline points="3 6 5 6 21 6"/>
        <path d="M19 6l-1 14H6L5 6"/>
        <path d="M10 11v6M14 11v6"/>
        <path d="M9 6V4h6v2"/>
      </svg>`,
      egouts_bouches: `<svg ${w}>
        <path d="M12 2C6 10 4 14 4 16a8 8 0 0 0 16 0c0-2-2-6-8-14z"/>
      </svg>`,
      ordures_menageres: `<svg ${w}>
        <circle cx="12" cy="10" r="5"/>
        <line x1="12" y1="15" x2="12" y2="19"/>
        <line x1="9" y1="19" x2="15" y2="19"/>
      </svg>`,
      dechets_plastiques: `<svg ${w}>
        <path d="M12 22V12"/>
        <path d="M5 3s0 9 7 9 7-9 7-9"/>
      </svg>`,
      autre: `<svg ${w}>
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8" x2="12" y2="12"/>
        <line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>`,
    };
    return icons[type] ?? icons['autre'];
  }
}
