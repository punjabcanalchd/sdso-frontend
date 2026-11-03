import { Routes } from '@angular/router';


export const routes: Routes = [
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
    path: 'reports',
    loadChildren: () =>
      import('./modules/reports/reports-module').then((m) => m.ReportsModule),
  },
  {
    path: '',
    loadChildren: () =>
      import('./modules/website/website-module').then((m) => m.WebsiteModule),
  },
];
