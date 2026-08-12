import { Component, signal } from '@angular/core';
import { EnTeteAuthentification } from '../../../components/en-tete-authentification/en-tete-authentification';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { emailOuTelephoneValide } from '../email-ou-telephone.validator';

@Component({
  selector: 'app-connexion',
  imports: [ReactiveFormsModule, EnTeteAuthentification],
  templateUrl: './connexion.html',
  styleUrl: './connexion.css',
})
export class Connexion {
  // État d'affichage du mot de passe
  motDePasseVisible = signal(false);

  // État de chargement du formulaire
  chargement = signal(false);

  // Message d'erreur général
  erreur = signal<string | null>(null);


  // Formulaire de connexion
  formulaireConnexion = new FormGroup({

    email: new FormControl('', {
      validators: [
        Validators.required,
        emailOuTelephoneValide()
      ],
      nonNullable: true
    }),

    motDePasse: new FormControl('', {
      validators: [
        Validators.required
      ],
      nonNullable: true
    })

  });


  // Afficher / masquer le mot de passe
  changerVisibiliteMotDePasse(): void {
    this.motDePasseVisible.update(
      visible => !visible
    );
  }


  // Soumission du formulaire
  seConnecter(): void {

    // Réinitialiser l'erreur précédente
    this.erreur.set(null);

    // Vérifier la validité
    if (this.formulaireConnexion.invalid) {

      this.formulaireConnexion.markAllAsTouched();

      return;
    }


    // Activer le chargement
    this.chargement.set(true);


    // Pour l'instant, on simule simplement la connexion
    console.log(
      'Données de connexion :',
      this.formulaireConnexion.getRawValue()
    );


    // Simulation temporaire
    setTimeout(() => {

      this.chargement.set(false);

    }, 1000);
  }
}
