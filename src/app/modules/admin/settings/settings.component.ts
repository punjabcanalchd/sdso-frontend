import { Routes } from '@angular/router';
import {Component,OnInit,ViewChild,inject,Input}from'@angular/core';
import{ActivatedRoute,Router}from'@angular/router';
import{ChangeDetectorRef}from'@angular/core';

import { DocumentListComponent, TableColumn } from '../../../shared/components/document-list/document-list.component';
import { ModalFormComponent } from '../../../shared/components/modal-form/modal-form.component';

import{AuthService}from'../../../core/auth/auth.service';
import{ToastService}from'../../../shared/services/toast.service';
import { environment } from '../../../../environments/environment';
import { settingSchema } from './setting.schema';
import { DynamicFormComponent } from '../../../shared/components/dynamic-form/dynamic-form.component';



@Component({
  imports: [DynamicFormComponent],
  selector: 'app-settings',
  styleUrl: './settings.component.scss',
  templateUrl: './settings.component.html',
})
export class SettingsComponent {

@Input() title = 'Settings';
@Input()isAdmin:boolean=true;

settingSchema = settingSchema;
 generalSettings: any = {};


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



loadGeneralSettings(): void {
  this.authService.getGeneralSettings().subscribe({

    next: (response: any) => {
      console.log('General Settings:', response);

      if (response.success) {
        this.generalSettings = response.data;
      }

    },

    error: (error) => {
      console.error('Failed to load General Settings:', error);
    }

  });
}


}
 