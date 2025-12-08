import { useState, useEffect, type ChangeEvent } from "react";
import { User, Mail, Phone, MapPin, Calendar, Save, X, Camera, ArrowLeft, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import VideoHero from "@/components/custom/VideoHero";
import { useMyProfile } from "@/hooks/useMyProfile";
import { format } from "date-fns";

export default function ProfileUpsertPage() {
  const { user, loading, saving, updateProfile, uploadAvatar } = useMyProfile();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    birthDate: "",
    gender: "male"
  });

  const [uploading, setUploading] = useState(false);

  // Load user data into form when user is fetched
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        birthDate: user.dob ? format(new Date(user.dob), "yyyy-MM-dd") : "",
        gender: "male" // API không có gender field
      });
    }
  }, [user]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAvatarChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('Kích thước ảnh không được vượt quá 5MB');
      return;
    }

    if (!file.type.startsWith('image/')) {
      alert('Vui lòng chọn file ảnh');
      return;
    }

    setUploading(true);
    await uploadAvatar(file);
    setUploading(false);
  };

  const handleSubmit = async () => {
    const nameParts = formData.name.trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';
    
    const success = await updateProfile({
      firstName,
      lastName,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      dob: formData.birthDate
    });

    if (success) {
      window.location.href = '/profile';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'oklch(0.702 0.078 56.8)' }} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <VideoHero 
        title="Chỉnh Sửa Hồ Sơ"
        subtitle="Cập nhật thông tin cá nhân của bạn"
      />

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Card className="shadow-xl">
          {/* Avatar Upload Section */}
          <CardHeader className="bg-linear-to-r from-green-50 to-emerald-50 border-b">
            <div className="flex flex-col items-center py-4">
              <div className="relative group">
                <div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-offset-4" style={{ borderColor: 'oklch(0.702 0.078 56.8)' }}>
                  <img
                    src={user?.avatarUrl || "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&h=400&fit=crop"}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
                <label className="absolute bottom-0 right-0 text-white p-3 rounded-full shadow-lg transition-all cursor-pointer" style={{ backgroundColor: 'oklch(0.702 0.078 56.8)' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'oklch(0.652 0.078 56.8)'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'oklch(0.702 0.078 56.8)'}>
                  {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Camera className="w-5 h-5" />}
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleAvatarChange}
                    disabled={uploading}
                  />
                </label>
              </div>
              {uploading && (
                <p className="text-sm text-green-600 mt-4 flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Đang tải ảnh lên...
                </p>
              )}
              {!uploading && (
                <p className="text-sm text-gray-600 mt-4">Nhấp vào biểu tượng máy ảnh để thay đổi ảnh đại diện</p>
              )}
            </div>
          </CardHeader>

          {/* Form Fields */}
          <CardContent className="p-8 space-y-6">
            {/* Name */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <User className="w-4 h-4" style={{ color: 'oklch(0.702 0.078 56.8)' }} />
                Họ và Tên <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                style={{ '--tw-ring-color': 'oklch(0.702 0.078 56.8)' } as React.CSSProperties}
                placeholder="Nhập họ và tên"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <Mail className="w-4 h-4" style={{ color: 'oklch(0.702 0.078 56.8)' }} />
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                style={{ '--tw-ring-color': 'oklch(0.702 0.078 56.8)' } as React.CSSProperties}
                placeholder="Nhập email"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Phone */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <Phone className="w-4 h-4" style={{ color: 'oklch(0.702 0.078 56.8)' }} />
                  Số Điện Thoại
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                  style={{ '--tw-ring-color': 'oklch(0.702 0.078 56.8)' } as React.CSSProperties}
                  placeholder="+84 xxx xxx xxx"
                />
              </div>

              {/* Birth Date */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <Calendar className="w-4 h-4" style={{ color: 'oklch(0.702 0.078 56.8)' }} />
                  Ngày Sinh
                </label>
                <input
                  type="date"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                  style={{ '--tw-ring-color': 'oklch(0.702 0.078 56.8)' } as React.CSSProperties}
                />
              </div>
            </div>

            {/* Address Field */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <MapPin className="w-4 h-4" style={{ color: 'oklch(0.702 0.078 56.8)' }} />
                Địa Chỉ
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all resize-none"
                style={{ '--tw-ring-color': 'oklch(0.702 0.078 56.8)' } as React.CSSProperties}
                placeholder="Nhập địa chỉ đầy đủ"
              />
            </div>

            {/* Gender */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <User className="w-4 h-4" style={{ color: 'oklch(0.702 0.078 56.8)' }} />
                Giới Tính
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                style={{ '--tw-ring-color': 'oklch(0.702 0.078 56.8)' } as React.CSSProperties}
              >
                <option value="male">Nam</option>
                <option value="female">Nữ</option>
                <option value="other">Khác</option>
              </select>
            </div>

            <Separator className="my-6" />

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-end">
              <Button
                variant="outline"
                onClick={() => window.history.back()}
                className="flex items-center gap-2"
                disabled={saving}
              >
                <X className="w-4 h-4" />
                Hủy
              </Button>
              <Button
                onClick={handleSubmit}
                className="flex items-center gap-2 text-white"
                style={{ backgroundColor: 'oklch(0.702 0.078 56.8)' }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'oklch(0.652 0.078 56.8)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'oklch(0.702 0.078 56.8)')}
                disabled={saving || uploading}
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Đang lưu...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Lưu Thay Đổi
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}