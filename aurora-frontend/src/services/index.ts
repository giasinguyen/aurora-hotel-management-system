// Export all API services
export * from "./authApi";
export * from "./userApi";
export * from "./roomApi";
export * from "./roomTypeApi";
export * from "./branchApi";
export * from "./bookingApi";
export * from "./serviceApi";
export * from "./paymentApi";
export * from "./promotionApi";
export * from "./amenityApi";
export * from "./facilityApi";

// Export role and permission APIs separately to avoid conflicts
export {
  createRoleApi,
  getAllRolesApi,
  getRolesWithPaginationApi,
  getRoleByIdApi,
  updateRoleApi,
  deleteRoleApi,
  getAllPermissionsApi,
  getPermissionsWithPaginationApi,
  getPermissionByIdApi,
} from "./roleApi";

// Export role types explicitly
export type {
  RoleCreationRequest,
  RoleUpdateRequest,
} from "@/types/role.types.d";
