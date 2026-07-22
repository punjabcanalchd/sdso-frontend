import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ToastMessage, ToastType } from '../components/toast/toast.model';

@Injectable({ providedIn: 'root' })
export class ToastService {
  private toastSubject = new Subject<ToastMessage>();
  toast$ = this.toastSubject.asObservable();
  private counter = 0;

  show(type: ToastType, message: string, duration = 3000) {
    console.log('TOAST SERVICE - Type:', type, 'Message:', message, 'Duration:', duration);
    this.toastSubject.next({
      id: ++this.counter,
      type,
      message,
      duration
    });
  }

  success(msg: string, duration = 4000) {
    this.show('success', msg, duration);
  }

  error(msg: string, duration = 6000) {
    this.show('error', msg, duration);
  }

  warning(msg: string, duration = 5000) {
    this.show('warning', msg, duration);
  }

  info(msg: string, duration = 4000) {
    this.show('info', msg, duration);
  }
}