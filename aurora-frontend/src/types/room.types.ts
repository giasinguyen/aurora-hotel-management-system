// Room Types for Aurora Hotel Management System

// Room Category (Hạng phòng)
export interface RoomCategory {
  id: string;
  branchId: string;
  branchName: string;
  name: string;
  code: string;
  description?: string;
  displayOrder: number;
  active: boolean;
  imageUrl?: string;
  totalRoomTypes?: number;
  roomTypes?: RoomType[];
}

export interface Room {
  id: string;
  branchId: string;
  branchName: string;
  roomTypeId: string;
  roomTypeName: string;
  categoryId: string; // Category ID from roomType.category
  categoryName: string; // Category name from roomType.category
  roomNumber: string;
  floor: number;
  status: RoomStatus;
  capacityAdults: number;
  capacityChildren: number;
  sizeM2: number;
  viewType?: string; // e.g., 'CITY', 'RIVER', 'SEA', 'GARDEN'
  basePrice: number; // Giá gốc của phòng
  salePercent: number; // % giảm giá (0-100)
  priceFinal: number; // Giá cuối cùng sau khi áp dụng giảm giá
  images?: string[]; // Array of image URLs
}

export type RoomStatus = 
  | 'READY' 
  | 'CLEANING' 
  | 'MAINTENANCE' 
  | 'LOCKED';

export interface RoomCreationRequest {
  branchId: string;
  roomTypeId: string;
  roomNumber: string;
  floor: number;
  status?: RoomStatus;
  viewType?: string;
  basePrice: number; // Giá gốc của phòng
  salePercent?: number; // % giảm giá (0-100), mặc định 0
  images?: string[];
}

export interface RoomUpdateRequest {
  roomTypeId?: string;
  roomNumber?: string;
  floor?: number;
  status?: RoomStatus;
  viewType?: string;
  basePrice?: number; // Giá gốc của phòng
  salePercent?: number; // % giảm giá (0-100)
  images?: string[];
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
  categoryId?: string;
  name: string;
  code: string;
  priceFrom: number; // Giá tham khảo từ (minimum price reference)
  capacityAdults: number;
  capacityChildren: number;
  maxOccupancy: number;
  sizeM2: number;
  bedType?: string;
  numberOfBeds?: number;
  refundable: boolean;
  smokingAllowed?: boolean;
  description?: string;
  shortDescription?: string;
  totalRooms: number;
  availableRooms: number;
  amenities: Amenity[];
  imageUrl?: string; // Ảnh đại diện cho room type
}

export interface RoomTypeCreationRequest {
  branchId: string;
  name: string;
  code: string;
  priceFrom: number; // Giá tham khảo từ
  capacityAdults: number;
  capacityChildren: number;
  maxOccupancy: number;
  sizeM2: number;
  refundable?: boolean;
  amenityIds?: string[];
  imageUrl?: string; // Ảnh đại diện cho room type
}

export interface RoomTypeUpdateRequest {
  name?: string;
  code?: string;
  priceFrom?: number; // Giá tham khảo từ
  capacityAdults?: number;
  capacityChildren?: number;
  maxOccupancy?: number;
  sizeM2?: number;
  refundable?: boolean;
  amenityIds?: string[];
  imageUrl?: string; // Ảnh đại diện cho room type
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
  READY: { label: 'Sẵn sàng', variant: 'success', color: 'bg-green-500' },
  CLEANING: { label: 'Đang dọn', variant: 'outline', color: 'bg-purple-500' },
  MAINTENANCE: { label: 'Bảo trì', variant: 'secondary', color: 'bg-gray-500' },
  LOCKED: { label: 'Khoá phòng', variant: 'destructive', color: 'bg-red-500' },
};
