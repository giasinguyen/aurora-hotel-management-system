import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CreditCard, Building2, Lock, Wallet, Smartphone, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { bookingApi } from "@/services/bookingApi";
import { vnpayService } from "@/services/vnpayService";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import type { CheckoutData } from "../index";
import type { RootState } from "@/features/store";
import type { CheckoutRequest } from "@/types/checkout.types";

interface PaymentStepProps {
  checkoutData: CheckoutData;
  updateCheckoutData: (updates: Partial<CheckoutData>) => void;
}

export default function PaymentStep({
  checkoutData,
  updateCheckoutData,
}: PaymentStepProps) {
  const navigate = useNavigate();
  const { paymentMethod, rooms, checkIn, checkOut, guests, nights, roomExtras, guestInfo } = checkoutData;
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Get current user from Redux
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const isLogin = useSelector((state: RootState) => state.auth.isLogin);
  
  // Get branchId from localStorage
  const branchId = localStorage.getItem("branchId") || "branch-hcm-001";

  const handlePaymentMethodChange = (value: string) => {
    updateCheckoutData({
      paymentMethod: value as "cash" | "vnpay" | "momo" | "visa",
    });
  };

  // Calculate total amount
  const calculateTotalAmount = () => {
    const roomsTotal = rooms.reduce((sum, room) => sum + room.basePrice, 0) * nights;
    let servicesTotal = 0;
    if (roomExtras) {
      Object.values(roomExtras).forEach((extras) => {
        extras.services.forEach((service) => {
          servicesTotal += service.price * service.quantity;
        });
      });
    }
    return roomsTotal + servicesTotal;
  };

  const handleCompleteBooking = async () => {
    if (!paymentMethod) {
      toast.error("Vui l\u00f2ng ch\u1ecdn ph\u01b0\u01a1ng th\u1ee9c thanh to\u00e1n");
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Prepare rooms data
      const roomBookings = rooms.map((room) => ({
        roomId: room.roomId,
        pricePerNight: room.basePrice,
        roomNotes: roomExtras[room.roomId]?.note || "",
      }));
      
      // Prepare services data (flatten from roomExtras)
      const serviceBookings: CheckoutRequest["services"] = [];
      if (roomExtras) {
        Object.entries(roomExtras).forEach(([roomId, extras]) => {
          if (extras.services && extras.services.length > 0) {
            extras.services.forEach((service) => {
              serviceBookings.push({
                serviceId: service.serviceId,
                roomId: roomId,
                quantity: service.quantity,
                price: service.price,
              });
            });
          }
        });
      }
      
      // Prepare checkout request
      const checkoutRequest: CheckoutRequest = {
        branchId: branchId,
        customerId: isLogin && currentUser?.id ? currentUser.id : null,
        guestFullName: guestInfo?.fullName,
        guestEmail: guestInfo?.email,
        guestPhone: guestInfo?.phone,
        checkIn: checkIn,
        checkOut: checkOut,
        guests: guests,
        nights: nights,
        specialRequests: guestInfo?.specialRequests || "",
        paymentMethod: paymentMethod,
        paymentSuccess: true, // Always true to create booking
        rooms: roomBookings,
        services: serviceBookings.length > 0 ? serviceBookings : undefined,
      };
      
      console.log("Checkout Request:", JSON.stringify(checkoutRequest, null, 2));
      
      // Call API to create booking
      const response = await bookingApi.checkout(checkoutRequest);
      
      if (response.result) {
        const bookingId = response.result.id;
        const bookingCode = response.result.bookingCode;
        
        // If VNPay, redirect to payment gateway
        if (paymentMethod === "vnpay") {
          try {
            const paymentResponse = await vnpayService.createPaymentUrl({
              bookingId: bookingId,
              language: "vn",
            });
            
            if (paymentResponse.result?.paymentUrl) {
              // Save booking info to localStorage before redirect
              localStorage.setItem("pendingBooking", JSON.stringify({
                bookingId,
                bookingCode,
                timestamp: Date.now()
              }));
              
              // Redirect to VNPay
              toast.success("Đang chuyển đến cổng thanh toán VNPay...");
              window.location.href = paymentResponse.result.paymentUrl;
              return;
            }
          } catch (vnpayError) {
            console.error("VNPay payment creation failed:", vnpayError);
            toast.error("Không thể tạo thanh toán VNPay. Booking đã được tạo với mã " + bookingCode);
            setIsSubmitting(false);
            
            // Navigate to booking details even if VNPay fails
            navigate(`/booking/success?bookingId=${bookingId}&bookingCode=${bookingCode}`);
            return;
          }
        }
        
        // For cash payment, show success immediately
        toast.success("Đặt phòng thành công!");
        
        // Clear localStorage
        localStorage.removeItem("bookingRooms");
        localStorage.removeItem("bookingFilter");
        localStorage.removeItem("checkoutData");
        
        // Navigate to success page with booking ID
        navigate(`/booking/success?bookingId=${bookingId}&bookingCode=${bookingCode}`);
      }
    } catch (error: unknown) {
      console.error("Failed to create booking:", error);
      
      // Log detailed error information
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: any; status?: number } };
        console.error("Error Status:", axiosError.response?.status);
        console.error("Error Data:", JSON.stringify(axiosError.response?.data, null, 2));
      }
      
      // Extract error message from various response formats
      let errorMessage = "Đặt phòng thất bại. Vui lòng thử lại.";
      
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: any } };
        const responseData = axiosError.response?.data;
        
        if (responseData) {
          // Try to extract message from different error formats
          if (typeof responseData === 'string') {
            errorMessage = responseData;
          } else if (responseData.message) {
            errorMessage = responseData.message;
          } else if (responseData.error) {
            errorMessage = responseData.error;
          } else if (responseData.errors) {
            // Validation errors array
            const errors = Array.isArray(responseData.errors) 
              ? responseData.errors.map((e: any) => e.message || e).join(', ')
              : JSON.stringify(responseData.errors);
            errorMessage = `Validation errors: ${errors}`;
          }
        }
      }
      
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Thanh toán</h2>
        <p className="text-gray-600">
          Chọn phương thức thanh toán của bạn
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Phương thức thanh toán</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={paymentMethod || "cash"}
            onValueChange={handlePaymentMethodChange}
            className="space-y-4"
          >
            {/* Cash Option - Active */}
            <div className="flex items-start space-x-3 p-4 border-2 border-primary rounded-lg bg-primary/5 cursor-pointer">
              <RadioGroupItem value="cash" id="cash" className="mt-1" />
              <Label
                htmlFor="cash"
                className="flex-1 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/20 rounded-lg">
                    <Wallet className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">Tiền mặt (Cash)</p>
                    <p className="text-sm text-gray-500">
                      Thanh toán trực tiếp tại khách sạn
                    </p>
                  </div>
                </div>
              </Label>
            </div>

            {/* VNPay Option - Active */}
            <div className={`flex items-start space-x-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
              paymentMethod === 'vnpay' 
                ? 'border-primary bg-primary/5' 
                : 'border-gray-200 hover:border-primary/50'
            }`}>
              <RadioGroupItem value="vnpay" id="vnpay" className="mt-1" />
              <Label
                htmlFor="vnpay"
                className="flex-1 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    paymentMethod === 'vnpay' ? 'bg-primary/20' : 'bg-blue-100'
                  }`}>
                    <Building2 className={`h-5 w-5 ${
                      paymentMethod === 'vnpay' ? 'text-primary' : 'text-blue-600'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">VNPay</p>
                    <p className="text-sm text-gray-500">
                      Thanh toán qua VNPay - An toàn & Nhanh chóng
                    </p>
                  </div>
                </div>
              </Label>
            </div>

            {/* MoMo Option - Disabled */}
            <div className="flex items-start space-x-3 p-4 border rounded-lg bg-gray-50 opacity-60 cursor-not-allowed">
              <RadioGroupItem value="momo" id="momo" className="mt-1" disabled />
              <Label
                htmlFor="momo"
                className="flex-1 cursor-not-allowed"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-200 rounded-lg">
                    <Smartphone className="h-5 w-5 text-gray-500" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-500">MoMo</p>
                    <p className="text-sm text-gray-400">
                      Thanh toán qua ví MoMo (Sắp có)
                    </p>
                  </div>
                </div>
              </Label>
            </div>

            {/* Visa/International Card Option - Disabled */}
            <div className="flex items-start space-x-3 p-4 border rounded-lg bg-gray-50 opacity-60 cursor-not-allowed">
              <RadioGroupItem value="visa" id="visa" className="mt-1" disabled />
              <Label
                htmlFor="visa"
                className="flex-1 cursor-not-allowed"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-200 rounded-lg">
                    <CreditCard className="h-5 w-5 text-gray-500" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-500">Thẻ Visa/Mastercard</p>
                    <p className="text-sm text-gray-400">
                      Thanh toán bằng thẻ quốc tế (Sắp có)
                    </p>
                  </div>
                </div>
              </Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Security Notice */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Lock className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-blue-900">
                Thanh toán an toàn
              </p>
              <p className="text-xs text-blue-700 mt-1">
                Thông tin thanh toán của bạn được mã hóa và bảo mật. Chúng tôi không lưu trữ thông tin thẻ của bạn.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Complete Booking Button */}
      <div className="pt-4">
        <Button
          onClick={handleCompleteBooking}
          disabled={!paymentMethod || isSubmitting}
          className="w-full bg-primary hover:bg-primary/90 text-lg py-6"
          size="lg"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              Đang xử lý...
            </>
          ) : (
            "Hoàn tất đặt phòng"
          )}
        </Button>
        <p className="text-xs text-center text-gray-500 mt-2">
          Bằng cách hoàn tất đặt phòng này, bạn đồng ý với Điều khoản & Điều kiện của chúng tôi
        </p>
      </div>
    </div>
  );
}
