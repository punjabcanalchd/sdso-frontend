import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../core/guards/auth.guard';
import { Dashboard } from './dashboard/dashboard.component';
import { AdminLayout } from '../../layouts/admin-layout/admin-layout';
import { MenuManagementComponent } from './common/menu/menu-managment/menu-managment.component';
import { Users } from './common/users/users-list/users-list.component';
import { Roles } from './common/roles/roles-list/roles-list.component';
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