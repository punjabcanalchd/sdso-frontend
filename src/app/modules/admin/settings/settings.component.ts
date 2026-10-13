import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService } from '../../../core/auth/auth.service';
import { ToastService } from '../../../shared/services/toast.service';
import { settingSchema } from './setting.schema';
import { DynamicFormComponent } from '../../../shared/components/dynamic-form/dynamic-form.component';
import { ApiService } from '../../../core/services/api.service';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
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
    this.loadPages();
  }

  ngOnInit(): void {
    this.loadAllSettings();
    this.loadLayoutDropdowns();
  }

  onTabChange(tab: string): void {
    this.currentTab = tab;
  }

  loadAllSettings(): void {
    this.isLoading = true;
    forkJoin({
      general: this.api.get<any>('/admin/settings/general').pipe(catchError(() => of({ data: {} }))),
      layout: this.api.get<any>('/admin/settings/layout').pipe(catchError(() => of({ data: {} }))),
      footer: this.api.get<any>('/admin/settings/footer').pipe(catchError(() => of({ data: {} }))),
      manageSection: this.api.get<any>('/admin/settings/manage-section').pipe(catchError(() => of({ data: {} }))),
      logo: this.api.get<any>('/admin/settings/logo').pipe(catchError(() => of({ data: {} }))),
      contactUs: this.api.get<any>('/admin/settings/contact-us').pipe(catchError(() => of({ data: {} }))),
      metaInformation: this.api.get<any>('/admin/settings/meta-information').pipe(catchError(() => of({ data: {} }))),
      additionalSettings: this.api.get<any>('/admin/settings/additional-settings').pipe(catchError(() => of({ data: {} }))),
    }).subscribe({
      next: (results) => {
        this.generalSettings = {
          ...(results.general?.data ?? {}),
          ...(results.layout?.data ?? {}),
          ...(results.footer?.data ?? {}),
          ...(results.manageSection?.data ?? {}),
          ...(results.logo?.data ?? {}),
          ...(results.contactUs?.data ?? {}),
          ...(results.metaInformation?.data ?? {}),
          ...(results.additionalSettings?.data ?? {}),
        };
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Failed to load settings:', error);
        this.toast.error('Failed to load settings.');
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  onSubmit(formData: any): void {
    const activeTab = formData.activeTab || formData._activeTab || this.currentTab;

    const tabConfig: Record<string, { endpoint: string; label: string }> = {
      general: { endpoint: '/admin/settings/general/update', label: 'General' },
      layout: { endpoint: '/admin/settings/layout/update', label: 'Layout' },
      footer: { endpoint: '/admin/settings/footer/update', label: 'Footer' },
      managesection: { endpoint: '/admin/settings/manage-section/update', label: 'Manage Section' },
      logosection: { endpoint: '/admin/settings/logo/update', label: 'Logo' },
      contactUssection: { endpoint: '/admin/settings/contact-us/update', label: 'Contact Us' },
      metaInformationsection: { endpoint: '/admin/settings/meta-information/update', label: 'Meta Information' },
      additionalSettingssection: { endpoint: '/admin/settings/additional-settings/update', label: 'Additional Settings' },
    };

    const config = tabConfig[activeTab];
    if (config) {
      this.saveTabSettings(config.endpoint, config.label, formData);
    } else {
      this.toast.info(`Saving for "${activeTab}" tab is not configured yet.`);
    }
  }

  private saveTabSettings(endpoint: string, label: string, formData: any): void {
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
        } else if (Array.isArray(val)) {
          val.forEach((item, idx) => {
            fd.append(`${key}[${idx}]`, item);
          });
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

    this.api.post<any>(endpoint, payload).subscribe({
      next: (response: any) => {
        this.isSubmitting = false;
        if (response && response.success) {
          this.toast.success(response.message || `${label} settings saved successfully.`);
          if (response.data) {
            this.generalSettings = { ...this.generalSettings, ...response.data };
          }
        } else {
          this.toast.error(response?.message || `Failed to update ${label.toLowerCase()} settings.`);
        }
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.isSubmitting = false;
        const msg = error?.error?.message || `Error updating ${label.toLowerCase()} settings.`;
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

      const menuFields = ['menus', 'footer_category_1_menus', 'footer_category_2_menus', 'footer_category_3_menus'];
      for (const f of menuFields) {
        this.updateFieldOptions(f, [
          { label: 'Please Select', value: '' },
          ...options
        ]);
      }

      this.cdr.detectChanges();
    },
    error: (error: any) => {
      console.error('Failed to load menus:', error);
    }
  });
}

private loadSliders(): void {
  this.api.get<any>('/admin/sliders').subscribe({
    next: (res: any) => {
      const sliders = res?.data ?? [];

      const options = sliders.map((slider: any) => ({
        label: slider.name ?? slider.title,
        value: String(
          slider.slider_id ?? slider.id ?? slider.public_id ?? slider.slug
        )
      }));

      const sliderFields = [
        'home_page_slider',
        'footer_slider',
        'home_page_link_slider',
        'home_page_other_links_slider',
        'home_page_top_footer_links_slider'
      ];

      for (const fieldName of sliderFields) {
        this.updateFieldOptions(fieldName, [
          { label: 'Please Select', value: '' },
          ...options
        ]);
      }

      this.cdr.detectChanges();
    },
    error: (error: any) => {
      console.error('Failed to load sliders:', error);
    }
  });
}

private loadPages(): void {
  this.api.get<any>('/admin/pages').subscribe({
    next: (res: any) => {
      const pages = res?.data ?? [];

      const options = pages.map((page: any) => ({
        label: page.name_en || page.name_pb || 'Unnamed page',
        value: String(page.page_id ?? page.id ?? page.public_id)
      }));

      

      this.updateFieldOptions([
        'index_text_page',
        'screen_reader_page'
      ], [
        { label: 'Please Select', value: '' },
        ...options
      ]);


      this.cdr.detectChanges();
    },
    error: (error: any) => {
      console.error('Failed to load pages:', error);
    }
  });
}

private updateFieldOptions(
  fieldNames: string | string[],
  options: { label: string; value: string }[]
): void {
  const names = Array.isArray(fieldNames)
    ? fieldNames
    : [fieldNames];

  names.forEach((fieldName) => {
    const field = this.settingSchema.fields?.find(
      (item: FormField) => item.name === fieldName
    );

    if (field) {
      field.options = [...options];
    } else {
      console.warn(`Field not found in settingSchema: ${fieldName}`);
    }
  });
}




}
 