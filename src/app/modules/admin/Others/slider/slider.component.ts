import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { DocumentListComponent, TableColumn } from '../../../../shared/components/document-list/document-list.component';
import { ModalFormComponent } from '../../../../shared/components/modal-form/modal-form.component';
import { AuthService } from '../../../../core/auth/auth.service';
import { ToastService } from '../../../../shared/services/toast.service';
import { sliderSchema } from './slider-form.component';

@Component({
  standalone: true,
  selector: 'app-slider',
  imports: [
    DocumentListComponent,
    ModalFormComponent
  ],
  templateUrl: './slider.component.html',
  styleUrl: './slider.component.scss'
})
export class SlidersListComponent implements OnInit {
  @ViewChild(ModalFormComponent)
  sliderModal!: ModalFormComponent;

  private toast = inject(ToastService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  constructor(
    private sliderService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  data: any[] = [];
  tableData: any[] = [];
  selectedSlider: any = null;
  formInitialData: any = {};
  isEditMode = false;
  sliderId: string | null = null;
  isLoading = false;
  totalRecords = 0;

  sliderSchema = sliderSchema;
  currentPage = 1;
  pageSize = 25;
  pagination: any = {};
  search = '';
  sortColumn = '';
  sortDirection = 'asc';

  ngOnInit(): void {
    this.loadSliders();
  }

  onServerAction(params: {
    page: number;
    per_page: number;
    search: string;
    sort_column: string;
    sort_direction: string;
  }): void {
    this.currentPage = params.page;
    this.pageSize = params.per_page;
    this.search = params.search;
    this.sortColumn = params.sort_column;
    this.sortDirection = params.sort_direction;
    this.loadSliders();
  }

  tableColumns: TableColumn[] = [
    {
      key: 'titleHtml',
      label: 'Title',
      widthClass: 'col-2',
      sortable: true,
      type: 'html'
    },
    {
      key: 'status',
      label: 'Status',
      type: 'toggle',
      toggleConfig: {
        trueLabel: 'Active',
        falseLabel: 'Inactive'
      }
    },
    {
      key: 'action',
      type: 'dropdown',
      label: 'Choose Action',
      widthClass: 'col-2',
      dropdownConfig: {
        label: 'Choose Action',
        items: (row: any) => {
          return [
            {
              label: 'Edit',
              actionName: 'edit',
              class: 'text-secondary'
            }
          ];
        }
      }
    }
  ];

  formatDate(dateInput: any): string {
    if (!dateInput) {
      return '';
    }

    const date = new Date(dateInput);

    if (isNaN(date.getTime())) {
      return dateInput;
    }

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  }

  loadSliders(page: number = this.currentPage): void {
    this.currentPage = page;

    const params = {
      page: this.currentPage,
      per_page: this.pageSize,
      search: this.search,
      sort_column: this.sortColumn,
      sort_direction: this.sortDirection
    };

    this.isLoading = true;

    this.sliderService.getSliders(params).subscribe({
      next: (res: any) => {
        this.data = res.data.map((slider: any, index: number) => {
          const englishTitle = slider.name || 'N/A';

          return {
           id: slider.slider_id,
           slider_id: slider.slider_id,
            orignalSeq:
              (params.page - 1) * params.per_page + index + 1,
            titleHtml: `
              <div class="text-dark pb-2 lh-1">
                <span class="text-muted fw-bold small">
                  EN:
                </span>
                ${englishTitle}
              </div>
            `,
            title_en: englishTitle,
            image:
              slider.image ||
              slider.slider_image ||
              slider.banner ||
              '',
            status: !!slider.status,
            sortOrder: slider.sort_order ?? 0,
            createdAt: this.formatDate(slider.created_at),
            canEdit: true,
            originalData: slider
          };
        });

        this.isLoading = false;
        this.totalRecords = res.pagination.total;
        this.pagination = res.pagination;
        this.currentPage = res.pagination.current_page;
        this.pageSize = res.pagination.per_page;

        this.cdr.detectChanges();
      },

      error: (err: any) => {
        console.error('Failed to load sliders:', err);
        this.isLoading = false;

        this.toast.show(
          'error',
          err.error?.message ||
          err.message ||
          'Failed to load sliders'
        );
      }
    });
  }

  openCreateModal(): void {

  this.isEditMode = false;
  this.sliderId = null;

  this.sliderSchema.submitLabel = 'Create Slider';

  if (this.sliderModal?.dynamicForm) {
    this.sliderModal.dynamicForm.form.reset();
  }

  this.router.navigate([], {
    relativeTo: this.route,
    queryParams: { public_id: null },
    queryParamsHandling: 'merge'
  }).then(() => {

    this.sliderModal.open();

  });
}

openEditModal(id: string | number): void {

  this.isEditMode = true;
  this.sliderId = String(id);

  this.sliderSchema.submitLabel = 'Update Slider';

  this.router.navigate([], {
    relativeTo: this.route,
    queryParams: {
      public_id: this.sliderId
    },
    queryParamsHandling: 'merge'
  }).then(() => {

    this.sliderService
      .getSliderByPublicId(this.sliderId!)
      .subscribe({

        next: (res: any) => {

          console.log('Slider response:', res);

          if (!res.data) {
            console.error('Slider data not found');
            return;
          }

          const sliderData = res.data;

          const patchValue = {
            name: sliderData.name ?? '',
            status: !!sliderData.status
          };

          console.log('Slider patch value:', patchValue);

          // Open modal
          this.sliderModal.open();

          // Wait for modal + dynamic form
          setTimeout(() => {

            const dynamicForm =
              this.sliderModal?.dynamicForm;

            console.log(
              'Dynamic form:',
              dynamicForm
            );

            if (!dynamicForm) {
              console.error(
                'Dynamic form is not available'
              );
              return;
            }

            const form =
              dynamicForm.form;

            if (!form) {
              console.error(
                'FormGroup is not available'
              );
              return;
            }

            console.log(
              'Before patch:',
              form.value
            );

            form.patchValue(patchValue);

            console.log(
              'After patch:',
              form.value
            );

            this.cdr.detectChanges();

          }, 300);

        },

        error: (err: any) => {

          console.error(
            'Failed to load slider:',
            err
          );

          this.toast.show(
            'error',
            err.error?.message ||
            'Failed to load slider'
          );

        }

      });

  });
}

  onSubmit(formData: any): void {
    const payload = new FormData();

    payload.append(
      'name',
      formData.name || ''
    );

    
    payload.append(
      'status',
      formData.status === true ||
      formData.status === 1 ||
      formData.status === '1'
        ? '1'
        : '0'
    );

    
    // if (formData.image instanceof File) {
    //   payload.append(
    //     'image',
    //     formData.image
    //   );
    // }

    console.log('Edit mode:', this.isEditMode);
    console.log('Slider ID:', this.sliderId);
    console.log('Form data:', formData);

    payload.forEach((value, key) => {
      console.log(key, value);
    });

    if (this.isEditMode && this.sliderId) {
      this.sliderService
        .updateSlider(this.sliderId, payload)
        .subscribe({
          next: (res: any) => {
            this.toast.show(
              'success',
              res.message ||
              'Slider updated successfully!',
              4000
            );

            this.closeModal();
            this.loadSliders();
          },

          error: (error: any) => {
            console.error(
              'Failed to update Slider:',
              error
            );

            console.error(
              'Validation errors:',
              error.error?.errors
            );

            this.toast.show(
              'error',
              error.error?.message ||
              'Failed to update Slider'
            );
          }
        });

      return;
    }

    this.sliderService.createSlider(payload).subscribe({
      next: (res: any) => {
        this.toast.show(
          'success',
          res.message ||
          'Slider created successfully!',
          4000
        );

        this.closeModal();
        this.loadSliders();
      },

      error: (error: any) => {
        console.error(
          'Failed to create Slider:',
          error
        );

        console.error(
          'Validation errors:',
          error.error?.errors
        );

        this.toast.show(
          'error',
          error.error?.message ||
          'Failed to create Slider'
        );
      }
    });
  }

updateSliderStatus(
  id: string | number,
  status: boolean | number
): void {
  const sliderId = String(id);
  const statusValue = Number(status) === 1 ? 0 : 1;

  this.sliderService
    .updateSliderStatus(sliderId, statusValue)
    .subscribe({
      next: (res: any) => {
        this.toast.show(
          'success',
          res.message || 'Slider status updated successfully',
          3000
        );

        this.loadSliders();
      },
      error: (error: any) => {
        console.error('Slider status update failed:', error);

        this.toast.show(
          'error',
          error.error?.message || 'Failed to update slider status',
          3000
        );
      }
    });
}

  deleteSlider(id: string | number): void {
    const sliderId = String(id);

    if (!confirm('Are you sure you want to delete this slider?')) {
      return;
    }

    this.sliderService
      .deleteSlider(sliderId)
      .subscribe({
        next: (res: any) => {
          console.log('Slider deleted:', res);

          this.toast.show(
            'success',
            res.message ||
            'Slider deleted successfully',
            3000
          );

          this.loadSliders();
        },

        error: (error: any) => {
          console.error(
            'Slider delete failed:',
            error
          );

          this.toast.show(
            'error',
            error.error?.message ||
            'Failed to delete slider',
            3000
          );
        }
      });
  }

  handleAction(event: any): void {
    console.log('Slider action:', event);

    switch (
      event.action ||
      event.actionName
    ) {
      case 'edit':
        this.openEditModal(
          event.row.id
        );
        break;

   

      case 'toggle_status':
    console.log('Toggle event:', event);
    console.log('Toggle row:', event.row);
    console.log('Public ID:', event.row?.public_id);
        this.updateSliderStatus(
          event.row.id,
          event.row.status
        );
        break;

      case 'delete':
        this.deleteSlider(
          event.row.id
        );
        break;
    }
  }

  changePage(page: number): void {
    this.loadSliders(page);
  }

  searchPages(text: string): void {
    this.search = text;
    console.log('Text===', text);
    this.currentPage = 1;
    this.loadSliders(1);
  }

  sortPages(event: any): void {
    this.sortColumn = event.column;
    this.sortDirection = event.direction;
    this.currentPage = 1;
    this.loadSliders(1);
  }

  onPageSizeChange(size: number): void {
    this.pageSize = size;
    console.log('Page size', size);
    this.currentPage = 1;
    this.loadSliders(1);
  }

  closeModal(): void {
    this.sliderModal.close();
  }

  onModalClosed(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        public_id: null
      },
      queryParamsHandling: 'merge'
    });
  }
}