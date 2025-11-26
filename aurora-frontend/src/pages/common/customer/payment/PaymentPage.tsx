import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { CreditCard, Building2, ArrowRight, Lock, AlertCircle, Copy, CheckCircle, Download, Smartphone } from "lucide-react";

interface BookingData {
  confirmationCode: string;
  roomName: string;
  fullName: string;
  guests: number;
  checkIn: string;
  checkOut: string;
  roomPrice: string;
  paymentMethod: 'credit-card' | 'bank-transfer';
}

export default function CustomerPaymentPage() {
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [cardData, setCardData] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: ""
  });

  // Bank info for VietQR
  const bankInfo = {
    bankId: "970436", // Vietcombank
    accountNo: "1234567890",
    accountName: "CONG TY AURORA BEACH HOTEL",
    amount: "",
    description: ""
  };

  const generateVietQR = useCallback((data: BookingData) => {
    // Remove commas and convert to number
    const amount = data.roomPrice.replace(/,/g, '');
    const description = `${data.confirmationCode} ${data.fullName}`;
    
    // VietQR API format (using img.vietqr.io - free service)
    const qrUrl = `https://img.vietqr.io/image/${bankInfo.bankId}-${bankInfo.accountNo}-compact2.png?amount=${amount}&addInfo=${encodeURIComponent(description)}&accountName=${encodeURIComponent(bankInfo.accountName)}`;
    
    setQrCodeUrl(qrUrl);
  }, [bankInfo.bankId, bankInfo.accountNo, bankInfo.accountName]);

  useEffect(() => {
    const data = sessionStorage.getItem('bookingData');
    if (data) {
      const parsed = JSON.parse(data) as BookingData;
      setBookingData(parsed);
      
      // Generate VietQR when payment method is bank transfer
      if (parsed.paymentMethod === 'bank-transfer') {
        generateVietQR(parsed);
      }
    }
  }, [generateVietQR]);

  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 }
    }
  };

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadQR = () => {
    if (!bookingData) return;
    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = `QR-${bookingData.confirmationCode}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePayment = () => {
    setPaymentCompleted(true);
    setTimeout(() => {
      window.location.href = '/customer/booking/confirm';
    }, 2000);
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  if (!bookingData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Không tìm thấy thông tin đặt phòng</h2>
          <p className="text-gray-600 mb-6">Vui lòng quay lại trang đặt phòng</p>
          <a href="/customer/booking/create" className="px-6 py-3 bg-green-500 text-white rounded-xl font-semibold">
            Quay lại
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-80 bg-gradient-to-br from-green-600 via-green-500 to-emerald-400 overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <motion.div 
          className="relative z-10 h-full flex flex-col items-center justify-center text-white px-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <Lock className="w-16 h-16 mb-4" />
          </motion.div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4 text-center">Thanh Toán An Toàn</h1>
          <p className="text-xl md:text-2xl text-white/90 text-center max-w-2xl">
            Hoàn tất thanh toán để xác nhận đặt phòng
          </p>
        </motion.div>
        
        {/* Decorative waves */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" className="w-full h-24">
            <path fill="#ffffff" d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
          </svg>
        </div>
      </section>

      {/* Payment Section */}
      <section className="max-w-6xl mx-auto px-4 pb-20 -mt-8 relative z-20">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <motion.div 
            className="lg:col-span-2"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <div className="bg-white rounded-2xl shadow-xl p-8">
              {bookingData.paymentMethod === 'credit-card' ? (
                // Credit Card Form
                <div>
                  <motion.div variants={fadeInUp} className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                      <CreditCard className="w-8 h-8 text-green-500" />
                      Thông Tin Thẻ
                    </h2>
                    <p className="text-gray-600">Nhập thông tin thẻ tín dụng/ghi nợ của bạn</p>
                  </motion.div>

                  <div className="space-y-6">
                    <motion.div variants={fadeInUp}>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Số Thẻ *
                      </label>
                      <input
                        type="text"
                        value={cardData.cardNumber}
                        onChange={(e) => setCardData({...cardData, cardNumber: formatCardNumber(e.target.value)})}
                        maxLength={19}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-all"
                        placeholder="1234 5678 9012 3456"
                      />
                    </motion.div>

                    <motion.div variants={fadeInUp}>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Tên Trên Thẻ *
                      </label>
                      <input
                        type="text"
                        value={cardData.cardName}
                        onChange={(e) => setCardData({...cardData, cardName: e.target.value.toUpperCase()})}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-all"
                        placeholder="NGUYEN VAN A"
                      />
                    </motion.div>

                    <motion.div variants={fadeInUp} className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Ngày Hết Hạn *
                        </label>
                        <input
                          type="text"
                          value={cardData.expiryDate}
                          onChange={(e) => {
                            let val = e.target.value.replace(/\D/g, '');
                            if (val.length >= 2) {
                              val = val.slice(0, 2) + '/' + val.slice(2, 4);
                            }
                            setCardData({...cardData, expiryDate: val});
                          }}
                          maxLength={5}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-all"
                          placeholder="MM/YY"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          CVV *
                        </label>
                        <input
                          type="text"
                          value={cardData.cvv}
                          onChange={(e) => setCardData({...cardData, cvv: e.target.value.replace(/\D/g, '')})}
                          maxLength={3}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-all"
                          placeholder="123"
                        />
                      </div>
                    </motion.div>

                    <motion.div variants={fadeInUp} className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 flex gap-3">
                      <Lock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-blue-900">
                        <p className="font-semibold mb-1">Thanh toán được mã hóa an toàn</p>
                        <p className="text-blue-700">Thông tin thẻ của bạn được bảo vệ bằng công nghệ mã hóa SSL 256-bit</p>
                      </div>
                    </motion.div>
                  </div>
                </div>
              ) : (
                // Bank Transfer with VietQR
                <div>
                  <motion.div variants={fadeInUp} className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                      <Building2 className="w-8 h-8 text-green-500" />
                      Chuyển Khoản Ngân Hàng
                    </h2>
                    <p className="text-gray-600">Quét mã QR hoặc chuyển khoản thủ công</p>
                  </motion.div>

                  <div className="grid md:grid-cols-2 gap-8">
                    {/* QR Code Section */}
                    <motion.div variants={fadeInUp} className="order-2 md:order-1">
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 border-2 border-green-200 text-center">
                        <div className="flex items-center justify-center gap-2 mb-4">
                          <Smartphone className="w-6 h-6 text-green-600" />
                          <h3 className="font-bold text-gray-900 text-lg">Quét Mã QR</h3>
                        </div>
                        
                        {qrCodeUrl ? (
                          <div className="mb-4">
                            <div className="bg-white p-4 rounded-2xl inline-block shadow-lg">
                              <img 
                                src={qrCodeUrl} 
                                alt="VietQR Code" 
                                className="w-64 h-64 mx-auto"
                                onError={(e) => {
                                  e.currentTarget.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256"><rect fill="%23f0f0f0" width="256" height="256"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="%23999" font-size="16">QR Loading...</text></svg>';
                                }}
                              />
                            </div>
                            <motion.button
                              onClick={handleDownloadQR}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="mt-4 px-6 py-3 bg-white border-2 border-green-500 text-green-600 rounded-xl font-semibold hover:bg-green-50 transition-all flex items-center gap-2 mx-auto"
                            >
                              <Download className="w-5 h-5" />
                              Tải Mã QR
                            </motion.button>
                          </div>
                        ) : (
                          <div className="w-64 h-64 bg-white rounded-2xl mx-auto flex items-center justify-center">
                            <div className="text-gray-400 text-center">
                              <Building2 className="w-16 h-16 mx-auto mb-2 animate-pulse" />
                              <p className="text-sm">Đang tạo mã QR...</p>
                            </div>
                          </div>
                        )}

                        <div className="bg-white rounded-xl p-4 mt-4">
                          <p className="text-sm text-gray-600 mb-2">Hướng dẫn:</p>
                          <ol className="text-sm text-left text-gray-700 space-y-2">
                            <li className="flex gap-2">
                              <span className="font-bold text-green-600">1.</span>
                              <span>Mở app ngân hàng bất kỳ</span>
                            </li>
                            <li className="flex gap-2">
                              <span className="font-bold text-green-600">2.</span>
                              <span>Chọn chức năng quét QR</span>
                            </li>
                            <li className="flex gap-2">
                              <span className="font-bold text-green-600">3.</span>
                              <span>Quét mã và xác nhận thanh toán</span>
                            </li>
                          </ol>
                        </div>
                      </div>
                    </motion.div>

                    {/* Bank Info Section */}
                    <motion.div variants={fadeInUp} className="order-1 md:order-2 space-y-6">
                      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border-2 border-blue-200">
                        <div className="flex items-center gap-2 mb-4">
                          <Building2 className="w-6 h-6 text-blue-600" />
                          <h3 className="font-bold text-gray-900 text-lg">Chuyển Khoản Thủ Công</h3>
                        </div>
                        <div className="space-y-4">
                          <div>
                            <p className="text-sm text-gray-600 mb-1">Ngân hàng</p>
                            <p className="font-bold text-gray-900">Vietcombank</p>
                            <p className="text-sm text-gray-600">Chi nhánh TP.HCM</p>
                          </div>
                          <div className="flex justify-between items-center bg-white rounded-lg p-3">
                            <div>
                              <p className="text-sm text-gray-600">Số tài khoản</p>
                              <p className="font-bold text-gray-900 text-lg">{bankInfo.accountNo}</p>
                            </div>
                            <button
                              onClick={() => handleCopyText(bankInfo.accountNo)}
                              className="p-2 hover:bg-gray-100 rounded-lg transition-all"
                            >
                              {copied ? <CheckCircle className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5 text-gray-600" />}
                            </button>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 mb-1">Chủ tài khoản</p>
                            <p className="font-bold text-gray-900">{bankInfo.accountName}</p>
                          </div>
                          <div className="flex justify-between items-center bg-green-100 rounded-lg p-3 border-2 border-green-300">
                            <div>
                              <p className="text-sm text-gray-600">Số tiền</p>
                              <p className="font-bold text-green-600 text-xl">{bookingData.roomPrice} VNĐ</p>
                            </div>
                          </div>
                          <div className="flex justify-between items-center bg-yellow-50 rounded-lg p-3 border-2 border-yellow-300">
                            <div className="flex-1">
                              <p className="text-sm text-gray-600">Nội dung CK</p>
                              <p className="font-bold text-gray-900 break-all">{bookingData.confirmationCode}</p>
                            </div>
                            <button
                              onClick={() => handleCopyText(bookingData.confirmationCode)}
                              className="p-2 hover:bg-yellow-100 rounded-lg transition-all ml-2"
                            >
                              {copied ? <CheckCircle className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5 text-gray-600" />}
                            </button>
                          </div>
                        </div>
                      </div>

                      <motion.div variants={fadeInUp} className="bg-amber-50 border-2 border-amber-200 rounded-xl p-4 flex gap-3">
                        <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-amber-900">
                          <p className="font-semibold mb-1">Lưu ý quan trọng</p>
                          <ul className="list-disc list-inside space-y-1 text-amber-800">
                            <li>Nội dung chuyển khoản PHẢI đúng mã booking</li>
                            <li>Hệ thống tự động xác nhận sau 1-5 phút</li>
                            <li>Không cần gửi biên lai, hệ thống tự kiểm tra</li>
                          </ul>
                        </div>
                      </motion.div>
                    </motion.div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-2xl shadow-xl p-8 sticky top-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Chi Tiết Đặt Phòng</h3>
              <div className="space-y-4 mb-6">
                <div>
                  <p className="text-sm text-gray-600">Mã đặt phòng</p>
                  <p className="font-bold text-green-600 text-lg">{bookingData.confirmationCode}</p>
                </div>
                <div className="border-t pt-4">
                  <p className="text-sm text-gray-600">Loại phòng</p>
                  <p className="font-semibold text-gray-900">{bookingData.roomName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Khách hàng</p>
                  <p className="font-semibold text-gray-900">{bookingData.fullName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Số khách</p>
                  <p className="font-semibold text-gray-900">{bookingData.guests} người</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Ngày nhận phòng</p>
                  <p className="font-semibold text-gray-900">{bookingData.checkIn}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Ngày trả phòng</p>
                  <p className="font-semibold text-gray-900">{bookingData.checkOut}</p>
                </div>
              </div>
              
              <div className="border-t-2 border-gray-200 pt-6 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Giá phòng</span>
                  <span className="font-semibold text-gray-900">{bookingData.roomPrice} VNĐ</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Thuế & phí</span>
                  <span className="font-semibold text-gray-900">Đã bao gồm</span>
                </div>
                <div className="border-t-2 border-green-300 pt-4 mt-4 flex justify-between items-center">
                  <span className="text-xl font-bold text-gray-900">Tổng cộng</span>
                  <span className="text-2xl font-bold text-green-600">{bookingData.roomPrice} VNĐ</span>
                </div>
              </div>

              <motion.button
                onClick={handlePayment}
                disabled={paymentCompleted || (bookingData.paymentMethod === 'credit-card' && (!cardData.cardNumber || !cardData.cardName || !cardData.expiryDate || !cardData.cvv))}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-500 text-white rounded-xl font-bold hover:from-green-700 hover:to-emerald-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-green-200"
              >
                {paymentCompleted ? (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    {bookingData.paymentMethod === 'credit-card' ? 'Thanh Toán Ngay' : 'Đã Chuyển Khoản'}
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </motion.button>

              {bookingData.paymentMethod === 'bank-transfer' && (
                <div className="mt-4 text-center">
                  <p className="text-xs text-gray-500 mb-2">
                    Nhấn nút sau khi hoàn tất chuyển khoản
                  </p>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="text-xs text-green-700 font-medium">
                      ✓ Hệ thống tự động xác nhận thanh toán trong 1-5 phút
                    </p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}