import { ChangeDetectorRef, Component, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DocumentListComponent, TableColumn } from '../../../../shared/components/document-list/document-list.component';
import { DynamicFilterComponent } from '../../../../shared/components/dynamic-filter/dynamic-filter.component';
import { ModalFormComponent } from '../../../../shared/components/modal-form/modal-form.component';
import { AuthService } from '../../../../core/auth/auth.service';
import { OfficeHierarchyService } from '../../../../core/services/office-hierarchy.service';
import { ToastService } from '../../../../shared/services/toast.service';
import { additionalRoleFilterSchema, additionalRoleFormSchema } from './additional-roles-schema';

@Component({
  selector: 'app-additional-roles-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DocumentListComponent,
    DynamicFilterComponent,
    ModalFormComponent
  ],
  templateUrl: './additional-roles-list.component.html',
  styleUrls: ['./additional-roles-list.component.scss']
})
export class AdditionalRolesListComponent implements OnInit {
  private authService = inject(AuthService);
  private officeHierarchyService = inject(OfficeHierarchyService);
  private toast = inject(ToastService);
  private cdr = inject(ChangeDetectorRef);

  @ViewChild('roleModal') roleModal!: ModalFormComponent;

  // ── Schemas
  filterSchema = additionalRoleFilterSchema;
  formSchema = additionalRoleFormSchema;

  // ── Table Data & Pagination
  data: any[] = [];
  pagination = {
    current_page: 1,
    last_page: 1,
    per_page: 25,
    total: 0
  };

  search = '';
  sortColumn = '';
  sortDirection: 'asc' | 'desc' = 'desc';

  // ── Filter State
  filterValues: Record<string, any> = {};

  // ── Modal State
  isEditMode = false;
  editingId: string | null = null;
  formInitialData: any = {};

  // ── Table Column Definitions (Matches Screenshot 1)
  tableColumns: TableColumn[] = [
    { key: 'hrmscode', label: 'HRMS Code', widthClass: 'col-1', sortable: true },
    { key: 'email', label: 'Email', widthClass: 'col-2', sortable: true },
    { key: 'role_name', label: 'Role Name', widthClass: 'col-2', sortable: true },
    { key: 'office_name', label: 'Office Name', widthClass: 'col-3', sortable: false },
    { key: 'status_label', label: 'Status', widthClass: 'col-1', sortable: true },
    { key: 'action', label: 'Action', type: 'edit', widthClass: 'col-1' }
  ];

  ngOnInit(): void {
    this.loadDropdownOptions();
    this.loadAdditionalRoles();
  }

  // ── 1. Fetch Master Options for Form & Filter ──
  loadDropdownOptions(): void {
    // Office Levels
    this.authService.getAllOfficeHierarchy().subscribe({
      next: (res: any) => {
        const levels = (res.data || []).map((l: any) => ({ label: l.name_en, value: l.name_en }));
        this.updateFieldOptions(this.formSchema, 'officelevelcode', levels);
        this.updateFilterFieldOptions('officelevelcode', levels);
      }
    });

    // Circles
    this.authService.getAllCircles().subscribe({
      next: (res: any) => {
        const circles = (res.data || []).map((c: any) => ({ label: c.name_en, value: c.public_id }));
        this.updateFieldOptions(this.formSchema, 'circle_id', circles);
        this.updateFilterFieldOptions('circle_id', circles);
      }
    });

    // Users (HRMS Code - Name)
    this.authService.getUsers({ per_page: 1000 }).subscribe({
      next: (res: any) => {
        const users = (res.data || []).map((u: any) => ({
          label: `${u.hrmscode || ''} - ${u.name || ''}`,
          value: u.public_id
        }));
        this.updateFieldOptions(this.formSchema, 'user_id', users);
      }
    });

    // Roles
    this.authService.getRoles({}).subscribe({
      next: (res: any) => {
        const roleOptions: any[] = [];
        (res.data || []).forEach((cat: any) => {
          (cat.roles || []).forEach((r: any) => {
            roleOptions.push({ label: r.name, value: r.public_id });
          });
        });
        this.updateFieldOptions(this.formSchema, 'role_id', roleOptions);
      }
    });
  }

  // ── 2. Load List Data with Search & Filters ──
  loadAdditionalRoles(page: number = this.pagination.current_page): void {
    this.pagination.current_page = page;

    const params: any = {
      page: this.pagination.current_page,
      per_page: this.pagination.per_page,
      search: this.search,
      sort_column: this.sortColumn,
      sort_direction: this.sortDirection,
      ...this.filterValues
    };

    this.authService.getAdditionalRoles(params).subscribe({
      next: (res: any) => {
        this.data = (res.data || []).map((item: any, index: number) => ({
          orignalSeq: (this.pagination.current_page - 1) * this.pagination.per_page + index + 1,
          id: item.public_id,
          hrmscode: item.user?.hrmscode || '-',
          email: item.user?.email || '-',
          role_name: item.role?.name || '-',
          office_name: item.office?.office_description?.officename || item.office?.officename || '-',
          status_label: item.status === 1 ? 'Active' : 'Inactive',
          canEdit: true,
          raw: item
        }));

        if (res.pagination) {
          this.pagination = res.pagination;
        }
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Error loading additional roles:', err);
        this.toast.show('error', err.error?.message || 'Failed to load additional roles');
      }
    });
  }

  onSearch(): void {
    this.loadAdditionalRoles(1);
  }

  onPageSizeChange(size: number): void {
    this.pagination.per_page = size;
    this.loadAdditionalRoles(1);
  }

  sortRoles(event: any): void {
    this.sortColumn = event.column;
    this.sortDirection = event.direction;
    this.loadAdditionalRoles(1);
  }

  // ── 3. Dynamic Filter Handlers ──
  onFilter(values: Record<string, any>): void {
    this.filterValues = { ...values };
    this.loadAdditionalRoles(1);
  }

  resetFilter(): void {
    this.filterValues = {};
    this.loadAdditionalRoles(1);
  }

  onFilterFieldChange(event: { name: string; value: any }): void {
    if (event.name === 'circle_id') {
      const divField = this.filterSchema.find(f => f.name === 'division_id');
      const subField = this.filterSchema.find(f => f.name === 'subdivision_id');
      if (divField) { divField.options = []; divField.disabled = true; }
      if (subField) { subField.options = []; subField.disabled = true; }

      if (event.value) {
        this.authService.getDivisionsByCircle(event.value).subscribe((res: any) => {
          if (divField) {
            divField.options = (res.data || []).map((d: any) => ({ label: d.name_en, value: d.public_id }));
            divField.disabled = false;
            this.filterSchema = [...this.filterSchema];
            this.cdr.detectChanges();
          }
        });
      }
    } else if (event.name === 'division_id') {
      const subField = this.filterSchema.find(f => f.name === 'subdivision_id');
      if (subField) { subField.options = []; subField.disabled = true; }

      if (event.value) {
        this.authService.getSubdivisionsByDivision(event.value).subscribe((res: any) => {
          if (subField) {
            subField.options = (res.data || []).map((s: any) => ({ label: s.name_en, value: s.public_id }));
            subField.disabled = false;
            this.filterSchema = [...this.filterSchema];
            this.cdr.detectChanges();
          }
        });
      }
    }
  }

  // ── 4. Modal Cascading Dropdowns ──
  setupFormCascadingDropdowns(form?: any): void {
    const dynamicForm = form || this.roleModal?.dynamicForm?.form;
    if (dynamicForm) {
      const schemaFields = this.formSchema.steps?.[0]?.fields || [];
      this.officeHierarchyService.setupFormCascading(dynamicForm, schemaFields, this.cdr);
    }
  }

  // ── 5. Create & Edit Handlers ──
  openCreateModal(): void {
    this.isEditMode = false;
    this.editingId = null;
    this.formSchema.submitLabel = 'Create';
    this.formInitialData = {
      officelevelcode: '',
      circle_id: '',
      division_id: '',
      subdivision_id: '',
      officecode: '',
      user_id: '',
      role_id: '',
      status: 1
    };

    if (this.roleModal?.dynamicForm) {
      this.roleModal.dynamicForm.form.reset(this.formInitialData);
    }
    this.roleModal.open();
  }

  handleAction(event: any): void {
    if (event.action === 'edit' || event.actionName === 'edit') {
      this.openEditModal(event.row);
    }
  }

  openEditModal(row: any): void {
    this.isEditMode = true;
    this.editingId = row.id;
    this.formSchema.submitLabel = 'Update';

    const item = row.raw;
    this.formInitialData = {
      officelevelcode: item.office?.officelevel || item.office?.officelevelcode || '',
      circle_id: item.office?.circle_id || '',
      division_id: item.office?.division_id || '',
      subdivision_id: item.office?.subdivision_id || '',
      officecode: item.office?.public_id || item.officecode,
      user_id: item.user?.public_id || item.user_id,
      role_id: item.role?.public_id || item.role_id,
      status: item.status
    };


    if (this.roleModal?.dynamicForm) {
      this.roleModal.dynamicForm.form.reset(this.formInitialData);
    }
    this.roleModal.open();
  }

  onSubmit(formData: any): void {
    const payload = {
      officelevelcode: formData.officelevelcode,
      circle_id: formData.circle_id,
      division_id: formData.division_id,
      subdivision_id: formData.subdivision_id,
      officecode: formData.officecode,
      user_id: formData.user_id,
      role_id: formData.role_id,
      status: formData.status
    };

    if (this.isEditMode && this.editingId) {
      this.authService.updateAdditionalRole(this.editingId, payload).subscribe({
        next: () => {
          this.toast.show('success', 'Additional role updated successfully!', 4000);
          this.roleModal.close();
          this.loadAdditionalRoles();
        },
        error: (err: any) => {
          this.toast.show('error', err.error?.message || 'Failed to update additional role');
        }
      });
    } else {
      this.authService.createAdditionalRole(payload).subscribe({
        next: () => {
          this.toast.show('success', 'Additional role created successfully!', 4000);
          this.roleModal.close();
          this.loadAdditionalRoles(1);
        },
        error: (err: any) => {
          this.toast.show('error', err.error?.message || 'Failed to create additional role');
        }
      });
    }
  }

  // ── Helper Utilities ──
  private updateFieldOptions(schema: any, fieldName: string, options: any[]): void {
    const field = schema.steps?.[0]?.fields?.find((f: any) => f.name === fieldName);
    if (field) {
      field.options = options;
      this.cdr.detectChanges();
    }
  }

  private updateFilterFieldOptions(fieldName: string, options: any[]): void {
    const field = this.filterSchema.find(f => f.name === fieldName);
    if (field) {
      field.options = options;
      this.filterSchema = [...this.filterSchema];
      this.cdr.detectChanges();
    }
  }
}
