import { useState, useEffect } from "react";
import { User, Mail, Phone, MapPin, Calendar, Edit, Camera, Loader2, Hotel, CreditCard, Shield, Bell, Eye, LogOut } from "lucide-react";
import { useMyProfile } from "@/hooks/useMyProfile";
import axiosClient from "@/config/axiosClient";
import type { Booking } from "@/types/booking.types";
import type { ApiResponse } from "@/types/apiResponse";
import { BOOKING_STATUS_CONFIG, PAYMENT_STATUS_CONFIG } from "@/types/booking.types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import VideoHero from "@/components/custom/VideoHero";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

// Spring Page response type
interface SpringPage<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}


export default function CustomerProfilePage() {
  const [activeTab, setActiveTab] = useState("personal");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  
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

  // Fetch user bookings when tab changes to bookings
  useEffect(() => {
    const fetchUserBookings = async () => {
      if (activeTab === "bookings" && user?.id) {
        try {
          setLoadingBookings(true);
          // Use /my-bookings endpoint for customers
          const response = await axiosClient.get<ApiResponse<SpringPage<Booking>>>(
            '/api/v1/bookings/my-bookings',
            { 
              params: {
                customerId: user.id,
                page: 0,
                size: 20,
                sortBy: 'checkin',
                sortDir: 'desc'
              }
            }
          );
          
          console.log("Bookings API response:", response);
          
          if (response.data && response.data.result) {
            setBookings(response.data.result.content);
            console.log("Loaded bookings:", response.data.result.content.length);
          }
        } catch (error) {
          console.error("Error fetching bookings:", error);
        } finally {
          setLoadingBookings(false);
        }
      }
    };

    fetchUserBookings();
  }, [activeTab, user?.id]);

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd/MM/yyyy", { locale: vi });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
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
                  <div className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: 'oklch(0.902 0.028 56.8)' }}>
                    <div className="flex items-center gap-2">
                      <Hotel className="w-5 h-5" style={{ color: 'oklch(0.602 0.118 56.8)' }} />
                      <span className="text-xs text-gray-600">Đơn đặt phòng</span>
                    </div>
                    <span className="text-lg font-bold" style={{ color: 'oklch(0.602 0.118 56.8)' }}>{bookings.length}</span>
                  </div>
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
                    { id: "bookings", label: "Đặt Phòng", icon: Hotel },
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

              {/* Bookings Tab */}
              {activeTab === "bookings" && (
                <Card className="shadow-lg">
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
                    <CardTitle className="flex items-center gap-2">
                      <Hotel className="w-5 h-5" />
                      Lịch Sử Đặt Phòng ({bookings.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    {loadingBookings ? (
                      <div className="text-center py-12">
                        <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4" style={{ color: 'oklch(0.702 0.078 56.8)' }} />
                        <p className="text-gray-600">Đang tải lịch sử đặt phòng...</p>
                      </div>
                    ) : bookings.length === 0 ? (
                      <div className="text-center py-12">
                        <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Hotel className="w-10 h-10 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Chưa có đặt phòng</h3>
                        <p className="text-gray-600 mb-6">Bạn chưa có lịch sử đặt phòng nào</p>
                        <Button
                          onClick={() => window.location.href = `/booking/${booking.id}`}
                          className="text-white"
                          style={{ backgroundColor: 'oklch(0.702 0.078 56.8)' }}
                          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'oklch(0.652 0.078 56.8)')}
                          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'oklch(0.702 0.078 56.8)')}
                        >
                          Đặt Phòng Ngay
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {bookings.map((booking) => {
                          const statusConfig = BOOKING_STATUS_CONFIG[booking.status] || { label: 'Không xác định', variant: 'outline' as const };
                          const paymentConfig = PAYMENT_STATUS_CONFIG[booking.paymentStatus] || { label: 'Không xác định', variant: 'outline' as const };
                          
                          return (
                            <div
                              key={booking.id}
                              onClick={() => window.location.href = `/booking/${booking.id}`}
                              className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md hover:border-green-300 transition-all cursor-pointer"
                            >
                              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex-1">
                                  <div className="flex items-start gap-4">
                                    <div className="p-2 rounded-lg" style={{ backgroundColor: 'oklch(0.902 0.028 56.8)' }}>
                                      <Hotel className="w-5 h-5" style={{ color: 'oklch(0.602 0.118 56.8)' }} />
                                    </div>
                                    <div>
                                      <h4 className="font-bold text-gray-900 text-base">
                                        {booking.bookingCode}
                                      </h4>
                                      <p className="text-sm text-gray-500">{booking.branchName}</p>
                                    </div>
                                  </div>
                                  
                                  <div className="grid grid-cols-2 gap-3 text-sm">
                                    <div>
                                      <p className="text-gray-500">Check-in</p>
                                      <p className="font-medium text-gray-900">
                                        {formatDate(booking.checkin)}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-gray-500">Check-out</p>
                                      <p className="font-medium text-gray-900">
                                        {formatDate(booking.checkout)}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-gray-500">Số phòng</p>
                                      <p className="font-medium text-gray-900">
                                        {booking.rooms.length} phòng
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-gray-500 mb-1">Tổng tiền</p>
                                      <p className="font-bold" style={{ color: 'oklch(0.602 0.118 56.8)' }}>
                                        {formatCurrency(booking.totalPrice)}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="flex flex-col gap-2 items-end">
                                  <Badge variant={statusConfig.variant} className="text-sm">
                                    {statusConfig.label}
                                  </Badge>
                                  <Badge variant={paymentConfig.variant} className="text-sm">
                                    {paymentConfig.label}
                                  </Badge>
                                </div>
                              </div>

                              {booking.rooms.length > 0 && (
                                <div className="mt-4 pt-4 border-t border-gray-100">
                                  <p className="text-sm text-gray-500 mb-2">Phòng đã đặt:</p>
                                  <div className="flex flex-wrap gap-2">
                                    {booking.rooms.map((room, idx) => (
                                      <span
                                        key={idx}
                                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium"
                                        style={{ 
                                          backgroundColor: 'oklch(0.902 0.028 56.8)', 
                                          color: 'oklch(0.502 0.138 56.8)',
                                          borderWidth: '1px',
                                          borderColor: 'oklch(0.802 0.048 56.8)'
                                        }}
                                      >
                                        <Hotel className="w-3 h-3" />
                                        {room.roomTypeName} - {room.roomNumber}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
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