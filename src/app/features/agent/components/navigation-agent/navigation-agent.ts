import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navigation-agent',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navigation-agent.html',
  styleUrl: './navigation-agent.css',
})
export class NavigationAgent {}