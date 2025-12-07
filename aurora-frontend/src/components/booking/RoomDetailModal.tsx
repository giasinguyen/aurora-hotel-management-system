import { useState, useEffect } from "react";
import { ChevronLeft, Maximize, Users, Bed } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatCurrency } from "@/utils/exportUtils";
import fallbackImage from "@/assets/images/commons/fallback.png";
import type { Room, RoomType } from "@/types/room.types";

const FALLBACK_IMAGE = fallbackImage;

interface RoomDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  room: Room | null;
  roomType: RoomType | null;
  mode?: "booking" | "checkout"; // booking: có button "Chọn phòng", checkout: chỉ xem
  isSelected?: boolean;
  onSelectRoom?: (room: Room, roomType: RoomType) => void;
  getRoomStatusBadge?: (status: string) => React.ReactNode;
}

export default function RoomDetailModal({
  open,
  onOpenChange,
  room,
  roomType,
  mode = "booking",
  isSelected = false,
  onSelectRoom,
  getRoomStatusBadge,
}: RoomDetailModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    if (img.src !== FALLBACK_IMAGE) {
      img.src = FALLBACK_IMAGE;
    }
  };

  // Reset image index when room changes
  useEffect(() => {
    if (room) {
      setCurrentImageIndex(0);
    }
  }, [room]);

  if (!room || !roomType) {
    return null;
  }

  const images = room.images || [];
  const hasMultipleImages = images.length > 1;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-2xl lg:max-w-4xl max-h-[95vh] p-0 overflow-y-auto">
        <DialogHeader className="sticky top-0 p-6 pb-3 bg-white border-b">
          <DialogTitle className="text-xl lg:text-2xl">
            {roomType.name || "Chi tiết phòng"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 p-4 lg:p-6">
          {/* Image Gallery */}
          <div className="relative w-full">
            <img
              src={
                images[currentImageIndex] ||
                images[0] ||
                roomType.imageUrl ||
                FALLBACK_IMAGE
              }
              alt={`${roomType.name} - Ảnh ${currentImageIndex + 1}`}
              className="w-full h-64 md:h-96 object-cover rounded-lg"
              onError={handleImageError}
            />

            {/* Image Navigation */}
            {hasMultipleImages && (
              <div className="absolute inset-0 flex items-center justify-between p-4">
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={() =>
                    setCurrentImageIndex((prev) =>
                      prev === 0 ? images.length - 1 : prev - 1
                    )
                  }
                  className="bg-black/50 hover:bg-black/70 text-white"
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={() =>
                    setCurrentImageIndex((prev) =>
                      prev === images.length - 1 ? 0 : prev + 1
                    )
                  }
                  className="bg-black/50 hover:bg-black/70 text-white"
                >
                  <ChevronLeft className="h-6 w-6 rotate-180" />
                </Button>
              </div>
            )}

            {hasMultipleImages && (
              <Badge className="absolute bottom-4 right-4 bg-black/70 text-white">
                {currentImageIndex + 1} / {images.length}
              </Badge>
            )}
          </div>

          {/* Thumbnail Gallery */}
          {hasMultipleImages && (
            <div className="flex gap-2 md:gap-3 overflow-x-auto pb-2 px-1">
              {images.map((img: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    currentImageIndex === idx
                      ? "border-amber-500 scale-105"
                      : "border-gray-300"
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
            <h4 className="font-semibold mb-3 text-lg">Thông tin phòng</h4>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 text-sm lg:text-base">
              <div className="flex items-center gap-2">
                <Maximize className="h-4 lg:h-5 w-4 lg:w-5 text-amber-600 shrink-0" />
                <div>
                  <p className="text-xs lg:text-sm text-gray-500">Diện tích</p>
                  <p className="font-semibold">{roomType.sizeM2}m²</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 lg:h-5 w-4 lg:w-5 text-amber-600 shrink-0" />
                <div>
                  <p className="text-xs lg:text-sm text-gray-500">Sức chứa</p>
                  <p className="font-semibold">
                    {roomType.maxOccupancy} người
                  </p>
                </div>
              </div>
              {roomType.bedType && (
                <div className="flex items-center gap-2">
                  <Bed className="h-4 lg:h-5 w-4 lg:w-5 text-amber-600 shrink-0" />
                  <div>
                    <p className="text-xs lg:text-sm text-gray-500">Giường</p>
                    <p className="font-semibold">
                      {roomType.bedType} x {roomType.numberOfBeds || 1}
                    </p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-2">
                <div>
                  <p className="text-xs lg:text-sm text-gray-500">View</p>
                  <p className="font-semibold">
                    {room.viewType || "City View"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {roomType.amenities && roomType.amenities.length > 0 && (
            <div className="border-t pt-4">
              <h4 className="font-semibold mb-3 text-lg">Tiện nghi</h4>
              <div className="flex flex-wrap gap-2">
                {roomType.amenities.map((amenity) => (
                  <Badge
                    key={amenity.id}
                    variant="outline"
                    className="px-2 lg:px-3 py-1 text-xs lg:text-sm"
                  >
                    {amenity.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="border-t pt-4">
            <div className="flex items-center justify-between mb-4 flex-col md:flex-row gap-3 md:gap-0">
              <div>
                <p className="text-xs lg:text-sm text-gray-500">Giá phòng</p>
                <p className="text-xl md:text-2xl font-bold text-amber-600">
                  {formatCurrency(roomType.priceFrom)}
                  <span className="text-xs lg:text-sm text-gray-500 font-normal">
                    /đêm
                  </span>
                </p>
              </div>
              {getRoomStatusBadge && getRoomStatusBadge(room.status)}
            </div>

            {/* Only show select button in booking mode */}
            {mode === "booking" && onSelectRoom && (
              <Button
                className="w-full bg-amber-600 hover:bg-amber-700 text-sm lg:text-base py-2 lg:py-3"
                onClick={() => {
                  onSelectRoom(room, roomType);
                  onOpenChange(false);
                }}
                disabled={isSelected}
              >
                {isSelected ? "Đã chọn" : "Chọn phòng này"}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

