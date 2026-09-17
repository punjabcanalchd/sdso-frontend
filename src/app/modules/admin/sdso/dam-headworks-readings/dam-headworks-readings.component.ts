import { Component, OnInit, ChangeDetectorRef, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { DocumentListComponent, TableColumn } from '../../../../shared/components/document-list/document-list.component';
import { AuthService } from '../../../../core/auth/auth.service';
import { DamHeadWorksReadings } from '../../../../core/models/dam-headworks-readings.model';
import { ModalFormComponent } from '../../../../shared/components/modal-form/modal-form.component';
import { ToastService } from '../../../../shared/services/toast.service';
import { DamHeadWorksReadingsSchema } from './dam-headworks-readings.schema';
import { ModalHelperService } from '../../../../shared/services/modal-helper';

@Component({
  selector: 'app-dam-headworks-readings',
  imports: [DocumentListComponent, ModalFormComponent, CommonModule],
  templateUrl: './dam-headworks-readings.component.html',
  styleUrl: './dam-headworks-readings.component.scss',
})
export class DamHeadworksReadingsComponent  implements OnInit {

  constructor(private userService: AuthService, private cdr: ChangeDetectorRef) { }

  @ViewChild(ModalFormComponent) damHeadWorksReadingsModal!: ModalFormComponent;

  private toast = inject(ToastService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private modalHelper = inject(ModalHelperService);

  data: DamHeadWorksReadings[] = [];
  formInitialData: any = {};
  isEditMode = false;
  damId: string | null = null;
  headWorks: any[] = [];

  DamHeadWorksReadingsSchema = DamHeadWorksReadingsSchema;

  damInitialData: any = {};
  isDamLoading: boolean = false;

  currentPage = 1;
  pageSize = 25;
  pagination: any = {};
  search = '';
  sortColumn = 'readingdate';
  sortDirection = 'desc';
  isLoaded = false;

  ngOnInit(): void {
    this.loadDamHeadWorksReadings();
    this.loadDamHeadWorks();
  }

  openCreateModal() {
    this.isEditMode = false;
    this.damId = null;

    this.modalHelper.openModal({
      modalRef: this.damHeadWorksReadingsModal, 
      schema: this.DamHeadWorksReadingsSchema,
      submitLabel: 'Create DAM/ HeadWorks Readings',
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

    this.DamHeadWorksReadingsSchema.submitLabel = 'Update Dam/ HeadWorks Readings';

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { id: this.damId },
      queryParamsHandling: 'merge'
    }).then(() => {

      this.damHeadWorksReadingsModal.open();

      setTimeout(() => {

        const form = this.damHeadWorksReadingsModal?.dynamicForm?.form;

        if (!form) {
          return;
        }
        form.patchValue({
          damhwcode: DamHeadWorks.damhwcode,
          inflow: DamHeadWorks.inflow,
          outflow: DamHeadWorks.outflow,
          waterlevel: DamHeadWorks.waterlevel,
          readingdate: DamHeadWorks.readingdate,
          start_time: DamHeadWorks.start_time,
        });

    }, 100);

    });
  }


  loadDamHeadWorksReadings(page: number = this.currentPage): void {

    this.currentPage = page;

    const params = {
      page: this.currentPage,
      per_page: this.pageSize,
      search: this.search,
      sort_column: this.sortColumn,
      sort_direction: this.sortDirection
    };

    this.userService.getDamHeadWorksReadings(params).subscribe({

      next: (response) => {

        this.data = response.data.map((dam: any, index: number) => ({
          orignalSeq: (this.currentPage - 1) * this.pageSize + index + 1,
          id: dam.public_id,
          damhwname: dam.damhwname,
          damhwcode: dam.damhwcode,
          inflow: dam.inflow,
          outflow: dam.outflow,
          waterlevel: dam.waterlevel,
          created_by: dam.created_by,
          readingdate: dam.readingdate,
          start_time: dam.start_time,
          role: dam.role,
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

  loadDamHeadWorks(): void {
    const params = {};
    this.userService.getAllDamHeadWorks(params).subscribe({
      next: (response) => {
          this.headWorks = response;
          const states = response.data || [];
          const parentOptions = states.map((Dam: any) => ({
            label: Dam.name_en,
            value: String(Dam.public_id)
          }));
          const parentField = this.DamHeadWorksReadingsSchema.fields?.find(
            f => f.name === 'damhwcode'
          );

          if (parentField) {
            parentField.options = [
              { label: 'Please select dam/headworks', value: '' },
              ...parentOptions
            ];
          }
          const form = this.damHeadWorksReadingsModal?.dynamicForm?.form;
          form.get('damhwcode')?.setValue('');
          this.isLoaded = true;
          this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading dam/headworks:', error);
      }
    });
  }

  tableColumns: TableColumn[] = [
    { key: 'damhwname', label: 'Dam/ Headworks Name', widthClass: 'col-2', sortable: true },
    { key: 'inflow', label: 'Water Inflow (in cucecs) ', widthClass: 'col-2', sortable: true },
    { key: 'outflow', label: 'Water Outflow (in cucecs) ', widthClass: 'col-2', sortable: true },
    { key: 'waterlevel', label: 'Water Level (in meters) ', widthClass: 'col-2', sortable: true },
    { key: 'created_by', label: 'Created By', widthClass: 'col-2', sortable: false },
    { key: 'role', label: 'Role', widthClass: 'col-2', sortable: false },
    { key: 'readingdate', label: 'Reading Date', widthClass: 'col-2', sortable: false },
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

    this.loadDamHeadWorksReadings(page);

  }

  searchDamHeadWorksReadings(text: string) {
    this.search = text;

    this.loadDamHeadWorksReadings(1);

  }

  sortDamHeadWorksReadings(event: any) {

    this.sortColumn = event.column;

    this.sortDirection = event.direction;

    this.loadDamHeadWorksReadings(1);

  }

  onPageSizeChange(size: number): void {
    this.pageSize = size;
    this.currentPage = 1;

    this.loadDamHeadWorksReadings(1);
  }

  onSubmit(formData: any): void {

    const payload = {
      damhwcode: formData.damhwcode,
      inflow: formData.inflow,
      outflow: formData.outflow,
      waterlevel: formData.waterlevel,
      readingdate: formData.readingdate,
      start_time: formData.start_time,
      damId: this.damId ?? null,
    };

    if (this.isEditMode && this.damId) {

      this.userService.updateDamHeadWorksReading(this.damId, payload).subscribe({
        next: (res: any) => {

          this.toast.show(
            'success',
            res.message || 'DAM/ HeadWorks Reading updated successfully!',
            4000
          );

          this.damHeadWorksReadingsModal.close();
          this.loadDamHeadWorksReadings(1);
        },

        error: (error: any) => {

          this.toast.show(
            'error',
            error.error?.message || 'Failed to update DAM/ HeadWorks Reading'
          );

          console.error('Failed to update DAM/ HeadWorks Reading:', error);
        }
      });

    } else {

      this.userService.createDamHeadWorksReading(payload).subscribe({
        next: (res: any) => {

          this.toast.show(
            'success',
            res.message || 'DAM/ HeadWorks Reading created successfully!',
            4000
          );

          this.damHeadWorksReadingsModal.close();
          this.loadDamHeadWorksReadings(1);
        },

        error: (error: any) => {

          this.toast.show(
            'error',
            error.error?.message || 'Failed to create DAM/ HeadWorks Reading'
          );

          console.error('Failed to create DAM/ HeadWorks Reading:', error);
        }
      });
    }
  }

  handleAction(event: any): void {
    if (event.action === 'edit' || event.actionName === 'edit') {
        this.openEditModal(event.row);
    }
  }



}
