import { Component, OnInit, ChangeDetectorRef, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { DocumentListComponent, TableColumn } from '../../../../shared/components/document-list/document-list.component';
import { ApiService } from '../../../../core/services/api.service';
import { ToastService } from '../../../../shared/services/toast.service';
import { SandesTemplateSchema } from './sandes-templates-form.schema';
import { ModalHelperService } from '../../../../shared/services/modal-helper';
import { AuthService } from '../../../../core/auth/auth.service';
import { ModalFormComponent } from '../../../../shared/components/modal-form/modal-form.component';

@Component({
  standalone: true,
  selector: 'app-sandes-templates-list',
  imports: [DocumentListComponent, ModalFormComponent, CommonModule],
  templateUrl: './sandes-templates-list.component.html',
  styleUrl: './sandes-templates-list.component.scss'
})
export class SandesTemplatesListComponent implements OnInit {

  constructor(private userService: AuthService) { }

  @ViewChild(ModalFormComponent) sandesTemplateModal!: ModalFormComponent;

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
  SandesTemplateSchema = SandesTemplateSchema;
  sandesTemplateId: string | null = null;
  updatingSandesTemplateId: string | null = null;

  tableColumns: TableColumn[] = [
    { key: 'name', label: 'Template Name', widthClass: 'col-3', sortable: true },
    { key: 'messageHtml', label: 'Message', widthClass: 'col-6', sortable: false, type: 'html' },
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
    this.api.get<any>('/admin/sandes-templates', params).subscribe({
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
            name: item.name_en || item.name_pb || 'N/A',
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
        this.toast.show('error', err.error?.message || 'Failed to load Sandes templates');
        this.cdr.detectChanges();
      }
    });
  }

  handleAction(event: any): void {
    if (event.action === 'edit' || event.actionName === 'edit') {
      this.openEditModal(event.row);
    } else if (event.action === 'delete') {
      if (confirm(`Are you sure you want to delete "${event.row.name_en}" Sandes Template"?`)) {
        this.userService.deleteSandesTemplate(event.row.id).subscribe({
          next: (res: any) => {
            this.toast.show(
              'success',
              res.message || 'Sandes Template deleted successfully!',
              4000
            );

            this.loadTemplates();
          },
          error: (error: any) => {

            this.toast.show(
              'error',
              error.error?.message || 'Failed to delete Sandes Template'
            );

            console.error('Failed to delete Sandes Template:', error);
          }
        });
      }
    } else if (event.action === 'toggle_status') {
      this.updateStatus(event.row.id, event.row.status);
    }
  }

  updateStatus(id: string | number, status: boolean | number): void {
    const statusValue = status ? 1 : 0;
    this.api.post(`/admin/sandes-templates/${id}/status`, { status: statusValue }).subscribe({
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
    this.sandesTemplateId = null;

    this.modalHelper.openModal({
      modalRef: this.sandesTemplateModal, 
      schema: this.SandesTemplateSchema,
      submitLabel: 'Create Sandes Template',
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

  openEditModal(SandesTemplate: any) {

    this.isEditMode = true;
    this.sandesTemplateId = SandesTemplate.id;

    this.SandesTemplateSchema.submitLabel = 'Update Sandes Template';

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { id: this.sandesTemplateId },
      queryParamsHandling: 'merge'
    }).then(() => {

      this.sandesTemplateModal.open();

      setTimeout(() => {

        const form = this.sandesTemplateModal?.dynamicForm?.form;

        if (!form) {
          return;
        }
        console.log('SandesTemplate', SandesTemplate);
        form.patchValue({
          name_en: SandesTemplate.name_en || '',
          name_pb: SandesTemplate.name_pb || '',
          description_en: SandesTemplate.description_en || '',
          description_pb: SandesTemplate.description_pb || '',
          status: SandesTemplate.status
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
      emailTemplateId: this.sandesTemplateId ?? null,
    };

    if (this.isEditMode && this.sandesTemplateId) {

      this.userService.updateSandesTemplate(this.sandesTemplateId, payload).subscribe({
        next: (res: any) => {
          this.toast.show('success', res.message || 'Sandes Template updated successfully!', 4000);
          this.sandesTemplateModal.close();
          this.loadTemplates();
        },
        error: (error: any) => {
          this.toast.show('error', error.error?.message || 'Failed to update Sandes Template');
          console.error('Failed to update Sandes Template:', error);
        }
      });

    } else {
       this.userService.createSandesTemplate(payload).subscribe({
        next: (res: any) => {
          this.toast.show('success', res.message || 'Sandes Template created successfully!', 4000);
          this.sandesTemplateModal.close();
          this.loadTemplates();
        },
        error: (error: any) => {
          this.toast.show('error', error.error?.message || 'Failed to create Sandes Template');
          console.error('Failed to create Sandes Template:', error);
        }
      });
    }
  }
}
