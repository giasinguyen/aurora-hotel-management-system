import type { ApiResponse } from '@/types/apiResponse';
import type { 
  Room,
  RoomCategory,
  RoomCreationRequest, 
  RoomUpdateRequest,
  RoomType,
  RoomTypeCreationRequest,
  RoomTypeUpdateRequest,
  RoomTypeSearchParams
} from '@/types/room.types';
import axiosClient from '@/config/axiosClient';

const ROOM_BASE_URL = '/api/v1/rooms';
const ROOM_TYPE_BASE_URL = '/api/v1/room-types';
const ROOM_CATEGORY_BASE_URL = '/api/v1/room-categories';

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

// ==================== ROOM API ====================

export const roomApi = {
  // Get all rooms with pagination
  getAll: async (params: {
    page?: number;
    size?: number;
    sortBy?: string;
    sortDir?: string;
  } = {}) => {
    const { page = 0, size = 10, sortBy = 'roomNumber', sortDir = 'asc' } = params;
    const response = await axiosClient.get<ApiResponse<SpringPage<Room>>>(
      `${ROOM_BASE_URL}`,
      { params: { page, size, sortBy, sortDir } }
    );
    return response.data;
  },

  // Get room by ID
  getById: async (id: string) => {
    const response = await axiosClient.get<ApiResponse<Room>>(
      `${ROOM_BASE_URL}/${id}`
    );
    return response.data;
  },

  // Get rooms by branch
  getByBranch: async (branchId: string, params: {
    page?: number;
    size?: number;
    sortBy?: string;
    sortDir?: string;
  } = {}) => {
    const { page = 0, size = 10, sortBy = 'roomNumber', sortDir = 'asc' } = params;
    const response = await axiosClient.get<ApiResponse<SpringPage<Room>>>(
      `${ROOM_BASE_URL}/hotel/${branchId}`,
      { params: { page, size, sortBy, sortDir } }
    );
    return response.data;
  },

  // Get rooms by room type
  getByRoomType: async (roomTypeId: string, params: {
    page?: number;
    size?: number;
    sortBy?: string;
    sortDir?: string;
  } = {}) => {
    const { page = 0, size = 10, sortBy = 'roomNumber', sortDir = 'asc' } = params;
    const response = await axiosClient.get<ApiResponse<SpringPage<Room>>>(
      `${ROOM_BASE_URL}/room-type/${roomTypeId}`,
      { params: { page, size, sortBy, sortDir } }
    );
    return response.data;
  },

  // Create room
  create: async (data: RoomCreationRequest) => {
    const response = await axiosClient.post<ApiResponse<Room>>(
      ROOM_BASE_URL,
      data
    );
    return response.data;
  },

  // Update room
  update: async (id: string, data: RoomUpdateRequest) => {
    const response = await axiosClient.put<ApiResponse<Room>>(
      `${ROOM_BASE_URL}/${id}`,
      data
    );
    return response.data;
  },

  // Delete room
  delete: async (id: string) => {
    const response = await axiosClient.delete<ApiResponse<void>>(
      `${ROOM_BASE_URL}/${id}`
    );
    return response.data;
  },
};

// ==================== ROOM TYPE API ====================

export const roomTypeApi = {
  // Get all room types (no pagination)
  getAll: async () => {
    const response = await axiosClient.get<ApiResponse<RoomType[]>>(
      `${ROOM_TYPE_BASE_URL}`
    );
    return response.data;
  },

  // Get room types with pagination
  getAllPaginated: async (params: RoomTypeSearchParams = {}) => {
    const { page = 0, size = 10, sortBy = 'name', sortDirection = 'asc' } = params;
    const response = await axiosClient.get<ApiResponse<SpringPage<RoomType>>>(
      `${ROOM_TYPE_BASE_URL}/paginated`,
      { params: { page, size, sortBy, sortDirection } }
    );
    return response.data;
  },

  // Get room type by ID
  getById: async (id: string) => {
    const response = await axiosClient.get<ApiResponse<RoomType>>(
      `${ROOM_TYPE_BASE_URL}/${id}`,
      { params: { _t: Date.now() } } // Cache busting
    );
    return response.data;
  },

  // Get room types by branch (no pagination)
  getByBranch: async (branchId: string) => {
    const response = await axiosClient.get<ApiResponse<RoomType[]>>(
      `${ROOM_TYPE_BASE_URL}/hotel/${branchId}`
    );
    return response.data;
  },

  // Get room types by branch with pagination
  getByBranchPaginated: async (branchId: string, params: RoomTypeSearchParams = {}) => {
    const { page = 0, size = 10, sortBy = 'name', sortDirection = 'asc' } = params;
    const response = await axiosClient.get<ApiResponse<SpringPage<RoomType>>>(
      `${ROOM_TYPE_BASE_URL}/hotel/${branchId}/paginated`,
      { params: { page, size, sortBy, sortDirection } }
    );
    return response.data;
  },

  // Create room type
  create: async (data: RoomTypeCreationRequest) => {
    const response = await axiosClient.post<ApiResponse<RoomType>>(
      ROOM_TYPE_BASE_URL,
      data
    );
    return response.data;
  },

  // Update room type
  update: async (id: string, data: RoomTypeUpdateRequest) => {
    const response = await axiosClient.put<ApiResponse<RoomType>>(
      `${ROOM_TYPE_BASE_URL}/${id}`,
      data
    );
    return response.data;
  },

  // Delete room type
  delete: async (id: string) => {
    const response = await axiosClient.delete<ApiResponse<void>>(
      `${ROOM_TYPE_BASE_URL}/${id}`
    );
    return response.data;
  },
};

// ==================== ROOM CATEGORY API ====================

export const roomCategoryApi = {
  // Get all categories by branch
  getByBranch: async (branchId: string) => {
    const response = await axiosClient.get<ApiResponse<RoomCategory[]>>(
      `${ROOM_CATEGORY_BASE_URL}/branch/${branchId}`
    );
    return response.data;
  },

  // Get category by ID
  getById: async (id: string) => {
    const response = await axiosClient.get<ApiResponse<RoomCategory>>(
      `${ROOM_CATEGORY_BASE_URL}/${id}`
    );
    return response.data;
  },

  // Get category by ID with room types
  getByIdWithRoomTypes: async (id: string) => {
    const response = await axiosClient.get<ApiResponse<RoomCategory>>(
      `${ROOM_CATEGORY_BASE_URL}/${id}/with-room-types`
    );
    return response.data;
  },
};

export default { roomApi, roomTypeApi, roomCategoryApi };
