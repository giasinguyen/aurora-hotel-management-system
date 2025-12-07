import instance from '@/config/axiosClient';
import type { ApiResponse } from '@/types/apiResponse';
import type {
  VnPayPaymentRequest,
  VnPayPaymentResponse,
  VnPayReturnResponse,
} from '@/types/vnpay.types';

/**
 * VNPay Payment Service
 * Aurora Hotel Management System
 */

const VNPAY_ENDPOINTS = {
  CREATE: '/api/v1/payments/vnpay/create',
  RETURN: '/api/v1/payments/vnpay/return',
} as const;

export const vnpayService = {
  /**
   * Tạo URL thanh toán VNPay cho booking
   * 
   * @param request VNPay payment request
   * @returns Payment URL và thông tin thanh toán
   * 
   * @example
   * const response = await vnpayService.createPaymentUrl({
   *   bookingId: 'booking-123',
   *   bankCode: 'VNBANK',
   *   language: 'vn'
   * });
   * 
   * // Redirect to VNPay
   * window.location.href = response.result.paymentUrl;
   */
  createPaymentUrl: async (
    request: VnPayPaymentRequest
  ): Promise<ApiResponse<VnPayPaymentResponse>> => {
    const response = await instance.post<ApiResponse<VnPayPaymentResponse>>(
      VNPAY_ENDPOINTS.CREATE,
      request
    );
    return response.data;
  },

  /**
   * Lấy kết quả thanh toán từ VNPay return URL
   * 
   * @param params URL search params từ VNPay redirect
   * @returns Kết quả thanh toán
   * 
   * @example
   * // In PaymentReturn page
   * const [searchParams] = useSearchParams();
   * const response = await vnpayService.getPaymentResult(searchParams);
   */
  getPaymentResult: async (
    params: URLSearchParams
  ): Promise<ApiResponse<VnPayReturnResponse>> => {
    // Convert URLSearchParams to plain object
    const paramsObject: Record<string, string> = {};
    params.forEach((value, key) => {
      paramsObject[key] = value;
    });
    
    const response = await instance.get<ApiResponse<VnPayReturnResponse>>(
      VNPAY_ENDPOINTS.RETURN,
      { params: paramsObject }
    );
    return response.data;
  },

  /**
   * Redirect user tới VNPay payment gateway
   * 
   * @param paymentUrl URL thanh toán từ backend
   * 
   * @example
   * vnpayService.redirectToVnPay(response.result.paymentUrl);
   */
  redirectToVnPay: (paymentUrl: string): void => {
    window.location.href = paymentUrl;
  },
};

export default vnpayService;
