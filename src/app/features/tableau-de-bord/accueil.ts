import { Component } from '@angular/core';
import { CarteKpi } from "./components/carte-kpi/carte-kpi";
import { GraphiqueIncidents } from "../../components/graphique-incidents/graphique-incidents";
import { RepartitionIncidents } from "../../components/repartition-incidents/repartition-incidents";
import { IncidentsRecents } from "../../components/incidents-recents/incidents-recents";
import { PerformanceAgents } from "../../components/performance-agents/performance-agents";

@Component({
  selector: 'app-accueil',
  imports: [CarteKpi, GraphiqueIncidents, RepartitionIncidents, IncidentsRecents, PerformanceAgents],
  templateUrl: './accueil.html',
  styleUrl: './accueil.css',
})
export class Accueil {

  readonly incidentTypes = [
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
