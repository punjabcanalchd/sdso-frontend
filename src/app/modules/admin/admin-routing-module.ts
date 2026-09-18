import { Slider } from './../../core/models/slider.model';
import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../core/guards/auth.guard';
import { Dashboard } from './dashboard/dashboard.component';
import { AdminLayout } from '../../layouts/admin-layout/admin-layout';
import { MenuManagementComponent } from './common/menu/menu-managment/menu-managment.component';
import { Users } from './common/users/users-list/users-list.component';
import { Roles } from './common/roles/roles-list/roles-list.component';
import { States } from './masters/states/states.component';
import { Districts } from './masters/districts/districts.component';
import { DesignationsComponent } from './masters/designations/designations.component';
import { DivisionsComponent } from './masters/divisions/divisions.component';
import { CirclesComponent } from './masters/circles/circles.component';
import { OfficesComponent } from './masters/offices/offices.component';
import { SubDivisionsComponent } from './masters/sub-divisions/sub-divisions.component';
import { OfficeHierarchyComponent } from './masters/office-hierarchy/office-hierarchy.component';
import { DamHeadworksComponent } from './sdso/dam-headworks/dam-headworks.component';
import { DamHeadworksReadingsComponent } from './sdso/dam-headworks-readings/dam-headworks-readings.component';
import { ExceptionLogsComponent } from './log-management/exception-logs/exception-logs.component';
import { ActivityLogsComponent } from './log-management/activity-logs/activity-logs.component';
import { ActivityLogDetailsComponent } from './log-management/activity-logs/activity-log-detail/activity-log-detail.component';
import { ExceptionLogDetailComponent } from './log-management/exception-logs/exception-log-detail/exception-log-detail.component';
import { MenuFormComponent } from './common/menu/menu-form/menu-form.component';
import { NoticeboardListComponent } from './common/noticeboard/noticeboard-list.component';
import { EmailTemplatesListComponent } from './Others/email-templates-list/email-templates-list.component';
import { TranslationsListComponent } from './Others/translations/translations-list.component';



import { AdditionalRolesListComponent } from './common/additional-roles/additional-roles-list.component';
import { PagesComponent } from './Others/pages/pages-list.component';
import { SlidersListComponent } from './Others/slider/slider.component';
import { SliderImageComponent } from './Others/slider-image/slider-image.component';




const routes: Routes = [
  {
    path: '',
    component: AdminLayout,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: Dashboard, title: 'Dashboard – Admin' },

      { path: 'pages', component: PagesComponent, title: 'Pages' },
      { path: 'page', redirectTo: 'pages', pathMatch: 'full' },
      { path: 'users', component: Users, title: 'Users - Admin' },

      { path: 'sliders', component: SlidersListComponent, title: 'Slider' },
      { path: 'slider', redirectTo: 'sliders', pathMatch: 'full' },   
   
      // =========================
      // Slider Images
      // =========================

     {
      path: 'slider-image/:slider_id',
      component: SliderImageComponent,
      title: 'Slider Images'
    },
    {
      path: 'slider-image/:slider_id/create',
      component: SliderImageComponent,
      title: 'Add Slider Image'
    },
    {
      path: 'slider-image/:slider_id/edit/:image_id',
      component: SliderImageComponent,
      title: 'Edit Slider Image'
    },




      { path: 'users', component: Users, title: 'Users – Admin' },
      { path: 'user-role', redirectTo: 'roles', pathMatch: 'full' },

      { path: 'roles', component: Roles, title: 'Roles – Admin' },

      { path: 'states', component: States, title: 'States – Admin' },
      { path: 'districts', component: Districts, title: 'Districts – Admin' },

      { path: 'officehierarchy', component: OfficeHierarchyComponent, title: 'OfficeHierarchy – Admin' },
      { path: 'designation', component: DesignationsComponent, title: 'Designations – Admin' },
      { path: 'circles', component: CirclesComponent, title: 'Circles – Admin' },
      { path: 'divisions', component: DivisionsComponent, title: 'Divisions – Admin' },
      { path: 'subdivisions', component: SubDivisionsComponent, title: 'SubDivisions – Admin' },
      { path: 'offices', component: OfficesComponent, title: 'Offices – Admin' },
      { path: 'menu-management', component: MenuManagementComponent, title: 'Menu Management – Admin' },
      { path: 'dam-headworks', component: DamHeadworksComponent, title: 'Dam HeadWorks – Admin' },
      { path: 'damdailyreading', component: DamHeadworksReadingsComponent, title: 'Dam Daily Readings – Admin' },
      { path: 'exception-log', component: ExceptionLogsComponent, title: 'Exception Logs – Admin' },
      { path: 'exception-log/:id', component: ExceptionLogDetailComponent, title: 'Exception Log Details – Admin' },
      { path: 'logs', component: ActivityLogsComponent, title: 'Activity Logs – Admin' },
      { path: 'logs/:id', component: ActivityLogDetailsComponent, title: 'Activity Log Details – Admin' },
      { path: 'menus', redirectTo: 'menu-management', pathMatch: 'full' },
      { path: 'additionalroles', component: AdditionalRolesListComponent, title: 'Additional Roles – Admin' },
      { path: 'noticeboard', component: NoticeboardListComponent, title: 'Notice Board – Admin' },
      { path: 'email-template', component: EmailTemplatesListComponent, title: 'Email Templates – Admin' },
      { path: 'translation', component: TranslationsListComponent, title: 'Translations – Admin' },

    ],
    canActivate: [AuthGuard],
    data: {
      roles: ['admin']
    }
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AdminRoutingModule { }