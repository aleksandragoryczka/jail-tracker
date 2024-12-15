export interface PaginatedResult<T> {
    data: T[];
    count: number;
    page: number;
  }
  