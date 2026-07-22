// src/app/services/theme.service.ts
import { Injectable, signal, effect } from '@angular/core';

// Purely Color/Brand based
export type BrandTheme = 'green' | 'blue' | 'orange' | 'red' | 'dark' | 'agriculture';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  // private activeBrandSignal = signal<BrandTheme>(this.getStoredTheme());
  // public activeTheme = this.activeBrandSignal.asReadonly();

  // constructor() {
  //   effect(() => {
  //     const current = this.activeBrandSignal();
  //     localStorage.setItem('user-brand', current);
  //     document.body.setAttribute('data-theme', current);
  //   });
  // }

  // setTheme(theme: BrandTheme) {
  //   this.activeBrandSignal.set(theme);
  // }

  // private getStoredTheme(): BrandTheme {
  //   return (localStorage.getItem('user-brand') as BrandTheme) || 'agriculture';
  // }
}