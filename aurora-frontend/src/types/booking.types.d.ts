// ==================== BOOKING TYPES ====================

export interface BookingResponse {
  id: string;
  customerId: string;
  hotelId: string;
  checkin: string;
  checkout: string;
  status: string;
  totalPrice: number;
  specialRequests?: string;
  numberOfGuests?: number;
  createdAt: string;
  updatedAt: string;
}

export interface BookingCreationRequest {
  customerId: string;
  hotelId: string;
  checkin: string;
  checkout: string;
  status?: string;
  specialRequests?: string;
  numberOfGuests?: number;
}

export interface BookingUpdateRequest {
  checkin?: string;
  checkout?: string;
  status?: string;
  specialRequests?: string;
  numberOfGuests?: number;
}

export interface BookingSearchParams {
  hotelId?: string;
  customerId?: string;
  status?: string;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: "asc" | "desc";
}
