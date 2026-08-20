import { Component, OnInit, ChangeDetectorRef, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { DocumentListComponent, TableColumn } from '../../../../shared/components/document-list/document-list.component';
import { AuthService } from '../../../../core/auth/auth.service';
import { State } from '../../../../core/models/state.model';
import { CustomValidators } from '../../../../common/validation/custom-validators';
import { ModalFormComponent } from '../../../../shared/components/modal-form/modal-form.component';
import { EncryptionService } from '../../../../core/services/encrypt.service';
import { ToastService } from '../../../../shared/services/toast.service';
import { stateSchema } from './states-form.schema';
import { ModalHelperService } from '../../../../shared/services/modal-helper';

@Component({
  selector: 'app-states',
  imports: [DocumentListComponent, ModalFormComponent, CommonModule],
  templateUrl: './states.component.html',
  styleUrl: './states.component.scss',
})

export class States implements OnInit {

  constructor(private userService: AuthService, private cdr: ChangeDetectorRef) { }

  @ViewChild(ModalFormComponent) stateModal!: ModalFormComponent;

  private toast = inject(ToastService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private modalHelper = inject(ModalHelperService);

  data: State[] = [];
  formInitialData: any = {};
  allStatesList: any[] = [];
  isEditMode = false;
  stateId: string | null = null;

  stateSchema = stateSchema;
  updatingStateId: string | null = null;


  stateInitialData: any = {};
  isStateLoading: boolean = false;

  currentPage = 1;
  pageSize = 25;
  pagination: any = {};
  search = '';
  sortColumn = '';
  sortDirection = 'asc';

  ngOnInit(): void {
    this.loadStates();
  }

  openCreateModal() {
    this.isEditMode = false;
    this.stateId = null;

    this.modalHelper.openModal({
      modalRef: this.stateModal, 
      schema: this.stateSchema,
      submitLabel: 'Create State',
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

  openEditModal(state: any) {

    this.isEditMode = true;
    this.stateId = state.id;

    this.stateSchema.submitLabel = 'Update State';

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { id: this.stateId },
      queryParamsHandling: 'merge'
    }).then(() => {

      this.stateModal.open();

      setTimeout(() => {

        const form = this.stateModal?.dynamicForm?.form;

        if (!form) {
          return;
        }

        form.patchValue({
          name_en: state.name_en || '',
          name_pb: state.name_pb || '',
          description_en: state.description_en || '',
          description_pb: state.description_pb || '',
          lgdstatecode: state.lgdstatecode,
          status: state.status
        });

      }, 100);
    });
  }

  loadStates(page: number = this.currentPage): void {

    this.currentPage = page;

    const params = {
      page: this.currentPage,
      per_page: this.pageSize,
      search: this.search,
      sort_column: this.sortColumn,
      sort_direction: this.sortDirection
    };

    this.userService.getStates(params).subscribe({

      next: (response) => {

        this.data = response.data.map((state: any, index: number) => ({
          orignalSeq: (this.currentPage - 1) * this.pageSize + index + 1,
          id: state.public_id,
          name_en: state.name_en,
          name_pb: state.name_pb,
          description_en: state.description_en,
          description_pb: state.description_pb,
          lgdstatecode: state.lgdstatecode,
          status: state.status,
          status_value: state.status == 1 ? 'Active' : 'In-active',
          created_at: this.formatDate(state.created_at),
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

  changePage(page: number) {

    this.loadStates(page);

  }

  searchStates(text: string) {
    this.search = text;

    this.loadStates(1);

  }

  sortStates(event: any) {

    this.sortColumn = event.column;

    this.sortDirection = event.direction;

    this.loadStates(1);

  }

  onPageSizeChange(size: number): void {
    this.pageSize = size;
    this.currentPage = 1;

    this.loadStates();
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
      state_id: this.stateId ?? null,
    };
    if (this.isEditMode && this.stateId) {

      this.userService.updateState(this.stateId, payload).subscribe({
        next: (res: any) => {
          this.toast.show('success', res.message || 'State updated successfully!', 4000);
          this.stateModal.close();
          this.loadStates();
        },
        error: (error: any) => {
          this.toast.show('error', error.error?.message || 'Failed to update state');
          console.error('Failed to update state:', error);
        }
      });

    } else {
       this.userService.createState(payload).subscribe({
        next: (res: any) => {
          this.toast.show('success', res.message || 'State created successfully!', 4000);
          this.stateModal.close();
          this.loadStates();
        },
        error: (error: any) => {
          this.toast.show('error', error.error?.message || 'Failed to create state');
          console.error('Failed to create state:', error);
        }
      });
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

  handleAction(event: any): void {
    if (event.action === 'edit' || event.actionName === 'edit') {
        this.openEditModal(event.row);
    }
  }
  
}

