// Branch Types for Aurora Hotel Management System

export interface Branch {
  id: string;
  name: string;
  code: string;
  
  // Address details
  address: string;
  ward: string;
  district: string;
  city: string;
  fullAddress: string;
  
  // Contact
  phone: string;
  email: string;
  
  // Manager info
  managerId?: string;
  managerName?: string;
  managerUsername?: string;
  
  // Status
  status: BranchStatus;
  
  // Operating info
  openingDate: string;
  checkInTime: string;
  checkOutTime: string;
  operatingHours: string;
  
  // Description
  description?: string;
  
  // Statistics
  totalRooms: number;
  totalStaff: number;
  availableRooms: number;
}

export type BranchStatus = 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE';

export interface BranchCreationRequest {
  name: string;
  code: string;
  address: string;
  ward: string;
  district: string;
  city: string;
  phone: string;
  email: string;
  openingDate?: string;
  checkInTime?: string;
  checkOutTime?: string;
  operatingHours?: string;
  description?: string;
}

export interface BranchUpdateRequest {
  name?: string;
  address?: string;
  ward?: string;
  district?: string;
  city?: string;
  phone?: string;
  email?: string;
  status?: BranchStatus;
  checkInTime?: string;
  checkOutTime?: string;
  operatingHours?: string;
  description?: string;
}

export interface BranchSearchParams {
  keyword?: string;
  city?: string;
  status?: BranchStatus;
  page?: number;
  size?: number;
  sortBy?: string;
}

// Status badge configurations
export const BRANCH_STATUS_CONFIG: Record<BranchStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' }> = {
  ACTIVE: { label: 'Hoạt động', variant: 'success' },
  INACTIVE: { label: 'Tạm ngừng', variant: 'warning' },
  MAINTENANCE: { label: 'Bảo trì', variant: 'secondary' },
};
