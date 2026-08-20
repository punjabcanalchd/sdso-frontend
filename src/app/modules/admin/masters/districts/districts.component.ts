import { Component, OnInit, ChangeDetectorRef, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { DocumentListComponent, TableColumn } from '../../../../shared/components/document-list/document-list.component';
import { AuthService } from '../../../../core/auth/auth.service';
import { District } from '../../../../core/models/district.model';
import { CustomValidators } from '../../../../common/validation/custom-validators';
import { ModalFormComponent } from '../../../../shared/components/modal-form/modal-form.component';
import { EncryptionService } from '../../../../core/services/encrypt.service';
import { ToastService } from '../../../../shared/services/toast.service';
import { districtSchema } from './districts-form.schema';
import { ModalHelperService } from '../../../../shared/services/modal-helper';
import { State } from '../../../../core/models/state.model';

@Component({
  selector: 'app-districts',
  imports: [DocumentListComponent, ModalFormComponent, CommonModule],
  templateUrl: './districts.component.html',
  styleUrl: './districts.component.scss',
})
export class Districts implements OnInit {

  constructor(private userService: AuthService, private cdr: ChangeDetectorRef) { }

  @ViewChild(ModalFormComponent) districtModal!: ModalFormComponent;

  private toast = inject(ToastService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private modalHelper = inject(ModalHelperService);
  
    data: District[] = [];
    formInitialData: any = {};
    allDistrictsList: any[] = [];
    isEditMode = false;
    districtId: string | null = null;
    states: State[] = [];
    selectedState: number | null = null;

  
    districtSchema = districtSchema;
    updatingDistId: string | null = null;
  
  
    districtInitialData: any = {};
    isStateLoading: boolean = false;
  
    currentPage = 1;
    pageSize = 25;
    pagination: any = {};
    search = '';
    sortColumn = '';
    sortDirection = 'asc';
    isLoaded = false;
  
    ngOnInit(): void {
      this.loadDistricts();
      this.getStates();
    }
  
  loadDistricts(page: number = this.currentPage): void {

    this.currentPage = page;

    const params = {
      page: this.currentPage,
      per_page: this.pageSize,
      search: this.search,
      sort_column: this.sortColumn,
      sort_direction: this.sortDirection
    };

    this.userService.getDistricts(params).subscribe({

      next: (response) => {

        this.data = response.data.map((district: any, index: number) => ({
          orignalSeq: (this.currentPage - 1) * this.pageSize + index + 1,
          id: district.public_id,
          name_en: district.name_en,
          name_pb: district.name_pb,
          state: district.state,
          description_en: district.description_en,
          description_pb: district.description_pb,
          lgdstatecode: district.lgdstatecode,
          lgddistcode: district.lgddistcode,
          status: district.status,
          status_value: district.status == 1 ? 'Active' : 'In-active',
          created_at: this.formatDate(district.created_at),
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
    { key: 'state', label: 'State Name', widthClass: 'col-2', sortable: false },
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
          const parentField = this.districtSchema.fields?.find(
            f => f.name === 'lgdstatecode'
          );

          if (parentField) {
            parentField.options = [
              { label: 'Please select state', value: '' },
              ...parentOptions
            ];
          }
          const form = this.districtModal?.dynamicForm?.form;
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

    this.loadDistricts(page);

  }
  
  searchDistricts(text: string) {
    this.search = text;

    this.loadDistricts(1);

  }

  sortDistricts(event: any) {

    this.sortColumn = event.column;

    this.sortDirection = event.direction;

    this.loadDistricts(1);

  }
  
  openCreateModal() {
    this.isEditMode = false;
    this.districtId = null;

    this.modalHelper.openModal({
      modalRef: this.districtModal, 
      schema: this.districtSchema,
      submitLabel: 'Create District',
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

  openEditModal(district: any) {

    this.isEditMode = true;
    this.districtId = district.id;

    this.districtSchema.submitLabel = 'Update District';

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { id: this.districtId },
      queryParamsHandling: 'merge'
    }).then(() => {

      this.districtModal.open();

      setTimeout(() => {

        const form = this.districtModal?.dynamicForm?.form;

        if (!form) {
          return;
        }
        console.log('district', district);

        form.patchValue({
          name_en: district.name_en || '',
          name_pb: district.name_pb || '',
          description_en: district.description_en || '',
          description_pb: district.description_pb || '',
          lgdstatecode: district.lgdstatecode,
          lgddistcode: district.lgddistcode,
          status: district.status
        });

      }, 100);
    });
  }

  onPageSizeChange(size: number): void {
    this.pageSize = size;
    this.currentPage = 1;

    this.loadDistricts();
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
      lgddistcode: formData.lgddistcode,
      same_as_english_pb: formData.same_as_english_pb ?? null,
      status: formData.status,
      districtId: this.districtId ?? null,
    };

    if (this.isEditMode && this.districtId) {

      this.userService.updateDistrict(this.districtId, payload).subscribe({
        next: (res: any) => {
          this.toast.show('success', res.message || 'District updated successfully!', 4000);
          this.districtModal.close();
          this.loadDistricts();
        },
        error: (error: any) => {
          this.toast.show('error', error.error?.message || 'Failed to update district');
          console.error('Failed to update district:', error);
        }
      });

    } else {
       this.userService.createDistrict(payload).subscribe({
        next: (res: any) => {
          this.toast.show('success', res.message || 'District created successfully!', 4000);
          this.districtModal.close();
          this.loadDistricts();
        },
        error: (error: any) => {
          this.toast.show('error', error.error?.message || 'Failed to create district');
          console.error('Failed to create district:', error);
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
