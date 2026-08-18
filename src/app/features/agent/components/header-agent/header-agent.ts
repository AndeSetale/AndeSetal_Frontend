import { Component, input, output } from '@angular/core';
import { Router } from '@angular/router';
import {
  LucideArrowLeft,
  LucideShare2,
} from '@lucide/angular';

@Component({
  selector: 'app-header-agent',
  imports: [
    LucideArrowLeft,
    LucideShare2,
  ],
  templateUrl: './header-agent.html',
  styleUrl: './header-agent.css',
})
export class HeaderAgent {

  readonly titre = input<string>('');

  readonly showAction = input<boolean>(false);

  readonly actionLabel = input<string>('');

  readonly actionClick = output<void>();

  constructor(
    private readonly router: Router
  ) {}

  retour(): void {
    this.router.navigate(['/agent']);
  }

  onActionClick(): void {
    this.actionClick.emit();
  }
}