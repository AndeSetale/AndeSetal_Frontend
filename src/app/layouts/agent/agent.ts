import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-agent',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './agent.html',
  styleUrl: './agent.css',
})
export class Agent {

  menuOuvert = false;

  constructor(private router: Router) {}

  toggleMenu(): void {
    this.menuOuvert = !this.menuOuvert;
  }

  allerVers(url: string): void {
    this.menuOuvert = false;
    this.router.navigate([url]);
  }
}