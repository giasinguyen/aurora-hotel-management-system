import type { ApiResponse } from '@/types/apiResponse';
import type { 
  Branch, 
  BranchCreationRequest, 
  BranchUpdateRequest,
  BranchStatus
} from '@/types/branch.types';
import axiosClient from '@/config/axiosClient';

const BRANCH_BASE_URL = '/api/v1/branches';

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

export const branchApi = {
  // Get all branches with pagination
  getAll: async (params: {
    page?: number;
    size?: number;
    sortBy?: string;
  } = {}) => {
    const { page = 0, size = 10, sortBy = 'name' } = params;
    const response = await axiosClient.get<ApiResponse<SpringPage<Branch>>>(
      `${BRANCH_BASE_URL}`,
      { params: { page, size, sortBy } }
    );
    return response.data;
  },

  // Get branch by ID
  getById: async (id: string) => {
    const response = await axiosClient.get<ApiResponse<Branch>>(
      `${BRANCH_BASE_URL}/${id}`
    );
    return response.data;
  },

  // Get branch by code
  getByCode: async (code: string) => {
    const response = await axiosClient.get<ApiResponse<Branch>>(
      `${BRANCH_BASE_URL}/code/${code}`
    );
    return response.data;
  },

  // Search branches by keyword
  search: async (keyword: string, params: {
    page?: number;
    size?: number;
  } = {}) => {
    const { page = 0, size = 10 } = params;
    const response = await axiosClient.get<ApiResponse<SpringPage<Branch>>>(
      `${BRANCH_BASE_URL}/search`,
      { params: { keyword, page, size } }
    );
    return response.data;
  },

  // Get branches by city
  getByCity: async (city: string, params: {
    page?: number;
    size?: number;
  } = {}) => {
    const { page = 0, size = 10 } = params;
    const response = await axiosClient.get<ApiResponse<SpringPage<Branch>>>(
      `${BRANCH_BASE_URL}/city/${city}`,
      { params: { page, size } }
    );
    return response.data;
  },

  // Get branches by status
  getByStatus: async (status: BranchStatus, params: {
    page?: number;
    size?: number;
  } = {}) => {
    const { page = 0, size = 10 } = params;
    const response = await axiosClient.get<ApiResponse<SpringPage<Branch>>>(
      `${BRANCH_BASE_URL}/status/${status}`,
      { params: { page, size } }
    );
    return response.data;
  },

  // Get active branches (public endpoint - no auth required)
  getActivePublic: async (params: {
    page?: number;
    size?: number;
  } = {}) => {
    const { page = 0, size = 100 } = params;
    const response = await axiosClient.get<ApiResponse<SpringPage<Branch>>>(
      `${BRANCH_BASE_URL}/public/active`,
      { params: { page, size } }
    );
    return response.data;
  },

  // Create branch
  create: async (data: BranchCreationRequest) => {
    const response = await axiosClient.post<ApiResponse<Branch>>(
      BRANCH_BASE_URL,
      data
    );
    return response.data;
  },

  // Update branch
  update: async (id: string, data: BranchUpdateRequest) => {
    const response = await axiosClient.put<ApiResponse<Branch>>(
      `${BRANCH_BASE_URL}/${id}`,
      data
    );
    return response.data;
  },

  // Delete branch
  delete: async (id: string) => {
    const response = await axiosClient.delete<ApiResponse<void>>(
      `${BRANCH_BASE_URL}/${id}`
    );
    return response.data;
  },

  // Assign manager to branch
  assignManager: async (branchId: string, managerId: string) => {
    const response = await axiosClient.put<ApiResponse<Branch>>(
      `${BRANCH_BASE_URL}/${branchId}/manager`,
      { managerId }
    );
    return response.data;
  },

  // Remove manager from branch
  removeManager: async (branchId: string) => {
    const response = await axiosClient.delete<ApiResponse<Branch>>(
      `${BRANCH_BASE_URL}/${branchId}/manager`
    );
    return response.data;
  },

  // Assign staff to branch
  assignStaff: async (branchId: string, staffId: string) => {
    const response = await axiosClient.put<ApiResponse<Branch>>(
      `${BRANCH_BASE_URL}/${branchId}/staff`,
      { staffId }
    );
    return response.data;
  },

  // Remove staff from branch
  removeStaff: async (branchId: string, staffId: string) => {
    const response = await axiosClient.delete<ApiResponse<Branch>>(
      `${BRANCH_BASE_URL}/${branchId}/staff/${staffId}`
    );
    return response.data;
  },
};

export default branchApi;
