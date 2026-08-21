import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  AfterViewInit,
  OnDestroy,
  OnChanges,
  SimpleChanges
} from '@angular/core';

import { ToastService } from '../../services/toast.service';

import tinymce from 'tinymce';
import 'tinymce/icons/default';
import 'tinymce/themes/silver';
import 'tinymce/models/dom';

import 'tinymce/plugins/advlist';
import 'tinymce/plugins/autolink';
import 'tinymce/plugins/lists';
import 'tinymce/plugins/link';
import 'tinymce/plugins/image';
import 'tinymce/plugins/charmap';
import 'tinymce/plugins/anchor';
import 'tinymce/plugins/searchreplace';
import 'tinymce/plugins/visualblocks';
import 'tinymce/plugins/code';
import 'tinymce/plugins/fullscreen';
import 'tinymce/plugins/insertdatetime';
import 'tinymce/plugins/media';
import 'tinymce/plugins/table';
import 'tinymce/plugins/preview';
import 'tinymce/plugins/help';
import 'tinymce/plugins/wordcount';

@Component({
  selector: 'app-tinymce-editor',
  standalone: true,
  templateUrl: './tinymce-editor.component.html',
  styleUrls: ['./tinymce-editor.component.scss']
})
export class TinymceEditorComponent
  implements AfterViewInit, OnDestroy, OnChanges {

  @ViewChild('editor')
  editor!: ElementRef;

  @ViewChild('fileInput')
  fileInput!: ElementRef<HTMLInputElement>;

  @Input()
  value = '';

  @Output()
  valueChange = new EventEmitter<string>();

  currentEditor: any = null;

  editorInitialized = false;

  private pendingValue = '';

  constructor(
    private toast: ToastService
  ) {}

  // ---------------------------------------------------------
  // TinyMCE INITIALIZATION
  // ---------------------------------------------------------

  ngAfterViewInit(): void {

    tinymce.init({

      target: this.editor.nativeElement,

      base_url: '/tinymce/tinymce',

      suffix: '.min',

      license_key: 'gpl',

      promotion: false,

      branding: false,

      height: 450,

      toolbar_mode: 'wrap',

      plugins: [
        'advlist',
        'autolink',
        'lists',
        'link',
        'image',
        'charmap',
        'anchor',
        'searchreplace',
        'visualblocks',
        'code',
        'fullscreen',
        'insertdatetime',
        'media',
        'table',
        'preview',
        'help',
        'wordcount'
      ],

      toolbar:
        'undo redo | blocks | bold italic underline forecolor backcolor | ' +
        'alignleft aligncenter alignright alignjustify | ' +
        'bullist numlist outdent indent | link image media table | ' +
        'uploadFile | code fullscreen preview | removeformat | help',

      skin: 'oxide',

      setup: (editor: any) => {

        this.currentEditor = editor;

        // -----------------------------------------------
        // EDITOR INITIALIZED
        // -----------------------------------------------

        editor.on('init', () => {

          this.editorInitialized = true;

          const initialValue =
            this.pendingValue || this.value || '';          

          editor.setContent(initialValue);

          this.pendingValue = '';
        });

        // -----------------------------------------------
        // EDITOR VALUE CHANGED
        // -----------------------------------------------

        editor.on('input change undo redo', () => {

          const content = editor.getContent();

          this.valueChange.emit(content);
        });

        // -----------------------------------------------
        // UPLOAD FILE BUTTON
        // -----------------------------------------------

        editor.ui.registry.addButton('uploadFile', {

          icon: 'upload',

          onAction: () => {

            this.fileInput.nativeElement.click();

          }

        });

      }

    });
  }

  // ---------------------------------------------------------
  // INPUT VALUE CHANGE
  // ---------------------------------------------------------

  ngOnChanges(changes: SimpleChanges): void {

    if (!changes['value']) {
      return;
    }

    const newValue =
      changes['value'].currentValue || '';

    // TinyMCE is not initialized yet
    if (!this.currentEditor || !this.editorInitialized) {

      this.pendingValue = newValue;

      return;
    }

    // TinyMCE is already initialized
    const currentContent =
      this.currentEditor.getContent();

    if (currentContent !== newValue) {   

      this.currentEditor.setContent(newValue);
    }
  }

  // ---------------------------------------------------------
  // FILE UPLOAD
  // ---------------------------------------------------------

  uploadFile(event: any): void {
 
  }

  // ---------------------------------------------------------
  // FILE SELECTED
  // ---------------------------------------------------------

  onFileSelected(event: Event): void {

    const input =
      event.target as HTMLInputElement;

    const file =
      input.files?.[0];

    if (!file || !this.currentEditor) {
      return;
    }

    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (!allowedTypes.includes(file.type)) {

      this.toast.error(
        'Only PDF and DOCX files are allowed.'
      );

      input.value = '';

      return;
    }

    const url =
      URL.createObjectURL(file);

    const ext =
      file.name
        .split('.')
        .pop()
        ?.toUpperCase() ?? 'FILE';

    const html = `
      <p>
        <a
          href="${url}"
          target="_blank"
          rel="noopener noreferrer"
          style="
            display:inline-flex;
            align-items:center;
            gap:6px;
            padding:6px 14px;
            border-radius:6px;
            background:#eff6ff;
            color:#2563eb;
            border:1px solid #bfdbfe;
            text-decoration:none;
            font-weight:500;
          "
        >
          📎 ${file.name}

          <span
            style="
              font-size:0.75em;
              opacity:0.7;
            "
          >
            [${ext}]
          </span>
        </a>
      </p>
    `;

    this.currentEditor.insertContent(html);

    input.value = '';
  }

  // ---------------------------------------------------------
  // DESTROY
  // ---------------------------------------------------------

  ngOnDestroy(): void {

    if (this.currentEditor) {

      this.currentEditor.destroy();

      this.currentEditor = null;
    }

    this.editorInitialized = false;

    this.pendingValue = '';
  }
}