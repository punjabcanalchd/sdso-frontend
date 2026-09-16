import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import {  DocumentListComponent,  TableColumn } from '../../../../shared/components/document-list/document-list.component';
import { ModalFormComponent } from '../../../../shared/components/modal-form/modal-form.component';
import { ToastService } from '../../../../shared/services/toast.service';
import { AuthService } from '../../../../core/auth/auth.service';



@Component({
  selector: 'app-slider-image',
  standalone: true,
  imports: [
    // DocumentListComponent,
    // ModalFormComponent
  ],
  templateUrl: './slider-image.component.html',
  styleUrl: './slider-image.component.scss'
})
export class SliderImageComponent implements OnInit {

  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private toastService = inject(ToastService);


  @ViewChild(DocumentListComponent)
  documentList!: DocumentListComponent;

  @ViewChild(ModalFormComponent)
  modalForm!: ModalFormComponent;


  // =====================================================
  // IDs
  // =====================================================

  sliderId: string = '';

  sliderImageId: string = '';

  isEditMode: boolean = false;


  // =====================================================
  // Data
  // =====================================================

  sliderImages: any[] = [];

  selectedRow: any = null;

  selectedFile: File | null = null;

  imagePreview: string | null = null;


  // =====================================================
  // Pagination
  // =====================================================

  currentPage: number = 1;

  pageSize: number = 25;

  totalItems: number = 0;

  totalPages: number = 0;


  // =====================================================
  // Search / Sort
  // =====================================================

  search: string = '';

  sortColumn: string = '';

  sortDirection: 'asc' | 'desc' = 'asc';


  // =====================================================
  // Loading
  // =====================================================

  loading: boolean = false;


  // =====================================================
  // Table columns
  // =====================================================


  

  columns: TableColumn[] = [

    {
      key: 'image_name',
      label: 'Image',
      type: 'image'
    },

    {
      key: 'title',
      label: 'Title',
      type: 'text'
    },

    {
      key: 'title_pb',
      label: 'Title (Punjabi)',
      type: 'text'
    },

    {
      key: 'sort_order',
      label: 'Sort Order',
      type: 'text'
    },

    {
      key: 'status',
      label: 'Status',
      type: 'toggle'
    },

    {
      key: 'action',
      label: 'Action',
      type: 'action'
    }
  ];


  // =====================================================
  // Form
  // =====================================================

  formData: any = {

    image_name: null,

    title: '',

    title_pb: '',

    link: '',

    link_type: '',

    page_id: '',

    sort_order: 0,

    status: true
  };


  // =====================================================
  // Constructor / Init
  // =====================================================

  ngOnInit(): void {

    this.route.paramMap.subscribe(params => {

      this.sliderId =
        params.get('slider_id') || '';

      this.sliderImageId =
        params.get('id') || '';

      if (this.sliderImageId) {

        this.isEditMode = true;

        this.getSliderImage(
          this.sliderImageId
        );

      } else if (this.sliderId) {

        this.isEditMode = false;

        this.getSliderImages();

      }

    });

  }


  // =====================================================
  // Get Slider Images
  // =====================================================

  getSliderImages(): void {

    if (!this.sliderId) {
      return;
    }

    this.loading = true;

    const params = {
      page: this.currentPage,
      per_page: this.pageSize,
      search: this.search,
      sort_column: this.sortColumn,
      sort_direction: this.sortDirection
    };


    this.authService
      .getSliderImages(
        this.sliderId,
        params
      )
      .subscribe({

        next: (response: any) => {

          this.loading = false;

          this.sliderImages =
            response.data || [];

          this.totalItems =
            response.total || 0;

          this.totalPages =
            response.last_page || 1;
        },

        error: (error: any) => {

          this.loading = false;

          console.error(
            'Slider images error:',
            error
          );

          this.toastService.error(
            'Unable to load slider images.'
          );
        }

      });

  }


  // =====================================================
  // Get Single Slider Image
  // =====================================================

  getSliderImage(id: string): void {

    this.loading = true;

    this.authService
      .getSliderImage(id)
      .subscribe({

        next: (response: any) => {

          this.loading = false;

          const data =
            response.data || response;

          this.selectedRow = data;

          this.formData = {

            image_name: null,

            title:
              data.title || '',

            title_pb:
              data.title_pb || '',

            link:
              data.link || '',

            link_type:
              data.link_type || '',

            page_id:
              data.page_id || '',

            sort_order:
              data.sort_order || 0,

            status:
              data.status == 1 ||
              data.status === true
          };


          if (data.image_name) {

            this.imagePreview =
              this.getImageUrl(
                data.image_name
              );

          }

        },

        error: (error: any) => {

          this.loading = false;

          console.error(
            'Slider image error:',
            error
          );

          this.toastService.error(
            'Unable to load slider image.'
          );
        }

      });

  }


  // =====================================================
  // Image URL
  // =====================================================

  getImageUrl(
    imageName: string
  ): string {

    if (!imageName) {
      return '';
    }

    return `http://localhost:8000/uploads/slider/${imageName}`;
  }


  // =====================================================
  // File Selection
  // =====================================================

  onFileSelected(
    event: Event
  ): void {

    const input =
      event.target as HTMLInputElement;

    if (
      !input.files ||
      input.files.length === 0
    ) {
      return;
    }

    this.selectedFile =
      input.files[0];

    this.formData.image_name =
      this.selectedFile;


    // Preview

    const reader =
      new FileReader();

    reader.onload = () => {

      this.imagePreview =
        reader.result as string;

    };

    reader.readAsDataURL(
      this.selectedFile
    );

  }


  // =====================================================
  // Open Add Modal
  // =====================================================

  openAdd(): void {

    this.isEditMode = false;

    this.sliderImageId = '';

    this.selectedRow = null;

    this.selectedFile = null;

    this.imagePreview = null;

    this.formData = {

      image_name: null,

      title: '',

      title_pb: '',

      link: '',

      link_type: '',

      page_id: '',

      sort_order: 0,

      status: true
    };


    this.modalForm.open();

  }


  // =====================================================
  // Open Edit
  // =====================================================

  openEdit(row: any): void {

    this.isEditMode = true;

    this.sliderImageId =
      row.public_id || row.id;

    this.selectedRow = row;

    this.selectedFile = null;

    this.formData = {

      image_name: null,

      title:
        row.title || '',

      title_pb:
        row.title_pb || '',

      link:
        row.link || '',

      link_type:
        row.link_type || '',

      page_id:
        row.page_id || '',

      sort_order:
        row.sort_order || 0,

      status:
        row.status == 1 ||
        row.status === true
    };


    if (row.image_name) {

      this.imagePreview =
        this.getImageUrl(
          row.image_name
        );

    }


    this.modalForm.open();

  }


  // =====================================================
  // Submit
  // =====================================================

  submit(): void {

    const formData =
      new FormData();


    // Image

    if (this.selectedFile) {

      formData.append(
        'image_name',
        this.selectedFile
      );

    }


    // Other fields

    formData.append(
      'title',
      this.formData.title || ''
    );

    formData.append(
      'title_pb',
      this.formData.title_pb || ''
    );

    formData.append(
      'link',
      this.formData.link || ''
    );

    formData.append(
      'link_type',
      this.formData.link_type || ''
    );

    formData.append(
      'page_id',
      this.formData.page_id || ''
    );

    formData.append(
      'sort_order',
      String(
        this.formData.sort_order || 0
      )
    );

    formData.append(
      'status',
      this.formData.status
        ? '1'
        : '0'
    );


    if (this.isEditMode) {

      this.update(
        formData
      );

    } else {

      this.create(
        formData
      );

    }

  }


  // =====================================================
  // Create
  // =====================================================

  create(
    formData: FormData
  ): void {

    if (!this.sliderId) {

      this.toastService.error(
        'Slider ID is missing.'
      );

      return;
    }


    this.loading = true;

    this.authService
      .createSliderImage(
        this.sliderId,
        formData
      )
      .subscribe({

        next: (response: any) => {

          this.loading = false;

          this.modalForm.close();

          this.toastService.success(
            'Slider image added successfully.'
          );

          this.getSliderImages();

        },

        error: (error: any) => {

          this.loading = false;

          console.error(
            'Create slider image error:',
            error
          );

          this.toastService.error(
            error?.error?.message ||
            'Unable to add slider image.'
          );

        }

      });

  }


  // =====================================================
  // Update
  // =====================================================

  update(
    formData: FormData
  ): void {

    if (!this.sliderImageId) {

      this.toastService.error(
        'Slider image ID is missing.'
      );

      return;
    }


    this.loading = true;

    this.authService
      .updateSliderImage(
        this.sliderImageId,
        formData
      )
      .subscribe({

        next: (response: any) => {

          this.loading = false;

          this.modalForm.close();

          this.toastService.success(
            'Slider image updated successfully.'
          );

          this.getSliderImages();

        },

        error: (error: any) => {

          this.loading = false;

          console.error(
            'Update slider image error:',
            error
          );

          this.toastService.error(
            error?.error?.message ||
            'Unable to update slider image.'
          );

        }

      });

  }


  // =====================================================
  // Delete
  // =====================================================

  deleteSliderImage(
    row: any
  ): void {

    const id =
      row.public_id || row.id;

    if (!id) {
      return;
    }


    if (
      !confirm(
        'Are you sure you want to delete this slider image?'
      )
    ) {
      return;
    }


    this.loading = true;

    this.authService
      .deleteSliderImage(id)
      .subscribe({

        next: (response: any) => {

          this.loading = false;

          this.toastService.success(
            'Slider image deleted successfully.'
          );

          this.getSliderImages();

        },

        error: (error: any) => {

          this.loading = false;

          console.error(
            'Delete slider image error:',
            error
          );

          this.toastService.error(
            error?.error?.message ||
            'Unable to delete slider image.'
          );

        }

      });

  }


  // =====================================================
  // Pagination
  // =====================================================

  onPageChange(
    page: number
  ): void {

    this.currentPage = page;

    this.getSliderImages();

  }


  onPageSizeChange(
    size: number
  ): void {

    this.pageSize = size;

    this.currentPage = 1;

    this.getSliderImages();

  }


  // =====================================================
  // Search
  // =====================================================

  onSearch(
    value: string
  ): void {

    this.search = value;

    this.currentPage = 1;

    this.getSliderImages();

  }


  // =====================================================
  // Sorting
  // =====================================================

  onSortChange(
    event: any
  ): void {

    this.sortColumn =
      event.column ||
      event.sort_column ||
      '';

    this.sortDirection =
      event.direction ||
      event.sort_direction ||
      'asc';

    this.currentPage = 1;

    this.getSliderImages();

  }


  // =====================================================
  // Custom Table Actions
  // =====================================================

  onCustomAction(
    action: string,
    row: any
  ): void {

    if (action === 'edit') {

      this.openEdit(row);

    }

    else if (action === 'delete') {

      this.deleteSliderImage(row);

    }

  }


  // =====================================================
  // Back to Sliders
  // =====================================================

  backToSliders(): void {

    this.router.navigate([
      '/admin/sliders'
    ]);

  }

}