export interface IApiResponse<T> {
  message: string;
  errorCode: string;
  data: T;
}

export interface IPageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface IPaginationParams {
  page: number;
  size: number;
  filter: string | null;
}
