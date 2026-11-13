import { Injectable, signal } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
 
@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  /**
   * Tracks the number of concurrent active HTTP requests or manual triggers.
   */
  private activeRequests = 0;
 
  /**
   * Signal indicating whether the spinner should be visible.
   */
  readonly isLoading = signal<boolean>(false);
 
  /**
   * Signal holding the current loading label/message.
   */
  readonly message = signal<string>('Loading, please wait...');
 
  /**
   * Observable for RxJS streams / async pipe compatibility.
   */
  private readonly _loading$ = new BehaviorSubject<boolean>(false);
  readonly loading$: Observable<boolean> = this._loading$.asObservable();
 
  /**
   * Show the spinner. Increments active request count.
   * @param message Optional custom text displayed below the spinner.
   */
  show(message: string = 'Loading, please wait...'): void {
    this.activeRequests++;
    this.message.set(message);
 
    if (this.activeRequests === 1) {
      this.isLoading.set(true);
      this._loading$.next(true);
    }
  }
 
  /**
   * Hide the spinner. Decrements active request count.
   * The spinner is only dismissed when all concurrent requests finish.
   */
  hide(): void {
    if (this.activeRequests > 0) {
      this.activeRequests--;
    }
 
    if (this.activeRequests === 0) {
      this.isLoading.set(false);
      this._loading$.next(false);
      this.message.set('Loading, please wait...');
    }
  }
 
  /**
   * Force hide the spinner immediately and reset the request counter.
   */
  forceHide(): void {
    this.activeRequests = 0;
    this.isLoading.set(false);
    this._loading$.next(false);
    this.message.set('Loading, please wait...');
  }
 
  /**
   * Update the loading message dynamically.
   */
  setMessage(msg: string): void {
    this.message.set(msg);
  }
}