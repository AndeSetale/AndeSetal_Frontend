import { Component, input } from '@angular/core';

@Component({
  selector: 'app-carte-kpi',
  standalone: true,
  templateUrl: './carte-kpi.html',
  styleUrl: './carte-kpi.css',
})
export class CarteKpi {
  title = input('');
  value = input('');
  trend = input('');
  trendType = input<'up' | 'down' | 'neutral'>('neutral');

  icon = input<'alert' | 'clock' | 'check' | 'timer'>('alert');
}