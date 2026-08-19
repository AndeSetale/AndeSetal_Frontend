import { Component, input } from '@angular/core';
import { Agent } from '../../../core/services/agent.service';

@Component({
  selector: 'app-agent-profile-header',
  standalone: true,
  imports: [],
  templateUrl: './agent-profile-header.html',
  styleUrl: './agent-profile-header.css',
})
export class AgentProfileHeader {

  agent = input.required<Agent>();

}