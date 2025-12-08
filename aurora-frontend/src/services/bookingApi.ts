import type { ApiResponse } from '@/types/apiResponse';
import type { 
  Booking, 
  BookingCreationRequest, 
  BookingUpdateRequest,
  BookingConfirmRequest,
  BookingCancellationRequest,
  BookingCancellationResponse,
  BookingSearchParams
} from '@/types/booking.types';
import axiosClient from '@/config/axiosClient';
import publicAxiosClient from '@/config/publicAxiosClient';

const BOOKING_BASE_URL = '/api/v1/bookings';

// Spring Page response type
interface SpringPage<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export const bookingApi = {
  // Get all bookings with pagination
  getAll: async (params: {
    page?: number;
    size?: number;
    sortBy?: string;
    sortDir?: string;
  } = {}) => {
    const { page = 0, size = 10, sortBy = 'checkin', sortDir = 'desc' } = params;
    const response = await axiosClient.get<ApiResponse<SpringPage<Booking>>>(
      `${BOOKING_BASE_URL}`,
      { params: { page, size, sortBy, sortDir } }
    );
    return response.data;
  },

  // Get booking by ID
  getById: async (id: string) => {
    const response = await axiosClient.get<ApiResponse<Booking>>(
      `${BOOKING_BASE_URL}/${id}`
    );
    return response.data;
  },

  // Get booking by ID (Public - for guests without authentication)
  getByIdPublic: async (id: string) => {
    const response = await publicAxiosClient.get<ApiResponse<Booking>>(
      `${BOOKING_BASE_URL}/public/${id}`
    );
    return response.data;
  },

  // Get booking by code (Public - for guests without authentication)
  getByCodePublic: async (code: string) => {
    const response = await publicAxiosClient.get<ApiResponse<Booking>>(
      `${BOOKING_BASE_URL}/public/code/${code}`
    );
    return response.data;
  },

  // Search bookings with filters
  search: async (params: BookingSearchParams = {}) => {
    const { 
      branchId, 
      customerId, 
      status,
      page = 0, 
      size = 10, 
      sortBy = 'checkin', 
      sortDir = 'desc' 
    } = params;
    
    const response = await axiosClient.get<ApiResponse<SpringPage<Booking>>>(
      `${BOOKING_BASE_URL}/search`,
      { 
        params: { 
          branchId, 
          customerId, 
          status,
          page, 
          size, 
          sortBy, 
          sortDir 
        } 
      }
    );
    return response.data;
  },

  // Create new booking
  create: async (data: BookingCreationRequest) => {
    const response = await axiosClient.post<ApiResponse<Booking>>(
      BOOKING_BASE_URL,
      data
    );
    return response.data;
  },

  // Update booking
  update: async (id: string, data: BookingUpdateRequest) => {
    const response = await axiosClient.put<ApiResponse<Booking>>(
      `${BOOKING_BASE_URL}/${id}`,
      data
    );
    return response.data;
  },

  // Delete booking
  delete: async (id: string) => {
    const response = await axiosClient.delete<ApiResponse<void>>(
      `${BOOKING_BASE_URL}/${id}`
    );
    return response.data;
  },

  // Confirm booking (Staff)
  confirm: async (id: string, data: Omit<BookingConfirmRequest, 'bookingId'>) => {
    const response = await axiosClient.post<ApiResponse<Booking>>(
      `${BOOKING_BASE_URL}/${id}/confirm`,
      data
    );
    return response.data;
  },

  // Modify booking
  modify: async (id: string, data: BookingUpdateRequest) => {
    const response = await axiosClient.put<ApiResponse<Booking>>(
      `${BOOKING_BASE_URL}/${id}/modify`,
      data
    );
    return response.data;
  },

  // Cancel booking
  cancel: async (id: string, data: Omit<BookingCancellationRequest, 'bookingId'>) => {
    const response = await axiosClient.post<ApiResponse<BookingCancellationResponse>>(
      `${BOOKING_BASE_URL}/${id}/cancel`,
      data
    );
    return response.data;
  },

  // Complete checkout (create booking with rooms and services)
  checkout: async (data: import('@/types/checkout.types').CheckoutRequest) => {
    const response = await axiosClient.post<ApiResponse<Booking>>(
      `${BOOKING_BASE_URL}/checkout`,
      data
    );
    return response.data;
  },

  // Check-in booking
  checkIn: async (id: string, checkedInBy: string) => {
    const response = await axiosClient.post<ApiResponse<Booking>>(
      `${BOOKING_BASE_URL}/${id}/check-in`,
      null,
      { params: { checkedInBy } }
    );
    return response.data;
  },

  // Check-out booking
  checkOut: async (id: string, checkedOutBy: string) => {
    const response = await axiosClient.post<ApiResponse<Booking>>(
      `${BOOKING_BASE_URL}/${id}/check-out`,
      null,
      { params: { checkedOutBy } }
    );
    return response.data;
  },

  // Mark booking as no-show
  markNoShow: async (id: string, reason: string) => {
    const response = await axiosClient.post<ApiResponse<Booking>>(
      `${BOOKING_BASE_URL}/${id}/no-show`,
      null,
      { params: { reason } }
    );
    return response.data;
  },
};

export default bookingApi;
