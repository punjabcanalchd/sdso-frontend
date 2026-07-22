import { Component, HostListener, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink,Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-accessibility-bar',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './accessibility-bar.component.html',
  styleUrl: './accessibility-bar.component.scss',
})
export class AccessibilityBarComponent implements OnDestroy {
  currentFontSize = 100;
  fontDropdownOpen = false;

  private router = inject(Router);
  searchOpen = false;

  fontOptions = [
    { label: 'Decrease (A-)', value: 90 },
    { label: 'Normal (A)',    value: 100 },
    { label: 'Large (A+)',    value: 115 },
    { label: 'Larger (A++)',  value: 130 },
  ];

scrollToMainContent(event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    const mainContentElement = document.getElementById('main-content');
    
    if (mainContentElement) {
      mainContentElement.focus();
      mainContentElement.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }
  }

  // ── Font Size Controls ──────────────────────────────────
  setFontSize(value: number): void {
    this.currentFontSize = value;
    document.documentElement.style.fontSize = `${value}%`;
    this.fontDropdownOpen = false;
  }

  toggleFontDropdown(): void {
    this.fontDropdownOpen = !this.fontDropdownOpen;
    this.searchOpen = false; 
  }

  // ── Search Toggle Controls ──────────────────────────────
  toggleSearch(): void {
    this.searchOpen = !this.searchOpen;
    this.fontDropdownOpen = false;
  }

  executeSearch(query: string): void {
    if (!query || query.trim() === '') return;

     this.searchOpen = false;
        this.router.navigate(['/search'], { queryParams: { q: query } });
      console.log('Search Triggered for:', query);
  }

  toggleHighContrast(): void {
    document.body.classList.toggle('high-contrast');
  }

  // ── Safe Layout Click Interceptor ───────────────────────
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;

    // Checks the element target tree structure to avoid premature component collapse state updates
    if (!target.closest('.position-relative')) {
      this.fontDropdownOpen = false;
      this.searchOpen = false;
    }
  }

  ngOnDestroy(): void {
    // clean up completed safely
  }
}