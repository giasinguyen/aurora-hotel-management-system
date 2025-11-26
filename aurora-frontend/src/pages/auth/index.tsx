import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAppSelector } from "@/hooks/useRedux";
import Login from "./Login";
import Register from "./Register";
import ResetPasswordPage from "./ResetPassword";
import ForgotPasswordPage from "./ForgotPassword";
import { getRoleRedirectPath } from "@/utils/roleRedirectPathHelper";

const AuthPage = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const mode = params.get("mode");

  const loginRef = useRef<HTMLDivElement | null>(null);
  const registerRef = useRef<HTMLDivElement | null>(null);
  const forgotPasswordRef = useRef<HTMLDivElement | null>(null);
  const resetPasswordRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (mode && !["login", "register", "forgot-password", "reset-password"].includes(mode)) {
      navigate("/auth?mode=login");
    }
  }, [mode, navigate]);

  const { isLogin, user } = useAppSelector((state) => state.auth);
  useEffect(() => {
    if (isLogin) {
      const redirectPath = getRoleRedirectPath(user.roles);
      navigate(redirectPath, { replace: true });
    }
  }, [isLogin, user.roles, navigate]);

  useEffect(() => {
    if (mode === "login" && loginRef.current) {
      loginRef.current.scrollIntoView({ behavior: "smooth" });
    }
    if (mode === "register" && registerRef.current) {
      registerRef.current.scrollIntoView({ behavior: "smooth" });
    }
    if (mode === "forgot-password" && forgotPasswordRef.current) {
      forgotPasswordRef.current.scrollIntoView({ behavior: "smooth" });
    }
    if (mode === "reset-password" && resetPasswordRef.current) {
      resetPasswordRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [mode]);

  return (
    <div className="bg-gradient-to-br from-orange-50 to-orange-100">
      {mode === "login" && (
        <div ref={loginRef}>
          <Login />
        </div>
      )}
      {mode === "register" && (
        <div ref={registerRef}>
          <Register />
        </div>
      )}
      {mode === "forgot-password" && (
        <div ref={forgotPasswordRef}>
          <ForgotPasswordPage />
        </div>
      )}
      {mode === "reset-password" && (
        <div ref={resetPasswordRef}>
          <ResetPasswordPage />
        </div>
      )}
    </div>
  );
};

export default AuthPage;
