import axiosClient from '@/config/axiosClient';
import type { ApiResponse } from '@/types/apiResponse';
import type { DocumentResponse } from '@/types/document.types';

const BASE_URL = '/api/v1/documents';

/**
 * Upload a new document
 */
export const uploadDocument = async (
  file: File,
  shouldEmbed: boolean = false,
  description?: string
): Promise<ApiResponse<DocumentResponse>> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('shouldEmbed', shouldEmbed.toString());
  if (description) {
    formData.append('description', description);
  }

  const response = await axiosClient.post(`${BASE_URL}/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

/**
 * Get all documents
 */
export const getAllDocuments = async (): Promise<ApiResponse<DocumentResponse[]>> => {
  const response = await axiosClient.get(`${BASE_URL}`);
  return response.data;
};

/**
 * Get document by ID
 */
export const getDocumentById = async (id: string): Promise<ApiResponse<DocumentResponse>> => {
  const response = await axiosClient.get(`${BASE_URL}/${id}`);
  return response.data;
};

/**
 * Update document
 */
export const updateDocument = async (
  id: string,
  file: File,
  shouldEmbed: boolean = false,
  description?: string
): Promise<ApiResponse<DocumentResponse>> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('shouldEmbed', shouldEmbed.toString());
  if (description) {
    formData.append('description', description);
  }

  const response = await axiosClient.put(`${BASE_URL}/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

/**
 * Update document metadata only (without file upload)
 */
export const updateDocumentMetadata = async (
  id: string,
  description?: string,
  shouldEmbed?: boolean
): Promise<ApiResponse<DocumentResponse>> => {
  const params = new URLSearchParams();
  if (description !== undefined) {
    params.append('description', description);
  }
  if (shouldEmbed !== undefined) {
    params.append('shouldEmbed', shouldEmbed.toString());
  }

  const response = await axiosClient.post(
    `${BASE_URL}/${id}/metadata?${params.toString()}`
  );
  return response.data;
};

/**
 * Delete document
 */
export const deleteDocument = async (id: string): Promise<ApiResponse<void>> => {
  const response = await axiosClient.delete(`${BASE_URL}/${id}`);
  return response.data;
};

/**
 * Remove chunking from document
 */
export const removeChunking = async (id: string): Promise<ApiResponse<DocumentResponse>> => {
  const response = await axiosClient.post(`${BASE_URL}/${id}/remove-chunking`);
  return response.data;
};

/**
 * Re-chunk document
 */
export const reChunkDocument = async (id: string): Promise<ApiResponse<DocumentResponse>> => {
  const response = await axiosClient.post(`${BASE_URL}/${id}/re-chunk`);
  return response.data;
};

/**
 * Reindex all documents
 */
export const reindexAllDocuments = async (): Promise<ApiResponse<void>> => {
  const response = await axiosClient.post(`${BASE_URL}/reindex-all`);
  return response.data;
};

/**
 * Check if document is indexed
 */
export const isDocumentIndexed = async (id: string): Promise<ApiResponse<boolean>> => {
  const response = await axiosClient.get(`${BASE_URL}/${id}/is-indexed`);
  return response.data;
};
