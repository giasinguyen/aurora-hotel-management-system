import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, User, Phone, Mail, Home, FileText, Save, X, ArrowLeft, Camera } from "lucide-react";

export default function IssueReportUpsertPage() {
  const [formData, setFormData] = useState({
    reportCode: "",
    guestName: "",
    roomNumber: "",
    issueType: "",
    issueTitle: "",
    issueDescription: "",
    priority: "medium",
    phone: "",
    email: "",
    images: [] as string[]
  });

  const [errors, setErrors] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const issueTypes = [
    "Điện nước",
    "Vệ sinh",
    "Tiện nghi",
    "An ninh",
    "Dịch vụ",
    "Khác"
  ];

  const priorities = [
    { value: "low", label: "Thấp", color: "bg-green-500" },
    { value: "medium", label: "Trung bình", color: "bg-yellow-500" },
    { value: "high", label: "Cao", color: "bg-orange-500" },
    { value: "urgent", label: "Khẩn cấp", color: "bg-red-500" }
  ];

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    
    if (id) {
      setIsEditMode(true);
      setFormData({
        reportCode: "ISS001",
        guestName: "Trần Văn Minh",
        roomNumber: "305",
        issueType: "Điện nước",
        issueTitle: "Máy lạnh không hoạt động",
        issueDescription: "Máy lạnh trong phòng không lạnh, có tiếng kêu lạ khi hoạt động",
        priority: "high",
        phone: "0912345678",
        email: "tranvanminh@email.com",
        images: []
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

    if (!isEditMode && !formData.reportCode.trim()) {
      newErrors.reportCode = "Vui lòng nhập mã báo cáo";
    }
    if (!formData.guestName.trim()) {
      newErrors.guestName = "Vui lòng nhập tên khách";
    }
    if (!formData.roomNumber.trim()) {
      newErrors.roomNumber = "Vui lòng nhập số phòng";
    }
    if (!formData.issueType) {
      newErrors.issueType = "Vui lòng chọn loại sự cố";
    }
    if (!formData.issueTitle.trim()) {
      newErrors.issueTitle = "Vui lòng nhập tiêu đề sự cố";
    }
    if (!formData.issueDescription.trim()) {
      newErrors.issueDescription = "Vui lòng mô tả chi tiết sự cố";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Vui lòng nhập số điện thoại";
    } else if (!/^0\d{9}$/.test(formData.phone)) {
      newErrors.phone = "Số điện thoại không hợp lệ";
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
      ? "Cập nhật báo cáo thành công!" 
      : "Tạo báo cáo thành công!"
    );
    
    setIsSubmitting(false);
    
    if (!isEditMode) {
      setFormData({
        reportCode: "",
        guestName: "",
        roomNumber: "",
        issueType: "",
        issueTitle: "",
        issueDescription: "",
        priority: "medium",
        phone: "",
        email: "",
        images: []
      });
    }
  };

  const handleCancel = () => {
    if (confirm("Bạn có chắc muốn hủy? Dữ liệu chưa lưu sẽ bị mất.")) {
      window.history.back();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-white">
      {/* Header */}
      <section className="bg-gradient-to-r from-red-600 to-orange-500 text-white py-12">
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
            <AlertTriangle className="w-12 h-12" />
            <div>
              <h1 className="text-4xl font-bold mb-2">
                {isEditMode ? "Chỉnh Sửa Báo Cáo" : "Tạo Báo Cáo Sự Cố"}
              </h1>
              <p className="text-white/90">
                {isEditMode ? "Cập nhật thông tin sự cố" : "Điền thông tin để báo cáo sự cố mới"}
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
          {/* Guest Info */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <User className="w-6 h-6 text-orange-600" />
              Thông tin người báo cáo
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {!isEditMode && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Mã Báo Cáo <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="reportCode"
                    value={formData.reportCode}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${
                      errors.reportCode ? 'border-red-500' : 'border-gray-200 focus:border-orange-500'
                    }`}
                    placeholder="VD: ISS001"
                  />
                  {errors.reportCode && (
                    <p className="text-red-500 text-sm mt-1">{errors.reportCode}</p>
                  )}
                </div>
              )}

              <div className={!isEditMode ? "" : "md:col-span-2"}>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tên Khách <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="guestName"
                  value={formData.guestName}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${
                    errors.guestName ? 'border-red-500' : 'border-gray-200 focus:border-orange-500'
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
                      errors.phone ? 'border-red-500' : 'border-gray-200 focus:border-orange-500'
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
                      errors.email ? 'border-red-500' : 'border-gray-200 focus:border-orange-500'
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

          {/* Room & Issue Type */}
          <div className="mb-8 pt-8 border-t">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Home className="w-6 h-6 text-orange-600" />
              Thông tin phòng & sự cố
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
                    errors.roomNumber ? 'border-red-500' : 'border-gray-200 focus:border-orange-500'
                  }`}
                  placeholder="305"
                />
                {errors.roomNumber && (
                  <p className="text-red-500 text-sm mt-1">{errors.roomNumber}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Loại Sự Cố <span className="text-red-500">*</span>
                </label>
                <select
                  name="issueType"
                  value={formData.issueType}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors appearance-none bg-white ${
                    errors.issueType ? 'border-red-500' : 'border-gray-200 focus:border-orange-500'
                  }`}
                >
                  <option value="">Chọn loại sự cố</option>
                  {issueTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                {errors.issueType && (
                  <p className="text-red-500 text-sm mt-1">{errors.issueType}</p>
                )}
              </div>
            </div>
          </div>

          {/* Issue Details */}
          <div className="mb-8 pt-8 border-t">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <FileText className="w-6 h-6 text-orange-600" />
              Chi tiết sự cố
            </h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tiêu Đề Sự Cố <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="issueTitle"
                  value={formData.issueTitle}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${
                    errors.issueTitle ? 'border-red-500' : 'border-gray-200 focus:border-orange-500'
                  }`}
                  placeholder="VD: Máy lạnh không hoạt động"
                />
                {errors.issueTitle && (
                  <p className="text-red-500 text-sm mt-1">{errors.issueTitle}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Mức Độ Ưu Tiên <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {priorities.map(priority => (
                    <motion.button
                      key={priority.value}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, priority: priority.value }))}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`px-4 py-3 rounded-xl font-semibold transition-all ${
                        formData.priority === priority.value
                          ? `${priority.color} text-white shadow-lg`
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {priority.label}
                    </motion.button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Mô Tả Chi Tiết <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="issueDescription"
                  value={formData.issueDescription}
                  onChange={handleChange}
                  rows={6}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors resize-none ${
                    errors.issueDescription ? 'border-red-500' : 'border-gray-200 focus:border-orange-500'
                  }`}
                  placeholder="Vui lòng mô tả chi tiết sự cố đang gặp phải..."
                />
                {errors.issueDescription && (
                  <p className="text-red-500 text-sm mt-1">{errors.issueDescription}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Hình Ảnh (Tùy chọn)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-orange-500 transition-colors cursor-pointer">
                  <Camera className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 mb-2">Nhấp để tải lên hình ảnh</p>
                  <p className="text-sm text-gray-400">PNG, JPG (tối đa 5MB)</p>
                </div>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-6">
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 px-8 py-4 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-xl font-bold text-lg hover:from-red-700 hover:to-orange-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  {isEditMode ? "Cập Nhật" : "Tạo Báo Cáo"}
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