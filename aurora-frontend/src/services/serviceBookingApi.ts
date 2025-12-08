import type { ApiResponse } from '@/types/apiResponse';
import type { ServiceBooking } from '@/types/booking.types';
import axiosClient from '@/config/axiosClient';

const SERVICE_BOOKING_BASE_URL = '/api/v1/service-bookings';

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

export interface ServiceBookingCreationRequest {
  bookingId: string;
  serviceId: string;
  customerId: string;
  roomId: string;
  dateTime: string; // ISO datetime string
  quantity: number;
  price: number;
  status?: string;
  specialInstructions?: string;
}

export interface ServiceBookingUpdateRequest {
  dateTime?: string;
  quantity?: number;
  price?: number;
  status?: string;
  roomId?: string; // For updating room when booking room is changed
  specialInstructions?: string;
}

export const serviceBookingApi = {
  // Get all service bookings with pagination
  getAll: async (params: {
    page?: number;
    size?: number;
    sortBy?: string;
    sortDir?: string;
  } = {}) => {
    const { page = 0, size = 10, sortBy = 'dateTime', sortDir = 'desc' } = params;
    const response = await axiosClient.get<ApiResponse<SpringPage<ServiceBooking>>>(
      `${SERVICE_BOOKING_BASE_URL}`,
      { params: { page, size, sortBy, sortDir } }
    );
    return response.data;
  },

  // Get service booking by ID
  getById: async (id: string) => {
    const response = await axiosClient.get<ApiResponse<ServiceBooking>>(
      `${SERVICE_BOOKING_BASE_URL}/${id}`
    );
    return response.data;
  },

  // Get service bookings by booking ID
  getByBooking: async (bookingId: string, params: {
    page?: number;
    size?: number;
    sortBy?: string;
    sortDir?: string;
  } = {}) => {
    const { page = 0, size = 100, sortBy = 'dateTime', sortDir = 'asc' } = params;
    const response = await axiosClient.get<ApiResponse<SpringPage<ServiceBooking>>>(
      `${SERVICE_BOOKING_BASE_URL}/booking/${bookingId}`,
      { params: { page, size, sortBy, sortDir } }
    );
    return response.data;
  },

  // Create service booking
  create: async (data: ServiceBookingCreationRequest) => {
    const response = await axiosClient.post<ApiResponse<ServiceBooking>>(
      SERVICE_BOOKING_BASE_URL,
      data
    );
    return response.data;
  },

  // Update service booking
  update: async (id: string, data: ServiceBookingUpdateRequest) => {
    const response = await axiosClient.put<ApiResponse<ServiceBooking>>(
      `${SERVICE_BOOKING_BASE_URL}/${id}`,
      data
    );
    return response.data;
  },

  // Delete service booking
  delete: async (id: string) => {
    const response = await axiosClient.delete<ApiResponse<void>>(
      `${SERVICE_BOOKING_BASE_URL}/${id}`
    );
    return response.data;
  },
};

export default serviceBookingApi;

