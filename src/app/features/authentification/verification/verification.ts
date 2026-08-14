import {
  Component,
  ElementRef,
  QueryList,
  ViewChildren,
  signal,
  inject,
  OnInit
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Auth } from '../../../core/services/auth';

@Component({
  selector: 'app-verification',
  imports: [],
  templateUrl: './verification.html',
  styleUrl: './verification.css',
})
export class Verification implements OnInit {

  private readonly auth = inject(Auth);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  email = signal('');
  chargement = signal(false);
  erreur = signal<string | null>(null);
  compteur = signal(60);
  messageSucces = signal<string | null>(null);

  // Code de vérification saisi par l'utilisateur
  codeVerification = signal<string[]>(['', '', '', '', '', '']);

  @ViewChildren('champOtp')
  champsOtp!: QueryList<ElementRef<HTMLInputElement>>;

  // Enregistre un chiffre saisi dans le code OTP et passe automatiquement au champ suivant
  saisirChiffre(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;

    // Garder uniquement le chiffre saisi
    const valeur = input.value.replace(/\D/g, '').slice(0, 1);

    // Remettre la valeur nettoyée dans le champ
    input.value = valeur;

    // Enregistrer la valeur dans le signal
    this.codeVerification.update(code => {
      const nouveauCode = [...code];
      nouveauCode[index] = valeur;
      return nouveauCode;
    });

    // Passer automatiquement au champ suivant
    if (valeur && index < 5) {
      this.champsOtp.get(index + 1)?.nativeElement.focus();
    }
  }

  // Gère la touche Retour arrière dans les champs OTP
  gererTouche(event: KeyboardEvent, index: number): void {
    if (event.key === 'Backspace' && !this.codeVerification()[index]) {

      const champPrecedent = index - 1;

      if (champPrecedent >= 0) {
        this.champsOtp.get(champPrecedent)?.nativeElement.focus();
      }
    }
  }

  // Vérifie le code saisi
  verifierCode(): void {
    this.erreur.set(null);

    const code = this.codeVerification().join('');
    const email = this.email();

    if (code.length !== 6) {
      this.erreur.set('Veuillez saisir le code complet.');
      return;
    }

    if (!email) {
      this.erreur.set('Adresse email introuvable.');
      return;
    }

    this.chargement.set(true);

    this.auth.verifierEmail(email, code).subscribe({

      next: (reponse) => {
        console.log('Email vérifié :', reponse);

        this.chargement.set(false);

        this.router.navigate(['/connexion']);
      },

      error: (erreur) => {
        console.error('Erreur de vérification :', erreur);

        this.chargement.set(false);

        this.erreur.set(
          'Code incorrect ou expiré.'
        );
      }

    });
  }

    demarrerCompteur(): void {
      const interval = setInterval(() => {
        this.compteur.update(valeur => {
          if (valeur <= 1) {
            clearInterval(interval);
            return 0;
          }

          return valeur - 1;
        });
      }, 1000);
  }

  // Gère le collage complet du code OTP
  collerCode(event: ClipboardEvent, index: number): void {
    event.preventDefault();

    const texteColle = event.clipboardData?.getData('text') ?? '';

    // Garder uniquement les chiffres
    const chiffres = texteColle.replace(/\D/g, '');

    if (!chiffres) {
      return;
    }

    this.codeVerification.update(code => {
      const nouveauCode = [...code];

      // Remplir les champs à partir du champ actuel
      for (let i = 0; i < chiffres.length && index + i < nouveauCode.length; i++) {
        nouveauCode[index + i] = chiffres[i];
      }

      return nouveauCode;
    });

    // Calculer la position du dernier chiffre rempli
    const dernierePosition = Math.min(
      index + chiffres.length,
      this.codeVerification().length
    );

    // Aller au prochain champ disponible
    const prochainChamp = this.champsOtp.get(dernierePosition);

    if (prochainChamp) {
      prochainChamp.nativeElement.focus();
    } else {
      // Si le code est complètement rempli,
      // garder le focus sur le dernier champ
      this.champsOtp
        .get(this.codeVerification().length - 1)
        ?.nativeElement.focus();
    }
  }

  ngOnInit(): void {
    const email = this.route.snapshot.queryParamMap.get('email');

    if (email) {
      this.email.set(email);
    }

    this.demarrerCompteur();
  }

    renvoyerCode(): void {
      const email = this.email();

      if (!email) {
        this.erreur.set('Adresse email introuvable.');
        return;
      }

      this.erreur.set(null);
      this.messageSucces.set(null);

      this.auth.renvoyerCode(email).subscribe({

        next: (reponse) => {
          console.log('Nouveau code envoyé :', reponse);

          this.messageSucces.set(
            'Un nouveau code a été envoyé à votre adresse email.'
          );

          this.compteur.set(60);
          this.demarrerCompteur();
        },

        error: (erreur) => {
          console.error('Erreur lors du renvoi du code :', erreur);

          this.erreur.set(
            'Impossible de renvoyer le code. Veuillez réessayer.'
          );
        }

      });
  }
}
