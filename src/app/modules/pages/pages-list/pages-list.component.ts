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
  // @Input() pageId!: string;

onServerAction(params: {
  page: number;
  per_page: number;
  search: string;
  sort_column: string;
  sort_direction: string;
}) {
  this.currentPage = params.page;
  this.pageSize = params.per_page;
  this.search = params.search;
  this.sortColumn = params.sort_column;
  this.sortDirection = params.sort_direction;

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
          formGroup.get('pa_title')?.setValue(formGroup.get('en_title')?.value);
          formGroup.get('pa_description')?.setValue(formGroup.get('en_description')?.value);
          formGroup.get('pa_meta_title')?.setValue(formGroup.get('en_meta_title')?.value);
          formGroup.get('pa_meta_description')?.setValue(formGroup.get('en_meta_description')?.value);
          formGroup.get('pa_meta_keyword')?.setValue(formGroup.get('en_meta_keyword')?.value);
        }
      });
      formGroup.get('en_title')?.valueChanges.subscribe(val => {
        if (formGroup.get('same_as_english')?.value) formGroup.get('pa_title')?.setValue(val);
      });
      formGroup.get('en_description')?.valueChanges.subscribe(val => {
        if (formGroup.get('same_as_english')?.value) formGroup.get('pa_description')?.setValue(val);
      });
      formGroup.get('en_meta_title')?.valueChanges.subscribe(val => {
        if (formGroup.get('same_as_english')?.value) formGroup.get('pa_meta_title')?.setValue(val);
      });
      formGroup.get('en_meta_description')?.valueChanges.subscribe(val => {
        if (formGroup.get('same_as_english')?.value) formGroup.get('pa_meta_description')?.setValue(val);
      });
      formGroup.get('en_meta_keyword')?.valueChanges.subscribe(val => {
        if (formGroup.get('same_as_english')?.value) formGroup.get('pa_meta_keyword')?.setValue(val);
      });
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
      console.log(res.data);

      this.data = (res.data || []).map((page: any, index: number) => {

        const englishTitle = page.name_en || 'N/A';

        const punjabiTitleStr = page.name_pb
          ? `<div class="text-dark lh-1 pt-2">
              <span class="text-muted fw-bold small">PB:</span> 
              ${page.name_pb}
            </div>`
          : '';

        return {
          id: page.public_id,

          orignalSeq: (params.page - 1) * params.per_page + index + 1,

          titleHtml: `
            <div class="text-dark pb-2 lh-1">
              <span class="text-muted fw-bold small">EN:</span> 
              ${englishTitle}
            </div>
            ${punjabiTitleStr}
          `,

          statusText: page.status ? 'Active' : 'In active',

          status: page.status,

          sortOrder: page.sort_order ?? 0,

          createdAt: this.formatDate(page.created_at),

          canEdit: true,

          description: page.description || ''
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
    // this.pageService.getPages(params).subscribe({
    //   next: (res) => {
    //     this.data = (res.data || []).map((page: any, index: number) => {
    //         console.log(res.data);

            

    //       const englishTitle = page.name_en?.title || 'N/A';
    //       const punjabiTitleStr = page.name_pb?.title 
    //         ? `<div class="text-dark lh-1 pt-2"><span class="text-muted fw-bold small">PB:</span> ${page.punjabi_description.title}</div>` 
    //         : '';
    //         console.log(englishTitle);
    //         console.log(punjabiTitleStr);


    //       return {
    //         id: page.public_id,
    //         orignalSeq: (params.page - 1) * params.per_page + index + 1,
    //         titleHtml: `<div class="text-dark pb-2 lh-1"><span class="text-muted fw-bold small">EN:</span> ${englishTitle}</div>${punjabiTitleStr}`,
    //         statusText: page.status ? 'Active' : 'In active',
    //         status: page.status,
    //         sortOrder: page.sort_order ?? 0,
    //         createdAt: this.formatDate(page.created_at),
    //         canEdit: true,
    //         description: page.english_description?.description || ''
    //       };
    //     });
    //     this.isLoading = false;
    //     this.totalRecords = res.pagination.total;
    //     this.cdr.detectChanges();
    //   },
    //   error: (err) => {
    //     console.log(err);
    //     this.isLoading = false;
    //     this.toast.show('error', err.message);
    //   }
    // });
  }


 
  openCreateModal(){
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

    // API call - no page reload
    this.pageService.getPageByPublicId(String(id)).subscribe({

      next: (res: any) => {

        if (!res.data) {
          console.error('Page data not found');
          return;
        }

        const pageData = res.data;

        console.log('Page ID:', id);
        console.log('API page_banner:', pageData.page_banner);

        const patchValue = {

          name_en: pageData.name_en ?? '',
          description_en: pageData.description_en ?? '',
          meta_title_en: pageData.meta_title_en ?? '',
          meta_description_en: pageData.meta_description_en ?? '',
          meta_keyword_en: pageData.meta_keyword_en ?? '',

          name_pb: pageData.name_pb ?? '',
          description_pb: pageData.description_pb ?? '',
          meta_title_pb: pageData.meta_title_pb ?? '',
          meta_description_pb: pageData.meta_description_pb ?? '',
          meta_keyword_pb: pageData.meta_keyword_pb ?? '',

          slug: pageData.slug ?? '',
          status: !!pageData.status,
          sort_order: pageData.sort_order ?? 0,
          page_type: String(pageData.page_type ?? '1'),
          external_url: pageData.external_url ?? '',

          // Existing image filename
          page_banner: pageData.page_banner ?? ''
        };

        console.log(
          'patchValue page_banner:',
          patchValue.page_banner
        );

        // Open modal FIRST
        this.pageModal.open();

        // Give dynamic form time to initialize
        setTimeout(() => {

          const form = this.pageModal?.dynamicForm?.form;

          if (!form) {
            console.error('Dynamic form is not available');
            return;
          }

          console.log(
            'Before patch page_banner:',
            form.get('page_banner')?.value
          );


          
          // Patch API data
          form.patchValue(patchValue);

          console.log(
            'After patch page_banner:',
            form.get('page_banner')?.value
          );

          const parentControl = form.get('page_banner');

          const dynamicControl =
            this.pageModal.dynamicForm.getControl('page_banner');

          console.log(
            'Parent value:',
            parentControl?.value
          );

          console.log(
            'DynamicForm value:',
            dynamicControl?.value
          );

          console.log(
            'Same control:',
            parentControl === dynamicControl
          );

          this.bindCheckboxLogic();

          this.cdr.detectChanges();

        }, 100);

      },

      error: (err: any) => {
        console.error('Failed to load page:', err);
      }

    });

  });
}


  handleAction(event: any): void {
    switch (event.action || event.actionName) {
      case 'edit':
        this.openEditModal(event.row.id);
        break;


      case 'toggle_status':
        this.updatePageStatus(
          event.row.id,
          event.row.status
        );
        break;

      // case 'delete':
      //   this.deletePage(event.row.id);
      //   break;
    }
  }

// Update Page Status

updatePageStatus(
  id: string | number,
  status: number
): void {

  const pageId = String(id);
  const statusValue = status === 1 ? 1 : 0;

  console.log('Updating page status');
  console.log('Page ID:', pageId);
  console.log('Status:', statusValue);

  this.pageService
    .updatePageStatus(pageId, statusValue)
    .subscribe({

      next: (res: any) => {

        console.log('Status updated successfully:', res);

        this.toast.show(
          'success',
          res.message || 'Page status updated successfully',
          3000
        );

        this.loadPages();
      },

      error: (error: any) => {

        console.error('Status update failed:', error);

        this.toast.show(
          'error',
          error.error?.message ||
          'Failed to update page status',
          3000
        );

        this.loadPages();
      }
    });
}

onSubmit(formData: any): void {

  const payload = new FormData();

  // ==============================
  // Title - language_id
  // ==============================

  payload.append(
    'title[1]',
    formData.name_en || ''
  );

  payload.append(
    'title[2]',
    formData.name_pb || ''
  );

  // ==============================
  // Description - language_id
  // ==============================

  payload.append(
    'description[1]',
    formData.description_en || ''
  );

  payload.append(
    'description[2]',
    formData.description_pb || ''
  );

  // ==============================
  // Slug
  // ==============================

  payload.append(
    'slug',
    formData.slug || ''
  );

  // ==============================
  // Status
  // ==============================

  payload.append(
    'status',
    formData.status === true ||
    formData.status === '1' ||
    formData.status === 1
      ? '1'
      : '0'
  );

  // ==============================
  // Sort order
  // ==============================

  payload.append(
    'sort_order',
    String(formData.sort_order ?? 0)
  );

  // ==============================
  // Page type
  // ==============================

  payload.append(
    'page_type',
    String(formData.page_type ?? 1)
  );

  // ==============================
  // Page Banner
  // ==============================

   if (formData.page_banner instanceof File) {
  payload.append('page_banner', formData.page_banner);
}

  // payload.append(
  //   'same_as_english_pb',
  //   formData.same_as_english_pb === true ||
  //   formData.same_as_english_pb === '1' ||
  //   formData.same_as_english_pb === 1
  //     ? '1'
  //     : '0'
  // );

  // ==============================
  // Meta - English
  // ==============================

  payload.append(
    'meta_title[1]',
    formData.meta_title_en || ''
  );

  payload.append(
    'meta_description[1]',
    formData.meta_description_en || ''
  );

  payload.append(
    'meta_keyword[1]',
    formData.meta_keyword_en || ''
  );

  // ==============================
  // Meta - Punjabi
  // ==============================

  payload.append(
    'meta_title[2]',
    formData.meta_title_pb || ''
  );

  payload.append(
    'meta_description[2]',
    formData.meta_description_pb || ''
  );

  payload.append(
    'meta_keyword[2]',
    formData.meta_keyword_pb || ''
  );

  // ==============================
  // External URL
  // ==============================

  if (
    formData.external_url !== undefined &&
    formData.external_url !== null
  ) {
    payload.append(
      'external_url',
      formData.external_url
    );
  }

  // ==============================
  // Debug
  // ==============================

  console.log('Edit mode:', this.isEditMode);
  console.log('Page ID:', this.pageId);
  console.log('Form data:', formData);
   console.log('external_url:',formData.external_url);

  payload.forEach((value, key) => {
    console.log(key, value);
  });

  // ==============================
  // UPDATE
  // ==============================

  if (this.isEditMode && this.pageId) {

    this.pageService
      .updatePage(this.pageId, payload)
      .subscribe({

        next: (res: any) => {

          this.toast.show(
            'success',
            res.message ||
              'Page updated successfully!',
            4000
          );

          this.closeModal();
          this.loadPages();
        },

        error: (error: any) => {

          console.error(
            'Failed to update Page:',
            error
          );

          console.error(
            'Validation errors:',
            error.error?.errors
          );

          this.toast.show(
            'error',
            error.error?.message ||
              'Failed to update Page'
          );
        }
      });

  // ==============================
  // CREATE
  // ==============================

  } else {

    this.pageService
      .createPage(payload)
      .subscribe({

        next: (res: any) => {

          this.toast.show(
            'success',
            res.message ||
              'Page created successfully!',
            4000
          );

          this.closeModal();
          this.loadPages();
        },

        error: (error: any) => {

          console.error(
            'Failed to create Page:',
            error
          );

          console.error(
            'Validation errors:',
            error.error?.errors
          );

          this.toast.show(
            'error',
            error.error?.message ||
              'Failed to create Page'
          );
        }
      });
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