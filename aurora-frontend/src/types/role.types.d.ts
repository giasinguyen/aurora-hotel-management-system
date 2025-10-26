// ==================== ROLE TYPES ====================

export interface RoleResponse {
  id: string;
  name: string;
  description?: string;
  permissions?: PermissionResponse[];
  createdAt: string;
  updatedAt: string;
}

export interface PermissionResponse {
  id: string;
  name: string;
  description?: string;
}

export interface RoleCreationRequest {
  name: string;
  description?: string;
  permissionIds?: string[];
}

export interface RoleUpdateRequest {
  name?: string;
  description?: string;
  permissionIds?: string[];
}
