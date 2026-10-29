import { Component, AfterViewInit, ElementRef, ViewChild, effect, input } from '@angular/core';
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

Chart.register(
  LineController,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Filler
);

@Component({
  selector: 'app-graphique-incidents',
  imports: [],
  templateUrl: './graphique-incidents.html',
  styleUrl: './graphique-incidents.css',
})
export class GraphiqueIncidents implements AfterViewInit {

  /** Série jour par jour fournie par /dashboard/stats/ (evolution_30_jours) */
  readonly points = input<{ date: string; nouveaux: number; resolus: number }[]>([]);

  @ViewChild('incidentsChart')
  chartRef!: ElementRef<HTMLCanvasElement>;

  private chart?: Chart;

  constructor() {
    effect(() => {
      const points = this.points();
      if (this.chartRef) {
        this.createChart(points);
      }
    });
  }

  ngAfterViewInit(): void {
    this.createChart(this.points());
  }

  private createChart(points: { date: string; nouveaux: number; resolus: number }[]): void {
    this.chart?.destroy();

    const canvas = this.chartRef.nativeElement;

    this.chart = new Chart(canvas, {
      type: 'line',
      data: {
        labels: points.map(p => p.date.slice(8, 10)),
        datasets: [
          {
            label: 'Nouveaux',
            data: points.map(p => p.nouveaux),
            borderColor: '#00A878',
            backgroundColor: 'transparent',
            borderWidth: 2,
            pointRadius: 0,
            pointHoverRadius: 4,
            tension: 0.35
          },
          {
            label: 'Résolus',
            data: points.map(p => p.resolus),
            borderColor: '#2563EB',
            backgroundColor: 'transparent',
            borderWidth: 2,
            pointRadius: 0,
            pointHoverRadius: 4,
            tension: 0.35
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,

        interaction: {
          mode: 'index',
          intersect: false
        },

        plugins: {
          legend: {
            display: false
          },

          tooltip: {
            enabled: true
          }
        },

        scales: {
          x: {
            grid: {
              display: true,
              color: '#F1F5F9'
            },

            border: {
              display: false
            },

            ticks: {
              color: '#64748B',
              font: {
                size: 11
              }
            }
          },

          y: {
            min: 0,
            max: 16,

            ticks: {
              stepSize: 4,
              color: '#64748B',
              font: {
                size: 11
              }
            },

            grid: {
              color: '#E5E7EB'
            },

            border: {
              display: false
            }
          }
        }
      }
    });
  }
}