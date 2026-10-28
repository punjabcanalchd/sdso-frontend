import { CommonModule } from '@angular/common';
import { Component, inject, OnInit,ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FrontendPagesService } from './frontend-pages.service';
import { PageContentComponent } from './../../shared/page-content/page-content.component';

@Component({
  selector: 'app-frontend-pages',
  standalone: true,
  imports: [CommonModule, PageContentComponent],
  templateUrl: './frontend-pages.component.html',
  styleUrl: './frontend-pages.component.scss'
})
export class FrontendPagesComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private pageService = inject(FrontendPagesService);
  private cdr = inject(ChangeDetectorRef);

  pageData: any = null;
  loading = false;
  errorMessage = '';
  languageId = 1;

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const pageId = Number(params.get('pageId'));
      const languageParam = params.get('languageId');

      if (!Number.isInteger(pageId) || pageId <= 0) {
        this.pageData = null;
        this.loading = false;
        this.errorMessage = 'Invalid page ID.';
        return;
      }

      if (languageParam === null) {
        this.router.navigate(['/pages', pageId, 1], {
          replaceUrl: true
        });
        return;
      }

      const languageId = Number(languageParam);

      if (![1, 2].includes(languageId)) {
        this.pageData = null;
        this.loading = false;
         this.cdr.markForCheck();
        this.errorMessage = 'Invalid language ID.';
        return;
      }

      this.languageId = languageId;
      this.loadPage(pageId, languageId);
    });
  }



loadPage(pageId: number, languageId: number): void {
  this.loading = true;
  this.pageData = null;
  this.errorMessage = '';

  this.pageService.getPage(pageId, languageId).subscribe({
    next: (res: any) => {     

      if (res?.success && res?.data) {
         this.pageData = {
          ...res.data,
          description: res.data.description?.replace(
            /\{split_para\}/g,
            '<br><br>'
          )
        };
      } else {
        this.errorMessage = res?.message || 'Page not found.';
      }

      this.loading = false;
      this.cdr.markForCheck();

    },

    error: (err: any) => {
      console.error('Laravel API error:', err);

      this.errorMessage =
        err?.error?.message || 'Unable to load the page.';

      this.loading = false;
      this.cdr.markForCheck();
    }
  });
}

}