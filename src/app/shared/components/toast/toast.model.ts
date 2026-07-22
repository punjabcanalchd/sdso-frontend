export interface ToastMessage {
  id: number;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
}

export type ToastType = 'success' | 'error' | 'info' | 'warning';