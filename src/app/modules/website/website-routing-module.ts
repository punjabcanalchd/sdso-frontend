import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { WebsiteLayout } from '../../layouts/website-layout/website-layout';
import { HomeComponent } from './pages/home/home.compnent';
import { FaqComponent } from './pages/faq/faq.component';
import { ActRulesComponent } from './pages/act-rules/act-rules.component';
import { ContactComponent } from './pages/contact/contact.component';
import { ScreenReaderComponent } from './pages/screen-reader/screen-reader';
import { LoginComponent } from '../auth/login/login.component';
import { RtiComponent } from './pages/rti/rti.component';
import { AuthorityEventComponent } from './pages/authority-event/authority-event.component';
import { CalculatorPageComponent } from './pages/calculator-page/calculator-page.component';
import { WaterMeter } from './pages/water-meter-spec/water-meter-spec.component';
import { DivisionWiseAllocComponent } from './pages/division-wise-alloc/division-wise-alloc.component';
import { OrgStructureComponent } from './pages/org-chart/org-chart.component';
import { StaffDutiesComponent } from './pages/staff-duties/staff-duties.component';
import { OfficeDirectoryComponent } from './pages/office-directory/office-directory.component';
import { AboutComponent } from './pages/aboutus/aboutus.component';
import { NoticeboardMainComponent } from './pages/noticeboard/noticeboard.component'
import { UserManualComponent } from './pages/user-manual/user-manual.component';
import { OfficeOrdersComponent } from './pages/office-order/office-order.component';
import { CircularsComponent } from './pages/circulars/circulars.component';
import { FormsPerformaComponent } from './pages/forms-proforma/forms-proforma.component';
import { UnderProgressComponent } from './pages/under-progress/under-progress.component';
import { SearchComponent } from './pages/search/search-component';
const routes: Routes = [
  {
    path: '',
    component: WebsiteLayout,
    children: [
      { path: '',                component: HomeComponent,           title: 'Home – PWRDA' },
      { path: 'login',           component: LoginComponent,          title: 'Sign In – PWRDA' },
      { path: 'faq',             component: FaqComponent,            title: 'FAQ – PWRDA' },
      { path: 'act-rules',       component: ActRulesComponent,       title: 'Act and Rules – PWRDA' },
      { path: 'contact',         component: ContactComponent,        title: 'Contact Us – PWRDA' },
      { path: 'screen-reader',   component: ScreenReaderComponent,   title: 'Screen Reader – PWRDA' },
      { path: '',                component: HomeComponent,  title: 'Home – PWRDA' },
      { path: 'rti',             component: RtiComponent,   title: 'Right To Information – PWRDA' },
      { path: 'events',         component: AuthorityEventComponent,   title: 'Authority Event Gallery – PWRDA' },
      { path:'fee-calculator/:type', component: CalculatorPageComponent },
      { path: 'water-meter-spec' , component: WaterMeter, title: 'Water Meter Specification' },
      { path: 'div-wise-alloc', component: DivisionWiseAllocComponent, title: 'Division-Wise Allocation of Work'},
      { path: 'org-chart', component:OrgStructureComponent, title: 'Organization Chart'},
      { path: 'duties', component:StaffDutiesComponent},
      { path: 'office-directory',  component:OfficeDirectoryComponent, title: 'Office Directory'},
      { path: 'about', component:AboutComponent, title: 'About - PWRDA'},
      { path: 'notice', component:NoticeboardMainComponent, title: 'NoticeBoard'},
      { path: 'noticeboard/user-manual', component:UserManualComponent},
      { path: 'noticeboard/office-order', component: OfficeOrdersComponent, title: 'Office Orders'},
      { path: 'noticeboard/circulars', component: CircularsComponent, title: 'Notification & Circulars'},
      { path: 'noticeboard/forms&proformas', component: FormsPerformaComponent},
      { path: 'cons', component: UnderProgressComponent},
      { path: 'search', component: SearchComponent, title: 'Search - PWRDA'},
      { path: 'contactus', redirectTo: 'contact', pathMatch: 'full' },
       { path: 'ApplicationCalculator', redirectTo: 'fee-calculator/gw-extraction', pathMatch: 'full' },
      { path: 'pages/:id', redirectTo: 'cons', pathMatch: 'full' }, 
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WebsiteRoutingModule {}
