export interface DocumentResponse {
  id: string;
  filename: string;
  fileType: string;
  size: number;
  docUrl: string;
  publicId: string;
  isEmbed: boolean;
  totalChunks?: number;
  metadata?: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
}

export interface DocumentUploadRequest {
  file: File;
  shouldEmbed?: boolean;
}

export interface DocumentUpdateRequest {
  id: string;
  file: File;
  shouldEmbed?: boolean;
}

export interface DocumentMetadata {
  title?: string;
  category?: string;
  description?: string;
  tags?: string[];
  owner?: string;
}
