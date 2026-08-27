import { Component, OnInit, OnDestroy, forwardRef, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NG_VALUE_ACCESSOR, ControlValueAccessor, ControlContainer, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../../core/auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-custom-permission',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './custom-permission.component.html',
  styleUrls: ['./custom-permission.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomPermissionComponent),
      multi: true
    }
  ]
})
export class CustomPermissionComponent implements OnInit, OnDestroy, ControlValueAccessor {
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);
  private controlContainer = inject(ControlContainer, { optional: true });
  private route = inject(ActivatedRoute, { optional: true });

  permissionsList: any[] = [];
  searchTerm: string = '';
  selectedPermissionIds: number[] = [];

  private searchSubscription?: Subscription;
  private selectAllSubscription?: Subscription;
  private queryParamsSubscription?: Subscription;

  get parentFormGroup(): FormGroup | null {
    return this.controlContainer?.control as FormGroup;
  }

  private updateParentSelectAllCheckbox() {
    const parent = this.parentFormGroup;
    if (parent) {
      const selectAllCtrl = parent.get('selectAll');
      if (selectAllCtrl) {
        const total = this.permissionsList.flatMap(c => c.permissions).length;
        const selected = this.selectedPermissionIds.length;
        const isAllSelected = total > 0 && selected === total;
        selectAllCtrl.setValue(isAllSelected, { emitEvent: false });
      }
    }
  }

  get filteredPermissionsList() {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) {
      return this.permissionsList;
    }
    return this.permissionsList
      .map(cat => {
        const matchesCategory = cat.category.toLowerCase().includes(term);
        const filteredPerms = cat.permissions.filter((perm: any) =>
          perm.name.toLowerCase().includes(term)
        );

        if (matchesCategory) {
          return cat;
        } else if (filteredPerms.length > 0) {
          return {
            ...cat,
            permissions: filteredPerms
          };
        }
        return null;
      })
      .filter((cat): cat is any => cat !== null);
  }


  onChange: any = () => { };
  onTouched: any = () => { };

  onBlurDismiss(event: FocusEvent, permission: any) {
    const currentTarget = event.currentTarget as HTMLElement;
    const relatedTarget = event.relatedTarget as HTMLElement;

    if (!currentTarget.contains(relatedTarget)) {
      permission.showCrudPopover = false;
    }
  }

  toggleCrudPopover(clickedPerm: any) {
    const targetState = !clickedPerm.showCrudPopover;

    // Close other popovers
    this.permissionsList.forEach(cat => {
      cat.permissions.forEach((perm: any) => {
        perm.showCrudPopover = false;
      });
    });

    // Toggle the clicked popover
    clickedPerm.showCrudPopover = targetState;
  }

  ngOnInit() {
    this.queryParamsSubscription = this.route?.queryParamMap.subscribe(params => {
      const id = params.get('id');
      this.loadPermissionsTree(id);
    });

    const parent = this.parentFormGroup;
    if (parent) {
      const searchCtrl = parent.get('search');
      if (searchCtrl) {
        this.searchSubscription = searchCtrl.valueChanges.subscribe(val => {
          this.searchTerm = val || '';
          this.cdr.detectChanges();
        });
      }

      const selectAllCtrl = parent.get('selectAll');
      if (selectAllCtrl) {
        this.selectAllSubscription = selectAllCtrl.valueChanges.subscribe(val => {
          if (val) {
            this.selectAll();
          } else {
            this.deselectAll();
          }
        });
      }
    }
  }

  ngOnDestroy() {
    this.searchSubscription?.unsubscribe();
    this.selectAllSubscription?.unsubscribe();
    this.queryParamsSubscription?.unsubscribe();
  }

  loadPermissionsTree(roleId?: string | number | null) {
    const activeRoleId = roleId !== undefined ? roleId : (this.route?.snapshot.paramMap.get('id') || this.route?.snapshot.queryParamMap.get('id'));
    const apiCall = activeRoleId
      ? this.authService.getRolePermissionsTree(activeRoleId)
      : this.authService.getPermissions({});

    apiCall.subscribe({
      next: (response) => {
        if (response && response.data) {
          this.permissionsList = response.data.map((module: any) => ({
            category: module.name,
            icon: module.icon === 'mobile' ? 'bi-phone' : `bi-${module.icon || 'layers'}`,
            permissions: (module.children || []).map((child: any) => ({
              id: child.public_id,
              name: child.name,
              showCrudPopover: false,
              rawPermissions: child.permissions || [],
              allowedActions: (child.permissions || []).map((p: any) => p.label),
              crudActions: (child.permissions || []).reduce((acc: any, p: any) => {
                acc[p.label] = p.checked || false;
                return acc;
              }, {})
            }))
          }));

          // Pre-populate selected permission IDs
          const preselectedIds: number[] = [];
          this.permissionsList.forEach(cat => {
            cat.permissions.forEach((perm: any) => {
              const hasChecked = Object.values(perm.crudActions).some(v => v === true);
              if (hasChecked) {
                preselectedIds.push(perm.id);
              }
            });
          });
          this.selectedPermissionIds = preselectedIds;

          this.cdr.detectChanges();
          this.updateParentSelectAllCheckbox();
          this.propagateChanges();
        }
      },
      error: (err) => {
        console.error('Error fetching permissions:', err);
      }
    });
  }

   togglePermission(id: number) {
    // Determine if we are checking or unchecking the box
    const isNowSelected = !this.selectedPermissionIds.includes(id);

    if (isNowSelected) {
      this.selectedPermissionIds.push(id);
    } else {
      this.selectedPermissionIds = this.selectedPermissionIds.filter(x => x !== id);
    }

    // Find the specific permission and update its CRUD actions to match the new state
    this.permissionsList.forEach(cat => {
      cat.permissions.forEach((perm: any) => {
        if (perm.id === id) {
          Object.keys(perm.crudActions).forEach(action => {
            perm.crudActions[action] = isNowSelected;
          });
        }
      });
    });

    this.propagateChanges();
  }


  toggleCrudAction(permission: any, action: string): void {
    permission.crudActions[action] = !permission.crudActions[action];
    this.propagateChanges();
  }

  selectAll() {
    const allIds = [...this.selectedPermissionIds];
    this.filteredPermissionsList.forEach(cat => {
      cat.permissions.forEach((perm: any) => {
        if (!allIds.includes(perm.id)) {
          allIds.push(perm.id);
        }
        Object.keys(perm.crudActions).forEach(action => {
          perm.crudActions[action] = true;
        });
      });
    });
    this.selectedPermissionIds = allIds;
    this.propagateChanges();
    this.cdr.detectChanges();
  }

  deselectAll() {
    const visibleIds = this.filteredPermissionsList.flatMap(cat => cat.permissions.map((p: any) => p.id));
    this.selectedPermissionIds = this.selectedPermissionIds.filter(id => !visibleIds.includes(id));
    this.propagateChanges();
    this.filteredPermissionsList.forEach(cat => {
      cat.permissions.forEach((perm: any) => {
        Object.keys(perm.crudActions).forEach(action => {
          perm.crudActions[action] = false;
        });
      });
    });
    this.cdr.detectChanges();
  }

  private propagateChanges() {
    const selectedSlugs: string[] = [];
    this.permissionsList.flatMap(c => c.permissions).forEach(p => {
      if (this.selectedPermissionIds.includes(p.id)) {
        p.rawPermissions.forEach((rawPerm: any) => {
          if (p.crudActions[rawPerm.label] === true) {
            selectedSlugs.push(rawPerm.slug);
          }
        });
      }
    });

    const fullFormOutput = {
      moduleIds: this.selectedPermissionIds,
      scopes: this.permissionsList
        .flatMap(c => c.permissions)
        .filter(p => this.selectedPermissionIds.includes(p.id))
        .map(p => ({
          id: p.id,
          actions: p.crudActions
        })),
      slugs: selectedSlugs
    };
    this.onChange(fullFormOutput);
    this.updateParentSelectAllCheckbox();
  }

  writeValue(value: any): void {
    if (value && value.moduleIds) {
      this.selectedPermissionIds = value.moduleIds || [];
    } else if (Array.isArray(value)) {
      this.selectedPermissionIds = value;
    } else if (value === null || value === undefined) {
      if (this.selectedPermissionIds.length === 0) {
        this.selectedPermissionIds = [];
      }
    }
    this.updateParentSelectAllCheckbox();
  }

  registerOnChange(fn: any): void { this.onChange = fn; }
  registerOnTouched(fn: any): void { this.onTouched = fn; }
}