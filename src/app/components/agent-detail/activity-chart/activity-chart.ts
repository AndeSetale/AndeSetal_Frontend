import {
  Component,
  ElementRef,
  ViewChild,
  input,
  effect,
} from '@angular/core';

import {
  Chart,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';

import { AgentDetail } from '../../../core/services/agent.service';

Chart.register(
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

@Component({
  selector: 'app-activity-chart',
  standalone: true,
  imports: [],
  templateUrl: './activity-chart.html',
  styleUrl: './activity-chart.css',
})
export class ActivityChart {

  agent = input<AgentDetail | null>(null);

  @ViewChild('activityChart')
  chartRef!: ElementRef<HTMLCanvasElement>;

  private chart?: Chart;

  constructor() {
    effect(() => {
      const agent = this.agent();

      if (!agent || !this.chartRef) {
        return;
      }

      this.createChart(agent);
    });
  }

  private createChart(agent: AgentDetail): void {

    // Évite de créer plusieurs graphiques
    this.chart?.destroy();

    const canvas = this.chartRef.nativeElement;

    this.chart = new Chart(canvas, {
      type: 'bar',

      data: {
        labels: agent.activite_semaine.map(j => j.jour),

        datasets: [
          {
            label: 'Assignés',

            data: agent.activite_semaine.map(j => j.assignes),

            backgroundColor: '#D1D5DB',
            borderRadius: 3,
            barPercentage: 0.45,
            categoryPercentage: 0.7,
          },

          {
            label: 'Résolus',

            data: agent.activite_semaine.map(j => j.resolus),

            backgroundColor: '#1F2937',
            borderRadius: 3,
            barPercentage: 0.45,
            categoryPercentage: 0.7,
          },
        ],
      },

      options: {
        responsive: true,
        maintainAspectRatio: false,

        plugins: {
          legend: {
            display: false,
          },

          tooltip: {
            enabled: true,
          },
        },

        scales: {
          x: {
            grid: {
              display: false,
            },

            border: {
              display: false,
            },

            ticks: {
              color: '#374151',

              font: {
                size: 12,
              },
            },
          },

          y: {
            min: 0,

            ticks: {
              precision: 0,
              color: '#6B7280',

              font: {
                size: 12,
              },
            },

            grid: {
              color: '#E5E7EB',
            },

            border: {
              display: false,
            },
          },
        },
      },
    });
  }
}