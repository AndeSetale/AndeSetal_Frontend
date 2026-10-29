import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stat-card.html',
  styleUrl: './stat-card.css',
})
export class StatCard {
  title = input.required<string>();
  value = input.required<string>();
  description = input.required<string>();

  // Badge
  badge = input<string>('');
  badgeClass = input<string>('bg-green-50 text-green-600');

  // Icône
  icon = input<'check-circle' | 'clock' | 'target'>('check-circle');
  iconBg = input<string>('bg-gray-800/10');
  iconColor = input<string>('text-gray-800');

  // Couleur de la valeur
  valueColor = input<string>('text-gray-900');
}