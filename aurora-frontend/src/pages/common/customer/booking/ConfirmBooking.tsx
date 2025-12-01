import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { CheckCircle, Calendar, Users, Bed, Mail, Phone, CreditCard, Download, Home, ArrowRight, Sparkles } from "lucide-react";

const ConfirmBookingPage = () => {
  const confirmRef = useRef(null);
  const confirmInView = useInView(confirmRef, { once: true, margin: "-50px" });

  // Mock booking data
  const bookingData = {
    confirmationCode: "ABH" + Math.random().toString(36).substr(2, 9).toUpperCase(),
    roomType: "Phòng Deluxe Ocean View",
    roomImage: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&h=600&fit=crop",
    checkIn: "25/10/2025",
    checkInTime: "14:00",
    checkOut: "28/10/2025",
    checkOutTime: "12:00",
    nights: 3,
    guests: 2,
    pricePerNight: 1500000,
    totalPrice: 4500000,
    customerName: "Nguyễn Văn An",
    customerEmail: "nguyenvanan@example.com",
    customerPhone: "+84 123 456 789",
    paymentMethod: "Thẻ tín dụng",
    specialRequests: "Phòng tầng cao, view biển",
    hotelName: "Aurora Beach Hotel",
    hotelAddress: "123 Đường Biển, Vũng Tàu, Việt Nam",
    hotelPhone: "+84 254 123 4567",
    hotelEmail: "info@aurorabeach.com"
  };

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.6 }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      {/* Success Banner */}
      <div className="bg-gradient-to-r from-green-500 via-green-600 to-emerald-600 text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/5"></div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-24 h-24 bg-white rounded-full mb-6"
          >
            <CheckCircle className="w-16 h-16 text-green-500" />
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            Đặt Phòng Thành Công!
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-xl text-green-50 mb-6"
          >
            Cảm ơn bạn đã chọn {bookingData.hotelName}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className="inline-block bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full"
          >
            <p className="text-sm text-green-100 mb-1">Mã xác nhận của bạn</p>
            <p className="text-2xl font-bold tracking-wider">{bookingData.confirmationCode}</p>
          </motion.div>
        </motion.div>

        {/* Decorative elements */}
        <motion.div
          animate={{ 
            rotate: 360,
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-10 right-10 opacity-20"
        >
          <Sparkles className="w-16 h-16" />
        </motion.div>
      </div>

      {/* Main Content */}
      <div ref={confirmRef} className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 pb-16">
        <motion.div
          initial="hidden"
          animate={confirmInView ? "visible" : "hidden"}
          variants={staggerContainer}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {/* Left Column - Booking Details */}
          <motion.div variants={scaleIn} className="lg:col-span-2 space-y-6">
            {/* Room Info Card */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="relative h-64">
                <img
                  src={bookingData.roomImage}
                  alt={bookingData.roomType}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute bottom-4 left-4">
                  <h2 className="text-2xl font-bold text-white">{bookingData.roomType}</h2>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Chi Tiết Đặt Phòng</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3 bg-green-50 p-4 rounded-xl">
                    <div className="bg-green-500 text-white p-2 rounded-lg">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Check-in</p>
                      <p className="font-bold text-gray-900">{bookingData.checkIn}</p>
                      <p className="text-sm text-green-600">{bookingData.checkInTime}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 bg-green-50 p-4 rounded-xl">
                    <div className="bg-green-500 text-white p-2 rounded-lg">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Check-out</p>
                      <p className="font-bold text-gray-900">{bookingData.checkOut}</p>
                      <p className="text-sm text-green-600">{bookingData.checkOutTime}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 bg-green-50 p-4 rounded-xl">
                    <div className="bg-green-500 text-white p-2 rounded-lg">
                      <Bed className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Số đêm</p>
                      <p className="font-bold text-gray-900">{bookingData.nights} đêm</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 bg-green-50 p-4 rounded-xl">
                    <div className="bg-green-500 text-white p-2 rounded-lg">
                      <Users className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Số khách</p>
                      <p className="font-bold text-gray-900">{bookingData.guests} người</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Info */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Thông Tin Khách Hàng</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Users className="w-5 h-5 text-green-500" />
                  <div>
                    <p className="text-sm text-gray-600">Họ và tên</p>
                    <p className="font-semibold text-gray-900">{bookingData.customerName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Mail className="w-5 h-5 text-green-500" />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-semibold text-gray-900">{bookingData.customerEmail}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Phone className="w-5 h-5 text-green-500" />
                  <div>
                    <p className="text-sm text-gray-600">Số điện thoại</p>
                    <p className="font-semibold text-gray-900">{bookingData.customerPhone}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Special Requests */}
            {bookingData.specialRequests && (
              <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Yêu Cầu Đặc Biệt</h3>
                <p className="text-gray-700">{bookingData.specialRequests}</p>
              </div>
            )}

            {/* Important Notice */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6">
              <div className="flex gap-3">
                <div className="bg-blue-500 text-white p-2 rounded-lg h-fit">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Lưu ý quan trọng</h3>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Email xác nhận đã được gửi đến {bookingData.customerEmail}</li>
                    <li>• Vui lòng mang theo CMND/CCCD khi check-in</li>
                    <li>• Chính sách hủy phòng: Miễn phí hủy trước 48 giờ</li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Summary & Actions */}
          <motion.div variants={scaleIn} className="space-y-6">
            {/* Price Summary */}
            <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Tổng Quan Thanh Toán</h3>
              
              <div className="space-y-3 mb-4 pb-4 border-b border-gray-200">
                <div className="flex justify-between text-gray-700">
                  <span>{bookingData.pricePerNight.toLocaleString('vi-VN')} VNĐ x {bookingData.nights} đêm</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Giá phòng</span>
                  <span className="font-semibold">{(bookingData.pricePerNight * bookingData.nights).toLocaleString('vi-VN')} VNĐ</span>
                </div>
              </div>

              <div className="flex justify-between items-center mb-6">
                <span className="text-lg font-bold text-gray-900">Tổng cộng</span>
                <span className="text-2xl font-bold text-green-600">
                  {bookingData.totalPrice.toLocaleString('vi-VN')} VNĐ
                </span>
              </div>

              <div className="bg-green-50 p-4 rounded-xl mb-4">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-600">Phương thức</p>
                    <p className="font-semibold text-gray-900">{bookingData.paymentMethod}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-green-500 text-white py-3 rounded-xl font-semibold hover:bg-green-600 transition-all flex items-center justify-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Tải Xác Nhận
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-white border-2 border-green-500 text-green-600 py-3 rounded-xl font-semibold hover:bg-green-50 transition-all flex items-center justify-center gap-2"
                >
                  Xem Chi Tiết
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </div>
            </div>

            {/* Hotel Contact */}
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-bold mb-4">Thông Tin Liên Hệ</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Home className="w-5 h-5 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold mb-1">{bookingData.hotelName}</p>
                    <p className="text-sm text-green-100">{bookingData.hotelAddress}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5" />
                  <a href={`tel:${bookingData.hotelPhone}`} className="text-green-100 hover:text-white transition-colors">
                    {bookingData.hotelPhone}
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5" />
                  <a href={`mailto:${bookingData.hotelEmail}`} className="text-green-100 hover:text-white transition-colors">
                    {bookingData.hotelEmail}
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default ConfirmBookingPage;