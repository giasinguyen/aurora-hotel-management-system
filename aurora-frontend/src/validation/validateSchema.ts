import * as Yup from "yup";

// ==================== AUTH VALIDATION SCHEMAS ====================

export const loginSchema = Yup.object().shape({
  username: Yup.string()
    .required("Tên đăng nhập không được để trống")
    .min(3, "Tên đăng nhập phải có ít nhất 3 ký tự")
    .max(50, "Tên đăng nhập không được quá 50 ký tự"),
  password: Yup.string()
    .required("Mật khẩu không được để trống")
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
});

export const registerSchema = Yup.object().shape({
  username: Yup.string()
    .required("Tên đăng nhập không được để trống")
    .min(3, "Tên đăng nhập phải có ít nhất 3 ký tự")
    .max(50, "Tên đăng nhập không được quá 50 ký tự")
    .matches(/^[a-zA-Z0-9_]+$/, "Tên đăng nhập chỉ được chứa chữ cái, số và dấu gạch dưới"),
  email: Yup.string()
    .required("Email không được để trống")
    .email("Email không hợp lệ")
    .max(100, "Email không được quá 100 ký tự"),
  fullName: Yup.string()
    .required("Họ và tên không được để trống")
    .min(2, "Họ và tên phải có ít nhất 2 ký tự")
    .max(100, "Họ và tên không được quá 100 ký tự"),
  phone: Yup.string()
    .test('phone-valid', 'Số điện thoại phải có 10 chữ số', function(value) {
      if (!value) return true; // phone is optional
      return /^[0-9]{10}$/.test(value);
    }),
  password: Yup.string()
    .required("Mật khẩu không được để trống")
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
    .max(50, "Mật khẩu không được quá 50 ký tự"),
  confirmPassword: Yup.string()
    .required("Vui lòng xác nhận mật khẩu")
    .oneOf([Yup.ref("password")], "Mật khẩu xác nhận không khớp"),
});

export const forgotPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .required("Email không được để trống")
    .email("Email không hợp lệ"),
});

export const resetPasswordSchema = Yup.object().shape({
  password: Yup.string()
    .required("Mật khẩu không được để trống")
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
    .max(50, "Mật khẩu không được quá 50 ký tự"),
  confirmPassword: Yup.string()
    .required("Vui lòng xác nhận mật khẩu")
    .oneOf([Yup.ref("password")], "Mật khẩu xác nhận không khớp"),
});