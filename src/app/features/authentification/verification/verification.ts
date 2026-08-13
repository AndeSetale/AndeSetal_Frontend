import {
  Component,
  ElementRef,
  QueryList,
  ViewChildren,
  signal
} from '@angular/core';

@Component({
  selector: 'app-verification',
  imports: [],
  templateUrl: './verification.html',
  styleUrl: './verification.css',
})
export class Verification {
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
    const code = this.codeVerification().join('');

    console.log('Code saisi :', code);
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
}
