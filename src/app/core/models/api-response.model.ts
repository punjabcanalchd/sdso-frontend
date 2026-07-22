import { ApiError } from "./error.model";

export interface ApiResponse<T> {
  status: 'success' | 'error';
  message?: string;
  data?: T;
  errors?: ApiError[];
}
