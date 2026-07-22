import { Component, Input, OnChanges } from '@angular/core';
import {
  NgApexchartsModule,
  ApexAxisChartSeries,
  ApexChart,
  ApexPlotOptions,
  ApexDataLabels,
  ApexStroke,
  ApexXAxis,
  ApexYAxis,
  ApexFill,
  ApexTooltip
} from 'ng-apexcharts';

export type BarChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  plotOptions: ApexPlotOptions;
  dataLabels: ApexDataLabels;
  stroke: ApexStroke;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  fill: ApexFill;
  tooltip: ApexTooltip;
  colors: string[];
};

export type BarChartSeries = {
  name: string;
  data: number[];
};

@Component({
  selector: 'app-grouped-bar-chart-component',
  standalone: true,
  imports: [NgApexchartsModule],
  templateUrl: './grouped-bar-chart.component.html',
  styleUrls: ['./grouped-bar-chart.component.scss'],
})
export class GroupedBarChartComponent implements OnChanges {
  @Input() series: BarChartSeries[] = [];
  @Input() categories: string[] = [];
  @Input() title: string = '';
  @Input() yAxisLabel: string = '';
  @Input() unit: string = '';
  @Input() height: number = 230;
  // @Input() columnWidth: string = '55%';
  @Input() colors: string[] = [];

  chartOptions!: BarChartOptions;

  ngOnChanges(): void {
    const chartColors = this.colors && this.colors.length > 0 ? this.colors : ['#1a5276', '#ffc107', '#198754', '#4e74c8'];

    this.chartOptions = {
      series: this.series,
      chart: {
        type: 'bar',
        height: this.height,
        stacked: true
      },
      colors: chartColors,
      plotOptions: {
        bar: {
          horizontal: false,
          // columnWidth: this.columnWidth,
          borderRadius: 1,
          borderRadiusWhenStacked: 'last',
        }
      },
      dataLabels: {
        enabled: true,
        style: {
          fontSize: '11px',
          fontWeight: 600,
        },
      },
      stroke: {
        show: true,
        colors: ['transparent']
      },
      xaxis: {
        categories: this.categories
      },
      yaxis: {
        title: {
          text: this.yAxisLabel
        }
      },
      fill: {
        opacity: 1
      },
      tooltip: {
        y: {
          formatter: (val: number) => this.unit ? `${val} ${this.unit}` : `${val}`
        }
      }
    };
  }
}
