import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
  SimpleChanges
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
export class TabsComponent implements OnInit, OnChanges {

  @Input() tabs: TabSchema[] = [];

  @Input() activeTab = '';

  @Input() activeChildTab = '';

  @Output() activeTabChange = new EventEmitter<string>();

  @Output() activeChildTabChange = new EventEmitter<string>();

  ngOnInit(): void {
    this.initializeTabs();
  }

  ngOnChanges(changes: SimpleChanges): void {

    if (changes['tabs'] && !changes['tabs'].firstChange) {
      this.initializeTabs();
    }

    if (changes['activeTab'] && !changes['activeTab'].firstChange) {
      this.selectActiveParentTab();
    }
  }

  /**
   * Initialize parent and child tab
   */
  private initializeTabs(): void {

    if (!this.tabs?.length) {
      return;
    }

    let selectedTab = this.tabs.find(
      tab => tab.id === this.activeTab && !tab.disabled
    );

    // If active tab is not found,
    // select first enabled parent tab.
    if (!selectedTab) {
      selectedTab = this.tabs.find(
        tab => !tab.disabled
      );
    }

    if (!selectedTab) {
      return;
    }

    this.activeTab = selectedTab.id;

    this.activeTabChange.emit(this.activeTab);

    // Automatically select first child
    this.selectFirstChild(selectedTab);
  }

  /**
   * Select currently active parent tab
   */
  private selectActiveParentTab(): void {

    const selectedTab = this.tabs.find(
      tab => tab.id === this.activeTab && !tab.disabled
    );

    if (!selectedTab) {
      return;
    }

    this.selectFirstChild(selectedTab);
  }

  /**
   * Active parent tab object
   */
  get activeTabObject(): TabSchema | undefined {
    return this.tabs.find(
      tab => tab.id === this.activeTab
    );
  }

  /**
   * Children of active parent tab
   */
  get childTabs(): TabSchema[] {
    return this.activeTabObject?.tabs ?? [];
  }

  /**
   * Select parent tab
   */
  selectTab(tab: TabSchema): void {

    if (tab.disabled) {
      return;
    }

    this.activeTab = tab.id;

    this.activeTabChange.emit(this.activeTab);

    // IMPORTANT:
    // Whenever General / Meta Information etc.
    // is selected, first child is automatically selected.
    this.selectFirstChild(tab);
  }

  /**
   * Select child tab
   */
  selectChildTab(tab: TabSchema): void {

    if (tab.disabled) {
      return;
    }

    this.activeChildTab = tab.id;

    this.activeChildTabChange.emit(this.activeChildTab);
  }

  /**
   * Automatically select first enabled child
   */
  private selectFirstChild(tab: TabSchema): void {

    const firstChild = tab.tabs?.find(
      child => !child.disabled
    );

    if (!firstChild) {
      this.activeChildTab = '';
      this.activeChildTabChange.emit('');
      return;
    }

    this.activeChildTab = firstChild.id;

    this.activeChildTabChange.emit(
      this.activeChildTab
    );
  }
}