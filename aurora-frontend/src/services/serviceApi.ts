import type { ApiResponse } from '@/types/apiResponse';
import type { 
  HotelService, 
  ServiceCreationRequest, 
  ServiceUpdateRequest,
  ServiceSearchParams
} from '@/types/service.types';
import axiosClient from '@/config/axiosClient';

const SERVICE_BASE_URL = '/api/v1/services';

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

export const serviceApi = {
  // Get all services with pagination
  getAll: async (params: {
    page?: number;
    size?: number;
    sortBy?: string;
    sortDir?: string;
  } = {}) => {
    const { page = 0, size = 10, sortBy = 'name', sortDir = 'asc' } = params;
    const response = await axiosClient.get<ApiResponse<SpringPage<HotelService>>>(
      `${SERVICE_BASE_URL}`,
      { params: { page, size, sortBy, sortDir } }
    );
    return response.data;
  },

  // Get service by ID
  getById: async (id: string) => {
    const response = await axiosClient.get<ApiResponse<HotelService>>(
      `${SERVICE_BASE_URL}/${id}`
    );
    return response.data;
  },

  // Search services with filters
  search: async (params: ServiceSearchParams = {}) => {
    const { 
      hotelId, 
      categoryId,
      name,
      page = 0, 
      size = 10, 
      sortBy = 'name', 
      sortDir = 'asc' 
    } = params;
    
    const response = await axiosClient.get<ApiResponse<SpringPage<HotelService>>>(
      `${SERVICE_BASE_URL}/search`,
      { 
        params: { 
          hotelId, 
          categoryId, 
          name,
          page, 
          size, 
          sortBy, 
          sortDir 
        } 
      }
    );
    return response.data;
  },

  // Create service
  create: async (data: ServiceCreationRequest) => {
    const response = await axiosClient.post<ApiResponse<HotelService>>(
      SERVICE_BASE_URL,
      data
    );
    return response.data;
  },

  // Update service
  update: async (id: string, data: ServiceUpdateRequest) => {
    const response = await axiosClient.put<ApiResponse<HotelService>>(
      `${SERVICE_BASE_URL}/${id}`,
      data
    );
    return response.data;
  },

  // Delete service
  delete: async (id: string) => {
    const response = await axiosClient.delete<ApiResponse<void>>(
      `${SERVICE_BASE_URL}/${id}`
    );
    return response.data;
  },
};

export default serviceApi;
