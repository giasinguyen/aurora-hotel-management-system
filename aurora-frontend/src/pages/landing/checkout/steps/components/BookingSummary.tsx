import { Calendar, Users, X, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/utils/exportUtils";
import fallbackImage from "@/assets/images/commons/fallback.png";
import type { CheckoutData } from "../../index";
import type { BookingRoom } from "../../types";

interface BookingSummaryProps {
  checkoutData: CheckoutData;
  onRemoveRoom?: (roomId: string) => void;
  onClearAll?: () => void;
}

export default function BookingSummary({
  checkoutData,
  onRemoveRoom,
  onClearAll,
}: BookingSummaryProps) {
  const { rooms, checkIn, checkOut, guests, nights } = checkoutData;

  const calculateTotalPrice = () => {
    return rooms.reduce((sum, room) => sum + room.basePrice, 0);
  };

  const totalPrice = calculateTotalPrice() * nights;

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    if (img.src !== fallbackImage) {
      img.src = fallbackImage;
    }
  };

  return (
    <Card className="sticky top-24 p-6">
      <h3 className="text-xl font-bold mb-4">Booking summary</h3>

      {/* Booking Info */}
      <div className="space-y-3 mb-4 pb-4 border-b">
        <div className="flex items-center text-sm">
          <Calendar className="h-4 w-4 mr-2 text-gray-500" />
          <div>
            <p className="text-gray-600">Check-in</p>
            <p className="font-semibold">
              {new Date(checkIn).toLocaleDateString("vi-VN")}
            </p>
          </div>
        </div>
        <div className="flex items-center text-sm">
          <Calendar className="h-4 w-4 mr-2 text-gray-500" />
          <div>
            <p className="text-gray-600">Check-out</p>
            <p className="font-semibold">
              {new Date(checkOut).toLocaleDateString("vi-VN")}
            </p>
          </div>
        </div>
        <div className="flex items-center text-sm">
          <Users className="h-4 w-4 mr-2 text-gray-500" />
          <div>
            <p className="text-gray-600">Guests</p>
            <p className="font-semibold">{guests} người</p>
          </div>
        </div>
        <p className="text-sm text-gray-600">{nights} đêm</p>
      </div>

      {/* Selected Rooms */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-semibold">
            Phòng đã chọn ({rooms.length})
          </h4>
          {rooms.length > 0 && onClearAll && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearAll}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>

        {rooms.length === 0 ? (
          <p className="text-sm text-gray-500 italic">
            Chưa chọn phòng nào
          </p>
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {rooms.map((room: BookingRoom) => (
              <div
                key={room.roomId}
                className="flex items-center gap-2 p-2 bg-gray-50 rounded"
              >
                <img
                  src={room.imageUrl || fallbackImage}
                  alt={room.roomTypeName}
                  className="w-12 h-12 object-cover rounded"
                  onError={handleImageError}
                />
                <div className="grow">
                  <p className="text-sm font-medium">
                    {room.roomTypeName}
                  </p>
                  <p className="text-xs text-gray-600">
                    {formatCurrency(room.basePrice)}/đêm
                  </p>
                </div>
                {onRemoveRoom && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveRoom(room.roomId)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
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
          <span className="text-amber-600">
            {formatCurrency(totalPrice)}
          </span>
        </div>
      </div>

      <p className="text-xs text-center text-gray-500">
        * Giá có thể thay đổi tùy theo ngày
      </p>
    </Card>
  );
}

