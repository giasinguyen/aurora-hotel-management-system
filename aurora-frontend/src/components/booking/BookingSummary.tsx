import { Calendar, Users, X, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/utils/exportUtils";
import fallbackImage from "@/assets/images/commons/fallback.png";
import type { Promotion } from "@/types/promotion.types";

export interface BookingRoom {
  roomId: string;
  roomNumber: string;
  roomTypeId: string;
  roomTypeName: string;
  basePrice: number;
  imageUrl?: string;
}

import type { RoomExtras } from "@/pages/landing/checkout";

interface BookingSummaryProps {
  // Booking info
  checkIn: string;
  checkOut: string;
  guests: number;
  nights: number;
  
  // Selected rooms
  bookingRooms: BookingRoom[];
  
  // Room extras (services per room)
  roomExtras?: Record<string, RoomExtras>;
  
  // Promotion
  selectedPromotionId?: string;
  promotions?: Promotion[];
  
  // Callbacks
  onRemoveRoom?: (roomId: string) => void;
  onClearAll?: () => void;
  onProceed?: () => void;
  
  // Options
  showProceedButton?: boolean;
  proceedButtonText?: string;
}

export default function BookingSummary({
  checkIn,
  checkOut,
  guests,
  nights,
  bookingRooms,
  roomExtras,
  selectedPromotionId,
  promotions = [],
  onRemoveRoom,
  onClearAll,
  onProceed,
  showProceedButton = true,
  proceedButtonText = "Tiếp tục thanh toán",
}: BookingSummaryProps) {
  const calculateTotalPrice = () => {
    return bookingRooms.reduce((sum, room) => sum + room.basePrice, 0);
  };

  const calculateServicesTotal = () => {
    if (!roomExtras) return 0;
    return Object.values(roomExtras).reduce((total, extras) => {
      return (
        total +
        extras.services.reduce(
          (sum, service) => sum + service.price * service.quantity,
          0
        )
      );
    }, 0);
  };

  // Calculate discount from selected promotion
  const calculateDiscount = () => {
    if (!selectedPromotionId || !promotions.length) return 0;
    
    const promotion = promotions.find(p => p.id === selectedPromotionId);
    if (!promotion) return 0;
    
    const subtotal = calculateTotalPrice() * nights + calculateServicesTotal();
    
    if (promotion.discountType === 'FIXED_AMOUNT' && promotion.amountOff) {
      // Fixed amount discount - cannot exceed subtotal
      return Math.min(promotion.amountOff, subtotal);
    }
    
    return 0;
  };

  const roomsTotal = calculateTotalPrice() * nights;
  const servicesTotal = calculateServicesTotal();
  const discountAmount = calculateDiscount();
  const subtotal = roomsTotal + servicesTotal;
  const totalPrice = subtotal - discountAmount;
  
  const selectedPromotion = promotions.find(p => p.id === selectedPromotionId);

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
            Phòng đã chọn ({bookingRooms.length})
          </h4>
          {bookingRooms.length > 0 && onClearAll && (
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

        {bookingRooms.length === 0 ? (
          <p className="text-sm text-gray-500 italic">
            Chưa chọn phòng nào
          </p>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {bookingRooms.map((room) => {
              const extras = roomExtras?.[room.roomId];
              const roomServicesTotal = extras
                ? extras.services.reduce(
                    (sum, service) => sum + service.price * service.quantity,
                    0
                  )
                : 0;

              return (
                <div
                  key={room.roomId}
                  className="p-3 bg-gray-50 rounded-lg border border-gray-200"
                >
                  {/* Room Info */}
                  <div className="flex items-start gap-3">
                    <img
                      src={room.imageUrl || fallbackImage}
                      alt={room.roomTypeName}
                      className="w-16 h-16 object-cover rounded flex-shrink-0"
                      onError={handleImageError}
                    />
                    <div className="grow min-w-0">
                      <p className="text-sm font-semibold text-gray-900">
                        {room.roomTypeName}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        {formatCurrency(room.basePrice)}/đêm
                      </p>
                      
                      {/* Services for this room */}
                      {extras && extras.services.length > 0 && (
                        <div className="mt-2 pt-2 border-t border-gray-200">
                          <p className="text-xs font-medium text-gray-700 mb-1">
                            Dịch vụ đã chọn:
                          </p>
                          <div className="space-y-1">
                            {extras.services.map((service) => (
                              <div
                                key={service.serviceId}
                                className="flex items-center justify-between text-xs"
                              >
                                <span className="text-gray-600">
                                  {service.serviceName}
                                  {service.quantity > 1 && (
                                    <span className="text-gray-500 ml-1">
                                      (x{service.quantity})
                                    </span>
                                  )}
                                </span>
                                <span className="text-gray-700 font-medium">
                                  {formatCurrency(service.price * service.quantity)}
                                </span>
                              </div>
                            ))}
                          </div>
                          {roomServicesTotal > 0 && (
                            <div className="flex items-center justify-between mt-2 pt-1 border-t border-gray-200">
                              <span className="text-xs font-medium text-gray-700">
                                Tổng dịch vụ:
                              </span>
                              <span className="text-xs font-semibold text-primary">
                                {formatCurrency(roomServicesTotal)}
                              </span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Note for this room */}
                      {extras?.note && (
                        <div className="mt-2 pt-2 border-t border-gray-200">
                          <p className="text-xs text-gray-600 italic">
                            <span className="font-medium">Ghi chú: </span>
                            {extras.note}
                          </p>
                        </div>
                      )}
                    </div>
                    {onRemoveRoom && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onRemoveRoom(room.roomId)}
                        className="text-red-600 hover:text-red-700 flex-shrink-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
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
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Tổng phòng</span>
          <span>{formatCurrency(roomsTotal)}</span>
        </div>
        {servicesTotal > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Dịch vụ bổ sung</span>
            <span className="text-primary font-semibold">
              {formatCurrency(servicesTotal)}
            </span>
          </div>
        )}
        {discountAmount > 0 && selectedPromotion && (
          <div className="flex justify-between text-sm text-green-600">
            <span>
              Giảm giá {selectedPromotion.code && `(${selectedPromotion.code})`}
            </span>
            <span className="font-semibold">
              -{formatCurrency(discountAmount)}
            </span>
          </div>
        )}
        <div className="flex justify-between font-bold text-lg pt-2 border-t">
          <span>Total</span>
          <span className="text-amber-600">
            {formatCurrency(totalPrice)}
          </span>
        </div>
      </div>

      {/* Actions */}
      {showProceedButton && (
        <>
          <Button
            className="w-full bg-primary hover:bg-primary/90"
            size="lg"
            onClick={onProceed}
            disabled={bookingRooms.length === 0}
          >
            {proceedButtonText}
          </Button>

          <p className="text-xs text-center text-gray-500 mt-3">
            * Giá có thể thay đổi tùy theo ngày
          </p>
        </>
      )}
    </Card>
  );
}

