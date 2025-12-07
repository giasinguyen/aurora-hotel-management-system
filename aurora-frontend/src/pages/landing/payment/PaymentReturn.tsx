import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle, XCircle, Loader2, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { vnpayService } from "@/services/vnpayService";
import { VNPAY_RESPONSE_CODES } from "@/types/vnpay.types";
import type { VnPayReturnResponse } from "@/types/vnpay.types";
import { formatCurrency } from "@/utils/exportUtils";
import { toast } from "sonner";

interface PaymentResult {
  success: boolean;
  responseCode: string;
  bookingId: string;
  bookingCode: string;
  amount: number;
  transactionNo: string;
  bankCode: string;
  message: string;
}

export default function PaymentReturnPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [paymentResult, setPaymentResult] = useState<PaymentResult | null>(null);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        setIsLoading(true);

        // Get pending booking info from localStorage
        const pendingBookingStr = localStorage.getItem("pendingBooking");
        let pendingBooking = null;
        if (pendingBookingStr) {
          pendingBooking = JSON.parse(pendingBookingStr);
        }

        // Call backend to verify payment with VNPay
        const response = await vnpayService.getPaymentResult(searchParams);
        
        if (response.result) {
          const result: VnPayReturnResponse = response.result;
          
          setPaymentResult({
            success: result.success || false,
            responseCode: result.responseCode || '99',
            bookingId: result.bookingId || pendingBooking?.bookingId || '',
            bookingCode: result.bookingCode || pendingBooking?.bookingCode || '',
            amount: result.amount || 0,
            transactionNo: result.transactionNo || '',
            bankCode: result.bankCode || '',
            message: result.success 
              ? 'Thanh toán thành công!' 
              : (VNPAY_RESPONSE_CODES[result.responseCode] || 'Thanh toán thất bại'),
          });

          if (result.success) {
            toast.success("Thanh toán thành công!");
          } else {
            toast.error("Thanh toán thất bại: " + (VNPAY_RESPONSE_CODES[result.responseCode] || 'Lỗi không xác định'));
          }

          // Clear pending data from localStorage
          localStorage.removeItem("pendingBooking");
          localStorage.removeItem("bookingRooms");
          localStorage.removeItem("bookingFilter");
          localStorage.removeItem("checkoutData");
        }
      } catch (error) {
        console.error("Payment verification failed:", error);
        setPaymentResult({
          success: false,
          responseCode: '99',
          bookingId: '',
          bookingCode: '',
          amount: 0,
          transactionNo: '',
          bankCode: '',
          message: 'Không thể xác minh thanh toán. Vui lòng liên hệ hỗ trợ.',
        });
        toast.error("Không thể xác minh thanh toán");
      } finally {
        setIsLoading(false);
      }
    };

    verifyPayment();
  }, [searchParams]);

  const handleBackToHome = () => {
    navigate("/");
  };

  const handleViewBooking = () => {
    if (paymentResult?.bookingId) {
      navigate(`/booking/success?bookingId=${paymentResult.bookingId}&bookingCode=${paymentResult.bookingCode}`);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <Loader2 className="h-16 w-16 text-primary mx-auto mb-4 animate-spin" />
            <h2 className="text-xl font-bold mb-2">Đang xác minh thanh toán...</h2>
            <p className="text-gray-600">Vui lòng đợi trong giây lát</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!paymentResult) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <AlertTriangle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Không tìm thấy thông tin thanh toán</h2>
            <p className="text-gray-600 mb-6">
              Vui lòng kiểm tra lại hoặc liên hệ hỗ trợ
            </p>
            <Button onClick={handleBackToHome} className="w-full">
              Về trang chủ
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <Card className="max-w-lg w-full">
        <CardContent className="p-8">
          {/* Success Icon */}
          <div className="text-center mb-6">
            {paymentResult.success ? (
              <>
                <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-4" />
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  Thanh toán thành công!
                </h1>
                <p className="text-gray-600">
                  Đơn đặt phòng của bạn đã được xác nhận
                </p>
              </>
            ) : (
              <>
                <XCircle className="h-20 w-20 text-red-500 mx-auto mb-4" />
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  Thanh toán thất bại
                </h1>
                <p className="text-gray-600">
                  {paymentResult.message}
                </p>
              </>
            )}
          </div>

          {/* Payment Details */}
          <div className="bg-gray-50 rounded-lg p-6 mb-6 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Mã đặt phòng:</span>
              <span className="font-semibold">{paymentResult.bookingCode || 'N/A'}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Số tiền:</span>
              <span className="font-semibold text-lg text-primary">
                {formatCurrency(paymentResult.amount)}
              </span>
            </div>

            {paymentResult.transactionNo && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Mã giao dịch:</span>
                <span className="font-mono text-sm">{paymentResult.transactionNo}</span>
              </div>
            )}

            {paymentResult.bankCode && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Ngân hàng:</span>
                <span className="font-semibold">{paymentResult.bankCode}</span>
              </div>
            )}

            <div className="flex justify-between items-center">
              <span className="text-gray-600">Trạng thái:</span>
              <span className={`font-semibold ${
                paymentResult.success ? 'text-green-600' : 'text-red-600'
              }`}>
                {paymentResult.success ? 'Thành công' : 'Thất bại'}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            {paymentResult.success ? (
              <>
                <Button 
                  onClick={handleViewBooking}
                  className="w-full"
                  size="lg"
                >
                  Xem chi tiết đặt phòng
                </Button>
                <Button 
                  onClick={handleBackToHome}
                  variant="outline"
                  className="w-full"
                  size="lg"
                >
                  Về trang chủ
                </Button>
              </>
            ) : (
              <>
                <Button 
                  onClick={() => navigate("/booking")}
                  className="w-full"
                  size="lg"
                >
                  Đặt phòng lại
                </Button>
                <Button 
                  onClick={handleBackToHome}
                  variant="outline"
                  className="w-full"
                  size="lg"
                >
                  Về trang chủ
                </Button>
              </>
            )}
          </div>

          {/* Support Note */}
          {!paymentResult.success && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800">
                <strong>Lưu ý:</strong> Nếu tiền đã bị trừ nhưng đặt phòng không thành công, 
                vui lòng liên hệ bộ phận hỗ trợ với mã giao dịch{' '}
                <span className="font-mono font-semibold">{paymentResult.transactionNo}</span>
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
