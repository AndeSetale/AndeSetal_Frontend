import { Component, signal, inject } from '@angular/core';
import { EnTeteAuthentification } from '../../../components/en-tete-authentification/en-tete-authentification';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { emailOuTelephoneValide } from '../email-ou-telephone.validator';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../../core/services/auth';

@Component({
  selector: 'app-connexion',
  imports: [ReactiveFormsModule, EnTeteAuthentification, RouterLink],
  templateUrl: './connexion.html',
  styleUrl: './connexion.css',
})
export class Connexion {
  private auth = inject(Auth);
  private router = inject(Router);

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

    // Vérifier la validité du formulaire
    if (this.formulaireConnexion.invalid) {
      this.formulaireConnexion.markAllAsTouched();
      return;
    }

    this.chargement.set(true);

    const { email, motDePasse } = this.formulaireConnexion.getRawValue();

    this.auth.connecter(email, motDePasse).subscribe({
      next: (reponse) => {
        // Enregistrer les tokens et l'utilisateur connecté
        this.auth.enregistrerSession(reponse);

        this.chargement.set(false);

        // Rediriger vers l'espace correspondant au rôle
        this.router.navigateByUrl(this.auth.accueilDuRole(reponse.user.role));
      },

      error: (erreur) => {
        this.chargement.set(false);

        console.error('Erreur de connexion :', erreur);

        // Message affiché à l'utilisateur
        this.erreur.set(
          'Email ou mot de passe incorrect.'
        );
      }
    });
  }
}
