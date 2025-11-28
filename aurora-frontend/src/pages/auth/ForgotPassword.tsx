import { useState } from "react";
import { Link } from "react-router-dom";
import PageWithCarousel from "@/components/custom/PageWithCarousel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { forgotPasswordSchema } from "@/validation/validateSchema";
import type { ValidationError } from "yup";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [validationError, setValidationError] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setValidationError("");

    setIsLoading(true);

    try {
      // Validate using Yup schema
      await forgotPasswordSchema.validate({ email }, { abortEarly: false });
      
      setSuccess(true);
    } catch (err) {
      if (err instanceof Error && err.name === 'ValidationError') {
        // Handle Yup validation errors
        const yupError = err as ValidationError;
        setValidationError(yupError.errors[0]);
      } else {
        setError("Có lỗi xảy ra. Vui lòng thử lại.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <PageWithCarousel>
        <Card className="w-full max-w-md shadow-2xl backdrop-blur-sm bg-white/95">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900">Email đã được gửi!</h3>
              <p className="text-sm text-gray-600">
                Chúng tôi đã gửi hướng dẫn đặt lại mật khẩu đến email <strong>{email}</strong>.
                Vui lòng kiểm tra hộp thư của bạn.
              </p>
              <div className="pt-4">
                <Link to="/auth?mode=login">
                  <Button className="w-full bg-amber-600 hover:bg-amber-700">
                    Quay lại đăng nhập
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </PageWithCarousel>
    );
  }

  return (
    <PageWithCarousel>
      <Card className="w-full max-w-md shadow-2xl backdrop-blur-sm bg-white/95">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center">
              <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-center text-gray-900">
            Quên mật khẩu
          </CardTitle>
          <CardDescription className="text-center text-gray-600">
            Nhập email của bạn để nhận hướng dẫn đặt lại mật khẩu
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Nhập email của bạn"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setValidationError("");
                }}
                disabled={isLoading}
                className={validationError ? "border-red-500" : ""}
              />
              {validationError && (
                <p className="text-sm text-red-500">{validationError}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-amber-600 hover:bg-amber-700 text-white py-2.5 text-base font-medium"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Đang gửi...
                </span>
              ) : (
                "Gửi hướng dẫn"
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-gray-600 text-center">
            <Link
              to="/auth?mode=login"
              className="font-medium text-amber-600 hover:text-amber-700 transition-colors"
            >
              ← Quay lại đăng nhập
            </Link>
          </div>
          <div className="text-sm text-gray-600 text-center">
            Chưa có tài khoản?{" "}
            <Link
              to="/auth?mode=register"
              className="font-medium text-amber-600 hover:text-amber-700 transition-colors"
            >
              Đăng ký ngay
            </Link>
          </div>
        </CardFooter>
      </Card>
    </PageWithCarousel>
  );
};

export default ForgotPasswordPage;
