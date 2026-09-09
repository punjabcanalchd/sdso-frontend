import {
  Component,
  Input,
  OnInit,
  OnChanges,
  OnDestroy,
  SimpleChanges
} from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  ReactiveFormsModule,
  FormControl
} from '@angular/forms';

import { Subscription } from 'rxjs';

import { environment } from '../../../../../environments/environment';


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
export class FileUploadComponent
  implements OnInit, OnChanges, OnDestroy {


  @Input() control!: FormControl;

  @Input() label = '';

  @Input() isEditMode = false;

  @Input() existingFile: string | null = null;

  filePreviewUrl: string | null = null;


  private readonly REQUIRED_WIDTH = 1366;

  private readonly REQUIRED_HEIGHT = 350;


  private dialogOpened = false;

  private controlSubscription?: Subscription;


  // =========================================================
  // INIT
  // =========================================================

 ngOnInit(): void {

  console.log('FileUploadComponent INIT');
  console.log('Edit Mode:', this.isEditMode);
  console.log('Existing File:', this.existingFile);
  console.log('Initial Control Value:', this.control?.value);

  this.subscribeToControl();

  // IMPORTANT:
  // Read the current value immediately.
  this.loadInitialPreview();
}

  // =========================================================
  // INPUT CHANGES
  // =========================================================

ngOnChanges(changes: SimpleChanges): void {

  console.log('FileUpload ngOnChanges');

  if (changes['control']) {

    console.log(
      'NEW CONTROL VALUE:',
      this.control?.value
    );

    this.subscribeToControl();
    this.loadInitialPreview();
  }

  if (changes['existingFile']) {

    console.log(
      'NEW EXISTING FILE:',
      this.existingFile
    );

    if (this.existingFile) {
      this.setExistingImagePreview(
        this.existingFile
      );
    } else {
      this.loadInitialPreview();
    }
  }

  if (changes['isEditMode']) {

    console.log(
      'EDIT MODE:',
      this.isEditMode
    );

    this.loadInitialPreview();
  }
}


  // =========================================================
  // DESTROY
  // =========================================================

  ngOnDestroy(): void {

    console.log(
      'FileUploadComponent DESTROY'
    );


    /*
     * Remove subscription.
     */
    this.controlSubscription?.unsubscribe();


    /*
     * Remove blob URL if one exists.
     */
    this.clearPreview();

  }


  // =========================================================
  // INITIAL PREVIEW
  // =========================================================

private loadInitialPreview(): void {

  if (!this.control) {
    this.clearPreview();
    return;
  }

  const value = this.control.value;

  console.log(
    'Loading initial file preview:',
    value
  );

  // Existing image from API
  if (
    typeof value === 'string' &&
    value.trim() !== ''
  ) {
    this.setExistingImagePreview(value);
    return;
  }

  // New selected file
  if (value instanceof File) {
    this.setFilePreview(value);
    return;
  }

  this.clearPreview();
}
  // =========================================================
  // SET PREVIEW
  // =========================================================

  private setPreview(value: any): void {

    console.log(
      'setPreview value:',
      value
    );


    /*
     * Empty value.
     */
    if (!value) {

      this.clearPreview();

      return;

    }


    /*
     * NEW FILE
     *
     * User selected a new image.
     */
    if (value instanceof File) {

      this.setFilePreview(value);

      return;

    }


    /*
     * EXISTING FILE
     *
     * API returned filename.
     */
    if (
      typeof value === 'string' &&
      value.trim() !== ''
    ) {

      this.setExistingImagePreview(value);

      return;

    }


    /*
     * Handle object values.
     */
    if (value?.fileName) {

      this.setExistingImagePreview(
        value.fileName
      );

      return;

    }


    if (value?.filename) {

      this.setExistingImagePreview(
        value.filename
      );

      return;

    }


    if (value?.name) {

      this.setExistingImagePreview(
        value.name
      );

      return;

    }


    this.clearPreview();

  }


  // =========================================================
  // FILE NAME
  // =========================================================

  get fileName(): string {

    const value = this.control?.value;


    /*
     * New File.
     */
    if (value instanceof File) {

      return value.name;

    }


    /*
     * Existing filename.
     */
    if (
      typeof value === 'string' &&
      value.trim() !== ''
    ) {

      return value.substring(
        value.lastIndexOf('/') + 1
      );

    }


    /*
     * Object.
     */
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


  // =========================================================
  // FILE CLICK
  // =========================================================

  onFileClick(): void {

    this.dialogOpened = true;

  }


  // =========================================================
  // FILE BLUR
  // =========================================================

  onFileBlur(): void {

    if (
      this.dialogOpened &&
      !this.control.value
    ) {

      this.control.markAsTouched();

      this.control.markAsDirty();

    }


    this.dialogOpened = false;

  }


  // =========================================================
  // FILE SELECT
  // =========================================================

  onFileSelect(event: Event): void {

    let input =event.target as HTMLInputElement;


    let file = input.files?.[0];


    if (!file) {

      return;

    }


    console.log('Selected file:', file);


    /*
     * Replace existing filename with
     * newly selected File.
     */
    this.control.setValue(file);

    this.control.markAsDirty();

    this.control.markAsTouched();


    /*
     * Immediately show new image.
     */
    this.setFilePreview(file);


    /*
     * Validate dimensions.
     */
    this.validateImageDimensions(
      file,
      input
    );

  }


  // =========================================================
  // NEW FILE PREVIEW
  // =========================================================

  private setFilePreview(file: File): void {

    /*
     * Remove previous blob URL.
     */
    if (
      this.filePreviewUrl &&
      this.filePreviewUrl.startsWith('blob:')
    ) {

      URL.revokeObjectURL(
        this.filePreviewUrl
      );

    }


    if (
      file.type &&
      file.type.startsWith('image/')
    ) {

      this.filePreviewUrl =
        URL.createObjectURL(file);


      console.log(
        'New file preview URL:',
        this.filePreviewUrl
      );

    } else {

      this.filePreviewUrl = null;

    }

  }


  // =========================================================
  // EXISTING IMAGE PREVIEW
  // =========================================================

  private setExistingImagePreview(
    filename: string
  ): void {

    if (!filename) {

      this.clearPreview();

      return;

    }


    /*
     * If API ever returns a complete path,
     * extract only the filename.
     */
    filename =
      filename.split('/').pop() || filename;


    /*
     * Remove /api from:
     *
     * http://localhost:8000/api
     *
     * Result:
     *
     * http://localhost:8000
     */
    const baseUrl =
      environment.apiUrl.replace(
        /\/api\/?$/,
        ''
      );


    /*
     * Backend stores the image using:
     *
     * ImageResizer::store(
     *     $data['page_banner'],
     *     'uploads',
     *     $fileName
     * );
     *
     * Therefore we currently use:
     *
     * /uploads/{filename}
     */
    this.filePreviewUrl =
      `${baseUrl}/uploads/${filename}`;


    console.log(
      'Existing image filename:',
      filename
    );


    console.log(
      'Existing image URL:',
      this.filePreviewUrl
    );

  }


  // =========================================================
  // CLEAR PREVIEW
  // =========================================================

  private clearPreview(): void {

    if (
      this.filePreviewUrl &&
      this.filePreviewUrl.startsWith('blob:')
    ) {

      URL.revokeObjectURL(
        this.filePreviewUrl
      );

    }


    this.filePreviewUrl = null;

  }


  // =========================================================
  // IMAGE DIMENSION VALIDATION
  // =========================================================

  private validateImageDimensions(
  file: File,
  input: HTMLInputElement
): void {

  if (!file.type.startsWith('image/')) {
    return;
  }

  const image = new Image();
  const objectUrl = URL.createObjectURL(file);

  image.onload = () => {

    URL.revokeObjectURL(objectUrl);

    const validDimensions =
      image.width === this.REQUIRED_WIDTH &&
      image.height === this.REQUIRED_HEIGHT;

    if (!validDimensions) {

      this.control.setErrors({
        ...(this.control.errors || {}),
        imageDimensions: {
          requiredWidth: this.REQUIRED_WIDTH,
          requiredHeight: this.REQUIRED_HEIGHT,
          actualWidth: image.width,
          actualHeight: image.height
        }
      });

      this.control.markAsTouched();
      this.control.markAsDirty();

      console.log(
        `Invalid dimensions: ${image.width} x ${image.height}`
      );

      return;
    }

    // ==========================================
    // VALID IMAGE
    // ==========================================

    this.removeError('imageDimensions');

    // Only now replace existing image
    this.control.setValue(file);

    this.control.markAsDirty();
    this.control.markAsTouched();

    console.log(
      'Valid page banner selected:',
      file.name
    );
  };

  image.onerror = () => {

    URL.revokeObjectURL(objectUrl);

    this.control.setErrors({
      ...(this.control.errors || {}),
      imageDimensions: {
        requiredWidth: this.REQUIRED_WIDTH,
        requiredHeight: this.REQUIRED_HEIGHT
      }
    });

    input.value = '';

    this.clearPreview();

    this.control.markAsTouched();
    this.control.markAsDirty();
  };

  image.src = objectUrl;
}

  // =========================================================
  // REMOVE ERROR
  // =========================================================

  private removeError(
    errorKey: string
  ): void {

    const errors =
      this.control.errors;


    if (!errors) {

      return;

    }


    const {
      [errorKey]: removed,
      ...remainingErrors
    } = errors;


    this.control.setErrors(

      Object.keys(
        remainingErrors
      ).length > 0

        ? remainingErrors

        : null

    );

  }




  private subscribeToControl(): void {

  this.controlSubscription?.unsubscribe();

  if (!this.control) {
    return;
  }

  this.controlSubscription =
    this.control.valueChanges.subscribe(value => {

      console.log(
        'FileUpload control value changed:',
        value
      );

      this.setPreview(value);
    });
}
}