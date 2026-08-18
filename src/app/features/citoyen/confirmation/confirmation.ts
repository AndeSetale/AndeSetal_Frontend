import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-confirmation',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './confirmation.html',
  styleUrl: './confirmation.css',
})
export class ConfirmationComponent implements OnInit {
  ticketId: string = '#AS-2026-047';
  copied: boolean = false;
  showAccountModal: boolean = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    const randomNum = Math.floor(100 + Math.random() * 900);
    this.ticketId = `#AS-2026-${randomNum}`;
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
