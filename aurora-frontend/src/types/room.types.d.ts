// ==================== ROOM TYPES ====================

export interface RoomResponse {
  id: string;
  roomNumber: string;
  branchId: string;
  roomTypeId: string;
  status: string;
  floor?: number;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RoomCreationRequest {
  roomNumber: string;
  branchId: string;
  roomTypeId: string;
  status?: string;
  floor?: number;
  description?: string;
}

export interface RoomUpdateRequest {
  roomNumber?: string;
  roomTypeId?: string;
  status?: string;
  floor?: number;
  description?: string;
}

export interface RoomSearchParams {
  hotelId?: string;
  roomTypeId?: string;
  status?: string;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: "asc" | "desc";
}
