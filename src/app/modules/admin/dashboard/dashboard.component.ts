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
  // kpi cards
  statusTypes = [
    { key: 'approved', label: 'Approved' },
    { key: 'inProcess', label: 'Pending' },
    { key: 'rejected', label: 'Rejected' },
  ];

  kpiCards = [
    { id: 1, label: 'Fresh', count: 1942, approved: 1748, inProcess: 127, rejected: 67, icon: 'bi-water', bgClass: 'bg-primary-subtle', textClass: 'text-primary' },
    { id: 2, label: 'Amendements', count: 31, approved: 20, inProcess: 11, rejected: 0, icon: 'bi-file-earmark-text', bgClass: 'bg-secondary-subtle', textClass: 'text-secondary' },
    { id: 3, label: 'Intimations', count: 9, approved: 3, inProcess: 6, rejected: 0, icon: 'bi-bell', bgClass: 'bg-success-subtle', textClass: 'text-success' },
    { id: 4, label: 'Renewals', count: 262, approved: 209, inProcess: 50, rejected: 3, icon: 'bi-arrow-clockwise', bgClass: 'bg-warning-subtle', textClass: 'text-warning' },
    { id: 5, label: 'Revocations', count: 1043, approved: 881, inProcess: 5, rejected: 157, icon: 'bi-x-circle', bgClass: 'bg-danger-subtle', textClass: 'text-danger' },
  ]
  // Application Status Chart
  statusSeries: BarChartSeries[] = [
    { name: 'Submitted', data: [44, 55, 57, 56, 61, 58, 63, 60, 66] },
    { name: 'Pending', data: [76, 85, 101, 98, 87, 105, 91, 114, 94] },
    { name: 'Approved', data: [35, 41, 36, 26, 45, 48, 52, 53, 41] }
  ];
  statusCategories = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  groundWaterSeries: BarChartSeries[] = [
    { name: 'Approved', data: [20, 40, 30, 0, 10, 13] },
    { name: 'Pending', data: [76, 85, 101, 98, 87, 105, 91, 114, 94] },
    { name: 'Rejected', data: [35, 41, 36, 26, 45, 48, 52, 53, 41] }
  ]

  //Donut Chart: Applications by Area
  areaSeries = [500, 1200, 800];
  areaLabels = ['Yellow', 'Orange', 'Green'];

  telemetrySeries = [96, 4];
  telemetryLabels = ['Mapped to Cloud', 'Not Mapped'];

  tubewellSeries = [40, 45];
  tubewellLabels = ['Not as per specifications', 'As per specifications'];

  //Horizontal Bar Chart
  unitSeries = [{ name: 'Applications', data: [620, 430, 350, 210, 180, 130] }];
  unitCategories = ['Commercial', 'Industrial', 'Residential/Private', 'Municipal', 'Government', 'Others'];

  pendenciesType = ['gw', 'drilling', 'tankers']
  officerPendenciesSeries = [
    { name: 'Groundwater', data: [20, 40, 30, 0, 10, 13, 0, 9] },
    { name: 'Drilling Rig', data: [6, 30, 5, 15, 8, 10, 20, 4] },
    { name: 'Water Tanker', data: [20, 12, 5, 11, 9, 13, 4, 2] },
  ];
  officerPendenciesCategories = ['Officer A', 'Officer B', 'Officer C', 'Officer D', 'Officer E', 'Officer F', 'Officer G', 'Officer H'];

  //Area Chart: Monthly Payment Overview
  areaChatSeries = [
    { name: 'Success', data: [980, 1050, 1120, 1180, 1160, 1320] },
    { name: 'Pending', data: [210, 195, 220, 205, 185, 240] }
  ];
  areaChartCategories = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  paymentSeries = [
    { name: 'IFMS', data: [980, 100, 1120, 1180, 1160, 1320, 1200] },
    { name: 'CCAvenue', data: [210, 405, 220, 1167, 185, 240, 210] }
  ];
  paymentLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  //Summary Card: Credit Summary
  creditItems: SummaryCardItem[] = [
    {
      icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
             <rect x="2" y="5" width="20" height="14" rx="2"/>
             <line x1="2" y1="10" x2="22" y2="10"/>
           </svg>`,
      iconBg: '#EFF6FF',
      iconColor: '#3B82F6',
      label: 'Credit Balance',
      value: '₹ 2,45,80,500',
    },
    {
      icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
             <polyline points="23 4 23 10 17 10"/>
             <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
           </svg>`,
      iconBg: '#ECFDF5',
      iconColor: '#10B981',
      label: 'Credit Added (This Month)',
      value: '₹ 45,60,000',
      valueColor: '#10B981',
    },
    {
      icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
             <polyline points="1 4 1 10 7 10"/>
             <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>
           </svg>`,
      iconBg: '#FFF1F2',
      iconColor: '#EF4444',
      label: 'Credit Used (This Month)',
      value: '₹ 28,75,000',
      valueColor: '#EF4444',
    },
  ];

  //Summary Card: Application Summary
  applicationItems: SummaryCardItem[] = [
    {
      icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
             <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
             <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
           </svg>`,
      iconBg: '#F3E8FF',
      iconColor: '#A855F7',
      label: 'Total Applications',
      value: '1,920',
    },
    {
      icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
             <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/>
           </svg>`,
      iconBg: '#FEF3C7',
      iconColor: '#F59E0B',
      label: 'Pending Review',
      value: '182',
      valueColor: '#F59E0B',
    },
    {
      icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
             <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
             <polyline points="22 4 12 14.01 9 11.01"/>
           </svg>`,
      iconBg: '#ECFDF5',
      iconColor: '#10B981',
      label: 'Approved',
      value: '1,741',
      valueColor: '#10B981',
    },
  ];
}
