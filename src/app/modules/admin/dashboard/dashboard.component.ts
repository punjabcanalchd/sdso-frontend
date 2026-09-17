import { Component, OnInit } from '@angular/core';
import { KpiCards } from '../../../common/stats/kpi-cards/kpi-cards.component';
import { BarChartSeries, GroupedBarChartComponent } from "../../../common/stats/grouped-bar-chart/grouped-bar-chart.component";
import { DonutChartComponent } from '../../../common/stats/donut-chart/donut-chart.component';
import { HorizontalBarChartComponent } from '../../../common/stats/horizontal-bar-chart/horizontal-bar-chart.component';
import { AreaChartComponent } from '../../../common/stats/area-chart/area-chart.component';
import { SummaryCardComponent, SummaryCardItem } from '../../../common/stats/summary-card/summary-card.component';

@Component({
  selector: 'app-dashboard',
  imports: [KpiCards, GroupedBarChartComponent, DonutChartComponent, HorizontalBarChartComponent, AreaChartComponent, SummaryCardComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class Dashboard {

  kpiCards = [
    { id: 1, label: 'Total Headworks', count: 6, icon: 'bi-water', bgClass: 'bg-primary-subtle', textClass: 'text-primary' },
    { id: 2, label: 'Total Dams', count: 3, icon: 'bi-file-earmark-text', bgClass: 'bg-secondary-subtle', textClass: 'text-secondary' },
    { id: 3, label: 'Today Readings', count: 4, icon: 'bi-bell', bgClass: 'bg-success-subtle', textClass: 'text-success' },
  ]
  // Application Status Chart
  statusSeries: BarChartSeries[] = [
    { name: 'Below Target', data: [44, 55, 57, 56, 61, 58, 63, 60, 66] },
    { name: 'Average', data: [76, 85, 101, 98, 87, 105, 91, 114, 94] },
    { name: 'Target Achieved', data: [35, 41, 36, 26, 45, 48, 52, 53, 41] }
  ];
  statusCategories = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  groundWaterSeries: BarChartSeries[] = [
    { name: 'Below Target', data: [20, 40, 30, 0, 10, 13] },
    { name: 'Average', data: [76, 85, 101, 98, 87, 105, 91, 114, 94] },
    { name: 'Target Achieved', data: [35, 41, 36, 26, 45, 48, 52, 53, 41] }
  ]

  //Donut Chart: Applications by Area
  areaSeries = [500, 1200, 800];
  areaLabels = ['Below Target', 'Average', 'Target Achieved'];

  pendenciesType = ['Reading', 'Monitoring', 'Maintenance', 'Repair', 'Inspection', 'Other'];
  officerPendenciesSeries = [
    { name: 'Dam/ HHeadworks', data: [20, 40, 30, 0, 10, 13, 0, 9] },
  ];
  officerPendenciesCategories = ['Officer A', 'Officer B', 'Officer C', 'Officer D', 'Officer E', 'Officer F', 'Officer G', 'Officer H'];

}
