// ==================== SERVICE TYPES ====================

export interface ServiceResponse {
  id: string;
  hotelId: string;
  name: string;
  type: string;
  description?: string;
  price: number;
  duration?: number;
  availability?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceCreationRequest {
  hotelId: string;
  name: string;
  type: string;
  description?: string;
  price: number;
  duration?: number;
  availability?: boolean;
}

export interface ServiceUpdateRequest {
  name?: string;
  type?: string;
  description?: string;
  price?: number;
  duration?: number;
  availability?: boolean;
}

export interface ServiceSearchParams {
  hotelId?: string;
  type?: string;
  name?: string;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: "asc" | "desc";
}
