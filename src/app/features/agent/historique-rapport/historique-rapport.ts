import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import {
  LucideCircleCheck,
  LucideMapPin,
  LucideCamera,
  LucideUsersRound,
  LucideInbox,
  LucideSend,
  LucideDownload,
  LucideImage,
  LucideEye,
  LucideArchive,
  LucideShare2,
} from '@lucide/angular';

import { RapportService } from '../../../core/services/rapport';
import { HeaderAgent } from '../components/header-agent/header-agent';

@Component({
  selector: 'app-historique-rapport',
  imports: [
    HeaderAgent,
    LucideCircleCheck,
    LucideMapPin,
    LucideCamera,
    LucideUsersRound,
    LucideInbox,
    LucideSend,
    LucideDownload,
    LucideImage,
    LucideEye,
    LucideArchive,
    LucideShare2,
  ],
  templateUrl: './historique-rapport.html',
  styleUrl: './historique-rapport.css',
})
export class HistoriqueRapport {

  
}
