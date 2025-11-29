// Room Types for Aurora Hotel Management System

export interface Room {
  id: string;
  branchId: string;
  branchName: string;
  roomTypeId: string;
  roomTypeName: string;
  roomNumber: string;
  floor: number;
  status: RoomStatus;
  capacityAdults: number;
  capacityChildren: number;
  sizeM2: number;
}

export type RoomStatus = 
  | 'AVAILABLE' 
  | 'OCCUPIED' 
  | 'RESERVED' 
  | 'MAINTENANCE' 
  | 'CLEANING' 
  | 'OUT_OF_ORDER';

export interface RoomCreationRequest {
  branchId: string;
  roomTypeId: string;
  roomNumber: string;
  floor: number;
  status?: RoomStatus;
  capacityAdults?: number;
  capacityChildren?: number;
  sizeM2?: number;
}

export interface RoomUpdateRequest {
  roomTypeId?: string;
  roomNumber?: string;
  floor?: number;
  status?: RoomStatus;
  capacityAdults?: number;
  capacityChildren?: number;
  sizeM2?: number;
}

export interface RoomSearchParams {
  branchId?: string;
  roomTypeId?: string;
  status?: RoomStatus;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
}

// Room Type
export interface Amenity {
  id: string;
  name: string;
  icon?: string;
}

export interface RoomType {
  id: string;
  branchId: string;
  branchName: string;
  name: string;
  code: string;
  basePrice: number;
  weekendPrice?: number;
  capacityAdults: number;
  capacityChildren: number;
  maxOccupancy: number;
  sizeM2: number;
  refundable: boolean;
  totalRooms: number;
  availableRooms: number;
  amenities: Amenity[];
}

export interface RoomTypeCreationRequest {
  branchId: string;
  name: string;
  code: string;
  basePrice: number;
  weekendPrice?: number;
  capacityAdults: number;
  capacityChildren: number;
  maxOccupancy: number;
  sizeM2: number;
  refundable?: boolean;
  amenityIds?: string[];
}

export interface RoomTypeUpdateRequest {
  name?: string;
  code?: string;
  basePrice?: number;
  weekendPrice?: number;
  capacityAdults?: number;
  capacityChildren?: number;
  maxOccupancy?: number;
  sizeM2?: number;
  refundable?: boolean;
  amenityIds?: string[];
}

export interface RoomTypeSearchParams {
  branchId?: string;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

// Status badge configurations
export const ROOM_STATUS_CONFIG: Record<RoomStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning'; color: string }> = {
  AVAILABLE: { label: 'Trống', variant: 'success', color: 'bg-green-500' },
  OCCUPIED: { label: 'Có khách', variant: 'default', color: 'bg-blue-500' },
  RESERVED: { label: 'Đã đặt', variant: 'warning', color: 'bg-yellow-500' },
  MAINTENANCE: { label: 'Bảo trì', variant: 'secondary', color: 'bg-gray-500' },
  CLEANING: { label: 'Đang dọn', variant: 'outline', color: 'bg-purple-500' },
  OUT_OF_ORDER: { label: 'Hỏng', variant: 'destructive', color: 'bg-red-500' },
};
