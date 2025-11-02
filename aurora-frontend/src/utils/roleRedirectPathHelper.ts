/**
 * Get the default redirect path based on user roles
 * Priority: ADMIN > MANAGER > STAFF > CUSTOMER
 */
export const getRoleRedirectPath = (roles: string[]): string => {
  if (!roles || roles.length === 0) {
    return "/";
  }

  // Admin has highest priority
  if (roles.includes("ADMIN")) {
    return "/admin";
  }

  // Manager second priority
  if (roles.includes("MANAGER")) {
    return "/manager";
  }

  // Staff third priority
  if (roles.includes("STAFF")) {
    return "/staff";
  }

  // Default to home page for customer or other roles
  return "/";
};
