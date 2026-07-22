import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';

export interface KpiStatusType {
  key: string;
  label: string;
}

export interface KpiCardItem {
  id: string | number;
  label: string;
  count: number | string;
  icon: string;
  bgClass: string;
  textClass: string;
  [key: string]: any;
}

@Component({
  selector: 'app-kpi-cards',
  imports: [NgClass],
  templateUrl: './kpi-cards.component.html',
  styleUrl: './kpi-cards.component.scss',
})
export class KpiCards {
  @Input() statusTypes: KpiStatusType[] = [];
  @Input() kpiCards: KpiCardItem[] = [];
}

