import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { GuestGuard } from '../../core/guards/guest.guard';
import { AdminLayout } from '../../layouts/admin-layout/admin-layout';
const routes: Routes = [
 
  {
    path: 'login',
    canActivate: [GuestGuard],
    loadComponent: () =>
      import('./login/login.component')
        .then(m => m.LoginComponent)
  },
   {
    path: 'register',
    canActivate: [GuestGuard],
    loadComponent: () =>
      import('./register/register.component')
        .then(m => m.RegisterComponent)
   },
  {
    path: 'forgot-password',
    canActivate: [GuestGuard],
    loadComponent: () =>
      import('./password/forgotpassword/forgot-password.component')
        .then(m => m.ForgotPasswordComponent)
  },
  {
    path: 'forgot-password-change/:hash',
    canActivate: [GuestGuard],
    loadComponent: () =>
      import('./password/forgot-password-change/forgot-password-change.component')
    .then(m=> m.ResetPasswordComponent)
  },
  {
    path: '',
    component:AdminLayout,
    children: [
      {
    path: 'user-profile',
    loadComponent: () =>
      import('./user/user-profile/user-profile.component')
    .then(m=>m.UserProfileComponent)
}
]
  },
  {
    path: '',
    component:AdminLayout,
    children: [
      {
    path: 'password-change',
    loadComponent: () =>
      import('./password/password-change/password-change.component')
    .then(m=>m.PasswordChangeComponent)
}
    ]
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ],
})

export class AuthRoutingModule {}