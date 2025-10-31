import axiosClient from '@/lib/axiosClient';
import type { ApiResponse } from '@/types/api.types';
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
  CREATE: '/payments/vnpay/create',
  RETURN: '/payments/vnpay/return',
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
    const response = await axiosClient.post<ApiResponse<VnPayPaymentResponse>>(
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
    const response = await axiosClient.get<ApiResponse<VnPayReturnResponse>>(
      VNPAY_ENDPOINTS.RETURN,
      { params }
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
