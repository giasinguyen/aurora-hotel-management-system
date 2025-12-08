// Event Types
export type EventStatus = 'SCHEDULED' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';

export type PriceAdjustmentType = 'PERCENTAGE' | 'FIXED_AMOUNT';

export type PriceAdjustmentTarget = 'CATEGORY' | 'ROOM_TYPE' | 'SPECIFIC_ROOM';

export interface PriceAdjustment {
  id?: string;
  adjustmentType: PriceAdjustmentType; // Tăng theo % hoặc số tiền cố định
  adjustmentValue: number; // Giá trị tăng/giảm
  targetType: PriceAdjustmentTarget; // Áp dụng cho hạng phòng, loại phòng, hoặc phòng cụ thể
  targetId: string; // ID của category/roomType/room
  targetName?: string; // Tên để hiển thị
}

export interface Event {
  id: string;
  name: string;
  description?: string;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  status: EventStatus;
  branchId: string;
  branchName?: string;
  priceAdjustments: PriceAdjustment[];
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
}

export interface EventFormData {
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  branchId: string;
  priceAdjustments: PriceAdjustment[];
}

export interface EventListResponse {
  content: Event[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

// Event status configuration
export const EVENT_STATUS_CONFIG: Record<EventStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' }> = {
  SCHEDULED: { label: 'Đã lên lịch', variant: 'secondary' },
  ACTIVE: { label: 'Đang diễn ra', variant: 'success' },
  COMPLETED: { label: 'Đã kết thúc', variant: 'outline' },
  CANCELLED: { label: 'Đã hủy', variant: 'destructive' },
};

// Price adjustment type labels
export const PRICE_ADJUSTMENT_TYPE_LABELS: Record<PriceAdjustmentType, string> = {
  PERCENTAGE: 'Phần trăm (%)',
  FIXED_AMOUNT: 'Số tiền cố định (₫)',
};

// Price adjustment target labels
export const PRICE_ADJUSTMENT_TARGET_LABELS: Record<PriceAdjustmentTarget, string> = {
  CATEGORY: 'Hạng phòng',
  ROOM_TYPE: 'Loại phòng',
  SPECIFIC_ROOM: 'Phòng cụ thể',
};
