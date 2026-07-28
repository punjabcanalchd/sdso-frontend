import { ChangeDetectorRef, Component, OnInit, ViewChild, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DocumentListComponent, TableColumn } from '../../../../../shared/components/document-list/document-list.component';
import { AuthService } from '../../../../../core/auth/auth.service';
import { ModalFormComponent } from '../../../../../shared/components/modal-form/modal-form.component';
import { ToastService } from '../../../../../shared/services/toast.service';
import { roleSchema } from './role-form.schema';
import { ModalHelperService } from '../../../../../shared/services/modal-helper';

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [DocumentListComponent, ModalFormComponent],
  templateUrl: './roles-list.component.html',
  styleUrl: './roles-list.component.scss',
})
export class Roles implements OnInit {
  constructor(
    private rolesService: AuthService, 
    private cdr: ChangeDetectorRef
  ) { }

  @ViewChild(ModalFormComponent) roleModal!: ModalFormComponent;

  private toast = inject(ToastService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private modalHelper = inject(ModalHelperService);

  data: any[] = [];
  formInitialData: any = {};
  isEditMode = false;
  roleId: string | null = null;

  currentPage = 1;
  pageSize = 25;
  pagination: any = {};
  search = '';
  sortColumn = '';
  sortDirection = 'asc';

  roleSchema = roleSchema;

  ngOnInit(): void {
    this.loadRoles();
  }

    openCreateModal() {
    this.isEditMode = false;
    this.roleId = null;

    this.modalHelper.openModal({
      modalRef: this.roleModal, 
      schema: this.roleSchema,
      submitLabel: 'Create Role',
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

  openEditModal(role: any) {
    this.isEditMode = true;
    this.roleId = role.id;
    this.roleSchema.submitLabel = 'Update Role';
    
    if (this.roleModal?.dynamicForm) {
      this.roleModal.dynamicForm.form.reset({
        name: role.name,
        search: '',
        selectAll: false,
        permissions: { slugs: [] }
      });
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { id: this.roleId },
      queryParamsHandling: 'merge'
    }).then(() => {
      this.roleModal.open();
    }); 
  }

  handleAction(event: any) {
    console.log('Action event:', event);
    if (event.action === 'edit' || event.actionName === 'edit') {
      this.openEditModal(event.row);
    }
  }

  loadRoles(page: number = this.currentPage): void {
    this.currentPage = page;

    const params = {
      page: this.currentPage,
      per_page: this.pageSize,
      search: this.search,
      sort_column: this.sortColumn,
      sort_direction: this.sortDirection
    };
    this.rolesService.getRoles(params).subscribe({
      next: (response) => {
        this.data = response.data.flatMap((category: any) =>
          category.roles.map((role: any, index: number) => ({
              orignalSeq: (this.currentPage - 1) * this.pageSize + index + 1, // will update below
              id: role.public_id,
              name: role.name,
              category: category.name,
              canEdit: role.name !== 'Super Admin'
          }))
      );

        this.pagination = response.pagination;

        this.currentPage = response.pagination.current_page;

        this.pageSize = response.pagination.per_page;

        this.cdr.detectChanges();
      }
    });
  }

  onSubmit(formData: any) {
    const { search, selectAll, permissions, ...payload } = formData;
    const slugs = permissions?.slugs || [];

    if (this.isEditMode && this.roleId) {
      this.rolesService.updateRole(this.roleId, payload).subscribe({
        next: () => {
          this.rolesService.syncRolePermissions(this.roleId!, slugs).subscribe({
            next: () => {
              this.toast.show('success', 'Role and permissions updated successfully!', 4000);
              this.roleModal.close();
              this.loadRoles();
            },
            error: (err: any) => {
              this.toast.show('error', err.error?.message || 'Failed to sync permissions');
            }
          });
        },
        error: (error: any) => {
          this.toast.show('error', error.error?.message || 'Failed to update role');
        }
      });
    } else {
      this.rolesService.createRole(payload).subscribe({
        next: (res: any) => {
          const newRoleId = res.data.public_id;
          this.rolesService.syncRolePermissions(newRoleId, slugs).subscribe({
            next: () => {
              this.toast.show('success', 'Role and permissions created successfully!', 4000);
              this.roleModal.close();
              this.loadRoles();
            },
            error: (err: any) => {
              this.toast.show('error', err.error?.message || 'Failed to sync permissions');
            }
          });
        },
        error: (error: any) => {
          this.toast.show('error', error.error?.message || 'Failed to create role');
        }
      });
    }
  }

  tableColumns: TableColumn[] = [
    { key: 'name', label: 'Name', widthClass: 'col-2', sortable: true },
    { key: 'edit', label: 'Edit', type: 'edit', widthClass: 'col-3' }
  ];

  changePage(page: number) {

    this.loadRoles(page);

  }

  searchRoles(text: string) {
    this.search = text;

    this.loadRoles(1);

  }

  sortRoles(event: any) {

    this.sortColumn = event.column;

    this.sortDirection = event.direction;

    this.loadRoles(1);

  }
}
