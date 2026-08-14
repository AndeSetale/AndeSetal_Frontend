import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Incident } from '../../../../core/services/incident.service';
import { RouterLink } from "@angular/router";



@Component({
  selector: 'app-popup-incident',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './popup-incident.html',
  styleUrl: './popup-incident.css',
})
export class PopupIncidentComponent {

  @Input() incident: Incident | null = null;

  @Output() fermer = new EventEmitter<void>();

  fermerPopup(): void {
    this.fermer.emit();
  }
}