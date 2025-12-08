import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { roomTypeApi, roomApi, roomCategoryApi } from "@/services/roomApi";
import roomAvailabilityApi from "@/services/roomAvailabilityApi";
import type { RoomType, Room, RoomCategory } from "@/types/room.types";
import { toast } from "sonner";
import {
  Loader2,
  ChevronLeft,
} from "lucide-react";
import VideoHero from "@/components/custom/VideoHero";
import { RoomCard, BookingSummary, RoomDetailModal } from "@/components/booking";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  const roomTypeId = searchParams.get("roomTypeId") || undefined;
  const categoryId = searchParams.get("categoryId") || undefined;

  // Detect current role prefix from URL
  const currentPath = window.location.pathname;
  const rolePrefix = currentPath.startsWith('/admin') ? '/admin' 
    : currentPath.startsWith('/manager') ? '/manager'
    : currentPath.startsWith('/staff') ? '/staff'
    : '';

  const [categories, setCategories] = useState<RoomCategory[]>([]);
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [roomType, setRoomType] = useState<RoomType | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [availableRoomIds, setAvailableRoomIds] = useState<Set<string>>(new Set());
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [currentRoomType, setCurrentRoomType] = useState<RoomType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Get branchId from localStorage
  const branchId = localStorage.getItem("branchId") || "branch-hcm-001";

  // Booking state - Initialize from localStorage
  const [bookingRooms, setBookingRooms] = useState<BookingRoom[]>(() => {
    const saved = localStorage.getItem("bookingRooms");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to load booking data:", e);
        return [];
      }
    }
    return [];
  });

  const [filter, setFilter] = useState<BookingFilter>({
    checkIn: new Date().toISOString().split("T")[0],
    checkOut: new Date(Date.now() + 86400000).toISOString().split("T")[0],
    guests: 2,
    category: "all",
    roomType: "all",
    priceRange: "all",
    viewType: "all",
  });

  // Save to localStorage whenever bookingRooms changes
  useEffect(() => {
    localStorage.setItem("bookingRooms", JSON.stringify(bookingRooms));
  }, [bookingRooms]);

  // Fetch categories and ALL room types on mount
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [categoriesRes, allRoomTypesRes] = await Promise.all([
          roomCategoryApi.getByBranch(branchId),
          roomTypeApi.getByBranch(branchId),
        ]);

        if (categoriesRes.result) {
          setCategories(categoriesRes.result);
        }

        if (allRoomTypesRes.result) {
          setRoomTypes(allRoomTypesRes.result);
        }
      } catch (error) {
        console.error("Failed to fetch initial data:", error);
      }
    };
    fetchInitialData();
  }, [branchId]);

  // Set initial filter from URL params (only if provided)
  useEffect(() => {
    if (categoryId || roomTypeId) {
      setFilter((prev) => ({
        ...prev,
        category: categoryId || "all",
        roomType: roomTypeId || "all",
      }));
    }
  }, [categoryId, roomTypeId]);

  // Fetch rooms based on cascading filter
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Step 1: Determine which room types to fetch based on filter
        let targetRoomTypes: RoomType[] = [];

        if (filter.category && filter.category !== "all") {
          // If category is selected, only get room types from that category
          targetRoomTypes = roomTypes.filter(
            (rt) => rt.categoryId === filter.category
          );

          // If specific room type is selected, filter further
          if (filter.roomType && filter.roomType !== "all") {
            targetRoomTypes = targetRoomTypes.filter(
              (rt) => rt.id === filter.roomType
            );
          }
        } else {
          // If no category selected (all), get all room types
          targetRoomTypes = roomTypes;

          // Even with all categories, if specific room type is selected, use it
          if (filter.roomType && filter.roomType !== "all") {
            targetRoomTypes = targetRoomTypes.filter(
              (rt) => rt.id === filter.roomType
            );
          }
        }

        // Step 2: Filter by price range
        if (filter.priceRange && filter.priceRange !== "all") {
          const [minStr, maxStr] = filter.priceRange.split("-");
          const min = parseInt(minStr);
          const max = maxStr.includes("+") ? Infinity : parseInt(maxStr);
          targetRoomTypes = targetRoomTypes.filter(
            (rt) => rt.priceFrom >= min && rt.priceFrom <= max
          );
        }

        // Step 3: Fetch rooms for each room type
        const allRoomsPromises = targetRoomTypes.map((rt) =>
          roomApi.getByRoomType(rt.id, { size: 100 })
        );
        const allRoomsResponses = await Promise.all(allRoomsPromises);

        // Step 4: Collect all available rooms with their room type info
        const roomsWithTypes: Array<{ room: Room; roomType: RoomType }> = [];
        allRoomsResponses.forEach((roomsRes, index) => {
          if (roomsRes.result?.content) {
            const availableRooms = roomsRes.result.content.filter(
              (r) => r.status === "READY"
            );
            availableRooms.forEach((room) => {
              roomsWithTypes.push({ room, roomType: targetRoomTypes[index] });
            });
          }
        });

        // Step 5: Filter by view type
        let filteredRoomsWithTypes = roomsWithTypes;
        if (filter.viewType && filter.viewType !== "all") {
          filteredRoomsWithTypes = filteredRoomsWithTypes.filter(
            ({ room }) => room.viewType === filter.viewType
          );
        }

        // Step 6: Display all rooms (removed grouping logic to show all rooms)
        // Convert to array and set state
        setRooms(filteredRoomsWithTypes.map((item) => item.room));

        // Set roomType for display (if only one type exists in the filtered results)
        const uniqueRoomTypes = new Set(filteredRoomsWithTypes.map((item) => item.roomType.id));
        if (uniqueRoomTypes.size === 1) {
          setRoomType(filteredRoomsWithTypes[0].roomType);
        } else {
          setRoomType(null);
        }

        // Check availability for all rooms
        await checkRoomAvailability(filteredRoomsWithTypes.map((item) => item.room));
      } catch (error) {
        console.error("Failed to fetch data:", error);
        toast.error("Không thể tải thông tin phòng");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [
    filter.category,
    filter.roomType,
    filter.viewType,
    filter.priceRange,
    roomTypes,
  ]);

  // Check room availability when dates change
  useEffect(() => {
    if (rooms.length > 0) {
      checkRoomAvailability(rooms);
    }
  }, [filter.checkIn, filter.checkOut]);

  // Function to check room availability
  const checkRoomAvailability = async (roomsToCheck: Room[]) => {
    if (!filter.checkIn || !filter.checkOut || roomsToCheck.length === 0) {
      return;
    }

    try {
      setCheckingAvailability(true);
      const roomIds = roomsToCheck.map((room) => room.id);

      const response = await roomAvailabilityApi.checkMultipleRooms(
        roomIds,
        filter.checkIn,
        filter.checkOut
      );

      if (response.result) {
        // Create a set of available room IDs
        const availableIds = new Set<string>();
        Object.entries(response.result).forEach(([roomId, isAvailable]) => {
          if (isAvailable) {
            availableIds.add(roomId);
          }
        });
        setAvailableRoomIds(availableIds);
      }
    } catch (error) {
      console.error("Failed to check room availability:", error);
      // On error, assume all rooms are available to avoid blocking user
      setAvailableRoomIds(new Set(roomsToCheck.map((r) => r.id)));
    } finally {
      setCheckingAvailability(false);
    }
  };

  const handleViewImages = (room: Room) => {
    // Find the roomType for this specific room
    const roomTypeForRoom = roomTypes.find((rt) => rt.id === room.roomTypeId);

    setSelectedRoom(room);
    setCurrentRoomType(roomTypeForRoom || null);
    setIsModalOpen(true);
  };

  const getRoomStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; className: string }> = {
      AVAILABLE: { label: "Trống", className: "bg-green-100 text-green-800" },
      OCCUPIED: { label: "Có khách", className: "bg-blue-100 text-blue-800" },
      RESERVED: { label: "Đã đặt", className: "bg-yellow-100 text-yellow-800" },
      CLEANING: {
        label: "Đang dọn",
        className: "bg-purple-100 text-purple-800",
      },
      MAINTENANCE: { label: "Bảo trì", className: "bg-red-100 text-red-800" },
    };

    const config = statusConfig[status] || {
      label: status,
      className: "bg-gray-100 text-gray-800",
    };
    return <Badge className={config.className}>{config.label}</Badge>;
  };


  const handleAddRoom = (room: Room, currentRoomType?: RoomType) => {
    const typeToUse = currentRoomType || roomType;
    if (!typeToUse) {
      toast.error("Không tìm thấy thông tin loại phòng");
      return;
    }

    // Check if room is available
    if (!availableRoomIds.has(room.id)) {
      toast.error("Phòng này đã được đặt trong khoảng thời gian bạn chọn. Vui lòng chọn phòng khác hoặc thay đổi ngày.");
      return;
    }

    // Check if room already in booking
    if (bookingRooms.find((br) => br.roomId === room.id)) {
      toast.warning("Phòng này đã được thêm vào danh sách đặt");
      return;
    }

    const newBookingRoom: BookingRoom = {
      roomId: room.id,
      roomNumber: room.roomNumber || typeToUse.name,
      roomTypeId: typeToUse.id,
      roomTypeName: typeToUse.name,
      basePrice: room.priceFinal,
      imageUrl: room.images?.[0] || typeToUse.imageUrl,
    };

    setBookingRooms((prev) => [...prev, newBookingRoom]);
    toast.success("Đã thêm phòng vào danh sách đặt");
  };

  const handleRemoveRoom = (roomId: string) => {
    setBookingRooms((prev) => prev.filter((r) => r.roomId !== roomId));
    toast.success("Đã xóa phòng khỏi danh sách");
  };

  const handleClearBooking = () => {
    setBookingRooms([]);
    localStorage.removeItem("bookingRooms");
    toast.success("Đã xóa toàn bộ danh sách đặt phòng");
  };

  const handleProceedToPayment = () => {
    if (bookingRooms.length === 0) {
      toast.error("Vui lòng chọn ít nhất một phòng");
      return;
    }

    // Save filter to localStorage for checkout
    localStorage.setItem("bookingFilter", JSON.stringify(filter));
    
    // Navigate to checkout page with correct prefix
    navigate(`${rolePrefix}/booking/checkout`);
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
  const pageTitle = roomType?.name || "Tìm phòng";

  const nights = calculateNights();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section - Only show for client */}
      {!rolePrefix && (
        <VideoHero
          title={pageTitle}
          subtitle="Tìm và đặt phòng khách sạn phù hợp với nhu cầu của bạn"
        />
      )}

      {/* Filter Section */}
      <div className="bg-white border-b py-6">
        <div className="container mx-auto px-4">
          <div className="mb-4">
            <Button
              variant="ghost"
              onClick={() => {
                // If in admin/staff/manager, go back to previous page
                if (rolePrefix) {
                  navigate(-1);
                } else {
                  // For client, navigate to accommodation
                  navigate(
                    categoryId ? `/accommodation/${categoryId}` : "/accommodation"
                  );
                }
              }}
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Quay lại
            </Button>
          </div>
          <div className="max-w-full mx-auto">
            <div className="flex flex-wrap gap-3">
              <div className="flex-1 min-w-[140px] max-w-[200px]">
                <Label htmlFor="checkIn">Check-in</Label>
                <Input
                  id="checkIn"
                  type="date"
                  value={filter.checkIn}
                  onChange={(e) => {
                    const newCheckIn = e.target.value;
                    
                    // Check if new checkin is after or equal to checkout
                    if (newCheckIn >= filter.checkOut) {
                      toast.error("Ngày nhận phòng phải trước ngày trả phòng ít nhất 1 ngày");
                      return;
                    }
                    
                    setFilter((prev) => ({
                      ...prev,
                      checkIn: newCheckIn,
                    }));
                  }}
                  min={new Date().toISOString().split("T")[0]}
                  max={(() => {
                    const maxDate = new Date(filter.checkOut);
                    maxDate.setDate(maxDate.getDate() - 1);
                    return maxDate.toISOString().split("T")[0];
                  })()}
                  className="w-full"
                />
              </div>
              <div className="flex-1 min-w-[140px] max-w-[200px]">
                <Label htmlFor="checkOut">Check-out</Label>
                <Input
                  id="checkOut"
                  type="date"
                  value={filter.checkOut}
                  onChange={(e) => {
                    const newCheckOut = e.target.value;
                    if (newCheckOut <= filter.checkIn) {
                      toast.error("Ngày trả phòng phải sau ngày nhận phòng ít nhất 1 ngày");
                      return;
                    }
                    setFilter((prev) => ({ ...prev, checkOut: newCheckOut }));
                  }}
                  min={(() => {
                    const minDate = new Date(filter.checkIn);
                    minDate.setDate(minDate.getDate() + 1);
                    return minDate.toISOString().split("T")[0];
                  })()}
                  className="w-full"
                />
              </div>
              <div className="flex-1 min-w-[160px] max-w-[220px]">
                <Label htmlFor="category" className="truncate block">
                  Hạng phòng
                </Label>
                <Select
                  value={filter.category}
                  onValueChange={(value) => {
                    // When category changes, reset room type to 'all'
                    setFilter((prev) => ({
                      ...prev,
                      category: value,
                      roomType: "all", // Reset room type when category changes
                    }));
                  }}
                >
                  <SelectTrigger id="category" className="w-full truncate">
                    <SelectValue placeholder="Tất cả" className="truncate" />
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
              <div className="flex-1 min-w-[180px] max-w-[250px]">
                <Label htmlFor="roomType" className="truncate block">
                  Loại phòng
                </Label>
                <Select
                  value={filter.roomType}
                  onValueChange={(value) =>
                    setFilter((prev) => ({ ...prev, roomType: value }))
                  }
                  disabled={filter.category === "all"}
                >
                  <SelectTrigger
                    id="roomType"
                    className={`w-full truncate ${
                      filter.category === "all"
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    <SelectValue placeholder="Tất cả" className="truncate" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    {roomTypes
                      .filter((rt) => rt.categoryId === filter.category)
                      .map((rt) => (
                        <SelectItem key={rt.id} value={rt.id}>
                          {rt.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                {filter.category === "all" && (
                  <p className="text-xs text-gray-500 mt-1">
                    Chọn hạng phòng trước
                  </p>
                )}
              </div>
              <div className="flex-1 min-w-[120px] max-w-[160px]">
                <Label htmlFor="viewType" className="truncate block">
                  View
                </Label>
                <Select
                  value={filter.viewType || "all"}
                  onValueChange={(value) =>
                    setFilter((prev) => ({ ...prev, viewType: value }))
                  }
                >
                  <SelectTrigger id="viewType" className="w-full truncate">
                    <SelectValue placeholder="Tất cả" className="truncate" />
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
              <div className="flex-1 min-w-[120px] max-w-[160px]">
                <Label htmlFor="guests" className="truncate block">
                  Guest
                </Label>
                <Select
                  value={filter.guests.toString()}
                  onValueChange={(value) =>
                    setFilter((prev) => ({ ...prev, guests: parseInt(value) }))
                  }
                >
                  <SelectTrigger id="guests" className="w-full truncate">
                    <SelectValue placeholder="Số khách" className="truncate" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num} {num === 1 ? "người" : "người"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1 min-w-[140px] max-w-[180px]">
                <Label htmlFor="priceRange" className="truncate block">
                  Giá
                </Label>
                <Select
                  value={filter.priceRange || "all"}
                  onValueChange={(value) =>
                    setFilter((prev) => ({ ...prev, priceRange: value }))
                  }
                >
                  <SelectTrigger id="priceRange" className="w-full truncate">
                    <SelectValue placeholder="Tất cả" className="truncate" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="0-2000000">Dưới 2 triệu</SelectItem>
                    <SelectItem value="2000000-5000000">2 - 5 triệu</SelectItem>
                    <SelectItem value="5000000-10000000">
                      5 - 10 triệu
                    </SelectItem>
                    <SelectItem value="10000000+">Trên 10 triệu</SelectItem>
                  </SelectContent>
                </Select>
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
              {checkingAvailability && (
                <Card className="p-4 bg-blue-50 border-blue-200">
                  <div className="flex items-center gap-3">
                    <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                    <p className="text-sm text-blue-700">
                      Đang kiểm tra tình trạng phòng trống...
                    </p>
                  </div>
                </Card>
              )}
              <div>
                {loading ? (
                  <Card className="p-8 text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                    <p className="text-gray-500">Đang tải phòng...</p>
                  </Card>
                ) : rooms.length === 0 ? (
                  <Card className="p-8 text-center">
                    <p className="text-gray-500">
                      Không tìm thấy phòng phù hợp với tiêu chí tìm kiếm
                    </p>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {rooms.map((room) => {
                      // Find the corresponding room type for this room
                      const currentRoomType =
                        roomTypes.find((rt) => rt.id === room.roomTypeId) ||
                        roomType;
                      if (!currentRoomType) return null;

                      const isSelected = bookingRooms.some(
                        (br) => br.roomId === room.id
                      );
                      
                      const isAvailable = availableRoomIds.has(room.id);

                      return (
                        <RoomCard
                          key={room.id}
                          room={room}
                          roomType={currentRoomType}
                          isSelected={isSelected}
                          isAvailable={isAvailable}
                          onSelect={handleAddRoom}
                          onViewImages={handleViewImages}
                          showActionButton={true}
                          actionButtonVariant="select"
                        />
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Right: Booking Summary (Sticky) */}
            <div className="lg:col-span-1">
              <BookingSummary
                checkIn={filter.checkIn}
                checkOut={filter.checkOut}
                guests={filter.guests}
                nights={nights}
                bookingRooms={bookingRooms}
                onRemoveRoom={handleRemoveRoom}
                onClearAll={handleClearBooking}
                onProceed={handleProceedToPayment}
                showProceedButton={true}
                proceedButtonText="Tiếp tục thanh toán"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Image Gallery Modal */}
      <RoomDetailModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        room={selectedRoom}
        roomType={currentRoomType}
        mode="booking"
        isSelected={bookingRooms.some(
          (br) => br.roomId === selectedRoom?.id
        )}
        onSelectRoom={handleAddRoom}
        getRoomStatusBadge={getRoomStatusBadge}
      />
    </div>
  );
}
