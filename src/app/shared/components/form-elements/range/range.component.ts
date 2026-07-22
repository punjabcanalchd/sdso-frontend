import {
  Component,
  Input,
  ElementRef,
  AfterViewInit,
  ViewChild
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-range',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './range.component.html',
  styleUrls: ['./range.component.css']
})
export class RangeComponent implements AfterViewInit {
  @Input() minControl!: FormControl;
  @Input() maxControl!: FormControl;
  @Input() min: number = 0;
  @Input() max: number = 100;
  @Input() step: number = 1;
  @Input() label: string = '';
  currentTheme : any ='';

  
  @ViewChild('track') track!: ElementRef<HTMLDivElement>;
  @ViewChild('minHandle') minHandle!: ElementRef<HTMLDivElement>;
  @ViewChild('maxHandle') maxHandle!: ElementRef<HTMLDivElement>;
  @ViewChild('selectedRange') selectedRange!: ElementRef<HTMLDivElement>;
  
  ngAfterViewInit() {
    this.updateHandles();
    
    this.minControl.valueChanges.subscribe(() => this.updateHandles());
    this.maxControl.valueChanges.subscribe(() => this.updateHandles());

  }
  ngOnInit() {
    this.currentTheme = document.body.getAttribute('data-theme') || '';
    console.log("Current Theme:", this.currentTheme);
  }

  private valueToPercent(value: number): number {
    return ((value - this.min) / (this.max - this.min)) * 100;
  }

  updateHandles() {
    const min = this.minControl.value;
    const max = this.maxControl.value;

    const minPercent = this.valueToPercent(min);
    const maxPercent = this.valueToPercent(max);

    this.minHandle.nativeElement.style.left = `${minPercent}%`;
    this.maxHandle.nativeElement.style.left = `${maxPercent}%`;

    this.selectedRange.nativeElement.style.left = `${minPercent}%`;
    this.selectedRange.nativeElement.style.width = `${maxPercent - minPercent}%`;
  }

  onMinInputChange(event: Event) {
    const val = Number((event.target as HTMLInputElement).value);
    if (val > this.maxControl.value) {
      this.minControl.setValue(this.maxControl.value);
    } else {
      this.minControl.setValue(val);
    }
  }

  onMaxInputChange(event: Event) {
    const val = Number((event.target as HTMLInputElement).value);
    if (val < this.minControl.value) {
      this.maxControl.setValue(this.minControl.value);
    } else {
      this.maxControl.setValue(val);
    }
  }

  onHandleDrag(event: MouseEvent, handle: 'min' | 'max') {
    event.preventDefault();
    const moveListener = (e: MouseEvent) => this.handleMove(e, handle);
    const upListener = () => {
      document.removeEventListener('mousemove', moveListener);
      document.removeEventListener('mouseup', upListener);
    };

    document.addEventListener('mousemove', moveListener);
    document.addEventListener('mouseup', upListener);
  }

  private handleMove(event: MouseEvent, handle: 'min' | 'max') {
    const rect = this.track.nativeElement.getBoundingClientRect();

    let percent = ((event.clientX - rect.left) / rect.width) * 100;
    percent = Math.min(100, Math.max(0, percent));

    const value = Math.round((percent / 100) * (this.max - this.min) + this.min);

    if (handle === 'min') {
      this.minControl.setValue(Math.min(value, this.maxControl.value));
    } else {
      this.maxControl.setValue(Math.max(value, this.minControl.value));
    }
  }
}
