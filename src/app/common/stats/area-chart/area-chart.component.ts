import { Component, Input, OnChanges } from '@angular/core';
import {
  NgApexchartsModule,
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexStroke,
  ApexXAxis,
  ApexYAxis,
  ApexTooltip,
  ApexFill,
  ApexGrid,
  ApexLegend,
  ApexMarkers,
} from 'ng-apexcharts';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export type AreaChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  stroke: ApexStroke;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  tooltip: ApexTooltip;
  fill: ApexFill;
  grid: ApexGrid;
  legend: ApexLegend;
  markers: ApexMarkers;
};

export type AreaChartSeries = {
  name: string;
  data: number[];
};

@Component({
  selector: 'app-area-chart',
  standalone: true,
  imports: [NgApexchartsModule, CommonModule, FormsModule],
  templateUrl: './area-chart.component.html',
  styleUrls: ['./area-chart.component.scss'],
})
export class AreaChartComponent implements OnChanges {
  @Input() series: AreaChartSeries[] = [];
  @Input() categories: string[] = [];
  @Input() title: string = 'Monthly Payment Overview';
  @Input() insightMessage: string = '';
  @Input() filterOptions: string[] = ['Last 3 Months', 'Last 6 Months', 'Last 12 Months'];
  @Input() selectedFilter: string = 'Last 6 Months';

  chartOptions!: AreaChartOptions;

  ngOnChanges(): void {
    this.chartOptions = {
      series: this.series,
      chart: {
        height: 230,
        type: 'area',
        toolbar: { show: false },
        zoom: { enabled: false },
      },
      dataLabels: { enabled: false },
      stroke: {
        curve: 'smooth',
        width: 2,
        colors: ['#10B981', '#F59E0B'],
      },
      markers: {
        size: 5,
        colors: ['#10B981', '#F59E0B'],
        strokeColors: '#ffffff',
        strokeWidth: 2,
        hover: { size: 7 },
      },
      fill: {
        type: ['gradient', 'solid'],
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.3,
          opacityTo: 0.05,
          stops: [0, 100],
          colorStops: [
            [
              { offset: 0, color: '#10B981', opacity: 0.3 },
              { offset: 100, color: '#10B981', opacity: 0.03 },
            ],
            [
              { offset: 0, color: '#F59E0B', opacity: 0 },
              { offset: 100, color: '#F59E0B', opacity: 0 },
            ],
          ],
        },
        colors: ['#10B981', '#F59E0B'],
        opacity: [1, 0],
      },
      xaxis: {
        categories: this.categories,
        axisBorder: { show: false },
        axisTicks: { show: false },
        labels: {
          style: { colors: '#9CA3AF', fontSize: '12px' },
        },
      },
      yaxis: {
        min: 0,
        tickAmount: 3,
        labels: {
          style: { colors: '#9CA3AF', fontSize: '12px' },
          formatter: (val: number) =>
            val >= 1000 ? `${val / 1000}K` : `${val}`,
        },
      },
      tooltip: {
        x: { show: true },
        y: {
          formatter: (val: number) => `${val}`,
        },
      
      },
      grid: {
        borderColor: '#F3F4F6',
        strokeDashArray: 4,
        xaxis: { lines: { show: false } },
        yaxis: { lines: { show: true } },
      },
      legend: {
        show: true,
        position: 'bottom',
        horizontalAlign: 'center',
        markers: {
          shape: 'circle',
        },
        labels: {
          colors: ['#374151'],
        },
      },
    };
  }

  onFilterChange(value: string): void {
  this.selectedFilter = value;
}
}