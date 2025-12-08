import type { ApiResponse } from '@/types/apiResponse';
import type { BookingRoom } from '@/types/booking.types';
import axiosClient from '@/config/axiosClient';

const BOOKING_ROOM_BASE_URL = '/api/v1/booking-rooms';

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

export interface BookingRoomCreationRequest {
  bookingId: string;
  roomId: string;
  pricePerNight: number;
  nights: number;
  actualAdults?: number;
  actualChildren?: number;
  roomNotes?: string;
}

export interface BookingRoomUpdateRequest {
  pricePerNight?: number;
  nights?: number;
  roomNotes?: string;
}

export const bookingRoomApi = {
  // Get all booking rooms with pagination
  getAll: async (params: {
    page?: number;
    size?: number;
    sortBy?: string;
    sortDir?: string;
  } = {}) => {
    const { page = 0, size = 10, sortBy = 'id', sortDir = 'asc' } = params;
    const response = await axiosClient.get<ApiResponse<SpringPage<BookingRoom>>>(
      `${BOOKING_ROOM_BASE_URL}`,
      { params: { page, size, sortBy, sortDir } }
    );
    return response.data;
  },

  // Get booking room by ID
  getById: async (id: string) => {
    const response = await axiosClient.get<ApiResponse<BookingRoom>>(
      `${BOOKING_ROOM_BASE_URL}/${id}`
    );
    return response.data;
  },

  // Get booking rooms by booking ID
  getByBooking: async (bookingId: string, params: {
    page?: number;
    size?: number;
    sortBy?: string;
    sortDir?: string;
  } = {}) => {
    const { page = 0, size = 100, sortBy = 'id', sortDir = 'asc' } = params;
    const response = await axiosClient.get<ApiResponse<SpringPage<BookingRoom>>>(
      `${BOOKING_ROOM_BASE_URL}/by-booking/${bookingId}`,
      { params: { page, size, sortBy, sortDir } }
    );
    return response.data;
  },

  // Create booking room
  create: async (data: BookingRoomCreationRequest) => {
    const response = await axiosClient.post<ApiResponse<BookingRoom>>(
      BOOKING_ROOM_BASE_URL,
      data
    );
    return response.data;
  },

  // Update booking room
  update: async (id: string, data: BookingRoomUpdateRequest) => {
    const response = await axiosClient.put<ApiResponse<BookingRoom>>(
      `${BOOKING_ROOM_BASE_URL}/${id}`,
      data
    );
    return response.data;
  },

  // Delete booking room
  delete: async (id: string) => {
    const response = await axiosClient.delete<ApiResponse<void>>(
      `${BOOKING_ROOM_BASE_URL}/${id}`
    );
    return response.data;
  },
};

export default bookingRoomApi;

