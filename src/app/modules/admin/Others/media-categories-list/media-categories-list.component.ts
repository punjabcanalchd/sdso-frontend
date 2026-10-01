import { Component, OnInit, ChangeDetectorRef, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentListComponent, TableColumn } from '../../../../shared/components/document-list/document-list.component';
import { AdminFormLayoutComponent } from '../../components/admin-form-layout/admin-form-layout.component';
import { ModalFormComponent } from '../../../../shared/components/modal-form/modal-form.component';
import { mediaCategorySchema } from './media-category-form.schema';
import { mediaGalleryImageSchema } from './media-gallery-form.schema';
import { ApiService } from '../../../../core/services/api.service';
import { ToastService } from '../../../../shared/services/toast.service';
import { environment } from '../../../../../environments/environment';

@Component({
  standalone: true,
  selector: 'app-media-categories-list',
  imports: [CommonModule, DocumentListComponent, AdminFormLayoutComponent, ModalFormComponent],
  templateUrl: './media-categories-list.component.html',
  styleUrl: './media-categories-list.component.scss'
})
export class MediaCategoriesListComponent implements OnInit {
  @ViewChild('adminFormLayout') adminFormLayout?: AdminFormLayoutComponent;
  @ViewChild('galleryModal') galleryModal?: ModalFormComponent;

  private api = inject(ApiService);
  private toast = inject(ToastService);
  private cdr = inject(ChangeDetectorRef);

  data: any[] = [];
  isLoading = false;

  currentPage = 1;
  pageSize = 25;
  pagination: any = {};
  search = '';
  sortColumn = 'mediacat_id';
  sortDirection = 'desc';

  // Category Form state
  showForm = false;
  isEditMode = false;
  editingCategoryId: string | number | null = null;
  initialFormData: any = {};
  isFormLoading = false;
  categorySchema = mediaCategorySchema;
  parentCategories: any[] = [];

  // Gallery Sub-View state (reusing DocumentListComponent & ModalFormComponent)
  showGalleryView = false;
  selectedCategory: any = null;
  galleryData: any[] = [];
  galleryPagination: any = {};
  galleryCurrentPage = 1;
  galleryPageSize = 25;
  gallerySearch = '';
  isGalleryLoading = false;

  isGalleryEditMode = false;
  editingGalleryId: string | number | null = null;
  galleryFormInitialData: any = {};
  gallerySchema = mediaGalleryImageSchema;

  tableColumns: TableColumn[] = [
    { key: 'nameHtml', label: 'Media Category Name', widthClass: 'col-4', sortable: false, type: 'html' },
    { key: 'mediacat_id', label: 'Media Category Id', widthClass: 'col-2', sortable: true },
    { key: 'display_on_home_page_label', label: 'Display On Home Page', widthClass: 'col-2', sortable: false },
    { key: 'status_label', label: 'Status', widthClass: 'col-2', sortable: false },
    { key: 'action', label: 'Action', widthClass: 'col-2', type: 'media_category_action' },
  ];

  galleryColumns: TableColumn[] = [
    { key: 'image', label: 'Image', widthClass: 'col-2', type: 'image' },
    { key: 'titleHtml', label: 'Title', widthClass: 'col-4', sortable: false, type: 'html' },
    { key: 'title_en', label: 'English Title', widthClass: 'col-2', sortable: false },
    { key: 'title_pb', label: 'Punjabi Title', widthClass: 'col-2', sortable: false },
    { key: 'action', label: 'Action', widthClass: 'col-2', type: 'action' }
  ];

  ngOnInit(): void {
    this.loadCategories();
    this.loadParentCategories();
  }

  loadParentCategories(): void {
    this.api.get<any>('/admin/media-categories/dropdown').subscribe({
      next: (res) => {
        this.parentCategories = res.data || [];
        this.updateParentCategoryOptions();
      },
      error: () => {
        this.parentCategories = [];
      }
    });
  }

  private updateParentCategoryOptions(): void {
    const parentField = (this.categorySchema.fields || []).find(f => f.name === 'parent_id');
    if (parentField) {
      parentField.options = [
        { label: 'Please select', value: '' },
        ...this.parentCategories.map((c: any) => ({
          label: c.label || c.name,
          value: c.value ?? c.mediacat_id
        }))
      ];
    }
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
    this.api.get<any>('/admin/media-categories', params).subscribe({
      next: (res) => {
        this.data = (res.data || []).map((item: any, index: number) => {
          const englishName = item.name_en || item.name || '';
          const punjabiName = item.name_pb || '';

          return {
            id: item.id,
            mediacat_id: item.mediacat_id,
            orignalSeq: (this.currentPage - 1) * this.pageSize + index + 1,
            originalSeq: (this.currentPage - 1) * this.pageSize + index + 1,
            sr_no: (this.currentPage - 1) * this.pageSize + index + 1,
            name: item.name,
            name_en: englishName,
            name_pb: punjabiName,
            nameHtml: `
              <div>
                <div class="fw-medium text-dark">${punjabiName || englishName}</div>
                <div class="text-secondary small">${englishName}</div>
              </div>
            `,
            display_on_home_page: item.display_on_home_page,
            display_on_home_page_label: item.display_on_home_page ? 'Yes' : 'No',
            status: item.status,
            status_label: item.status ? 'Active' : 'Inactive',
            media_count: item.media_count ?? 0,
            mediaCount: item.media_count ?? 0,
            created_at: this.formatDate(item.created_at),
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
        this.toast.show('error', err.error?.message || 'Failed to load media categories');
        this.cdr.detectChanges();
      }
    });
  }

  openCreateForm(): void {
    this.showGalleryView = false;
    this.isEditMode = false;
    this.editingCategoryId = null;
    this.categorySchema.submitLabel = 'Save';

    const imgField = (this.categorySchema.fields || []).find(f => f.name === 'category_image');
    if (imgField) {
      imgField.required = true;
    }

    this.initialFormData = {
      name_en: '',
      description_en: '',
      same_as_english_pb: false,
      name_pb: '',
      description_pb: '',
      display_on_home_page: 1,
      status: 1,
      parent_id: '',
      category_image: null
    };

    this.loadParentCategories();
    this.showForm = true;
    this.bindCheckboxLogic();
    this.cdr.detectChanges();
  }

  openEditForm(row: any): void {
    this.showGalleryView = false;
    this.isEditMode = true;
    this.editingCategoryId = row.id || row.mediacat_id;
    this.categorySchema.submitLabel = 'Update';

    const imgField = (this.categorySchema.fields || []).find(f => f.name === 'category_image');
    if (imgField) {
      imgField.required = false;
    }

    this.isFormLoading = true;
    this.showForm = true;
    this.loadParentCategories();
    this.cdr.detectChanges();

    this.api.get<any>(`/admin/media-categories/${this.editingCategoryId}`).subscribe({
      next: (res) => {
        const cat = res.data;
        this.initialFormData = {
          name_en: cat.name_en || '',
          description_en: cat.description_en || '',
          same_as_english_pb: false,
          name_pb: cat.name_pb || '',
          description_pb: cat.description_pb || '',
          display_on_home_page: cat.display_on_home_page ? 1 : 0,
          status: cat.status ? 1 : 0,
          parent_id: cat.parent_id || '',
          category_image: cat.category_image || null
        };
        this.isFormLoading = false;
        this.bindCheckboxLogic();
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isFormLoading = false;
        this.toast.show('error', err.error?.message || 'Failed to load media category details');
        this.closeForm();
      }
    });
  }

  bindCheckboxLogic(): void {
    setTimeout(() => {
      const dForm = this.adminFormLayout?.dynamicForm;
      if (dForm && dForm.form) {
        const formGroup = dForm.form;

        formGroup.get('same_as_english_pb')?.valueChanges.subscribe((isChecked) => {
          if (isChecked) {
            formGroup.get('name_pb')?.setValue(formGroup.get('name_en')?.value);
            formGroup.get('description_pb')?.setValue(formGroup.get('description_en')?.value);
          }
        });

        formGroup.get('name_en')?.valueChanges.subscribe((val) => {
          if (formGroup.get('same_as_english_pb')?.value) {
            formGroup.get('name_pb')?.setValue(val);
          }
        });

        formGroup.get('description_en')?.valueChanges.subscribe((val) => {
          if (formGroup.get('same_as_english_pb')?.value) {
            formGroup.get('description_pb')?.setValue(val);
          }
        });
      }
    }, 200);
  }

  closeForm(): void {
    this.showForm = false;
    this.isEditMode = false;
    this.editingCategoryId = null;
    this.initialFormData = {};
    this.cdr.detectChanges();
  }

  handleFormSubmit(event: any): void {
    const formValue = event?.formValue ? event.formValue : event;
    if (!formValue) return;

    const formData = new FormData();
    formData.append('name_en', formValue.name_en || '');
    formData.append('name_pb', formValue.name_pb || '');
    formData.append('description_en', formValue.description_en || '');
    formData.append('description_pb', formValue.description_pb || '');
    formData.append('display_on_home_page', formValue.display_on_home_page == 1 || formValue.display_on_home_page === true ? '1' : '0');
    formData.append('status', formValue.status == 1 || formValue.status === true ? '1' : '0');

    if (formValue.parent_id !== undefined && formValue.parent_id !== null && formValue.parent_id !== '') {
      formData.append('parent_id', String(formValue.parent_id));
    }

    if (formValue.category_image instanceof File) {
      formData.append('category_image', formValue.category_image);
    } else if (typeof formValue.category_image === 'string' && formValue.category_image.trim()) {
      formData.append('category_image', formValue.category_image.trim());
    }

    const apiCall = this.isEditMode
      ? this.api.post(`/admin/media-categories/${this.editingCategoryId}/update`, formData)
      : this.api.post('/admin/media-categories', formData);

    apiCall.subscribe({
      next: (res: any) => {
        this.toast.show('success', res.message || (this.isEditMode ? 'Media category updated successfully' : 'Media category created successfully'), 3000);
        this.closeForm();
        this.loadCategories();
      },
      error: (err: any) => {
        const backendMessage = err.error?.message || 'Failed to save media category. Please check the fields.';
        this.toast.show('error', backendMessage);
      }
    });
  }

  handleAction(event: { action: string; row: any }): void {
    if (event.action === 'edit') {
      this.openEditForm(event.row);
    } else if (event.action === 'media_count') {
      this.selectedCategory = event.row;
      this.showGalleryView = true;
      this.showForm = false;
      this.loadGalleryImages(1);
      this.cdr.detectChanges();
    } else if (event.action === 'toggle_status') {
      this.updateStatus(event.row.id, event.row.status);
    } else if (event.action === 'toggle_display_on_home_page') {
      this.updateDisplayOnHome(event.row.id, event.row.display_on_home_page);
    }
  }

  updateStatus(id: string | number, status: boolean | number): void {
    const statusValue = status ? 1 : 0;
    this.api.post(`/admin/media-categories/${id}/status`, { status: statusValue }).subscribe({
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
    this.api.post(`/admin/media-categories/${id}/display-home`, { display_on_home_page: displayValue }).subscribe({
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

  // ==========================================
  // GALLERY METHODS (DRY using DocumentListComponent & ModalFormComponent)
  // ==========================================

  get galleryCategoryTitle(): string {
    if (!this.selectedCategory) return '';
    return (this.selectedCategory.name_en || this.selectedCategory.name || '').toUpperCase();
  }

  loadGalleryImages(page: number = this.galleryCurrentPage): void {
    if (!this.selectedCategory) return;
    this.galleryCurrentPage = page;
    const catId = this.selectedCategory.mediacat_id ?? this.selectedCategory.id;

    const params: any = {
      category_id: catId,
      page: this.galleryCurrentPage,
      per_page: this.galleryPageSize,
      search: this.gallerySearch
    };

    this.isGalleryLoading = true;
    this.api.get<any>('/admin/media-galleries', params).subscribe({
      next: (res) => {
        const items = res.data || [];
        const uploadUrl = environment.uploadUrl || (environment.baseUrl ? `${environment.baseUrl}/uploads` : 'http://localhost:8000/uploads');

        this.galleryData = items.map((item: any, index: number) => {
          const enTitle = item.title_en || '';
          const pbTitle = item.title_pb || '';
          const imgName = item.select_img || '';
          const fullImgUrl = imgName
            ? (imgName.startsWith('http') ? imgName : `${uploadUrl}/${imgName}`)
            : '';

          return {
            id: item.mediagal_id || item.id,
            mediagal_id: item.mediagal_id || item.id,
            originalSeq: (this.galleryCurrentPage - 1) * this.galleryPageSize + index + 1,
            image: fullImgUrl,
            title_en: enTitle,
            title_pb: pbTitle,
            titleHtml: `
              <div>
                <div class="fw-medium text-dark">${pbTitle || enTitle}</div>
                <div class="text-secondary small">${enTitle}</div>
              </div>
            `,
            canEdit: true,
            raw: item
          };
        });

        this.galleryPagination = res.pagination || {
          current_page: this.galleryCurrentPage,
          per_page: this.galleryPageSize,
          total: this.galleryData.length,
          last_page: 1
        };
        this.isGalleryLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isGalleryLoading = false;
        this.toast.show('error', err.error?.message || 'Failed to load gallery items');
        this.cdr.detectChanges();
      }
    });
  }

  openAddGalleryModal(): void {
    this.isGalleryEditMode = false;
    this.editingGalleryId = null;
    this.gallerySchema.submitLabel = 'Save Image';

    const fileField = (this.gallerySchema.fields || []).find(f => f.name === 'file');
    if (fileField) {
      fileField.required = true;
    }

    this.galleryFormInitialData = {
      file: null,
      title_en: '',
      title_pb: ''
    };

    this.galleryModal?.open();
  }

  openEditGalleryModal(row: any): void {
    this.isGalleryEditMode = true;
    this.editingGalleryId = row.mediagal_id || row.id;
    this.gallerySchema.submitLabel = 'Update Title';

    const fileField = (this.gallerySchema.fields || []).find(f => f.name === 'file');
    if (fileField) {
      fileField.required = false;
    }

    this.galleryFormInitialData = {
      file: null,
      title_en: row.title_en || '',
      title_pb: row.title_pb || ''
    };

    this.galleryModal?.open();
  }

  handleGalleryAction(event: { action: string; row: any }): void {
    if (event.action === 'edit') {
      this.openEditGalleryModal(event.row);
    } else if (event.action === 'delete') {
      this.deleteGalleryItem(event.row);
    }
  }

  deleteGalleryItem(row: any): void {
    const itemId = row.mediagal_id || row.id;
    if (!itemId) return;

    if (!confirm('Are you sure you want to delete this gallery image?')) {
      return;
    }

    this.api.delete<any>(`/admin/media-galleries/${itemId}`).subscribe({
      next: () => {
        this.toast.show('success', 'Gallery image deleted successfully', 3000);
        this.loadGalleryImages();
      },
      error: (err) => {
        this.toast.show('error', err.error?.message || 'Failed to delete gallery image');
      }
    });
  }

  handleGalleryModalSubmit(event: any): void {
    const formValue = event?.formValue ? event.formValue : event;
    if (!formValue) return;

    const catId = this.selectedCategory?.mediacat_id ?? this.selectedCategory?.id;

    if (this.isGalleryEditMode) {
      this.api.post<any>(`/admin/media-galleries/${this.editingGalleryId}/update`, {
        title_en: formValue.title_en || '',
        title_pb: formValue.title_pb || formValue.title_en || ''
      }).subscribe({
        next: () => {
          this.toast.show('success', 'Gallery image updated successfully', 3000);
          this.galleryModal?.close();
          this.loadGalleryImages();
        },
        error: (err) => {
          this.toast.show('error', err.error?.message || 'Failed to update title');
        }
      });
    } else {
      if (!formValue.file) {
        this.toast.show('error', 'Please select an image file to upload.');
        return;
      }

      const formData = new FormData();
      formData.append('category_id', String(catId));
      formData.append('items[0][file]', formValue.file);
      formData.append('items[0][title_en]', formValue.title_en || '');
      formData.append('items[0][title_pb]', formValue.title_pb || formValue.title_en || '');

      this.api.post<any>('/admin/media-galleries', formData).subscribe({
        next: () => {
          this.toast.show('success', 'Gallery image uploaded successfully', 3000);
          this.galleryModal?.close();
          this.loadGalleryImages();
        },
        error: (err) => {
          this.toast.show('error', err.error?.message || 'Failed to upload gallery image');
        }
      });
    }
  }

  onGalleryModalClosed(): void {
    this.isGalleryEditMode = false;
    this.editingGalleryId = null;
    this.galleryFormInitialData = {};
  }

  searchGalleryImages(text: string): void {
    this.gallerySearch = text;
    this.loadGalleryImages(1);
  }

  onGalleryPageSizeChange(size: number): void {
    this.galleryPageSize = size;
    this.loadGalleryImages(1);
  }

  closeGalleryView(): void {
    this.showGalleryView = false;
    this.selectedCategory = null;
    this.galleryData = [];
    this.loadCategories();
    this.cdr.detectChanges();
  }
}
