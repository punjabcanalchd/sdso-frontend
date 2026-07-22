export interface Pagination {
  page: number;
  pageSize: number;
  totalRecords: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: Pagination;
}
