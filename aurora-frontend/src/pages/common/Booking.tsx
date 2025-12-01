import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { roomTypeApi, roomApi, roomCategoryApi } from '@/services/roomApi';
import type { RoomType, Room, RoomCategory } from '@/types/room.types';
import { useAppSelector } from '@/hooks/useRedux';
import { toast } from 'sonner';
import { Loader2, ChevronLeft, Users, Maximize, Bed, Eye, X, Trash2, Calendar } from 'lucide-react';
import VideoHero from '@/components/custom/VideoHero';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { formatCurrency } from '@/utils/exportUtils';

interface BookingRoom {
  roomId: string;
  roomNumber: string;
  roomTypeId: string;
  roomTypeName: string;
  basePrice: number;
  imageUrl?: string;
}

interface BookingFilter {
  checkIn: string;
  checkOut: string;
  guests: number;
  category?: string;
  roomType?: string;
  priceRange?: string;
  viewType?: string;
}

export default function BookingPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const roomTypeId = searchParams.get('roomTypeId') || undefined;
  const categoryId = searchParams.get('categoryId') || undefined;

  const [categories, setCategories] = useState<RoomCategory[]>([]);
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [roomType, setRoomType] = useState<RoomType | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const currentBranch = useAppSelector((state) => state.branch.currentBranch);
  const branchId = currentBranch?.apiId || 'branch-hcm-001';
  
  // Booking state - Initialize from localStorage
  const [bookingRooms, setBookingRooms] = useState<BookingRoom[]>(() => {
    const saved = localStorage.getItem('bookingRooms');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to load booking data:', e);
        return [];
      }
    }
    return [];
  });
  
  const [filter, setFilter] = useState<BookingFilter>({
    checkIn: new Date().toISOString().split('T')[0],
    checkOut: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    guests: 2,
    category: categoryId || '',
    roomType: '',
    priceRange: '',
    viewType: '',
  });

  // Save to localStorage whenever bookingRooms changes
  useEffect(() => {
    localStorage.setItem('bookingRooms', JSON.stringify(bookingRooms));
  }, [bookingRooms]);

  // Fetch categories and ALL room types on mount
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [categoriesRes, allRoomTypesRes] = await Promise.all([
          roomCategoryApi.getByBranch(branchId),
          roomTypeApi.getByBranch(branchId)
        ]);
        
        if (categoriesRes.result) {
          setCategories(categoriesRes.result);
        }
        
        if (allRoomTypesRes.result) {
          setRoomTypes(allRoomTypesRes.result);
        }
      } catch (error) {
        console.error('Failed to fetch initial data:', error);
      }
    };
    fetchInitialData();
  }, [branchId]);

  // Set initial filter from URL params
  useEffect(() => {
    if (categoryId) {
      setFilter(prev => ({ ...prev, category: categoryId }));
    }
    if (roomTypeId) {
      setFilter(prev => ({ ...prev, roomType: roomTypeId }));
    }
  }, [categoryId, roomTypeId]);

  // Fetch ALL room types and rooms for the branch, then filter
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Step 1: Determine which room types to fetch
        let targetRoomTypes: RoomType[] = [];
        
        if (filter.category && filter.category !== 'all') {
          // Fetch room types for selected category
          const categoryRes = await roomCategoryApi.getByIdWithRoomTypes(filter.category);
          if (categoryRes.result?.roomTypes) {
            targetRoomTypes = categoryRes.result.roomTypes;
          }
        } else {
          // Fetch ALL room types for the branch
          const allRoomTypesRes = await roomTypeApi.getByBranch(branchId);
          if (allRoomTypesRes.result) {
            targetRoomTypes = allRoomTypesRes.result;
          }
        }
        
        // Step 2: Filter by specific room type if selected
        if (filter.roomType && filter.roomType !== 'all') {
          targetRoomTypes = targetRoomTypes.filter(rt => rt.id === filter.roomType);
        }
        
        // Step 3: Filter by price range
        if (filter.priceRange && filter.priceRange !== 'all') {
          const [minStr, maxStr] = filter.priceRange.split('-');
          const min = parseInt(minStr);
          const max = maxStr.includes('+') ? Infinity : parseInt(maxStr);
          targetRoomTypes = targetRoomTypes.filter(rt => rt.basePrice >= min && rt.basePrice <= max);
        }
        
        // Step 4: Fetch rooms for each room type
        const allRoomsPromises = targetRoomTypes.map(rt => 
          roomApi.getByRoomType(rt.id, { size: 100 })
        );
        const allRoomsResponses = await Promise.all(allRoomsPromises);
        
        // Step 5: Collect all available rooms with their room type info
        const roomsWithTypes: Array<{ room: Room; roomType: RoomType }> = [];
        allRoomsResponses.forEach((roomsRes, index) => {
          if (roomsRes.result?.content) {
            const availableRooms = roomsRes.result.content.filter(r => r.status === 'AVAILABLE');
            availableRooms.forEach(room => {
              roomsWithTypes.push({ room, roomType: targetRoomTypes[index] });
            });
          }
        });
        
        // Step 6: Filter by view type
        let filteredRoomsWithTypes = roomsWithTypes;
        if (filter.viewType && filter.viewType !== 'all') {
          filteredRoomsWithTypes = filteredRoomsWithTypes.filter(
            ({ room }) => room.viewType === filter.viewType
          );
        }
        
        // Step 7: Group by room type and take one representative room per type
        const roomTypeMap = new Map<string, { room: Room; roomType: RoomType }>();
        filteredRoomsWithTypes.forEach(item => {
          if (!roomTypeMap.has(item.roomType.id)) {
            roomTypeMap.set(item.roomType.id, item);
          }
        });
        
        // Convert to array and set state
        const finalRooms = Array.from(roomTypeMap.values());
        setRooms(finalRooms.map(item => item.room));
        
        // Set roomType for display (if only one type selected)
        if (finalRooms.length === 1) {
          setRoomType(finalRooms[0].roomType);
        } else {
          setRoomType(null);
        }
        
      } catch (error) {
        console.error('Failed to fetch data:', error);
        toast.error('Không thể tải thông tin phòng');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [filter.category, filter.roomType, filter.viewType, filter.priceRange, branchId]);

  const handleViewImages = (room: Room) => {
    setSelectedRoom(room);
    setCurrentImageIndex(0);
    setIsModalOpen(true);
  };

  const handleAddRoom = (room: Room, currentRoomType?: RoomType) => {
    const typeToUse = currentRoomType || roomType;
    if (!typeToUse) {
      toast.error('Không tìm thấy thông tin loại phòng');
      return;
    }
    
    // Check if room already in booking
    if (bookingRooms.find(br => br.roomId === room.id)) {
      toast.warning('Phòng này đã được thêm vào danh sách đặt');
      return;
    }

    const newBookingRoom: BookingRoom = {
      roomId: room.id,
      roomNumber: room.roomNumber || typeToUse.name,
      roomTypeId: typeToUse.id,
      roomTypeName: typeToUse.name,
      basePrice: typeToUse.basePrice,
      imageUrl: room.images?.[0] || typeToUse.images?.[0],
    };

    setBookingRooms(prev => [...prev, newBookingRoom]);
    toast.success('Đã thêm phòng vào danh sách đặt');
  };

  const handleRemoveRoom = (roomId: string) => {
    setBookingRooms(prev => prev.filter(r => r.roomId !== roomId));
    toast.success('Đã xóa phòng khỏi danh sách');
  };

  const handleClearBooking = () => {
    setBookingRooms([]);
    localStorage.removeItem('bookingRooms');
    toast.success('Đã xóa toàn bộ danh sách đặt phòng');
  };

  const handleProceedToPayment = () => {
    if (bookingRooms.length === 0) {
      toast.error('Vui lòng chọn ít nhất một phòng');
      return;
    }
    
    // TODO: Navigate to payment/checkout page
    toast.info('Chức năng thanh toán đang được phát triển');
  };

  const handleSearch = () => {
    // Trigger re-fetch by updating a dummy state or just show toast
    toast.info('Đang tìm kiếm phòng phù hợp...');
    // The useEffect will automatically trigger based on filter changes
  };

  const getRoomStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; className: string }> = {
      AVAILABLE: { label: 'Trống', className: 'bg-green-100 text-green-800' },
      OCCUPIED: { label: 'Có khách', className: 'bg-blue-100 text-blue-800' },
      RESERVED: { label: 'Đã đặt', className: 'bg-yellow-100 text-yellow-800' },
      CLEANING: { label: 'Đang dọn', className: 'bg-purple-100 text-purple-800' },
      MAINTENANCE: { label: 'Bảo trì', className: 'bg-red-100 text-red-800' },
    };
    
    const config = statusConfig[status] || { label: status, className: 'bg-gray-100 text-gray-800' };
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const calculateTotalPrice = () => {
    return bookingRooms.reduce((sum, room) => sum + room.basePrice, 0);
  };

  const calculateNights = () => {
    const checkIn = new Date(filter.checkIn);
    const checkOut = new Date(filter.checkOut);
    const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays || 1;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  // Don't show error if no roomTypeId - this is a valid state for browsing all rooms
  const pageTitle = roomType?.name || 'Tìm phòng';

  const nights = calculateNights();
  const totalPrice = calculateTotalPrice() * nights;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <VideoHero
        title={pageTitle}
        subtitle="Tìm và đặt phòng khách sạn phù hợp với nhu cầu của bạn"
      />

      {/* Filter Section */}
      <div className="bg-white border-b py-6">
        <div className="container mx-auto px-4">
          <div className="mb-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate(categoryId ? `/accommodation/${categoryId}` : '/accommodation')}
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Quay lại
            </Button>
          </div>
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-8 gap-4">
              <div>
                <Label htmlFor="category">Hạng phòng</Label>
                <Select
                  value={filter.category || "all"}
                  onValueChange={(value) => {
                    setFilter(prev => ({ 
                      ...prev, 
                      category: value === "all" ? "" : value,
                      roomType: '' // Reset room type when category changes
                    }));
                  }}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Tất cả" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="checkIn">Check-in</Label>
                <Input
                  id="checkIn"
                  type="date"
                  value={filter.checkIn}
                  onChange={(e) => setFilter(prev => ({ ...prev, checkIn: e.target.value }))}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div>
                <Label htmlFor="checkOut">Check-out</Label>
                <Input
                  id="checkOut"
                  type="date"
                  value={filter.checkOut}
                  onChange={(e) => setFilter(prev => ({ ...prev, checkOut: e.target.value }))}
                  min={filter.checkIn}
                />
              </div>
              <div>
                <Label htmlFor="guests">Guests</Label>
                <Input
                  id="guests"
                  type="number"
                  value={filter.guests}
                  onChange={(e) => setFilter(prev => ({ ...prev, guests: parseInt(e.target.value) || 1 }))}
                  min={1}
                  max={roomType?.maxOccupancy || 10}
                />
              </div>
              <div>
                <Label htmlFor="roomType">Loại phòng</Label>
                <Select
                  value={filter.roomType || "all"}
                  onValueChange={(value) => setFilter(prev => ({ ...prev, roomType: value === "all" ? "" : value }))}
                >
                  <SelectTrigger id="roomType">
                    <SelectValue placeholder="Tất cả" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    {roomTypes
                      .filter(rt => !filter.category || filter.category === 'all' || rt.categoryId === filter.category)
                      .map((rt) => (
                        <SelectItem key={rt.id} value={rt.id}>
                          {rt.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="viewType">View</Label>
                <Select
                  value={filter.viewType || "all"}
                  onValueChange={(value) => setFilter(prev => ({ ...prev, viewType: value === "all" ? "" : value }))}
                >
                  <SelectTrigger id="viewType">
                    <SelectValue placeholder="Tất cả" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="CITY">City View</SelectItem>
                    <SelectItem value="RIVER">River View</SelectItem>
                    <SelectItem value="SEA">Sea View</SelectItem>
                    <SelectItem value="GARDEN">Garden View</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="priceRange">Giá</Label>
                <Select
                  value={filter.priceRange || "all"}
                  onValueChange={(value) => setFilter(prev => ({ ...prev, priceRange: value === "all" ? "" : value }))}
                >
                  <SelectTrigger id="priceRange">
                    <SelectValue placeholder="Tất cả" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="0-2000000">Dưới 2 triệu</SelectItem>
                    <SelectItem value="2000000-5000000">2 - 5 triệu</SelectItem>
                    <SelectItem value="5000000-10000000">5 - 10 triệu</SelectItem>
                    <SelectItem value="10000000+">Trên 10 triệu</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  onClick={handleSearch}
                >
                  Tìm kiếm
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Room List */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                {loading ? (
                  <Card className="p-8 text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                    <p className="text-gray-500">Đang tải phòng...</p>
                  </Card>
                ) : rooms.length === 0 ? (
                  <Card className="p-8 text-center">
                    <p className="text-gray-500">Không tìm thấy phòng phù hợp với tiêu chí tìm kiếm</p>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {rooms.map((room) => {
                      // Find the corresponding room type for this room
                      const currentRoomType = roomTypes.find(rt => rt.id === room.roomTypeId) || roomType;
                      if (!currentRoomType) return null;
                      
                      return (
                      <Card key={room.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                        <div className="flex flex-col md:flex-row">
                          {/* Image */}
                          <div className="md:w-64 flex-shrink-0 relative group">
                            <img
                              src={room.images?.[0] || currentRoomType.images?.[0] || "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&h=600&fit=crop"}
                              alt={currentRoomType.name}
                              className="w-full h-48 md:h-full object-cover"
                            />
                            <Button
                              variant="secondary"
                              size="sm"
                              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => handleViewImages(room)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              Xem ảnh
                            </Button>
                          </div>

                          {/* Content */}
                          <CardContent className="flex-grow p-4">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <h3 className="text-xl font-bold text-gray-800">{currentRoomType.name}</h3>
                                <p className="text-sm text-gray-600">{currentRoomType.shortDescription}</p>
                              </div>
                              {getRoomStatusBadge(room.status)}
                            </div>

                            <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
                              <div className="flex items-center text-gray-700">
                                <Maximize className="h-4 w-4 mr-2 text-amber-600" />
                                <span>{currentRoomType.sizeM2}m²</span>
                              </div>
                              <div className="flex items-center text-gray-700">
                                <Users className="h-4 w-4 mr-2 text-amber-600" />
                                <span>{currentRoomType.maxOccupancy} người</span>
                              </div>
                              {currentRoomType.bedType && (
                                <div className="flex items-center text-gray-700">
                                  <Bed className="h-4 w-4 mr-2 text-amber-600" />
                                  <span>{currentRoomType.bedType} x{currentRoomType.numberOfBeds || 1}</span>
                                </div>
                              )}
                              <div className="flex items-center text-gray-700">
                                <span className="text-sm font-medium">View: {room.viewType || 'City'}</span>
                              </div>
                            </div>

                            <div className="flex items-center justify-between pt-3 border-t">
                              <div>
                                <p className="text-sm text-gray-500">Giá</p>
                                <p className="text-2xl font-bold text-amber-600">
                                  {formatCurrency(currentRoomType.basePrice)}
                                  <span className="text-sm text-gray-500 font-normal">/đêm</span>
                                </p>
                              </div>
                              <Button
                                onClick={() => handleAddRoom(room, currentRoomType)}
                                disabled={bookingRooms.some(br => br.roomId === room.id)}
                                className="bg-amber-600 hover:bg-amber-700"
                              >
                                {bookingRooms.some(br => br.roomId === room.id) ? 'Đã chọn' : 'Chọn phòng'}
                              </Button>
                            </div>
                          </CardContent>
                        </div>
                      </Card>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Right: Booking Summary (Sticky) */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24 p-6">
                <h3 className="text-xl font-bold mb-4">Booking summary</h3>
                
                {/* Booking Info */}
                <div className="space-y-3 mb-4 pb-4 border-b">
                  <div className="flex items-center text-sm">
                    <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                    <div>
                      <p className="text-gray-600">Check-in</p>
                      <p className="font-semibold">{new Date(filter.checkIn).toLocaleDateString('vi-VN')}</p>
                    </div>
                  </div>
                  <div className="flex items-center text-sm">
                    <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                    <div>
                      <p className="text-gray-600">Check-out</p>
                      <p className="font-semibold">{new Date(filter.checkOut).toLocaleDateString('vi-VN')}</p>
                    </div>
                  </div>
                  <div className="flex items-center text-sm">
                    <Users className="h-4 w-4 mr-2 text-gray-500" />
                    <div>
                      <p className="text-gray-600">Guests</p>
                      <p className="font-semibold">{filter.guests} người</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{nights} đêm</p>
                </div>

                {/* Selected Rooms */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">Phòng đã chọn ({bookingRooms.length})</h4>
                    {bookingRooms.length > 0 && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={handleClearBooking}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  {bookingRooms.length === 0 ? (
                    <p className="text-sm text-gray-500 italic">Chưa chọn phòng nào</p>
                  ) : (
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {bookingRooms.map((room) => (
                        <div key={room.roomId} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                          {room.imageUrl && (
                            <img 
                              src={room.imageUrl} 
                              alt={room.roomTypeName}
                              className="w-12 h-12 object-cover rounded"
                            />
                          )}
                          <div className="flex-grow">
                            <p className="text-sm font-medium">{room.roomTypeName}</p>
                            <p className="text-xs text-gray-600">{formatCurrency(room.basePrice)}/đêm</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveRoom(room.roomId)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-2 mb-4 pb-4 border-t pt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tổng giá phòng</span>
                    <span>{formatCurrency(calculateTotalPrice())}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Số đêm</span>
                    <span>x {nights}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-2 border-t">
                    <span>Total</span>
                    <span className="text-amber-600">{formatCurrency(totalPrice)}</span>
                  </div>
                </div>

                {/* Actions */}
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700" 
                  size="lg"
                  onClick={handleProceedToPayment}
                  disabled={bookingRooms.length === 0}
                >
                  Tiếp tục thanh toán
                </Button>
                
                <p className="text-xs text-center text-gray-500 mt-3">
                  * Giá có thể thay đổi tùy theo ngày
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Image Gallery Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="text-2xl">
              {roomType?.name || 'Chi tiết phòng'}
            </DialogTitle>
          </DialogHeader>
          
          {selectedRoom && roomType && (
            <div className="space-y-4 p-6">
              {/* Image Gallery */}
              <div className="relative">
                <img
                  src={
                    (selectedRoom.images?.[currentImageIndex] || 
                    roomType.images?.[currentImageIndex] || 
                    selectedRoom.images?.[0] || 
                    roomType.images?.[0] || 
                    "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=1200&h=800&fit=crop")
                  }
                  alt={`${roomType.name} - Ảnh ${currentImageIndex + 1}`}
                  className="w-full h-96 object-cover rounded-lg"
                />
                
                {/* Image Navigation */}
                {((selectedRoom.images?.length || 0) > 1 || (roomType.images?.length || 0) > 1) && (
                  <div className="absolute inset-0 flex items-center justify-between p-4">
                    <Button
                      variant="secondary"
                      size="icon"
                      onClick={() => setCurrentImageIndex(prev => 
                        prev === 0 ? ((selectedRoom.images?.length || roomType.images?.length || 1) - 1) : prev - 1
                      )}
                      className="bg-black/50 hover:bg-black/70 text-white"
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </Button>
                    <Button
                      variant="secondary"
                      size="icon"
                      onClick={() => setCurrentImageIndex(prev => 
                        prev === ((selectedRoom.images?.length || roomType.images?.length || 1) - 1) ? 0 : prev + 1
                      )}
                      className="bg-black/50 hover:bg-black/70 text-white"
                    >
                      <ChevronLeft className="h-6 w-6 rotate-180" />
                    </Button>
                  </div>
                )}
                
                <Badge className="absolute bottom-4 right-4 bg-black/70 text-white">
                  {currentImageIndex + 1} / {selectedRoom.images?.length || roomType.images?.length || 1}
                </Badge>
              </div>

              {/* Thumbnail Gallery */}
              {((selectedRoom.images?.length || 0) > 1 || (roomType.images?.length || 0) > 1) && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {(selectedRoom.images || roomType.images || []).map((img: string, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                        currentImageIndex === idx ? 'border-amber-500 scale-105' : 'border-gray-300'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`Thumbnail ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
              
              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3">Thông tin phòng</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <Maximize className="h-5 w-5 mr-2 text-amber-600" />
                    <div>
                      <p className="text-sm text-gray-500">Diện tích</p>
                      <p className="font-semibold">{roomType.sizeM2}m²</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-5 w-5 mr-2 text-amber-600" />
                    <div>
                      <p className="text-sm text-gray-500">Sức chứa</p>
                      <p className="font-semibold">{roomType.maxOccupancy} người</p>
                    </div>
                  </div>
                  {roomType.bedType && (
                    <div className="flex items-center">
                      <Bed className="h-5 w-5 mr-2 text-amber-600" />
                      <div>
                        <p className="text-sm text-gray-500">Giường</p>
                        <p className="font-semibold">{roomType.bedType} x{roomType.numberOfBeds || 1}</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center">
                    <div>
                      <p className="text-sm text-gray-500">View</p>
                      <p className="font-semibold">{selectedRoom.viewType || 'City View'}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {roomType.amenities && roomType.amenities.length > 0 && (
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-3">Tiện nghi</h4>
                  <div className="flex flex-wrap gap-2">
                    {roomType.amenities.map((amenity) => (
                      <Badge key={amenity.id} variant="outline" className="px-3 py-1">
                        {amenity.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Giá phòng</p>
                    <p className="text-2xl font-bold text-amber-600">
                      {formatCurrency(roomType.basePrice)}
                      <span className="text-sm text-gray-500 font-normal">/đêm</span>
                    </p>
                  </div>
                  {getRoomStatusBadge(selectedRoom.status)}
                </div>
                
                <Button 
                  className="w-full bg-amber-600 hover:bg-amber-700"
                  onClick={() => {
                    handleAddRoom(selectedRoom);
                    setIsModalOpen(false);
                  }}
                  disabled={bookingRooms.some(br => br.roomId === selectedRoom.id)}
                >
                  {bookingRooms.some(br => br.roomId === selectedRoom.id) ? 'Đã chọn' : 'Chọn phòng này'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

