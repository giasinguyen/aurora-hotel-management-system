import { Eye, Maximize, Users, Bed } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/utils/exportUtils";
import fallbackImage from "@/assets/images/commons/fallback.png";
import type { Room, RoomType } from "@/types/room.types";

interface RoomCardProps {
  room: Room;
  roomType: RoomType;
  isSelected?: boolean;
  onSelect?: (room: Room, roomType: RoomType) => void;
  onViewImages?: (room: Room) => void;
  showActionButton?: boolean;
  actionButtonText?: string;
  actionButtonVariant?: "select" | "edit";
  onActionClick?: () => void;
}

export default function RoomCard({
  room,
  roomType,
  isSelected = false,
  onSelect,
  onViewImages,
  showActionButton = true,
  actionButtonText,
  actionButtonVariant = "select",
  onActionClick,
}: RoomCardProps) {
  const getRoomStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; className: string }> = {
      READY: { label: "READY", className: "bg-green-100 text-green-800" },
      CLEANING: { label: "Đang dọn", className: "bg-purple-100 text-purple-800" },
      MAINTENANCE: { label: "Bảo trì", className: "bg-red-100 text-red-800" },
      LOCKED: { label: "Khoá", className: "bg-gray-100 text-gray-800" },
    };
    const config = statusConfig[status] || { label: status, className: "bg-gray-100 text-gray-800" };
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    if (img.src !== fallbackImage) {
      img.src = fallbackImage;
    }
  };

  const imageUrl = room.images?.[0] || roomType.imageUrl || fallbackImage;

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="flex flex-col md:flex-row">
        {/* Image */}
        <div className="md:w-64 shrink-0 relative group">
          <img
            src={imageUrl}
            alt={roomType.name}
            className="w-full h-48 md:h-full object-cover"
            onError={handleImageError}
          />
          {onViewImages && (
            <Button
              variant="secondary"
              size="sm"
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => onViewImages(room)}
            >
              <Eye className="h-4 w-4 mr-1" />
              Xem ảnh
            </Button>
          )}
        </div>

        {/* Content */}
        <CardContent className="grow p-4">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="text-xl font-bold text-gray-800">
                {roomType.name}
              </h3>
              <p className="text-sm text-gray-600">
                {roomType.shortDescription}
              </p>
            </div>
            {getRoomStatusBadge(room.status)}
          </div>

          <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
            <div className="flex items-center text-gray-700">
              <Maximize className="h-4 w-4 mr-2 text-amber-600" />
              <span>{roomType.sizeM2}m²</span>
            </div>
            <div className="flex items-center text-gray-700">
              <Users className="h-4 w-4 mr-2 text-amber-600" />
              <span>{roomType.maxOccupancy} người</span>
            </div>
            {roomType.bedType && (
              <div className="flex items-center text-gray-700">
                <Bed className="h-4 w-4 mr-2 text-amber-600" />
                <span>
                  {roomType.bedType} x {roomType.numberOfBeds || 1}
                </span>
              </div>
            )}
            <div className="flex items-center text-gray-700">
              <span className="text-sm font-medium">
                View: {room.viewType || "City"}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t">
            <div>
              <p className="text-sm text-gray-500">Giá</p>
              <p className="text-2xl font-bold text-amber-600">
                {formatCurrency(roomType.priceFrom)}
                <span className="text-sm text-gray-500 font-normal">
                  /đêm
                </span>
              </p>
            </div>
            {showActionButton && (
              <Button
                onClick={
                  onActionClick
                    ? onActionClick
                    : onSelect
                    ? () => onSelect(room, roomType)
                    : undefined
                }
                disabled={isSelected && actionButtonVariant === "select"}
                className={
                  actionButtonVariant === "select"
                    ? isSelected
                      ? "bg-gray-400 hover:bg-gray-400 cursor-not-allowed"
                      : "bg-amber-600 hover:bg-amber-700"
                    : "bg-primary hover:bg-primary/90"
                }
              >
                {actionButtonText ||
                  (isSelected ? "Đã chọn" : "Chọn phòng")}
              </Button>
            )}
          </div>
        </CardContent>
      </div>
    </Card>
  );
}

