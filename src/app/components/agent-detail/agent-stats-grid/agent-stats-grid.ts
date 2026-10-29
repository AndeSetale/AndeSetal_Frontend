import { Component, input } from '@angular/core';
import { StatCard } from "../stat-card/stat-card";
import { Agent } from '../../../core/services/agent.service';

@Component({
  selector: 'app-agent-stats-grid',
  imports: [StatCard],
  templateUrl: './agent-stats-grid.html',
  styleUrl: './agent-stats-grid.css',
})
export class AgentStatsGrid {

  agent = input.required<Agent>();
}
