import { Component } from '@angular/core';
import { StatCard } from "../stat-card/stat-card";

@Component({
  selector: 'app-agent-stats-grid',
  imports: [StatCard],
  templateUrl: './agent-stats-grid.html',
  styleUrl: './agent-stats-grid.css',
})
export class AgentStatsGrid {}
