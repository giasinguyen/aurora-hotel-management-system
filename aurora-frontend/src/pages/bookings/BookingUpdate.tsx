import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
  ArrowLeft,
  Calendar,
  BedDouble,
  Sparkles,
  DollarSign,
  Save,
  X,
  Plus,
  Trash2,
  RefreshCw,
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import { bookingRoomApi } from '@/services/bookingRoomApi';
import { serviceBookingApi } from '@/services/serviceBookingApi';
import { roomApi } from '@/services/roomApi';
import { serviceApi } from '@/services/serviceApi';
import { roomAvailabilityApi } from '@/services/roomAvailabilityApi';
import type { Booking, BookingRoom, ServiceBooking } from '@/types/booking.types';
import type { Room } from '@/types/room.types';
import type { HotelService } from '@/types/service.types';

interface RoomChange {
  bookingRoomId: string;
  oldRoomId: string;
  newRoomId: string;
  oldPrice: number;
  newPrice: number;
}

interface ServiceChange {
  action: 'add' | 'update' | 'delete';
  serviceBookingId?: string;
  serviceId?: string;
  roomId?: string;
  quantity?: number;
  price?: number;
  dateTime?: string;
}

const BookingUpdatePage = () => {
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
  const [saving, setSaving] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // Form state
  const [checkin, setCheckin] = useState('');
  const [checkout, setCheckout] = useState('');
  const [specialRequest, setSpecialRequest] = useState('');
  const [bookingRooms, setBookingRooms] = useState<BookingRoom[]>([]);
  const [serviceBookings, setServiceBookings] = useState<ServiceBooking[]>([]);

  // Available options
  const [availableRooms, setAvailableRooms] = useState<Room[]>([]);
  const [availableServices, setAvailableServices] = useState<HotelService[]>([]);

  // Changes tracking
  const [roomChanges, setRoomChanges] = useState<RoomChange[]>([]);
  const [serviceChanges, setServiceChanges] = useState<ServiceChange[]>([]);

  useEffect(() => {
    if (id) {
      fetchBookingDetail();
    }
  }, [id]);

  useEffect(() => {
    // Refetch available rooms when checkin/checkout changes
    if (booking && checkin && checkout && (checkin !== booking.checkin || checkout !== booking.checkout)) {
      fetchAvailableRooms(booking.branchId, checkin, checkout);
    }
  }, [checkin, checkout, booking]);

  const fetchBookingDetail = async () => {
    try {
      setLoading(true);
      const response = await bookingApi.getById(id!);
      const bookingData = response.result;
      setBooking(bookingData);
      
      // Set form values
      setCheckin(bookingData.checkin);
      setCheckout(bookingData.checkout);
      setSpecialRequest(bookingData.specialRequest || '');
      setBookingRooms(bookingData.rooms || []);
      setServiceBookings(bookingData.services || []);

      // Fetch available rooms and services
      if (bookingData.branchId) {
        await Promise.all([
          fetchAvailableRooms(bookingData.branchId, bookingData.checkin, bookingData.checkout),
          fetchAvailableServices(bookingData.branchId),
        ]);
      }
    } catch (error: any) {
      toast.error('Không thể tải thông tin đặt phòng', {
        description: error.response?.data?.message || 'Vui lòng thử lại sau',
      });
      navigate(`${rolePrefix}/bookings`);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableRooms = async (branchId: string, checkinDate: string, checkoutDate: string) => {
    try {
      const response = await roomApi.getByBranch(branchId, { page: 0, size: 1000 });
      const allRooms = response.result?.content || [];
      
      // Check availability for each room
      const availableRoomsList: Room[] = [];
      for (const room of allRooms) {
        if (room.status === 'READY') {
          const availability = await roomAvailabilityApi.checkRoomAvailability(
            room.id,
            checkinDate,
            checkoutDate,
            id // Exclude current booking
          );
          if (availability.result) {
            availableRoomsList.push(room);
          }
        }
      }
      
      setAvailableRooms(availableRoomsList);
    } catch (error) {
      console.error('Failed to fetch available rooms:', error);
      toast.error('Không thể tải danh sách phòng');
    }
  };

  const fetchAvailableServices = async (branchId: string) => {
    try {
      const response = await serviceApi.search({
        hotelId: branchId,
        page: 0,
        size: 1000,
      });
      const services = response.result?.content || [];
      setAvailableServices(services.filter(s => s.active));
    } catch (error) {
      console.error('Failed to fetch services:', error);
      toast.error('Không thể tải danh sách dịch vụ');
    }
  };

  const handleRoomChange = (bookingRoomId: string, newRoomId: string) => {
    const bookingRoom = bookingRooms.find(br => br.id === bookingRoomId);
    if (!bookingRoom) return;

    const newRoom = availableRooms.find(r => r.id === newRoomId);
    if (!newRoom) return;

    const oldRoomId = bookingRoom.roomId;

    // Update booking rooms state
    setBookingRooms(prev => prev.map(br => 
      br.id === bookingRoomId 
        ? { ...br, roomId: newRoomId, roomNumber: newRoom.roomNumber, pricePerNight: newRoom.priceFinal || newRoom.basePrice }
        : br
    ));

    // Auto-update services from old room to new room
    // First, find services that need to be updated
    const affectedServices = serviceBookings.filter(sb => sb.roomId === oldRoomId);
    
    // Update service bookings state
    setServiceBookings(prev => prev.map(sb => {
      if (sb.roomId === oldRoomId) {
        return { 
          ...sb, 
          roomId: newRoomId, 
          roomNumber: newRoom.roomNumber 
        };
      }
      return sb;
    }));
    
    // Track service updates for affected services
    affectedServices.forEach(sb => {
      if (!sb.id.startsWith('temp-')) {
        // For existing services, track update
        setServiceChanges(prevChanges => {
          const existing = prevChanges.find(sc => 
            sc.serviceBookingId === sb.id && sc.action === 'update'
          );
          if (!existing) {
            return [...prevChanges, {
              action: 'update',
              serviceBookingId: sb.id,
              roomId: newRoomId,
            }];
          } else {
            return prevChanges.map(sc =>
              sc.serviceBookingId === sb.id && sc.action === 'update'
                ? { ...sc, roomId: newRoomId }
                : sc
            );
          }
        });
      } else {
        // For temp services, update the add action
        setServiceChanges(prevChanges => prevChanges.map(sc =>
          sc.action === 'add' && sc.serviceId === sb.serviceId && sc.roomId === oldRoomId
            ? { ...sc, roomId: newRoomId }
            : sc
        ));
      }
    });

    // Track change
    const existingChange = roomChanges.find(rc => rc.bookingRoomId === bookingRoomId);
    if (existingChange) {
      setRoomChanges(prev => prev.map(rc => 
        rc.bookingRoomId === bookingRoomId
          ? { ...rc, newRoomId, newPrice: newRoom.priceFinal || newRoom.basePrice }
          : rc
      ));
    } else {
      setRoomChanges(prev => [...prev, {
        bookingRoomId,
        oldRoomId: bookingRoom.roomId,
        newRoomId,
        oldPrice: bookingRoom.pricePerNight,
        newPrice: newRoom.priceFinal || newRoom.basePrice,
      }]);
    }
  };

  const handleServiceAdd = (serviceId: string, roomId: string) => {
    const service = availableServices.find(s => s.id === serviceId);
    if (!service) return;

    // Validate service price
    const servicePrice = service.basePrice && service.basePrice > 0 ? service.basePrice : service.priceFinal && service.priceFinal > 0 ? service.priceFinal : null;
    if (!servicePrice) {
      toast.error('Không thể thêm dịch vụ: Giá dịch vụ không hợp lệ');
      return;
    }

    const newServiceBooking: ServiceBooking = {
      id: `temp-${Date.now()}`,
      bookingId: id!,
      bookingCode: booking?.bookingCode || '',
      serviceId: service.id,
      serviceName: service.name,
      serviceType: service.categoryName || '',
      customerId: booking?.customerId || '',
      customerName: booking?.customerName || '',
      roomId,
      roomNumber: bookingRooms.find(br => br.roomId === roomId)?.roomNumber || '',
      dateTime: new Date().toISOString(),
      quantity: 1,
      price: servicePrice,
      status: 'PENDING',
    };

    setServiceBookings(prev => [...prev, newServiceBooking]);
    setServiceChanges(prev => [...prev, {
      action: 'add',
      serviceId,
      roomId,
      quantity: 1,
      price: servicePrice,
      dateTime: newServiceBooking.dateTime,
    }]);
  };

  const handleServiceDelete = (serviceBookingId: string) => {
    const serviceBooking = serviceBookings.find(sb => sb.id === serviceBookingId);
    if (!serviceBooking) return;

    // Remove from state
    setServiceBookings(prev => prev.filter(sb => sb.id !== serviceBookingId));

    // Track change
    if (serviceBookingId.startsWith('temp-')) {
      // Remove add action
      setServiceChanges(prev => prev.filter(sc => 
        !(sc.action === 'add' && sc.serviceId === serviceBooking.serviceId && sc.roomId === serviceBooking.roomId)
      ));
    } else {
      // Track delete action
      setServiceChanges(prev => [...prev, {
        action: 'delete',
        serviceBookingId,
      }]);
    }
  };

  const handleServiceUpdate = (serviceBookingId: string, updates: Partial<ServiceBooking>) => {
    setServiceBookings(prev => prev.map(sb => 
      sb.id === serviceBookingId ? { ...sb, ...updates } : sb
    ));

    // If this is a temporary service booking (not yet created), update the 'add' action instead
    if (serviceBookingId.startsWith('temp-')) {
      const serviceBooking = serviceBookings.find(sb => sb.id === serviceBookingId);
      if (serviceBooking) {
        // Update the 'add' action with new values
        setServiceChanges(prev => prev.map(sc => {
          if (sc.action === 'add' && sc.serviceId === serviceBooking.serviceId && sc.roomId === serviceBooking.roomId) {
            return {
              ...sc,
              quantity: updates.quantity !== undefined ? updates.quantity : sc.quantity,
              price: updates.price !== undefined ? updates.price : sc.price,
              dateTime: updates.dateTime || sc.dateTime,
            };
          }
          return sc;
        }));
      }
      return; // Don't track update for temp service bookings
    }

    // Track change for existing service bookings
    const existingChange = serviceChanges.find(sc => sc.serviceBookingId === serviceBookingId);
    if (existingChange && existingChange.action === 'update') {
      setServiceChanges(prev => prev.map(sc => 
        sc.serviceBookingId === serviceBookingId
          ? { ...sc, ...updates }
          : sc
      ));
    } else {
      setServiceChanges(prev => [...prev, {
        action: 'update',
        serviceBookingId,
        ...updates,
      }]);
    }
  };

  const calculatePriceDifference = () => {
    let difference = 0;

    // Room changes
    roomChanges.forEach(change => {
      const nights = calculateNights();
      const oldTotal = change.oldPrice * nights;
      const newTotal = change.newPrice * nights;
      difference += (newTotal - oldTotal);
    });

    // Service changes
    serviceChanges.forEach(change => {
      if (change.action === 'add' && change.price && change.quantity) {
        difference += change.price * change.quantity;
      } else if (change.action === 'delete') {
        const serviceBooking = booking?.services?.find(sb => sb.id === change.serviceBookingId);
        if (serviceBooking) {
          difference -= serviceBooking.price * serviceBooking.quantity;
        }
      } else if (change.action === 'update' && change.serviceBookingId) {
        const oldService = booking?.services?.find(sb => sb.id === change.serviceBookingId);
        const newService = serviceBookings.find(sb => sb.id === change.serviceBookingId);
        if (oldService && newService) {
          const oldTotal = oldService.price * oldService.quantity;
          const newTotal = newService.price * newService.quantity;
          difference += (newTotal - oldTotal);
        }
      }
    });

    return difference;
  };

  const calculateNights = () => {
    if (!checkin || !checkout) return 0;
    const checkinDate = new Date(checkin);
    const checkoutDate = new Date(checkout);
    const diffTime = Math.abs(checkoutDate.getTime() - checkinDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const calculateNewTotal = () => {
    if (!booking) return 0;
    const originalTotal = booking.totalPrice;
    const difference = calculatePriceDifference();
    return originalTotal + difference;
  };

  const handleSave = async () => {
    setShowConfirmDialog(true);
  };

  const handleConfirmSave = async () => {
    if (!booking || !id) return;

    // Validate dates
    if (!checkin || !checkout) {
      toast.error('Vui lòng nhập đầy đủ ngày check-in và check-out');
      return;
    }

    const checkinDate = new Date(checkin);
    const checkoutDate = new Date(checkout);
    if (checkoutDate <= checkinDate) {
      toast.error('Ngày check-out phải sau ngày check-in');
      return;
    }

    try {
      setSaving(true);
      setShowConfirmDialog(false);

      // 1. Handle room changes first (before updating booking)
      for (const change of roomChanges) {
        try {
          // Delete old booking room and create new one
          await bookingRoomApi.delete(change.bookingRoomId);
          await bookingRoomApi.create({
            bookingId: id,
            roomId: change.newRoomId,
            pricePerNight: change.newPrice,
            nights: calculateNights(),
          });
        } catch (error: any) {
          console.error('Error updating room:', error);
          throw new Error(`Không thể chuyển phòng: ${error.response?.data?.message || error.message}`);
        }
      }

      // 2. Handle service changes (including room updates from room changes)
      for (const change of serviceChanges) {
        try {
          if (change.action === 'add' && change.serviceId && change.roomId) {
            // Validate required fields
            const servicePrice = change.price && change.price > 0 ? change.price : undefined;
            const serviceQuantity = change.quantity && change.quantity > 0 ? change.quantity : 1;
            
            if (!servicePrice) {
              // Try to get price from available services
              const service = availableServices.find(s => s.id === change.serviceId);
              if (!service || !service.basePrice || service.basePrice <= 0) {
                throw new Error('Không thể thêm dịch vụ: Giá dịch vụ không hợp lệ');
              }
              await serviceBookingApi.create({
                bookingId: id,
                serviceId: change.serviceId,
                customerId: booking.customerId,
                roomId: change.roomId,
                dateTime: change.dateTime || new Date().toISOString(),
                quantity: serviceQuantity,
                price: service.basePrice,
              });
            } else {
              await serviceBookingApi.create({
                bookingId: id,
                serviceId: change.serviceId,
                customerId: booking.customerId,
                roomId: change.roomId,
                dateTime: change.dateTime || new Date().toISOString(),
                quantity: serviceQuantity,
                price: servicePrice,
              });
            }
          } else if (change.action === 'delete' && change.serviceBookingId) {
            await serviceBookingApi.delete(change.serviceBookingId);
          } else if (change.action === 'update' && change.serviceBookingId) {
            // Skip update for temporary service bookings (they should be created, not updated)
            if (change.serviceBookingId.startsWith('temp-')) {
              console.warn('Skipping update for temporary service booking:', change.serviceBookingId);
              continue;
            }
            
            const serviceBooking = serviceBookings.find(sb => sb.id === change.serviceBookingId);
            if (serviceBooking) {
              // Update service booking - include roomId if it was changed
              const updateData: any = {
                dateTime: change.dateTime || serviceBooking.dateTime,
                quantity: change.quantity !== undefined ? change.quantity : serviceBooking.quantity,
                price: change.price !== undefined ? change.price : serviceBooking.price,
                status: change.status || serviceBooking.status,
              };
              
              // Include roomId if it was changed
              if (change.roomId && change.roomId !== serviceBooking.roomId) {
                updateData.roomId = change.roomId;
              }
              
              await serviceBookingApi.update(change.serviceBookingId, updateData);
            } else {
              console.warn('Service booking not found for update:', change.serviceBookingId);
            }
          }
        } catch (error: any) {
          console.error('Error updating service:', error);
          throw new Error(`Không thể cập nhật dịch vụ: ${error.response?.data?.message || error.message}`);
        }
      }

      // 3. Update booking with ALL changes in ONE request to avoid NULL constraint violations
      // Format dates to ISO string (yyyy-MM-dd) for LocalDate
      const bookingUpdate: any = {};
      
      // Always include checkin and checkout (even if unchanged) to prevent NULL constraint violation
      const checkinDate = new Date(checkin);
      bookingUpdate.checkin = checkinDate.toISOString().split('T')[0];
      
      const checkoutDate = new Date(checkout);
      bookingUpdate.checkout = checkoutDate.toISOString().split('T')[0];
      
      // Include specialRequest if changed
      if (specialRequest !== (booking.specialRequest || '')) {
        bookingUpdate.specialRequest = specialRequest || undefined;
      }
      
      // Include totalPrice if changed
      const newTotal = calculateNewTotal();
      if (Math.abs(newTotal - booking.totalPrice) > 0.01) {
        bookingUpdate.totalPrice = newTotal;
      }
      
      // Always update booking (even if only dates) to ensure consistency
      console.log('Updating booking with:', bookingUpdate);
      await bookingApi.update(id, bookingUpdate);

      toast.success('Cập nhật booking thành công!');
      navigate(`${rolePrefix}/bookings/${id}`);
    } catch (error: any) {
      console.error('Booking update error:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error config:', error.config);
      
      let errorMessage = 'Vui lòng thử lại';
      if (error.response?.data) {
        if (error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.data.error) {
          errorMessage = error.response.data.error;
        } else if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        } else {
          // Try to extract validation errors
          const errors = error.response.data.errors || error.response.data;
          if (Array.isArray(errors) && errors.length > 0) {
            errorMessage = errors.map((e: any) => e.defaultMessage || e.message || e).join(', ');
          } else if (typeof errors === 'object') {
            errorMessage = Object.entries(errors)
              .map(([key, value]) => `${key}: ${value}`)
              .join(', ');
          }
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error('Cập nhật booking thất bại', {
        description: errorMessage,
      });
      setShowConfirmDialog(false);
    } finally {
      setSaving(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
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

  const priceDifference = calculatePriceDifference();
  const newTotal = calculateNewTotal();

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate(`${rolePrefix}/bookings/${id}`)}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Cập nhật đặt phòng
              </h1>
              <p className="text-gray-500 mt-1">Mã đặt phòng: {booking.bookingCode}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <Card>
              <CardHeader>
                <CardTitle>Thông tin cơ bản</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="checkin">Ngày nhận phòng</Label>
                    <Input
                      id="checkin"
                      type="date"
                      value={checkin}
                      disabled
                      className="bg-gray-100 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <Label htmlFor="checkout">Ngày trả phòng</Label>
                    <Input
                      id="checkout"
                      type="date"
                      value={checkout}
                      disabled
                      className="bg-gray-100 cursor-not-allowed"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="specialRequest">Yêu cầu đặc biệt</Label>
                  <Textarea
                    id="specialRequest"
                    value={specialRequest}
                    onChange={(e) => setSpecialRequest(e.target.value)}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Rooms */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BedDouble className="h-5 w-5" />
                  Phòng ({bookingRooms.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {bookingRooms.map((bookingRoom) => (
                  <div key={bookingRoom.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="font-medium">Phòng {bookingRoom.roomNumber}</p>
                        <p className="text-sm text-gray-500">{bookingRoom.roomTypeName || bookingRoom.roomType}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{formatCurrency(bookingRoom.pricePerNight)}</p>
                        <p className="text-sm text-gray-500">/ đêm</p>
                      </div>
                    </div>
                    <div>
                      <Label>Chuyển sang phòng khác</Label>
                      <Select
                        value={bookingRoom.roomId}
                        onValueChange={(value) => handleRoomChange(bookingRoom.id!, value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {availableRooms
                            .filter(r => r.roomTypeId === bookingRooms.find(br => br.id === bookingRoom.id)?.roomType || true)
                            .map((room) => (
                              <SelectItem key={room.id} value={room.id}>
                                {room.roomNumber} - {formatCurrency(room.priceFinal || room.basePrice)}/đêm
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Services */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  Dịch vụ ({serviceBookings.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {serviceBookings.map((serviceBooking) => (
                  <div key={serviceBooking.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="font-medium">{serviceBooking.serviceName}</p>
                        <p className="text-sm text-gray-500">
                          Phòng {serviceBooking.roomNumber} • {new Date(serviceBooking.dateTime).toLocaleString('vi-VN')}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          min="1"
                          value={serviceBooking.quantity}
                          onChange={(e) => handleServiceUpdate(serviceBooking.id, { quantity: parseInt(e.target.value) || 1 })}
                          className="w-20"
                        />
                        <span className="text-gray-500">x {formatCurrency(serviceBooking.price)}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleServiceDelete(serviceBooking.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Add Service */}
                <div className="p-4 border-2 border-dashed rounded-lg">
                  <Label>Thêm dịch vụ mới</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <Select onValueChange={(serviceId) => {
                      const firstRoomId = bookingRooms[0]?.roomId;
                      if (firstRoomId) {
                        handleServiceAdd(serviceId, firstRoomId);
                      } else {
                        toast.error('Vui lòng chọn phòng trước');
                      }
                    }}>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn dịch vụ" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableServices.map((service) => (
                          <SelectItem key={service.id} value={service.id}>
                            {service.name} - {formatCurrency(service.basePrice)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {bookingRooms.length > 1 && (
                      <Select onValueChange={(roomId) => {
                        // This will be used when adding service
                      }}>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn phòng" />
                        </SelectTrigger>
                        <SelectContent>
                          {bookingRooms.map((br) => (
                            <SelectItem key={br.roomId} value={br.roomId}>
                              Phòng {br.roomNumber}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Tổng quan thay đổi
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tổng cũ:</span>
                    <span className="font-medium">{formatCurrency(booking.totalPrice)}</span>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Chênh lệch:</span>
                    <span className={`font-medium ${priceDifference >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {priceDifference >= 0 ? '+' : ''}{formatCurrency(priceDifference)}
                    </span>
                  </div>

                  <Separator />

                  <div className="flex justify-between items-center pt-2">
                    <span className="text-lg font-semibold">Tổng mới:</span>
                    <span className="text-2xl font-bold text-green-600">
                      {formatCurrency(newTotal)}
                    </span>
                  </div>
                </div>

                <Separator />

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => navigate(`${rolePrefix}/bookings/${id}`)}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Hủy
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={handleSave}
                    disabled={saving}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Confirm Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận cập nhật booking</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div>
                <p className="mb-4">
                  Bạn có chắc chắn muốn cập nhật booking <strong>{booking.bookingCode}</strong>?
                </p>
                <div className="space-y-2 mt-4">
                  <div className="flex justify-between">
                    <span>Tổng cũ:</span>
                    <span className="font-medium">{formatCurrency(booking.totalPrice)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Chênh lệch:</span>
                    <span className={`font-medium ${priceDifference >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {priceDifference >= 0 ? '+' : ''}{formatCurrency(priceDifference)}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Tổng mới:</span>
                    <span className="text-green-600">{formatCurrency(newTotal)}</span>
                  </div>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={saving}>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmSave}
              disabled={saving}
              className="bg-green-600 hover:bg-green-700"
            >
              {saving ? 'Đang xử lý...' : 'Xác nhận cập nhật'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default BookingUpdatePage;

