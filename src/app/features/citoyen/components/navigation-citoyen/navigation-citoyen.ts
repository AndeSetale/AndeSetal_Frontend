import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navigation-citoyen',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './navigation-citoyen.html',
  styleUrl: './navigation-citoyen.css',
})
export class NavigationCitoyen {}
