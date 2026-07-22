import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ApexPlotOptions } from 'apexcharts';
import { NgApexchartsModule, ApexNonAxisChartSeries, ApexChart, ApexLegend, ApexTooltip, ApexDataLabels, ApexOptions } from 'ng-apexcharts';

export type DonutChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  colors: string[];
  labels: string[];
  legend: ApexLegend;
  tooltip: ApexTooltip;
  dataLabels: ApexDataLabels;
};

@Component({
  selector: 'app-donut-chart-component',
  standalone: true,
  imports: [NgApexchartsModule],
  templateUrl: './donut-chart.component.html',
  styleUrls: ['./donut-chart.component.scss'],
})
export class DonutChartComponent implements OnChanges {
  @Input() title: string = '';
  @Input() series: number[] = [];
  @Input() labels: string[] = [];
  @Input() height: number = 250;
  @Input() unit: string = '';

  chartOptions!: DonutChartOptions;

  ngOnChanges(): void {
    this.chartOptions = {
      series: this.series,
      chart: {
        type: 'donut',
        height: this.height,
      },
      colors: ['#ffc107', '#F59E0B', '#198754', '#4e74c8'],
      labels: this.labels,

      legend: {
        position: 'bottom',
      },
      dataLabels: {
        enabled: true,
        style: {
          fontSize: '11px',
          fontWeight: 600,
        },
      },
      
      tooltip: {
        y: {
          formatter: (val: number) => this.unit ? `${val} ${this.unit}` : `${val}`
        }
      }
    };
  }
};
