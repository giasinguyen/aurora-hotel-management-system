import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { CheckoutData } from "../index";

interface GuestDetailsStepProps {
  checkoutData: CheckoutData;
  updateCheckoutData: (updates: Partial<CheckoutData>) => void;
}

export default function GuestDetailsStep({
  checkoutData,
  updateCheckoutData,
}: GuestDetailsStepProps) {
  const guestInfo = checkoutData.guestInfo || {
    fullName: "",
    email: "",
    phone: "",
    specialRequests: "",
  };

  const handleChange = (field: string, value: string) => {
    updateCheckoutData({
      guestInfo: {
        ...guestInfo,
        [field]: value,
      },
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Guest Details</h2>
        <p className="text-gray-600">
          Please provide your contact information for the booking
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">
              Full Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="fullName"
              value={guestInfo.fullName}
              onChange={(e) => handleChange("fullName", e.target.value)}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">
              Email <span className="text-destructive">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              value={guestInfo.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="your.email@example.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">
              Phone Number <span className="text-destructive">*</span>
            </Label>
            <Input
              id="phone"
              type="tel"
              value={guestInfo.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              placeholder="+84 123 456 789"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="specialRequests">Special Requests (Optional)</Label>
            <Textarea
              id="specialRequests"
              value={guestInfo.specialRequests || ""}
              onChange={(e) =>
                handleChange("specialRequests", e.target.value)
              }
              placeholder="Any special requests or preferences..."
              rows={4}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

