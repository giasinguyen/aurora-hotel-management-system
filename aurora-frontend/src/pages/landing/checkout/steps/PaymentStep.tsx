import { CreditCard, Building2, Lock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import type { CheckoutData } from "../index";

interface PaymentStepProps {
  checkoutData: CheckoutData;
  updateCheckoutData: (updates: Partial<CheckoutData>) => void;
}

export default function PaymentStep({
  checkoutData,
  updateCheckoutData,
}: PaymentStepProps) {
  const { paymentMethod } = checkoutData;

  const handlePaymentMethodChange = (value: string) => {
    updateCheckoutData({
      paymentMethod: value as "credit-card" | "bank-transfer",
    });
  };

  const handleCompleteBooking = () => {
    // TODO: Call API to create booking
    console.log("Completing booking with data:", checkoutData);
    // Navigate to confirmation page
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Payment</h2>
        <p className="text-gray-600">
          Choose your preferred payment method
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Select Payment Method</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={paymentMethod || ""}
            onValueChange={handlePaymentMethodChange}
            className="space-y-4"
          >
            {/* Credit Card Option */}
            <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
              <RadioGroupItem value="credit-card" id="credit-card" className="mt-1" />
              <Label
                htmlFor="credit-card"
                className="flex-1 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <CreditCard className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">Credit/Debit Card</p>
                    <p className="text-sm text-gray-500">
                      Pay securely with your card
                    </p>
                  </div>
                </div>
              </Label>
            </div>

            {/* Bank Transfer Option */}
            <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
              <RadioGroupItem
                value="bank-transfer"
                id="bank-transfer"
                className="mt-1"
              />
              <Label
                htmlFor="bank-transfer"
                className="flex-1 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Building2 className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">Bank Transfer</p>
                    <p className="text-sm text-gray-500">
                      Transfer directly to our bank account
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
                Secure Payment
              </p>
              <p className="text-xs text-blue-700 mt-1">
                Your payment information is encrypted and secure. We never store
                your card details.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Complete Booking Button */}
      <div className="pt-4">
        <Button
          onClick={handleCompleteBooking}
          disabled={!paymentMethod}
          className="w-full bg-primary hover:bg-primary/90 text-lg py-6"
          size="lg"
        >
          Complete Booking
        </Button>
        <p className="text-xs text-center text-gray-500 mt-2">
          By completing this booking, you agree to our Terms & Conditions
        </p>
      </div>
    </div>
  );
}

