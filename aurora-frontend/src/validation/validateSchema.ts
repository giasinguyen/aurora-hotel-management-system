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
  firstName: Yup.string()
    .optional()
    .max(100, "Họ không được quá 100 ký tự"),
  lastName: Yup.string()
    .optional()
    .max(100, "Tên không được quá 100 ký tự"),
  phone: Yup.string()
    .test('phone-valid', 'Số điện thoại phải có 10 chữ số', function(value) {
      if (!value) return true; // phone is optional
      return /^[0-9]{10}$/.test(value);
    }),
  dob: Yup.string()
    .optional()
    .test('dob-valid', 'Ngày sinh không hợp lệ', function(value) {
      if (!value) return true; // dob is optional
      const date = new Date(value);
      return !isNaN(date.getTime()) && date <= new Date();
    }),
  address: Yup.string()
    .optional()
    .max(500, "Địa chỉ không được quá 500 ký tự"),
  password: Yup.string()
    .required("Mật khẩu không được để trống")
    .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
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