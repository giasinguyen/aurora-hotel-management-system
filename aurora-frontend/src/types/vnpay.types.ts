/**
 * VNPay Payment Gateway Types
 * Aurora Hotel Management System
 */

export interface VnPayPaymentRequest {
  bookingId: string;
  bankCode?: string; // VNPAYQR, VNBANK, INTCARD, NCB, etc.
  language?: 'vn' | 'en';
}

export interface VnPayPaymentResponse {
  paymentUrl: string;
  paymentId: string;
  txnRef: string;
  amount: number;
  expireTime: string;
  bookingCode: string;
}

export interface VnPayReturnParams {
  vnp_Amount: string;
  vnp_BankCode: string;
  vnp_BankTranNo: string;
  vnp_CardType: string;
  vnp_OrderInfo: string;
  vnp_PayDate: string;
  vnp_ResponseCode: string;
  vnp_TmnCode: string;
  vnp_TransactionNo: string;
  vnp_TransactionStatus: string;
  vnp_TxnRef: string;
  vnp_SecureHash: string;
}

export interface VnPayReturnResponse {
  valid: boolean;
  success: boolean;
  responseCode: string;
  txnRef: string;
  amount: number;
  transactionNo: string;
  bankCode: string;
  cardType: string;
  paymentId: string;
  bookingId: string;
  bookingCode: string;
  paymentStatus: string;
}

export interface PaymentMethod {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

/**
 * VNPay Response Codes
 * Source: VNPay API Documentation
 */
export const VNPAY_RESPONSE_CODES: Record<string, string> = {
  '00': 'Giao dịch thành công',
  '07': 'Trừ tiền thành công. Giao dịch bị nghi ngờ (liên quan tới lừa đảo, giao dịch bất thường).',
  '09': 'Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng chưa đăng ký dịch vụ InternetBanking tại ngân hàng.',
  '10': 'Giao dịch không thành công do: Khách hàng xác thực thông tin thẻ/tài khoản không đúng quá 3 lần',
  '11': 'Giao dịch không thành công do: Đã hết hạn chờ thanh toán. Xin quý khách vui lòng thực hiện lại giao dịch.',
  '12': 'Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng bị khóa.',
  '13': 'Giao dịch không thành công do Quý khách nhập sai mật khẩu xác thực giao dịch (OTP). Xin quý khách vui lòng thực hiện lại giao dịch.',
  '24': 'Giao dịch không thành công do: Khách hàng hủy giao dịch',
  '51': 'Giao dịch không thành công do: Tài khoản của quý khách không đủ số dư để thực hiện giao dịch.',
  '65': 'Giao dịch không thành công do: Tài khoản của Quý khách đã vượt quá hạn mức giao dịch trong ngày.',
  '75': 'Ngân hàng thanh toán đang bảo trì.',
  '79': 'Giao dịch không thành công do: KH nhập sai mật khẩu thanh toán quá số lần quy định. Xin quý khách vui lòng thực hiện lại giao dịch',
  '99': 'Các lỗi khác (lỗi còn lại, không có trong danh sách mã lỗi đã liệt kê)',
};

/**
 * Payment Methods for VNPay
 */
export const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 'VNPAYQR',
    name: 'VNPAY QR',
    description: 'Quét mã QR thanh toán nhanh chóng',
    icon: '📱',
    color: 'from-blue-500 to-blue-600',
  },
  {
    id: 'VNBANK',
    name: 'Thẻ ATM Nội Địa',
    description: 'Thẻ ATM các ngân hàng Việt Nam',
    icon: '🏦',
    color: 'from-green-500 to-green-600',
  },
  {
    id: 'INTCARD',
    name: 'Thẻ Quốc Tế',
    description: 'Visa, Mastercard, JCB, Amex',
    icon: '💳',
    color: 'from-purple-500 to-purple-600',
  },
  {
    id: '',
    name: 'Tất cả phương thức',
    description: 'VNPay sẽ hiển thị tất cả',
    icon: '💰',
    color: 'from-orange-500 to-orange-600',
  },
];

/**
 * Get response message by code
 */
export const getVnPayResponseMessage = (code: string): string => {
  return VNPAY_RESPONSE_CODES[code] || 'Lỗi không xác định';
};

/**
 * Check if payment is successful
 */
export const isPaymentSuccessful = (responseCode: string): boolean => {
  return responseCode === '00';
};
