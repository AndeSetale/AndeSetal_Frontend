import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { NavigationAgent } from '../../components/navigation-agent/navigation-agent';

@Component({
  selector: 'app-agent',
  standalone: true,
  imports: [
    RouterOutlet,
    NavigationAgent,
  ],
  templateUrl: './agent.html',
  styleUrl: './agent.css',
})
export class Agent {}