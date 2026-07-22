import { Component, Input, OnChanges } from '@angular/core';
import {
  NgApexchartsModule,
  ApexAxisChartSeries,
  ApexChart,
  ApexPlotOptions,
  ApexDataLabels,
  ApexXAxis,
  ApexYAxis,
  ApexFill,
  ApexTooltip,
  ApexGrid,
} from 'ng-apexcharts';

export type HorizontalBarChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  plotOptions: ApexPlotOptions;
  dataLabels: ApexDataLabels;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  fill: ApexFill;
  tooltip: ApexTooltip;
  grid: ApexGrid;
  colors: string[];
  legend?: any;
};

export type HorizontalBarChartSeries = {
  name: string;
  data: number[];
};

@Component({
  selector: 'app-horizontal-bar-chart',
  standalone: true,
  imports: [NgApexchartsModule],
  templateUrl: './horizontal-bar-chart.component.html',
  styleUrls: ['./horizontal-bar-chart.component.scss'],
})
export class HorizontalBarChartComponent implements OnChanges {
  @Input() series: HorizontalBarChartSeries[] = [];
  @Input() categories: string[] = [];
  @Input() title: string = '';
  @Input() xAxisLabel: string = '';
  @Input() unit: string = '';
  @Input() height: number = 230;
  @Input() barHeight: string = '100%';
  @Input() stacked: boolean = false;
  @Input() colors: string[] = [];

  chartOptions!: HorizontalBarChartOptions;

  ngOnChanges(): void {
    const chartColors = this.colors && this.colors.length > 0 ? this.colors : ['#1a5276', '#198754', '#dc3545', '#4e74c8'];

    this.chartOptions = {
      series: this.series,
      chart: {
        type: 'bar',
        height: this.height,
        stacked: this.stacked,
        toolbar: { show: true },
      },
      plotOptions: {
        bar: {
          borderRadius: 1,
          borderRadiusApplication: 'end',
          borderRadiusWhenStacked:'last',
          horizontal: true,
          barHeight: this.barHeight,
        },
      },
      dataLabels: {
        enabled: true,
        style: {
          colors: ['#fff'],
          fontSize: '11px',
          fontWeight: 600,
        },
        formatter: (val: number) =>
          this.unit ? `${val} ${this.unit}` : `${val}`,
      },
      xaxis: {
        categories: this.categories,
        title: {
          text: this.xAxisLabel,
          style: {
            color: '#6B7280',
            fontSize: '12px',
            fontWeight: 400,
          },
        },
        axisBorder: { show: true },
        axisTicks: { show: true },
        labels: {
          style: {
            colors: '#6B7280',
            fontSize: '12px',
          },
        },
      },
      yaxis: {
        labels: {
          style: {
            colors: '#453751',
            fontSize: '12px',
          },
        },
      },
      colors: chartColors,
      fill: {
        opacity: 1
      },
      legend: {
        show: this.stacked,
        position: 'top',
        horizontalAlign: 'left',
      },
      tooltip: {
        y: {
          formatter: (val: number) =>
            this.unit ? `${val} ${this.unit}` : `${val}`,
        },
      },
      grid: {
        borderColor: '#F3F4F6',
        strokeDashArray: 4,
        xaxis: { lines: { show: true } },
        yaxis: { lines: { show: false } },
      },
    };
  }
}