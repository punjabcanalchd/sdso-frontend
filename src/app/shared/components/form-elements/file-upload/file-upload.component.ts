import {
  Component,
  Input,
  OnInit,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
  inject
} from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  ReactiveFormsModule,
  FormControl
} from '@angular/forms';

import { Subscription } from 'rxjs';

import { environment } from '../../../../../environments/environment';
import { ToastService } from '../../../services/toast.service';
import { FormField } from '../../../../core/models/form-schema.model';

export interface ExistingMediaFile {
  id?: string | number;
  name: string;
  url: string;
}

export interface NewMediaFile {
  file: File;
  name: string;
  previewUrl: string;
}

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent implements OnInit, OnChanges, OnDestroy {

  @Input() control!: FormControl;
  @Input() field?: FormField;
  @Input() label = '';
  @Input() isEditMode = false;
  @Input() multiple = false;
  @Input() existingFile: string | null = null;
  @Input() requiredWidth?: number | null = null;
  @Input() requiredHeight?: number | null = null;
  @Input() accept?: string;
  @Input() allowedExtensions?: string[];
  @Input() maxSizeMB?: number;

  get resolvedAllowedExtensions(): string[] {
    if (this.allowedExtensions && this.allowedExtensions.length > 0) {
      return this.allowedExtensions.map(e => e.toLowerCase().replace(/^\./, ''));
    }
    if (this.field?.allowedExtensions && this.field.allowedExtensions.length > 0) {
      return this.field.allowedExtensions.map(e => e.toLowerCase().replace(/^\./, ''));
    }
    const acceptStr = this.accept || this.field?.accept;
    if (acceptStr) {
      const parts = acceptStr.split(',').map(s => s.trim().toLowerCase().replace(/^\./, ''));
      const parsed: string[] = [];
      for (const p of parts) {
        if (p === 'image/*') {
          parsed.push('jpg', 'jpeg', 'png', 'webp');
        } else if (p) {
          parsed.push(p);
        }
      }
      if (parsed.length > 0) return Array.from(new Set(parsed));
    }
    const fname = (this.field?.name || '').toLowerCase();
    const flabel = (this.field?.label || this.label || '').toLowerCase();
    if (fname === 'site_icon' || fname === 'website_icon') {
      return ['ico', 'png', 'jpg', 'jpeg', 'webp'];
    }
    if (fname.includes('pdf') || flabel.includes('pdf')) {
      return ['pdf'];
    }
    if (fname.includes('notice') || fname.includes('circular') || fname.includes('document')) {
      return ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png'];
    }
    return ['jpg', 'jpeg', 'png', 'webp'];
  }

  get resolvedMaxSizeMB(): number {
    if (this.maxSizeMB && this.maxSizeMB > 0) return this.maxSizeMB;
    if (this.field?.maxSizeMB && this.field.maxSizeMB > 0) return this.field.maxSizeMB;
    return 2;
  }

  get guidanceText(): string {
    const exts = this.resolvedAllowedExtensions.map(e => e.toUpperCase()).join(', ');
    const size = `${this.resolvedMaxSizeMB} MB`;
    let text = `Allowed formats: ${exts} | Max size: ${size}`;
    if (this.requiredWidth && this.requiredHeight) {
      text += ` | Required dimensions: ${this.requiredWidth}x${this.requiredHeight}px`;
    }
    return text;
  }

  filePreviewUrl: string | null = null;

  // State for multiple files
  existingFilesList: ExistingMediaFile[] = [];
  newFilesList: NewMediaFile[] = [];
  deletedFilesList: Array<string | number> = [];
  fileErrorMessage: string | null = null;

  private toast = inject(ToastService);

  constructor(private cdr: ChangeDetectorRef) { }

  private dialogOpened = false;
  private controlSubscription?: Subscription;

  @ViewChild('fileInput') fileInput?: ElementRef<HTMLInputElement>;

  // =========================================================
  // INIT
  // =========================================================

  ngOnInit(): void {
    this.subscribeToControl();
    this.loadInitialPreview();

    // Reset listener for native input:
    this.control?.valueChanges.subscribe(val => {
      if (!val && this.fileInput?.nativeElement) {
        this.fileInput.nativeElement.value = '';
      }
    });
  }

  // =========================================================
  // INPUT CHANGES
  // =========================================================

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['control']) {
      this.subscribeToControl();
      this.loadInitialPreview();
    }

    if (changes['existingFile']) {
      if (this.existingFile) {
        this.setExistingImagePreview(this.existingFile);
      } else {
        this.loadInitialPreview();
      }
    }

    if (changes['isEditMode']) {
      this.loadInitialPreview();
    }
  }

  // =========================================================
  // DESTROY
  // =========================================================

  ngOnDestroy(): void {
    this.controlSubscription?.unsubscribe();
    this.clearPreview();
    this.clearNewFiles();
  }

  // =========================================================
  // INITIAL PREVIEW
  // =========================================================

  private loadInitialPreview(): void {
    if (!this.control) {
      this.clearPreview();
      if (this.multiple) {
        this.existingFilesList = [];
        this.clearNewFiles();
        this.deletedFilesList = [];
      }
      return;
    }

    const value = this.control.value;

    if (this.multiple) {
      this.handleMultipleValue(value);
      this.cdr.detectChanges();
      return;
    }

    // Existing image from API
    if (typeof value === 'string' && value.trim() !== '') {
      this.setExistingImagePreview(value);
      this.cdr.detectChanges();
      return;
    }

    // New selected file
    if (value instanceof File) {
      this.setFilePreview(value);
      this.cdr.detectChanges();
      return;
    }

    this.clearPreview();
    this.cdr.detectChanges();
  }

  // =========================================================
  // SET PREVIEW
  // =========================================================

  private setPreview(value: any): void {
    if (this.multiple) {
      this.handleMultipleValue(value);
      return;
    }

    if (!value) {
      this.clearPreview();
      return;
    }

    if (value instanceof File) {
      this.setFilePreview(value);
      return;
    }

    if (typeof value === 'string' && value.trim() !== '') {
      this.setExistingImagePreview(value);
      return;
    }

    if (value?.fileName) {
      this.setExistingImagePreview(value.fileName);
      return;
    }

    if (value?.filename) {
      this.setExistingImagePreview(value.filename);
      return;
    }

    if (value?.name) {
      this.setExistingImagePreview(value.name);
      return;
    }

    this.clearPreview();
  }

  // =========================================================
  // MULTIPLE FILE HANDLING
  // =========================================================

  private handleMultipleValue(value: any): void {
    if (!value) {
      this.existingFilesList = [];
      this.clearNewFiles();
      this.deletedFilesList = [];
      return;
    }

    // If already wrapped in internal structure { files, existing, deleted }
    if (typeof value === 'object' && !Array.isArray(value) && !(value instanceof File)) {
      if (Array.isArray(value.existing)) {
        this.existingFilesList = value.existing;
      }
      if (Array.isArray(value.deleted)) {
        this.deletedFilesList = value.deleted;
      }
      return;
    }

    // If an array of items (from API cat.images or string list)
    if (Array.isArray(value)) {
      this.existingFilesList = value.map((item: any, idx: number) => {
        if (typeof item === 'string') {
          return {
            id: item,
            name: item.substring(item.lastIndexOf('/') + 1),
            url: this.resolveFileUrl(item)
          };
        }
        const name = item.file_name || item.name || item.select_img || item.url || `Image ${idx + 1}`;
        const rawUrl = item.url || item.file_name || item.select_img || name;
        return {
          id: item.id ?? item.mediagal_id ?? name,
          name: typeof name === 'string' ? name.substring(name.lastIndexOf('/') + 1) : `Image ${idx + 1}`,
          url: this.resolveFileUrl(rawUrl)
        };
      });
      return;
    }

    // If a single string
    if (typeof value === 'string' && value.trim() !== '') {
      this.existingFilesList = [{
        id: value,
        name: value.substring(value.lastIndexOf('/') + 1),
        url: this.resolveFileUrl(value)
      }];
    }
  }

  removeExistingImage(index: number, event?: Event): void {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    const removed = this.existingFilesList.splice(index, 1)[0];
    if (removed && removed.id !== undefined && removed.id !== null) {
      this.deletedFilesList.push(removed.id);
    } else if (removed && removed.name) {
      this.deletedFilesList.push(removed.name);
    }
    this.updateMultipleControlValue();
  }

  removeNewImage(index: number, event?: Event): void {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    const removed = this.newFilesList.splice(index, 1)[0];
    if (removed?.previewUrl && removed.previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(removed.previewUrl);
    }
    this.updateMultipleControlValue();
  }

  private updateMultipleControlValue(): void {
    const val = {
      files: this.newFilesList.map(n => n.file),
      existing: this.existingFilesList,
      deleted: this.deletedFilesList
    };

    if (this.newFilesList.length === 0 && this.existingFilesList.length === 0) {
      this.control.setValue(null);
    } else {
      this.control.setValue(val);
    }

    this.control.markAsDirty();
    this.control.markAsTouched();
    this.cdr.detectChanges();
  }

  private clearNewFiles(): void {
    for (const item of this.newFilesList) {
      if (item.previewUrl && item.previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(item.previewUrl);
      }
    }
    this.newFilesList = [];
  }

  resolveFileUrl(path: string): string {
    if (!path) return '';
    if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('blob:')) {
      return path;
    }
    const cleanPath = path.replace(/^\/+/, '');
    if (cleanPath.startsWith('uploads/')) {
      return `${environment.baseUrl}/${cleanPath}`;
    }
    const uploadUrl = environment.uploadUrl || `${environment.baseUrl}/uploads`;
    return `${uploadUrl}/${cleanPath}`;
  }

  openUrl(url: string, event?: Event): void {
    if (event) event.preventDefault();
    if (!url) return;
    window.open(url, '_blank');
  }

  // =========================================================
  // FILE NAME
  // =========================================================

  get fileName(): string {
    const value = this.control?.value;

    if (value instanceof File) {
      return value.name;
    }

    if (typeof value === 'string' && value.trim() !== '') {
      return value.substring(value.lastIndexOf('/') + 1);
    }

    if (value?.fileName) {
      return value.fileName;
    }

    if (value?.filename) {
      return value.filename;
    }

    if (value?.name) {
      return value.name;
    }

    return '';
  }

  openFile(event?: Event): void {
    if (event) event.preventDefault();

    if (this.filePreviewUrl) {
      window.open(this.filePreviewUrl, '_blank');
      return;
    }

    const value = this.control?.value;
    if (!value) return;

    if (value instanceof File) {
      window.open(URL.createObjectURL(value), '_blank');
    } else if (typeof value === 'string') {
      const url = this.resolveFileUrl(value);
      window.open(url, '_blank');
    }
  }

  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    if (target) {
      target.onerror = null;
      target.src = '/assets/images/placeholder.png';
    }
  }

  // =========================================================
  // FILE CLICK / BLUR / SELECT
  // =========================================================

  onFileClick(): void {
    this.dialogOpened = true;
  }

  onFileBlur(): void {
    if (this.dialogOpened && !this.control.value) {
      this.control.markAsTouched();
      this.control.markAsDirty();
    }
    this.dialogOpened = false;
  }

  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      return;
    }

    this.fileErrorMessage = null;
    this.removeError('serverError');
    this.removeError('validationMessage');

    const allowedExtensions = this.resolvedAllowedExtensions;
    const maxSizeBytes = this.resolvedMaxSizeMB * 1024 * 1024;
    const allowedFormatted = allowedExtensions.map(e => e.toUpperCase()).join(', ');
    const blockedExtensions = ['exe', 'bat', 'cmd', 'com', 'msi', 'js', 'vbs', 'ps1', 'sh', 'php', 'jsp', 'asp', 'aspx', 'jar'];

    if (this.multiple) {
      const selectedFiles: File[] = Array.from(input.files);

      for (const file of selectedFiles) {
        const ext = file.name.split('.').pop()?.toLowerCase() || '';

        if (blockedExtensions.includes(ext)) {
          this.fileErrorMessage = `File "${file.name}" is not allowed. Executable or script files are prohibited.`;
          this.control?.setErrors({ validationMessage: this.fileErrorMessage });
          this.control?.markAsDirty();
          this.control?.markAsTouched();
          this.toast.show('warning', this.fileErrorMessage, 4000);
          input.value = '';
          this.cdr.detectChanges();
          return;
        }

        if (!allowedExtensions.includes(ext)) {
          this.fileErrorMessage = `Invalid format for "${file.name}". Allowed formats: ${allowedFormatted}.`;
          this.control?.setErrors({ validationMessage: this.fileErrorMessage });
          this.control?.markAsDirty();
          this.control?.markAsTouched();
          this.toast.show('warning', this.fileErrorMessage, 4000);
          input.value = '';
          this.cdr.detectChanges();
          return;
        }

        if (file.size > maxSizeBytes) {
          this.fileErrorMessage = `File "${file.name}" exceeds the maximum allowed size of ${this.resolvedMaxSizeMB} MB. Please select a file under ${this.resolvedMaxSizeMB} MB.`;
          this.control?.setErrors({ validationMessage: this.fileErrorMessage });
          this.control?.markAsDirty();
          this.control?.markAsTouched();
          this.toast.show('warning', this.fileErrorMessage, 4000);
          input.value = '';
          this.cdr.detectChanges();
          return;
        }

        const previewUrl = file.type && file.type.startsWith('image/')
          ? URL.createObjectURL(file)
          : '';
        this.newFilesList.push({
          file: file,
          name: file.name,
          previewUrl: previewUrl
        });
      }

      this.fileErrorMessage = null;
      input.value = '';
      this.updateMultipleControlValue();
      return;
    }

    const file = input.files[0];
    if (!file) return;

    const ext = file.name.split('.').pop()?.toLowerCase() || '';

    if (blockedExtensions.includes(ext)) {
      this.fileErrorMessage = `File "${file.name}" is not allowed. Executable or script files are prohibited.`;
      this.control?.setErrors({ validationMessage: this.fileErrorMessage });
      this.control?.markAsDirty();
      this.control?.markAsTouched();
      this.toast.show('warning', this.fileErrorMessage, 4000);
      input.value = '';
      this.cdr.detectChanges();
      return;
    }

    if (!allowedExtensions.includes(ext)) {
      this.fileErrorMessage = `Invalid format for "${file.name}". Allowed formats: ${allowedFormatted}.`;
      this.control?.setErrors({ validationMessage: this.fileErrorMessage });
      this.control?.markAsDirty();
      this.control?.markAsTouched();
      this.toast.show('warning', this.fileErrorMessage, 4000);
      input.value = '';
      this.cdr.detectChanges();
      return;
    }

    if (file.size > maxSizeBytes) {
      this.fileErrorMessage = `File "${file.name}" exceeds the maximum allowed size of ${this.resolvedMaxSizeMB} MB. Please select a file under ${this.resolvedMaxSizeMB} MB.`;
      this.control?.setErrors({ validationMessage: this.fileErrorMessage });
      this.control?.markAsDirty();
      this.control?.markAsTouched();
      this.toast.show('warning', this.fileErrorMessage, 4000);
      input.value = '';
      this.cdr.detectChanges();
      return;
    }

    this.fileErrorMessage = null;
    this.control.setValue(file);
    this.control.markAsDirty();
    this.control.markAsTouched();
    this.setFilePreview(file);

    if (this.requiredWidth && this.requiredHeight) {
      this.validateImageDimensions(file, input);
    }
  }

  // =========================================================
  // NEW FILE PREVIEW
  // =========================================================

  private setFilePreview(file: File): void {
    if (this.filePreviewUrl && this.filePreviewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(this.filePreviewUrl);
    }

    if (file.type && file.type.startsWith('image/')) {
      this.filePreviewUrl = URL.createObjectURL(file);
    } else {
      this.filePreviewUrl = null;
    }
  }

  // =========================================================
  // EXISTING IMAGE PREVIEW
  // =========================================================

  private setExistingImagePreview(filename: string): void {
    if (!filename) {
      this.clearPreview();
      return;
    }
    this.filePreviewUrl = this.resolveFileUrl(filename);
  }

  // =========================================================
  // CLEAR PREVIEW
  // =========================================================

  private clearPreview(): void {
    if (this.filePreviewUrl && this.filePreviewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(this.filePreviewUrl);
    }
    this.filePreviewUrl = null;
    this.cdr.detectChanges();
  }

  // =========================================================
  // IMAGE DIMENSION VALIDATION
  // =========================================================

  private validateImageDimensions(file: File, input: HTMLInputElement): void {
    if (!file.type.startsWith('image/')) {
      return;
    }

    const image = new Image();
    const objectUrl = URL.createObjectURL(file);

    image.onload = () => {
      URL.revokeObjectURL(objectUrl);

      if (this.requiredWidth && this.requiredHeight) {
        const validDimensions =
          image.width === this.requiredWidth &&
          image.height === this.requiredHeight;

        if (!validDimensions) {
          this.control.setErrors({
            ...(this.control.errors || {}),
            imageDimensions: {
              requiredWidth: this.requiredWidth,
              requiredHeight: this.requiredHeight,
              actualWidth: image.width,
              actualHeight: image.height
            }
          });
          this.control.markAsTouched();
          this.control.markAsDirty();
          return;
        }
      }

      this.removeError('imageDimensions');
      this.control.setValue(file);
      this.control.markAsDirty();
      this.control.markAsTouched();
    };

    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      this.control.setErrors({
        ...(this.control.errors || {}),
        imageDimensions: {
          requiredWidth: this.requiredWidth ?? 1366,
          requiredHeight: this.requiredHeight ?? 350
        }
      });
      input.value = '';
      this.clearPreview();
      this.control.markAsTouched();
      this.control.markAsDirty();
    };

    image.src = objectUrl;
  }

  private removeError(errorKey: string): void {
    const errors = this.control.errors;
    if (!errors) return;

    const { [errorKey]: removed, ...remainingErrors } = errors;
    this.control.setErrors(Object.keys(remainingErrors).length > 0 ? remainingErrors : null);
  }

  private subscribeToControl(): void {
    this.controlSubscription?.unsubscribe();
    if (!this.control) return;

    this.controlSubscription = this.control.valueChanges.subscribe(value => {
      this.setPreview(value);
      this.cdr.detectChanges();
    });
  }

  clearFile(event?: Event): void {
    if (event) event.preventDefault();
    if (this.fileInput?.nativeElement) {
      this.fileInput.nativeElement.value = '';
    }
    this.control?.setValue(null);
    this.control?.markAsDirty();
    this.control?.markAsTouched();
    this.clearPreview();
    if (this.multiple) {
      this.existingFilesList = [];
      this.clearNewFiles();
      this.deletedFilesList = [];
    }
  }
}
