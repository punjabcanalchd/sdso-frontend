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

  loadRoles(): void {
    this.rolesService.getRoles({}).subscribe({
      next: (response) => {
        this.data = response.data.flatMap((category: any) =>
          category.roles.map((role: any) => ({
            id: role.public_id,
            name: role.name,
            category: category.name,
            canEdit: category.name === 'Admin'
          }))
        );

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
    { key: 'name', label: 'Name', widthClass: 'col-2' },
    { key: 'edit', label: 'Edit', type: 'edit', widthClass: 'col-3' }
  ];
}
