import { Component, input } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-header-agent',
  standalone: true,
  imports: [],
  templateUrl: './header-agent.html',
  styleUrl: './header-agent.css',
})
export class HeaderAgent {

  titre = input.required<string>();

  constructor(private location: Location) {}

  retour(): void {
    this.location.back();
  }
}