import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService } from '../../../core/auth/auth.service';
import { ToastService } from '../../../shared/services/toast.service';
import { settingSchema } from './setting.schema';
import { DynamicFormComponent } from '../../../shared/components/dynamic-form/dynamic-form.component';

@Component({
  standalone: true,
  imports: [CommonModule, DynamicFormComponent],
  selector: 'app-settings',
  styleUrl: './settings.component.scss',
  templateUrl: './settings.component.html',
})
export class SettingsComponent implements OnInit {

  @Input() title = 'Settings';
  @Input() isAdmin: boolean = true;

  settingSchema = settingSchema;
  generalSettings: any = null;
  currentTab = 'general';
  isLoading = true;
  isSubmitting = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private toast: ToastService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadGeneralSettings();
  }

  onTabChange(tab: string): void {
    this.currentTab = tab;
  }

  loadGeneralSettings(): void {
    this.isLoading = true;
    this.authService.getGeneralSettings().subscribe({
      next: (response: any) => {
        if (response && response.success) {
          this.generalSettings = response.data;
        }
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Failed to load General Settings:', error);
        this.toast.error('Failed to load general settings.');
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  onSubmit(formData: any): void {
    const activeTab = formData.activeTab || formData._activeTab || this.currentTab;

    if (activeTab === 'general') {
      this.saveGeneralSettings(formData);
    } else {
      this.toast.info(`Saving for "${activeTab}" tab is not configured yet.`);
    }
  }

  private saveGeneralSettings(formData: any): void {
    if (this.isSubmitting) return;
    this.isSubmitting = true;

    // Check if any field is a File
    let hasFile = false;
    for (const key of Object.keys(formData)) {
      if (formData[key] instanceof File) {
        hasFile = true;
        break;
      }
    }

    let payload: any;
    if (hasFile) {
      const fd = new FormData();
      for (const key of Object.keys(formData)) {
        if (key === 'activeTab' || key === '_activeTab') continue;
        const val = formData[key];
        if (val instanceof File) {
          fd.append(key, val);
        } else if (val !== null && val !== undefined) {
          fd.append(key, val.toString());
        }
      }
      payload = fd;
    } else {
      payload = { ...formData };
      delete payload.activeTab;
      delete payload._activeTab;
    }

    this.authService.updateGeneralSettings(payload).subscribe({
      next: (response: any) => {
        this.isSubmitting = false;
        if (response && response.success) {
          this.toast.success(response.message || 'General settings saved successfully.');
          this.generalSettings = response.data;
        } else {
          this.toast.error(response?.message || 'Failed to update general settings.');
        }
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.isSubmitting = false;
        const msg = error?.error?.message || 'Error updating general settings.';
        this.toast.error(msg);
        this.cdr.detectChanges();
      }
    });
  }
}
 