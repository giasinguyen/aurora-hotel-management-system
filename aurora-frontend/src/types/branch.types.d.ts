// ==================== BRANCH TYPES ====================

export interface BranchResponse {
  id: string;
  code: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  email?: string;
  description?: string;
  status: string;
  managerId?: string;
  rating?: number;
  images?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface BranchCreationRequest {
  code: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  email?: string;
  description?: string;
  status?: string;
  managerId?: string;
  images?: string[];
}

export interface BranchUpdateRequest {
  code?: string;
  name?: string;
  address?: string;
  city?: string;
  phone?: string;
  email?: string;
  description?: string;
  status?: string;
  images?: string[];
}
