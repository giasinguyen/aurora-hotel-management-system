import { useState } from "react";
import { User, Mail, Phone, MapPin, Calendar, Edit, Camera, Loader2, Shield, Bell, Eye, LogOut } from "lucide-react";
import { useMyProfile } from "@/hooks/useMyProfile";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import VideoHero from "@/components/custom/VideoHero";

export default function CustomerProfilePage() {
  const [activeTab, setActiveTab] = useState("personal");
  
  const { user, loading, uploadAvatar } = useMyProfile();
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
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-green-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Đang tải thông tin...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center py-20">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <p className="text-gray-600 mb-4">Không thể tải thông tin người dùng</p>
            <Button onClick={() => window.location.href = '/auth'}>
              Đăng nhập
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <VideoHero 
        title="Hồ Sơ Của Tôi"
        subtitle="Quản lý thông tin cá nhân và lịch sử đặt phòng"
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Sidebar - Profile Card */}
          <div className="lg:col-span-1">
            <Card className="shadow-lg sticky top-4">
              <CardContent className="p-6">
                {/* Avatar */}
                <div className="text-center mb-6">
                  <div className="relative inline-block">
                    <div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-offset-4 mx-auto" style={{ borderColor: 'oklch(0.702 0.078 56.8)' }}>
                      <img
                        src={user.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(`${user.firstName} ${user.lastName}`)}&background=22c55e&color=fff&size=128`}
                        alt={`${user.firstName} ${user.lastName}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <label className="absolute bottom-0 right-0 text-white p-2 rounded-full shadow-lg transition-colors cursor-pointer" style={{ backgroundColor: 'oklch(0.702 0.078 56.8)' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'oklch(0.652 0.078 56.8)'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'oklch(0.702 0.078 56.8)'}>
                      <Camera className="w-4 h-4" />
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleAvatarUpload(file);
                        }}
                      />
                    </label>
                  </div>
                  
                  <h2 className="text-2xl font-bold text-gray-900 mt-4">
                    {user.firstName && user.lastName 
                      ? `${user.firstName} ${user.lastName}` 
                      : user.username}
                  </h2>
                  <p className="text-gray-500 text-sm mt-1 flex items-center justify-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Thành viên từ {formatJoinDate(user.createdAt)}
                  </p>
                </div>

                <Separator className="my-4" />

                {/* Quick Stats */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Shield className="w-5 h-5 text-blue-600" />
                      <span className="text-sm font-medium text-gray-700">Trạng thái</span>
                    </div>
                    <Badge variant="success">Đã xác minh</Badge>
                  </div>
                </div>

                <Separator className="my-4" />

                {/* Action Button */}
                <Button
                  onClick={() => window.location.href = '/profile/upsert'}
                  className="w-full text-white"
                  style={{ backgroundColor: 'oklch(0.702 0.078 56.8)' }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'oklch(0.652 0.078 56.8)')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'oklch(0.702 0.078 56.8)')}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Chỉnh Sửa Hồ Sơ
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right Content - Tabs */}
          <div className="lg:col-span-2">
            {/* Tabs Navigation */}
            <Card className="shadow-lg mb-6">
              <CardContent className="p-4">
                <div className="flex gap-2">
                  {[
                    { id: "personal", label: "Thông Tin", icon: User },
                    { id: "security", label: "Bảo Mật", icon: Shield }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all ${
                        activeTab === tab.id
                          ? "text-white shadow-md"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                      style={activeTab === tab.id ? { backgroundColor: 'oklch(0.702 0.078 56.8)' } : {}}
                    >
                      <tab.icon className="w-4 h-4" />
                      <span className="hidden sm:inline">{tab.label}</span>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Tab Content */}
            {/* Tab Content */}
            <div className="space-y-6">
              {/* Personal Info Tab */}
              {activeTab === "personal" && (
                <Card className="shadow-lg">
                  <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
                    <CardTitle className="flex items-center gap-2">
                      <User className="w-5 h-5" />
                      Thông Tin Cá Nhân
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {[
                        { 
                          icon: User, 
                          label: "Họ và Tên", 
                          value: user.firstName && user.lastName 
                            ? `${user.firstName} ${user.lastName}` 
                            : 'Chưa cập nhật',
                          color: "green"
                        },
                        { 
                          icon: Mail, 
                          label: "Email", 
                          value: user.email || 'Chưa cập nhật',
                          color: "blue"
                        },
                        { 
                          icon: Phone, 
                          label: "Số Điện Thoại", 
                          value: user.phone || 'Chưa cập nhật',
                          color: "purple"
                        },
                        { 
                          icon: MapPin, 
                          label: "Địa Chỉ", 
                          value: user.address || 'Chưa cập nhật',
                          color: "orange"
                        }
                      ].map((item, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-green-300 transition-colors"
                        >
                          <div className={`bg-${item.color}-100 text-${item.color}-600 p-3 rounded-lg`}>
                            <item.icon className="w-5 h-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-500 mb-1">{item.label}</p>
                            <p className="text-base font-semibold text-gray-900 truncate">{item.value}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Security Tab */}
              {activeTab === "security" && (
                <Card className="shadow-lg">
                  <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="w-5 h-5" />
                      Cài Đặt Bảo Mật
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {[
                        { icon: Bell, label: "Nhận thông báo qua Email", checked: true, color: "blue" },
                        { icon: Mail, label: "Nhận khuyến mãi đặc biệt", checked: true, color: "green" },
                        { icon: Eye, label: "Hiển thị hồ sơ công khai", checked: false, color: "purple" }
                      ].map((pref, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-green-300 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className={`bg-${pref.color}-100 text-${pref.color}-600 p-2 rounded-lg`}>
                              <pref.icon className="w-5 h-5" />
                            </div>
                            <span className="font-medium text-gray-900">{pref.label}</span>
                          </div>
                          <label className="relative inline-block w-12 h-6 cursor-pointer">
                            <input type="checkbox" className="sr-only peer" defaultChecked={pref.checked} />
                            <div className="w-12 h-6 bg-gray-300 rounded-full peer transition-all peer-checked:opacity-0"></div>
                            <div className="absolute inset-0 w-12 h-6 rounded-full transition-all opacity-0 peer-checked:opacity-100" style={{ backgroundColor: 'oklch(0.702 0.078 56.8)' }}></div>
                            <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all peer-checked:translate-x-6"></div>
                          </label>
                        </div>
                      ))}

                      <Separator className="my-6" />

                      <Button
                        variant="destructive"
                        className="w-full"
                        onClick={() => {
                          if (confirm('Bạn có chắc chắn muốn đăng xuất?')) {
                            localStorage.clear();
                            window.location.href = '/auth';
                          }
                        }}
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Đăng Xuất
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}