import { Eye, Maximize, Users, Bed, ShoppingBag } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/utils/exportUtils";
import fallbackImage from "@/assets/images/commons/fallback.png";
import type { Room, RoomType } from "@/types/room.types";
import type { RoomExtras } from "@/pages/landing/checkout";

interface RoomCardProps {
  room: Room;
  roomType: RoomType;
  isSelected?: boolean;
  isAvailable?: boolean; // Whether room is available for the selected dates
  onSelect?: (room: Room, roomType: RoomType) => void;
  onViewImages?: (room: Room) => void;
  showActionButton?: boolean;
  actionButtonText?: string;
  actionButtonVariant?: "select" | "edit" | "service";
  onActionClick?: () => void;
  roomExtras?: RoomExtras; // Services selected for this room
}

export default function RoomCard({
  room,
  roomType,
  isSelected = false,
  isAvailable = true, // Default to true for backward compatibility
  onSelect,
  onViewImages,
  showActionButton = true,
  actionButtonText,
  actionButtonVariant = "select",
  onActionClick,
  roomExtras,
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

          {/* Selected Services */}
          {roomExtras && roomExtras.services.length > 0 && (
            <div className="mb-3 pt-3 border-t">
              <div className="flex items-center gap-2 mb-2">
                <ShoppingBag className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold text-gray-700">
                  Dịch vụ đã chọn ({roomExtras.services.length})
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {roomExtras.services.map((service) => (
                  <Badge
                    key={service.serviceId}
                    variant="outline"
                    className="text-xs bg-primary/10 border-primary/30"
                  >
                    {service.serviceName} x{service.quantity}
                  </Badge>
                ))}
              </div>
              <div className="mt-2 text-sm text-gray-600">
                <span>Tổng dịch vụ: </span>
                <span className="font-semibold text-primary">
                  {formatCurrency(
                    roomExtras.services.reduce(
                      (sum, s) => sum + s.price * s.quantity,
                      0
                    )
                  )}
                </span>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-3 border-t">
            <div>
              <p className="text-sm text-gray-500">Giá</p>
              <p className="text-2xl font-bold text-amber-600">
                {formatCurrency(room.priceFinal)}
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
                disabled={
                  !isAvailable || (isSelected && actionButtonVariant === "select")
                }
                className={
                  actionButtonVariant === "select"
                    ? !isAvailable
                      ? "bg-red-400 hover:bg-red-400 cursor-not-allowed"
                      : isSelected
                      ? "bg-gray-400 hover:bg-gray-400 cursor-not-allowed"
                      : "bg-amber-600 hover:bg-amber-700"
                    : actionButtonVariant === "service"
                    ? "bg-primary hover:bg-primary/90"
                    : "bg-primary hover:bg-primary/90"
                }
              >
                {!isAvailable
                  ? "Đã được đặt"
                  : actionButtonText ||
                    (actionButtonVariant === "service"
                      ? "Chọn dịch vụ"
                      : isSelected
                      ? "Đã chọn"
                      : "Chọn phòng")}
              </Button>
            )}
          </div>
        </CardContent>
      </div>
    </Card>
  );
}

