import { Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/utils/exportUtils";
import type { CheckoutData } from "../index";

interface PriceSummaryProps {
  checkoutData: CheckoutData;
}

export default function PriceSummary({ checkoutData }: PriceSummaryProps) {
  const { rooms, checkIn, checkOut, guests, nights, roomExtras } =
    checkoutData;

  const roomsTotal = rooms.reduce((sum, room) => sum + room.basePrice, 0);
  
  // Calculate services total from all rooms
  const servicesTotal = Object.values(roomExtras || {}).reduce(
    (total, roomExtra) => {
      const roomServicesTotal = roomExtra.services.reduce(
        (sum, service) => sum + service.price * service.quantity,
        0
      );
      return total + roomServicesTotal;
    },
    0
  );
  
  const subtotal = roomsTotal * nights + servicesTotal;
  const total = subtotal; // Add taxes/fees if needed

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (_dateString: string, isCheckOut: boolean = false) => {
    return isCheckOut ? "12:00" : "15:00";
  };

  return (
    <Card className="sticky top-24">
      <CardHeader>
        <CardTitle>Price Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Dates */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="text-gray-600">
                {formatDate(checkIn)} from {formatTime(checkIn)}
              </span>
            </div>
            <span className="text-gray-400">→</span>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="text-gray-600">
                {formatDate(checkOut)} until {formatTime(checkOut, true)}
              </span>
            </div>
          </div>
          <div className="text-sm text-primary font-medium">
            {nights} night{nights > 1 ? "s" : ""} | {rooms.length} room
            {rooms.length > 1 ? "s" : ""} | {guests} adult{guests > 1 ? "s" : ""}
          </div>
        </div>

        <Separator />

        {/* Price Breakdown */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Room</span>
            <span>{formatCurrency(roomsTotal * nights)}</span>
          </div>
          {servicesTotal > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Services</span>
              <span>{formatCurrency(servicesTotal)}</span>
            </div>
          )}
        </div>

        <Separator />

        {/* Total */}
        <div className="flex justify-between font-bold text-lg">
          <span>Total</span>
          <span className="text-primary">{formatCurrency(total)}</span>
        </div>
        <p className="text-xs text-gray-500">
          Price includes all taxes and fees
        </p>
      </CardContent>
    </Card>
  );
}

