// ==================== PAYMENT TYPES ====================

export interface PaymentResponse {
  id: string;
  bookingId: string;
  amount: number;
  method: string;
  status: string;
  paidAt?: string;
  transactionId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentCreationRequest {
  bookingId: string;
  amount: number;
  method: string;
  status?: string;
  transactionId?: string;
}

export interface PaymentUpdateRequest {
  amount?: number;
  method?: string;
  status?: string;
  paidAt?: string;
  transactionId?: string;
}

export interface PaymentSearchParams {
  bookingId?: string;
  method?: string;
  status?: string;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: "asc" | "desc";
}
