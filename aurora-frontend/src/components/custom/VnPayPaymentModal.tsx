import { useState } from 'react';
import { toast } from 'sonner';
import { vnpayService } from '@/services/vnpayService';
import { PAYMENT_METHODS, type PaymentMethod } from '@/types/vnpay.types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

interface VnPayPaymentModalProps {
  bookingId: string;
  amount: number;
  bookingCode?: string;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * VNPay Payment Modal Component
 * Modal chọn phương thức thanh toán VNPay
 */
export default function VnPayPaymentModal({
  bookingId,
  amount,
  bookingCode,
  isOpen,
  onClose,
}: VnPayPaymentModalProps) {
  const [loading, setLoading] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);

  const handlePayment = async (bankCode: string) => {
    setLoading(true);
    setSelectedMethod(bankCode);

    try {
      const response = await vnpayService.createPaymentUrl({
        bookingId,
        bankCode: bankCode || undefined,
        language: 'vn',
      });

      if (response.result?.paymentUrl) {
        // Show success toast before redirect
        toast.success('Đang chuyển đến trang thanh toán...', {
          duration: 2000,
        });

        // Small delay for better UX
        setTimeout(() => {
          if (response.result?.paymentUrl) {
            vnpayService.redirectToVnPay(response.result.paymentUrl);
          }
        }, 500);
      } else {
        toast.error('Không thể tạo link thanh toán');
        setLoading(false);
        setSelectedMethod(null);
      }
    } catch (error: unknown) {
      console.error('Payment error:', error);
      const errorMsg =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 
        'Lỗi khi tạo thanh toán. Vui lòng thử lại!';
      toast.error(errorMsg);
      setLoading(false);
      setSelectedMethod(null);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-3xl font-bold text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            💳 Chọn Phương Thức Thanh Toán
          </SheetTitle>
          <SheetDescription className="text-center text-lg pt-2">
            {bookingCode && (
              <div className="mb-2 text-sm text-gray-600">
                Booking: <span className="font-semibold">{bookingCode}</span>
              </div>
            )}
            <div className="text-xl">
              Số tiền thanh toán:{' '}
              <span className="font-bold text-2xl text-green-600">
                {amount.toLocaleString('vi-VN')} ₫
              </span>
            </div>
          </SheetDescription>
        </SheetHeader>

        <div className="mt-8 space-y-4">
          {PAYMENT_METHODS.map((method: PaymentMethod) => (
            <Card
              key={method.id}
              className={`
                p-6 cursor-pointer transition-all duration-300 hover:shadow-xl
                ${
                  selectedMethod === method.id
                    ? 'ring-4 ring-blue-500 scale-[1.02] shadow-2xl'
                    : 'hover:scale-[1.02] hover:shadow-lg'
                }
                ${loading ? 'opacity-50 cursor-not-allowed' : ''}
              `}
              onClick={() => !loading && handlePayment(method.id)}
            >
              <div className="flex items-center space-x-4">
                <div
                  className={`
                    w-20 h-20 rounded-2xl flex items-center justify-center
                    bg-gradient-to-br ${method.color} shadow-lg
                    transition-transform duration-300
                    ${selectedMethod === method.id ? 'scale-110' : ''}
                  `}
                >
                  <span className="text-4xl">{method.icon}</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-xl text-gray-900 mb-1">
                    {method.name}
                  </h3>
                  <p className="text-sm text-gray-600">{method.description}</p>
                </div>
                {loading && selectedMethod === method.id && (
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    <span className="text-xs text-gray-500 mt-2">
                      Đang xử lý...
                    </span>
                  </div>
                )}
                {!loading && (
                  <div className="text-blue-600 text-2xl">→</div>
                )}
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-8 space-y-4">
          {/* Security Info */}
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500 bg-gray-50 p-4 rounded-xl">
            <svg
              className="w-5 h-5 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            <p>
              <span className="font-semibold">Thanh toán an toàn</span> được bảo mật bởi VNPay
            </p>
          </div>

          {/* Payment Notes */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
            <h4 className="font-bold text-blue-900 mb-2 flex items-center">
              <svg
                className="w-5 h-5 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              Lưu ý quan trọng
            </h4>
            <ul className="text-sm text-blue-800 space-y-1 ml-7">
              <li>• Phiên thanh toán có hiệu lực trong <span className="font-semibold">15 phút</span></li>
              <li>• Vui lòng không tắt trình duyệt trong quá trình thanh toán</li>
              <li>• Kiểm tra kỹ thông tin trước khi xác nhận</li>
            </ul>
          </div>

          {/* Cancel Button */}
          <Button
            variant="outline"
            className="w-full"
            onClick={onClose}
            disabled={loading}
          >
            Hủy bỏ
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
