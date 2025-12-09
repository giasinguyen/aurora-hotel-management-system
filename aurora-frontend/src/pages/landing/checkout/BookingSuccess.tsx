import { useSearchParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/features/store";
import { 
  CheckCircle2, 
  Calendar, 
  MapPin, 
  Phone, 
  Mail, 
  FileText, 
  Hotel, 
  Clock,
  CreditCard,
  Loader2,
  AlertCircle,
  Download,
  Share2
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

export default function BookingSuccessPage() {
  const [searchParams] = useSearchParams();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Check if user is logged in
  const isLogin = useSelector((state: RootState) => state.auth.isLogin);
  
  const bookingId = searchParams.get("bookingId");

  useEffect(() => {
    const fetchBookingDetails = async () => {
      if (!bookingId) {
        setError("Không tìm thấy mã đặt phòng");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // Use public API if user is not logged in, otherwise use authenticated API
        const response = isLogin 
          ? await bookingApi.getById(bookingId)
          : await bookingApi.getByIdPublic(bookingId);
          
        if (response.code === 200 && response.result) {
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
  }, [bookingId, isLogin]);

  const calculateNights = (checkin: string, checkout: string) => {
    const checkinDate = new Date(checkin);
    const checkoutDate = new Date(checkout);
    const diffTime = Math.abs(checkoutDate.getTime() - checkinDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "EEEE, dd/MM/yyyy", { locale: vi });
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <VideoHero
          title="Đang tải thông tin..."
          subtitle="Vui lòng đợi trong giây lát"
        />
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto">
            <Card>
              <CardContent className="p-12 text-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
                <p className="text-gray-600">Đang tải thông tin đặt phòng...</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !booking) {
    return (
      <div className="min-h-screen bg-gray-50">
        <VideoHero
          title="Có lỗi xảy ra"
          subtitle="Không thể tải thông tin đặt phòng"
        />
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto">
            <Card className="border-2 border-red-200 bg-red-50/50">
              <CardContent className="p-8 text-center">
                <div className="flex justify-center mb-6">
                  <div className="rounded-full bg-red-100 p-4">
                    <AlertCircle className="h-16 w-16 text-red-600" />
                  </div>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {error || "Không tìm thấy thông tin đặt phòng"}
                </h1>
                <p className="text-gray-600 mb-6">
                  Vui lòng kiểm tra lại hoặc liên hệ với chúng tôi để được hỗ trợ.
                </p>
                <div className="flex gap-4 justify-center">
                  <Button asChild>
                    <Link to="/">Về trang chủ</Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link to="/booking">Đặt phòng mới</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  const nights = calculateNights(booking.checkin, booking.checkout);
  const statusConfig = BOOKING_STATUS_CONFIG[booking.status];
  const paymentConfig = PAYMENT_STATUS_CONFIG[booking.paymentStatus];

  return (
    <div className="min-h-screen bg-linear-to-b from-green-50 via-white to-gray-50">
      {/* Print Styles */}
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

      {/* Hero Section - No Print */}
      <div className="no-print">
        <VideoHero
          title="🎉 Đặt phòng thành công!"
          subtitle="Cảm ơn bạn đã tin tưởng và chọn Aurora Hotel"
        />
      </div>

      <div className="container mx-auto px-4 py-12 -mt-16 relative z-10">
        <div className="max-w-5xl mx-auto space-y-6" id="booking-print-content">
          
          {/* Success Header Card */}
          <Card className="border-2 border-green-300 shadow-xl bg-linear-to-br from-green-50 to-white">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="shrink-0">
                  <div className="rounded-full bg-linear-to-br from-green-400 to-green-600 p-4 shadow-lg">
                    <CheckCircle2 className="h-16 w-16 text-white" />
                  </div>
                </div>
                
                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                    Đặt phòng thành công!
                  </h1>
                  <p className="text-lg text-gray-600 mb-4">
                    Yêu cầu đặt phòng của bạn đã được xác nhận và đang được xử lý
                  </p>
                  
                  <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                    <Badge variant={statusConfig.variant} className="text-sm px-4 py-1">
                      {statusConfig.label}
                    </Badge>
                    <Badge variant={paymentConfig.variant} className="text-sm px-4 py-1">
                      {paymentConfig.label}
                    </Badge>
                  </div>
                </div>

                <div className="shrink-0 bg-white rounded-xl p-6 shadow-md border-2 border-primary/20">
                  <p className="text-xs text-gray-500 mb-1 text-center">Mã đặt phòng</p>
                  <p className="text-3xl font-bold text-primary text-center">{booking.bookingCode}</p>
                  <p className="text-xs text-gray-500 mt-1 text-center">Lưu mã để tra cứu</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Column - Booking Details */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Booking Information */}
              <Card className="shadow-lg">
                <CardHeader className="bg-linear-to-r from-primary/5 to-primary/10">
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    Thông tin đặt phòng
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <Calendar className="h-5 w-5 text-primary mt-1 shrink-0" />
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-900">Ngày nhận phòng</p>
                          <p className="text-base text-gray-700 font-medium">
                            {formatDate(booking.checkin)}
                          </p>
                          <p className="text-xs text-gray-500">Từ 14:00</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Calendar className="h-5 w-5 text-primary mt-1 shrink-0" />
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-900">Ngày trả phòng</p>
                          <p className="text-base text-gray-700 font-medium">
                            {formatDate(booking.checkout)}
                          </p>
                          <p className="text-xs text-gray-500">Trước 12:00</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <Clock className="h-5 w-5 text-primary mt-1 shrink-0" />
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-900">Thời gian lưu trú</p>
                          <p className="text-base text-gray-700 font-medium">
                            {nights} đêm
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Hotel className="h-5 w-5 text-primary mt-1 shrink-0" />
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-900">Chi nhánh</p>
                          <p className="text-base text-gray-700 font-medium">
                            {booking.branchName}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {booking.specialRequest && (
                    <>
                      <Separator className="my-4" />
                      <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                        <p className="text-sm font-semibold text-gray-900 mb-1">Yêu cầu đặc biệt</p>
                        <p className="text-sm text-gray-700">{booking.specialRequest}</p>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Room Details */}
              <Card className="shadow-lg">
                <CardHeader className="bg-linear-to-r from-primary/5 to-primary/10">
                  <CardTitle className="flex items-center gap-2">
                    <Hotel className="h-5 w-5 text-primary" />
                    Chi tiết phòng ({booking.rooms.length} phòng)
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {booking.rooms.map((room, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-primary/50 transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          <div className="bg-primary/10 rounded-lg p-2">
                            <Hotel className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{room.roomTypeName}</p>
                            <p className="text-sm text-gray-600">Phòng số: {room.roomNumber}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {formatCurrency(room.pricePerNight)} / đêm
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-primary">
                            {formatCurrency(room.pricePerNight * nights)}
                          </p>
                          <p className="text-xs text-gray-500">{nights} đêm</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Next Steps */}
              <Card className="shadow-lg bg-linear-to-br from-blue-50 to-indigo-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-900">
                    <FileText className="h-5 w-5" />
                    Bước tiếp theo
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                      1
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Email xác nhận</p>
                      <p className="text-sm text-gray-700 mt-1">
                        Chúng tôi đã gửi email xác nhận đến địa chỉ của bạn với đầy đủ thông tin đặt phòng và hướng dẫn chi tiết.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                      2
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Chuẩn bị nhận phòng</p>
                      <p className="text-sm text-gray-700 mt-1">
                        Vui lòng đến khách sạn vào ngày <strong>{formatDate(booking.checkin)}</strong> từ 14:00. 
                        Mang theo CMND/CCCD để làm thủ tục check-in.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                      3
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Hỗ trợ 24/7</p>
                      <p className="text-sm text-gray-700 mt-1">
                        Nếu có bất kỳ thắc mắc nào, đừng ngần ngại liên hệ với chúng tôi qua hotline hoặc email bất cứ lúc nào.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Summary & Actions */}
            <div className="space-y-6">
              
              {/* Payment Summary */}
              <Card className="shadow-lg sticky top-4">
                <CardHeader className="bg-linear-to-r from-primary/5 to-primary/10">
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-primary" />
                    Tổng quan thanh toán
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Tổng tiền phòng</span>
                      <span className="font-medium">{formatCurrency(booking.totalPrice)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Số đêm</span>
                      <span className="font-medium">{nights} đêm</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Số phòng</span>
                      <span className="font-medium">{booking.rooms.length} phòng</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">Tổng cộng</span>
                    <span className="text-2xl font-bold text-primary">
                      {formatCurrency(booking.totalPrice)}
                    </span>
                  </div>

                  <div className="pt-2">
                    <Badge 
                      variant={paymentConfig.variant} 
                      className="w-full justify-center py-2 text-sm"
                    >
                      {paymentConfig.label}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <Card className="shadow-lg">
                <CardContent className="p-4 space-y-3">
                  <Button
                    asChild
                    className="w-full bg-primary hover:bg-primary/90"
                    size="lg"
                  >
                    <Link to={`/profile`}>
                      <FileText className="mr-2 h-4 w-4" />
                      Xem lịch sử đặt phòng
                    </Link>
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full"
                    size="lg"
                    onClick={() => window.print()}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    In xác nhận
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full"
                    size="lg"
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: 'Đặt phòng Aurora Hotel',
                          text: `Mã đặt phòng: ${booking.bookingCode}`,
                          url: window.location.href,
                        });
                      }
                    }}
                  >
                    <Share2 className="mr-2 h-4 w-4" />
                    Chia sẻ
                  </Button>
                </CardContent>
              </Card>

              {/* Contact Card */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-base">Liên hệ hỗ trợ</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 rounded-lg p-2">
                      <Phone className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Hotline 24/7</p>
                      <a href="tel:19001234" className="text-sm font-semibold text-primary hover:underline">
                        1900 1234
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 rounded-lg p-2">
                      <Mail className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Email</p>
                      <a 
                        href="mailto:aurorahotel.cskh@gmail.com" 
                        className="text-sm font-semibold text-primary hover:underline break-all"
                      >
                        aurorahotel.cskh@gmail.com
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 rounded-lg p-2 shrink-0">
                      <MapPin className="h-4 w-4 text-primary" />
                    </div>
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
          </div>

          {/* Bottom Actions - No Print */}
          <Card className="shadow-lg no-print">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="flex-1 sm:flex-none"
                >
                  <Link to="/">
                    Về trang chủ
                  </Link>
                </Button>
                
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="flex-1 sm:flex-none"
                >
                  <Link to="/booking">
                    Đặt phòng mới
                  </Link>
                </Button>
                
                {/* Only show for authenticated users */}
                {isLogin && (
                  <Button
                    asChild
                    variant="default"
                    size="lg"
                    className="flex-1 sm:flex-none"
                  >
                    <Link to="/profile">
                      Xem lịch sử đặt phòng
                    </Link>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

