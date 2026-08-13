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
// declare const tinymce: any;

@Component({
  selector: 'app-tinymce-editor',
  standalone: true,
  templateUrl: './tinymce-editor.component.html',
  styleUrls: ['./tinymce-editor.component.scss']
})
export class TinymceEditorComponent
  implements AfterViewInit, OnDestroy, OnChanges {

  constructor(
    private toast: ToastService
  ) {}

  @ViewChild('editor')
  editor!: ElementRef;

  @ViewChild('fileInput')
  fileInput!: ElementRef<HTMLInputElement>;

  @Input()
  value = '';

  @Output()
  valueChange = new EventEmitter<string>();

  currentEditor: any;

  ngAfterViewInit(): void {

    tinymce.init({

      target: this.editor.nativeElement,

      base_url: '/tinymce/tinymce',

      suffix: '.min',

      license_key: 'gpl',

      promotion: false,

      branding: false,

      height: 450,
        // height: 450,

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



     

      // content_style: `body { font-family: Roboto, "Helvetica Neue", sans-serif;
      //          font-size: 15px; line-height: 1.6; padding: 12px 16px; color: #212121; }`,

      setup: (editor: any) => {

        this.currentEditor = editor;

       

        editor.on('init', () => {

          editor.setContent(this.value || '');

        });

        editor.on('keyup change', () => {

          this.valueChange.emit(editor.getContent());

        });

        editor.ui.registry.addButton('uploadFile', {

          icon: 'upload',

          onAction: () => {

            this.fileInput.nativeElement.click();

          }

        });

      }

    });

  }


  ngOnChanges(changes: SimpleChanges): void {
  if (!changes['value']) {
    return;
  }

  if (!this.currentEditor) {
    return;
  }

  const newValue = changes['value'].currentValue || '';

  if (this.currentEditor.getContent() !== newValue) {
    this.currentEditor.setContent(newValue);
  }
}

  uploadFile(event: any) {

    console.log(event.target.files);

  }

  ngOnDestroy() {

    if (this.currentEditor) {

      this.currentEditor.destroy();

    }

  }



  
  // Called when user picks a file from the OS dialog
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file  = input.files?.[0];
    if (!file || !this.currentEditor) return;

    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (!allowedTypes.includes(file.type)) {
      // this.snackBar.open('Only PDF and DOCX files are allowed.', 'Close', { duration: 3000 });
      this.toast.error(
        'Only PDF and DOCX files are allowed.'
      );
      input.value = '';
      return;
    }

    // Create a temporary object URL and insert a download link into the editor
    const url  = URL.createObjectURL(file);
    const ext  = file.name.split('.').pop()?.toUpperCase() ?? 'FILE';
    const html = `<p>
      <a href="${url}" target="_blank" rel="noopener noreferrer"
         style="display:inline-flex;align-items:center;gap:6px;
                padding:6px 14px;border-radius:6px;
                background:#eff6ff;color:#2563eb;
                border:1px solid #bfdbfe;text-decoration:none;font-weight:500;">
        📎 ${file.name} <span style="font-size:0.75em;opacity:0.7;">[${ext}]</span>
      </a>
    </p>`;

    this.currentEditor.insertContent(html);

    // Reset so the same file can be re-selected if needed
    input.value = '';
  }
}