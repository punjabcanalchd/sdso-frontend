import { Component, HostListener,ChangeDetectorRef,  OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-accessibility-bar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './accessibility-bar.component.html',
  styleUrl: './accessibility-bar.component.scss',
})
export class AccessibilityBarComponent implements OnDestroy {

  private router = inject(Router);

  // ==========================================
  // Properties
  // ==========================================

  currentFontSize = 100;
  fontDropdownOpen = false;
  searchOpen = false;

  searchQuery = '';
  currentLangLabel = 'English';
  currentDateTime = new Date();
  private intervalId: any;
  private cdr = inject(ChangeDetectorRef);

  fontOptions = [
    { label: 'Decrease (A-)', value: 90 },
    { label: 'Normal (A)', value: 100 },
    { label: 'Large (A+)', value: 115 },
    { label: 'Larger (A++)', value: 130 },
  ];

  // ==========================================
  // Getters
  // ==========================================

  get isSearchOpen(): boolean {
    return this.searchOpen;
  }

  ngOnInit(): void {
    this.intervalId = setInterval(() => {
      this.currentDateTime = new Date();
      this.cdr.detectChanges();
    }, 1000);
  }

  // ==========================================
  // Clock
  // ==========================================

  currentTime(): string {
    return new Date().toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  }

  // ==========================================
  // Skip to Main Content
  // ==========================================

  scrollToMainContent(event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    const main = document.getElementById('main-content');

    if (main) {
      main.focus();
      main.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }

  // ==========================================
  // Font Size
  // ==========================================

  setFontSize(value: number): void {
    this.currentFontSize = value;
    document.documentElement.style.fontSize = `${value}%`;
    this.fontDropdownOpen = false;
  }

  increaseFontSize(): void {
    if (this.currentFontSize < 130) {
      this.setFontSize(this.currentFontSize + 15);
    }
  }

  decreaseFontSize(): void {
    if (this.currentFontSize > 90) {
      this.setFontSize(this.currentFontSize - 15);
    }
  }

  getFontSizeLabel(): string {
    switch (this.currentFontSize) {
      case 90:
        return 'Small';
      case 100:
        return 'Normal';
      case 115:
        return 'Large';
      case 130:
        return 'Extra Large';
      default:
        return `${this.currentFontSize}%`;
    }
  }

  toggleFontDropdown(): void {
    this.fontDropdownOpen = !this.fontDropdownOpen;
    this.searchOpen = false;
  }

  // ==========================================
  // Search
  // ==========================================

  toggleSearch(): void {
    this.searchOpen = !this.searchOpen;
    this.fontDropdownOpen = false;
  }

  onSearch(event: Event): void {
    event.preventDefault();
    this.executeSearch(this.searchQuery);
  }

  executeSearch(query: string): void {
    if (!query?.trim()) {
      return;
    }

    this.searchOpen = false;

    this.router.navigate(['/search'], {
      queryParams: { q: query.trim() },
    });

    console.log('Search:', query);
  }

  // ==========================================
  // Language
  // ==========================================

  toggleLanguage(): void {
    this.currentLangLabel =
      this.currentLangLabel === 'English'
        ? 'ਪੰਜਾਬੀ'
        : 'English';
  }

  // ==========================================
  // High Contrast
  // ==========================================

  toggleHighContrast(): void {
    document.body.classList.toggle('high-contrast');
  }

  // ==========================================
  // Close dropdowns when clicking outside
  // ==========================================

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;

    if (!target.closest('.position-relative')) {
      this.fontDropdownOpen = false;
      this.searchOpen = false;
    }
  }

  // ==========================================
  // Cleanup
  // ==========================================

  ngOnDestroy(): void {
    // Cleanup if required in future
  }
}