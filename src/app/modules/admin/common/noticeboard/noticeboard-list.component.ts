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
          lastSubmissionDate: item.last_submission_date || '',
          status: item.status,
          nameEn: item.name_en,
          namePb: item.name_pb,
          descriptionEn: item.description_en || '',
          descriptionPb: item.description_pb || '',
          categoryId: item.category_id,
          uploadNotice: item.upload_notice,
          languageId: item.language_id || 1,
          isLatestNews: item.is_latest_news ?? false,
          accessType: item.access_type || 'public',
          raw: item
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

    const defaultValues = {
      name_en: '',
      name_pb: '',
      description_en: '',
      description_pb: '',
      category_id: '',
      notice_file: null,
      publish_date: new Date().toISOString().split('T')[0],
      last_submission_date: '',
      status: 1,
      language_id: 1,
      is_latest_news: false,
      access_type: 'public'
    };

    this.noticeModal.open();

    setTimeout(() => {
      const form = this.noticeModal?.dynamicForm?.form;
      if (form) {
        form.reset(defaultValues);
      }
      this.bindCheckboxLogic();
      this.cdr.detectChanges();
    }, 100);
  }

  openEditModal(row: any): void {
    this.isEditMode = true;
    this.editingNoticeId = row.id;
    this.noticeboardSchema.submitLabel = 'Update';

    const patchValue = {
      name_en: row.nameEn || '',
      description_en: row.descriptionEn || row.raw?.description_en || '',
      name_pb: row.namePb || '',
      description_pb: row.descriptionPb || row.raw?.description_pb || '',
      category_id: row.categoryId ? Number(row.categoryId) : '',
      notice_file: row.uploadNotice || row.raw?.upload_notice || null,
      publish_date: row.publishDate && row.publishDate !== '—' ? row.publishDate : '',
      last_submission_date: row.lastSubmissionDate && row.lastSubmissionDate !== '—' ? row.lastSubmissionDate : '',
      status: row.status ? 1 : 0,
      language_id: row.languageId || 1,
      is_latest_news: row.isLatestNews ?? false,
      access_type: row.accessType || 'public'
    };

    this.noticeModal.open();

    setTimeout(() => {
      const form = this.noticeModal?.dynamicForm?.form;
      if (form) {
        form.patchValue(patchValue);
      }
      this.bindCheckboxLogic();
      this.cdr.detectChanges();
    }, 100);
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
    payload.append('description_en', formData.description_en || '');
    payload.append('name_pb', formData.name_pb || '');
    payload.append('description_pb', formData.description_pb || '');
    payload.append('category_id', formData.category_id || '');
    payload.append('publish_date', formData.publish_date || '');

    if (formData.last_submission_date) {
      payload.append('last_submission_date', formData.last_submission_date);
    }

    payload.append('status', formData.status == 1 || formData.status === true ? '1' : '0');

    if (formData.language_id) {
      payload.append('language_id', formData.language_id);
    }
    if (formData.is_latest_news !== undefined) {
      payload.append('is_latest_news', formData.is_latest_news ? '1' : '0');
    }
    if (formData.access_type) {
      payload.append('access_type', formData.access_type);
    }

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
    switch (event.action) {
      case 'edit':
        this.openEditModal(event.row);
        break;

      case 'toggle_status':
        this.updateNoticeStatus(event.row.id, event.row.status);
        break;
    }
  }

  updateNoticeStatus(id: string | number, status: number): void {
    const noticeId = String(id);
    const statusValue = status === 1 ? 1 : 0;

    this.api.post(`/admin/noticeboard/${noticeId}/status`, { status: statusValue }).subscribe({
      next: (res: any) => {
        this.toast.show(
          'success',
          res.message || `Notice status updated to ${statusValue === 1 ? 'Active' : 'Inactive'}`,
          3000
        );
        this.loadNotices();
      },
      error: (error: any) => {
        console.error('Status update failed:', error);
        this.toast.show(
          'error',
          error.error?.message || 'Failed to update notice status',
          3000
        );
        this.loadNotices();
      }
    });
  }

}