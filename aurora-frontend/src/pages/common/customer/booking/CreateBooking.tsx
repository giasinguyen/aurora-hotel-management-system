import { useState, useRef, useEffect, type FormEvent } from "react";
import { motion, useInView } from "framer-motion";
import { Calendar, Users, CreditCard, Check, ArrowRight, Sparkles } from "lucide-react";

export default function CreateBooking() {
  // Khôi phục dữ liệu từ sessionStorage khi component mount
  const getInitialStep = (): number => {
    const saved = sessionStorage.getItem('bookingProgress');
    return saved ? JSON.parse(saved).step : 1;
  };

  const getInitialFormData = () => {
    const saved = sessionStorage.getItem('bookingProgress');
    return saved ? JSON.parse(saved).formData : {
      checkIn: "",
      checkOut: "",
      guests: 1,
      roomType: "",
      fullName: "",
      email: "",
      phone: "",
      specialRequests: "",
      paymentMethod: "credit-card"
    };
  };

  const [step, setStep] = useState<number>(getInitialStep());
  const [formData, setFormData] = useState(getInitialFormData());
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const formRef = useRef(null);
  const formInView = useInView(formRef, { once: true, margin: "-100px" });

  // Lưu trạng thái vào sessionStorage mỗi khi có thay đổi
  useEffect(() => {
    sessionStorage.setItem('bookingProgress', JSON.stringify({ step, formData }));
  }, [step, formData]);

  const roomTypes = [
    { id: "standard", name: "Phòng Tiêu Chuẩn", price: "1,200,000", image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=500" },
    { id: "deluxe", name: "Phòng Deluxe", price: "2,000,000", image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=500" },
    { id: "suite", name: "Phòng Suite", price: "3,500,000", image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=500" },
    { id: "president", name: "Phòng Tổng Thống", price: "5,000,000", image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=500" }
  ];

  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 }
    }
  };

  const handleSubmit = (e?: FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    
    // Validate current step
    const newErrors: {[key: string]: string} = {};
    
    if (step === 1) {
      if (!formData.checkIn) newErrors.checkIn = "Vui lòng chọn ngày nhận phòng";
      if (!formData.checkOut) newErrors.checkOut = "Vui lòng chọn ngày trả phòng";
      if (!formData.roomType) newErrors.roomType = "Vui lòng chọn loại phòng";
      
      // Validate check-out after check-in
      if (formData.checkIn && formData.checkOut) {
        const checkInDate = new Date(formData.checkIn);
        const checkOutDate = new Date(formData.checkOut);
        if (checkOutDate <= checkInDate) {
          newErrors.checkOut = "Ngày trả phòng phải sau ngày nhận phòng";
        }
      }
    }
    
    if (step === 2) {
      if (!formData.fullName.trim()) newErrors.fullName = "Vui lòng nhập họ tên";
      if (!formData.email.trim()) {
        newErrors.email = "Vui lòng nhập email";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = "Email không hợp lệ";
      }
      if (!formData.phone.trim()) {
        newErrors.phone = "Vui lòng nhập số điện thoại";
      } else if (!/^[0-9]{10,11}$/.test(formData.phone.replace(/\s/g, ''))) {
        newErrors.phone = "Số điện thoại phải có 10-11 chữ số";
      }
    }
    
    setErrors(newErrors);
    
    // If there are errors, don't proceed
    if (Object.keys(newErrors).length > 0) {
      return;
    }
    
    if (step < 3) {
      setStep((s) => s + 1);
    } else {
      // Save booking data - Lưu đầy đủ thông tin
      const bookingData = {
        ...formData,
        roomName: roomTypes.find(r => r.id === formData.roomType)?.name,
        roomPrice: roomTypes.find(r => r.id === formData.roomType)?.price,
        confirmationCode: "ABH" + Math.random().toString(36).substr(2, 9).toUpperCase(),
        bookingDate: new Date().toLocaleDateString('vi-VN'),
        // Thêm các trường cần thiết
        email: formData.email,
        phone: formData.phone,
        specialRequests: formData.specialRequests
      };
      sessionStorage.setItem('bookingData', JSON.stringify(bookingData));
      
      // GIỮ LẠI bookingProgress để có thể quay lại
      // sessionStorage.removeItem('bookingProgress'); // <-- KHÔNG XÓA NỮA
      
      // Route based on payment method
      if (formData.paymentMethod === 'credit-card' || formData.paymentMethod === 'bank-transfer') {
        window.location.href = '/payment';
      } else {
        // Chỉ xóa khi thanh toán tại khách sạn (không cần quay lại)
        sessionStorage.removeItem('bookingProgress');
        window.location.href = '/booking/confirm';
      }
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-96 bg-gradient-to-br from-green-600 via-green-500 to-emerald-400 overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <motion.div 
          className="relative z-10 h-full flex flex-col items-center justify-center text-white px-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <Sparkles className="w-16 h-16 mb-4" />
          </motion.div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4 text-center">Đặt Phòng Của Bạn</h1>
          <p className="text-xl md:text-2xl text-white/90 text-center max-w-2xl">
            Trải nghiệm nghỉ dưỡng đẳng cấp tại Aurora Beach Hotel
          </p>
        </motion.div>
        
        {/* Decorative waves */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" className="w-full h-24">
            <path fill="#ffffff" d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
          </svg>
        </div>
      </section>
{/* Progress Steps */}
      <div className="max-w-5xl mx-auto px-4 -mt-8 relative z-20">
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
          <div className="flex items-center justify-between relative">
            {[
              { number: 1, label: "Chọn phòng", icon: Calendar },
              { number: 2, label: "Thông tin", icon: Users },
              { number: 3, label: "Thanh toán", icon: CreditCard }
            ].map((item, index) => {
              const Icon = item.icon;
              const isCompleted = step > item.number;
              const isCurrent = step === item.number;
              const isClickable = item.number < step || item.number === step;
              
              return (
                <div key={item.number} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <motion.button
                      type="button"
                      onClick={() => {
                        if (isClickable) {
                          setStep(item.number);
                        }
                      }}
                      disabled={!isClickable}
                      className={`w-16 h-16 rounded-full flex items-center justify-center font-bold transition-all relative group ${
                        isCompleted 
                          ? "bg-green-500 text-white shadow-lg shadow-green-200" 
                          : isCurrent
                          ? "bg-green-500 text-white shadow-xl shadow-green-300"
                          : "bg-gray-200 text-gray-400"
                      } ${isClickable ? "cursor-pointer hover:scale-110" : "cursor-not-allowed"}`}
                      whileHover={isClickable ? { scale: 1.1 } : {}}
                      whileTap={isClickable ? { scale: 0.95 } : {}}
                      animate={{ 
                        scale: isCurrent ? 1.05 : 1,
                      }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      {isCompleted ? (
                        <Check className="w-7 h-7" />
                      ) : (
                        <Icon className="w-7 h-7" />
                      )}
                      
                      {isCurrent && (
                        <motion.div
                          className="absolute inset-0 rounded-full border-4 border-green-300"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      )}
                    </motion.button>
                    
                    <motion.span 
                      className={`mt-3 text-sm font-semibold transition-all ${
                        isCompleted || isCurrent ? "text-green-600" : "text-gray-400"
                      }`}
                      animate={{ 
                        scale: isCurrent ? 1.05 : 1,
                        fontWeight: isCurrent ? 700 : 600
                      }}
                    >
                      {item.label}
                    </motion.span>
                  </div>
                  
                  {index < 2 && (
                    <div className={`pb-8 ${index === 0 ? 'flex-1 px-4' : 'flex-[0.9] px-4'}`}>
                      <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                        <motion.div 
                          className="absolute inset-y-0 left-0 bg-gradient-to-r from-green-500 to-emerald-400 rounded-full"
                          initial={{ width: "0%" }}
                          animate={{ 
                            width: step > item.number ? "100%" : "0%"
                          }}
                          transition={{ duration: 0.5, ease: "easeInOut" }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Form Section */}
      <section ref={formRef} className="max-w-6xl mx-auto px-4 pb-20">
        <div>
          {/* Step 1: Room Selection */}
          {step === 1 && (
            <motion.div
              initial="hidden"
              animate={formInView ? "visible" : "hidden"}
              variants={staggerContainer}
            >
              <motion.div variants={fadeInUp} className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <Calendar className="w-8 h-8 text-green-500" />
                  Chọn Ngày & Loại Phòng
                </h2>
              </motion.div>

              <motion.div variants={fadeInUp} className="grid md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Ngày Nhận Phòng *
                  </label>
                  <input
                    type="date"
                    value={formData.checkIn}
                    onChange={(e) => {
                      setFormData({...formData, checkIn: e.target.value});
                      if (errors.checkIn) setErrors({...errors, checkIn: ""});
                    }}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all ${
                      errors.checkIn ? "border-red-500 focus:border-red-500" : "border-gray-200 focus:border-green-500"
                    }`}
                  />
                  {errors.checkIn && (
                    <p className="text-red-500 text-sm mt-1">{errors.checkIn}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Ngày Trả Phòng *
                  </label>
                  <input
                    type="date"
                    value={formData.checkOut}
                    onChange={(e) => {
                      setFormData({...formData, checkOut: e.target.value});
                      if (errors.checkOut) setErrors({...errors, checkOut: ""});
                    }}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all ${
                      errors.checkOut ? "border-red-500 focus:border-red-500" : "border-gray-200 focus:border-green-500"
                    }`}
                  />
                  {errors.checkOut && (
                    <p className="text-red-500 text-sm mt-1">{errors.checkOut}</p>
                  )}
                </div>
              </motion.div>

              <motion.div variants={fadeInUp} className="mb-8">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Số Khách
                </label>
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, guests: Math.max(1, formData.guests - 1)})}
                    className="w-12 h-12 rounded-full bg-green-100 text-green-600 font-bold hover:bg-green-200 transition-all"
                  >
                    -
                  </button>
                  <span className="text-2xl font-bold text-gray-900 min-w-12 text-center">
                    {formData.guests}
                  </span>
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, guests: formData.guests + 1})}
                    className="w-12 h-12 rounded-full bg-green-100 text-green-600 font-bold hover:bg-green-200 transition-all"
                  >
                    +
                  </button>
                </div>
              </motion.div>

              <motion.div variants={fadeInUp}>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Chọn Loại Phòng *</h3>
                {errors.roomType && (
                  <p className="text-red-500 text-sm mb-3">{errors.roomType}</p>
                )}
                <div className="grid md:grid-cols-2 gap-6">
                  {roomTypes.map((room) => (
                    <motion.div
                      key={room.id}
                      whileHover={{ y: -8 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setFormData({...formData, roomType: room.id});
                        if (errors.roomType) setErrors({...errors, roomType: ""});
                      }}
                      className={`cursor-pointer rounded-2xl overflow-hidden border-2 transition-all ${
                        formData.roomType === room.id
                          ? "border-green-500 shadow-xl shadow-green-100"
                          : errors.roomType
                          ? "border-red-300 hover:border-red-400"
                          : "border-gray-200 hover:border-green-300"
                      }`}
                    >
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={room.image}
                          alt={room.name}
                          className="w-full h-full object-cover"
                        />
                        {formData.roomType === room.id && (
                          <div className="absolute top-4 right-4 bg-green-500 text-white rounded-full p-2">
                            <Check className="w-5 h-5" />
                          </div>
                        )}
                      </div>
                      <div className="p-6 bg-white">
                        <h4 className="text-xl font-bold text-gray-900 mb-2">{room.name}</h4>
                        <p className="text-2xl font-bold text-green-600">{room.price} VNĐ<span className="text-sm text-gray-500">/đêm</span></p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Step 2: Personal Information */}
          {step === 2 && (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
              <motion.div variants={fadeInUp} className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <Users className="w-8 h-8 text-green-500" />
                  Thông Tin Khách Hàng
                </h2>
              </motion.div>

              <div className="grid md:grid-cols-2 gap-6">
                <motion.div variants={fadeInUp}>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Họ và Tên *
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => {
                      setFormData({...formData, fullName: e.target.value});
                      if (errors.fullName) setErrors({...errors, fullName: ""});
                    }}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all ${
                      errors.fullName ? "border-red-500 focus:border-red-500" : "border-gray-200 focus:border-green-500"
                    }`}
                    placeholder="Nguyễn Văn A"
                  />
                  {errors.fullName && (
                    <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
                  )}
                </motion.div>

                <motion.div variants={fadeInUp}>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({...formData, email: e.target.value});
                      if (errors.email) setErrors({...errors, email: ""});
                    }}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all ${
                      errors.email ? "border-red-500 focus:border-red-500" : "border-gray-200 focus:border-green-500"
                    }`}
                    placeholder="email@example.com"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </motion.div>

                <motion.div variants={fadeInUp} className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Số Điện Thoại *
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => {
                      setFormData({...formData, phone: e.target.value});
                      if (errors.phone) setErrors({...errors, phone: ""});
                    }}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all ${
                      errors.phone ? "border-red-500 focus:border-red-500" : "border-gray-200 focus:border-green-500"
                    }`}
                    placeholder="0912345678"
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                  )}
                </motion.div>

                <motion.div variants={fadeInUp} className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Yêu Cầu Đặc Biệt
                  </label>
                  <textarea
                    rows={4}
                    value={formData.specialRequests}
                    onChange={(e) => setFormData({...formData, specialRequests: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-all resize-none"
                    placeholder="Ví dụ: Phòng tầng cao, giường đôi..."
                  />
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* Step 3: Payment */}
          {step === 3 && (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
              <motion.div variants={fadeInUp} className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <CreditCard className="w-8 h-8 text-green-500" />
                  Phương Thức Thanh Toán
                </h2>
              </motion.div>

              <motion.div variants={fadeInUp} className="space-y-4 mb-8">
                {[
                  { id: "credit-card", label: "Thẻ tín dụng/Ghi nợ", icon: "💳" },
                  { id: "bank-transfer", label: "Chuyển khoản ngân hàng", icon: "🏦" },
                  { id: "cash", label: "Thanh toán tại khách sạn", icon: "💵" }
                ].map((method) => (
                  <motion.div
                    key={method.id}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setFormData({...formData, paymentMethod: method.id})}
                    className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${
                      formData.paymentMethod === method.id
                        ? "border-green-500 bg-green-50"
                        : "border-gray-200 hover:border-green-300"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-3xl">{method.icon}</span>
                      <span className="font-semibold text-gray-900">{method.label}</span>
                      {formData.paymentMethod === method.id && (
                        <Check className="w-6 h-6 text-green-500 ml-auto" />
                      )}
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              <motion.div variants={fadeInUp} className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-2xl border-2 border-green-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Tóm Tắt Đặt Phòng</h3>
                <div className="space-y-3 text-gray-700">
                  <div className="flex justify-between">
                    <span>Loại phòng:</span>
                    <span className="font-semibold">{roomTypes.find(r => r.id === formData.roomType)?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Số khách:</span>
                    <span className="font-semibold">{formData.guests} người</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Check-in:</span>
                    <span className="font-semibold">{formData.checkIn}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Check-out:</span>
                    <span className="font-semibold">{formData.checkOut}</span>
                  </div>
                  <div className="border-t-2 border-green-300 pt-3 mt-3 flex justify-between text-xl font-bold text-green-600">
                    <span>Tổng cộng:</span>
                    <span>{roomTypes.find(r => r.id === formData.roomType)?.price} VNĐ</span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Action Buttons */}
          <motion.div 
            className="flex gap-4 mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {step > 1 && (
              <motion.button
                type="button"
                onClick={() => setStep(step - 1)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 border-2 border-green-500 text-green-600 rounded-xl font-semibold hover:bg-green-50 transition-all"
              >
                Quay Lại
              </motion.button>
            )}
            <motion.button
              type="button"
              onClick={() => handleSubmit()}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={
                (step === 1 && (!formData.roomType || !formData.checkIn || !formData.checkOut)) ||
                (step === 2 && (!formData.fullName || !formData.email || !formData.phone))
              }
              className="flex-1 px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-500 text-white rounded-xl font-bold hover:from-green-700 hover:to-emerald-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-green-200"
            >
              {step === 3 ? "Xác Nhận Đặt Phòng" : "Tiếp Tục"}
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}