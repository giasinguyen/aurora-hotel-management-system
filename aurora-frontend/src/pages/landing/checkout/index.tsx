import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import VideoHero from "@/components/custom/VideoHero";
import ProgressBar from "./components/ProgressBar";
import ConfirmBookingStep from "./steps/ConfirmBookingStep";
import ExtrasStep from "./steps/ExtrasStep";
import GuestDetailsStep from "./steps/GuestDetailsStep";
import PaymentStep from "./steps/PaymentStep";
import { BookingSummary } from "@/components/booking";
import type { BookingRoom } from "./types";
import type { Promotion } from "@/types/promotion.types";
import type { Promotion } from "@/types/promotion.types";

export type CheckoutStep = 1 | 2 | 3 | 4;

export interface RoomExtras {
  services: Array<{
    serviceId: string;
    serviceName: string;
    price: number;
    quantity: number;
  }>;
  note?: string;
}

export interface CheckoutData {
  // Step 1: Booking confirmation
  rooms: BookingRoom[];
  checkIn: string;
  checkOut: string;
  guests: number;
  nights: number;

  // Step 2: Extras - mỗi phòng có services và note riêng
  roomExtras: Record<string, RoomExtras>; // key: roomId, value: RoomExtras

  // Step 3: Guest details
  guestInfo?: {
    fullName: string;
    email: string;
    phone: string;
    specialRequests?: string;
  };

  // Step 4: Payment
  paymentMethod?: "cash" | "vnpay" | "momo" | "visa";
  selectedPromotionId?: string; // Selected promotion ID
}

export default function CheckoutPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<CheckoutStep>(1);
  const [promotions, setPromotions] = useState<Promotion[]>([]);

  // Detect current role prefix from URL
  const currentPath = window.location.pathname;
  const rolePrefix = currentPath.startsWith('/admin') ? '/admin' 
    : currentPath.startsWith('/manager') ? '/manager'
    : currentPath.startsWith('/staff') ? '/staff'
    : '';

  const [checkoutData, setCheckoutData] = useState<CheckoutData>(() => {
    // Always load from bookingRooms first (most recent data from booking page)
    const bookingRooms = localStorage.getItem("bookingRooms");
    const bookingFilter = localStorage.getItem("bookingFilter");
    
    let rooms: BookingRoom[] = [];
    let checkIn = new Date().toISOString().split("T")[0];
    let checkOut = new Date(Date.now() + 86400000).toISOString().split("T")[0];
    let guests = 2;

    // Load booking rooms from localStorage (priority)
    if (bookingRooms) {
      try {
        rooms = JSON.parse(bookingRooms);
        console.log("Loaded bookingRooms from localStorage:", rooms);
      } catch (e) {
        console.error("Failed to load booking rooms:", e);
      }
    }

    // Load filter from localStorage
    if (bookingFilter) {
      try {
        const filter = JSON.parse(bookingFilter);
        checkIn = filter.checkIn || checkIn;
        checkOut = filter.checkOut || checkOut;
        guests = filter.guests || guests;
      } catch (e) {
        console.error("Failed to load booking filter:", e);
      }
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const diffTime = Math.abs(checkOutDate.getTime() - checkInDate.getTime());
    const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;

    // Initialize roomExtras for each room
    const roomExtras: Record<string, RoomExtras> = {};
    rooms.forEach((room) => {
      roomExtras[room.roomId] = {
        services: [],
        note: "",
      };
    });

    const newCheckoutData: CheckoutData = {
      rooms,
      checkIn,
      checkOut,
      guests,
      nights,
      roomExtras,
      paymentMethod: "cash", // Default to cash payment
    };

    console.log("📦 Initialized checkoutData with", rooms.length, "rooms");
    console.log("📋 Room IDs:", rooms.map((r: BookingRoom) => r.roomId));
    return newCheckoutData;
  });

  // Reload from bookingRooms when component mounts to ensure we have latest data
  useEffect(() => {
    const bookingRooms = localStorage.getItem("bookingRooms");
    
    if (bookingRooms) {
      try {
        const rooms = JSON.parse(bookingRooms);
        console.log("On mount - Reloaded bookingRooms:", rooms.length, "rooms", rooms);
        
        // Always update with latest rooms from booking page
        if (rooms.length > 0) {
          const checkIn = checkoutData.checkIn;
          const checkOut = checkoutData.checkOut;
          const checkInDate = new Date(checkIn);
          const checkOutDate = new Date(checkOut);
          const diffTime = Math.abs(checkOutDate.getTime() - checkInDate.getTime());
          const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
          
          // Merge roomExtras - keep existing, add new ones
          const roomExtras: Record<string, RoomExtras> = { ...checkoutData.roomExtras };
          rooms.forEach((room: BookingRoom) => {
            if (!roomExtras[room.roomId]) {
              roomExtras[room.roomId] = {
                services: [],
                note: "",
              };
            }
          });
          
          // Remove extras for rooms that are no longer selected
          Object.keys(roomExtras).forEach((roomId) => {
            if (!rooms.find((r: BookingRoom) => r.roomId === roomId)) {
              delete roomExtras[roomId];
            }
          });
          
          console.log("Updating checkoutData with", rooms.length, "rooms");
          setCheckoutData((prev) => ({
            ...prev,
            rooms,
            nights,
            roomExtras,
          }));
        }
      } catch (e) {
        console.error("Failed to reload booking rooms:", e);
      }
    }
  }, []); // Only run on mount

  // Save to localStorage whenever checkoutData changes
  useEffect(() => {
    localStorage.setItem("checkoutData", JSON.stringify(checkoutData));
  }, [checkoutData]);

  // Set default payment method when entering step 4
  // Note: PaymentStep component will handle role-based default

  // Redirect if no rooms selected
  useEffect(() => {
    if (checkoutData.rooms.length === 0) {
      navigate(`${rolePrefix}/booking`);
    }
  }, [checkoutData.rooms.length, navigate, rolePrefix]);

  const updateCheckoutData = (updates: Partial<CheckoutData>) => {
    setCheckoutData((prev) => ({ ...prev, ...updates }));
  };

  // Note: Promotion fetching is now handled in PaymentStep component
  // This ensures promotions are only fetched when user is logged in

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep((prev) => (prev + 1) as CheckoutStep);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as CheckoutStep);
    } else {
      navigate(`${rolePrefix}/booking`);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <ConfirmBookingStep
            checkoutData={checkoutData}
            updateCheckoutData={updateCheckoutData}
            rolePrefix={rolePrefix}
          />
        );
      case 2:
        return (
          <ExtrasStep
            checkoutData={checkoutData}
            updateCheckoutData={updateCheckoutData}
            rolePrefix={rolePrefix}
          />
        );
      case 3:
        return (
          <GuestDetailsStep
            checkoutData={checkoutData}
            updateCheckoutData={updateCheckoutData}
          />
        );
      case 4:
        return (
          <PaymentStep
            checkoutData={checkoutData}
            rolePrefix={rolePrefix}
            updateCheckoutData={updateCheckoutData}
            onPromotionsChange={setPromotions}
          />
        );
      default:
        return null;
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return checkoutData.rooms.length > 0;
      case 2:
        return true; // Extras are optional
      case 3:
        return !!(
          checkoutData.guestInfo?.fullName &&
          checkoutData.guestInfo?.email &&
          checkoutData.guestInfo?.phone
        );
      case 4:
        return !!checkoutData.paymentMethod;
      default:
        return false;
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return "Xác nhận đặt phòng";
      case 2:
        return "Dịch vụ bổ sung";
      case 3:
        return "Thông tin khách hàng";
      case 4:
        return "Thanh toán";
      default:
        return "Checkout";
    }
  };

  const getStepSubtitle = () => {
    switch (currentStep) {
      case 1:
        return "Xem lại thông tin phòng bạn đã chọn";
      case 2:
        return "Thêm dịch vụ và ghi chú cho từng phòng";
      case 3:
        return "Vui lòng cung cấp thông tin liên hệ của bạn";
      case 4:
        return "Chọn phương thức thanh toán phù hợp";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section - Only show for client */}
      {!rolePrefix && (
        <VideoHero
          title={getStepTitle()}
          subtitle={getStepSubtitle()}
        />
      )}

      <div className="container mx-auto px-4 py-8">
        {/* Progress Bar */}
        <ProgressBar currentStep={currentStep} />

        {/* All steps use same layout with BookingSummary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {currentStep === 4 ? (
              <Card className="p-6">{renderStep()}</Card>
            ) : (
              renderStep()
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-6">
              <Button
                variant="outline"
                onClick={handleBack}
                className="flex items-center gap-2"
                disabled={currentStep === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Quay lại
              </Button>
              {currentStep < 4 && (
                <Button
                  onClick={handleNext}
                  disabled={!canProceed()}
                  className="flex items-center gap-2 bg-primary hover:bg-primary/90"
                >
                  Tiếp theo
                  <ChevronRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Booking Summary Sidebar */}
          <div className="lg:col-span-1">
            <BookingSummary
              checkIn={checkoutData.checkIn}
              checkOut={checkoutData.checkOut}
              guests={checkoutData.guests}
              nights={checkoutData.nights}
              bookingRooms={checkoutData.rooms}
              roomExtras={checkoutData.roomExtras}
              selectedPromotionId={checkoutData.selectedPromotionId}
              promotions={promotions}
              showProceedButton={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

