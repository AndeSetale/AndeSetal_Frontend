import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-page-connexion-dash',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './page-connexion-dash.html',
  styleUrl: './page-connexion-dash.css',
})
export class PageConnexionDash {

  email = '';
  password = '';

  showPassword = signal(false);
  twoFactor = signal(true);
  loading = signal(false);

  togglePassword(): void {
    this.showPassword.update(value => !value);
  }

  toggleTwoFactor(): void {
    this.twoFactor.update(value => !value);
  }

  seConnecter(): void {

    if (!this.email || !this.password) {
      return;
    }

    this.loading.set(true);

    console.log({
      email: this.email,
      password: this.password,
      twoFactor: this.twoFactor()
    });

    // On branchera Django ici ensuite

    setTimeout(() => {
      this.loading.set(false);
    }, 1000);
  }
}