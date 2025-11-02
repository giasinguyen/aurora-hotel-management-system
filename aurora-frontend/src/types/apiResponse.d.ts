export interface ApiResponse<T> {
  code: number;
  message: string;
  result: T;
}

export interface PageResponseDto<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface PaginationParams {
  page: number;
  size: number;
  filter?: string | null;
  sortBy?: string;
  sortDirection?: "ASC" | "DESC";
}

