import { Component, inject, signal } from '@angular/core';
import { EnTeteAuthentification } from '../../../components/en-tete-authentification/en-tete-authentification';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
}
from '@angular/forms';
import { RouterLink } from '@angular/router';
import { emailOuTelephoneValide } from '../email-ou-telephone.validator';
import { Auth } from '../../../core/services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inscription',
  imports: [ReactiveFormsModule, EnTeteAuthentification, RouterLink],
  templateUrl: './inscription.html',
  styleUrl: './inscription.css',
})
export class Inscription {

  private readonly auth = inject(Auth);
  private readonly router = inject(Router);
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

  const valeurs = this.formulaireInscription.getRawValue();
  console.log('Données inscription :', valeurs);

  const donnees = {
    nom_complet: valeurs.nomComplet,
    email_ou_telephone: valeurs.email,
    quartier: valeurs.quartier,
    password: valeurs.motDePasse,
    accepte_conditions: valeurs.conditionsAcceptees,
    recevoir_alertes: valeurs.recevoirAlertes
  };

  console.log('Données envoyées au backend :', donnees);

  this.auth.inscrire(donnees).subscribe({

    next: (reponse) => {
    console.log('Inscription réussie :', reponse);

    this.chargement.set(false);

    this.router.navigate(['/verification'], {
      queryParams: {
        email: valeurs.email
      }
    });
  },

    error: (erreur) => {
    console.error("Erreur d'inscription :", erreur);
    console.error("Réponse du backend :", erreur.error);

    this.chargement.set(false);

    this.erreur.set(
      'Impossible de créer le compte. Vérifiez les informations saisies.'
    );
  }

  });
  }
}
