import { Component, Input, forwardRef, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

@Component({
  selector: 'app-role-assignment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './role-assignment.component.html',
  styleUrls: ['./role-assignment.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RoleAssignmentComponent),
      multi: true
    }
  ]
})
export class RoleAssignmentComponent implements ControlValueAccessor {
  private cdr = inject(ChangeDetectorRef);

  categoriesData: any[] = [];

  @Input() set roles(val: any[]) {
    this.categoriesData = val || [];
    // Set first category active by default if available
    if (this.categoriesData.length > 0 && !this.activeCategory) {
      this.activeCategory = this.categoriesData[0].name;
    }
    this.cdr.detectChanges();
  }

  activeCategory: string = '';

  // Value schema held by the control
  value: { role_id: string | null; selected_roles: string[] } = {
    role_id: null,
    selected_roles: []
  };

  disabled = false;

  onChange: any = () => {};
  onTouched: any = () => {};

  get categories(): string[] {
    return this.categoriesData.map(cat => cat.name);
  }

  getRolesByCategory(categoryName: string): any[] {
    const category = this.categoriesData.find(cat => cat.name === categoryName);
    return category ? (category.roles || []) : [];
  }

  getCategoryIcon(category: string): string {
    switch (category) {
      case 'Admin':
      case 'Administration':
        return 'bi bi-shield-lock';
      case 'Content Management':
        return 'bi bi-file-earmark-text';
      case 'Reports':
      case 'Reporting & Analytics':
        return 'bi bi-graph-up';
      case 'Account':
      case 'Finance':
        return 'bi bi-cash-stack';
      default:
        return 'bi bi-person-badge';
    }
  }

  getRoleLabel(roleValue: string): string {
    for (const cat of this.categoriesData) {
      const role = (cat.roles || []).find((r: any) => r.public_id === roleValue);
      if (role) {
        return role.name;
      }
    }
    return roleValue;
  }

  selectCategory(category: string) {
    this.activeCategory = category;
  }

  onRoleToggle(roleValue: string, checked: boolean) {
    if (this.disabled) return;

    let selected = [...this.value.selected_roles];
    if (checked) {
      if (!selected.includes(roleValue)) {
        selected.push(roleValue);
      }
    } else {
      selected = selected.filter(val => val !== roleValue);
    }

    let primary = this.value.role_id;
    // Auto-reset primary if the deselected role was primary
    if (!checked && primary === roleValue) {
      primary = selected.length > 0 ? selected[0] : null;
    }
    // Auto-set primary if none 
    if (checked && !primary) {
      primary = roleValue;
    }

    this.value = {
      role_id: primary,
      selected_roles: selected
    };

    this.onChange(this.value);
    this.onTouched();
    this.cdr.detectChanges();
  }

  onPrimaryRoleSelect(roleValue: string | null) {
    if (this.disabled) return;

    this.value = {
      ...this.value,
      role_id: roleValue
    };

    this.onChange(this.value);
    this.onTouched();
    this.cdr.detectChanges();
  }

  removeRole(roleValue: string) {
    this.onRoleToggle(roleValue, false);
  }

  clearSelection() {
    if (this.disabled) return;

    this.value = {
      role_id: null,
      selected_roles: []
    };

    this.onChange(this.value);
    this.onTouched();
    this.cdr.detectChanges();
  }

  writeValue(value: any): void {
    if (value) {
      this.value = {
        role_id: value.role_id || null,
        selected_roles: value.selected_roles || []
      };
    } else {
      this.value = { role_id: null, selected_roles: [] };
    }
    this.cdr.detectChanges();
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.cdr.detectChanges();
  }

  trackByRole(index: number, role: string) {
    return role;
  }
}
