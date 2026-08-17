import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header-citoyen',
  imports: [],
  templateUrl: './header-citoyen.html',
  styleUrl: './header-citoyen.css',
})
export class HeaderCitoyen {
  readonly router = inject(Router);

  get currentRoute(): string {
    return this.router.url;
  }
}
