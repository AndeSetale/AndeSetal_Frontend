import { Component } from '@angular/core';
import { BreadcrumbAgent } from "../../components/agent-detail/breadcrumb-agent/breadcrumb-agent";
import { AgentProfileHeader } from "../../components/agent-detail/agent-profile-header/agent-profile-header";
import { AgentStatsGrid } from "../../components/agent-detail/agent-stats-grid/agent-stats-grid";
import { GraphiqueIncidents } from "../../components/graphique-incidents/graphique-incidents";
import { RepartitionIncidents } from "../../components/repartition-incidents/repartition-incidents";
import { ActivityChart } from "../../components/agent-detail/activity-chart/activity-chart";
import { RecentActivityTable } from "../../components/agent-detail/recent-activity-table/recent-activity-table";

@Component({
  selector: 'app-agent-detail',
  imports: [BreadcrumbAgent, AgentProfileHeader, AgentStatsGrid, RepartitionIncidents, ActivityChart, RecentActivityTable],
  templateUrl: './agent-detail.html',
  styleUrl: './agent-detail.css',
})
export class AgentDetail {


 
  readonly specialisationTypes = [
  {
    label: 'Canal bouché',
    value: 60,
    color: '#1F2937',
  },
  {
    label: 'Dépôt sauvage',
    value: 25,
    color: '#F97316',
  },
  {
    label: 'Graffiti',
    value: 10,
    color: '#9CA3AF',
  },
  {
    label: 'Éclairage',
    value: 5,
    color: '#EAB308',
  },
];



}
