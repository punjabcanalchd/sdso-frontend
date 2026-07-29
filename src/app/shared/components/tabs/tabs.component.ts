import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabSchema } from '../../../core/models/tab-schema';

@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.scss',
})
export class TabsComponent {

  @Input() tabs: TabSchema[] = [];

  @Input() activeTab = '';

  @Output() activeTabChange = new EventEmitter<string>();


  selectTab(tab: TabSchema): void {

    if (!tab.disabled) {
      this.activeTab = tab.id;
      this.activeTabChange.emit(tab.id);
    }

  }

}