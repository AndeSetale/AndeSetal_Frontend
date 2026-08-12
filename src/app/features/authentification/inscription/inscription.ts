import { Component, signal } from '@angular/core';
import { EnTeteAuthentification } from '../../../components/en-tete-authentification/en-tete-authentification';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { emailOuTelephoneValide } from '../email-ou-telephone.validator';


@Component({
  selector: 'app-inscription',
  imports: [ReactiveFormsModule, EnTeteAuthentification, RouterLink],
  templateUrl: './inscription.html',
  styleUrl: './inscription.css',
})
export class Inscription {
  motDePasseVisible = signal(false);
  confirmationVisible = signal(false);
  chargement = signal(false);
  erreur = signal<string | null>(null);

  formulaireInscription = new FormGroup({

    nomComplet: new FormControl('', {
      validators: [Validators.required],
      nonNullable: true
    }),

    email: new FormControl('', {
      validators: [
        Validators.required,
        emailOuTelephoneValide()
      ],
      nonNullable: true
    }),

    quartier: new FormControl('', {
      validators: [Validators.required],
      nonNullable: true
    }),

    motDePasse: new FormControl('', {
      validators: [
        Validators.required,
        Validators.minLength(8)
      ],
      nonNullable: true
    }),

    conditionsAcceptees: new FormControl(false, {
      validators: [Validators.requiredTrue],
      nonNullable: true
    }),

    recevoirAlertes: new FormControl(true, {
      nonNullable: true
    })

  });

  changerVisibiliteMotDePasse(): void {
    this.motDePasseVisible.update(
      visible => !visible
    );
  }

  changerVisibiliteConfirmation(): void {
    this.confirmationVisible.update(
      visible => !visible
    );
  }

  sInscrire(): void {

    this.erreur.set(null);

    if (this.formulaireInscription.invalid) {
      this.formulaireInscription.markAllAsTouched();
      return;
    }

    this.chargement.set(true);

    console.log(
      "Données d'inscription :",
      this.formulaireInscription.getRawValue()
    );

    setTimeout(() => {
      this.chargement.set(false);
    }, 1000);
  }
}
