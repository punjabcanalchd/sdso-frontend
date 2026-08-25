import { Component, OnInit, ChangeDetectorRef, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { DocumentListComponent, TableColumn } from '../../../../shared/components/document-list/document-list.component';
import { AuthService } from '../../../../core/auth/auth.service';
import { SubDivision } from '../../../../core/models/subdivision.model';
import { CustomValidators } from '../../../../common/validation/custom-validators';
import { ModalFormComponent } from '../../../../shared/components/modal-form/modal-form.component';
import { EncryptionService } from '../../../../core/services/encrypt.service';
import { ToastService } from '../../../../shared/services/toast.service';
import { SubDivisionSchema } from './sub-divisions-form.schema';
import { ModalHelperService } from '../../../../shared/services/modal-helper';
import { Division } from '../../../../core/models/division.model';

@Component({
  selector: 'app-sub-divisions',
  imports: [DocumentListComponent, ModalFormComponent, CommonModule],
  templateUrl: './sub-divisions.component.html',
  styleUrl: './sub-divisions.component.scss',
})
export class SubDivisionsComponent implements OnInit {

  constructor(private userService: AuthService, private cdr: ChangeDetectorRef) { }

  @ViewChild(ModalFormComponent) subDivisionModal!: ModalFormComponent;

  private toast = inject(ToastService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private modalHelper = inject(ModalHelperService);

  data: SubDivision[] = [];
  formInitialData: any = {};
  allSubDivisionList: any[] = [];
  isEditMode = false;
  subDivisionId: string | null = null;
  divisions: Division[] = [];
  selectedDivision: number | null = null;

  SubDivisionSchema = SubDivisionSchema;
  updatingSubDivisionId: string | null = null;


  subDivisionInitialData: any = {};
  isSubDivisionLoading: boolean = false;

  currentPage = 1;
  pageSize = 25;
  pagination: any = {};
  search = '';
  sortColumn = '';
  sortDirection = 'asc';
  isLoaded = false;

  ngOnInit(): void {
    this.loadSubDivisions();
    this.getDivisions();
  }

  loadSubDivisions(page: number = this.currentPage): void {

    this.currentPage = page;

    const params = {
      page: this.currentPage,
      per_page: this.pageSize,
      search: this.search,
      sort_column: this.sortColumn,
      sort_direction: this.sortDirection
    };

    this.userService.getSubDivisions(params).subscribe({

      next: (response) => {

        this.data = response.data.map((subdivision: any, index: number) => ({
          orignalSeq: (this.currentPage - 1) * this.pageSize + index + 1,
          id: subdivision.public_id,
          name_en: subdivision.name_en,
          name_pb: subdivision.name_pb,
          division: subdivision.division,
          subdivision_id: subdivision.subdivision_id,
          division_id: subdivision.division_id,
          description_en: subdivision.description_en,
          description_pb: subdivision.description_pb,
          status: subdivision.status,
          status_value: subdivision.status == 1 ? 'Active' : 'In-active',
          created_at: this.formatDate(subdivision.created_at),
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

  getDivisions(): void {
    const params = {};
    this.userService.getAllDivisions(params).subscribe({
      next: (response) => {
          this.divisions = response;
          const divisions = response.data || [];
          const parentOptions = divisions.map((division: any) => ({
            label: division.name_en,
            value: String(division.public_id)
          }));
          console.log(parentOptions);
          const parentField = this.SubDivisionSchema.fields?.find(
            f => f.name === 'division_id'
          );

          if (parentField) {
            parentField.options = [
              { label: 'Please select division', value: '' },
              ...parentOptions
            ];
          }
          const form = this.subDivisionModal?.dynamicForm?.form;
          form.get('division_id')?.setValue('');
          this.isLoaded = true;
          this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading divisions:', error);
      }
    });
  }


  tableColumns: TableColumn[] = [
    { key: 'name_en', label: 'Name EN', widthClass: 'col-2', sortable: true },
    { key: 'name_pb', label: 'Name PB', widthClass: 'col-2', sortable: true },
    { key: 'division', label: 'Division', widthClass: 'col-2', sortable: false },
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

    this.loadSubDivisions(page);

  }

  onSearch(text: string) {
    this.search = text;

    this.loadSubDivisions(1);

  }

  onSort(event: any) {

    this.sortColumn = event.column;

    this.sortDirection = event.direction;

    this.loadSubDivisions(1);

  }

  onPageSizeChange(size: number): void {
    this.pageSize = size;
    this.currentPage = 1;

    this.loadSubDivisions();
  }

  openCreateModal() {
    this.isEditMode = false;
    this.subDivisionId = null;

    this.modalHelper.openModal({
      modalRef: this.subDivisionModal, 
      schema: this.SubDivisionSchema,
      submitLabel: 'Create Division',
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

  openEditModal(subdivision: any) {

    this.isEditMode = true;
    this.subDivisionId = subdivision.id;

    this.SubDivisionSchema.submitLabel = 'Update Sub-Division';

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { id: this.subDivisionId },
      queryParamsHandling: 'merge'
    }).then(() => {

      this.subDivisionModal.open();

      setTimeout(() => {

        const form = this.subDivisionModal?.dynamicForm?.form;

        if (!form) {
          return;
        }
        console.log('subdivision', subdivision);
        form.patchValue({
          name_en: subdivision.name_en || '',
          name_pb: subdivision.name_pb || '',
          description_en: subdivision.description_en || '',
          description_pb: subdivision.description_pb || '',
          division_id: subdivision.division_id,
          status: subdivision.status
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
      division_id: formData.division_id,
      status: formData.status,
      subDivisionId: this.subDivisionId ?? null,
    };


    if (this.isEditMode && this.subDivisionId) {

      this.userService.updateSubDivision(this.subDivisionId, payload).subscribe({
        next: (res: any) => {
          this.toast.show('success', res.message || 'Sub Division updated successfully!', 4000);
          this.subDivisionModal.close();
          this.loadSubDivisions();
        },
        error: (error: any) => {
          this.toast.show('error', error.error?.message || 'Failed to update Sub Division');
          console.error('Failed to update Sub Division:', error);
        }
      });

    } else {
       this.userService.createSubDivision(payload).subscribe({
        next: (res: any) => {
          this.toast.show('success', res.message || 'Sub Division created successfully!', 4000);
          this.subDivisionModal.close();
          this.loadSubDivisions();
        },
        error: (error: any) => {
          this.toast.show('error', error.error?.message || 'Failed to create Sub Division');
          console.error('Failed to create Sub Division:', error);
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

