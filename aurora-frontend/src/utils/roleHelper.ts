import type { User } from "@/types/auth.types";

/**
 * Xác định đường dẫn redirect dựa trên role của user
 * Priority: ADMIN > MANAGER > STAFF > CUSTOMER/GUEST
 */
export const getRedirectPathByRole = (user: User | null): string => {
  if (!user || !user.roles || user.roles.length === 0) {
    return "/";
  }

  // Check roles theo thứ tự ưu tiên
  const roleNames = user.roles.map((role) => role.name.toUpperCase());

  if (roleNames.includes("ADMIN")) {
    return "/admin";
  }

  if (roleNames.includes("MANAGER")) {
    return "/manager";
  }

  if (roleNames.includes("STAFF")) {
    return "/staff";
  }

  // CUSTOMER và GUEST redirect về home
  return "/";
};

/**
 * Kiểm tra xem user có role cụ thể không
 */
export const hasRole = (user: User | null, roleName: string): boolean => {
  if (!user || !user.roles) {
    return false;
  }
  return user.roles.some((role) => role.name.toUpperCase() === roleName.toUpperCase());
};

/**
 * Lấy role cao nhất của user
 */
export const getHighestRole = (user: User | null): string | null => {
  if (!user || !user.roles || user.roles.length === 0) {
    return null;
  }

  const roleNames = user.roles.map((role) => role.name.toUpperCase());

  if (roleNames.includes("ADMIN")) return "ADMIN";
  if (roleNames.includes("MANAGER")) return "MANAGER";
  if (roleNames.includes("STAFF")) return "STAFF";
  if (roleNames.includes("CUSTOMER")) return "CUSTOMER";
  if (roleNames.includes("GUEST")) return "GUEST";

  return user.roles[0].name;
};

