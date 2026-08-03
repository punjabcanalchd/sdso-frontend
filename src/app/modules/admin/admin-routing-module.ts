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
import { MenuFormComponent } from './common/menu/menu-form/menu-form.component';

import { PagesComponent } from '../pages/pages-list/pages-list.component';


const routes: Routes = [
  {
    path: '',
    component: AdminLayout,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: Dashboard, title: 'Dashboard – Admin' },

      { path: 'pages', component: PagesComponent, title: 'Pages' },
      { path: 'page', redirectTo: 'pages', pathMatch: 'full' },

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
      { path: 'menus', redirectTo: 'menu-management', pathMatch: 'full' },
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