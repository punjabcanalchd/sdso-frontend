import { NgModule } from '@angular/core';
import { NgApexchartsModule } from 'ng-apexcharts';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing-module';

@NgModule({
  declarations: [],
  imports: [CommonModule, AdminRoutingModule, NgApexchartsModule],
})
export class AdminModule { }
