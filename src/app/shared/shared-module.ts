import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { SafeHtmlPipe } from './pipes/safe-html.pipe';

@NgModule({
  declarations: [],
  imports: [CommonModule, TranslateModule, SafeHtmlPipe],
  exports: [
    CommonModule,
    TranslateModule,
    SafeHtmlPipe
  ]
})
export class SharedModule {}
