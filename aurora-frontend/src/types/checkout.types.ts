export interface CheckoutRequest {
  branchId: string;
  customerId?: string | null;
  guestFullName?: string;
  guestEmail?: string;
  guestPhone?: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  nights: number;
  specialRequests?: string;
  paymentMethod: "cash" | "vnpay" | "momo" | "visa";
  paymentSuccess: boolean; // true = payment successful, false = payment failed
  promotionId?: string; // ID of applied promotion
  rooms: RoomBookingRequest[];
  services?: ServiceBookingRequest[];
}

export interface RoomBookingRequest {
  roomId: string;
  pricePerNight: number;
  roomNotes?: string;
}

export interface ServiceBookingRequest {
  serviceId: string;
  roomId: string;
  quantity: number;
  price: number;
}

