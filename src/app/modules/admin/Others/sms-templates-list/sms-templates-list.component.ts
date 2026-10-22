import { Component, OnInit, ChangeDetectorRef, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { DocumentListComponent, TableColumn } from '../../../../shared/components/document-list/document-list.component';
import { ModalFormComponent } from '../../../../shared/components/modal-form/modal-form.component';
import { ApiService } from '../../../../core/services/api.service';
import { ToastService } from '../../../../shared/services/toast.service';
import { SMSTemplateSchema } from './sms-templates-form.schema';
import { ModalHelperService } from '../../../../shared/services/modal-helper';
import { AuthService } from '../../../../core/auth/auth.service';

@Component({
  standalone: true,
  selector: 'app-sms-templates-list',
  imports: [DocumentListComponent, ModalFormComponent, CommonModule],
  templateUrl: './sms-templates-list.component.html',
  styleUrl: './sms-templates-list.component.scss'
})
export class SmsTemplatesListComponent implements OnInit {

  constructor(private userService: AuthService) { }

  @ViewChild(ModalFormComponent) smsTemplateModal!: ModalFormComponent;

  private api = inject(ApiService);
  private toast = inject(ToastService);
  private cdr = inject(ChangeDetectorRef);
  private modalHelper = inject(ModalHelperService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  data: any[] = [];
  isLoading = false;
  isEditMode = false;
  formInitialData: any = {};

  currentPage = 1;
  pageSize = 25;
  pagination: any = {};
  search = '';
  sortColumn = 'template_id';
  sortDirection = 'desc';
  SMSTemplateSchema = SMSTemplateSchema;
  smsTemplateId: string | null = null;
  updatingSmsTemplateId: string | null = null;

  editingId: string | number | null = null;

  tableColumns: TableColumn[] = [
    { key: 'name', label: 'Template Name', widthClass: 'col-2', sortable: true },
    { key: 'templateid', label: 'DLT Template ID', widthClass: 'col-2', sortable: true },
    { key: 'messageHtml', label: 'Message', widthClass: 'col-4', sortable: false, type: 'html' },
    { key: 'status', label: 'Status', widthClass: 'col-1', type: 'toggle', toggleConfig: { trueLabel: 'Active', falseLabel: 'Inactive' } },
    { key: 'created_at', label: 'Created At', widthClass: 'col-2', sortable: true },
    {
      key: 'actions',
      label: 'Actions',
      type: 'action'
    }
  ];

  ngOnInit(): void {
    this.loadTemplates();
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

  loadTemplates(page: number = this.currentPage): void {
    this.currentPage = page;
    const params: any = {
      page: this.currentPage,
      per_page: this.pageSize,
      search: this.search,
      sort_column: this.sortColumn,
      sort_direction: this.sortDirection
    };

    this.isLoading = true;
    this.api.get<any>('/admin/sms-templates', params).subscribe({
      next: (res) => {
        this.data = (res.data || []).map((item: any, index: number) => {
          const englishMessage = item.description_en || 'N/A';
          const punjabiMessage = item.description_pb
            ? `<div class="text-dark lh-1 pt-2">
                <span class="text-muted fw-bold small">PB:</span>
                ${item.description_pb}
              </div>`
            : '';

          return {
            id: item.public_id,
            orignalSeq: (this.currentPage - 1) * this.pageSize + index + 1,
            name: item.name_en || 'N/A',
            templateid: item.templateid || 'N/A',
            message_en: item.message_en,
            message_pb: item.message_pb,
            messageHtml: `
              <div class="text-dark pb-1 lh-1">
                <span class="text-muted fw-bold small">EN:</span>
                ${englishMessage}
              </div>
              ${punjabiMessage}
            `,
            status: item.status,
            name_en: item.name_en || 'N/A',
            name_pb: item.name_pb || 'N/A',
            description_pb: item.description_pb || 'N/A',
            description_en: item.description_en || 'N/A',
            created_at: this.formatDate(item.created_at),
            raw: item
          };
        });

        this.pagination = res.pagination || {};
        this.currentPage = res.pagination?.current_page || 1;
        this.pageSize = res.pagination?.per_page || 25;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isLoading = false;
        this.toast.show('error', err.error?.message || 'Failed to load SMS templates');
        this.cdr.detectChanges();
      }
    });
  }

  bindCheckboxLogic(): void {
    const formGroup = this.smsTemplateModal?.dynamicForm?.form;
    if (formGroup) {
      formGroup.get('same_as_english_pb')?.valueChanges.subscribe((isChecked) => {
        if (isChecked) {
          formGroup.get('message_pb')?.setValue(formGroup.get('message_en')?.value);
        }
      });

      formGroup.get('message_en')?.valueChanges.subscribe((val) => {
        if (formGroup.get('same_as_english_pb')?.value) {
          formGroup.get('message_pb')?.setValue(val);
        }
      });
    }
  }

 handleAction(event: any): void {
    if (event.action === 'edit' || event.actionName === 'edit') {
      this.openEditModal(event.row);
    } else if (event.action === 'delete') {
      if (confirm(`Are you sure you want to delete "${event.row.name_en} SMS Template"?`)) {
        this.userService.deleteSMSTemplate(event.row.id).subscribe({
          next: (res: any) => {
            this.toast.show(
              'success',
              res.message || 'SMS Template deleted successfully!',
              4000
            );

            this.loadTemplates();
          },
          error: (error: any) => {

            this.toast.show(
              'error',
              error.error?.message || 'Failed to delete SMS Template'
            );

            console.error('Failed to delete SMS Template:', error);
          }
        });
      }
    } else if (event.action === 'toggle_status') {
      this.updateStatus(event.row.id, event.row.status);
    }
  }



  updateStatus(id: string | number, status: boolean | number): void {
    const statusValue = status ? 1 : 0;
    this.api.post(`/admin/sms-templates/${id}/status`, { status: statusValue }).subscribe({
      next: (res: any) => {
        this.toast.show('success', res.message || 'Status updated successfully', 3000);
        this.loadTemplates();
      },
      error: (err: any) => {
        this.toast.show('error', err.error?.message || 'Failed to update status');
        this.loadTemplates();
      }
    });
  }

  searchTemplates(text: string): void {
    this.search = text;
    this.loadTemplates(1);
  }

  sortTemplates(event: any): void {
    this.sortColumn = event.column;
    this.sortDirection = event.direction;
    this.loadTemplates(1);
  }

  onPageSizeChange(size: number): void {
    this.pageSize = size;
    this.loadTemplates(1);
  }

    openCreateModal() {
    this.isEditMode = false;
    this.smsTemplateId = null;

    this.modalHelper.openModal({
      modalRef: this.smsTemplateModal, 
      schema: this.SMSTemplateSchema,
      submitLabel: 'Create SMS Template',
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

  openEditModal(SMSTemplate: any) {

    this.isEditMode = true;
    this.smsTemplateId = SMSTemplate.id;

    this.SMSTemplateSchema.submitLabel = 'Update SMS Template';

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { id: this.smsTemplateId },
      queryParamsHandling: 'merge'
    }).then(() => {

      this.smsTemplateModal.open();

      setTimeout(() => {

        const form = this.smsTemplateModal?.dynamicForm?.form;

        if (!form) {
          return;
        }
        console.log('SMSTemplate', SMSTemplate);
        form.patchValue({
          name_en: SMSTemplate.name_en || '',
          name_pb: SMSTemplate.name_pb || '',
          description_en: SMSTemplate.description_en || '',
          description_pb: SMSTemplate.description_pb || '',
          templateid: SMSTemplate.templateid,
          status: SMSTemplate.status
        });

      }, 100);
    });
  }

  onSubmit(formData: any): void {
    
    const payload = {
      description: {
        1: formData.description_en || '',
        2: formData.description_pb || ''
      },
      subject: {
        1: formData.name_en || '',
        2: formData.name_pb || ''
      },
      name: formData.name_en,
      same_as_english_pb: formData.same_as_english_pb ?? null,
      status: formData.status,
      templateid: formData.templateid,
      emailTemplateId: this.smsTemplateId ?? null,
    };

    if (this.isEditMode && this.smsTemplateId) {

      this.userService.updateSMSTemplate(this.smsTemplateId, payload).subscribe({
        next: (res: any) => {
          this.toast.show('success', res.message || 'SMS Template updated successfully!', 4000);
          this.smsTemplateModal.close();
          this.loadTemplates();
        },
        error: (error: any) => {
          this.toast.show('error', error.error?.message || 'Failed to update SMS Template');
          console.error('Failed to update SMS Template:', error);
        }
      });

    } else {
       this.userService.createSMSTemplate(payload).subscribe({
        next: (res: any) => {
          this.toast.show('success', res.message || 'SMS Template created successfully!', 4000);
          this.smsTemplateModal.close();
          this.loadTemplates();
        },
        error: (error: any) => {
          this.toast.show('error', error.error?.message || 'Failed to create SMS Template');
          console.error('Failed to create SMS Template:', error);
        }
      });
    }
  }

}
