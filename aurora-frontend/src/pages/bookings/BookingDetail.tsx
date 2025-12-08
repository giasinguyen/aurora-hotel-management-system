import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  User,
  BedDouble,
  LogIn,
  LogOut,
  CheckCircle,
  Clock,
  DollarSign,
  Sparkles,
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

import { bookingApi } from '@/services/bookingApi';
import type { Booking } from '@/types/booking.types';
import { BOOKING_STATUS_CONFIG, PAYMENT_STATUS_CONFIG } from '@/types/booking.types';

const BookingDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Detect current role prefix from URL
  const currentPath = window.location.pathname;
  const rolePrefix = currentPath.startsWith('/admin') ? '/admin' 
    : currentPath.startsWith('/manager') ? '/manager'
    : currentPath.startsWith('/staff') ? '/staff'
    : '';

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [showCheckInDialog, setShowCheckInDialog] = useState(false);
  const [showCheckOutDialog, setShowCheckOutDialog] = useState(false);

  useEffect(() => {
    if (id) {
      fetchBookingDetail();
    }
  }, [id]);

  const fetchBookingDetail = async () => {
    try {
      setLoading(true);
      const response = await bookingApi.getById(id!);
      console.log("Booking detail response:", response);
      console.log("Booking services:", response.result?.services);
      setBooking(response.result);
    } catch (error: any) {
      toast.error('Không thể tải thông tin đặt phòng', {
        description: error.response?.data?.message || 'Vui lòng thử lại sau',
      });
      navigate(`${rolePrefix}/bookings`);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async () => {
    if (!booking) return;

    try {
      setActionLoading(true);
      const currentUserId = localStorage.getItem('userId') || 'SYSTEM';
      await bookingApi.checkIn(booking.id, currentUserId);
      toast.success('Check-in thành công!');
      setShowCheckInDialog(false);
      fetchBookingDetail();
    } catch (error: any) {
      toast.error('Check-in thất bại', {
        description: error.response?.data?.message || 'Vui lòng thử lại',
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleCheckOut = async () => {
    if (!booking) return;

    try {
      setActionLoading(true);
      const currentUserId = localStorage.getItem('userId') || 'SYSTEM';
      await bookingApi.checkOut(booking.id, currentUserId);
      toast.success('Check-out thành công!');
      setShowCheckOutDialog(false);
      fetchBookingDetail();
    } catch (error: any) {
      toast.error('Check-out thất bại', {
        description: error.response?.data?.message || 'Vui lòng thử lại',
      });
    } finally {
      setActionLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatDateTime = (dateString: string) => {
    if (!dateString) return 'Chưa xác định';
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const calculateNights = () => {
    if (!booking) return 0;
    const checkin = new Date(booking.checkin);
    const checkout = new Date(booking.checkout);
    const diffTime = Math.abs(checkout.getTime() - checkin.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const canCheckIn = () => {
    return booking?.status === 'CONFIRMED';
  };

  const canCheckOut = () => {
    return booking?.status === 'CHECKED_IN';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="space-y-4">
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                <div className="h-6 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!booking) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate(`${rolePrefix}/bookings`)}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Chi tiết đặt phòng
              </h1>
              <p className="text-gray-500 mt-1">Mã đặt phòng: {booking.bookingCode}</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            {canCheckIn() && (
              <Button
                onClick={() => setShowCheckInDialog(true)}
                className="bg-green-600 hover:bg-green-700"
              >
                <LogIn className="h-4 w-4 mr-2" />
                Check-in
              </Button>
            )}
            {canCheckOut() && (
              <Button
                onClick={() => setShowCheckOutDialog(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Check-out
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status & Payment */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Trạng thái
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Trạng thái đặt phòng</p>
                    <Badge variant={BOOKING_STATUS_CONFIG[booking.status].variant}>
                      {BOOKING_STATUS_CONFIG[booking.status].label}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Trạng thái thanh toán</p>
                    <Badge variant={PAYMENT_STATUS_CONFIG[booking.paymentStatus].variant}>
                      {PAYMENT_STATUS_CONFIG[booking.paymentStatus].label}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Booking Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Thông tin đặt phòng
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Ngày nhận phòng
                    </p>
                    <p className="font-medium mt-1">{formatDate(booking.checkin)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Ngày trả phòng
                    </p>
                    <p className="font-medium mt-1">{formatDate(booking.checkout)}</p>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <p className="text-sm text-gray-500 flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Số đêm
                  </p>
                  <p className="font-medium mt-1">{calculateNights()} đêm</p>
                </div>

                <Separator />

                <div>
                  <p className="text-sm text-gray-500 flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Chi nhánh
                  </p>
                  <p className="font-medium mt-1">{booking.branchName}</p>
                </div>

                <Separator />

                <div>
                  <p className="text-sm text-gray-500 flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Khách hàng
                  </p>
                  <p className="font-medium mt-1">{booking.customerName || booking.guestFullName}</p>
                  {(booking.guestEmail || booking.guestPhone) && (
                    <div className="mt-2 space-y-1">
                      {booking.guestEmail && (
                        <p className="text-sm text-gray-600">📧 {booking.guestEmail}</p>
                      )}
                      {booking.guestPhone && (
                        <p className="text-sm text-gray-600">📞 {booking.guestPhone}</p>
                      )}
                    </div>
                  )}
                </div>

                {booking.specialRequest && (
                  <>
                    <Separator />
                    <div>
                      <p className="text-sm text-gray-500">Yêu cầu đặc biệt</p>
                      <p className="mt-1 text-gray-700">{booking.specialRequest}</p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Room Details with Services */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BedDouble className="h-5 w-5" />
                  Danh sách phòng và dịch vụ ({booking.rooms.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
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
                        className="p-4 border rounded-lg hover:bg-gray-50 transition-colors bg-gray-50"
                      >
                        {/* Room Info */}
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <p className="font-medium text-lg">
                              Phòng {room.roomNumber || 'Chưa phân phòng'}
                            </p>
                            <p className="text-sm text-gray-500">
                              {room.roomTypeName || room.roomType || 'Phòng'}
                            </p>
                            {!room.roomNumber && (
                              <p className="text-xs text-amber-600 mt-1">
                                ⚠️ Phòng sẽ được phân phòng khi check-in
                              </p>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-lg">
                              {formatCurrency(room.pricePerNight)}
                            </p>
                            <p className="text-sm text-gray-500">/ đêm</p>
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
                                      • {formatDateTime(service.dateTime)}
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
          </div>

          {/* Pricing Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Tổng quan chi phí
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Số phòng:</span>
                    <span className="font-medium">{booking.rooms.length} phòng</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Số đêm:</span>
                    <span className="font-medium">{calculateNights()} đêm</span>
                  </div>

                  <Separator />

                  {booking.rooms.map((room, index) => (
                    <div key={room.roomId || `room-cost-${index}`} className="flex justify-between text-sm">
                      <span className="text-gray-600">Phòng {room.roomNumber}:</span>
                      <span className="font-medium">
                        {formatCurrency(room.pricePerNight * calculateNights())}
                      </span>
                    </div>
                  ))}

                  {booking.services && booking.services.length > 0 && (
                    <>
                      <Separator />
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Dịch vụ:</span>
                        <span className="font-medium">
                          {formatCurrency(
                            booking.services.reduce((sum, service) => sum + service.price * service.quantity, 0)
                          )}
                        </span>
                      </div>
                    </>
                  )}

                  <Separator />

                  <div className="flex justify-between items-center pt-2">
                    <span className="text-lg font-semibold">Tổng cộng:</span>
                    <span className="text-2xl font-bold text-green-600">
                      {formatCurrency(booking.totalPrice)}
                    </span>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2 text-xs text-gray-500">
                  <p>• Giá đã bao gồm thuế VAT</p>
                  <p>• Chính sách hủy phòng áp dụng theo quy định</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Check-in Dialog */}
      <AlertDialog open={showCheckInDialog} onOpenChange={setShowCheckInDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận Check-in</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn thực hiện check-in cho booking <strong>{booking.bookingCode}</strong>?
              <br />
              <br />
              Khách hàng: <strong>{booking.customerName}</strong>
              <br />
              Số phòng: <strong>{booking.rooms.length} phòng</strong>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={actionLoading}>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCheckIn}
              disabled={actionLoading}
              className="bg-green-600 hover:bg-green-700"
            >
              {actionLoading ? 'Đang xử lý...' : 'Xác nhận Check-in'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Check-out Dialog */}
      <AlertDialog open={showCheckOutDialog} onOpenChange={setShowCheckOutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận Check-out</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn thực hiện check-out cho booking <strong>{booking.bookingCode}</strong>?
              <br />
              <br />
              Khách hàng: <strong>{booking.customerName}</strong>
              <br />
              Tổng tiền: <strong>{formatCurrency(booking.totalPrice)}</strong>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={actionLoading}>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCheckOut}
              disabled={actionLoading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {actionLoading ? 'Đang xử lý...' : 'Xác nhận Check-out'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default BookingDetailPage;