import { Component, OnInit, ChangeDetectorRef, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentListComponent, TableColumn } from '../../../../shared/components/document-list/document-list.component';
import { ModalFormComponent } from '../../../../shared/components/modal-form/modal-form.component';
import { ApiService } from '../../../../core/services/api.service';
import { ToastService } from '../../../../shared/services/toast.service';
import { translationSchema } from './translation-form.schema';

@Component({
  standalone: true,
  selector: 'app-translations-list',
  imports: [CommonModule, DocumentListComponent, ModalFormComponent],
  templateUrl: './translations-list.component.html',
  styleUrl: './translations-list.component.scss'
})
export class TranslationsListComponent implements OnInit {
  @ViewChild(ModalFormComponent) translationModal!: ModalFormComponent;

  private api = inject(ApiService);
  private toast = inject(ToastService);
  private cdr = inject(ChangeDetectorRef);

  data: any[] = [];
  pagination: any = {};
  currentPage = 1;
  pageSize = 25;
  search = '';
  sortColumn = 'key_id';
  sortDirection = 'asc';

  isEditMode = false;
  editingKeyId: number | string | null = null;
  formInitialData: any = {};
  translationSchema = translationSchema;

  tabs = [
    { label: 'General', value: 1 },
    { label: 'Homepage', value: 2 },
    { label: 'Errors', value: 3 }
  ];
  selectedGroup = 1;

  tableColumns: TableColumn[] = [
    { key: 'translation_key', label: 'Unique Key', widthClass: 'col-3', sortable: true },
    { key: 'pb', label: 'PB', widthClass: 'col-4', sortable: false },
    { key: 'en', label: 'EN', widthClass: 'col-4', sortable: false },
    { key: 'action', label: 'Actions', type: 'edit', widthClass: 'col-1' }
  ];

  ngOnInit(): void {
    this.loadTranslations();
  }

  selectTab(group: number): void {
    this.selectedGroup = group;
    this.currentPage = 1;
    this.loadTranslations();
  }

  loadTranslations(page: number = this.currentPage): void {
    this.currentPage = page;
    const params: any = {
      page: this.currentPage,
      per_page: this.pageSize,
      group: this.selectedGroup,
      search: this.search,
      sort_column: this.sortColumn,
      sort_direction: this.sortDirection
    };

    this.api.get<any>('/admin/translations', params).subscribe({
      next: (res) => {
        this.data = (res.data || []).map((item: any, index: number) => ({
          ...item,
          id: item.key_id,
          canEdit: true,
          orignalSeq: (this.currentPage - 1) * this.pageSize + index + 1
        }));
        this.pagination = res.pagination || {};
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.toast.show('error', err.error?.message || 'Failed to load translations');
      }
    });
  }

  handleAction(event: any): void {
    if (event.action === 'edit') {
      this.openEditModal(event.row);
    }
  }

  openCreateModal(): void {
    this.isEditMode = false;
    this.editingKeyId = null;
    this.translationSchema.submitLabel = 'Create Translation';
    this.formInitialData = {
      group: this.selectedGroup,
      translation_key: '',
      en: '',
      same_as_english_pb: true,
      pb: '',
      group_pb: this.selectedGroup,
      translation_key_pb: ''
    };

    this.translationModal.open();

    setTimeout(() => {
      const dynamicForm = this.translationModal?.dynamicForm;
      if (dynamicForm) {
        dynamicForm.activeTab = 'en';
        dynamicForm.activeChildTab = '';
        if (dynamicForm.form) {
          dynamicForm.form.reset(this.formInitialData);
          dynamicForm.form.get('group_pb')?.disable();
          dynamicForm.form.get('translation_key_pb')?.disable();
        }
      }
      this.bindCheckboxLogic();
      this.cdr.detectChanges();
    }, 100);
  }

  openEditModal(row: any): void {
    this.isEditMode = true;
    this.editingKeyId = row.key_id || row.id;
    this.translationSchema.submitLabel = 'Update Translation';

    this.api.get<any>(`/admin/translations/${this.editingKeyId}`).subscribe({
      next: (res) => {
        const item = res.data || row;
        const isSame = (item.en === item.pb && !!item.en);

        this.formInitialData = {
          group: Number(item.group || this.selectedGroup),
          translation_key: item.translation_key,
          en: item.en || '',
          same_as_english_pb: isSame,
          pb: item.pb || '',
          group_pb: Number(item.group || this.selectedGroup),
          translation_key_pb: item.translation_key
        };

        this.translationModal.open();

        setTimeout(() => {
          const dynamicForm = this.translationModal?.dynamicForm;
          if (dynamicForm && dynamicForm.form) {
            dynamicForm.activeTab = 'en';
            dynamicForm.activeChildTab = '';
            dynamicForm.form.reset(this.formInitialData);
            if (isSame) {
              dynamicForm.form.get('group_pb')?.disable();
              dynamicForm.form.get('translation_key_pb')?.disable();
            } else {
              dynamicForm.form.get('group_pb')?.enable();
              dynamicForm.form.get('translation_key_pb')?.enable();
            }
          }
          this.bindCheckboxLogic();
          this.cdr.detectChanges();
        }, 100);
      },
      error: () => {
        const isSame = (row.en === row.pb && !!row.en);
        this.formInitialData = {
          group: Number(row.group || this.selectedGroup),
          translation_key: row.translation_key,
          en: row.en || '',
          same_as_english_pb: isSame,
          pb: row.pb || '',
          group_pb: Number(row.group || this.selectedGroup),
          translation_key_pb: row.translation_key
        };
        this.translationModal.open();
        this.cdr.detectChanges();
      }
    });
  }

  bindCheckboxLogic(): void {
    const formGroup = this.translationModal?.dynamicForm?.form;
    if (formGroup) {
      // Sync Unique Key from EN to PB
      formGroup.get('translation_key')?.valueChanges.subscribe((val) => {
        if (formGroup.get('same_as_english_pb')?.value) {
          formGroup.get('translation_key_pb')?.setValue(val);
        }
      });

      // Sync Group from EN to PB
      formGroup.get('group')?.valueChanges.subscribe((val) => {
        if (formGroup.get('same_as_english_pb')?.value) {
          formGroup.get('group_pb')?.setValue(val);
        }
      });

      // Handle "Same as English" checkbox toggle
      formGroup.get('same_as_english_pb')?.valueChanges.subscribe((isChecked) => {
        const groupPb = formGroup.get('group_pb');
        const keyPb = formGroup.get('translation_key_pb');
        const keyField = this.translationSchema.fields?.find(f => f.name === 'translation_key_pb');
        const groupField = this.translationSchema.fields?.find(f => f.name === 'group_pb');

        if (isChecked) {
          groupPb?.setValue(formGroup.get('group')?.value);
          keyPb?.setValue(formGroup.get('translation_key')?.value);
          groupPb?.disable();
          keyPb?.disable();
          if (keyField) {
            keyField.readonly = true;
            keyField.disabled = true;
          }
          if (groupField) {
            groupField.disabled = true;
          }
        } else {
          groupPb?.enable();
          keyPb?.enable();
          if (keyField) {
            keyField.readonly = false;
            keyField.disabled = false;
          }
          if (groupField) {
            groupField.disabled = false;
          }
        }
      });

      // If user unchecks Same as English and edits PB fields, sync back to EN
      formGroup.get('translation_key_pb')?.valueChanges.subscribe((val) => {
        if (!formGroup.get('same_as_english_pb')?.value && val !== undefined && val !== null) {
          formGroup.get('translation_key')?.setValue(val, { emitEvent: false });
        }
      });

      formGroup.get('group_pb')?.valueChanges.subscribe((val) => {
        if (!formGroup.get('same_as_english_pb')?.value && val !== undefined && val !== null) {
          formGroup.get('group')?.setValue(val, { emitEvent: false });
        }
      });
    }
  }

  onSubmit(formValue: any): void {
    const isSameAsEnglish = !!formValue.same_as_english_pb;
    const groupVal = isSameAsEnglish
      ? formValue.group
      : (formValue.group_pb ?? formValue.group);
    const keyVal = isSameAsEnglish
      ? formValue.translation_key
      : (formValue.translation_key_pb ?? formValue.translation_key);

    const payload = {
      group: Number(groupVal),
      translation_key: keyVal,
      en: formValue.en,
      pb: formValue.pb || ''
    };

    const request$ = (this.isEditMode && this.editingKeyId)
      ? this.api.post<any>(`/admin/translations/${this.editingKeyId}/update`, payload)
      : this.api.post<any>('/admin/translations', payload);

    request$.subscribe({
      next: (res) => {
        const msg = this.isEditMode ? 'Translation updated successfully.' : 'Translation created successfully.';
        this.toast.show('success', res.message || msg, 3000);
        this.translationModal.close();
        this.loadTranslations();
      },
      error: (err) => {
        const action = this.isEditMode ? 'update' : 'create';
        this.toast.show('error', err.error?.message || `Failed to ${action} translation`);
      }
    });
  }

  onModalClosed(): void {
    this.isEditMode = false;
    this.editingKeyId = null;
    this.formInitialData = {};
  }

  onSearchChange(text: string): void {
    this.search = text;
    this.currentPage = 1;
    this.loadTranslations();
  }

  onSortChange(event: any): void {
    this.sortColumn = event.column;
    this.sortDirection = event.direction;
    this.loadTranslations(1);
  }

  onPageSizeChange(size: number): void {
    this.pageSize = size;
    this.currentPage = 1;
    this.loadTranslations();
  }
}
