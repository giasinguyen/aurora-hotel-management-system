// ==================== PROMOTION TYPES ====================

export interface PromotionResponse {
  id: string;
  code: string;
  name: string;
  description?: string;
  discountType: string;
  discountValue: number;
  startDate: string;
  endDate: string;
  active: boolean;
  minBookingAmount?: number;
  maxDiscountAmount?: number;
  usageLimit?: number;
  usageCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface PromotionCreationRequest {
  code: string;
  name: string;
  description?: string;
  discountType: string;
  discountValue: number;
  startDate: string;
  endDate: string;
  active?: boolean;
  minBookingAmount?: number;
  maxDiscountAmount?: number;
  usageLimit?: number;
}

export interface PromotionUpdateRequest {
  code?: string;
  name?: string;
  description?: string;
  discountType?: string;
  discountValue?: number;
  startDate?: string;
  endDate?: string;
  active?: boolean;
  minBookingAmount?: number;
  maxDiscountAmount?: number;
  usageLimit?: number;
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
  sortDir?: "asc" | "desc";
}
