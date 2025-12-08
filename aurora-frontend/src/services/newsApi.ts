import axiosClient from '@/config/axiosClient';
import type { ApiResponse } from '@/types/apiResponse';
import type {
  NewsListResponse,
  NewsDetailResponse,
  NewsVisibilityRequest,
  NewsResponse
} from '@/types/news.types';

const BASE_URL = '/api/v1/news';

/**
 * Get all news (requires admin permission)
 */
export const getAllNews = async (): Promise<ApiResponse<NewsListResponse[]>> => {
  const response = await axiosClient.get(`${BASE_URL}`);
  return response.data;
};

/**
 * Get public news (no authentication required)
 */
export const getPublicNews = async (): Promise<ApiResponse<NewsListResponse[]>> => {
  const response = await axiosClient.get(`${BASE_URL}/public`);
  return response.data;
};

/**
 * Get public news by slug (no authentication required)
 */
export const getPublicNewsBySlug = async (slug: string): Promise<ApiResponse<NewsDetailResponse>> => {
  const response = await axiosClient.get(`${BASE_URL}/public/${slug}`);
  return response.data;
};

/**
 * Get news by slug for editing (requires admin permission)
 */
export const getNewsBySlug = async (slug: string): Promise<ApiResponse<NewsDetailResponse>> => {
  const response = await axiosClient.get(`${BASE_URL}/${slug}`);
  return response.data;
};

/**
 * Update news visibility (requires admin permission)
 */
export const updateNewsVisibility = async (
  id: string,
  request: NewsVisibilityRequest
): Promise<ApiResponse<NewsResponse>> => {
  const response = await axiosClient.patch(`${BASE_URL}/${id}/visibility`, request);
  return response.data;
};

/**
 * Delete news (requires admin permission)
 */
export const deleteNews = async (id: string): Promise<ApiResponse<void>> => {
  const response = await axiosClient.delete(`${BASE_URL}/${id}`);
  return response.data;
};

/**
 * Create news (requires admin permission)
 */
export interface CreateNewsRequest {
  id?: string; // If provided, will update existing news
  title: string;
  slug: string;
  description: string;
  thumbnail?: File; // Changed to File instead of URL
  contentJson: string;
  contentHtml: string;
  isPublic?: boolean;
}

export const createNews = async (request: CreateNewsRequest): Promise<ApiResponse<NewsResponse>> => {
  const formData = new FormData();
  
  // Append all fields
  if (request.id) formData.append('id', request.id);
  formData.append('title', request.title);
  formData.append('slug', request.slug);
  formData.append('description', request.description);
  formData.append('contentJson', request.contentJson);
  formData.append('contentHtml', request.contentHtml);
  if (request.isPublic !== undefined) {
    formData.append('isPublic', String(request.isPublic));
  }
  
  // Append thumbnail file if provided
  if (request.thumbnail) {
    formData.append('thumbnail', request.thumbnail);
  }
  
  const response = await axiosClient.post(`${BASE_URL}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

/**
 * Update news (requires admin permission)
 */
export interface UpdateNewsRequest {
  title?: string;
  slug?: string;
  description?: string;
  thumbnail?: File; // Changed to File instead of URL
  contentJson?: string;
  contentHtml?: string;
  isPublic?: boolean;
}

export const updateNews = async (
  id: string,
  request: UpdateNewsRequest
): Promise<ApiResponse<NewsResponse>> => {
  const formData = new FormData();
  
  // Append all fields if provided
  if (request.title) formData.append('title', request.title);
  if (request.slug) formData.append('slug', request.slug);
  if (request.description) formData.append('description', request.description);
  if (request.contentJson) formData.append('contentJson', request.contentJson);
  if (request.contentHtml) formData.append('contentHtml', request.contentHtml);
  if (request.isPublic !== undefined) {
    formData.append('isPublic', String(request.isPublic));
  }
  
  // Append thumbnail file if provided
  if (request.thumbnail) {
    formData.append('thumbnail', request.thumbnail);
  }
  
  const response = await axiosClient.put(`${BASE_URL}/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

/**
 * Upload image for news (requires admin permission)
 */
export interface ImageAssetResponse {
  id: string;
  publicId: string;
  url: string;
  width: number;
  height: number;
  sizeBytes: number;
  mimeType: string;
  ownerType: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export const uploadNewsImage = async (
  newsId: string,
  file: File
): Promise<ApiResponse<ImageAssetResponse>> => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await axiosClient.post(`${BASE_URL}/${newsId}/images`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

/**
 * Get all images for a news (requires admin permission)
 */
export const getNewsImages = async (newsId: string): Promise<ApiResponse<ImageAssetResponse[]>> => {
  const response = await axiosClient.get(`${BASE_URL}/${newsId}/images`);
  return response.data;
};

/**
 * Delete image by publicId (requires admin permission)
 */
export const deleteImageByPublicId = async (publicId: string): Promise<ApiResponse<void>> => {
  const response = await axiosClient.delete(`${BASE_URL}/images/public/${publicId}`);
  return response.data;
};

/**
 * Delete all images for a news (requires admin permission)
 */
export const deleteAllNewsImages = async (newsId: string): Promise<ApiResponse<void>> => {
  const response = await axiosClient.delete(`${BASE_URL}/${newsId}/images`);
  return response.data;
};

export default {
  getAllNews,
  getPublicNews,
  getPublicNewsBySlug,
  getNewsBySlug,
  createNews,
  updateNews,
  updateNewsVisibility,
  deleteNews,
  uploadNewsImage,
  getNewsImages,
  deleteImageByPublicId,
  deleteAllNewsImages,
};
