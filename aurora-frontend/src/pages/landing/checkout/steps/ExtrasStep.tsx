import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RoomCard, ServiceSelectionModal, RoomDetailModal } from "@/components/booking";
import { roomApi, roomTypeApi } from "@/services/roomApi";
import type { CheckoutData, RoomExtras } from "../index";
import type { Room, RoomType } from "@/types/room.types";

interface ExtrasStepProps {
  checkoutData: CheckoutData;
  updateCheckoutData: (updates: Partial<CheckoutData>) => void;
  rolePrefix?: string;
}

export default function ExtrasStep({
  checkoutData,
  updateCheckoutData,
}: ExtrasStepProps) {
  const { rooms, roomExtras } = checkoutData;
  const branchId = localStorage.getItem("branchId") || "branch-hcm-001";

  const [roomDetails, setRoomDetails] = useState<Array<{ room: Room; roomType: RoomType }>>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoomForService, setSelectedRoomForService] = useState<string | null>(null);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [selectedRoomForView, setSelectedRoomForView] = useState<Room | null>(null);
  const [currentRoomType, setCurrentRoomType] = useState<RoomType | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  // Fetch room details from API
  useEffect(() => {
    const fetchRoomDetails = async () => {
      try {
        setLoading(true);
        const details = await Promise.all(
          rooms.map(async (bookingRoom) => {
            try {
              const roomRes = await roomApi.getById(bookingRoom.roomId);
              const room = roomRes.result;

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
        setRoomDetails(validDetails);
      } catch (error) {
        console.error("❌ Failed to fetch room details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (rooms && rooms.length > 0) {
      fetchRoomDetails();
    } else {
      setLoading(false);
    }
  }, [rooms]);

  // Initialize roomExtras for new rooms
  useEffect(() => {
    const updatedExtras = { ...roomExtras };
    let hasChanges = false;

    rooms.forEach((bookingRoom) => {
      if (!updatedExtras[bookingRoom.roomId]) {
        updatedExtras[bookingRoom.roomId] = {
          services: [],
          note: "",
        };
        hasChanges = true;
      }
    });

    // Remove extras for rooms that are no longer in the list
    Object.keys(updatedExtras).forEach((roomId) => {
      if (!rooms.some((r) => r.roomId === roomId)) {
        delete updatedExtras[roomId];
        hasChanges = true;
      }
    });

    if (hasChanges) {
      updateCheckoutData({ roomExtras: updatedExtras });
    }
  }, [rooms, roomExtras, updateCheckoutData]);

  const handleSelectService = (roomId: string) => {
    console.log("🔘 handleSelectService called with roomId:", roomId);
    console.log("🔘 branchId:", branchId);
    setSelectedRoomForService(roomId);
    setIsServiceModalOpen(true);
    console.log("🔘 Modal state set - isServiceModalOpen should be true");
  };

  const handleSaveService = (roomId: string, extras: RoomExtras) => {
    updateCheckoutData({
      roomExtras: {
        ...roomExtras,
        [roomId]: extras,
      },
    });
  };

  const handleViewImages = (room: Room) => {
    const roomTypeForRoom = roomDetails.find((rd) => rd.room.id === room.id)?.roomType;
    setSelectedRoomForView(room);
    setCurrentRoomType(roomTypeForRoom || null);
    setIsViewModalOpen(true);
  };

  const handleNoteChange = (roomId: string, note: string) => {
    const roomExtra = roomExtras[roomId] || { services: [], note: "" };
    updateCheckoutData({
      roomExtras: {
        ...roomExtras,
        [roomId]: {
          ...roomExtra,
          note,
        },
      },
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Dịch vụ bổ sung</h2>
        <p className="text-gray-600">
          Thêm dịch vụ và ghi chú cho từng phòng đã chọn
        </p>
      </div>

      {/* Room Cards */}
      <div className="space-y-4">
        {roomDetails.map(({ room, roomType }) => {
          // room.id is the same as bookingRoom.roomId (we fetched room by bookingRoom.roomId)
          const roomId = room.id;
          
          const roomExtra = roomExtras[roomId] || {
            services: [],
            note: "",
          };

          return (
            <div key={room.id} className="space-y-4">
              <RoomCard
                room={room}
                roomType={roomType}
                showActionButton={true}
                actionButtonVariant="service"
                actionButtonText="Chọn dịch vụ"
                onActionClick={() => {
                  console.log("🔘 Clicked Chọn dịch vụ for room.id:", room.id);
                  handleSelectService(roomId);
                }}
                onViewImages={handleViewImages}
                roomExtras={roomExtra}
              />

              {/* Note Section */}
              <Card>
                <CardContent className="pt-6">
                  <Label htmlFor={`note-${room.id}`} className="text-sm font-semibold">
                    Ghi chú cho phòng này
                  </Label>
                  <Textarea
                    id={`note-${room.id}`}
                    placeholder="E.g., late check-in, room preferences, dietary requirements..."
                    value={roomExtra.note || ""}
                    onChange={(e) => handleNoteChange(roomId, e.target.value)}
                    className="mt-2"
                    rows={3}
                  />
                </CardContent>
              </Card>
            </div>
          );
        })}
      </div>

      {/* Service Selection Modal */}
      {selectedRoomForService && (
        <ServiceSelectionModal
          open={isServiceModalOpen}
          onOpenChange={(open) => {
            console.log("🔄 ServiceSelectionModal onOpenChange:", open);
            setIsServiceModalOpen(open);
            if (!open) {
              setSelectedRoomForService(null);
            }
          }}
          roomId={selectedRoomForService}
          roomExtras={roomExtras[selectedRoomForService] || { services: [], note: "" }}
          branchId={branchId}
          onSave={handleSaveService}
        />
      )}

      {/* Room Detail Modal */}
      <RoomDetailModal
        open={isViewModalOpen}
        onOpenChange={setIsViewModalOpen}
        room={selectedRoomForView}
        roomType={currentRoomType}
        mode="checkout"
      />
    </div>
  );
}
