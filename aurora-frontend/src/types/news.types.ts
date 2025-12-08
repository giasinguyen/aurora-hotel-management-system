// News Types for Aurora Hotel Management System

// API Response Types
export interface NewsListResponse {
  id: string;
  slug: string;
  title: string;
  description: string;
  thumbnailUrl?: string;
  isPublic: boolean;
  status: NewsStatus;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface NewsDetailResponse {
  id: string;
  slug: string;
  title: string;
  description: string;
  thumbnailUrl?: string;
  isPublic: boolean;
  contentJson: unknown;
  contentHtml: string;
  status: NewsStatus;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  images: string[];
}

// Legacy News interface (for backward compatibility)
export interface News {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  thumbnailUrl?: string;
  category: NewsCategory;
  status: NewsStatus;
  authorId: string;
  authorName: string;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  viewCount: number;
  featured: boolean;
}

export type NewsCategory = 
  | 'ANNOUNCEMENT' 
  | 'PROMOTION' 
  | 'EVENT' 
  | 'TIP' 
  | 'NEWS';

export type NewsStatus = 
  | 'DRAFT' 
  | 'PUBLISHED' 
  | 'ARCHIVED';

export interface NewsCreationRequest {
  title: string;
  content: string;
  excerpt?: string;
  thumbnailUrl?: string;
  category: NewsCategory;
  status?: NewsStatus;
  featured?: boolean;
}

export interface NewsUpdateRequest {
  title?: string;
  content?: string;
  excerpt?: string;
  thumbnailUrl?: string;
  category?: NewsCategory;
  status?: NewsStatus;
  featured?: boolean;
}

export interface NewsSearchParams {
  keyword?: string;
  category?: NewsCategory;
  status?: NewsStatus;
  featured?: boolean;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
}

export interface NewsVisibilityRequest {
  isPublic: boolean;
}

export interface NewsResponse {
  id: string;
  slug: string;
  title: string;
  description: string;
  thumbnailUrl?: string;
  isPublic: boolean;
  status: NewsStatus;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

// Category configurations
export const NEWS_CATEGORY_CONFIG: Record<NewsCategory, { label: string; color: string }> = {
  ANNOUNCEMENT: { label: 'Thông báo', color: 'bg-blue-100 text-blue-800' },
  PROMOTION: { label: 'Khuyến mãi', color: 'bg-green-100 text-green-800' },
  EVENT: { label: 'Sự kiện', color: 'bg-purple-100 text-purple-800' },
  TIP: { label: 'Mẹo hay', color: 'bg-yellow-100 text-yellow-800' },
  NEWS: { label: 'Tin tức', color: 'bg-gray-100 text-gray-800' },
};

// Status configurations
export const NEWS_STATUS_CONFIG: Record<NewsStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' }> = {
  DRAFT: { label: 'Bản nháp', variant: 'secondary' },
  PUBLISHED: { label: 'Đã xuất bản', variant: 'success' },
  ARCHIVED: { label: 'Đã lưu trữ', variant: 'outline' },
};
