import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { DocumentListComponent, TableColumn } from '../../../../shared/components/document-list/document-list.component';
import { ModalFormComponent } from '../../../../shared/components/modal-form/modal-form.component';
import { AuthService } from '../../../../core/auth/auth.service';
import { ToastService } from '../../../../shared/services/toast.service';


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


  // =========================================================
  // Properties
  // =========================================================

  data: any[] = [];

  // tableColumns: TableColumn[] = [];

  tableData: any[] = [];

  selectedSlider: any = null;

  formInitialData: any = {};

  isEditMode = false;

  sliderId: string | null = null;

  isLoading = false;

  totalRecords = 0;


  // Pagination

  currentPage = 1;

  pageSize = 25;

  pagination: any = {};

  search = '';

  sortColumn = '';

  sortDirection = 'asc';


  // =========================================================
  // Init
  // =========================================================

  ngOnInit(): void {

    // this.tableColumns = [

    //   // {
    //   //   key: 'image',
    //   //   label: 'Image',
    //   //   type: 'image'
    //   // },

    //   {
    //     key: 'titleHtml',
    //     label: 'Name',
    //     type: 'html'
    //   },

    //   {
    //     key: 'status',
    //     label: 'Status',
    //     type: 'toggle',

    //     toggleConfig: {
    //       trueLabel: 'Active',
    //       falseLabel: 'Inactive'
    //     }
    //   },

   
    //   {
    //     key: 'action',
    //     label: 'Action',
    //     type: 'edit'
    //   }

    // ];


    this.loadSliders();
  }


  // =========================================================
  // Server Action
  // =========================================================

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
    { key: 'titleHtml', label: 'Title', widthClass: 'col-2', sortable: true,type: 'html' },
    { key: 'status', label: 'Status', type: 'toggle', toggleConfig: { trueLabel: 'Active', falseLabel: 'Inactive' } },
    // { key: 'created_at', label: 'Created At', widthClass: 'col-1', sortable: true },
    {
      key: 'action',
      type: 'dropdown',
      label: 'Choose Action',
      widthClass: 'col-2',
      dropdownConfig: {
        label: 'Choose Action',
        items: (row: any) => {
          const actions = [
            { label: 'Edit', actionName: 'edit', class: 'text-secondary' },
          ];
          return actions;
          
        }
      }
    }
  ];

;

  // =========================================================
  // Date Format
  // =========================================================

  formatDate(dateInput: any): string {

    if (!dateInput) {
      return '';
    }

    const date = new Date(dateInput);

    if (isNaN(date.getTime())) {
      return dateInput;
    }

    const day =
      String(date.getDate()).padStart(2, '0');

    const month =
      String(date.getMonth() + 1).padStart(2, '0');

    const year =
      date.getFullYear();

    return `${day}-${month}-${year}`;
  }


  // =========================================================
  // Load Sliders
  // =========================================================
// loadSliders(page: number = this.currentPage): void {
//   this.currentPage = page;
//     const params = {

//       page: this.currentPage,
//       per_page: this.pageSize,
//       search: this.search,
//       sort_column: this.sortColumn,
//       sort_direction: this.sortDirection

//     };


//     this.isLoading = true;
//     this.sliderService.getSliders(params).subscribe({
//     next: (res: any) => {
//           // console.log('Slider API response:',  res );    
//      this.data = res.data.map((slider: any, index: number) => {
//                   const englishTitle =
//                     slider.name ||
//                     'N/A';

//                   return {

//                     id:
//                       slider.public_id,

//                     public_id:
//                       slider.public_id,

//                     orignalSeq: (params.page - 1) * params.per_page + index + 1,


//                     titleHtml: `
//                       <div class="text-dark pb-2 lh-1">
//                         <span class="text-muted fw-bold small">
//                           EN:
//                         </span>
//                         ${englishTitle}
//                       </div>`,

//                     title_en:
//                       englishTitle,
//                     image:
//                       slider.image ||
//                       slider.slider_image ||
//                       slider.banner || '',


//                     status:
//                       !!slider.status,


//                     sortOrder:
//                       slider.sort_order ?? 0,


//                     createdAt:
//                       this.formatDate(
//                         slider.created_at
//                       ),


//                     canEdit:
//                       true,


//                     originalData:
//                       slider

//                   };

//                 }
//               );


//           this.isLoading = false;       

//           this.totalRecords = res.pagination.total;

//           this.pagination = res.pagination;

//           this.currentPage = res.pagination.current_page;

//           this.pageSize = res.pagination.per_page;

//           this.cdr.detectChanges();

//         },


//         error: (err: any) => {

//           console.error(
//             'Failed to load sliders:',
//             err
//           );


//           this.isLoading = false;


//           this.toast.show(
//             'error',
//             err.error?.message ||
//             err.message ||
//             'Failed to load sliders'
//           );

//         }

//       });
//   }

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

  this.sliderService
    .getSliders(params)
    .subscribe({
      next: (res: any) => {

        this.data = res.data.map((slider: any, index: number) => {

          const englishTitle = slider.name || 'N/A';

          return {
            id: slider.public_id,
            public_id: slider.public_id,

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

  // =========================================================
  // Open Create Modal
  // =========================================================

  openCreateModal(): void {

    this.isEditMode = false;

    this.sliderId = null;

    this.selectedSlider = null;


    if (this.sliderModal?.dynamicForm) {

      this.sliderModal
        .dynamicForm
        .form
        .reset();

    }


    this.router.navigate([], {

      relativeTo: this.route,

      queryParams: {
        public_id: null
      },

      queryParamsHandling: 'merge'

    }).then(() => {

      this.sliderModal.open();

    });
  }


  // =========================================================
  // Open Edit Modal
  // =========================================================

  openEditModal(
    id: string | number
  ): void {

    this.isEditMode = true;

    this.sliderId = String(id);


    this.router.navigate([], {

      relativeTo: this.route,

      queryParams: {
        public_id: this.sliderId
      },

      queryParamsHandling: 'merge'

    }).then(() => {


      this.sliderService
        .getSliderByPublicId(
          String(id)
        )
        .subscribe({

          next: (res: any) => {

            console.log(
              'Slider details:',
              res
            );


            if (!res.data) {

              console.error(
                'Slider data not found'
              );

              return;

            }


            const sliderData =
              res.data;


            this.selectedSlider =
              sliderData;


            console.log(
              'Editing slider:',
              sliderData
            );


            const patchValue = {

              title_en:
                sliderData.title_en ??
                sliderData.name_en ??
                '',


              title_pb:
                sliderData.title_pb ??
                sliderData.name_pb ??
                '',


              description_en:
                sliderData.description_en ??
                '',


              description_pb:
                sliderData.description_pb ??
                '',


              status:
                !!sliderData.status,


              sort_order:
                sliderData.sort_order ??
                0,


              image:
                sliderData.image ??
                sliderData.slider_image ??
                ''

            };


            // Open modal first

            this.sliderModal.open();


            setTimeout(() => {

              const form =
                this.sliderModal
                  ?.dynamicForm
                  ?.form;


              if (!form) {

                console.error(
                  'Dynamic form is not available'
                );

                return;

              }


              console.log(
                'Before patch:',
                form.value
              );


              form.patchValue(
                patchValue
              );


              console.log(
                'After patch:',
                form.value
              );


              this.cdr.detectChanges();

            }, 100);

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


  // =========================================================
  // Submit
  // =========================================================

  onSubmit(
    formData: any
  ): void {

    const payload =
      new FormData();


    // =======================================================
    // English title
    // =======================================================

    payload.append(
      'title[1]',
      formData.title_en || ''
    );


    // =======================================================
    // Punjabi title
    // =======================================================

    payload.append(
      'title[2]',
      formData.title_pb || ''
    );


    // =======================================================
    // English description
    // =======================================================

    payload.append(
      'description[1]',
      formData.description_en || ''
    );


    // =======================================================
    // Punjabi description
    // =======================================================

    payload.append(
      'description[2]',
      formData.description_pb || ''
    );


    // =======================================================
    // Status
    // =======================================================

    payload.append(

      'status',

      formData.status === true ||
      formData.status === 1 ||
      formData.status === '1'

        ? '1'
        : '0'

    );


    // =======================================================
    // Sort order
    // =======================================================

    payload.append(
      'sort_order',
      String(
        formData.sort_order ?? 0
      )
    );


    // =======================================================
    // Image
    // =======================================================

    if (
      formData.image instanceof File
    ) {

      payload.append(
        'image',
        formData.image
      );

    }


    // =======================================================
    // Debug
    // =======================================================

    console.log(
      'Edit mode:',
      this.isEditMode
    );

    console.log(
      'Slider ID:',
      this.sliderId
    );

    console.log(
      'Form data:',
      formData
    );


    payload.forEach(
      (value, key) => {

        console.log(
          key,
          value
        );

      }
    );


    // =======================================================
    // UPDATE
    // =======================================================

    if (
      this.isEditMode &&
      this.sliderId
    ) {

      this.sliderService
        .updateSlider(
          this.sliderId,
          payload
        )
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


    // =======================================================
    // CREATE
    // =======================================================

    this.sliderService
      .createSlider(payload)
      .subscribe({

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


  // =========================================================
  // Update Status
  // =========================================================

  updateSliderStatus(
    id: string | number,
    status: boolean | number
  ): void {

    const sliderId =
      String(id);


  const statusValue = Number(status) === 1 ? 0 : 1;


    console.log(
      'Updating slider status'
    );

    console.log(
      'Slider ID:',
      sliderId
    );

    console.log(
      'Status:',
      statusValue
    );


    this.sliderService
      .updateSliderStatus(
        sliderId,
        statusValue
      )
      .subscribe({

        next: (res: any) => {

          console.log(
            'Slider status updated:',
            res
          );


          this.toast.show(
            'success',
            res.message ||
            'Slider status updated successfully',
            3000
          );
          this.loadSliders();
        },


        error: (error: any) => {
          console.error(
            'Slider status update failed:',
            error
          );

         this.toast.show(
            'error',
            error.error?.message ||
            'Failed to update slider status',
            3000
          );


          this.loadSliders();

        }

      });

  }


  // =========================================================
  // Delete
  // =========================================================

  deleteSlider(
    id: string | number
  ): void {

    const sliderId =
      String(id);


    if (
      !confirm(
        'Are you sure you want to delete this slider?'
      )
    ) {

      return;

    }


    this.sliderService
      .deleteSlider(
        sliderId
      )
      .subscribe({

        next: (res: any) => {

          console.log(
            'Slider deleted:',
            res
          );


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


  // =========================================================
  // Handle Table Action
  // =========================================================

  handleAction(
    event: any
  ): void {

    console.log(
      'Slider action:',
      event
    );


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
  console.log("Text===",text);
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
  console.log('Page size',size);
  this.currentPage = 1;
  this.loadSliders(1);
}
  // =========================================================
  // Close Modal
  // =========================================================

  closeModal(): void {
    this.sliderModal.close();
  }


  // =========================================================
  // Modal Closed
  // =========================================================

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