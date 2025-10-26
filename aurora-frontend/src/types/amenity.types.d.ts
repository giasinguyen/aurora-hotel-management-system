// ==================== AMENITY TYPES ====================

export interface AmenityResponse {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  category?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AmenityCreationRequest {
  name: string;
  description?: string;
  icon?: string;
  category?: string;
}

export interface AmenityUpdateRequest {
  name?: string;
  description?: string;
  icon?: string;
  category?: string;
}
