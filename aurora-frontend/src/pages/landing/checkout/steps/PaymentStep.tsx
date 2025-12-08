import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CreditCard, Building2, Lock, Wallet, Smartphone, Loader2, Tag } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { bookingApi } from "@/services/bookingApi";
import { vnpayService } from "@/services/vnpayService";
import { promotionApi } from "@/services/promotionApi";
import roomAvailabilityApi from "@/services/roomAvailabilityApi";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import type { CheckoutData } from "../index";
import type { RootState } from "@/features/store";
import type { CheckoutRequest } from "@/types/checkout.types";
import type { Promotion } from "@/types/promotion.types";

interface PaymentStepProps {
  checkoutData: CheckoutData;
  updateCheckoutData: (updates: Partial<CheckoutData>) => void;
  rolePrefix?: string;
  onPromotionsChange?: (promotions: Promotion[]) => void; // Callback to pass promotions to parent
}

export default function PaymentStep({
  checkoutData,
  updateCheckoutData,
  rolePrefix = '',
  onPromotionsChange,
}: PaymentStepProps) {
  const navigate = useNavigate();
  const { paymentMethod, rooms, checkIn, checkOut, guests, nights, roomExtras, guestInfo, selectedPromotionId } = checkoutData;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [isLoadingPromotions, setIsLoadingPromotions] = useState(false);
  
  // Get current user from Redux
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const isLogin = useSelector((state: RootState) => state.auth.isLogin);
  
  // Check if user has admin/staff/manager role
  const userRoles = currentUser?.roles || [];
  const isAdminStaffManager = userRoles.some(role => 
    role === 'ADMIN' || role === 'STAFF' || role === 'MANAGER'
  ) || rolePrefix !== ''; // Also check rolePrefix from URL
  
  // Get branchId from localStorage
  const branchId = localStorage.getItem("branchId") || "branch-hcm-001";

  // Set default payment method based on role
  useEffect(() => {
    if (!paymentMethod) {
      // If client (not admin/staff/manager), default to VNPay only
      if (!isAdminStaffManager) {
        updateCheckoutData({ paymentMethod: "vnpay" });
      } else {
        // Admin/Staff/Manager can choose, default to cash
        updateCheckoutData({ paymentMethod: "cash" });
      }
    } else if (!isAdminStaffManager && paymentMethod === "cash") {
      // If client tries to select cash, force to VNPay
      updateCheckoutData({ paymentMethod: "vnpay" });
    }
  }, [isAdminStaffManager, paymentMethod]);

  // Fetch active promotions - ONLY if user is logged in
  useEffect(() => {
    // If user is not logged in, clear promotions and selected promotion
    if (!isLogin) {
      setPromotions([]);
      if (onPromotionsChange) {
        onPromotionsChange([]);
      }
      if (selectedPromotionId) {
        updateCheckoutData({ selectedPromotionId: undefined });
      }
      return;
    }

    const fetchPromotions = async () => {
      try {
        setIsLoadingPromotions(true);
        const today = new Date().toISOString().split('T')[0];
        
        const response = await promotionApi.getActive({
          page: 0,
          size: 100,
          sortBy: 'priority',
          sortDir: 'desc', // Highest priority first
        });
        
        // Filter promotions that are valid for current booking
        const validPromotions = (response.result?.content || []).filter((promo) => {
          // Check if promotion is active
          if (!promo.active) {
            return false;
          }
          
          // Check date range - must be within startDate and endDate (inclusive)
          const startDate = new Date(promo.startDate);
          const endDate = new Date(promo.endDate);
          const todayDate = new Date(today);
          
          // Set time to start of day for accurate comparison
          startDate.setHours(0, 0, 0, 0);
          endDate.setHours(23, 59, 59, 999); // End of day
          todayDate.setHours(0, 0, 0, 0);
          
          if (todayDate < startDate || todayDate > endDate) {
            return false;
          }
          
          // Check branch (null = all branches)
          if (promo.branchId && promo.branchId !== branchId) {
            return false;
          }
          
          // Check minimum nights
          if (promo.minNights && nights < promo.minNights) {
            return false;
          }
          
          return true;
        });
        
        setPromotions(validPromotions);
        
        // Notify parent component about promotions (for BookingSummary)
        if (onPromotionsChange) {
          onPromotionsChange(validPromotions);
        }
        
        // Auto-select promotion with highest priority if none selected
        if (validPromotions.length > 0 && !selectedPromotionId) {
          const highestPriorityPromo = validPromotions[0]; // Already sorted by priority desc
          updateCheckoutData({ selectedPromotionId: highestPriorityPromo.id });
        }
      } catch (error) {
        console.error('Failed to fetch promotions:', error);
        // Don't show error toast - promotions are optional
      } finally {
        setIsLoadingPromotions(false);
      }
    };
    
    fetchPromotions();
  }, [isLogin, checkIn, checkOut, nights, branchId, selectedPromotionId]); // Re-fetch when login status or booking details change

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

  // Calculate discount from selected promotion
  const calculateDiscount = () => {
    if (!selectedPromotionId) return 0;
    
    const promotion = promotions.find(p => p.id === selectedPromotionId);
    if (!promotion) return 0;
    
    const subtotal = calculateTotalAmount();
    
    if (promotion.discountType === 'FIXED_AMOUNT' && promotion.amountOff) {
      // Fixed amount discount - cannot exceed subtotal
      return Math.min(promotion.amountOff, subtotal);
    }
    
    return 0;
  };

  // Get selected promotion
  const selectedPromotion = promotions.find(p => p.id === selectedPromotionId);

  const handleCompleteBooking = async () => {
    if (!paymentMethod) {
      toast.error("Vui lòng chọn phương thức thanh toán");
      return;
    }

    try {
      setIsSubmitting(true);
      
      // ===== BƯỚC 1: KIỂM TRA LẠI TÍNH KHẢ DỤNG CỦA PHÒNG =====
      // Đây là bước quan trọng để tránh race condition
      console.log("🔍 Checking room availability before booking...");
      
      const roomIds = rooms.map(room => room.roomId);
      const availabilityResponse = await roomAvailabilityApi.checkMultipleRooms(
        roomIds,
        checkIn,
        checkOut
      );
      
      // Kiểm tra từng phòng
      const unavailableRooms: string[] = [];
      if (availabilityResponse.result) {
        Object.entries(availabilityResponse.result).forEach(([roomId, isAvailable]) => {
          if (!isAvailable) {
            const room = rooms.find(r => r.roomId === roomId);
            if (room) {
              unavailableRooms.push(room.roomNumber || room.roomTypeName);
            }
          }
        });
      }
      
      // Nếu có phòng không khả dụng, chặn lại
      if (unavailableRooms.length > 0) {
        setIsSubmitting(false);
        toast.error(
          `Phòng ${unavailableRooms.join(", ")} vừa được đặt bởi khách hàng khác!`,
          {
            description: "Vui lòng chọn phòng khác hoặc thay đổi ngày đặt.",
            duration: 5000,
          }
        );
        
        // Navigate back to booking page to select different rooms
        if (rolePrefix) {
          navigate(`${rolePrefix}/booking`);
        } else {
          navigate('/booking');
        }
        return;
      }
      
      console.log("✅ All rooms are available, proceeding with booking...");
      
      // ===== BƯỚC 2: TẠO BOOKING =====
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
        promotionId: isLogin ? (selectedPromotionId || undefined) : undefined, // Only include promotion if user is logged in
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
            
            // Navigate based on role
            if (rolePrefix) {
              // Admin/Manager/Staff: go to bookings list
              navigate(`${rolePrefix}/bookings`);
            } else {
              // Client: go to success page
              navigate(`/booking/success?bookingId=${bookingId}&bookingCode=${bookingCode}`);
            }
            return;
          }
        }
        
        // For cash payment, show success immediately
        toast.success("Đặt phòng thành công!");
        
        // Clear localStorage
        localStorage.removeItem("bookingRooms");
        localStorage.removeItem("bookingFilter");
        localStorage.removeItem("checkoutData");
        
        // Navigate based on role
        if (rolePrefix) {
          // Admin/Manager/Staff: go to bookings list
          navigate(`${rolePrefix}/bookings`);
        } else {
          // Client: go to success page
          navigate(`/booking/success?bookingId=${bookingId}&bookingCode=${bookingCode}`);
        }
      }
    } catch (error: unknown) {
      console.error("Failed to create booking:", error);
      
      // Log detailed error information
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: unknown; status?: number } };
        console.error("Error Status:", axiosError.response?.status);
        console.error("Error Data:", JSON.stringify(axiosError.response?.data, null, 2));
      }
      
      // Extract error message from various response formats
      let errorMessage = "Đặt phòng thất bại. Vui lòng thử lại.";
      
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: unknown } };
        const responseData = axiosError.response?.data;
        
        if (responseData) {
          // Try to extract message from different error formats
          if (typeof responseData === 'string') {
            errorMessage = responseData;
          } else if (typeof responseData === 'object' && responseData !== null) {
            const data = responseData as Record<string, unknown>;
            if (typeof data.message === 'string') {
              errorMessage = data.message;
            } else if (typeof data.error === 'string') {
              errorMessage = data.error;
            } else if (data.errors) {
              // Validation errors array
              const errors = Array.isArray(data.errors) 
                ? data.errors.map((e: unknown) => {
                    if (typeof e === 'object' && e !== null && 'message' in e) {
                      return (e as { message: string }).message;
                    }
                    return String(e);
                  }).join(', ')
                : JSON.stringify(data.errors);
              errorMessage = `Validation errors: ${errors}`;
            }
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

      {/* Promotion Selection - Only show if user is logged in */}
      {isLogin && promotions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Tag className="h-5 w-5 text-primary" />
              Khuyến mãi
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingPromotions ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="promotion">Chọn khuyến mãi</Label>
                <Select
                  value={selectedPromotionId || "none"}
                  onValueChange={(value) => {
                    updateCheckoutData({ 
                      selectedPromotionId: value === "none" ? undefined : value
                    });
                  }}
                >
                  <SelectTrigger id="promotion" className="h-11">
                    <SelectValue placeholder="Không sử dụng khuyến mãi" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Không sử dụng khuyến mãi</SelectItem>
                    {promotions.map((promo) => (
                      <SelectItem key={promo.id} value={promo.id}>
                        <div className="flex items-center justify-between w-full">
                          <div>
                            <div className="font-semibold">{promo.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {promo.discountType === 'FIXED_AMOUNT' 
                                ? `Giảm ${new Intl.NumberFormat('vi-VN').format(promo.amountOff || 0)}đ`
                                : `Giảm ${promo.percentOff || 0}%`}
                            </div>
                          </div>
                          {promo.code && (
                            <span className="ml-4 text-xs font-mono bg-primary/10 text-primary px-2 py-1 rounded">
                              {promo.code}
                            </span>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedPromotion && (
                  <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-800">
                      <span className="font-semibold">Đã áp dụng:</span> {selectedPromotion.name}
                      {selectedPromotion.code && (
                        <span className="ml-2 font-mono text-xs">({selectedPromotion.code})</span>
                      )}
                    </p>
                    <p className="text-xs text-green-600 mt-1">
                      Bạn sẽ được giảm {new Intl.NumberFormat('vi-VN').format(calculateDiscount())}đ
                    </p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Phương thức thanh toán</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={paymentMethod || (isAdminStaffManager ? "cash" : "vnpay")}
            onValueChange={handlePaymentMethodChange}
            className="space-y-4"
          >
            {/* Cash Option - Only for Admin/Staff/Manager */}
            {isAdminStaffManager && (
              <div className={`flex items-start space-x-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                paymentMethod === 'cash' 
                  ? 'border-primary bg-primary/5' 
                  : 'border-gray-200 hover:border-primary/50'
              }`}>
                <RadioGroupItem value="cash" id="cash" className="mt-1" />
                <Label
                  htmlFor="cash"
                  className="flex-1 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      paymentMethod === 'cash' ? 'bg-primary/20' : 'bg-gray-100'
                    }`}>
                      <Wallet className={`h-5 w-5 ${
                        paymentMethod === 'cash' ? 'text-primary' : 'text-gray-600'
                      }`} />
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
            )}

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
