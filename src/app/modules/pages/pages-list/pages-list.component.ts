import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';

// import { DynamicFormComponent } from '../../../shared/components/dynamic-form/dynamic-form.component';
import {
  DocumentListComponent,
  TableColumn
} from '../../../shared/components/document-list/document-list.component';
import { ModalFormComponent } from '../../../shared/components/modal-form/modal-form.component';

import { ToastService } from '../../../shared/services/toast.service';
// import { TabsComponent } from '../../../shared/components/tabs/tabs.component';

import { AuthService } from '../../../core/auth/auth.service';
import { pageSchema } from './page-form.schema';
import { LanguageService } from '../../../core/services/language.service';


@Component({
   standalone: true,
  selector: 'app-pages',
 
  imports: [
    DocumentListComponent,
    ModalFormComponent,
    // TabsComponent

  ],
  templateUrl: './pages-list.component.html',
  styleUrl: './pages-list.component.scss'
})
export class PagesComponent implements OnInit {
  @ViewChild(ModalFormComponent)
  pageModal!: ModalFormComponent;

  private toast = inject(ToastService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  constructor(
    private pageService: AuthService,
    private cdr: ChangeDetectorRef,
    // private languageService: LanguageService,
  ) {}

   data: any[] = [];
  tableColumns: TableColumn[] = [];

  formInitialData: any = {};

  isEditMode = false;
  pageId: string | null = null;
  pageSchema = pageSchema;
  tableData: any[] = [];
  totalRecords: number = 0;
  isLoading: boolean = false;

  currentPage = 1;
  pageSize = 25;
  pagination: any = {};
  search = '';
  sortColumn = '';
  sortDirection = 'asc';

  onServerAction(params: { page: number; per_page: number; search: string; sort_column: string; sort_direction: string }) {
  this.loadPages();
}

  ngOnInit(): void {
    this.tableColumns = [
      { key: 'titleHtml', label: 'Title', type: 'html' },
      { key: 'status', label: 'Status', type: 'toggle', toggleConfig: { trueLabel: 'Active', falseLabel: 'Inactive' } },
      { key: 'sortOrder', label: 'Page Order', type: 'text' },
      { key: 'createdAt', label: 'Created at', type: 'text' },
      { key: 'action', label: 'Action', type: 'edit' }
    ];
    this.loadPages();
  }

  formatDate(dateInput: any): string {
    if (!dateInput) return '';
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) return dateInput;
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  bindCheckboxLogic() {
    const dForm = this.pageModal?.dynamicForm;

    if (dForm && dForm.form) {
      const formGroup = dForm.form;

      formGroup.get('same_as_english')?.valueChanges.subscribe(isChecked => {
        if (isChecked) {
          // formGroup.get('pa_title')?.setValue(formGroup.get('en_title')?.value);
          // formGroup.get('pa_description')?.setValue(formGroup.get('en_description')?.value);
          // formGroup.get('pa_meta_title')?.setValue(formGroup.get('en_meta_title')?.value);
          // formGroup.get('pa_meta_description')?.setValue(formGroup.get('en_meta_description')?.value);
          // formGroup.get('pa_meta_keyword')?.setValue(formGroup.get('en_meta_keyword')?.value);
        }
      });
      // formGroup.get('en_title')?.valueChanges.subscribe(val => {
      //   if (formGroup.get('same_as_english')?.value) formGroup.get('pa_title')?.setValue(val);
      // });
      // formGroup.get('en_description')?.valueChanges.subscribe(val => {
      //   if (formGroup.get('same_as_english')?.value) formGroup.get('pa_description')?.setValue(val);
      // });
      // formGroup.get('en_meta_title')?.valueChanges.subscribe(val => {
      //   if (formGroup.get('same_as_english')?.value) formGroup.get('pa_meta_title')?.setValue(val);
      // });
      // formGroup.get('en_meta_description')?.valueChanges.subscribe(val => {
      //   if (formGroup.get('same_as_english')?.value) formGroup.get('pa_meta_description')?.setValue(val);
      // });
      // formGroup.get('en_meta_keyword')?.valueChanges.subscribe(val => {
      //   if (formGroup.get('same_as_english')?.value) formGroup.get('pa_meta_keyword')?.setValue(val);
      // });
    }
  }

  loadPages(page: number = this.currentPage): void {

    const params = {
      page: this.currentPage,
      per_page: this.pageSize,
      search: this.search,
      sort_column: this.sortColumn,
      sort_direction: this.sortDirection
    };
  this.isLoading = true;
    this.pageService.getPages(params).subscribe({
      next: (res) => {
        this.data = (res.data || []).map((page: any, index: number) => {
          const englishTitle = page.english_description?.title || 'N/A';
          const punjabiTitleStr = page.punjabi_description?.title 
            ? `<div class="text-dark lh-1 pt-2"><span class="text-muted fw-bold small">PB:</span> ${page.punjabi_description.title}</div>` 
            : '';
          return {
            id: page.public_id,
            orignalSeq: (params.page - 1) * params.per_page + index + 1,
            titleHtml: `<div class="text-dark pb-2 lh-1"><span class="text-muted fw-bold small">EN:</span> ${englishTitle}</div>${punjabiTitleStr}`,
            statusText: page.status ? 'Active' : 'In active',
            status: page.status,
            sortOrder: page.sort_order ?? 0,
            createdAt: this.formatDate(page.created_at),
            canEdit: true,
            description: page.english_description?.description || ''
          };
        });
        this.isLoading = false;
        this.totalRecords = res.pagination.total;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log(err);
        this.isLoading = false;
        this.toast.show('error', err.message);
      }
    });
  }
  openCreateModal(): void {
    this.isEditMode = false;
    this.pageId = null;
    this.pageSchema.submitLabel = 'Create Page';

    if (this.pageModal?.dynamicForm) {
      this.pageModal.dynamicForm.form.reset();
    }
    
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { public_id: null },
      queryParamsHandling: 'merge'
    }).then(() => {
      this.pageModal.open();
      setTimeout(() => this.bindCheckboxLogic(), 100);
    });
  }

  openEditModal(id: string | number): void {
    this.isEditMode = true;
    this.pageId = String(id);
    this.pageSchema.submitLabel = 'Update Page';

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { public_id: this.pageId },
      queryParamsHandling: 'merge'
    }).then(() => {
      // this.pageService.getPageByPublicId(String(id)).subscribe({
      //   next: (res) => {
      //     if (res.data) {
      //       const pageData = res.data;
      //       const english = pageData.english_description || {};
      //       const punjabi = pageData.punjabi_description || {};

      //       const patchValue = {
      //         en_title: english.title,
      //         en_description: english.description,
      //         en_meta_title: english.meta_title,
      //         en_meta_description: english.meta_description,
      //         en_meta_keyword: english.meta_keyword,
      //         same_as_english: (english.title === punjabi.title && english.description === punjabi.description),
      //         pa_title: punjabi.title,
      //         pa_description: punjabi.description,
      //         pa_meta_title: punjabi.meta_title,
      //         pa_meta_description: punjabi.meta_description,
      //         pa_meta_keyword: punjabi.meta_keyword,
      //         slug: pageData.slug,
      //         status: !!pageData.status,
      //         sort_order: pageData.sort_order ?? 0,
      //         page_type: pageData.page_type !== undefined && pageData.page_type !== null ? String(pageData.page_type) : '1',
      //         external_url: pageData.external_url
      //       };

      //       if (this.pageModal?.dynamicForm) {
      //         this.pageModal.dynamicForm.form.reset();
      //         this.pageModal.dynamicForm.form.patchValue(patchValue);
      //       }
      //       this.pageModal.open();
      //       setTimeout(() => this.bindCheckboxLogic(), 100);
      //     }
      //   },
      //   error: (err) => {
      //     this.toast.show('error', err.message);
      //   }
      // });
    });
  }

  handleAction(event: any): void {
    switch (event.action || event.actionName) {
      case 'edit':
        this.openEditModal(event.row.id);
        break;

      // case 'delete':
      //   this.deletePage(event.row.id);
      //   break;
    }
  }

  // deletePage(id: string): void {
  //   if (confirm('Are you sure you want to delete this page?')) {
  //     this.pageService.deletePage(id).subscribe({
  //       next: () => {
  //         this.toast.show('success', 'Page deleted successfully!', 4000);
  //         this.loadPages();
  //       },
  //       error: (err) => {
  //         console.error('Failed to delete page:', err);
  //         this.toast.show('error', err.error?.message || 'Failed to delete page');
  //       }
  //     });
  //   }
  // }

  onSubmit(formData: any): void {
    const payload = new FormData();
    
    // Required fields
    payload.append('en_title', formData.en_title || '');
    payload.append('en_description', formData.en_description || '');
    
    // Boolean/Integer always sent
    payload.append('same_as_english', (formData.same_as_english === true || formData.same_as_english === '1') ? '1' : '0');
    payload.append('status', (formData.status === true || formData.status === '1' || formData.status === 1) ? '1' : '0');
    payload.append('sort_order', String(formData.sort_order ?? 0));
    payload.append('page_type', formData.page_type || '1');

    // Safe helper to append nullable optional fields only if filled
    const appendIfFilled = (key: string, value: any) => {
      if (value !== undefined && value !== null && String(value).trim() !== '') {
        payload.append(key, value);
      }
    };

    // appendIfFilled('en_meta_title', formData.en_meta_title);
    // appendIfFilled('en_meta_description', formData.en_meta_description);
    // appendIfFilled('en_meta_keyword', formData.en_meta_keyword);
    
    // appendIfFilled('pa_title', formData.pa_title);
    // appendIfFilled('pa_description', formData.pa_description);
    // appendIfFilled('pa_meta_title', formData.pa_meta_title);
    // appendIfFilled('pa_meta_description', formData.pa_meta_description);
    // appendIfFilled('pa_meta_keyword', formData.pa_meta_keyword);
    
    // appendIfFilled('slug', formData.slug);
    // appendIfFilled('external_url', formData.external_url);

    // Handle file upload strictly as File
    // if (formData.page_banner instanceof File) {
    //   payload.append('page_banner', formData.page_banner);
    // }

    if (this.isEditMode && this.pageId) {
      // this.pageService.updatePage(this.pageId, payload).subscribe({
      //   next: () => {
      //     this.toast.show('success', 'Page updated successfully!', 4000);
      //     this.closeModal();
      //     this.loadPages();
      //   },
      //   error: (err) => {
      //     console.error('Failed to update page:', err);
      //     this.toast.show('error', err.error?.message || 'Failed to update page');
      //   }
      // });
    } else {
      // this.pageService.createPage(payload).subscribe({
      //   next: () => {
      //     this.toast.show('success', 'Page created successfully!', 4000);
      //     this.closeModal();
      //     this.loadPages();
      //   },
      //   error: (err) => {
      //     console.error('Failed to create page:', err);
      //     this.toast.show('error', err.message);
      //   }
      // });
    }
  }

  closeModal(): void {
    this.pageModal.close();
  }

  onModalClosed(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { public_id: null },
      queryParamsHandling: 'merge'
    });
  }
}