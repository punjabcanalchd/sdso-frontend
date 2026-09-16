import { Component, OnInit, ViewChild, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentListComponent, TableColumn } from '../../../../shared/components/document-list/document-list.component';
import { ModalFormComponent } from '../../../../shared/components/modal-form/modal-form.component';
import { ToastService } from '../../../../shared/services/toast.service';
import { noticeboardSchema } from './noticeboard-form.schema';
import { ApiService } from '../../../../../app/core/services/api.service';

@Component({
  selector: 'app-noticeboard-list',
  standalone: true,
  imports: [CommonModule, DocumentListComponent, ModalFormComponent],
  templateUrl: './noticeboard-list.component.html',
  styleUrl: './noticeboard-list.component.scss'
})
export class NoticeboardListComponent implements OnInit {
  @ViewChild(ModalFormComponent) noticeModal!: ModalFormComponent;

  private toast = inject(ToastService);
  private cdr = inject(ChangeDetectorRef);
  private api = inject(ApiService);

currentPage = 1;
pageSize = 25;
search = '';
totalRecords = 0;

  noticeboardSchema = noticeboardSchema;
  isEditMode = false;
  editingNoticeId: number | null = null;
  formInitialData: any = {};

  tableColumns: TableColumn[] = [
    { key: 'title', label: 'Title', type: 'html' },
    { key: 'category', label: 'Category Name', type: 'text' },
    { key: 'publishDate', label: 'Publish Date', type: 'text' },
    { key: 'lastSubmissionDate', label: 'Last Submission Date', type: 'text' },
    { key: 'status', label: 'Status', type: 'toggle', toggleConfig: { trueLabel: 'Active', falseLabel: 'Inactive' } },
    { key: 'action', label: 'Action', type: 'edit' }
  ];

  data: any[] = [];
  isLoading = false;

 ngOnInit(): void {
  this.loadCategories();
  this.loadNotices();
}

loadNotices(): void {
  this.isLoading = true;

  this.api.get<any>('/admin/noticeboard', { per_page: 25 }).subscribe({
    next: (res) => {
      this.isLoading = false;
      const notices = res.data || [];

      this.data = notices.map((item: any) => {
        const punjabiTitle = item.name_pb
          ? `<div class="text-dark lh-1 pt-2"><span class="text-muted fw-bold small">PB:</span> ${item.name_pb}</div>`
          : '';

        return {
          id: item.id,
          canEdit: true,
          title: `
            <div class="text-dark pb-1 lh-1">
              <span class="text-muted fw-bold small">EN:</span> ${item.name_en}
            </div>
            ${punjabiTitle}
          `,
          category: item.category_name,
          publishDate: item.publish_date || '—',
          lastSubmissionDate: '—',
          status: item.status,
          nameEn: item.name_en,
          namePb: item.name_pb,
          categoryId: item.category_id,
          uploadNotice: item.upload_notice
        };
      });

      this.cdr.detectChanges();
    },
    error: (err) => {
      this.isLoading = false;
      console.error('Error fetching notices:', err);
      this.toast.show('error', 'Failed to load notices from database.');
    }
  });
}

  loadCategories(): void {
  this.api.get<any>('/admin/noticeboard/categories').subscribe({
    next: (res) => {
      const categoryField = this.noticeboardSchema.fields?.find(f => f.name === 'category_id');
      if (categoryField && res.data) {
        categoryField.options = res.data;
        this.cdr.detectChanges();
      }
    }
  });
}
 
openCreateModal(): void {
  this.isEditMode = false;
  this.editingNoticeId = null;
  this.noticeboardSchema.submitLabel = 'Save';
  this.formInitialData = {
    name_en: '',
    name_pb: '',
    category_id: '',
    publish_date: new Date().toISOString().split('T')[0],
    status: true,
    is_latest_news: false,
    access_type: 'public'
  };
  const form = this.noticeModal?.dynamicForm?.form;
  if (form) {
    form.reset(this.formInitialData);
  }
  this.noticeModal.open();
  this.bindCheckboxLogic();
}

openEditModal(row: any): void {
  this.isEditMode = true;
  this.editingNoticeId = row.id;
  this.noticeboardSchema.submitLabel = 'Update';
  this.formInitialData = {
    name_en: row.nameEn || '',
    name_pb: row.namePb || '',
    category_id: row.categoryId || '',
    publish_date: row.publishDate || '',
    status: !!row.status
  };
  const form = this.noticeModal?.dynamicForm?.form;
  if (form) {
    form.reset(this.formInitialData);
  }
  this.noticeModal.open();
  this.bindCheckboxLogic();
}

 
  private bindCheckboxLogic(): void {
    setTimeout(() => {
      const form = this.noticeModal?.dynamicForm?.form;
      if (!form) return;

      form.get('same_as_english_pb')?.valueChanges.subscribe((isChecked) => {
        if (isChecked) {
          form.get('name_pb')?.setValue(form.get('name_en')?.value);
          form.get('description_pb')?.setValue(form.get('description_en')?.value);
        }
      });
    }, 200);
  }

  onModalClosed(): void {
    this.isEditMode = false;
    this.editingNoticeId = null;
  }


 onSubmit(formData: any): void {
  const payload = new FormData();
  payload.append('name_en', formData.name_en || '');
  payload.append('name_pb', formData.name_pb || '');
  payload.append('category_id', formData.category_id || '');
  payload.append('publish_date', formData.publish_date || '');
  payload.append('status', formData.status ? '1' : '0');

  if (formData.notice_file instanceof File) {
    payload.append('notice_file', formData.notice_file);
  }
  const request$ = this.isEditMode
    ? this.api.post(`/admin/noticeboard/${this.editingNoticeId}/update`, payload)
    : this.api.post('/admin/noticeboard', payload);
  request$.subscribe({
    next: () => {
      this.toast.show('success', this.isEditMode ? 'Notice updated successfully!' : 'Notice created successfully!');
      this.noticeModal.close();
      this.loadNotices(); 
    },
    error: (err) => {
      console.error('Save failed:', err);
      this.toast.show('error', err.error?.message || 'Failed to save notice.');
    }
  });
}


 handleAction(event: { action: string; row: any }): void {
  if (event.action === 'edit') {
    this.openEditModal(event.row);
  } else if (event.action === 'toggle') {
    const newStatus = !event.row.status;
    this.api.post(`/admin/noticeboard/${event.row.id}/status`, { status: newStatus }).subscribe({
      next: () => {
        event.row.status = newStatus;
        this.toast.show('success', `Status updated to ${newStatus ? 'Active' : 'Inactive'}`);
      },
      error: () => {
        this.toast.show('error', 'Failed to update status.');
        this.loadNotices();
      }
    });
    } 
  }
}