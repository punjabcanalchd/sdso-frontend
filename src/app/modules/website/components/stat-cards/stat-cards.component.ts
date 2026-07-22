import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface StatCard {
  id: string;
  icon: string;
  count: number;
  label: string;
  colorVar: string;
  approved: number;
  inProcess: number;
  rejected: number;
}

@Component({
  selector: 'app-stat-cards',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stat-cards.component.html',
  styleUrl: './stat-cards.component.scss',
})
export class StatCardsComponent {
statCards = [
  { id: 1, label: 'GW Extraction', count: 1942, approved: 1748, inProcess: 127, rejected: 67, icon: 'bi-water', themeClass: 'bg-info text-white' },
  { id: 2, label: 'Drilling Rig', count: 31, approved: 20, inProcess: 11, rejected: 0, icon: 'bi-tools', themeClass: 'bg-success text-white' },
  { id: 3, label: 'Water Tanker', count: 9, approved: 3, inProcess: 6, rejected: 0, icon: 'bi-truck', themeClass: 'bg-danger text-white'  },
  { id: 4, label: 'Amendments', count: 262, approved: 209, inProcess: 50, rejected: 3, icon: 'bi-file-earmark-text', themeClass: 'bg-warning text-white'  },
  { id: 5, label: 'Intimations', count: 1043, approved: 881, inProcess: 5, rejected: 157, icon: 'bi-bell', themeClass: 'bg-primary text-white'  },
  { id: 6, label: 'Offline', count: 313, approved: 213, inProcess: 100, rejected: 0, icon: 'bi-truck', themeClass: 'bg-secondary text-white'  },

];

}