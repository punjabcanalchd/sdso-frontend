import {
  Component,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

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

  @Output() activeChildTabChange = new EventEmitter<string>();


  /**
   * Get currently selected main tab
   */
  get activeTabObject(): TabSchema | undefined {
    return this.tabs.find(
      tab => tab.id === this.activeTab
    );
  }


  /**
   * Get child tabs of currently selected main tab
   */
  get childTabs(): TabSchema[] {
    return this.activeTabObject?.tabs ?? [];
  }


  /**
   * Currently selected child tab
   */
  activeChildTab = '';


  /**
   * Select main tab
   */
  selectTab(tab: TabSchema): void {

    if (tab.disabled) {
      return;
    }

    this.activeTab = tab.id;

    this.activeTabChange.emit(tab.id);


    // Automatically select first enabled child tab
    if (tab.tabs?.length) {

      const firstEnabledTab = tab.tabs.find(
        child => !child.disabled
      );

      this.activeChildTab = firstEnabledTab?.id ?? '';

    } else {

      this.activeChildTab = '';

    }

    this.activeChildTabChange.emit(
      this.activeChildTab
    );
  }


  /**
   * Select child tab
   */
  selectChildTab(tab: TabSchema): void {

    if (tab.disabled) {
      return;
    }

    this.activeChildTab = tab.id;

    this.activeChildTabChange.emit(
      this.activeChildTab
    );
  }

}