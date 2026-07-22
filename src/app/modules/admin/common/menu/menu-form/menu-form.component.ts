import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../../../core/services/api.service';
import { ToastService } from '../../../../../shared/services/toast.service';
import { FormSchema } from '../../../../../core/models/form-schema.model';
import { AdminFormLayoutComponent } from '../../../components/admin-form-layout/admin-form-layout.component';

@Component({
  selector: 'app-menu-form',
  standalone: true,
  imports: [CommonModule,  AdminFormLayoutComponent],
  templateUrl: './menu-form.component.html'
})
export class MenuFormComponent implements OnInit {
  private api = inject(ApiService);
  private toast = inject(ToastService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private location = inject(Location); // Used to go "Back"
  private cdr = inject(ChangeDetectorRef);

  isEditMode = false;
  editingMenuId: number | null = null;
  formInitialData: any = { is_active: true , display_on_navbar: false}; // Default for create
  isLoaded = false;


  menuFormSchema: FormSchema = {
    layoutStyle: 'compact',
    // submitLabel: 'Save Menu',
    showCustomButtons: true,
    buttons: [
      {
      label : 'Save',
      type : 'button',
      class : 'btn btn-primary-govt'
    }
    ],
    fields: [
      {
        name: 'title',
        label: 'Menu Display Name',
        type: 'text',
        required: true,
        className: 'col-md-4 mb-3'
      },
      {
        name: 'parent_id',
        label: 'Parent',
        type: 'select',
        options: [
          { label: 'Please select Parent', value: '' },
        ],
        required: false,
        className: 'col-md-4 rounded-0'
      },
      {
        name: 'sort_no',
        label: 'Sort No.',
        type: 'number',
        required: true,
        className: 'col-md-4'
      },
     {
        name: 'is_active',
        label: 'Status',
        type: 'toggle', 
        className: 'col-md-2',
          options: [
          { label: 'Active', value: true },   
          { label: 'Inactive', value: false }  
        ]
      },
      {
        name: 'display_on_navbar',
        label: 'Display on Web Primary Navbar',
        type: 'toggle', 
        className: 'col-md-3',
         options: [
          { label: 'Yes', value: true }, 
          { label: 'No', value: false }   
        ]
      },
      
    ]
  };

  ngOnInit() {
    // if editing
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode = true;
      this.editingMenuId = Number(idParam);

      // Grab the data passed in the router state
          const state = history.state;
      if (state && state.menuData) {
        this.formInitialData = {
          ...state.menuData,
          // Map to booleans!
          is_active: state.menuData.is_active == 1 || state.menuData.is_active === '1' || state.menuData.is_active === true,
          display_on_navbar: state.menuData.display_on_navbar == 1 || state.menuData.display_on_navbar === '1' || state.menuData.display_on_navbar === true
        };
      }

    }

    // Fetch the menus for the Parent Dropdown
    this.fetchParentMenus();
  }

  fetchParentMenus() {
    this.api.get<any>('/admin/menus').subscribe({
      next: (res) => {
        const menus = res.data || [];
        const parentOptions = menus
          .filter((m: any) => !m.parent_id)
          .map((m: any) => ({ label: m.title, value: String(m.id) }));

        const parentField = this.menuFormSchema.fields?.find(f => f.name === 'parent_id');
        if (parentField) {
          parentField.options = [
            { label: 'Please select Parent (Leave blank for Top Level)', value: '' },
            ...parentOptions
          ];
        }
        this.isLoaded = true;
        this.cdr.detectChanges();
      }
    });
  }

   handleFormSubmit(event: any) {
    // Make a copy of the payload
    let payload = { ...(event.formValue ? event.formValue : event) };
    
    // Convert true/false back into 1/0 for the backend!
    payload.is_active = payload.is_active ? 1 : 0;
    payload.display_on_navbar = payload.display_on_navbar ? 1 : 0;

    const apiCall = this.isEditMode
      ? this.api.put(`/admin/menus/${this.editingMenuId}`, payload)
      : this.api.post('/admin/menus', payload);

    apiCall.subscribe({
      next: () => {
        this.toast.show('success', 'Menu saved successfully!');
        this.router.navigate(['/admin/menu-management']);
      },
      error: (err) => {
        const backendMessage = err.error?.message || 'Failed to save menu. Please check the fields.';
        this.toast.show('error', backendMessage);
      }
    });
  }


  goBack() {
    this.location.back();
  }
}
