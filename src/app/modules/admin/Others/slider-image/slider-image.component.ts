import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { DocumentListComponent, TableColumn } from '../../../../shared/components/document-list/document-list.component';
import { ModalFormComponent } from '../../../../shared/components/modal-form/modal-form.component';
import { AuthService } from '../../../../core/auth/auth.service';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({
  standalone: true,
  selector: 'app-slider-image',
  imports: [DocumentListComponent, ModalFormComponent],
  templateUrl: './slider-image.component.html',
  styleUrl: './slider-image.component.scss'
})
export class SliderImageComponent implements OnInit {
  @ViewChild(ModalFormComponent) sliderImageModal!: ModalFormComponent;

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private toast = inject(ToastService);
  private cdr = inject(ChangeDetectorRef);

  constructor(private sliderImageService: AuthService) {}

  sliderId!: string;
  data: any[] = [];
  isLoading = false;
  currentPage = 1;
  pageSize = 25;
  totalRecords = 0;
  search = '';
  sortColumn = '';
  sortDirection = 'asc';

  ngOnInit(): void {
    this.sliderId = this.route.snapshot.paramMap.get('slider_id') || '';

    if (!this.sliderId) {
      this.toast.show('error', 'Slider ID is missing');
      return;
    }

    this.loadSliderImages();
  }


  tableColumns: TableColumn[] = [
  {
    key: 'image',
    label: 'Image',
    type: 'image',
    widthClass: 'col-3'
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
    label: 'Choose Action',
    type: 'dropdown',
    widthClass: 'col-2',
    dropdownConfig: {
      label: 'Choose Action',
      items: (row: any) => [
        {
          label: 'Edit',
          actionName: 'edit',
          class: 'text-secondary'
        },
        {
          label: 'Delete',
          actionName: 'delete',
          class: 'text-danger'
        }
      ]
    }
  }
];

  loadSliderImages(page: number = this.currentPage): void {
    this.currentPage = page;

    const params = {
      page: this.currentPage,
      per_page: this.pageSize,
      search: this.search,
      sort_column: this.sortColumn,
      sort_direction: this.sortDirection
    };

    this.isLoading = true;

    this.sliderImageService.getSliderImages(this.sliderId, params).subscribe({
      next: (res: any) => {
        this.data = res.data || [];
        this.totalRecords = res.pagination?.total || 0;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error: any) => {
        console.error('Failed to load slider images:', error);
        this.isLoading = false;
        this.toast.show(
          'error',
          error.error?.message || 'Failed to load slider images'
        );
      }
    });
  }
}