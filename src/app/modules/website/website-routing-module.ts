
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

import { WaterMeter } from './pages/water-meter-spec/water-meter-spec.component';
import { DivisionWiseAllocComponent } from './pages/division-wise-alloc/division-wise-alloc.component';
import { OrgStructureComponent } from './pages/org-chart/org-chart.component';
import { StaffDutiesComponent } from './pages/staff-duties/staff-duties.component';
import { OfficeDirectoryComponent } from './pages/office-directory/office-directory.component';
import { AboutComponent } from './pages/aboutus/aboutus.component';
import { NoticeboardMainComponent } from './pages/noticeboard/noticeboard.component';
import { UserManualComponent } from './pages/user-manual/user-manual.component';
import { OfficeOrdersComponent } from './pages/office-order/office-order.component';
import { CircularsComponent } from './pages/circulars/circulars.component';
import { FormsPerformaComponent } from './pages/forms-proforma/forms-proforma.component';
import { UnderProgressComponent } from './pages/under-progress/under-progress.component';
import { SearchComponent } from './pages/search/search-component';
import { FrontendPagesComponent } from './pages/frontend-pages/frontend-pages.component';
import { NoticeboardDetailComponent } from './pages/noticeboard-detail/noticeboard-detail.component';

import { LanguageGuard } from '../../core/guards/language.guard';

const websiteChildren: Routes = [

  { path: '', component: HomeComponent, title: 'Home – SDSO' },
  { path: 'login', component: LoginComponent },

  { path: 'faq', component: FaqComponent },
  { path: 'act-rules', component: ActRulesComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'screen-reader', component: ScreenReaderComponent },
  { path: 'rti', component: RtiComponent },
  { path: 'events', component: AuthorityEventComponent },

  { path: 'water-meter-spec', component: WaterMeter },
  { path: 'div-wise-alloc', component: DivisionWiseAllocComponent },
  { path: 'org-chart', component: OrgStructureComponent },
  { path: 'duties', component: StaffDutiesComponent },
  { path: 'office-directory', component: OfficeDirectoryComponent },
  { path: 'about', component: AboutComponent },

  { path: 'notice', component: NoticeboardMainComponent },
  { path: 'noticeboard/user-manual', component: UserManualComponent },
  { path: 'noticeboard/office-order', component: OfficeOrdersComponent },
  { path: 'noticeboard/circulars', component: CircularsComponent },
  { path: 'noticeboard/forms&proformas', component: FormsPerformaComponent },

  { path: 'cons', component: UnderProgressComponent },
  { path: 'search', component: SearchComponent },

  // Redirects
  { path: 'contactus', redirectTo: 'contact', pathMatch: 'full' },
  { path: 'announcements', redirectTo: 'noticeboard/circulars', pathMatch: 'full' },

  // Dynamic pages
  { path: 'pages/:pageId/:languageId', component: FrontendPagesComponent },
  { path: 'pages/:pageId', component: FrontendPagesComponent },

  // Noticeboard
  { path: 'noticeboard/:id', component: NoticeboardDetailComponent },

];

const routes: Routes = [

  // Default English routes
  {
    path: '',
    component: WebsiteLayout,
    children: websiteChildren
  },

  // Other language routes: pb, hi, etc.
  {
    path: ':lang',
    component: WebsiteLayout,
    canActivate: [LanguageGuard],
    children: websiteChildren
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WebsiteRoutingModule {}
