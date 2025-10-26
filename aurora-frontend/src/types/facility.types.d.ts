// ==================== FACILITY TYPES ====================

export interface FacilityResponse {
  id: string;
  hotelId: string;
  name: string;
  type: string;
  description?: string;
  availability?: boolean;
  openingHours?: string;
  closingHours?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FacilityCreationRequest {
  hotelId: string;
  name: string;
  type: string;
  description?: string;
  availability?: boolean;
  openingHours?: string;
  closingHours?: string;
}

export interface FacilityUpdateRequest {
  name?: string;
  type?: string;
  description?: string;
  availability?: boolean;
  openingHours?: string;
  closingHours?: string;
}
