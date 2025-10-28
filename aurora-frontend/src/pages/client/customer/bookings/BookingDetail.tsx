import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Calendar, MapPin, Users, Bed, DollarSign, Phone, Mail, ArrowLeft, Download, CheckCircle, Home, Wifi, Coffee, Car } from "lucide-react";

const bookingDetail = {
  id: "BK001234",
  status: "confirmed",
  roomName: "Phòng Deluxe Ocean View",
  roomType: "Deluxe",
  roomImages: [
    "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&h=600&fit=crop"
  ],
  checkIn: "25/10/2025",
  checkInTime: "14:00",
  checkOut: "28/10/2025",
  checkOutTime: "12:00",
  nights: 3,
  guests: 2,
  pricePerNight: 1500000,
  totalPrice: 4500000,
  bookingDate: "15/10/2025",
  paymentMethod: "Thẻ tín dụng",
  customerName: "Nguyễn Văn An",
  customerEmail: "nguyenvanan@example.com",
  customerPhone: "+84 123 456 789",
  specialRequests: "Phòng tầng cao, view biển",
  amenities: ["WiFi miễn phí", "Bữa sáng buffet", "Đưa đón sân bay", "Bể bơi"],
  hotelAddress: "123 Đường Biển, Vũng Tàu, Việt Nam",
  hotelPhone: "+84 254 123 4567"
};

export default function BookingDetailPage() {
  const [selectedImage, setSelectedImage] = useState(0);
  const detailRef = useRef(null);
  const detailInView = useInView(detailRef, { once: true, margin: "-50px" });

  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      {/* Header Section */}
      <div className="bg-gradient-to-br from-green-500 via-green-600 to-emerald-600 text-white py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
          >
            <motion.button
              whileHover={{ x: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.history.back()}
              className="flex items-center gap-2 text-green-100 hover:text-white mb-6 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Quay lại danh sách
            </motion.button>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-2">Chi Tiết Đặt Phòng</h1>
                <p className="text-green-50 text-lg">Mã đặt phòng: {bookingDetail.id}</p>
              </div>
              <div className="flex items-center gap-2 bg-green-700/50 backdrop-blur-sm px-4 py-2 rounded-xl">
                <CheckCircle className="w-5 h-5" />
                <span className="font-semibold">Đã xác nhận</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div ref={detailRef} className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 pb-16">
        <motion.div
          initial="hidden"
          animate={detailInView ? "visible" : "hidden"}
          variants={staggerContainer}
          className="space-y-6"
        >
          {/* Image Gallery */}
          <motion.div variants={scaleIn} className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="relative h-96">
              <motion.img
                key={selectedImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                src={bookingDetail.roomImages[selectedImage]}
                alt="Room"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4 flex gap-3 overflow-x-auto">
              {bookingDetail.roomImages.map((img, idx) => (
                <motion.button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex-shrink-0 w-24 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === idx ? "border-green-500 shadow-md" : "border-gray-200"
                  }`}
                >
                  <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Room & Booking Info */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Booking Details */}
            <motion.div variants={scaleIn} className="lg:col-span-2 space-y-6">
              {/* Room Info */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{bookingDetail.roomName}</h2>
                <div className="flex items-center gap-2 mb-6">
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                    {bookingDetail.roomType}
                  </span>
                  <span className="text-gray-600">•</span>
                  <span className="text-gray-600">{bookingDetail.guests} khách</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3 bg-green-50 p-4 rounded-xl">
                    <div className="bg-green-500 text-white p-2 rounded-lg">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Check-in</p>
                      <p className="font-bold text-gray-900">{bookingDetail.checkIn}</p>
                      <p className="text-sm text-green-600">{bookingDetail.checkInTime}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 bg-green-50 p-4 rounded-xl">
                    <div className="bg-green-500 text-white p-2 rounded-lg">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Check-out</p>
                      <p className="font-bold text-gray-900">{bookingDetail.checkOut}</p>
                      <p className="text-sm text-green-600">{bookingDetail.checkOutTime}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 bg-green-50 p-4 rounded-xl">
                    <div className="bg-green-500 text-white p-2 rounded-lg">
                      <Bed className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Số đêm</p>
                      <p className="font-bold text-gray-900">{bookingDetail.nights} đêm</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 bg-green-50 p-4 rounded-xl">
                    <div className="bg-green-500 text-white p-2 rounded-lg">
                      <Users className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Số khách</p>
                      <p className="font-bold text-gray-900">{bookingDetail.guests} người</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Customer Info */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Thông Tin Khách Hàng</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-green-500" />
                    <span className="text-gray-900 font-medium">{bookingDetail.customerName}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-green-500" />
                    <span className="text-gray-600">{bookingDetail.customerEmail}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-green-500" />
                    <span className="text-gray-600">{bookingDetail.customerPhone}</span>
                  </div>
                </div>
              </div>

              {/* Amenities */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Tiện Nghi</h3>
                <div className="grid grid-cols-2 gap-3">
                  {bookingDetail.amenities.map((amenity, idx) => (
                    <motion.div
                      key={idx}
                      whileHover={{ x: 5 }}
                      className="flex items-center gap-2 text-gray-700"
                    >
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span>{amenity}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Special Requests */}
              {bookingDetail.specialRequests && (
                <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Yêu Cầu Đặc Biệt</h3>
                  <p className="text-gray-700">{bookingDetail.specialRequests}</p>
                </div>
              )}
            </motion.div>

            {/* Right Column - Price Summary */}
            <motion.div variants={scaleIn} className="space-y-6">
              {/* Price Breakdown */}
              <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Chi Tiết Giá</h3>
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-gray-700">
                    <span>{bookingDetail.pricePerNight.toLocaleString('vi-VN')} VNĐ x {bookingDetail.nights} đêm</span>
                    <span>{(bookingDetail.pricePerNight * bookingDetail.nights).toLocaleString('vi-VN')} VNĐ</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-gray-900">Tổng cộng</span>
                      <span className="text-2xl font-bold text-green-600">
                        {bookingDetail.totalPrice.toLocaleString('vi-VN')} VNĐ
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 p-4 rounded-xl mb-4">
                  <div className="flex items-start gap-2">
                    <DollarSign className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">Phương thức thanh toán</p>
                      <p className="text-gray-600 text-sm">{bookingDetail.paymentMethod}</p>
                    </div>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-green-500 text-white py-3 rounded-xl font-semibold hover:bg-green-600 transition-all flex items-center justify-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Tải Xác Nhận
                </motion.button>
              </div>

              {/* Hotel Contact */}
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold mb-4">Liên Hệ Khách Sạn</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Home className="w-5 h-5 mt-1" />
                    <p className="text-green-50">{bookingDetail.hotelAddress}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5" />
                    <a href={`tel:${bookingDetail.hotelPhone}`} className="text-green-50 hover:text-white transition-colors">
                      {bookingDetail.hotelPhone}
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}