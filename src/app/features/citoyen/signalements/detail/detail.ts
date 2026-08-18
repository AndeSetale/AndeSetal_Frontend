// ──────────────────────────────────────────────────────────────────────────────
// Écran : Détail d'un signalement citoyen
// Photo pleine largeur, badge statut overlay, titre + icône type,
// badge urgence, géolocalisation, description en italique.
// Route : /mobile/signalements/:id
// ──────────────────────────────────────────────────────────────────────────────
import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SignalementService } from '../../../../core/services/signalement.service';
import { Signalement } from '../../../../core/models/signalement';

@Component({
  selector: 'app-detail-signalement',
  imports: [CommonModule, RouterLink],
  templateUrl: './detail.html',
  styleUrl: './detail.css',
})
export class DetailSignalement implements OnInit {
  // ── Injection des dépendances ─────────────────────────────────────────────────
  private readonly route              = inject(ActivatedRoute);
  private readonly signalementService = inject(SignalementService);

  // ── Signals réactifs ──────────────────────────────────────────────────────────
  /** Signalement chargé depuis le service (null si non trouvé) */
  incident   = signal<Signalement | null>(null);

  /** true pendant le chargement → affiche le spinner */
  chargement = signal(true);

  // ── Cycle de vie ──────────────────────────────────────────────────────────────
  ngOnInit(): void {
    // Récupère l'id dans l'URL (/mobile/signalements/:id)
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.signalementService.getById(id).subscribe(found => {
      this.incident.set(found ?? null);
      this.chargement.set(false);
    });
  }

  // ── Helpers d'affichage ───────────────────────────────────────────────────────

  /**
   * Retourne les classes Tailwind du badge de statut (overlay sur la photo).
   * Nouveau  → fond orange
   * En cours → fond vert clair
   * Résolu   → fond vert foncé
   */
  getStatutClasses(statut: string): string {
    const map: Record<string, string> = {
      nouveau:  'bg-orange-500 text-white',
      en_cours: 'bg-[#4CAF82] text-white',
      resolu:   'bg-[#1B5E3B] text-white',
    };
    return map[statut] ?? 'bg-gray-200 text-gray-700';
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
   * Retourne les classes Tailwind du badge urgence.
   * Critique → rouge vif | Modéré → orange | Léger → vert clair
   */
  getUrgenceClasses(urgence: string): string {
    const map: Record<string, string> = {
      critique: 'bg-red-600 text-white',
      modere:   'bg-orange-400 text-white',
      leger:    'bg-green-100 text-green-700',
    };
    return map[urgence] ?? 'bg-gray-200 text-gray-600';
  }

  /** Traduit la clé urgence en libellé majuscule comme dans la maquette */
  getUrgenceLabel(urgence: string): string {
    const map: Record<string, string> = {
      critique: 'CRITIQUE',
      modere:   'MODÉRÉ',
      leger:    'LÉGER',
    };
    return map[urgence] ?? urgence.toUpperCase();
  }

  /**
   * Retourne le SVG inline de l'icône selon le type du signalement.
   * Utilisé avec [innerHTML] dans le template.
   */
  getTypeIconSvg(type: string): string {
    const stroke = '#1B5E3B';
    const attrs  = `width="20" height="20" viewBox="0 0 24 24" fill="none"
                    stroke="${stroke}" stroke-width="1.8" stroke-linecap="round"`;
    const icons: Record<string, string> = {
      depot_sauvage: `<svg ${attrs}>
        <polyline points="3 6 5 6 21 6"/>
        <path d="M19 6l-1 14H6L5 6"/>
        <path d="M10 11v6M14 11v6"/>
        <path d="M9 6V4h6v2"/>
      </svg>`,
      egouts_bouches: `<svg ${attrs}>
        <path d="M12 2C6 10 4 14 4 16a8 8 0 0 0 16 0c0-2-2-6-8-14z"/>
      </svg>`,
      ordures_menageres: `<svg ${attrs}>
        <circle cx="12" cy="10" r="5"/>
        <line x1="12" y1="15" x2="12" y2="19"/>
        <line x1="9" y1="19" x2="15" y2="19"/>
      </svg>`,
      dechets_plastiques: `<svg ${attrs}>
        <path d="M12 22V12"/>
        <path d="M5 3s0 9 7 9 7-9 7-9"/>
      </svg>`,
      autre: `<svg ${attrs}>
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8" x2="12" y2="12"/>
        <line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>`,
    };
    return icons[type] ?? icons['autre'];
  }
}