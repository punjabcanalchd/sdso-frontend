import { Component, OnInit, ChangeDetectorRef, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentListComponent, TableColumn } from '../../../../shared/components/document-list/document-list.component';
import { ModalFormComponent } from '../../../../shared/components/modal-form/modal-form.component';
import { ApiService } from '../../../../core/services/api.service';
import { ToastService } from '../../../../shared/services/toast.service';
import { noticeboardCategorySchema } from './noticeboard-category-form.schema';

@Component({
  standalone: true,
  selector: 'app-noticeboard-categories-list',
  imports: [CommonModule, DocumentListComponent, ModalFormComponent],
  templateUrl: './noticeboard-categories-list.component.html',
  styleUrl: './noticeboard-categories-list.component.scss'
})
export class NoticeboardCategoriesListComponent implements OnInit {
  @ViewChild(ModalFormComponent) categoryModal!: ModalFormComponent;

  private api = inject(ApiService);
  private toast = inject(ToastService);
  private cdr = inject(ChangeDetectorRef);

  data: any[] = [];
  isLoading = false;

  currentPage = 1;
  pageSize = 25;
  pagination: any = {};
  search = '';
  sortColumn = 'template_id';
  sortDirection = 'desc';

  isEditMode = false;
  editingCategoryId: string | null = null;
  categorySchema = noticeboardCategorySchema;
  parentCategories: any[] = [];

  tableColumns: TableColumn[] = [
    { key: 'nameHtml', label: 'Category Name', widthClass: 'col-4', sortable: false, type: 'html' },
    { key: 'display_on_home_page', label: 'Display On Home Page', widthClass: 'col-2', type: 'toggle', toggleConfig: { trueLabel: 'Yes', falseLabel: 'No' } },
    { key: 'status', label: 'Status', widthClass: 'col-2', type: 'toggle', toggleConfig: { trueLabel: 'Active', falseLabel: 'Inactive' } },
    { key: 'copy_link', label: 'Copy Link', widthClass: 'col-1', type: 'copy_link' },
    { key: 'action', label: 'Action', widthClass: 'col-1', type: 'edit' },
  ];

  ngOnInit(): void {
    this.loadCategories();
    this.loadParentCategories();
  }

  loadParentCategories(): void {
    this.api.get<any>('/admin/noticeboard-categories/dropdown').subscribe({
      next: (res) => {
        this.parentCategories = res.data || [];
        this.updateParentCategoryOptions();
      },
      error: () => {
        // Fallback to noticeboard/categories if dropdown route fails
        this.api.get<any>('/admin/noticeboard/categories').subscribe({
          next: (res) => {
            this.parentCategories = res.data || [];
            this.updateParentCategoryOptions();
          }
        });
      }
    });
  }

  private updateParentCategoryOptions(excludeId: string | number | null = null): void {
    const parentField = this.categorySchema.fields?.find(f => f.name === 'parent_id');
    if (!parentField) return;

    const filtered = excludeId
      ? this.parentCategories.filter(c => String(c.value) !== String(excludeId))
      : this.parentCategories;

    parentField.options = [
      { label: 'Please select', value: null },
      ...filtered.map(c => ({
        label: c.label,
        value: Number(c.value)
      }))
    ];
    this.cdr.detectChanges();
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

  loadCategories(page: number = this.currentPage): void {
    this.currentPage = page;
    const params: any = {
      page: this.currentPage,
      per_page: this.pageSize,
      search: this.search,
      sort_column: this.sortColumn,
      sort_direction: this.sortDirection
    };

    this.isLoading = true;
    this.api.get<any>('/admin/noticeboard-categories', params).subscribe({
      next: (res) => {
        this.data = (res.data || []).map((item: any, index: number) => {
          const englishName = item.name_en || item.name || 'N/A';
          const punjabiName = item.name_pb
            ? `<div class="text-dark lh-1 pt-2">
                <span class="text-muted fw-bold small">PB:</span>
                ${item.name_pb}
              </div>`
            : '';

          return {
            id: item.id,
            orignalSeq: (this.currentPage - 1) * this.pageSize + index + 1,
            originalSeq: (this.currentPage - 1) * this.pageSize + index + 1,
            sr_no: (this.currentPage - 1) * this.pageSize + index + 1,
            name: item.name,
            nameHtml: `
              <div class="text-dark pb-1 lh-1">
                <span class="text-muted fw-bold small">EN:</span>
                ${englishName}
              </div>
              ${punjabiName}
            `,
            display_on_home_page: item.display_on_home_page,
            status: item.status,
            external_url: item.external_url || '',
            created_at: this.formatDate(item.created_at),
            canEdit: true,
            raw: item
          };
        });

        this.pagination = res.pagination || {};
        this.currentPage = res.pagination?.current_page || 1;
        this.pageSize = res.pagination?.per_page || 25;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isLoading = false;
        this.toast.show('error', err.error?.message || 'Failed to load noticeboard categories');
        this.cdr.detectChanges();
      }
    });
  }

  handleAction(event: { action: string; row: any }): void {
    if (event.action === 'edit') {
      this.openEditModal(event.row.id);
    } else if (event.action === 'toggle_status') {
      this.updateStatus(event.row.id, event.row.status);
    } else if (event.action === 'toggle_display_on_home_page') {
      this.updateDisplayOnHome(event.row.id, event.row.display_on_home_page);
    } else if (event.action === 'copy_link') {
      this.copyCategoryLink(event.row);
    }
  }

  copyCategoryLink(row: any): void {
    const rawUrl = row.external_url || row.raw?.external_url;
    const link = rawUrl && String(rawUrl).trim()
      ? String(rawUrl).trim()
      : `${window.location.origin}/notice?category=${row.id || row.raw?.template_id}`;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(link).then(() => {
        this.toast.show('success', 'Link copied to clipboard!', 3000);
      }).catch(() => {
        this.fallbackCopy(link);
      });
    } else {
      this.fallbackCopy(link);
    }
  }

  private fallbackCopy(text: string): void {
    const input = document.createElement('textarea');
    input.value = text;
    input.style.position = 'fixed';
    input.style.opacity = '0';
    document.body.appendChild(input);
    input.focus();
    input.select();
    try {
      document.execCommand('copy');
      this.toast.show('success', 'Link copied to clipboard!', 3000);
    } catch {
      this.toast.show('error', 'Failed to copy link', 3000);
    }
    document.body.removeChild(input);
  }

  openCreateModal(): void {
    this.isEditMode = false;
    this.editingCategoryId = null;
    this.categorySchema.submitLabel = 'Save';
    this.updateParentCategoryOptions();

    const defaultValues = {
      name_en: '',
      name_pb: '',
      same_as_english_pb: false,
      meta_title_en: '',
      meta_description_en: '',
      meta_keyword_en: '',
      meta_title_pb: '',
      meta_description_pb: '',
      meta_keyword_pb: '',
      parent_id: null,
      external_url: '',
      status: 1,
      display_on_home_page: 1,
      sort_order: 1,
      access_type: 'public'
    };

    this.categoryModal.open();

    setTimeout(() => {
      const dynamicForm = this.categoryModal?.dynamicForm;
      if (dynamicForm) {
        dynamicForm.activeTab = 'general';
        dynamicForm.activeChildTab = 'general-english';
        dynamicForm.form.reset(defaultValues);
      }
      this.setupTabVisibilityHook();
      this.bindCheckboxLogic();
      this.cdr.detectChanges();
    }, 100);
  }

  openEditModal(id: string | number): void {
    this.isEditMode = true;
    this.editingCategoryId = String(id);
    this.categorySchema.submitLabel = 'Update';
    this.updateParentCategoryOptions(id);

    this.api.get<any>(`/admin/noticeboard-categories/${id}`).subscribe({
      next: (res) => {
        const item = res.data;
        if (!item) {
          this.toast.show('error', 'Category details not found.');
          return;
        }

        const patchValue = {
          name_en: item.name_en || item.name || '',
          name_pb: item.name_pb || '',
          same_as_english_pb: false,
          meta_title_en: item.meta_title_en || '',
          meta_description_en: item.meta_description_en || '',
          meta_keyword_en: item.meta_keyword_en || '',
          meta_title_pb: item.meta_title_pb || '',
          meta_description_pb: item.meta_description_pb || '',
          meta_keyword_pb: item.meta_keyword_pb || '',
          parent_id: item.parent_id !== null && item.parent_id !== undefined ? Number(item.parent_id) : null,
          external_url: item.external_url || '',
          status: item.status == 1 || item.status === true ? 1 : 0,
          display_on_home_page: item.display_on_home_page == 1 || item.display_on_home_page === true ? 1 : 0,
          sort_order: item.sort_order ?? 1,
          access_type: item.access_type || 'public'
        };

        this.categoryModal.open();

        setTimeout(() => {
          const dynamicForm = this.categoryModal?.dynamicForm;
          if (dynamicForm) {
            dynamicForm.activeTab = 'general';
            dynamicForm.activeChildTab = 'general-english';
            dynamicForm.form.patchValue(patchValue);
          }
          this.setupTabVisibilityHook();
          this.bindCheckboxLogic();
          this.cdr.detectChanges();
        }, 100);
      },
      error: (err) => {
        this.toast.show('error', err.error?.message || 'Failed to fetch category details');
      }
    });
  }

  private setupTabVisibilityHook(): void {
    const dynamicForm = this.categoryModal?.dynamicForm;
    if (!dynamicForm) return;

    const originalOnTabChange = dynamicForm.onTabChange.bind(dynamicForm);
    const originalOnChildTabChange = dynamicForm.onChildTabChange.bind(dynamicForm);

    const updateVisibility = () => {
      const isGeneral = dynamicForm.activeTab === 'general';
      const generalFieldNames = [
        'parent_id',
        'external_url',
        'status',
        'display_on_home_page',
        'sort_order',
        'access_type'
      ];

      this.categorySchema.fields?.forEach((field) => {
        if (generalFieldNames.includes(field.name)) {
          field.tab = isGeneral ? dynamicForm.activeChildTab : '__hidden_on_meta__';
        }
      });
      this.cdr.detectChanges();
    };

    dynamicForm.onTabChange = (tab: string) => {
      originalOnTabChange(tab);
      updateVisibility();
    };

    dynamicForm.onChildTabChange = (childTab: string) => {
      originalOnChildTabChange(childTab);
      updateVisibility();
    };

    updateVisibility();
  }

  private bindCheckboxLogic(): void {
    setTimeout(() => {
      const form = this.categoryModal?.dynamicForm?.form;
      if (!form) return;

      form.get('same_as_english_pb')?.valueChanges.subscribe((isChecked) => {
        if (isChecked) {
          form.get('name_pb')?.setValue(form.get('name_en')?.value);
        }
      });
    }, 200);
  }

  onSubmit(formData: any): void {
    const payload = {
      name_en: formData.name_en || '',
      name_pb: formData.name_pb || '',
      meta_title_en: formData.meta_title_en || '',
      meta_description_en: formData.meta_description_en || '',
      meta_keyword_en: formData.meta_keyword_en || '',
      meta_title_pb: formData.meta_title_pb || '',
      meta_description_pb: formData.meta_description_pb || '',
      meta_keyword_pb: formData.meta_keyword_pb || '',
      parent_id: formData.parent_id || null,
      external_url: formData.external_url || '',
      sort_order: formData.sort_order ?? 1,
      access_type: formData.access_type || 'public',
      display_on_home_page: (formData.display_on_home_page == 1 || formData.display_on_home_page === true) ? 1 : 0,
      status: (formData.status == 1 || formData.status === true) ? 1 : 0
    };

    const request$ = this.isEditMode && this.editingCategoryId
      ? this.api.post(`/admin/noticeboard-categories/${this.editingCategoryId}/update`, payload)
      : this.api.post('/admin/noticeboard-categories', payload);

    request$.subscribe({
      next: (res: any) => {
        this.toast.show(
          'success',
          res.message || (this.isEditMode ? 'Category updated successfully!' : 'Category created successfully!')
        );
        this.categoryModal.close();
        this.loadCategories();
        this.loadParentCategories();
      },
      error: (err: any) => {
        this.toast.show('error', err.error?.message || 'Failed to save category.');
      }
    });
  }

  onModalClosed(): void {
    this.isEditMode = false;
    this.editingCategoryId = null;
  }

  updateStatus(id: string | number, status: boolean | number): void {
    const statusValue = status ? 1 : 0;
    this.api.post(`/admin/noticeboard-categories/${id}/status`, { status: statusValue }).subscribe({
      next: (res: any) => {
        this.toast.show('success', res.message || 'Status updated successfully', 3000);
        this.loadCategories();
      },
      error: (err: any) => {
        this.toast.show('error', err.error?.message || 'Failed to update status');
        this.loadCategories();
      }
    });
  }

  updateDisplayOnHome(id: string | number, display: boolean | number): void {
    const displayValue = display ? 1 : 0;
    this.api.post(`/admin/noticeboard-categories/${id}/display-home`, { display_on_home_page: displayValue }).subscribe({
      next: (res: any) => {
        this.toast.show('success', res.message || 'Display on home page updated successfully', 3000);
        this.loadCategories();
      },
      error: (err: any) => {
        this.toast.show('error', err.error?.message || 'Failed to update display option');
        this.loadCategories();
      }
    });
  }

  searchCategories(text: string): void {
    this.search = text;
    this.loadCategories(1);
  }

  sortCategories(event: any): void {
    this.sortColumn = event.column === 'nameHtml' ? 'name' : event.column;
    this.sortDirection = event.direction;
    this.loadCategories(1);
  }

  onPageSizeChange(size: number): void {
    this.pageSize = size;
    this.loadCategories(1);
  }
}
