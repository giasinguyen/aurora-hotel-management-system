import type { ApiResponse } from '@/types/apiResponse';
import type { 
  ServiceCategory,
  ServiceCategoryRequest
} from '@/types/serviceCategory.types';
import axiosClient from '@/config/axiosClient';

const SERVICE_CATEGORY_BASE_URL = '/api/v1/service-categories';

export const serviceCategoryApi = {
  // Get all categories by branch
  getByBranch: async (branchId: string) => {
    const response = await axiosClient.get<ApiResponse<ServiceCategory[]>>(
      `${SERVICE_CATEGORY_BASE_URL}/branch/${branchId}`
    );
    return response.data;
  },

  // Get all active categories
  getAllActive: async () => {
    const response = await axiosClient.get<ApiResponse<ServiceCategory[]>>(
      `${SERVICE_CATEGORY_BASE_URL}/active`
    );
    return response.data;
  },

  // Get category by ID
  getById: async (id: string) => {
    const response = await axiosClient.get<ApiResponse<ServiceCategory>>(
      `${SERVICE_CATEGORY_BASE_URL}/${id}`
    );
    return response.data;
  },

  // Get category by ID with services
  getByIdWithServices: async (id: string) => {
    const response = await axiosClient.get<ApiResponse<ServiceCategory>>(
      `${SERVICE_CATEGORY_BASE_URL}/${id}/with-services`
    );
    return response.data;
  },

  // Create category
  create: async (data: ServiceCategoryRequest) => {
    const response = await axiosClient.post<ApiResponse<ServiceCategory>>(
      SERVICE_CATEGORY_BASE_URL,
      data
    );
    return response.data;
  },

  // Update category
  update: async (id: string, data: ServiceCategoryRequest) => {
    const response = await axiosClient.put<ApiResponse<ServiceCategory>>(
      `${SERVICE_CATEGORY_BASE_URL}/${id}`,
      data
    );
    return response.data;
  },

  // Delete category
  delete: async (id: string) => {
    const response = await axiosClient.delete<ApiResponse<void>>(
      `${SERVICE_CATEGORY_BASE_URL}/${id}`
    );
    return response.data;
  },
};

export default serviceCategoryApi;


