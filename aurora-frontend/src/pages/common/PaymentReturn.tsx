import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { vnpayService } from '@/services/vnpayService';
import { getVnPayResponseMessage, isPaymentSuccessful } from '@/types/vnpay.types';
import type { VnPayReturnResponse } from '@/types/vnpay.types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

/**
 * Payment Return Page
 * Trang hiển thị kết quả thanh toán VNPay
 */
export default function PaymentReturn() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [paymentResult, setPaymentResult] = useState<VnPayReturnResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPaymentResult = async () => {
      try {
        // Pass URLSearchParams directly
        const response = await vnpayService.getPaymentResult(searchParams);
        
        if (response.result) {
          setPaymentResult(response.result);
        } else {
          setError('Không thể lấy thông tin thanh toán');
        }
      } catch (err: unknown) {
        console.error('Error fetching payment result:', err);
        setError('Lỗi khi lấy thông tin thanh toán');
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentResult();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="text-center">
          <div className="w-20 h-20 border-8 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-800">Đang xử lý kết quả thanh toán...</h2>
          <p className="text-gray-600 mt-2">Vui lòng đợi trong giây lát</p>
        </div>
      </div>
    );
  }

  if (error || !paymentResult) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-50 p-4">
        <Card className="max-w-2xl w-full shadow-2xl">
          <CardContent className="p-12 text-center">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">❌ Lỗi Hệ Thống</h1>
            <p className="text-xl text-gray-600 mb-8">{error || 'Không thể lấy thông tin thanh toán'}</p>
            <Button
              onClick={() => navigate('/')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 text-lg"
            >
              Về Trang Chủ
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const success = isPaymentSuccessful(paymentResult.responseCode);

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${
      success 
        ? 'bg-gradient-to-br from-green-50 via-blue-50 to-purple-50' 
        : 'bg-gradient-to-br from-red-50 via-orange-50 to-pink-50'
    }`}>
      <Card className="max-w-3xl w-full shadow-2xl animate-fade-in">
        <CardContent className="p-12">
          {/* Success Animation */}
          {success && (
            <div className="relative mb-8">
              <div className="w-32 h-32 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto shadow-lg animate-bounce-once">
                <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-green-400 rounded-full animate-ping opacity-20" />
            </div>
          )}

          {/* Failure Animation */}
          {!success && (
            <div className="w-32 h-32 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg animate-shake">
              <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          )}

          {/* Title */}
          <h1 className={`text-4xl font-bold text-center mb-4 ${
            success ? 'text-green-700' : 'text-red-700'
          }`}>
            {success ? '✅ Thanh Toán Thành Công!' : '❌ Thanh Toán Thất Bại'}
          </h1>

          {/* Message */}
          <p className="text-xl text-center text-gray-600 mb-8">
            {getVnPayResponseMessage(paymentResult.responseCode)}
          </p>

          {/* Payment Details */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 mb-8 space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <svg className="w-7 h-7 mr-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
              </svg>
              Chi Tiết Thanh Toán
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <DetailRow label="Mã giao dịch" value={paymentResult.txnRef} />
              <DetailRow label="Mã booking" value={paymentResult.bookingCode} />
              <DetailRow 
                label="Số tiền" 
                value={`${paymentResult.amount.toLocaleString('vi-VN')} ₫`}
                highlight
              />
              <DetailRow label="Ngân hàng" value={paymentResult.bankCode || 'N/A'} />
              <DetailRow label="Loại thẻ" value={paymentResult.cardType || 'N/A'} />
              <DetailRow label="Trạng thái" value={paymentResult.paymentStatus || 'N/A'} />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => navigate('/bookings')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 text-lg hover:shadow-xl transition-all"
            >
              📋 Xem Booking Của Tôi
            </Button>
            <Button
              onClick={() => navigate('/')}
              variant="outline"
              className="px-8 py-3 text-lg border-2 border-gray-300 hover:bg-gray-50 transition-all"
            >
              🏠 Về Trang Chủ
            </Button>
          </div>

          {/* Aurora Hotel Footer */}
          <div className="mt-12 pt-8 border-t-2 border-gray-200 text-center">
            <p className="text-gray-600 mb-2">
              Cảm ơn bạn đã sử dụng dịch vụ của{' '}
              <span className="font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Aurora Hotel
              </span>
            </p>
            <p className="text-sm text-gray-500">
              Mọi thắc mắc vui lòng liên hệ: hotline@aurorahotel.com | 1900-xxxx
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Helper Component
function DetailRow({ label, value, highlight = false }: { 
  label: string; 
  value: string; 
  highlight?: boolean;
}) {
  return (
    <div className={`p-4 rounded-xl ${highlight ? 'bg-green-100 border-2 border-green-300' : 'bg-white'}`}>
      <p className="text-sm text-gray-600 mb-1">{label}</p>
      <p className={`font-bold text-lg ${highlight ? 'text-green-700 text-xl' : 'text-gray-900'}`}>
        {value}
      </p>
    </div>
  );
}
