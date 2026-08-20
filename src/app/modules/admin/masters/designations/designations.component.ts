import { Component, OnInit, ChangeDetectorRef, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { DocumentListComponent, TableColumn } from '../../../../shared/components/document-list/document-list.component';
import { AuthService } from '../../../../core/auth/auth.service';
import { Designation } from '../../../../core/models/designation.model';
import { CustomValidators } from '../../../../common/validation/custom-validators';
import { ModalFormComponent } from '../../../../shared/components/modal-form/modal-form.component';
import { EncryptionService } from '../../../../core/services/encrypt.service';
import { ToastService } from '../../../../shared/services/toast.service';
import { DesignationSchema } from './designations-form.schema';
import { ModalHelperService } from '../../../../shared/services/modal-helper';

@Component({
  selector: 'app-designations',
  imports: [DocumentListComponent, ModalFormComponent, CommonModule],
  templateUrl: './designations.component.html',
  styleUrl: './designations.component.scss',
})
export class DesignationsComponent implements OnInit {

  constructor(private userService: AuthService, private cdr: ChangeDetectorRef) { }

  @ViewChild(ModalFormComponent) designationModal!: ModalFormComponent;

  private toast = inject(ToastService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private modalHelper = inject(ModalHelperService);

  data: Designation[] = [];
  formInitialData: any = {};
  allDesignationList: any[] = [];
  isEditMode = false;
  designationId: string | null = null;

  DesignationSchema = DesignationSchema;
  updatingDesignationId: string | null = null;


  designationInitialData: any = {};
  isDesignationLoading: boolean = false;

  currentPage = 1;
  pageSize = 25;
  pagination: any = {};
  search = '';
  sortColumn = '';
  sortDirection = 'asc';

  ngOnInit(): void {
    this.loadDesignations();
  }

  openCreateModal() {
    this.isEditMode = false;
    this.designationId = null;

    this.modalHelper.openModal({
      modalRef: this.designationModal, 
      schema: this.DesignationSchema,
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

  openEditModal(Designation: any) {

    this.isEditMode = true;
    this.designationId = Designation.id;

    this.DesignationSchema.submitLabel = 'Update State';

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { id: this.designationId },
      queryParamsHandling: 'merge'
    }).then(() => {

      this.designationModal.open();

      setTimeout(() => {

        const form = this.designationModal?.dynamicForm?.form;

        if (!form) {
          return;
        }

        form.patchValue({
          name_en: Designation.name_en || '',
          name_pb: Designation.name_pb || '',
          description_en: Designation.description_en || '',
          description_pb: Designation.description_pb || '',
          desigsenioritylevel: Designation.desigsenioritylevel,
          status: Designation.status
        });

      }, 100);
    });
  }

  loadDesignations(page: number = this.currentPage): void {

    this.currentPage = page;

    const params = {
      page: this.currentPage,
      per_page: this.pageSize,
      search: this.search,
      sort_column: this.sortColumn,
      sort_direction: this.sortDirection
    };

    this.userService.getDesignations(params).subscribe({

      next: (response) => {

        this.data = response.data.map((designation: any, index: number) => ({
          orignalSeq: (this.currentPage - 1) * this.pageSize + index + 1,
          id: designation.public_id,
          name_en: designation.name_en,
          name_pb: designation.name_pb,
          description_en: designation.description_en,
          description_pb: designation.description_pb,
          desigsenioritylevel: designation.desigsenioritylevel,
          status: designation.status,
          status_value: designation.status == 1 ? 'Active' : 'In-active',
          created_at: this.formatDate(designation.created_at),
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
    { key: 'desigsenioritylevel', label: 'Level', widthClass: 'col-2', sortable: true },
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

    this.loadDesignations(page);

  }

  onSearch(text: string) {
    this.search = text;

    this.loadDesignations(1);

  }

  onSort(event: any) {

    this.sortColumn = event.column;

    this.sortDirection = event.direction;

    this.loadDesignations(1);

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
      desigsenioritylevel: formData.desigsenioritylevel,
      same_as_english_pb: formData.same_as_english_pb ?? null,
      status: formData.status,
      desigcode: this.designationId ?? null,
    };
    if (this.isEditMode && this.designationId) {

      this.userService.updateDesignation(this.designationId, payload).subscribe({
        next: (res: any) => {
          this.toast.show('success', res.message || 'Designation updated successfully!', 4000);
          this.designationModal.close();
          this.loadDesignations();
        },
        error: (error: any) => {
          this.toast.show('error', error.error?.message || 'Failed to update Designation');
          console.error('Failed to update Designation:', error);
        }
      });

    } else {
       this.userService.createDesignation(payload).subscribe({
        next: (res: any) => {
          this.toast.show('success', res.message || 'Designation created successfully!', 4000);
          this.designationModal.close();
          this.loadDesignations();
        },
        error: (error: any) => {
          this.toast.show('error', error.error?.message || 'Failed to create Designation');
          console.error('Failed to create Designation:', error);
        }
      });
    }
  }
 
  onPageSizeChange(size: number): void {
    this.pageSize = size;
    this.currentPage = 1;

    this.loadDesignations();
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
