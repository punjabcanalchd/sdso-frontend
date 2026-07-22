import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export type SummaryCardItem = {
  icon: string;           // inline SVG string
  iconBg: string;         // e.g. '#EFF6FF' or 'rgba(16,185,129,0.1)'
  iconColor: string;      // e.g. '#10B981'
  label: string;
  value: string;
  valueColor?: string;    // defaults to #111827
};

export type SummaryCardProgress = {
  label: string;
  value: number;          // 0–100
  showChevron?: boolean;
  barColor?: string;      // e.g. 'linear-gradient(90deg, #3B82F6, #6366F1)'
  displayValue?: string;  // override display e.g. '68%', 'High'
};

@Component({
  selector: 'app-summary-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './summary-card.component.html',
  styleUrls: ['./summary-card.component.scss'],
})
export class SummaryCardComponent {
  @Input() title: string = '';
  @Input() linkLabel: string = 'View Details';
  @Input() linkHref: string = '#';
  @Input() items: SummaryCardItem[] = [];

  /** Optional progress bar section at the bottom */
  @Input() progress?: SummaryCardProgress;

  @Output() linkClicked = new EventEmitter<void>();

  onLinkClick(event: Event): void {
    event.preventDefault();
    this.linkClicked.emit();
  }
}