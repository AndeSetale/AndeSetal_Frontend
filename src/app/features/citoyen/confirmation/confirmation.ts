import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

import { IncidentService } from '../../../core/services/incident.service';

@Component({
  selector: 'app-confirmation',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './confirmation.html',
  styleUrl: './confirmation.css',
})
export class ConfirmationComponent implements OnInit {
  ticketId: string = '#AS-2024-047';
  copied: boolean = false;
  showAccountModal: boolean = false;

  constructor(
    private router: Router,
    private incidentService: IncidentService
  ) {}

  ngOnInit(): void {
    const realRef = this.incidentService.getLastTicketReference();
    if (realRef) {
      this.ticketId = realRef.startsWith('#') ? realRef : `#${realRef}`;
    }
  }

  copyTicketId(): void {
    navigator.clipboard.writeText(this.ticketId);
    this.copied = true;
    setTimeout(() => (this.copied = false), 2000);
  }

  openModal(): void {
    this.showAccountModal = true;
  }

  closeModal(): void {
    this.showAccountModal = false;
    this.goHome();
  }

  createAccount(): void {
    this.router.navigate(['/inscription']);
  }

  goHome(): void {
    this.router.navigate(['/mobile']);
  }
}
