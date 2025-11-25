import { motion, useInView } from "framer-motion";
import { useRef, useState, type ChangeEvent } from "react";
import { User, Mail, Phone, MapPin, Calendar, Save, X, Camera, ArrowLeft } from "lucide-react";

export default function ProfileUpsertPage() {
  const formRef = useRef(null);
  const formInView = useInView(formRef, { once: true, margin: "-50px" });

  const [formData, setFormData] = useState({
    name: "Nguyễn Văn An",
    email: "nguyenvanan@example.com",
    phone: "+84 123 456 789",
    address: "123 Đường Lê Lợi, Quận 1, TP.HCM",
    birthDate: "1990-05-15",
    gender: "male"
  });

  const [avatar, setAvatar] = useState("https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&h=400&fit=crop");

   const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = () => {
    console.log("Form submitted:", formData);
    alert("Cập nhật hồ sơ thành công!");
  };

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
        delayChildren: 0.15
      }
    }
  };

  const inputVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      {/* Header Section */}
      <div className="bg-gradient-to-br from-green-500 via-green-600 to-emerald-600 text-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
              Quay lại
            </motion.button>
            <h1 className="text-4xl md:text-5xl font-bold mb-3">Chỉnh Sửa Hồ Sơ</h1>
            <p className="text-green-50 text-lg">Cập nhật thông tin cá nhân của bạn</p>
          </motion.div>
        </div>
      </div>

      {/* Form Section */}
      <div ref={formRef} className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 pb-16">
        <motion.div
          initial="hidden"
          animate={formInView ? "visible" : "hidden"}
          variants={fadeInUp}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Avatar Upload Section */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-8 border-b border-green-100">
            <motion.div 
              className="flex flex-col items-center"
              variants={fadeInUp}
            >
              <div className="relative group">
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-green-500 ring-offset-4"
                >
                  <img
                    src={avatar}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                </motion.div>
                <motion.label
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="absolute bottom-0 right-0 bg-green-500 text-white p-3 rounded-full shadow-lg hover:bg-green-600 transition-all cursor-pointer"
                >
                  <Camera className="w-5 h-5" />
                   <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*"
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          if (typeof reader.result === "string") {
                            setAvatar(reader.result);
                          }
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </motion.label>
              </div>
              <p className="text-sm text-gray-600 mt-4">Nhấp vào biểu tượng máy ảnh để thay đổi ảnh đại diện</p>
            </motion.div>
          </div>

          {/* Form Fields */}
          <motion.div
            initial="hidden"
            animate={formInView ? "visible" : "hidden"}
            variants={staggerContainer}
            className="p-8 space-y-6"
          >
            {/* Name */}
            <motion.div variants={inputVariants}>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <User className="w-4 h-4 text-green-500" />
                Họ và Tên *
              </label>
              <motion.input
                whileFocus={{ scale: 1.01, boxShadow: "0 0 0 3px rgba(34, 197, 94, 0.1)" }}
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-green-500 transition-all"
                placeholder="Nhập họ và tên"
              />
            </motion.div>

            {/* Email */}
            <motion.div variants={inputVariants}>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <Mail className="w-4 h-4 text-green-500" />
                Email *
              </label>
              <motion.input
                whileFocus={{ scale: 1.01, boxShadow: "0 0 0 3px rgba(34, 197, 94, 0.1)" }}
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-green-500 transition-all"
                placeholder="Nhập email"
              />
            </motion.div>

            {/* Phone */}
            <motion.div variants={inputVariants}>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <Phone className="w-4 h-4 text-green-500" />
                Số Điện Thoại *
              </label>
              <motion.input
                whileFocus={{ scale: 1.01, boxShadow: "0 0 0 3px rgba(34, 197, 94, 0.1)" }}
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-green-500 transition-all"
                placeholder="Nhập số điện thoại"
              />
            </motion.div>

            {/* Address */}
            <motion.div variants={inputVariants}>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <MapPin className="w-4 h-4 text-green-500" />
                Địa Chỉ
              </label>
              <motion.textarea
                whileFocus={{ scale: 1.01, boxShadow: "0 0 0 3px rgba(34, 197, 94, 0.1)" }}
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-green-500 transition-all resize-none"
                placeholder="Nhập địa chỉ"
              />
            </motion.div>

            {/* Birth Date and Gender Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div variants={inputVariants}>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 text-green-500" />
                  Ngày Sinh
                </label>
                <motion.input
                  whileFocus={{ scale: 1.01, boxShadow: "0 0 0 3px rgba(34, 197, 94, 0.1)" }}
                  type="date"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-green-500 transition-all"
                />
              </motion.div>

              <motion.div variants={inputVariants}>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Giới Tính
                </label>
                <motion.select
                  whileFocus={{ scale: 1.01, boxShadow: "0 0 0 3px rgba(34, 197, 94, 0.1)" }}
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-green-500 transition-all bg-white"
                >
                  <option value="male">Nam</option>
                  <option value="female">Nữ</option>
                  <option value="other">Khác</option>
                </motion.select>
              </motion.div>
            </div>

            {/* Action Buttons */}
            <motion.div 
              variants={inputVariants}
              className="flex flex-col sm:flex-row gap-4 pt-6"
            >
              <motion.button
                type="button"
                onClick={handleSubmit}
                whileHover={{ scale: 1.02, boxShadow: "0 10px 30px rgba(34, 197, 94, 0.3)" }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 bg-green-500 text-white px-8 py-4 rounded-xl font-semibold hover:bg-green-600 transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                <Save className="w-5 h-5" />
                Lưu Thay Đổi
              </motion.button>
              
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => window.history.back()}
                className="flex-1 sm:flex-none bg-gray-100 text-gray-700 px-8 py-4 rounded-xl font-semibold hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
              >
                <X className="w-5 h-5" />
                Hủy
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-6 bg-green-50 border border-green-200 rounded-xl p-6"
        >
          <div className="flex gap-3">
            <div className="bg-green-500 text-white p-2 rounded-lg h-fit">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Lưu ý quan trọng</h3>
              <p className="text-sm text-gray-600">
                Thông tin của bạn sẽ được bảo mật và chỉ sử dụng cho mục đích cải thiện trải nghiệm dịch vụ.
                Các trường có dấu (*) là bắt buộc.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}