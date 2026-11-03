import { CommonModule } from '@angular/common';
import { Component, inject, OnInit,ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FrontendPagesService } from './frontend-pages.service';
import { Subject, takeUntil } from 'rxjs';
import { LanguageService } from '../../../../core/services/language.service';
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
  private languageService = inject(LanguageService);
  private destroy$ = new Subject<void>();

  private cdr = inject(ChangeDetectorRef);

  pageData: any = null;
  loading = false;
  errorMessage = '';
  languageId = 1;

  ngOnInit(): void {
    this.route.paramMap
       .pipe(takeUntil(this.destroy$))
       .subscribe(params => {
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

     // Get language ID from LanguageService
        const languageId =
          this.languageService.getCurrentLanguageId();
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

 ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}