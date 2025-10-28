import { motion, useInView } from "framer-motion";
import { useRef, useState, type ComponentType } from "react";
import { Calendar, MapPin, Clock, DollarSign, Eye, Filter, Search, CheckCircle, XCircle, Clock as Pending } from "lucide-react";


type BookingStatus = "confirmed" | "pending" | "completed" | "cancelled";
interface Booking {
  id: number;
  roomName: string;
  roomImage: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  totalPrice: number;
  status: BookingStatus;
  bookingDate: string;
}

const bookingData: Booking[] = [
  {
    id: 1,
    roomName: "Phòng Deluxe Ocean View",
    roomImage: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=400&h=300&fit=crop",
    checkIn: "25/10/2025",
    checkOut: "28/10/2025",
    nights: 3,
    totalPrice: 4500000,
    status: "confirmed",
    bookingDate: "15/10/2025"
  },
  {
    id: 2,
    roomName: "Phòng Suite Presidential",
    roomImage: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=300&fit=crop",
    checkIn: "05/11/2025",
    checkOut: "10/11/2025",
    nights: 5,
    totalPrice: 12500000,
    status: "pending",
    bookingDate: "18/10/2025"
  },
  {
    id: 3,
    roomName: "Phòng Standard Garden",
    roomImage: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=400&h=300&fit=crop",
    checkIn: "01/09/2025",
    checkOut: "03/09/2025",
    nights: 2,
    totalPrice: 2000000,
    status: "completed",
    bookingDate: "20/08/2025"
  },
  {
    id: 4,
    roomName: "Phòng Deluxe City View",
    roomImage: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&h=300&fit=crop",
    checkIn: "15/08/2025",
    checkOut: "17/08/2025",
    nights: 2,
    totalPrice: 2800000,
    status: "cancelled",
    bookingDate: "10/08/2025"
  }
];
  const filterTabs: { id: BookingStatus | "all"; label: string; icon: ComponentType<any> }[] = [
    { id: "all", label: "Tất cả", icon: Filter },
    { id: "confirmed", label: "Đã xác nhận", icon: CheckCircle },
    { id: "pending", label: "Chờ xác nhận", icon: Pending },
    { id: "completed", label: "Hoàn thành", icon: CheckCircle },
    { id: "cancelled", label: "Đã hủy", icon: XCircle }
  ];

export default function CustomerBookingListPage() {
  const [filter, setFilter] = useState<BookingStatus | "all">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const listRef = useRef(null);
  const listInView = useInView(listRef, { once: true, margin: "-50px" });

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
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const getStatusConfig = (status: BookingStatus) => {
    const configs: Record<
      BookingStatus,
      { label: string; color: string; icon: ComponentType<any> }
    > = {
      confirmed: {
        label: "Đã xác nhận",
        color: "bg-green-100 text-green-700 border-green-200",
        icon: CheckCircle
      },
      pending: {
        label: "Chờ xác nhận",
        color: "bg-yellow-100 text-yellow-700 border-yellow-200",
        icon: Pending
      },
      completed: {
        label: "Hoàn thành",
        color: "bg-blue-100 text-blue-700 border-blue-200",
        icon: CheckCircle
      },
      cancelled: {
        label: "Đã hủy",
        color: "bg-red-100 text-red-700 border-red-200",
        icon: XCircle
      }
    };
    return configs[status];
  };

  const filteredBookings = bookingData.filter(booking => {
    const matchesFilter = filter === "all" || booking.status === filter;
    const matchesSearch = booking.roomName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      {/* Header Section */}
      <div className="bg-gradient-to-br from-green-500 via-green-600 to-emerald-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-3">Lịch Sử Đặt Phòng</h1>
            <p className="text-green-50 text-lg">Quản lý tất cả các đặt phòng của bạn</p>
          </motion.div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl shadow-xl p-6"
        >
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Tìm kiếm phòng..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-green-500 transition-all"
              />
            </div>

            {/* Filter Tabs */}
               <div className="flex gap-2 overflow-x-auto">
                {filterTabs.map((item) => (
                  <motion.button
                    key={item.id}
                    onClick={() => setFilter(item.id)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all ${
                      filter === item.id
                        ? "bg-green-500 text-white shadow-md"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </motion.button>
                ))}
              </div>
          </div>
        </motion.div>
      </div>

      {/* Bookings List */}
      <div ref={listRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <motion.div
          initial="hidden"
          animate={listInView ? "visible" : "hidden"}
          variants={staggerContainer}
          className="grid grid-cols-1 gap-6"
        >
          {filteredBookings.length > 0 ? (
            filteredBookings.map((booking) => {
              const statusConfig = getStatusConfig(booking.status);
              const StatusIcon = statusConfig.icon;

              return (
                <motion.div
                  key={booking.id}
                  variants={cardVariants}
                  whileHover={{ y: -5, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden"
                >
                  <div className="flex flex-col md:flex-row">
                    {/* Image */}
                    <div className="md:w-80 h-64 md:h-auto relative overflow-hidden">
                      <motion.img
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.4 }}
                        src={booking.roomImage}
                        alt={booking.roomName}
                        className="w-full h-full object-cover"
                      />
                      <div className={`absolute top-4 right-4 px-3 py-1 rounded-full border ${statusConfig.color} flex items-center gap-1 font-semibold text-sm backdrop-blur-sm`}>
                        <StatusIcon className="w-4 h-4" />
                        {statusConfig.label}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-6">
                      <div className="flex flex-col h-full">
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold text-gray-900 mb-4">{booking.roomName}</h3>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                            <div className="flex items-start gap-3">
                              <div className="bg-green-100 p-2 rounded-lg">
                                <Calendar className="w-5 h-5 text-green-600" />
                              </div>
                              <div>
                                <p className="text-sm text-gray-600">Check-in</p>
                                <p className="font-semibold text-gray-900">{booking.checkIn}</p>
                              </div>
                            </div>

                            <div className="flex items-start gap-3">
                              <div className="bg-green-100 p-2 rounded-lg">
                                <Calendar className="w-5 h-5 text-green-600" />
                              </div>
                              <div>
                                <p className="text-sm text-gray-600">Check-out</p>
                                <p className="font-semibold text-gray-900">{booking.checkOut}</p>
                              </div>
                            </div>

                            <div className="flex items-start gap-3">
                              <div className="bg-green-100 p-2 rounded-lg">
                                <Clock className="w-5 h-5 text-green-600" />
                              </div>
                              <div>
                                <p className="text-sm text-gray-600">Số đêm</p>
                                <p className="font-semibold text-gray-900">{booking.nights} đêm</p>
                              </div>
                            </div>

                            <div className="flex items-start gap-3">
                              <div className="bg-green-100 p-2 rounded-lg">
                                <DollarSign className="w-5 h-5 text-green-600" />
                              </div>
                              <div>
                                <p className="text-sm text-gray-600">Tổng tiền</p>
                                <p className="font-semibold text-green-600">
                                  {booking.totalPrice.toLocaleString('vi-VN')} VNĐ
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-100">
                          <p className="text-sm text-gray-600 flex-1">
                            Đặt ngày: {booking.bookingDate}
                          </p>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => window.location.href = `/customer/booking/${booking.id}`}
                            className="bg-green-500 text-white px-6 py-2 rounded-xl font-semibold hover:bg-green-600 transition-all flex items-center justify-center gap-2"
                          >
                            <Eye className="w-4 h-4" />
                            Chi Tiết
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <motion.div
              variants={fadeInUp}
              className="bg-white rounded-2xl shadow-lg p-12 text-center"
            >
              <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Không tìm thấy kết quả</h3>
              <p className="text-gray-600">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}