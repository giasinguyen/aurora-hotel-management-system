// ==================== ROOM TYPE TYPES ====================

export interface RoomTypeResponse {
  id: string;
  name: string;
  branchId: string;
  description?: string;
  capacity: number;
  pricePerNight: number;
  area?: number;
  bedType?: string;
  amenities?: string[];
  images?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface RoomTypeCreationRequest {
  name: string;
  branchId: string;
  description?: string;
  capacity: number;
  pricePerNight: number;
  area?: number;
  bedType?: string;
  amenities?: string[];
  images?: string[];
}

export interface RoomTypeUpdateRequest {
  name?: string;
  description?: string;
  capacity?: number;
  pricePerNight?: number;
  area?: number;
  bedType?: string;
  amenities?: string[];
  images?: string[];
}
