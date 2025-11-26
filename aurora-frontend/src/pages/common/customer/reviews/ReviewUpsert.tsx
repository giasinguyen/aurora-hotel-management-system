import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Star, User, FileText, Save, X, ArrowLeft, Sparkles } from "lucide-react";

export default function ReviewUpsertPage() {
  const [formData, setFormData] = useState({
    guestName: "",
    roomNumber: "",
    roomType: "",
    rating: 0,
    title: "",
    comment: ""
  });

  const [errors, setErrors] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [hoveredRating, setHoveredRating] = useState(0);

  const roomTypes = [
    "Phòng Tiêu Chuẩn",
    "Phòng Deluxe",
    "Phòng Suite",
    "Phòng Tổng Thống"
  ];

  const ratingLabels = [
    { value: 1, label: "Rất tệ", emoji: "😞", color: "text-red-500" },
    { value: 2, label: "Tệ", emoji: "😕", color: "text-orange-500" },
    { value: 3, label: "Bình thường", emoji: "😐", color: "text-yellow-500" },
    { value: 4, label: "Tốt", emoji: "😊", color: "text-lime-500" },
    { value: 5, label: "Tuyệt vời", emoji: "🤩", color: "text-green-500" }
  ];

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    
    if (id) {
      setIsEditMode(true);
      setFormData({
        guestName: "Nguyễn Văn A",
        roomNumber: "305",
        roomType: "Phòng Deluxe",
        rating: 5,
        title: "Trải nghiệm tuyệt vời!",
        comment: "Khách sạn rất sạch sẽ, nhân viên thân thiện. Vị trí đẹp, view nhìn ra biển tuyệt vời. Tôi sẽ quay lại!"
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

  const handleRatingClick = (rating: number) => {
    setFormData(prev => ({ ...prev, rating }));
    if (errors.rating) {
      setErrors((prev: any) => ({ ...prev, rating: "" }));
    }
  };

  const validate = () => {
    const newErrors: any = {};

    if (!formData.guestName.trim()) {
      newErrors.guestName = "Vui lòng nhập tên của bạn";
    }
    if (!formData.roomNumber.trim()) {
      newErrors.roomNumber = "Vui lòng nhập số phòng";
    }
    if (!formData.roomType) {
      newErrors.roomType = "Vui lòng chọn loại phòng";
    }
    if (formData.rating === 0) {
      newErrors.rating = "Vui lòng chọn số sao đánh giá";
    }
    if (!formData.title.trim()) {
      newErrors.title = "Vui lòng nhập tiêu đề đánh giá";
    }
    if (!formData.comment.trim()) {
      newErrors.comment = "Vui lòng nhập nội dung đánh giá";
    } else if (formData.comment.trim().length < 20) {
      newErrors.comment = "Nội dung đánh giá phải có ít nhất 20 ký tự";
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
      ? "Cập nhật đánh giá thành công!" 
      : "Gửi đánh giá thành công! Cảm ơn bạn đã đánh giá."
    );
    
    setIsSubmitting(false);
    
    if (!isEditMode) {
      setFormData({
        guestName: "",
        roomNumber: "",
        roomType: "",
        rating: 0,
        title: "",
        comment: ""
      });
    }
  };

  const handleCancel = () => {
    if (confirm("Bạn có chắc muốn hủy? Dữ liệu chưa lưu sẽ bị mất.")) {
      window.history.back();
    }
  };

  const getCurrentRatingLabel = () => {
    const displayRating = hoveredRating || formData.rating;
    const label = ratingLabels.find(r => r.value === displayRating);
    return label || null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
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
            <Star className="w-12 h-12 fill-yellow-300 text-yellow-300" />
            <div>
              <h1 className="text-4xl font-bold mb-2">
                {isEditMode ? "Chỉnh Sửa Đánh Giá" : "Viết Đánh Giá"}
              </h1>
              <p className="text-white/90">
                {isEditMode ? "Cập nhật đánh giá của bạn" : "Chia sẻ trải nghiệm của bạn với chúng tôi"}
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
              <User className="w-6 h-6 text-blue-600" />
              Thông tin của bạn
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tên của bạn <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="guestName"
                  value={formData.guestName}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${
                    errors.guestName ? 'border-red-500' : 'border-gray-200 focus:border-blue-500'
                  }`}
                  placeholder="Nguyễn Văn A"
                />
                {errors.guestName && (
                  <p className="text-red-500 text-sm mt-1">{errors.guestName}</p>
                )}
              </div>

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
                    errors.roomNumber ? 'border-red-500' : 'border-gray-200 focus:border-blue-500'
                  }`}
                  placeholder="305"
                />
                {errors.roomNumber && (
                  <p className="text-red-500 text-sm mt-1">{errors.roomNumber}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Loại Phòng <span className="text-red-500">*</span>
                </label>
                <select
                  name="roomType"
                  value={formData.roomType}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors appearance-none bg-white ${
                    errors.roomType ? 'border-red-500' : 'border-gray-200 focus:border-blue-500'
                  }`}
                >
                  <option value="">Chọn loại phòng bạn đã ở</option>
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

          {/* Rating */}
          <div className="mb-8 pt-8 border-t">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-blue-600" />
              Đánh giá của bạn
            </h2>
            
            <div className="text-center mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-4">
                Bạn đánh giá mức độ hài lòng như thế nào? <span className="text-red-500">*</span>
              </label>
              
              <div className="flex justify-center gap-2 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <motion.button
                    key={star}
                    type="button"
                    onClick={() => handleRatingClick(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`w-12 h-12 transition-all ${
                        star <= (hoveredRating || formData.rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  </motion.button>
                ))}
              </div>

              {getCurrentRatingLabel() && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-center gap-2"
                >
                  <span className="text-4xl">{getCurrentRatingLabel()?.emoji}</span>
                  <span className={`text-xl font-bold ${getCurrentRatingLabel()?.color}`}>
                    {getCurrentRatingLabel()?.label}
                  </span>
                </motion.div>
              )}

              {errors.rating && (
                <p className="text-red-500 text-sm mt-2">{errors.rating}</p>
              )}
            </div>
          </div>

          {/* Review Content */}
          <div className="mb-8 pt-8 border-t">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <FileText className="w-6 h-6 text-blue-600" />
              Nội dung đánh giá
            </h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tiêu Đề <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${
                    errors.title ? 'border-red-500' : 'border-gray-200 focus:border-blue-500'
                  }`}
                  placeholder="VD: Trải nghiệm tuyệt vời tại khách sạn!"
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Chia Sẻ Trải Nghiệm <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="comment"
                  value={formData.comment}
                  onChange={handleChange}
                  rows={8}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors resize-none ${
                    errors.comment ? 'border-red-500' : 'border-gray-200 focus:border-blue-500'
                  }`}
                  placeholder="Hãy chia sẻ chi tiết về trải nghiệm của bạn: chất lượng phòng, dịch vụ, nhân viên, vị trí, tiện nghi..."
                />
                <div className="flex justify-between items-center mt-2">
                  <div>
                    {errors.comment && (
                      <p className="text-red-500 text-sm">{errors.comment}</p>
                    )}
                  </div>
                  <p className={`text-sm ${formData.comment.length < 20 ? 'text-gray-400' : 'text-green-600'}`}>
                    {formData.comment.length} / tối thiểu 20 ký tự
                  </p>
                </div>
              </div>

              {/* Tips */}
              <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Gợi ý viết đánh giá hay
                </h3>
                <ul className="space-y-2 text-sm text-blue-800">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">•</span>
                    <span>Mô tả chi tiết về chất lượng phòng, giường, vệ sinh</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">•</span>
                    <span>Chia sẻ về thái độ phục vụ của nhân viên</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">•</span>
                    <span>Đánh giá về vị trí, giao thông, tiện ích xung quanh</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">•</span>
                    <span>Nêu rõ điểm mạnh và điểm cần cải thiện (nếu có)</span>
                  </li>
                </ul>
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
              className="flex-1 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold text-lg hover:from-blue-700 hover:to-purple-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  {isEditMode ? "Cập Nhật Đánh Giá" : "Gửi Đánh Giá"}
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

        {/* Preview Card */}
        {formData.rating > 0 && formData.comment && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 bg-white rounded-3xl shadow-xl p-8 border-2 border-blue-100"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-600" />
              Xem trước đánh giá
            </h3>
            
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-gray-900 mb-1">
                  {formData.guestName || "Tên của bạn"}
                </h4>
                <div className="flex items-center gap-2 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${
                        star <= formData.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                {formData.title && (
                  <h5 className="font-bold text-gray-900 mb-2">{formData.title}</h5>
                )}
                {formData.comment && (
                  <p className="text-gray-700 leading-relaxed">{formData.comment}</p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </section>
    </div>
  );
}