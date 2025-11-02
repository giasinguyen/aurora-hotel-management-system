import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { User, Mail, Phone, MapPin, Calendar, Edit, Camera } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Mock user data
const userData = {
  name: "Nguyễn Văn An",
  email: "nguyenvanan@example.com",
  phone: "+84 123 456 789",
  address: "123 Đường Lê Lợi, Quận 1, TP.HCM",
  joinDate: "15/03/2023",
  avatar: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&h=400&fit=crop"
};

export default function CustomerProfilePage() {
  const [activeTab, setActiveTab] = useState("personal");
  const profileRef = useRef(null);
  const profileInView = useInView(profileRef, { once: true, margin: "-50px" });
  const navigate = useNavigate();

  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
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
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <div className="bg-gradient-to-br from-green-500 via-green-600 to-emerald-600 text-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-3">Hồ Sơ Của Tôi</h1>
            <p className="text-green-50 text-lg">Quản lý thông tin cá nhân của bạn</p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div ref={profileRef} className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 pb-16">
        <motion.div
          initial="hidden"
          animate={profileInView ? "visible" : "hidden"}
          variants={scaleIn}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Avatar Section */}
          <div className="relative bg-gradient-to-r from-green-50 to-emerald-50 p-8 border-b border-green-100">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <motion.div 
                className="relative group"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-green-500 ring-offset-4">
                  <img
                    src={userData.avatar}
                    alt={userData.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="absolute bottom-0 right-0 bg-green-500 text-white p-3 rounded-full shadow-lg hover:bg-green-600 transition-colors"
                >
                  <Camera className="w-5 h-5" />
                </motion.button>
              </motion.div>

              <div className="text-center md:text-left flex-1">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">{userData.name}</h2>
                <p className="text-gray-600 flex items-center justify-center md:justify-start gap-2">
                  <Calendar className="w-4 h-4" />
                  Thành viên từ {userData.joinDate}
                </p>
              </div>

              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(34, 197, 94, 0.3)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.location.href = '/customer/profile/upsert'}
                className="bg-green-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-600 transition-all flex items-center gap-2 shadow-lg"
              >
                <Edit className="w-5 h-5" />
                Chỉnh Sửa Hồ Sơ
              </motion.button>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <div className="flex gap-1 p-2 max-w-2xl mx-auto">
              {[
                { id: "personal", label: "Thông Tin Cá Nhân" },
                { id: "bookings", label: "Lịch Sử Đặt Phòng" },
                { id: "preferences", label: "Tùy Chọn" }
              ].map((tab) => (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                    activeTab === tab.id
                      ? "bg-green-500 text-white shadow-md"
                      : "text-gray-600 hover:bg-green-50"
                  }`}
                >
                  {tab.label}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Content */}
          <motion.div
            key={activeTab}
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="p-8"
          >
            {activeTab === "personal" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { icon: User, label: "Họ và Tên", value: userData.name },
                  { icon: Mail, label: "Email", value: userData.email },
                  { icon: Phone, label: "Số Điện Thoại", value: userData.phone },
                  { icon: MapPin, label: "Địa Chỉ", value: userData.address }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    variants={fadeInUp}
                    whileHover={{ y: -5, boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}
                    className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border border-green-100 transition-all"
                  >
                    <div className="flex items-start gap-4">
                      <div className="bg-green-500 text-white p-3 rounded-lg">
                        <item.icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-600 mb-1">{item.label}</p>
                        <p className="text-lg font-semibold text-gray-900">{item.value}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {activeTab === "bookings" && (
              <motion.div variants={fadeInUp} className="text-center py-12">
                <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-10 h-10 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Chưa có đặt phòng</h3>
                <p className="text-gray-600 mb-6">Bạn chưa có lịch sử đặt phòng nào</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate("/customer/booking/CreateBooking")}
                  className="bg-green-500 text-white px-8 py-3 rounded-xl font-semibold hover:bg-green-600 transition-all"
                >
                  Đặt Phòng Ngay
                </motion.button>
              </motion.div>
            )}

            {activeTab === "preferences" && (
              <motion.div variants={fadeInUp} className="space-y-4">
                {[
                  { label: "Nhận thông báo qua Email", checked: true },
                  { label: "Nhận khuyến mãi đặc biệt", checked: true },
                  { label: "Hiển thị hồ sơ công khai", checked: false }
                ].map((pref, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ x: 5 }}
                    className="flex items-center justify-between p-4 bg-green-50 rounded-xl border border-green-100"
                  >
                    <span className="font-medium text-gray-900">{pref.label}</span>
                    <motion.label 
                      className="relative inline-block w-14 h-8 cursor-pointer"
                      whileTap={{ scale: 0.95 }}
                    >
                      <input type="checkbox" className="sr-only peer" defaultChecked={pref.checked} />
                      <div className="w-14 h-8 bg-gray-300 rounded-full peer peer-checked:bg-green-500 transition-all"></div>
                      <div className="absolute left-1 top-1 w-6 h-6 bg-white rounded-full transition-all peer-checked:translate-x-6"></div>
                    </motion.label>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}