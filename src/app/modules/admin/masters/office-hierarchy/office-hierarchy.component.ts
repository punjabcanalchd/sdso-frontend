import { Component, OnInit, ChangeDetectorRef, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { DocumentListComponent, TableColumn } from '../../../../shared/components/document-list/document-list.component';
import { AuthService } from '../../../../core/auth/auth.service';
import { OfficeHierarchy } from '../../../../core/models/office-hierarchy.model';
import { CustomValidators } from '../../../../common/validation/custom-validators';
import { ModalFormComponent } from '../../../../shared/components/modal-form/modal-form.component';
import { EncryptionService } from '../../../../core/services/encrypt.service';
import { ToastService } from '../../../../shared/services/toast.service';
import { OfficeHierarchySchema } from './office-hierarchy-form.schema';
import { ModalHelperService } from '../../../../shared/services/modal-helper';




@Component({
  selector: 'app-office-hierarchy',
  imports: [DocumentListComponent, ModalFormComponent, CommonModule],
  templateUrl: './office-hierarchy.component.html',
  styleUrl: './office-hierarchy.component.scss',
})
export class OfficeHierarchyComponent  implements OnInit {

  constructor(private userService: AuthService, private cdr: ChangeDetectorRef) { }

  @ViewChild(ModalFormComponent) officeHierarchyModal!: ModalFormComponent;

  private toast = inject(ToastService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private modalHelper = inject(ModalHelperService);

  data: OfficeHierarchy[] = [];
  formInitialData: any = {};
  allOfficeHierarchyList: any[] = [];
  isEditMode = false;
  OfficeHierarchyId: string | null = null;

  OfficeHierarchySchema = OfficeHierarchySchema;
  updatingOfficeHierarchyId: string | null = null;


  officeHierarchyInitialData: any = {};
  isOfficeHierarchyLoading: boolean = false;

  currentPage = 1;
  pageSize = 25;
  pagination: any = {};
  search = '';
  sortColumn = '';
  sortDirection = 'asc';

  ngOnInit(): void {
    this.loadOfficeHierarchy();
  }

   openCreateModal() {
    this.isEditMode = false;
    this.OfficeHierarchyId = null;

    this.modalHelper.openModal({
      modalRef: this.officeHierarchyModal, 
      schema: this.OfficeHierarchySchema,
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

  openEditModal(OfficeHierarchy: any) {

    this.isEditMode = true;
    this.OfficeHierarchyId = OfficeHierarchy.id;

    this.OfficeHierarchySchema.submitLabel = 'Update State';

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { id: this.OfficeHierarchyId },
      queryParamsHandling: 'merge'
    }).then(() => {

      this.officeHierarchyModal.open();

      setTimeout(() => {

        const form = this.officeHierarchyModal?.dynamicForm?.form;

        if (!form) {
          return;
        }

        form.patchValue({
          name_en: OfficeHierarchy.name_en || '',
          name_pb: OfficeHierarchy.name_pb || '',
          description_en: OfficeHierarchy.description_en || '',
          description_pb: OfficeHierarchy.description_pb || '',
          officesenioritylevel: OfficeHierarchy.officesenioritylevel,
          status: OfficeHierarchy.status
        });

      }, 100);
    });
  }

  loadOfficeHierarchy(page: number = this.currentPage): void {

    this.currentPage = page;

    const params = {
      page: this.currentPage,
      per_page: this.pageSize,
      search: this.search,
      sort_column: this.sortColumn,
      sort_direction: this.sortDirection
    };

    this.userService.getOfficeHierarchy(params).subscribe({

      next: (response) => {

        this.data = response.data.map((officeHierarchy: any, index: number) => ({
          orignalSeq: (this.currentPage - 1) * this.pageSize + index + 1,
          id: officeHierarchy.public_id,
          name_en: officeHierarchy.name_en,
          name_pb: officeHierarchy.name_pb,
          officesenioritylevel: officeHierarchy.officesenioritylevel,
          description_en: officeHierarchy.description_en,
          description_pb: officeHierarchy.description_pb,
          status: officeHierarchy.status,
          status_value: officeHierarchy.status == 1 ? 'Active' : 'In-active',
          created_at: this.formatDate(officeHierarchy.created_at),
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
    { key: 'officesenioritylevel', label: 'Level', widthClass: 'col-2', sortable: true },
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

    this.loadOfficeHierarchy(page);

  }

  onSearch(text: string) {
    this.search = text;

    this.loadOfficeHierarchy(1);

  }

  onSort(event: any) {

    this.sortColumn = event.column;

    this.sortDirection = event.direction;

    this.loadOfficeHierarchy(1);

  }
  
  onPageSizeChange(size: number): void {
    this.pageSize = size;
    this.currentPage = 1;

    this.loadOfficeHierarchy();
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
      officesenioritylevel: formData.officesenioritylevel,
      same_as_english_pb: formData.same_as_english_pb ?? null,
      status: formData.status,
      officelevelcode: this.OfficeHierarchyId ?? null,
    };
    if (this.isEditMode && this.OfficeHierarchyId) {

      this.userService.updateOfficeHierarchy(this.OfficeHierarchyId, payload).subscribe({
        next: (res: any) => {
          this.toast.show('success', res.message || 'Office Hierarchy updated successfully!', 4000);
          this.officeHierarchyModal.close();
          this.loadOfficeHierarchy();
        },
        error: (error: any) => {
          this.toast.show('error', error.error?.message || 'Failed to update Office Hierarchy');
          console.error('Failed to update Office Hierarchy:', error);
          this.loadOfficeHierarchy();
        }
      });

    } else {
       this.userService.createOfficeHierarchy(payload).subscribe({
        next: (res: any) => {
          this.toast.show('success', res.message || 'Office Hierarchy created successfully!', 4000);
          this.officeHierarchyModal.close();
        },
        error: (error: any) => {
          this.toast.show('error', error.error?.message || 'Failed to create Office Hierarchy');
          console.error('Failed to create Office Hierarchy:', error);
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
