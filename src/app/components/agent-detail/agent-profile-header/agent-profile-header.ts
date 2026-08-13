import { Component, input } from '@angular/core';

@Component({
  selector: 'app-agent-profile-header',
  standalone: true,
  imports: [],
  templateUrl: './agent-profile-header.html',
  styleUrl: './agent-profile-header.css',
})
export class AgentProfileHeader {
  name = input('Amadou Diallo');
  agentId = input('AGT-2024-001');
  district = input('Plateau');
  status = input('Actif');
}