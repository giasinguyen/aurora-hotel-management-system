// Service Types for Aurora Hotel Management System

export interface HotelService {
  id: string;
  branchId: string;
  branchName: string;
  name: string;
  categoryId: string;
  categoryName: string;
  description?: string;
  basePrice: number;
}

export interface ServiceCreationRequest {
  branchId: string;
  name: string;
  categoryId: string;
  description?: string;
  basePrice: number;
}

export interface ServiceUpdateRequest {
  name?: string;
  categoryId?: string;
  description?: string;
  basePrice?: number;
}

export interface ServiceSearchParams {
  hotelId?: string;
  categoryId?: string;
  name?: string;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
}
