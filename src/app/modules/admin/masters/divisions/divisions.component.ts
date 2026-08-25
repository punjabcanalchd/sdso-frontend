import { Component, OnInit, ChangeDetectorRef, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute  } from '@angular/router';
import { DocumentListComponent, TableColumn } from '../../../../shared/components/document-list/document-list.component';
import { AuthService } from '../../../../core/auth/auth.service';
import { Division } from '../../../../core/models/division.model';
import { CustomValidators } from '../../../../common/validation/custom-validators';
import { ModalFormComponent } from '../../../../shared/components/modal-form/modal-form.component';
import { EncryptionService } from '../../../../core/services/encrypt.service';
import { ToastService } from '../../../../shared/services/toast.service';
import { DivisionSchema } from './divisions-form.schema';
import { ModalHelperService } from '../../../../shared/services/modal-helper';
import { Circle } from '../../../../core/models/circle.model';


@Component({
  selector: 'app-divisions',
  imports: [DocumentListComponent, ModalFormComponent, CommonModule],
  templateUrl: './divisions.component.html',
  styleUrl: './divisions.component.scss',
})
export class DivisionsComponent implements OnInit {

  constructor(private userService: AuthService, private cdr: ChangeDetectorRef) { }

  @ViewChild(ModalFormComponent) divisionModal!: ModalFormComponent;

  private toast = inject(ToastService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private modalHelper = inject(ModalHelperService);

  data: Division[] = [];
  formInitialData: any = {};
  allDivisionList: any[] = [];
  isEditMode = false;
  divisionId: string | null = null;
  circles: Circle[] = [];
  selectedCircle: number | null = null;

  DivisionSchema = DivisionSchema;
  updatingDivisionId: string | null = null;


  divisionInitialData: any = {};
  isDivisionLoading: boolean = false;

  currentPage = 1;
  pageSize = 25;
  pagination: any = {};
  search = '';
  sortColumn = '';
  sortDirection = 'asc';
  isLoaded = false;

  ngOnInit(): void {
    this.loadDivisions();
    this.getCircles();
  }

  loadDivisions(page: number = this.currentPage): void {

    this.currentPage = page;

    const params = {
      page: this.currentPage,
      per_page: this.pageSize,
      search: this.search,
      sort_column: this.sortColumn,
      sort_direction: this.sortDirection
    };

    this.userService.getDivisions(params).subscribe({

      next: (response) => {

        this.data = response.data.map((division: any, index: number) => ({
          orignalSeq: (this.currentPage - 1) * this.pageSize + index + 1,
          id: division.public_id,
          name_en: division.name_en,
          name_pb: division.name_pb,
          circle: division.circle,
          description_en: division.description_en,
          description_pb: division.description_pb,
          circle_id: division.circle_id,
          status: division.status,
          status_value: division.status == 1 ? 'Active' : 'In-active',
          created_at: this.formatDate(division.created_at),
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

  getCircles(): void {
    const params = {};
    this.userService.getAllCircles(params).subscribe({
      next: (response) => {
          this.circles = response;
          const circles = response.data || [];
          const parentOptions = circles.map((circle: any) => ({
            label: circle.name_en,
            value: String(circle.public_id)
          }));
          console.log(parentOptions);
          const parentField = this.DivisionSchema.fields?.find(
            f => f.name === 'circle_id'
          );

          if (parentField) {
            parentField.options = [
              { label: 'Please select circle', value: '' },
              ...parentOptions
            ];
          }
          const form = this.divisionModal?.dynamicForm?.form;
          form.get('circle_id')?.setValue('');
          this.isLoaded = true;
          this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading circles:', error);
      }
    });
  }

  tableColumns: TableColumn[] = [
    { key: 'name_en', label: 'Name EN', widthClass: 'col-2', sortable: true },
    { key: 'name_pb', label: 'Name PB', widthClass: 'col-2', sortable: true },
    { key: 'circle', label: 'Circle', widthClass: 'col-2', sortable: false },
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

    this.loadDivisions(page);

  }

  onSearch(text: string) {
    this.search = text;

    this.loadDivisions(1);

  }

  onSort(event: any) {

    this.sortColumn = event.column;

    this.sortDirection = event.direction;

    this.loadDivisions(1);

  }

  onPageSizeChange(size: number): void {
    this.pageSize = size;
    this.currentPage = 1;

    this.loadDivisions();
  }

  openCreateModal() {
    this.isEditMode = false;
    this.divisionId = null;

    this.modalHelper.openModal({
      modalRef: this.divisionModal, 
      schema: this.DivisionSchema,
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

  openEditModal(division: any) {

    this.isEditMode = true;
    this.divisionId = division.id;

    this.DivisionSchema.submitLabel = 'Update Division';

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { id: this.divisionId },
      queryParamsHandling: 'merge'
    }).then(() => {

      this.divisionModal.open();

      setTimeout(() => {

        const form = this.divisionModal?.dynamicForm?.form;

        if (!form) {
          return;
        }
        console.log('division',division);
        form.patchValue({
          name_en: division.name_en || '',
          name_pb: division.name_pb || '',
          description_en: division.description_en || '',
          description_pb: division.description_pb || '',
          circle_id: division.circle_id,
          status: division.status
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
      circle_id: formData.circle_id,
      same_as_english_pb: formData.same_as_english_pb ?? null,
      status: formData.status,
      divisionId: this.divisionId ?? null,
    };

    if (this.isEditMode && this.divisionId) {

      this.userService.updateDivision(this.divisionId, payload).subscribe({
        next: (res: any) => {
          this.toast.show('success', res.message || 'Division updated successfully!', 4000);
          this.divisionModal.close();
          this.loadDivisions();
        },
        error: (error: any) => {
          this.toast.show('error', error.error?.message || 'Failed to update Division');
          console.error('Failed to update Division:', error);
        }
      });

    } else {
       this.userService.createDivision(payload).subscribe({
        next: (res: any) => {
          this.toast.show('success', res.message || 'Division created successfully!', 4000);
          this.divisionModal.close();
          this.loadDivisions();
        },
        error: (error: any) => {
          this.toast.show('error', error.error?.message || 'Failed to create Division');
          console.error('Failed to create Division:', error);
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
