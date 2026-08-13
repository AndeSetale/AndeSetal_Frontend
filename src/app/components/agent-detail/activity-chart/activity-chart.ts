import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import {
  Chart,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';

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
export class ActivityChart implements AfterViewInit {

  @ViewChild('activityChart')
  chartRef!: ElementRef<HTMLCanvasElement>;

  ngAfterViewInit(): void {
    this.createChart();
  }

  private createChart(): void {
    const canvas = this.chartRef.nativeElement;

    new Chart(canvas, {
      type: 'bar',

      data: {
        labels: [
          'Lun',
          'Mar',
          'Mer',
          'Jeu',
          'Ven',
          'Sam',
          'Dim',
        ],

        datasets: [
          {
            label: 'Assignés',
            data: [8, 10, 7, 12, 9, 5, 3],
            backgroundColor: '#D1D5DB',
            borderRadius: 3,
            barPercentage: 0.45,
            categoryPercentage: 0.7,
          },
          {
            label: 'Résolus',
            data: [6, 9, 8, 10, 11, 4, 3],
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
            max: 12,

            ticks: {
              stepSize: 3,
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