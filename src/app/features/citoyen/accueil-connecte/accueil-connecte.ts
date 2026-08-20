// ──────────────────────────────────────────────────────────────────────────────
// Écran : Accueil citoyen connecté
// Affiche logo + avatar, salutation, prochain événement Set-Setal,
// et les 3 derniers signalements du citoyen.
// Route : /mobile  (enfant du layout Mobile)
// ──────────────────────────────────────────────────────────────────────────────
import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SignalementService } from '../../../core/services/signalement.service';
import { ProfilService } from '../../../core/services/profil.service';
import { Signalement } from '../../../core/models/signalement';

@Component({
  selector: 'app-accueil-connecte',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './accueil-connecte.html',
  styleUrl: './accueil-connecte.css',
})
export class AccueilConnecte implements OnInit {
  // ── Injection ────────────────────────────────────────────────────────────────
  private readonly signalementService = inject(SignalementService);
  private readonly profilService      = inject(ProfilService);

  // ── Profil citoyen (nom pour la salutation, avatar) ──────────────────────────
  readonly profil = this.profilService.profil;

  // ── Signalements récents (3 premiers) ────────────────────────────────────────
  private readonly _tousSignalements = signal<Signalement[]>([]);

  /** Les 3 signalements les plus récents */
  readonly signalementsRecents = computed(() =>
    this._tousSignalements().slice(0, 3)
  );

  // ── Cycle de vie ──────────────────────────────────────────────────────────────
  ngOnInit(): void {
    // Charge le profil pour avoir le nom affiché dans la salutation
    this.profilService.charger().subscribe();
    // Charge les signalements
    this.signalementService.charger().subscribe(data =>
      this._tousSignalements.set(data)
    );
  }

  // ── Helpers d'affichage ───────────────────────────────────────────────────────

  /** Prénom affiché dans "Bonjour, X" */
  getNomAffiche(): string {
    const p = this.profil();
    return p ? p.prenom : 'Citoyen';
  }

  /** Initiale pour l'avatar placeholder */
  getInitiale(): string {
    const p = this.profil();
    return p ? p.prenom.charAt(0).toUpperCase() : 'C';
  }

  getStatutClasses(statut: string): string {
    const map: Record<string, string> = {
      NOUVEAU:  'bg-orange-400 text-amber-900',
      EN_COURS: 'bg-green-300 text-emerald-900',
      RESOLU:   'bg-emerald-900 text-white',
    };
    return map[statut] ?? 'bg-gray-200 text-gray-600';
  }

  getStatutLabel(statut: string): string {
    const map: Record<string, string> = {
      NOUVEAU:  'Nouveau',
      EN_COURS: 'En cours',
      RESOLU:   'Résolu',
    };
    return map[statut] ?? statut;
  }

  getDateCourte(dateIso: string): string {
    const date   = new Date(dateIso);
    const aujour = new Date();
    const hier   = new Date();
    hier.setDate(aujour.getDate() - 1);

    const same = (a: Date, b: Date) =>
      a.getDate() === b.getDate() &&
      a.getMonth() === b.getMonth() &&
      a.getFullYear() === b.getFullYear();

    if (same(date, aujour)) return "aujourd'hui";
    if (same(date, hier))   return 'hier';

    const mois = ['Jan','Fév','Mar','Avr','Mai','Juin',
                  'Juil','Août','Sep','Oct','Nov','Déc'];
    return `${date.getDate()} ${mois[date.getMonth()]}`;
  }

  getTypeIconSvg(type: string): string {
    const a = `width="20" height="20" viewBox="0 0 24 24" fill="none"
               stroke="#374151" stroke-width="1.8" stroke-linecap="round"`;
    const icons: Record<string, string> = {
      DECHETS:          `<svg ${a}><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>`,
      CANAUX:           `<svg ${a}><path d="M12 2C6 10 4 14 4 16a8 8 0 0 0 16 0c0-2-2-6-8-14z"/></svg>`,
      ECLAIRAGE_PUBLIC: `<svg ${a}><circle cx="12" cy="10" r="5"/><line x1="12" y1="15" x2="12" y2="19"/><line x1="9" y1="19" x2="15" y2="19"/></svg>`,
      ARBRE:            `<svg ${a}><path d="M12 22V12"/><path d="M5 3s0 9 7 9 7-9 7-9"/></svg>`,
      VOIRIE:           `<svg ${a}><path d="M3 3h18v2H3zM3 10h18v2H3zM3 17h18v2H3z"/></svg>`,
      FUITE_EAU:        `<svg ${a}><path d="M12 2C6 10 4 14 4 16a8 8 0 0 0 16 0c0-2-2-6-8-14z"/><line x1="12" y1="13" x2="12" y2="16"/></svg>`,
    };
    const fallback = `<svg ${a}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`;
    return icons[type] ?? fallback;
  }
}
