import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-barre-navigation',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './barre-navigation.html',
  styleUrl: './barre-navigation.css',
})
export class BarreNavigation {}