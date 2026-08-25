import { Component, OnInit, ChangeDetectorRef, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { DocumentListComponent, TableColumn } from '../../../../shared/components/document-list/document-list.component';
import { AuthService } from '../../../../core/auth/auth.service';
import { Circle } from '../../../../core/models/circle.model';
import { CustomValidators } from '../../../../common/validation/custom-validators';
import { ModalFormComponent } from '../../../../shared/components/modal-form/modal-form.component';
import { EncryptionService } from '../../../../core/services/encrypt.service';
import { ToastService } from '../../../../shared/services/toast.service';
import { CircleSchema } from './circles-form.schema';
import { ModalHelperService } from '../../../../shared/services/modal-helper';
import { State } from '../../../../core/models/state.model';


@Component({
  selector: 'app-circles',
  imports: [DocumentListComponent, ModalFormComponent, CommonModule],
  templateUrl: './circles.component.html',
  styleUrl: './circles.component.scss',
})
export class CirclesComponent implements OnInit {

  constructor(private userService: AuthService, private cdr: ChangeDetectorRef) { }

  @ViewChild(ModalFormComponent) circleModal!: ModalFormComponent;

  private toast = inject(ToastService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private modalHelper = inject(ModalHelperService);

  data: Circle[] = [];
  formInitialData: any = {};
  allCircleList: any[] = [];
  isEditMode = false;
  states: State[] = [];
  selectedState: number | null = null;
  circleId: string | null = null;

  CircleSchema = CircleSchema;
  updatingCircleId: string | null = null;


  circleInitialData: any = {};
  isCircleLoading: boolean = false;

  currentPage = 1;
  pageSize = 25;
  pagination: any = {};
  search = '';
  sortColumn = '';
  sortDirection = 'asc';
  isLoaded = false;

  ngOnInit(): void {
    this.loadCircles();
    this.getStates();
  }

  loadCircles(page: number = this.currentPage): void {

    this.currentPage = page;

    const params = {
      page: this.currentPage,
      per_page: this.pageSize,
      search: this.search,
      sort_column: this.sortColumn,
      sort_direction: this.sortDirection
    };

    this.userService.getCircles(params).subscribe({

      next: (response) => {

        this.data = response.data.map((circle: any, index: number) => ({
          orignalSeq: (this.currentPage - 1) * this.pageSize + index + 1,
          id: circle.circle_id,
          name_en: circle.name_en,
          name_pb: circle.name_pb,
          state: circle.state,
          description_en: circle.description_en,
          description_pb: circle.description_pb,
          lgdstatecode: circle.lgdstatecode,
          lgddistcode: circle.lgddistcode,
          status: circle.status,
          status_value: circle.status == 1 ? 'Active' : 'In-active',
          created_at: this.formatDate(circle.created_at),
        }));

        this.pagination = response.pagination;

        this.currentPage = response.pagination.current_page;

        this.pageSize = response.pagination.per_page;

        this.cdr.detectChanges();

      },

      error: err => {
        console.log(err);
      }

    });

  }

  tableColumns: TableColumn[] = [
    { key: 'name_en', label: 'Name EN', widthClass: 'col-2', sortable: true },
      { key: 'name_pb', label: 'Name PB', widthClass: 'col-2', sortable: true },
    { key: 'state', label: 'State', widthClass: 'col-2', sortable: false },
    { key: 'status_value', label: 'Status', widthClass: 'col-2', sortable: true },
    { key: 'created_at', label: 'Created At', widthClass: 'col-1', sortable: true },
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

  getStates(): void {
    const params = {};
    this.userService.getAllStates(params).subscribe({
      next: (response) => {
          this.states = response;
          const states = response.data || [];
          const parentOptions = states.map((state: any) => ({
            label: state.name_en,
            value: String(state.lgdstatecode)
          }));
          console.log(parentOptions);
          const parentField = this.CircleSchema.fields?.find(
            f => f.name === 'lgdstatecode'
          );

          if (parentField) {
            parentField.options = [
              { label: 'Please select state', value: '' },
              ...parentOptions
            ];
          }
          const form = this.circleModal?.dynamicForm?.form;
          form.get('lgdstatecode')?.setValue('');
          this.isLoaded = true;
          this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading states:', error);
      }
    });
  }

  changePage(page: number) {

    this.loadCircles(page);

  }

  onSearch(text: string) {
    this.search = text;

    this.loadCircles(1);

  }

  onSort(event: any) {

    this.sortColumn = event.column;

    this.sortDirection = event.direction;

    this.loadCircles(1);

  }

 openCreateModal() {
    this.isEditMode = false;
    this.circleId = null;

    this.modalHelper.openModal({
      modalRef: this.circleModal, 
      schema: this.CircleSchema,
      submitLabel: 'Create Circle',
      patchData: { name: '', search: '', selectAll: false, permissions: { slugs: [] } },
      useRouting: true,        
      route: this.route,
      queryParamId: null   
    });
  }

  onModalClosed() {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { id: null },
      queryParamsHandling: 'merge'
    });
  }

  openEditModal(Circle: any) {

    this.isEditMode = true;
    this.circleId = Circle.id;

    this.CircleSchema.submitLabel = 'Update Circle';

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { id: this.circleId },
      queryParamsHandling: 'merge'
    }).then(() => {

      this.circleModal.open();

      setTimeout(() => {

        const form = this.circleModal?.dynamicForm?.form;

        if (!form) {
          return;
        }

        form.patchValue({
          name_en: Circle.name_en || '',
          name_pb: Circle.name_pb || '',
          description_en: Circle.description_en || '',
          description_pb: Circle.description_pb || '',
          lgdstatecode: Circle.lgdstatecode,
          status: Circle.status
        });

      }, 100);
    });
  }

  onSubmit(formData: any): void {
    
    const payload = {
      description: {
        1: formData.description_en || '',
        2: formData.description_pb || ''
      },
      name: {
        1: formData.name_en || '',
        2: formData.name_pb || ''
      },
      lgdstatecode: formData.lgdstatecode,
      same_as_english_pb: formData.same_as_english_pb ?? null,
      status: formData.status,
      circleId: this.circleId ?? null,
    };

    if (this.isEditMode && this.circleId) {

      this.userService.updateCircle(this.circleId, payload).subscribe({
        next: (res: any) => {
          this.toast.show('success', res.message || 'Circle updated successfully!', 4000);
          this.circleModal.close();
          this.loadCircles();
        },
        error: (error: any) => {
          this.toast.show('error', error.error?.message || 'Failed to update Circle');
          console.error('Failed to update Circle:', error);
        }
      });

    } else {
       this.userService.createCircle(payload).subscribe({
        next: (res: any) => {
          this.toast.show('success', res.message || 'Circle created successfully!', 4000);
          this.circleModal.close();
          this.loadCircles();
        },
        error: (error: any) => {
          this.toast.show('error', error.error?.message || 'Failed to create Circle');
          console.error('Failed to create Circle:', error);
        }
      });
    }
  }

  onPageSizeChange(size: number): void {
    this.pageSize = size;
    this.currentPage = 1;

    this.loadCircles();
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
    if (event.action === 'edit' || event.actionName === 'edit') {
      this.openEditModal(event.row);
    }
  }
}
