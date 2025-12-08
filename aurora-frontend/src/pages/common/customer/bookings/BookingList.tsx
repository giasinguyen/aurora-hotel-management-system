import { useState, useEffect } from "react";
import { Hotel, Loader2, Sparkles } from "lucide-react";
import { useMyProfile } from "@/hooks/useMyProfile";
import axiosClient from "@/config/axiosClient";
import type { Booking } from "@/types/booking.types";
import type { ApiResponse } from "@/types/apiResponse";
import { BOOKING_STATUS_CONFIG, PAYMENT_STATUS_CONFIG } from "@/types/booking.types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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

const CustomerBookingListPage = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  
  const { user, loading } = useMyProfile();

  // Fetch user bookings on component mount
  useEffect(() => {
    const fetchUserBookings = async () => {
      if (user?.id) {
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
  }, [user?.id]);

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd/MM/yyyy", { locale: vi });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <VideoHero 
        title="Lịch Sử Đặt Phòng"
        subtitle="Xem và quản lý các đơn đặt phòng của bạn"
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
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
                  onClick={() => window.location.href = `/`}
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
                      onClick={() => window.location.href = `/booking/user-booking-detail/${booking.id}`}
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
                          <p className="text-sm font-medium text-gray-700 mb-3">Phòng và dịch vụ đã đặt:</p>
                          <div className="space-y-3">
                            {booking.rooms.map((room, idx) => {
                              // Get services for this room - must match roomId exactly
                              const roomServices = booking.services?.filter(
                                (service) => service.roomId && room.roomId && service.roomId === room.roomId
                              ) || [];

                              return (
                                <div
                                  key={room.roomId || `room-${idx}`}
                                  className="p-3 bg-gray-50 rounded-lg border border-gray-200"
                                >
                                  <div className="flex items-center gap-2 mb-2">
                                    <Hotel className="w-4 h-4" style={{ color: 'oklch(0.602 0.118 56.8)' }} />
                                    <span className="text-sm font-semibold text-gray-900">
                                      {room.roomTypeName || room.roomType || 'Phòng'} - {room.roomNumber || 'Chưa phân phòng'}
                                    </span>
                                  </div>
                                  {roomServices.length > 0 && (
                                    <div className="ml-6 mt-2 space-y-1">
                                      {roomServices.map((service) => (
                                        <div
                                          key={service.id || `service-${service.serviceId}-${idx}`}
                                          className="flex items-center justify-between text-xs"
                                        >
                                          <div className="flex items-center gap-1">
                                            <Sparkles className="w-3 h-3 text-pink-600" />
                                            <span className="text-gray-600">
                                              {service.serviceName}
                                              {service.quantity > 1 && ` (x${service.quantity})`}
                                            </span>
                                          </div>
                                          <span className="text-gray-700 font-medium">
                                            {formatCurrency(service.price * service.quantity)}
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
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
      </div>
    </div>
  );
};

export default CustomerBookingListPage;
