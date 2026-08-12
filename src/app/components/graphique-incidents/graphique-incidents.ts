import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
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

  @ViewChild('incidentsChart')
  chartRef!: ElementRef<HTMLCanvasElement>;

  ngAfterViewInit(): void {
    this.createChart();
  }

  private createChart(): void {
    const canvas = this.chartRef.nativeElement;

    new Chart(canvas, {
      type: 'line',

      data: {
        labels: [
          '01', '03', '05', '07',
          '09', '11', '13', '15',
          '17', '19', '21', '23',
          '25', '27', '29', '30'
        ],

        datasets: [
          {
            label: 'Nouveaux',

            data: [
              10, 8, 12, 7,
              11, 9, 13, 10,
              14, 11, 15, 12,
              13, 10, 14, 12
            ],

            borderColor: '#00A878',
            backgroundColor: 'transparent',

            borderWidth: 2,
            pointRadius: 0,
            pointHoverRadius: 4,

            tension: 0.35
          },

          {
            label: 'Résolus',

            data: [
              6, 7, 5, 8,
              7, 9, 6, 10,
              8, 11, 9, 12,
              10, 13, 11, 9
            ],

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