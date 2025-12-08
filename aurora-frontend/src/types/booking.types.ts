// Booking Types for Aurora Hotel Management System

export interface BookingRoom {
  id?: string;
  bookingId?: string;
  bookingCode?: string;
  roomId: string;
  roomNumber: string;
  roomType?: string; // Backend uses "roomType"
  roomTypeName?: string; // Alias for roomType for compatibility - use roomType || roomTypeName
  pricePerNight: number;
  nights?: number;
  totalPrice?: number;
  roomNotes?: string;
}

// Helper function to get room type name
export const getRoomTypeName = (room: BookingRoom): string => {
  return room.roomTypeName || room.roomType || 'Phòng';
};

export interface ServiceBooking {
  id: string;
  bookingId: string;
  bookingCode: string;
  serviceId: string;
  serviceName: string;
  serviceType: string;
  customerId: string;
  customerName: string;
  roomId?: string;
  roomNumber?: string;
  dateTime: string; // LocalDateTime as ISO string
  quantity: number;
  price: number;
  status: string;
}

export interface Booking {
  id: string;
  bookingCode: string;
  branchId: string;
  branchName: string;
  customerId: string;
  customerName: string;
  // Guest information (for walk-in guests)
  guestFullName?: string;
  guestEmail?: string;
  guestPhone?: string;
  checkin: string; // LocalDate as ISO string
  checkout: string;
  totalPrice: number;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  specialRequest?: string;
  rooms: BookingRoom[];
  services?: ServiceBooking[];
}

export type BookingStatus = 
  | 'PENDING' 
  | 'CONFIRMED' 
  | 'CHECKED_IN' 
  | 'CHECKED_OUT' 
  | 'COMPLETED'
  | 'CANCELLED' 
  | 'NO_SHOW';

export type PaymentStatus = 
  | 'PENDING'
  | 'DEPOSIT_PAID'
  | 'PARTIALLY_PAID' 
  | 'PAID' 
  | 'REFUNDED';

export interface BookingCreationRequest {
  branchId: string;
  customerId: string;
  checkin: string;
  checkout: string;
  roomIds: string[];
  specialRequest?: string;
}

export interface BookingUpdateRequest {
  checkin?: string;
  checkout?: string;
  totalPrice?: number;
  status?: string;
  paymentStatus?: string;
  specialRequest?: string;
}

export interface BookingConfirmRequest {
  bookingId: string;
  notes?: string;
}

export interface BookingCancellationRequest {
  bookingId: string;
  reason: string;
}

export interface BookingCancellationResponse {
  bookingId: string;
  refundAmount: number;
  cancellationDate: string;
  message: string;
}

export interface BookingSearchParams {
  branchId?: string;
  customerId?: string;
  status?: BookingStatus;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
}

// Status badge configurations
export const BOOKING_STATUS_CONFIG: Record<BookingStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' }> = {
  PENDING: { label: 'Chờ xác nhận', variant: 'warning' },
  CONFIRMED: { label: 'Đã xác nhận', variant: 'success' },
  CHECKED_IN: { label: 'Đã nhận phòng', variant: 'default' },
  CHECKED_OUT: { label: 'Đã trả phòng', variant: 'secondary' },
  COMPLETED: { label: 'Hoàn thành', variant: 'success' },
  CANCELLED: { label: 'Đã hủy', variant: 'destructive' },
  NO_SHOW: { label: 'Không đến', variant: 'outline' },
};

export const PAYMENT_STATUS_CONFIG: Record<PaymentStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' }> = {
  PENDING: { label: 'Chờ thanh toán', variant: 'warning' },
  DEPOSIT_PAID: { label: 'Đã đặt cọc', variant: 'secondary' },
  PARTIALLY_PAID: { label: 'Thanh toán một phần', variant: 'secondary' },
  PAID: { label: 'Đã thanh toán', variant: 'success' },
  REFUNDED: { label: 'Đã hoàn tiền', variant: 'outline' },
};
