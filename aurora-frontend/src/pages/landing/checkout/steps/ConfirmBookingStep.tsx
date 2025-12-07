import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RoomCard, RoomDetailModal } from "@/components/booking";
import { roomApi, roomTypeApi } from "@/services/roomApi";
import type { CheckoutData } from "../index";
import type { Room, RoomType } from "@/types/room.types";

interface ConfirmBookingStepProps {
  checkoutData: CheckoutData;
  updateCheckoutData: (updates: Partial<CheckoutData>) => void;
}

export default function ConfirmBookingStep({
  checkoutData,
}: ConfirmBookingStepProps) {
  const navigate = useNavigate();
  const { rooms: bookingRooms } = checkoutData;
  
  const [roomDetails, setRoomDetails] = useState<Array<{ room: Room; roomType: RoomType }>>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [currentRoomType, setCurrentRoomType] = useState<RoomType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Log bookingRooms to debug
  useEffect(() => {
    console.log("🔍 ConfirmBookingStep - bookingRooms:", bookingRooms.length, bookingRooms);
  }, [bookingRooms]);

  // Fetch room details from API based on roomId from localStorage
  useEffect(() => {
    const fetchRoomDetails = async () => {
      try {
        setLoading(true);
        console.log("🔄 Fetching room details for", bookingRooms.length, "rooms");
        const details = await Promise.all(
          bookingRooms.map(async (bookingRoom) => {
            try {
              // Fetch room by ID from database
              const roomRes = await roomApi.getById(bookingRoom.roomId);
              const room = roomRes.result;

              // Fetch room type from database
              const roomTypeRes = await roomTypeApi.getById(bookingRoom.roomTypeId);
              const roomType = roomTypeRes.result;

              if (room && roomType) {
                return { room, roomType };
              }
              return null;
            } catch (error) {
              console.error(`Failed to fetch room ${bookingRoom.roomId}:`, error);
              return null;
            }
          })
        );

        const validDetails = details.filter((d): d is { room: Room; roomType: RoomType } => d !== null);
        console.log("✅ Fetched", validDetails.length, "room details successfully");
        setRoomDetails(validDetails);
      } catch (error) {
        console.error("❌ Failed to fetch room details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (bookingRooms && bookingRooms.length > 0) {
      console.log("🚀 Starting to fetch", bookingRooms.length, "rooms");
      fetchRoomDetails();
    } else {
      console.log("⚠️ No bookingRooms to fetch");
      setLoading(false);
    }
  }, [bookingRooms]);

  const handleViewImages = (room: Room) => {
    // Find the roomType for this specific room
    const roomTypeForRoom = roomDetails.find((rd) => rd.room.id === room.id)?.roomType;

    setSelectedRoom(room);
    setCurrentRoomType(roomTypeForRoom || null);
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (roomDetails.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Không tìm thấy thông tin phòng</p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => navigate("/booking")}
        >
          Quay lại chọn phòng
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Confirm Your Booking</h2>
        <p className="text-gray-600">
          Review your selected rooms and booking details
        </p>
      </div>

      {/* Room Cards - Reuse shared RoomCard component */}
      <div className="space-y-4">
        {roomDetails.map(({ room, roomType }) => (
          <RoomCard
            key={room.id}
            room={room}
            roomType={roomType}
            showActionButton={true}
            actionButtonVariant="edit"
            actionButtonText="Chỉnh sửa"
            onActionClick={() => navigate("/booking")}
            onViewImages={handleViewImages}
          />
        ))}
      </div>

      {/* Booking Policies */}
      <Card className="bg-gray-50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-1">Booking Policies</h3>
              <p className="text-sm text-gray-600">
                Our booking includes items with different booking policies.
              </p>
            </div>
            <Button variant="link" className="p-0 h-auto text-primary">
              View all policies
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Image Gallery Modal */}
      <RoomDetailModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        room={selectedRoom}
        roomType={currentRoomType}
        mode="checkout"
      />
    </div>
  );
}
