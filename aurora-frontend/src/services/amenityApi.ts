import type { ApiResponse } from '@/types/apiResponse';
import axiosClient from '@/config/axiosClient';

const AMENITY_BASE_URL = '/api/v1/amenities';

export interface Amenity {
  id: string;
  name: string;
  icon?: string;
  description?: string;
}

export interface AmenityCreationRequest {
  name: string;
  icon?: string;
  description?: string;
}

export interface AmenityUpdateRequest {
  name?: string;
  icon?: string;
  description?: string;
}

export const amenityApi = {
  // Get all amenities (no pagination)
  getAll: async () => {
    const response = await axiosClient.get<ApiResponse<Amenity[]>>(
      `${AMENITY_BASE_URL}`
    );
    return response.data;
  },

  // Get amenity by ID
  getById: async (id: string) => {
    const response = await axiosClient.get<ApiResponse<Amenity>>(
      `${AMENITY_BASE_URL}/${id}`
    );
    return response.data;
  },

  // Create amenity
  create: async (data: AmenityCreationRequest) => {
    const response = await axiosClient.post<ApiResponse<Amenity>>(
      AMENITY_BASE_URL,
      data
    );
    return response.data;
  },

  // Update amenity
  update: async (id: string, data: AmenityUpdateRequest) => {
    const response = await axiosClient.put<ApiResponse<Amenity>>(
      `${AMENITY_BASE_URL}/${id}`,
      data
    );
    return response.data;
  },

  // Delete amenity
  delete: async (id: string) => {
    const response = await axiosClient.delete<ApiResponse<void>>(
      `${AMENITY_BASE_URL}/${id}`
    );
    return response.data;
  },
};

export default amenityApi;
