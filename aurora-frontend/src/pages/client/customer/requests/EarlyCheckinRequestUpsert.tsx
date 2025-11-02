import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sunrise, User, Phone, Mail, Calendar, Clock, Home, FileText, Save, X, ArrowLeft } from "lucide-react";

export default function EarlyCheckinRequestUpsertPage() {
  const [formData, setFormData] = useState({
    bookingCode: "",
    guestName: "",
    roomNumber: "",
    roomType: "",
    checkInDate: "",
    originalCheckin: "14:00",
    requestedCheckin: "",
    reason: "",
    phone: "",
    email: ""
  });

  const [errors, setErrors] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // Room types
  const roomTypes = [
    "Phòng Tiêu Chuẩn",
    "Phòng Deluxe",
    "Phòng Suite",
    "Phòng Tổng Thống"
  ];

  // Check if editing (mock - in real app, get from URL params)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    
    if (id) {
      setIsEditMode(true);
      // Mock data for editing
      setFormData({
        bookingCode: "ECH7X9K2L",
        guestName: "Hoàng Minh Tuấn",
        roomNumber: "402",
        roomType: "Phòng Deluxe",
        checkInDate: "2025-10-26",
        originalCheckin: "14:00",
        requestedCheckin: "10:00",
        reason: "Chuyến bay đến sớm, muốn nghỉ ngơi ngay",
        phone: "0918765432",
        email: "hoangtuan@email.com"
      });
    }
  }, []);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev: any) => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validate = () => {
    const newErrors: any = {};

    if (!formData.bookingCode.trim()) {
      newErrors.bookingCode = "Vui lòng nhập mã booking";
    }
    if (!formData.guestName.trim()) {
      newErrors.guestName = "Vui lòng nhập tên khách";
    }
    if (!formData.roomNumber.trim()) {
      newErrors.roomNumber = "Vui lòng nhập số phòng";
    }
    if (!formData.roomType) {
      newErrors.roomType = "Vui lòng chọn loại phòng";
    }
    if (!formData.checkInDate) {
      newErrors.checkInDate = "Vui lòng chọn ngày nhận phòng";
    }
    if (!formData.requestedCheckin) {
      newErrors.requestedCheckin = "Vui lòng chọn giờ nhận phòng mong muốn";
    }
    if (!formData.reason.trim()) {
      newErrors.reason = "Vui lòng nhập lý do";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Vui lòng nhập số điện thoại";
    } else if (!/^0\d{9}$/.test(formData.phone)) {
      newErrors.phone = "Số điện thoại không hợp lệ (10 số, bắt đầu bằng 0)";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Vui lòng nhập email";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    alert(isEditMode 
      ? "Cập nhật yêu cầu thành công!" 
      : "Tạo yêu cầu thành công!"
    );
    
    setIsSubmitting(false);
    
    // Reset form if creating new
    if (!isEditMode) {
      setFormData({
        bookingCode: "",
        guestName: "",
        roomNumber: "",
        roomType: "",
        checkInDate: "",
        originalCheckin: "14:00",
        requestedCheckin: "",
        reason: "",
        phone: "",
        email: ""
      });
    }
  };

  const handleCancel = () => {
    if (confirm("Bạn có chắc muốn hủy? Dữ liệu chưa lưu sẽ bị mất.")) {
      window.history.back();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-white">
      {/* Header */}
      <section className="bg-gradient-to-r from-purple-600 to-pink-500 text-white py-12">
        <div className="max-w-4xl mx-auto px-4">
          <motion.button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
            whileHover={{ x: -5 }}
          >
            <ArrowLeft className="w-5 h-5" />
            Quay lại
          </motion.button>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4"
          >
            <Sunrise className="w-12 h-12" />
            <div>
              <h1 className="text-4xl font-bold mb-2">
                {isEditMode ? "Chỉnh Sửa Yêu Cầu" : "Tạo Yêu Cầu Nhận Phòng Sớm"}
              </h1>
              <p className="text-white/90">
                {isEditMode ? "Cập nhật thông tin yêu cầu" : "Điền thông tin để tạo yêu cầu mới"}
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Form */}
      <section className="max-w-4xl mx-auto px-4 py-12">
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-2xl p-8"
        >
          {/* Booking & Guest Info */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <User className="w-6 h-6 text-purple-600" />
              Thông tin khách hàng
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Mã Booking <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="bookingCode"
                  value={formData.bookingCode}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${
                    errors.bookingCode ? 'border-red-500' : 'border-gray-200 focus:border-purple-500'
                  }`}
                  placeholder="VD: ABH7X9K2L"
                />
                {errors.bookingCode && (
                  <p className="text-red-500 text-sm mt-1">{errors.bookingCode}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tên Khách <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="guestName"
                  value={formData.guestName}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${
                    errors.guestName ? 'border-red-500' : 'border-gray-200 focus:border-purple-500'
                  }`}
                  placeholder="Nguyễn Văn A"
                />
                {errors.guestName && (
                  <p className="text-red-500 text-sm mt-1">{errors.guestName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Số Điện Thoại <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${
                      errors.phone ? 'border-red-500' : 'border-gray-200 focus:border-purple-500'
                    }`}
                    placeholder="0912345678"
                  />
                </div>
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${
                      errors.email ? 'border-red-500' : 'border-gray-200 focus:border-purple-500'
                    }`}
                    placeholder="example@email.com"
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>
            </div>
          </div>

          {/* Room Info */}
          <div className="mb-8 pt-8 border-t">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Home className="w-6 h-6 text-purple-600" />
              Thông tin phòng
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Số Phòng <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="roomNumber"
                  value={formData.roomNumber}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${
                    errors.roomNumber ? 'border-red-500' : 'border-gray-200 focus:border-purple-500'
                  }`}
                  placeholder="305"
                />
                {errors.roomNumber && (
                  <p className="text-red-500 text-sm mt-1">{errors.roomNumber}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Loại Phòng <span className="text-red-500">*</span>
                </label>
                <select
                  name="roomType"
                  value={formData.roomType}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors appearance-none bg-white ${
                    errors.roomType ? 'border-red-500' : 'border-gray-200 focus:border-purple-500'
                  }`}
                >
                  <option value="">Chọn loại phòng</option>
                  {roomTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                {errors.roomType && (
                  <p className="text-red-500 text-sm mt-1">{errors.roomType}</p>
                )}
              </div>
            </div>
          </div>

          {/* Check-in Info */}
          <div className="mb-8 pt-8 border-t">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Clock className="w-6 h-6 text-purple-600" />
              Thông tin nhận phòng
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Ngày Nhận Phòng <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="date"
                    name="checkInDate"
                    value={formData.checkInDate}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${
                      errors.checkInDate ? 'border-red-500' : 'border-gray-200 focus:border-purple-500'
                    }`}
                  />
                </div>
                {errors.checkInDate && (
                  <p className="text-red-500 text-sm mt-1">{errors.checkInDate}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Giờ Nhận Phòng Gốc
                </label>
                <input
                  type="time"
                  name="originalCheckin"
                  value={formData.originalCheckin}
                  onChange={handleChange}
                  disabled
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-100 text-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Giờ Mong Muốn <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  name="requestedCheckin"
                  value={formData.requestedCheckin}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${
                    errors.requestedCheckin ? 'border-red-500' : 'border-gray-200 focus:border-purple-500'
                  }`}
                />
                {errors.requestedCheckin && (
                  <p className="text-red-500 text-sm mt-1">{errors.requestedCheckin}</p>
                )}
              </div>
            </div>
          </div>

          {/* Reason */}
          <div className="mb-8 pt-8 border-t">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <FileText className="w-6 h-6 text-purple-600" />
              Lý do yêu cầu
            </h2>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Lý Do <span className="text-red-500">*</span>
              </label>
              <textarea
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                rows={4}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors resize-none ${
                  errors.reason ? 'border-red-500' : 'border-gray-200 focus:border-purple-500'
                }`}
                placeholder="Vui lòng mô tả lý do bạn muốn nhận phòng sớm..."
              />
              {errors.reason && (
                <p className="text-red-500 text-sm mt-1">{errors.reason}</p>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-6">
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold text-lg hover:from-purple-700 hover:to-pink-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  {isEditMode ? "Cập Nhật" : "Tạo Yêu Cầu"}
                </>
              )}
            </motion.button>
            
            <motion.button
              type="button"
              onClick={handleCancel}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-4 bg-gray-200 text-gray-700 rounded-xl font-bold text-lg hover:bg-gray-300 transition-all flex items-center justify-center gap-2"
            >
              <X className="w-5 h-5" />
              Hủy
            </motion.button>
          </div>
        </motion.form>
      </section>
    </div>
  );
}