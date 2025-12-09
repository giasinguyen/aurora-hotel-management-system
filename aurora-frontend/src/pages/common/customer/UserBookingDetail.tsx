import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/features/store";
import { 
  Calendar, 
  MapPin, 
  FileText, 
  Hotel, 
  Clock,
  CreditCard,
  Users,
  Loader2,
  AlertCircle,
  Printer,
  ArrowLeft,
  Home,
  Sparkles
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import VideoHero from "@/components/custom/VideoHero";
import bookingApi from "@/services/bookingApi";
import type { Booking } from "@/types/booking.types";
import { BOOKING_STATUS_CONFIG, PAYMENT_STATUS_CONFIG } from "@/types/booking.types";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

const BookingDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Check if user is logged in
  const isLogin = useSelector((state: RootState) => state.auth.isLogin);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      if (!id) {
        setError("Không tìm thấy mã đặt phòng");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // Use public API if user is not logged in, otherwise use authenticated API
        const response = isLogin 
          ? await bookingApi.getById(id)
          : await bookingApi.getByIdPublic(id);
          
        console.log("Booking detail response:", response);
        if (response.code === 200 && response.result) {
          console.log("Booking data:", response.result);
          console.log("Booking services:", response.result.services);
          setBooking(response.result);
        } else {
          setError("Không thể tải thông tin đặt phòng");
        }
      } catch (err) {
        console.error("Error fetching booking:", err);
        setError("Đã có lỗi xảy ra khi tải thông tin đặt phòng");
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [id, isLogin]);

  const calculateNights = (checkin: string, checkout: string) => {
    const checkinDate = new Date(checkin);
    const checkoutDate = new Date(checkout);
    const diffTime = Math.abs(checkoutDate.getTime() - checkinDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd/MM/yyyy", { locale: vi });
  };

  const formatDateTime = (dateString: string) => {
    return format(new Date(dateString), "dd/MM/yyyy HH:mm", { locale: vi });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-green-600 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Đang tải thông tin đặt phòng...</p>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="flex items-center justify-center py-20 px-4">
        <Card className="max-w-md w-full shadow-xl">
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Có lỗi xảy ra</h2>
              <p className="text-gray-600 mb-6">{error || "Không thể tải thông tin đặt phòng"}</p>
              <div className="flex gap-3 justify-center">
                <Button variant="outline" onClick={() => navigate(-1)}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Quay lại
                </Button>
                <Button asChild>
                  <Link to="/">
                    <Home className="w-4 h-4 mr-2" />
                    Về trang chủ
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const statusConfig = BOOKING_STATUS_CONFIG[booking.status] || { label: 'Không xác định', variant: 'outline' as const };
  const paymentConfig = PAYMENT_STATUS_CONFIG[booking.paymentStatus] || { label: 'Không xác định', variant: 'outline' as const };
  const nights = calculateNights(booking.checkin, booking.checkout);

  return (
    <>
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #booking-print-content,
          #booking-print-content * {
            visibility: visible;
          }
          #booking-print-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div className="min-h-screen">
        {/* Hero Section - No Print */}
        <div className="no-print">
          <VideoHero 
            title="Chi tiết đặt phòng"
            subtitle={booking ? `Mã đặt phòng: ${booking.bookingCode}` : "Đang tải thông tin..."}
          />
        </div>

        {/* Action Buttons - No Print */}
        <div className="no-print bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={() => navigate(-1)}
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Quay lại
              </Button>
              <Button
                variant="default"
                onClick={handlePrint}
                className="gap-2"
              >
                <Printer className="w-4 h-4" />
                In đặt phòng
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-gradient-to-br from-green-50 via-white to-blue-50 py-12">
          <div className="max-w-6xl mx-auto px-4">
          <div id="booking-print-content" className="space-y-6">
            {/* Success Header */}
            <Card className="shadow-xl border-green-200">
              <CardContent className="p-8 text-center">
                <div className="flex flex-col items-center gap-4">
                  <div className="bg-green-100 p-4 rounded-full">
                    <Hotel className="w-12 h-12 text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                      Thông tin đặt phòng
                    </h2>
                    <p className="text-gray-600 text-lg">
                      Mã đặt phòng: <span className="font-bold text-green-600">{booking.bookingCode}</span>
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <Badge variant={statusConfig.variant} className="text-base px-4 py-2">
                      {statusConfig.label}
                    </Badge>
                    <Badge variant={paymentConfig.variant} className="text-base px-4 py-2">
                      {paymentConfig.label}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Booking Details Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Guest Information */}
              <Card className="shadow-lg">
                <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50">
                  <CardTitle className="flex items-center gap-2 text-green-700">
                    <Users className="w-5 h-5" />
                    Thông tin khách hàng
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  <div className="flex items-start gap-3">
                    <FileText className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Tên khách hàng</p>
                      <p className="font-semibold text-gray-900">{booking.customerName || 'Khách vãng lai'}</p>
                    </div>
                  </div>
                  {booking.specialRequest && (
                    <>
                      <Separator />
                      <div className="flex items-start gap-3">
                        <FileText className="w-5 h-5 text-gray-400 mt-0.5" />
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Yêu cầu đặc biệt</p>
                          <p className="text-gray-700">{booking.specialRequest}</p>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Check-in/out Information */}
              <Card className="shadow-lg">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
                  <CardTitle className="flex items-center gap-2 text-blue-700">
                    <Calendar className="w-5 h-5" />
                    Thời gian lưu trú
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 mb-1">Check-in</p>
                      <p className="font-semibold text-gray-900">{formatDate(booking.checkin)}</p>
                      <p className="text-sm text-gray-600">Từ 14:00</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 mb-1">Check-out</p>
                      <p className="font-semibold text-gray-900">{formatDate(booking.checkout)}</p>
                      <p className="text-sm text-gray-600">Trước 12:00</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Số đêm</p>
                      <p className="font-semibold text-gray-900">{nights} đêm</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Room Details with Services */}
            <Card className="shadow-lg">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
                <CardTitle className="flex items-center gap-2 text-purple-700">
                  <Hotel className="w-5 h-5" />
                  Chi tiết phòng và dịch vụ
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {booking.rooms.map((room, index) => {
                    // Get services for this room - must match roomId exactly
                    const roomServices = booking.services?.filter(
                      (service) => service.roomId && room.roomId && service.roomId === room.roomId
                    ) || [];
                    const roomServicesTotal = roomServices.reduce(
                      (sum, service) => sum + service.price * service.quantity,
                      0
                    );

                    return (
                      <div
                        key={room.roomId || `room-${index}`}
                        className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                      >
                        {/* Room Info */}
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-4">
                            <div className="bg-purple-100 p-3 rounded-lg">
                              <Hotel className="w-6 h-6 text-purple-600" />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">
                                {room.roomTypeName || room.roomType || 'Phòng'}
                              </p>
                              <p className="text-sm text-gray-600">
                                Phòng số: {room.roomNumber || 'Chưa phân phòng'}
                              </p>
                              {!room.roomNumber && (
                                <p className="text-xs text-amber-600 mt-1">
                                  ⚠️ Phòng sẽ được phân phòng khi check-in
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-green-600">{formatCurrency(room.pricePerNight)}</p>
                            <p className="text-xs text-gray-500">/ đêm</p>
                          </div>
                        </div>

                        {/* Services for this room */}
                        {roomServices.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-gray-200">
                            <p className="text-xs font-medium text-gray-700 mb-2">
                              Dịch vụ đã chọn:
                            </p>
                            <div className="space-y-2">
                              {roomServices.map((service) => (
                                <div
                                  key={service.id || `service-${service.serviceId}-${index}`}
                                  className="flex items-center justify-between text-xs bg-white p-2 rounded border border-gray-100"
                                >
                                  <div className="flex items-center gap-2">
                                    <Sparkles className="w-3 h-3 text-pink-600" />
                                    <span className="text-gray-700">
                                      {service.serviceName}
                                      {service.quantity > 1 && (
                                        <span className="text-gray-500 ml-1">
                                          (x{service.quantity})
                                        </span>
                                      )}
                                    </span>
                                    <span className="text-gray-500">
                                      • {service.dateTime ? formatDateTime(service.dateTime) : 'Chưa xác định'}
                                    </span>
                                  </div>
                                  <span className="text-gray-700 font-medium">
                                    {formatCurrency(service.price * service.quantity)}
                                  </span>
                                </div>
                              ))}
                            </div>
                            {roomServicesTotal > 0 && (
                              <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-200">
                                <span className="text-xs font-medium text-gray-700">
                                  Tổng dịch vụ:
                                </span>
                                <span className="text-xs font-semibold text-pink-600">
                                  {formatCurrency(roomServicesTotal)}
                                </span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Payment Summary */}
            <Card className="shadow-lg border-green-200">
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
                <CardTitle className="flex items-center gap-2 text-green-700">
                  <CreditCard className="w-5 h-5" />
                  Tổng quan thanh toán
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-3">
                  {booking.services && booking.services.length > 0 && (
                    <>
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Phòng ({nights} đêm)</span>
                        <span>{formatCurrency(
                          booking.rooms.reduce((sum, room) => sum + room.pricePerNight * nights, 0)
                        )}</span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Dịch vụ</span>
                        <span>{formatCurrency(
                          booking.services.reduce((sum, service) => sum + service.price * service.quantity, 0)
                        )}</span>
                      </div>
                      <Separator />
                    </>
                  )}
                  <div className="flex justify-between text-xl font-bold text-gray-900">
                    <span>Tổng cộng ({nights} đêm)</span>
                    <span className="text-green-600">{formatCurrency(booking.totalPrice)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Branch Information */}
            <Card className="shadow-lg">
              <CardHeader className="bg-gradient-to-r from-orange-50 to-yellow-50">
                <CardTitle className="flex items-center gap-2 text-orange-700">
                  <MapPin className="w-5 h-5" />
                  Thông tin chi nhánh
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <MapPin className="w-6 h-6 text-orange-500 mt-1" />
                  <div>
                    <p className="text-xs text-gray-500">Địa chỉ</p>
                    <p className="text-sm font-semibold text-gray-700">
                      {booking.branchName}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Bottom Actions - No Print */}
          <div className="mt-8 no-print">
            <Card className="shadow-lg">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    variant="outline"
                    onClick={() => navigate(-1)}
                    size="lg"
                    className="flex-1 sm:flex-none"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Quay lại
                  </Button>
                  
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="flex-1 sm:flex-none"
                  >
                    <Link to="/">
                      <Home className="w-4 h-4 mr-2" />
                      Về trang chủ
                    </Link>
                  </Button>
                  
                  <Button
                    onClick={handlePrint}
                    variant="default"
                    size="lg"
                    className="flex-1 sm:flex-none"
                  >
                    <Printer className="w-4 h-4 mr-2" />
                    In đặt phòng
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        </div>
      </div>
    </>
  );
};

export default BookingDetailPage;