import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})

export class FileUploadComponent {
  @Input() control!: FormControl;
  @Input() label = '';

  private dialogOpened = false;

  onFileClick() {
    this.dialogOpened = true;
  }

 get fileName(): string {
    const value = this.control?.value;

    if (value instanceof File) {
      return value.name;
    }

    // If value is an existing string path/name from the backend (Edit mode)
    if (typeof value === 'string' && value.trim() !== '') {
      // Extracts just the file name if it's a URL/path, or returns the string directly
      return value.substring(value.lastIndexOf('/') + 1);
    }

    return value?.fileName || '';

    // return value?.fileName || '';
  }

  onFileBlur() {
    if (this.dialogOpened && !this.control.value) {
      this.control.markAsTouched();
      this.control.markAsDirty();
      this.control.updateValueAndValidity();
    }

    this.dialogOpened = false;
  }

  onFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    this.control.setValue(file);
    this.control.markAsDirty();
    this.control.markAsTouched();
    this.control.updateValueAndValidity();

    if (this.control.invalid) {
      input.value = '';
    //  this.control.setValue(null);
      return;
    }

    // this.fileName = file.name;
  }
}
