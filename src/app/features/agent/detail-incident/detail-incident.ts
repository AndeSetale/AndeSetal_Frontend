import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { HeaderAgent } from '../components/header-agent/header-agent';

import {
  LucideSparkles,
  LucideTrash2,
  LucideFlame,
  LucideMapPin,
} from '@lucide/angular';


import { IncidentService } from '../../../core/services/incident';

@Component({
  selector: 'app-detail-incident',
  imports: [
  HeaderAgent,
  LucideSparkles,
  LucideTrash2,
  LucideFlame,
  LucideMapPin,
],

  templateUrl: './detail-incident.html',
  styleUrl: './detail-incident.css',
})
export class DetailIncident {

 

}
