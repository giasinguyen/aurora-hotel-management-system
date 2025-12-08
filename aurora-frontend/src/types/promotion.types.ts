// Promotion Types for Aurora Hotel Management System

export type DiscountType = 'PERCENTAGE' | 'FIXED_AMOUNT';

export interface Promotion {
  id: string;
  branchId?: string;
  branchName?: string;
  code: string;
  name: string;
  startDate: string;
  endDate: string;
  active: boolean;
  discountType: DiscountType;
  percentOff?: number;
  amountOff?: number;
  minBookingAmount?: number;
  minNights?: number;
  usageLimit?: number;
  usedCount?: number;
  maxDiscountAmount?: number;
  applicableRoomTypeIds?: string[];
  applicableRoomTypes?: RoomTypeInfo[];
  stackable: boolean;
  exclusiveWithOthers: boolean;
  description?: string;
  termsAndConditions?: string;
  priority: number;
  createdBy?: string;
  // Backward compatibility
  discount?: number;
}

export interface RoomTypeInfo {
  id: string;
  name: string;
  code: string;
}

export interface PromotionCreationRequest {
  branchId?: string;
  code: string;
  name: string;
  startDate: string;
  endDate: string;
  active?: boolean;
  discountType: DiscountType;
  percentOff?: number;
  amountOff?: number;
  minBookingAmount?: number;
  minNights?: number;
  usageLimit?: number;
  maxDiscountAmount?: number;
  applicableRoomTypeIds?: string[];
  stackable?: boolean;
  exclusiveWithOthers?: boolean;
  description?: string;
  termsAndConditions?: string;
  priority?: number;
}

export interface PromotionUpdateRequest {
  branchId?: string;
  name?: string;
  startDate?: string;
  endDate?: string;
  active?: boolean;
  discountType?: DiscountType;
  percentOff?: number;
  amountOff?: number;
  minBookingAmount?: number;
  minNights?: number;
  usageLimit?: number;
  maxDiscountAmount?: number;
  applicableRoomTypeIds?: string[];
  stackable?: boolean;
  exclusiveWithOthers?: boolean;
  description?: string;
  termsAndConditions?: string;
  priority?: number;
}

export interface PromotionSearchParams {
  code?: string;
  name?: string;
  active?: boolean;
  startDate?: string;
  endDate?: string;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
}

// Helper to check if promotion is currently valid
export const isPromotionValid = (promotion: Promotion): boolean => {
  const now = new Date();
  const start = new Date(promotion.startDate);
  const end = new Date(promotion.endDate);
  return promotion.active && now >= start && now <= end;
};

// Get promotion status
export type PromotionStatus = 'active' | 'scheduled' | 'expired' | 'inactive';

export const getPromotionStatus = (promotion: Promotion): PromotionStatus => {
  if (!promotion.active) return 'inactive';
  
  const now = new Date();
  const start = new Date(promotion.startDate);
  const end = new Date(promotion.endDate);
  
  if (now < start) return 'scheduled';
  if (now > end) return 'expired';
  return 'active';
};

export const PROMOTION_STATUS_CONFIG: Record<PromotionStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' }> = {
  active: { label: 'Đang áp dụng', variant: 'success' },
  scheduled: { label: 'Sắp diễn ra', variant: 'warning' },
  expired: { label: 'Đã hết hạn', variant: 'secondary' },
  inactive: { label: 'Tạm ngừng', variant: 'outline' },
};
