// Service Category Types for Aurora Hotel Management System

export interface ServiceCategory {
  id: string;
  branchId: string;
  branchName: string;
  name: string;
  code: string;
  description?: string;
  displayOrder: number;
  active: boolean;
  imageUrl?: string;
  totalServices?: number;
  services?: any[]; // Optional: Service[]
}

export interface ServiceCategoryRequest {
  branchId: string;
  name: string;
  code: string;
  description?: string;
  displayOrder?: number;
  active?: boolean;
  imageUrl?: string;
}


