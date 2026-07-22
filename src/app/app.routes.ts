import { Routes } from '@angular/router';


export const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./modules/website/website-module').then((m) => m.WebsiteModule),
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./modules/auth/auth-module').then((m) => m.AuthModule),
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('./modules/admin/admin-module').then((m) => m.AdminModule),
  },
  {
    path: 'applicant',
    loadChildren: () =>
      import('./modules/applicant/applicant-module').then(
        (m) => m.ApplicantModule
      ),
  },
  {
    path: 'officers',
    loadChildren: () =>
      import('./modules/officers/officers-module').then(
        (m) => m.OfficersModule
      ),
  },
  {
    path: 'reports',
    loadChildren: () =>
      import('./modules/reports/reports-module').then((m) => m.ReportsModule),
  },
 


];
