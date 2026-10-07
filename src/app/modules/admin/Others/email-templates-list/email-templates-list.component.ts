import { Component, OnInit, ChangeDetectorRef, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { DocumentListComponent, TableColumn } from '../../../../shared/components/document-list/document-list.component';
import { ApiService } from '../../../../core/services/api.service';
import { ToastService } from '../../../../shared/services/toast.service';
import { EmailTemplateSchema } from './email-templates-form.schema';
import { ModalHelperService } from '../../../../shared/services/modal-helper';
import { AuthService } from '../../../../core/auth/auth.service';
import { ModalFormComponent } from '../../../../shared/components/modal-form/modal-form.component';
import { EmailTemplate } from '../../../../core/models/email-template.model';



@Component({
  standalone: true,
  selector: 'app-email-templates-list',
  imports: [DocumentListComponent, ModalFormComponent, CommonModule],
  templateUrl: './email-templates-list.component.html',
  styleUrl: './email-templates-list.component.scss'
})
export class EmailTemplatesListComponent implements OnInit {

  constructor(private userService: AuthService) { }

  @ViewChild(ModalFormComponent) emailTemplateModal!: ModalFormComponent;

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
  EmailTemplateSchema = EmailTemplateSchema;
  emailTemplateId: string | null = null;
  updatingemailTemplateId: string | null = null;

  tableColumns: TableColumn[] = [
    { key: 'name', label: 'Template Name', widthClass: 'col-3', sortable: true },
    { key: 'subjectHtml', label: 'Subject', widthClass: 'col-5', sortable: false, type: 'html' },
    { key: 'status', label: 'Status', widthClass: 'col-2', type: 'toggle', toggleConfig: { trueLabel: 'Active', falseLabel: 'Inactive' } },
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
    this.api.get<any>('/admin/email-templates', params).subscribe({
      next: (res) => {
        this.data = (res.data || []).map((item: any, index: number) => {
          const englishSubject = item.name_en || 'N/A';
          const punjabiSubject = item.name_pb
            ? `<div class="text-dark lh-1 pt-2">
                <span class="text-muted fw-bold small">PB:</span>
                ${item.name_pb}
              </div>`
            : '';

          return {
            id: item.public_id,
            orignalSeq: (this.currentPage - 1) * this.pageSize + index + 1,
            name: item.name,
            subjectHtml: `
              <div class="text-dark pb-1 lh-1">
                <span class="text-muted fw-bold small">EN:</span>
                ${englishSubject}
              </div>
              ${punjabiSubject}
            `,
            status: item.status,
            name_en: item.name_en,
            name_pb: item.name_pb,
            description_en: item.description_en,
            description_pb: item.description_pb,
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
        this.toast.show('error', err.error?.message || 'Failed to load email templates');
        this.cdr.detectChanges();
      }
    });
  }

  handleAction(event: any): void {
    if (event.action === 'edit' || event.actionName === 'edit') {
      this.openEditModal(event.row);
    } else if (event.action === 'delete') {
      if (confirm(`Are you sure you want to delete "${event.row.name_en} Email Template"?`)) {
        this.userService.deleteEmailTemplate(event.row.id).subscribe({
          next: (res: any) => {
            this.toast.show(
              'success',
              res.message || 'Email Template deleted successfully!',
              4000
            );

            this.loadTemplates();
          },
          error: (error: any) => {

            this.toast.show(
              'error',
              error.error?.message || 'Failed to delete Email Template'
            );

            console.error('Failed to delete Email Template:', error);
          }
        });
      }
    } else if (event.action === 'toggle_status') {
      this.updateStatus(event.row.id, event.row.status);
    }
  }

  updateStatus(id: string | number, status: boolean | number): void {
    const statusValue = status ? 1 : 0;
    this.api.post(`/admin/email-templates/${id}/status`, { status: statusValue }).subscribe({
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
    this.emailTemplateId = null;

    this.modalHelper.openModal({
      modalRef: this.emailTemplateModal, 
      schema: this.EmailTemplateSchema,
      submitLabel: 'Create Email Template',
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

  openEditModal(EmailTemplate: any) {

    this.isEditMode = true;
    this.emailTemplateId = EmailTemplate.id;

    this.EmailTemplateSchema.submitLabel = 'Update Email Template';

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { id: this.emailTemplateId },
      queryParamsHandling: 'merge'
    }).then(() => {

      this.emailTemplateModal.open();

      setTimeout(() => {

        const form = this.emailTemplateModal?.dynamicForm?.form;

        if (!form) {
          return;
        }
        console.log('EmailTemplate', EmailTemplate);
        form.patchValue({
          name_en: EmailTemplate.name_en || '',
          name_pb: EmailTemplate.name_pb || '',
          description_en: EmailTemplate.description_en || '',
          description_pb: EmailTemplate.description_pb || '',
          name: EmailTemplate.name,
          status: EmailTemplate.status
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
      name: formData.name,
      same_as_english_pb: formData.same_as_english_pb ?? null,
      status: formData.status,
      emailTemplateId: this.emailTemplateId ?? null,
    };

    if (this.isEditMode && this.emailTemplateId) {

      this.userService.updateEmailTemplate(this.emailTemplateId, payload).subscribe({
        next: (res: any) => {
          this.toast.show('success', res.message || 'Email Template updated successfully!', 4000);
          this.emailTemplateModal.close();
          this.loadTemplates();
        },
        error: (error: any) => {
          this.toast.show('error', error.error?.message || 'Failed to update Email Template');
          console.error('Failed to update Email Template:', error);
        }
      });

    } else {
       this.userService.createEmailTemplate(payload).subscribe({
        next: (res: any) => {
          this.toast.show('success', res.message || 'Email Template created successfully!', 4000);
          this.emailTemplateModal.close();
          this.loadTemplates();
        },
        error: (error: any) => {
          this.toast.show('error', error.error?.message || 'Failed to create Email Template');
          console.error('Failed to create Email Template:', error);
        }
      });
    }
  }

}
