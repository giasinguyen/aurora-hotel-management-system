import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { User, Mail, Phone, MapPin, Calendar, Edit, Camera, Loader2 } from "lucide-react";
import { useMyProfile } from "@/hooks/useMyProfile";


export default function CustomerProfilePage() {
  const [activeTab, setActiveTab] = useState("personal");
  const profileRef = useRef(null);
  const profileInView = useInView(profileRef, { once: true, margin: "-50px" });
  
  const { user, loading, uploadAvatar } = useMyProfile();

  // Animation variants - SIMPLIFIED
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };
  const handleAvatarUpload = async (file : File) => {
    if (!file) return;
    
    if (file.size > 5 * 1024 * 1024) {
      alert('Kích thước ảnh không được vượt quá 5MB');
      return;
    }

    if (!file.type.startsWith('image/')) {
      alert('Vui lòng chọn file ảnh');
      return;
    }

    await uploadAvatar(file);
  };

  const formatJoinDate = (dateString?: string | null): string => {
    if (!dateString) return 'Chưa cập nhật';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-green-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Đang tải thông tin...</p>
        </div>
      </div>
    );
  }
  if (!user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Không thể tải thông tin người dùng</p>
          <button
            onClick={() => window.location.href = '/login'}
            className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600"
          >
            Đăng nhập
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <div className="bg-gradient-to-br from-green-500 via-green-600 to-emerald-600 text-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
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
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
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
                    src={user.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(`${user.firstName} ${user.lastName}`)}&background=22c55e&color=fff`}
                    alt={`${user.firstName} ${user.lastName}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <motion.label
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="absolute bottom-0 right-0 bg-green-500 text-white p-3 rounded-full shadow-lg hover:bg-green-600 transition-colors cursor-pointer"
                >
                  <Camera className="w-5 h-5" />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleAvatarUpload(file);
                    }}
                  />
                </motion.label>
              </motion.div>

              <div className="text-center md:text-left flex-1">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  {user.firstName && user.lastName 
                    ? `${user.firstName} ${user.lastName}` 
                    : user.username}
                </h2>
                <p className="text-gray-600 flex items-center justify-center md:justify-start gap-2">
                  <Calendar className="w-4 h-4" />
                  Thành viên từ {formatJoinDate(user.createdAt)}
                </p>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.location.href = '/profile/upsert'}
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
                  { 
                    icon: User, 
                    label: "Họ và Tên", 
                    value: user.firstName && user.lastName 
                      ? `${user.firstName} ${user.lastName}` 
                      : 'Chưa cập nhật' 
                  },
                  { 
                    icon: Mail, 
                    label: "Email", 
                    value: user.email || 'Chưa cập nhật' 
                  },
                  { 
                    icon: Phone, 
                    label: "Số Điện Thoại", 
                    value: user.phone || 'Chưa cập nhật' 
                  },
                  { 
                    icon: MapPin, 
                    label: "Địa Chỉ", 
                    value: user.address || 'Chưa cập nhật' 
                  }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    variants={fadeInUp}
                    whileHover={{ y: -5 }}
                    className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border border-green-100 transition-all shadow-sm hover:shadow-md"
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
                  onClick={() => window.location.href = "/booking/create"}
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