import { Component, OnInit, inject, ChangeDetectorRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../../../core/services/api.service';
import { ToastService } from '../../../../../shared/services/toast.service';
import { DocumentListComponent, TableColumn } from '../../../../../shared/components/document-list/document-list.component';
import { Router } from '@angular/router';
import { FormSchema } from '../../../../../core/models/form-schema.model';
import { CustomValidators } from '../../../../../common/validation/custom-validators';
import { ModalFormComponent } from '../../../../../shared/components/modal-form/modal-form.component';
import { ModalHelperService } from '../../../../../shared/services/modal-helper';
declare const bootstrap: any;

@Component({
  selector: 'app-menu-management',
  standalone: true,
  imports: [CommonModule, DocumentListComponent, ModalFormComponent],
  templateUrl: './menu-managment.component.html',
  styleUrls: ['./menu-managment.component.scss']
})
export class MenuManagementComponent implements OnInit {
  private api = inject(ApiService);
  private toast = inject(ToastService);
  private cdr = inject(ChangeDetectorRef)
  private router = inject(Router);
  private modalHelper = inject(ModalHelperService);

  @ViewChild(ModalFormComponent) menuModal!: ModalFormComponent;


  menus: any[] = [];


  // Table Columns Configuration
  tableColumns: TableColumn[] = [
    { key: 'combined_title', label: 'Menu Title', type: 'html' },
    { key: 'menu_id', label: 'Menu ID', type: 'text' },
    { key: 'parent_id', label: 'Parent ID', type: 'text' },

    // { key: 'display_on_navbar', label: 'On Navbar?', type: 'toggle', toggleConfig: { trueLabel: 'Yes', falseLabel: 'No' } },
    { key: 'status', label: 'Status', type: 'toggle', toggleConfig: { trueLabel: 'Active', falseLabel: 'Inactive' } },
    {
      key: 'actions',
      label: 'Actions',
      type: 'action'
    }
  ];

  isEditMode = false;
  editingMenuId: number | null = null;
  formInitialData: any = { status: true };

  menuFormSchema: FormSchema = {
    layoutStyle: 'popup',
    submitLabel: 'Save',
    submitIcon: 'bi bi-floppy',
    submitClass: 'btn-primary',
    fields: [
      {
        name: 'header_en',
        label: '',
        type: 'html',
        html: '<div class="font_color fw-bold text-uppercase small">English Details</div>',
        className: 'col-md-6 border-end border-light-subtle pe-4 mt-0 pt-3'
      },
      {
        name: 'header_pb',
        label: '',
        type: 'html',
        html: '<div class="font_color fw-bold text-uppercase small">Punjabi Details</div>',
        className: 'col-md-3 ps-4 mt-0 pt-3'
      },
      {
        name: 'same_as_english',
        label: '',
        text: 'Same as English',
        type: 'checkbox',
        className: 'col-md-3 mt-0 pt-2 d-flex justify-content-end' // Takes the last 25% of the row!
      },

      // --- TITLES ---
      {
        name: 'name_en',
        label: 'Menu Display Name (English)', 
        type: 'text',
        required: true,
        min: 2,
        max: 50,
        validators: [CustomValidators.menuTitle()],
        className: 'col-md-6 border-end border-light-subtle pe-4 mt-0 pt-3'
      },
      {
        name: 'name_pa',
        label: 'Menu Display Name (Punjabi)',
        type: 'text',
        required: true,
        min: 2,
        max: 50,
        validators: [CustomValidators.menuTitle()],
        className: 'col-md-6 ps-4 mt-0 pt-3'
      },
      // --- PARENTS ---
      {
        name: 'parent_id',
        label: 'Parent Menu',
        type: 'select',
        options: [{ label: 'Please select Parent', value: '' }],
        required: false,
        className: 'col-md-6 border-end border-light-subtle pe-4 mt-0 pt-3 pb-4' // pb-4 extends the line down beautifully
      },
      {
        name: 'parent_id_pb',
        label: 'Parent Menu (Punjabi)',
        type: 'select',
        options: [{ label: 'Please select Parent (Punjabi)', value: '' }],
        required: false,
        className: 'col-md-6 ps-4 mt-0 pt-3 pb-0'
      },

      // --- SETTINGS HEADER ---
      {
        name: 'header_settings',
        label: '',
        type: 'html',
        html: '<div class="pt-0 mt-2 font_color fw-bold text-uppercase small">Settings</div>',
        className: 'col-12 mt-0'
      },

      // ---SETTINGS ---
      {
        name: 'sort_order',
        label: 'Sort No.',
        type: 'number',
        required: true,
        className: 'col-md-4 pt-0'
      },
      {
        name: 'status',
        label: 'Status',
        type: 'toggle',
        className: 'col-md-4 pt-0',
        options: [{ label: 'Active', value: true }, { label: 'Inactive', value: false }]
      },
    ]



  };


  ngOnInit() {
    this.fetchMenus();
    this.fetchParentMenus();
  }

  fetchMenus() {
    this.api.get<any>('/admin/menus').subscribe({
      next: (res) => {
        let rawData = res.data || [];
        this.menus = rawData.sort((a: any, b: any) => {
          const sortA = a.sort_order ?? 0;
          const sortB = b.sort_order ?? 0;

          if (sortA !== sortB) {
            return sortA - sortB;
          }
          return a.menu_id - b.menu_id;
        }).map((menu: any) => {
          const punjabiTitle = menu.name_pa ? `<div class=" text-dark lh-1 pt-2"><span class="text-muted fw-bold small">PB:</span> ${menu.name_pa}</div>` : '';
          return {
            ...menu,
            combined_title: `<div class=" text-dark pb-2 lh-1"><span class="text-muted fw-bold small">EN:</span> ${menu.name_en}</div>${punjabiTitle}`
          };
        });
        this.cdr.detectChanges();
      },
      error: () => { this.toast.show('error', 'Failed to load menus'); }
    });
  }
  //  fetchParentMenus() {
  //     this.api.get<any>('/admin/menus').subscribe({
  //       next: (res) => {
  //         const menus = res.data || [];
  //         const parentOptions = menus.filter((m: any) => !m.parent_id).map((m: any) => ({ label: m.title, value: String(m.id) }));
  //         const parentOptionsPb = menus.filter((m: any) => !m.parent_id).map((m: any) => ({ label: m.title_pb || m.title, value: String(m.id) }));
  //         const parentField = this.menuFormSchema.fields?.find(f => f.name === 'parent_id');
  //         if (parentField) parentField.options = [{ label: 'Please select Parent Menu (English)', value: '' }, ...parentOptions];

  //         const parentFieldPb = this.menuFormSchema.fields?.find(f => f.name === 'parent_id_pb');
  //         if (parentFieldPb) parentFieldPb.options = [{ label: 'Please select Parent Menu (Punjabi)', value: '' }, ...parentOptionsPb];

  //         this.cdr.detectChanges();
  //       }
  //     });
  //   }

  fetchParentMenus() {
    this.api.get<any>('/admin/menus').subscribe({
      next: (res) => {
        const menus = res.data || [];

        const getPath = (m: any, isPb: boolean = false): string => {
          let current = m;
          let path = isPb ? (current.name_pa || current.name_en) : current.name_en;

          while (current.parent_id) {
            current = menus.find((x: any) => x.id === Number(current.parent_id));
            if (!current) break;
            const parentName = isPb ? (current.name_pa || current.name_en) : current.name_en;
            path = parentName + ' > ' + path;
          }
          return path;
        };

        const parentOptions = menus
          .map((m: any) => ({ label: getPath(m, false), value: String(m.menu_id) }));

        const parentOptionsPb = menus
          .map((m: any) => ({ label: getPath(m, true), value: String(m.menu_id) }));

        const parentField = this.menuFormSchema.fields?.find(f => f.name === 'parent_id');
        if (parentField) {
          parentField.options = [{ label: 'Please select Parent Menu (English)', value: '' }, ...parentOptions];
        }

        const parentFieldPb = this.menuFormSchema.fields?.find(f => f.name === 'parent_id_pb');
        if (parentFieldPb) {
          parentFieldPb.options = [{ label: 'Please select Parent Menu (Punjabi)', value: '' }, ...parentOptionsPb];
        }

        this.cdr.detectChanges();
        setTimeout(() => {
          this.bindCheckboxLogic();
        }, 50);
      }
    });
  }


  bindCheckboxLogic() {
    const dForm = this.menuModal?.dynamicForm;

    if (dForm && dForm.form) {
      const formGroup = dForm.form;

      formGroup.get('same_as_english')?.valueChanges.subscribe(isChecked => {
        if (isChecked) {
          formGroup.get('name_pa')?.setValue(formGroup.get('name_en')?.value);
          formGroup.get('parent_id_pb')?.setValue(formGroup.get('parent_id')?.value);
        }
      });
      formGroup.get('name_en')?.valueChanges.subscribe(val => {
        if (formGroup.get('same_as_english')?.value) formGroup.get('name_pa')?.setValue(val);
      });
      formGroup.get('parent_id')?.valueChanges.subscribe(val => {
        if (formGroup.get('same_as_english')?.value) formGroup.get('parent_id_pb')?.setValue(val);
      });
    }
  }



  openCreateModal() {
    this.isEditMode = false;
    this.editingMenuId = null;
    this.formInitialData = { status: true };
    this.modalHelper.openModal({
      modalRef: this.menuModal,
      schema: this.menuFormSchema,
      submitLabel: 'Save',
      patchData: this.formInitialData,
      useRouting: false, 
      onOpen: () => this.bindCheckboxLogic() 
    });
  }
  // handleTableAction(event: { action: string, row: any }) {
  //   if (event.action === 'edit') {
  //     this.isEditMode = true;
  //     this.editingMenuId = event.row.public_id;
  //     this.formInitialData = {
  //       ...event.row,
  //       status: event.row.status == 1 || event.row.status === true,
  //           parent_id: event.row.parent_id ? String(event.row.parent_id) : '',
  //       parent_id_pb: event.row.parent_id ? String(event.row.parent_id) : ''
  //     };

  //     this.menuModal.open();

  //     setTimeout(() => this.bindCheckboxLogic(), 100);
  //   }
    handleTableAction(event: { action: string, row: any }) {
    if (event.action === 'edit') {
      this.isEditMode = true;
      this.editingMenuId = event.row.public_id;
      
      this.formInitialData = {
        ...event.row,
        status: event.row.status == 1 || event.row.status === true,
        parent_id: event.row.parent_id ? String(event.row.parent_id) : '',
        parent_id_pb: event.row.parent_id ? String(event.row.parent_id) : ''
      };
      this.modalHelper.openModal({
        modalRef: this.menuModal,
        schema: this.menuFormSchema,
        submitLabel: 'Save',
        patchData: this.formInitialData,
        useRouting: false, // Menus don't use routing!
        onOpen: () => this.bindCheckboxLogic() // Triggers your custom UI logic safely
      });
    }
    else if (event.action === 'delete') {
      if (confirm(`Are you sure you want to delete "${event.row.name_en}"?`)) {
        this.api.post(`/admin/menus/${event.row.public_id}/delete` , {}).subscribe(() => {
          this.toast.show('success', 'Menu deleted!');
          this.fetchMenus();
        });
      }
    }
    else if (event.action === 'toggle_status') {
      const newStatus = (event.row.status == 1 || event.row.status === true || event.row.status === '1') ? 0 : 1;
      this.api.post(`/admin/menus/${event.row.public_id}/status`, { status: newStatus }).subscribe(() => {
        this.toast.show('success', newStatus === 1 ? 'Menu status is now Active!' : 'Menu status is now InActive!');
        this.fetchMenus();
      });
    }
  }
  handleFormSubmit(event: any) {
    let payload = { ...(event.formValue ? event.formValue : event) };

    payload.status = payload.status ? 1 : 0;
    const apiCall = this.isEditMode
      ? this.api.post(`/admin/menus/${this.editingMenuId}/update`, payload)
      : this.api.post('/admin/menus', payload);
    apiCall.subscribe({
      next: () => {
        this.toast.show('success', 'Menu saved successfully!');
        this.fetchMenus();
        this.fetchParentMenus();

        this.menuModal.close();

      },
      error: (err) => {
        const backendMessage = err.error?.message || 'Failed to save menu. Please check the fields.';
        this.toast.show('error', backendMessage);
      }
    });
  }
}