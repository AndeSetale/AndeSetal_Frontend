import { Component, inject, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '../../core/services/auth';


@Component({
  selector: 'app-page-connexion-dash',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './page-connexion-dash.html',
  styleUrl: './page-connexion-dash.css',
})
export class PageConnexionDash {

  private auth = inject(Auth);
  private router = inject(Router);

  showPassword = signal(false);
  twoFactor = signal(true);
  loading = signal(false);
  erreur = signal<string | null>(null);

  formulaireConnexion = new FormGroup({

    email: new FormControl('', {
      validators: [
        Validators.required,
        Validators.email
      ],
      nonNullable: true
    }),

    password: new FormControl('', {
      validators: [
        Validators.required
      ],
      nonNullable: true
    })

  });

  togglePassword(): void {
    this.showPassword.update(value => !value);
  }

  toggleTwoFactor(): void {
    this.twoFactor.update(value => !value);
  }

  seConnecter(): void {

    this.erreur.set(null);

    if (this.formulaireConnexion.invalid) {
      this.formulaireConnexion.markAllAsTouched();
      return;
    }

    this.loading.set(true);

    const { email, password } =
      this.formulaireConnexion.getRawValue();

    this.auth.connecter(email, password).subscribe({

      next: (reponse) => {

        console.log('Connexion réussie', reponse);

        // Enregistrement de la session
        this.auth.enregistrerSession(reponse);

        this.loading.set(false);

        // Redirection dashboard
        this.router.navigate(['/dashboard']);
      },

      error: (erreur) => {

        console.error(
          'Erreur de connexion :',
          erreur
        );

        this.loading.set(false);

        this.erreur.set(
          'Identifiant ou mot de passe incorrect.'
        );
      }

    });
  }
}