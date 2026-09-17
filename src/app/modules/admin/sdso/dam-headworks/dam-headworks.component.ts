import { Component, OnInit, ChangeDetectorRef, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { DocumentListComponent, TableColumn } from '../../../../shared/components/document-list/document-list.component';
import { AuthService } from '../../../../core/auth/auth.service';
import { DamHeadWorks } from '../../../../core/models/dam-headworks.model';
import { ModalFormComponent } from '../../../../shared/components/modal-form/modal-form.component';
import { ToastService } from '../../../../shared/services/toast.service';
import { DamHeadWorksSchema } from './dam-headworks.schema';
import { ModalHelperService } from '../../../../shared/services/modal-helper';

@Component({
  selector: 'app-dam-headworks',
  imports: [DocumentListComponent, ModalFormComponent, CommonModule],
  templateUrl: './dam-headworks.component.html',
  styleUrl: './dam-headworks.component.scss',
})
export class DamHeadworksComponent implements OnInit {

  constructor(private userService: AuthService, private cdr: ChangeDetectorRef) { }

  @ViewChild(ModalFormComponent) damHeadWorksModal!: ModalFormComponent;

  private toast = inject(ToastService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private modalHelper = inject(ModalHelperService);

  data: DamHeadWorks[] = [];
  formInitialData: any = {};
  allDamHeadWorksList: any[] = [];
  states: any[] = [];
  districts: any[] = [];
  offices: any[] = [];
  isEditMode = false;
  damId: string | null = null;

  DamHeadWorksSchema = DamHeadWorksSchema;
  updatingDamHeadWorksId: string | null = null;


  damInitialData: any = {};
  isDamLoading: boolean = false;

  currentPage = 1;
  pageSize = 25;
  pagination: any = {};
  search = '';
  sortColumn = '';
  sortDirection = 'asc';
  isLoaded = false;

  ngOnInit(): void {
    this.loadDamHeadWorks();
    this.getStates();
  }

  openCreateModal() {
    this.isEditMode = false;
    this.damId = null;

    this.modalHelper.openModal({
      modalRef: this.damHeadWorksModal, 
      schema: this.DamHeadWorksSchema,
      submitLabel: 'Create DAM/ HeadWorks',
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

  openEditModal(DamHeadWorks: any) {

    this.isEditMode = true;
    this.damId = DamHeadWorks.id;

    this.DamHeadWorksSchema.submitLabel = 'Update Dam/ HeadWorks';

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { id: this.damId },
      queryParamsHandling: 'merge'
    }).then(() => {

      this.damHeadWorksModal.open();

      setTimeout(() => {

        const form = this.damHeadWorksModal?.dynamicForm?.form;

        if (!form) {
          return;
        }
        console.log('DamHeadWorks', DamHeadWorks);
        form.patchValue({
          name_en: DamHeadWorks.name_en || '',
          name_pb: DamHeadWorks.name_pb || '',
          description_en: DamHeadWorks.description_en || '',
          description_pb: DamHeadWorks.description_pb || '',
          lgdstatecode: DamHeadWorks.lgdstatecode,
          lgddistcode: DamHeadWorks.lgddistcode,
          district: DamHeadWorks.district,
          office: DamHeadWorks.office,
          startlat: DamHeadWorks.startlat,
          startlong: DamHeadWorks.startlong,
          officecode: DamHeadWorks.officecode,
          entitycode: DamHeadWorks.entitycode,
          status: DamHeadWorks.status
        });


      // Load dependent dropdowns
      this.loadEditDropdowns(DamHeadWorks);

    }, 100);

    });
  }

private loadEditDropdowns(damHeadWorks: any): void {

  const form = this.damHeadWorksModal?.dynamicForm?.form;

  // Load districts
  this.userService
    .getDistrictsByState(
      damHeadWorks.lgdstatecode,
      { state_id: damHeadWorks.lgdstatecode }
    )
    .subscribe({

      next: (response) => {

        const districts = response.data || [];

        const districtOptions = districts.map((district: any) => ({
          label: district.name_en,
          value: String(district.lgddistcode_enc)
        }));

        const districtField = this.DamHeadWorksSchema.fields?.find(
          f => f.name === 'lgddistcode'
        );

        if (districtField) {
          districtField.options = [
            { label: 'Please select district', value: '' },
            ...districtOptions
          ];
        }

        // Set selected district AFTER options are loaded
        form.patchValue({
          lgddistcode: damHeadWorks.lgddistcode
        });

        // Now load offices
        this.userService
          .getOfficesByDistrict(
            damHeadWorks.lgddistcode,
            {}
          )
          .subscribe({

            next: (officeResponse) => {

              const offices = officeResponse.data || [];

              const officeOptions = offices.map((office: any) => ({
                label: office.name_en,
                value: String(office.public_id)
              }));

              const officeField = this.DamHeadWorksSchema.fields?.find(
                f => f.name === 'officecode'
              );

              if (officeField) {
                officeField.options = [
                  { label: 'Please select office', value: '' },
                  ...officeOptions
                ];
              }

              // Set selected office AFTER options are loaded
              form.patchValue({
                officecode: damHeadWorks.officecode
              });

              this.cdr.detectChanges();
            },

            error: (error: any) => {
              console.error('Error loading offices:', error);
            }

          });
      },

      error: (error: any) => {
        console.error('Error loading districts:', error);
      }

    });
}

  loadDamHeadWorks(page: number = this.currentPage): void {

    this.currentPage = page;

    const params = {
      page: this.currentPage,
      per_page: this.pageSize,
      search: this.search,
      sort_column: this.sortColumn,
      sort_direction: this.sortDirection
    };

    this.userService.getDamHeadWorks(params).subscribe({

      next: (response) => {

        this.data = response.data.map((dam: any, index: number) => ({
          orignalSeq: (this.currentPage - 1) * this.pageSize + index + 1,
          id: dam.public_id,
          name_en: dam.name_en,
          name_pb: dam.name_pb,
          description_en: dam.description_en,
          description_pb: dam.description_pb,
          lgdstatecode: dam.lgdstatecode,
          lgddistcode: dam.lgddistcode,
          district: dam.district,
          office: dam.office,
          startlat: dam.startlat,
          startlong: dam.startlong,
          officecode: dam.officecode,
          entitycode: dam.entitycode,
          status: dam.status,
          status_value: dam.status == 1 ? 'Active' : 'In-active',
          created_at: this.formatDate(dam.created_at),
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

  getStates(): void {
    const params = {};
    this.userService.getAllStates(params).subscribe({
      next: (response) => {
          this.states = response;
          const states = response.data || [];
          const parentOptions = states.map((state: any) => ({
            label: state.name_en,
            value: String(state.lgdstatecode_enc)
          }));
          console.log(parentOptions);
          const parentField = this.DamHeadWorksSchema.fields?.find(
            f => f.name === 'lgdstatecode'
          );

          if (parentField) {
            parentField.options = [
              { label: 'Please select state', value: '' },
              ...parentOptions
            ];
          }
          const form = this.damHeadWorksModal?.dynamicForm?.form;
          form.get('lgdstatecode')?.setValue('');
          this.isLoaded = true;
          this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading states:', error);
      }
    });
  }

  getDistricts(stateId: string): void {
    const params = { state_id: stateId };
    this.userService.getDistrictsByState(stateId, params).subscribe({
      next: (response) => {
          this.districts = response;
          const districts = response.data || [];
          const parentOptions = districts.map((district: any) => ({
            label: district.name_en,
            value: String(district.lgddistcode_enc)
          }));
          console.log(parentOptions);
          const parentField = this.DamHeadWorksSchema.fields?.find(
            f => f.name === 'lgddistcode'
          );

          if (parentField) {
            parentField.options = [
              { label: 'Please select district', value: '' },
              ...parentOptions
            ];
          }
          const form = this.damHeadWorksModal?.dynamicForm?.form;
          form.get('lgddistcode')?.setValue('');
          this.isLoaded = true;
          this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading districts:', error);
      }
    });
  }

  getOffices(districtID: string): void {
    const params = {};
    this.userService.getOfficesByDistrict(districtID, params).subscribe({
      next: (response) => {
          this.offices = response;
          const offices = response.data || [];
          const parentOptions = offices.map((office: any) => ({
            label: office.name_en,
            value: String(office.public_id)
          }));
          console.log(parentOptions);
          const parentField = this.DamHeadWorksSchema.fields?.find(
            f => f.name === 'officecode'
          );

          if (parentField) {
            parentField.options = [
              { label: 'Please select office', value: '' },
              ...parentOptions
            ];
          }
          const form = this.damHeadWorksModal?.dynamicForm?.form;
          form.get('officecode')?.setValue('');
          this.isLoaded = true;
          this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading offices:', error);
      }
    });
  }

  tableColumns: TableColumn[] = [
    { key: 'name_en', label: 'Name EN', widthClass: 'col-2', sortable: true },
    { key: 'name_pb', label: 'Name PB', widthClass: 'col-2', sortable: true },
    { key: 'startlat', label: ' Start Latitude', widthClass: 'col-2', sortable: true },
    { key: 'startlong', label: 'Start Longitude', widthClass: 'col-2', sortable: true },
    { key: 'district', label: 'District', widthClass: 'col-2', sortable: false },
    { key: 'office', label: 'Office', widthClass: 'col-2', sortable: false },
    { key: 'entitycode', label: 'Entity Type', widthClass: 'col-2', sortable: false },
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

    this.loadDamHeadWorks(page);

  }

  searchDamHeadWorks(text: string) {
    this.search = text;

    this.loadDamHeadWorks(1);

  }

  sortDamHeadWorks(event: any) {

    this.sortColumn = event.column;

    this.sortDirection = event.direction;

    this.loadDamHeadWorks(1);

  }

  onPageSizeChange(size: number): void {
    this.pageSize = size;
    this.currentPage = 1;

    this.loadDamHeadWorks();
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
      officecode: formData.officecode,
      startlat: formData.startlat,
      startlong: formData.startlong,
      entitycode: formData.entitycode,
      same_as_english_pb: formData.same_as_english_pb ?? null,
      status: formData.status,
      damId: this.damId ?? null,
    };

    if (this.isEditMode && this.damId) {

      this.userService.updateDamHeadWorks(this.damId, payload).subscribe({
        next: (res: any) => {

          this.toast.show(
            'success',
            res.message || 'DAM/ HeadWorks updated successfully!',
            4000
          );

          this.damHeadWorksModal.close();
          this.loadDamHeadWorks();
        },

        error: (error: any) => {

          this.toast.show(
            'error',
            error.error?.message || 'Failed to update DAM/ HeadWorks'
          );

          console.error('Failed to update DAM/ HeadWorks:', error);
        }
      });

    } else {

      this.userService.createDamHeadWorks(payload).subscribe({
        next: (res: any) => {

          this.toast.show(
            'success',
            res.message || 'DAM/ HeadWorks created successfully!',
            4000
          );

          this.damHeadWorksModal.close();
          this.loadDamHeadWorks();
        },

        error: (error: any) => {

          this.toast.show(
            'error',
            error.error?.message || 'Failed to create DAM/ HeadWorks'
          );

          console.error('Failed to create DAM/ HeadWorks:', error);
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
    console.log('event', event);
    if (event.action === 'edit' || event.actionName === 'edit') {
        this.openEditModal(event.row);
    }
  }

  onSelectChange(event: any): void {

    if (event.field.name === 'lgdstatecode') {
      const stateID = event.value;
      this.getDistricts(stateID);
    } else if (event.field.name === 'lgddistcode') {
      const districtID = event.value;
      this.getOffices(districtID);
    }
  }



}
