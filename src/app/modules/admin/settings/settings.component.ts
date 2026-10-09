import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService } from '../../../core/auth/auth.service';
import { ToastService } from '../../../shared/services/toast.service';
import { settingSchema } from './setting.schema';
import { DynamicFormComponent } from '../../../shared/components/dynamic-form/dynamic-form.component';
import { ApiService } from '../../../core/services/api.service';
import { FormField } from '../../../core/models/form-schema.model';

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
    private cdr: ChangeDetectorRef,
    private api: ApiService,
  ) {}


  private loadLayoutDropdowns(): void {
  this.loadMenus();
  this.loadSliders();
  // this.loadPages();
}

  ngOnInit(): void {
    this.loadGeneralSettings();
    this.loadLayoutDropdowns();
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

// Dropdown Values Apis call 

private loadMenus(): void {
  this.api.get<any>('/admin/menus').subscribe({
    next: (res: any) => {
      const menus = res?.data ?? [];

      const options = menus.map((menu: any) => ({
        label: menu.name_en,
        value: String(menu.menu_id)
      }));

      this.updateFieldOptions('menus', [
        { label: 'Please select a menu', value: '' },
        ...options
      ]);

      this.cdr.detectChanges();

      console.log('Mapped menu options:', options);
    },
    error: (error: any) => {
      console.error('Failed to load menus:', error);
    }
  });
}



private loadSliders(): void {
  
}

private updateFieldOptions(  fieldName: string, options: { label: string; value: string }[]
): void {
  const field = this.settingSchema.fields?.find(
    (item: FormField) => item.name === fieldName
  );

  if (field) {
    field.options = options;
  }
}




}
 