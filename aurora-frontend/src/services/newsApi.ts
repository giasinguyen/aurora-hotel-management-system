import axiosClient from '@/config/axiosClient';
import type { ApiResponse } from '@/types/apiResponse';
import type {
  NewsListResponse,
  NewsDetailResponse
} from '@/types/news.types';

const BASE_URL = '/api/v1/news';

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

export default {
  getPublicNews,
  getPublicNewsBySlug,
};
