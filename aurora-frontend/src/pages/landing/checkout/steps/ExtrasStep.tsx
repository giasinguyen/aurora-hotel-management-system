import { useState, useEffect } from "react";
import { Plus, Minus, Clock, Users, Calendar, DoorOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/utils/exportUtils";
import fallbackImage from "@/assets/images/commons/fallback.png";
import type { CheckoutData, RoomExtras } from "../index";
import type { HotelService } from "@/types/service.types";
import { serviceApi } from "@/services/serviceApi";

interface ExtrasStepProps {
  checkoutData: CheckoutData;
  updateCheckoutData: (updates: Partial<CheckoutData>) => void;
}

export default function ExtrasStep({
  checkoutData,
  updateCheckoutData,
}: ExtrasStepProps) {
  const [services, setServices] = useState<HotelService[]>([]);
  const [loading, setLoading] = useState(true);
  const { rooms, roomExtras } = checkoutData;

  const branchId = localStorage.getItem("branchId") || "branch-hcm-001";

  // Fetch services on mount
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const response = await serviceApi.search({
          hotelId: branchId,
          page: 0,
          size: 100,
        });
        if (response.result?.content) {
          setServices(
            response.result.content.filter((s) => s.active !== false)
          );
        }
      } catch (error) {
        console.error("Failed to fetch services:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [branchId]);

  // Initialize roomExtras for new rooms
  useEffect(() => {
    const updatedExtras = { ...roomExtras };
    let hasChanges = false;

    rooms.forEach((room) => {
      if (!updatedExtras[room.roomId]) {
        updatedExtras[room.roomId] = {
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

  const handleServiceToggle = (roomId: string, service: HotelService) => {
    const roomExtra = roomExtras[roomId] || { services: [], note: "" };
    const existingIndex = roomExtra.services.findIndex(
      (s) => s.serviceId === service.id
    );

    const updatedServices = [...roomExtra.services];

    if (existingIndex >= 0) {
      // Remove service
      updatedServices.splice(existingIndex, 1);
    } else {
      // Add service with quantity 1
      updatedServices.push({
        serviceId: service.id,
        serviceName: service.name,
        price: service.basePrice,
        quantity: 1,
      });
    }

    updateRoomExtras(roomId, {
      ...roomExtra,
      services: updatedServices,
    });
  };

  const handleQuantityChange = (
    roomId: string,
    serviceId: string,
    delta: number
  ) => {
    const roomExtra = roomExtras[roomId] || { services: [], note: "" };
    const updatedServices = roomExtra.services.map((s) => {
      if (s.serviceId === serviceId) {
        const newQuantity = Math.max(1, s.quantity + delta);
        return { ...s, quantity: newQuantity };
      }
      return s;
    });

    updateRoomExtras(roomId, {
      ...roomExtra,
      services: updatedServices,
    });
  };

  const handleNoteChange = (roomId: string, note: string) => {
    const roomExtra = roomExtras[roomId] || { services: [], note: "" };
    updateRoomExtras(roomId, {
      ...roomExtra,
      note,
    });
  };

  const updateRoomExtras = (roomId: string, extras: RoomExtras) => {
    updateCheckoutData({
      roomExtras: {
        ...roomExtras,
        [roomId]: extras,
      },
    });
  };

  const isServiceSelected = (roomId: string, serviceId: string) => {
    const roomExtra = roomExtras[roomId];
    return roomExtra?.services.some((s) => s.serviceId === serviceId) || false;
  };

  const getServiceQuantity = (roomId: string, serviceId: string) => {
    const roomExtra = roomExtras[roomId];
    const service = roomExtra?.services.find((s) => s.serviceId === serviceId);
    return service?.quantity || 0;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <p className="text-gray-500">Đang tải dịch vụ...</p>
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

      {/* Room Sections */}
      {rooms.map((room, roomIndex) => {
        const roomExtra = roomExtras[room.roomId] || {
          services: [],
          note: "",
        };

        return (
          <Card key={room.roomId} className="border-2">
            <CardHeader className="bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <DoorOpen className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">
                    Phòng {roomIndex + 1}: {room.roomTypeName}
                  </CardTitle>
                  <p className="text-sm text-gray-600">
                    {room.roomNumber} • {formatCurrency(room.basePrice)}/đêm
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              {/* Services for this room */}
              <div>
                <h3 className="font-semibold mb-4">Chọn dịch vụ</h3>
                <div className="space-y-3">
                  {services.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-4">
                      Không có dịch vụ nào khả dụng
                    </p>
                  ) : (
                    services.map((service) => {
                      const isSelected = isServiceSelected(
                        room.roomId,
                        service.id
                      );
                      const quantity = getServiceQuantity(
                        room.roomId,
                        service.id
                      );

                      return (
                        <Card
                          key={service.id}
                          className={`cursor-pointer transition-all ${
                            isSelected
                              ? "border-primary bg-primary/5"
                              : "hover:border-gray-300"
                          }`}
                          onClick={() => handleServiceToggle(room.roomId, service)}
                        >
                          <CardContent className="p-4">
                            <div className="flex gap-4">
                              {/* Service Image */}
                              <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden">
                                <img
                                  src={service.images?.[0] || fallbackImage}
                                  alt={service.name}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.currentTarget.src = fallbackImage;
                                  }}
                                />
                              </div>

                              {/* Service Info */}
                              <div className="flex-1">
                                <div className="flex items-start justify-between">
                                  <div>
                                    <h4 className="font-semibold">
                                      {service.name}
                                    </h4>
                                    <p className="text-sm text-gray-600 mt-1">
                                      {service.description}
                                    </p>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                      {service.durationMinutes && (
                                        <Badge variant="outline" className="text-xs">
                                          <Clock className="h-3 w-3 mr-1" />
                                          {service.durationMinutes} phút
                                        </Badge>
                                      )}
                                      {service.maxCapacityPerSlot && (
                                        <Badge variant="outline" className="text-xs">
                                          <Users className="h-3 w-3 mr-1" />
                                          {service.maxCapacityPerSlot} người
                                        </Badge>
                                      )}
                                      {service.operatingHours && (
                                        <Badge variant="outline" className="text-xs">
                                          <Calendar className="h-3 w-3 mr-1" />
                                          {service.operatingHours}
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-lg font-bold text-primary">
                                      {formatCurrency(service.basePrice)}
                                    </p>
                                    {service.unit && (
                                      <p className="text-xs text-gray-500">
                                        /{service.unit}
                                      </p>
                                    )}
                                  </div>
                                </div>

                                {/* Quantity Selector (only if selected) */}
                                {isSelected && (
                                  <div className="flex items-center gap-3 mt-4 pt-4 border-t">
                                    <Label className="text-sm">Số lượng:</Label>
                                    <div className="flex items-center gap-2">
                                      <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleQuantityChange(
                                            room.roomId,
                                            service.id,
                                            -1
                                          );
                                        }}
                                      >
                                        <Minus className="h-4 w-4" />
                                      </Button>
                                      <span className="w-12 text-center font-semibold">
                                        {quantity}
                                      </span>
                                      <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleQuantityChange(
                                            room.roomId,
                                            service.id,
                                            1
                                          );
                                        }}
                                      >
                                        <Plus className="h-4 w-4" />
                                      </Button>
                                    </div>
                                    <div className="ml-auto">
                                      <p className="text-sm font-semibold">
                                        Tổng:{" "}
                                        {formatCurrency(service.basePrice * quantity)}
                                      </p>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })
                  )}
                </div>
              </div>

              <Separator />

              {/* Note for this room */}
              <div>
                <Label htmlFor={`note-${room.roomId}`} className="text-sm font-semibold">
                  Ghi chú cho phòng này
                </Label>
                <Textarea
                  id={`note-${room.roomId}`}
                  placeholder="E.g., late check-in, room preferences, dietary requirements..."
                  value={roomExtra.note || ""}
                  onChange={(e) =>
                    handleNoteChange(room.roomId, e.target.value)
                  }
                  className="mt-2"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
