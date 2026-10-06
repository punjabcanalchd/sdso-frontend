import { Component, OnInit, ViewChild, inject, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';

import { DocumentListComponent, TableColumn } from '../../../../shared/components/document-list/document-list.component';
import { ModalFormComponent } from '../../../../shared/components/modal-form/modal-form.component';
import { AuthService } from '../../../../core/auth/auth.service';
import { ToastService } from '../../../../shared/services/toast.service';
import { environment } from '../../../../../environments/environment';
import { sliderImageSchema as sliderImageFormSchema } from './slider-image-from.schema';


@Component({
  standalone: true,
  selector: 'app-slider-image',
  imports: [DocumentListComponent, ModalFormComponent],
  templateUrl: './slider-image.component.html',
  styleUrl: './slider-image.component.scss'
})
export class SliderImageComponent implements OnInit {
  @ViewChild(ModalFormComponent)
  sliderImageModal!: ModalFormComponent;

  @Input() isAdmin: boolean = true;

  sliderImageSchema = sliderImageFormSchema;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private toast: ToastService,
    private cdr: ChangeDetectorRef
  ) { }

  sliderId: string = '';
  data: any[] = [];
  isLoading = false;
  currentPage = 1;
  pageSize = 25;
  totalRecords = 0;
  pagination: any = {};
  search = '';
  sortColumn = '';
  sortDirection = 'asc';
  sliderName = '';
  isEditMode = false;
  formInitialData: any = {};
  existingImageUrl: string = '';
  sliderImageCount = 0;
  imageType = '';

  ngOnInit(): void {
    this.sliderId = this.route.snapshot.paramMap.get('slider_id') || '';
    this.imageType = this.route.snapshot.queryParamMap.get('type') || '';
    if (!this.sliderId) {
      this.toast.show('error', 'Slider ID is missing');
      return;
    }
    this.loadSliderName();
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

  loadSliderName(): void {
    this.authService.getSliderById(this.sliderId).subscribe({
      next: (res: any) => {
        const baseName = res.data?.name || '';
        this.sliderName = this.imageType === 'gif' ? `${baseName} (GIF)` : baseName;
      },
      error: (err: any) => {
        console.log('Failed to load slider name:', err);
      }
    });
  }

  loadSliderImages(page: number = this.currentPage): void {
    this.currentPage = page;
    const params: any = {
      page: this.currentPage,
      per_page: this.pageSize,
      search: this.search,
      sort_column: this.sortColumn,
      sort_direction: this.sortDirection
    };
    if (this.imageType) {
      params.type = this.imageType;
    }
    this.isLoading = true;
    this.authService.getSliderImages(this.sliderId, params).subscribe({

      next: (res: any) => {
        // console.log('FULL SLIDER IMAGE RESPONSE:', res);

        const images = res.data?.data || [];

        this.data = images.map((image: any, index: number) => ({
          id: image.public_id || image.id,
          public_id: image.public_id || image.id,

          slider_id_encrypted:
            image.slider_id_encrypted ||
            image.slider_id ||
            this.sliderId,

          originalSeq:
            (params.page - 1) * params.per_page + index + 1,

          image: image.image_name
            ? `${environment.baseUrl}/${image.image_name}`
            : '',

          status: Number(image.status),

          sortOrder: image.sort_order ?? 0,

          createdAt: this.formatDate(image.created_at),

          canEdit: true,

          originalData: image
        }));



        this.pagination = res.data;
        this.totalRecords = res.data.total || 0;
        this.currentPage = res.data.current_page || 1;
        this.pageSize = res.data.per_page || 25;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Failed to load slider images:', err);
        this.isLoading = false;
        this.toast.show('error', err.error?.message || 'Failed to load slider images');
      }
    });
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

  handleAction(event: any): void {
    console.log('Action event:', event);

    const action = event?.action || event?.actionName;
    const row = event?.row;

    const imageId = row?.public_id;
    const sliderId = row?.slider_id_encrypted;

    if (!imageId) {
      console.error(
        'Encrypted slider image ID is missing',
        row
      );
      return;
    }

    console.log('Action:', action);
    console.log('Encrypted slider image ID:', imageId);

    switch (action) {

      case 'edit':
        this.openEdit(imageId);
        break;

      case 'image':
        this.router.navigate([
          '/admin/slider-image',
          imageId
        ]);
        break;

      case 'delete':
        if (!sliderId) {
          console.error(
            'Encrypted slider ID is missing',
            row
          );
          return;
        }

        this.deleteSliderImage(
          sliderId,
          imageId
        );
        break;

      case 'toggle_status':
        if (!sliderId) {
          console.error('Encrypted slider ID is missing', row);
          return;
        }

        const newStatus = Number(
          event?.status ?? row?.status
        );

        console.log('New status:', newStatus);

        this.updateSliderImageStatus(
          sliderId,
          imageId,
          newStatus
        );

        break;
      default:
        console.warn(
          'Unknown slider image action:',
          action
        );
    }
  }

  editSliderImage(imageId: string): void {
    this.authService
      .getSliderImageById(imageId)
      .subscribe({
        next: (res: any) => {
          console.log('Slider image details:', res);

          this.sliderImageModal?.open();
        },
        error: (error: any) => {
          console.error(
            'Failed to load slider image:',
            error
          );

          this.toast.show(
            'error',
            error.error?.message ||
            'Failed to load slider image'
          );
        }
      });
  }


  deleteSliderImage(
    sliderId: string,
    imageId: string
  ): void {

    if (!confirm('Are you sure you want to delete this slider image?')) {
      return;
    }

    this.authService
      .deleteSliderImage(sliderId, imageId)
      .subscribe({
        next: (res: any) => {

          this.toast.show(
            'success',
            res.message ||
            'Slider image deleted successfully',
            3000
          );

          this.loadSliderImages();
        },

        error: (error: any) => {

          console.error(
            'Slider image delete failed:',
            error
          );

          this.toast.show(
            'error',
            error.error?.message ||
            'Failed to delete slider image',
            3000
          );
        }
      });
  }
  updateSliderImageStatus(
    sliderId: string,
    imageId: string,
    status: boolean | number
  ): void {

    const statusValue = Number(status);

    this.authService
      .updateSliderImageStatus(
        sliderId,
        imageId,
        statusValue
      )
      .subscribe({
        next: (res: any) => {

          this.toast.show(
            'success',
            res.message ||
            'Slider image status updated successfully',
            3000
          );

          this.loadSliderImages();
        },

        error: (error: any) => {

          console.error(
            'Slider image status update failed:',
            error
          );

          this.toast.show(
            'error',
            error.error?.message ||
            'Failed to update slider image status',
            3000
          );
        }
      });
  }

  changePage(page: number): void {
    this.loadSliderImages(page);
  }

  searchSliderImages(text: string): void {
    this.search = text;
    this.currentPage = 1;
    this.loadSliderImages(1);
  }

  sortSliderImages(event: any): void {
    this.sortColumn = event.column;
    this.sortDirection = event.direction;
    this.currentPage = 1;
    this.loadSliderImages(1);
  }

  onPageSizeChange(size: number): void {
    this.pageSize = size;
    this.currentPage = 1;
    this.loadSliderImages(1);
  }

  backToSliders(): void {
    this.router.navigate(['/admin/slider']);
  }
  openCreate(): void {
    this.isEditMode = false;

    this.sliderImageSchema.submitLabel = this.imageType === 'gif' ? 'Upload GIF' : 'Create Slider Image';

    const imageField = this.sliderImageSchema.fields?.find(f => f.name === 'image');
    if (imageField) {
      imageField.accept = this.imageType === 'gif' ? '.gif' : '.jpg,.jpeg,.png,.webp,.gif';
    }

    this.formInitialData = {
      image: null,
      title: '',
      title_pb: '',
      link: '',
      status: 1
    };

    if (this.sliderImageModal?.dynamicForm) {
      this.sliderImageModal.dynamicForm.form.reset(this.formInitialData);
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { image_id: null },
      queryParamsHandling: 'merge'
    }).then(() => {
      this.sliderImageModal.open();
    });
  }

  openEdit(id: string | number): void {
    this.isEditMode = true;

    const imageId = String(id);

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { image_id: imageId },
      queryParamsHandling: 'merge'
    });

    this.sliderImageSchema.submitLabel = this.imageType === 'gif' ? 'Update GIF' : 'Update Slider Image';

    const imageField = this.sliderImageSchema.fields?.find(f => f.name === 'image');
    if (imageField) {
      imageField.accept = this.imageType === 'gif' ? '.gif' : '.jpg,.jpeg,.png,.webp,.gif';
    }

    this.authService
      .getSliderImageById(imageId)
      .subscribe({
        next: (res: any) => {
          console.log('Slider Image response:', res);

          if (!res.data) {
            console.error('Slider image data not found');
            return;
          }



          const imageData = res.data;
          this.existingImageUrl = imageData.image_name
            ? `${environment.baseUrl}/${imageData.image_name}`
            : '';


          console.log('Image name:', imageData.image_name);
          console.log('Base URL:', environment.baseUrl);
          console.log(
            'Final Image URL:',
            imageData.image_name
              ? `${environment.baseUrl}/${imageData.image_name}`
              : ''
          );

          const patchValue = {
            image: imageData.image_name ?? '',
            title: imageData.title ?? '',
            title_pb: imageData.title_pb ?? '',
            link: imageData.link ?? '',
            status: !!imageData.status
          };

          console.log('Slider Image patch value:', patchValue);

          this.formInitialData = patchValue;

          this.sliderImageModal.open();

          setTimeout(() => {
            const dynamicForm = this.sliderImageModal?.dynamicForm;

            if (!dynamicForm) {
              console.error('Dynamic form is not available');
              return;
            }

            const form = dynamicForm.form;

            if (!form) {
              console.error('FormGroup is not available');
              return;
            }

            form.patchValue(patchValue);

            console.log('After patch:', form.value);

            this.cdr.detectChanges();
          }, 300);
        },

        error: (err: any) => {
          console.error(
            'Failed to load slider image:',
            err
          );

          this.toast.show(
            'error',
            err.error?.message ||
            'Failed to load slider image'
          );
        }
      });
  }

  goBack(): void {
    this.router.navigate(['/admin/slider']);
  }

  onSubmit(formValue: any): void {
    const formData = new FormData();

    console.log('FORM VALUE:', formValue);
    console.log('IMAGE:', formValue.image);

    if (formValue.image instanceof File) {
      formData.append('image', formValue.image);
    }

    formData.append('title', formValue.title ?? '');
    formData.append('title_pb', formValue.title_pb ?? '');
    formData.append('link', formValue.link ?? '');
    formData.append('status', String(formValue.status ?? 0));

    if (this.isEditMode) {
      const imageId = this.route.snapshot.queryParamMap.get('image_id');

      if (!imageId) {
        this.toast.show('error', 'Slider image ID is missing');
        return;
      }

      this.authService.updateSliderImage(this.sliderId, imageId, formData).subscribe({
        next: (res: any) => {
          this.toast.show('success', res.message || 'Slider image updated successfully', 3000);
          this.sliderImageModal.close();
          this.loadSliderImages();
        },
        error: (err: any) => {
          console.error('Failed to update slider image:', err);
          this.toast.show('error', err.error?.message || 'Failed to update slider image', 3000);
        }
      });
    } else {
      this.authService.createSliderImage(
        this.sliderId,
        formData
      ).subscribe({
        next: (res: any) => {
          this.toast.show(
            'success',
            res.message || 'Slider image created successfully',
            3000
          );

          this.sliderImageModal.close();
          this.loadSliderImages();
        },
        error: (err: any) => {
          console.error('Failed to create slider image:', err);

          this.toast.show(
            'error',
            err.error?.message || 'Failed to create slider image',
            3000
          );
        }

      });
    }
  }


  onModalClosed(): void {
    this.isEditMode = false;
    // this.editingImageId = '';
    this.formInitialData = {};
  }

}