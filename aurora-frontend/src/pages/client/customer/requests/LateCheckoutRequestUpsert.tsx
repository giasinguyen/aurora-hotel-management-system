import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock, User, Phone, Mail, Calendar, Home, FileText, Save, X, ArrowLeft } from "lucide-react";

export default function LateCheckoutRequestUpsertPage() {
  const [formData, setFormData] = useState({
    bookingCode: "",
    guestName: "",
    roomNumber: "",
    roomType: "",
    checkOutDate: "",
    originalCheckout: "12:00",
    requestedCheckout: "",
    reason: "",
    phone: "",
    email: ""
  });

  const [errors, setErrors] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const roomTypes = [
    "Phòng Tiêu Chuẩn",
    "Phòng Deluxe",
    "Phòng Suite",
    "Phòng Tổng Thống"
  ];

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    
    if (id) {
      setIsEditMode(true);
      setFormData({
        bookingCode: "ABH7X9K2L",
        guestName: "Nguyễn Văn A",
        roomNumber: "305",
        roomType: "Phòng Deluxe",
        checkOutDate: "2025-10-28",
        originalCheckout: "12:00",
        requestedCheckout: "15:00",
        reason: "Chuyến bay muộn, cần thêm thời gian chuẩn bị",
        phone: "0912345678",
        email: "nguyenvana@email.com"
      });
    }
  }, []);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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
    if (!formData.checkOutDate) {
      newErrors.checkOutDate = "Vui lòng chọn ngày trả phòng";
    }
    if (!formData.requestedCheckout) {
      newErrors.requestedCheckout = "Vui lòng chọn giờ trả phòng mong muốn";
    } else if (formData.requestedCheckout <= formData.originalCheckout) {
      newErrors.requestedCheckout = "Giờ mong muốn phải sau giờ trả phòng gốc";
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
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    alert(isEditMode 
      ? "Cập nhật yêu cầu thành công!" 
      : "Tạo yêu cầu thành công!"
    );
    
    setIsSubmitting(false);
    
    if (!isEditMode) {
      setFormData({
        bookingCode: "",
        guestName: "",
        roomNumber: "",
        roomType: "",
        checkOutDate: "",
        originalCheckout: "12:00",
        requestedCheckout: "",
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-white">
      {/* Header */}
      <section className="bg-gradient-to-r from-green-600 to-emerald-500 text-white py-12">
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
            <Clock className="w-12 h-12" />
            <div>
              <h1 className="text-4xl font-bold mb-2">
                {isEditMode ? "Chỉnh Sửa Yêu Cầu" : "Tạo Yêu Cầu Trả Phòng Muộn"}
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
              <User className="w-6 h-6 text-green-600" />
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
                    errors.bookingCode ? 'border-red-500' : 'border-gray-200 focus:border-green-500'
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
                    errors.guestName ? 'border-red-500' : 'border-gray-200 focus:border-green-500'
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
                      errors.phone ? 'border-red-500' : 'border-gray-200 focus:border-green-500'
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
                      errors.email ? 'border-red-500' : 'border-gray-200 focus:border-green-500'
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
              <Home className="w-6 h-6 text-green-600" />
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
                    errors.roomNumber ? 'border-red-500' : 'border-gray-200 focus:border-green-500'
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
                    errors.roomType ? 'border-red-500' : 'border-gray-200 focus:border-green-500'
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

          {/* Checkout Info */}
          <div className="mb-8 pt-8 border-t">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Clock className="w-6 h-6 text-green-600" />
              Thông tin trả phòng
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Ngày Trả Phòng <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="date"
                    name="checkOutDate"
                    value={formData.checkOutDate}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${
                      errors.checkOutDate ? 'border-red-500' : 'border-gray-200 focus:border-green-500'
                    }`}
                  />
                </div>
                {errors.checkOutDate && (
                  <p className="text-red-500 text-sm mt-1">{errors.checkOutDate}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Giờ Trả Phòng Gốc
                </label>
                <input
                  type="time"
                  name="originalCheckout"
                  value={formData.originalCheckout}
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
                  name="requestedCheckout"
                  value={formData.requestedCheckout}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${
                    errors.requestedCheckout ? 'border-red-500' : 'border-gray-200 focus:border-green-500'
                  }`}
                />
                {errors.requestedCheckout && (
                  <p className="text-red-500 text-sm mt-1">{errors.requestedCheckout}</p>
                )}
              </div>
            </div>

            {/* Time difference indicator */}
            {formData.requestedCheckout && formData.originalCheckout && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 bg-green-50 rounded-xl border border-green-200"
              >
                <p className="text-sm text-green-800">
                  <strong>Thời gian gia hạn:</strong> {formData.originalCheckout} → {formData.requestedCheckout}
                  {formData.requestedCheckout > formData.originalCheckout && (
                    <span className="ml-2 text-green-600 font-semibold">
                      {(() => {
                        const start = new Date(`1970-01-01T${formData.originalCheckout}`).getTime();
                        const end = new Date(`1970-01-01T${formData.requestedCheckout}`).getTime();
                        const hours = Math.floor((end - start) / (1000 * 60 * 60));
                        return `(+${hours} giờ)`;
                      })()}
                    </span>
                  )}
                </p>
              </motion.div>
            )}
          </div>

          {/* Reason */}
          <div className="mb-8 pt-8 border-t">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <FileText className="w-6 h-6 text-green-600" />
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
                  errors.reason ? 'border-red-500' : 'border-gray-200 focus:border-green-500'
                }`}
                placeholder="Vui lòng mô tả lý do bạn muốn trả phòng muộn..."
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
              className="flex-1 px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-bold text-lg hover:from-green-700 hover:to-emerald-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
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