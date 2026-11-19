import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { TableData } from './table-data';
import { BaseChartDirective } from 'ng2-charts';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Chart, type ChartData, type ChartOptions } from 'chart.js';
import type { TimeEntry } from './models/time-entry';

Chart.register(ChartDataLabels);

const CHART_COLORS = [
  '#3b82f6', '#ef4444', '#22c55e', '#eab308',
  '#a855f7', '#f97316', '#14b8a6', '#ec4899'
];

interface EmployeeSummary {
  EmployeeName: string;
  TotalHours: number;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  public data = signal<EmployeeSummary[]>([]);

  public pieChartData: ChartData<'pie', number[], string> = {
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: CHART_COLORS
    }]
  };

  public pieChartOptions: ChartOptions<'pie'> = {
    responsive: true,
    plugins: {
      legend: { position: 'bottom' },
      datalabels: {
        color: '#fff',
        font: { weight: 'bold' },
        formatter: (value, context) => {
          const dataset =
            context.chart.data.datasets[context.datasetIndex].data as number[];
          const total = dataset.reduce((sum, item) => sum + Number(item), 0);

          return total === 0
            ? ''
            : `${((Number(value) / total) * 100).toFixed(1)}%`;
        }
      }
    }
  };

  constructor(private dataService: TableData) {}

  ngOnInit(): void {
    this.fetchData();
  }

  private fetchData(): void {
    this.dataService.getData().subscribe({
      next: (response: TimeEntry[]) => {
        const employees = new Map<string, EmployeeSummary>();

        for (const row of response) {
          if (!row.EmployeeName?.trim()) {
            continue;
          }

          const start = this.parseUtc(row.StarTimeUtc);
          const end = this.parseUtc(row.EndTimeUtc);

          if (Number.isNaN(start) || Number.isNaN(end) || end < start) {
            continue;
          }

          const employeeName = row.EmployeeName.trim();
          const nameKey = employeeName.toLowerCase();
          const hours = (end - start) / 3_600_000;
          const employee = employees.get(nameKey);

          if (employee) {
            employee.TotalHours += hours;
          } else {
            employees.set(nameKey, {
              EmployeeName: employeeName,
              TotalHours: hours
            });
          }
        }

        const groupedData = Array.from(employees.values());
        this.data.set(groupedData);
        this.pieChartData = {
          labels: groupedData.map(employee => employee.EmployeeName),
          datasets: [{
            data: groupedData.map(employee => employee.TotalHours),
            backgroundColor: CHART_COLORS
          }]
        };
      },
      error: error => {
        console.error('Failed to load employee time entries:', error);
      }
    });
  }

  private parseUtc(value: string): number {
    const hasTimezone = /(?:Z|[+-]\d{2}:\d{2})$/i.test(value);
    return Date.parse(hasTimezone ? value : `${value}Z`);
  }
}
