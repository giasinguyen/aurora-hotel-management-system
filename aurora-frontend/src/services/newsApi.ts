// NOTE: axiosClient và BASE_URL sẽ được sử dụng khi backend implement
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { ApiResponse, PageResponseDto } from '@/types/apiResponse';
import type { 
  News, 
  NewsCreationRequest, 
  NewsUpdateRequest, 
  NewsSearchParams 
} from '@/types/news.types';

// NOTE: Backend NewsController chưa được implement
// Các functions dưới đây sử dụng mock data tạm thời
// Khi backend implement, chỉ cần bỏ comment các dòng API call
// const BASE_URL = '/api/v1/news';

// Mock data
const mockNews: News[] = [
  {
    id: '1',
    title: 'Khai trương chi nhánh mới tại Đà Nẵng',
    slug: 'khai-truong-chi-nhanh-moi-tai-da-nang',
    content: 'Aurora Hotel vui mừng thông báo khai trương chi nhánh mới tại thành phố Đà Nẵng. Với vị trí đắc địa gần biển Mỹ Khê và đầy đủ tiện nghi cao cấp, chi nhánh Đà Nẵng hứa hẹn mang đến trải nghiệm nghỉ dưỡng tuyệt vời cho quý khách.',
    excerpt: 'Aurora Hotel vui mừng thông báo khai trương chi nhánh mới tại thành phố Đà Nẵng',
    thumbnailUrl: '/images/news/danang-branch.jpg',
    category: 'ANNOUNCEMENT',
    status: 'PUBLISHED',
    authorId: '1',
    authorName: 'Admin',
    publishedAt: '2024-11-20T10:00:00',
    createdAt: '2024-11-18T08:00:00',
    updatedAt: '2024-11-20T10:00:00',
    viewCount: 1250,
    featured: true,
  },
  {
    id: '2',
    title: 'Khuyến mãi cuối năm - Giảm 30% cho tất cả phòng',
    slug: 'khuyen-mai-cuoi-nam-giam-30',
    content: 'Nhân dịp cuối năm, Aurora Hotel xin gửi tặng quý khách ưu đãi đặc biệt giảm 30% giá phòng cho tất cả các loại phòng từ ngày 01/12 đến 31/12/2024. Đây là cơ hội tuyệt vời để quý khách và gia đình có kỳ nghỉ cuối năm đáng nhớ.',
    excerpt: 'Nhân dịp cuối năm, Aurora Hotel xin gửi tặng quý khách ưu đãi đặc biệt',
    thumbnailUrl: '/images/news/promotion.jpg',
    category: 'PROMOTION',
    status: 'PUBLISHED',
    authorId: '1',
    authorName: 'Marketing Team',
    publishedAt: '2024-11-15T09:00:00',
    createdAt: '2024-11-14T15:00:00',
    updatedAt: '2024-11-15T09:00:00',
    viewCount: 3420,
    featured: true,
  },
  {
    id: '3',
    title: 'Sự kiện đêm nhạc Jazz tại Aurora Lounge',
    slug: 'su-kien-dem-nhac-jazz',
    content: 'Mời quý khách tham dự đêm nhạc Jazz đặc sắc vào tối thứ 7 hàng tuần tại Aurora Lounge. Với ban nhạc chuyên nghiệp và không gian sang trọng, đây sẽ là điểm đến lý tưởng để thư giãn sau tuần làm việc căng thẳng.',
    excerpt: 'Mời quý khách tham dự đêm nhạc Jazz đặc sắc vào tối thứ 7 hàng tuần',
    category: 'EVENT',
    status: 'PUBLISHED',
    authorId: '2',
    authorName: 'Event Team',
    publishedAt: '2024-11-10T14:00:00',
    createdAt: '2024-11-08T10:00:00',
    updatedAt: '2024-11-10T14:00:00',
    viewCount: 890,
    featured: false,
  },
  {
    id: '4',
    title: '5 mẹo để có kỳ nghỉ hoàn hảo tại khách sạn',
    slug: '5-meo-de-co-ky-nghi-hoan-hao',
    content: 'Để có một kỳ nghỉ hoàn hảo, hãy lưu ý những điều sau: 1. Đặt phòng trước ít nhất 2 tuần. 2. Kiểm tra các dịch vụ đi kèm. 3. Liên hệ trước với khách sạn về yêu cầu đặc biệt. 4. Tận dụng các ưu đãi thành viên. 5. Check-in online để tiết kiệm thời gian.',
    excerpt: 'Những mẹo hữu ích giúp bạn có kỳ nghỉ hoàn hảo tại khách sạn',
    category: 'TIP',
    status: 'PUBLISHED',
    authorId: '1',
    authorName: 'Aurora Team',
    publishedAt: '2024-11-05T11:00:00',
    createdAt: '2024-11-04T09:00:00',
    updatedAt: '2024-11-05T11:00:00',
    viewCount: 567,
    featured: false,
  },
  {
    id: '5',
    title: 'Bài viết mới đang soạn thảo',
    slug: 'bai-viet-moi-dang-soan-thao',
    content: 'Nội dung đang được cập nhật...',
    category: 'NEWS',
    status: 'DRAFT',
    authorId: '1',
    authorName: 'Admin',
    createdAt: '2024-11-25T16:00:00',
    updatedAt: '2024-11-25T16:00:00',
    viewCount: 0,
    featured: false,
  },
];

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Get paginated list of news
 */
export const getNews = async (params?: NewsSearchParams): Promise<ApiResponse<PageResponseDto<News>>> => {
  // TODO: Uncomment khi backend implement
  // const response = await axiosClient.get(BASE_URL, { params });
  // return response.data;
  
  await delay(300);
  
  let filteredNews = [...mockNews];
  
  // Apply filters
  if (params?.keyword) {
    filteredNews = filteredNews.filter(n => 
      n.title.toLowerCase().includes(params.keyword!.toLowerCase()) ||
      n.content.toLowerCase().includes(params.keyword!.toLowerCase())
    );
  }
  if (params?.category) {
    filteredNews = filteredNews.filter(n => n.category === params.category);
  }
  if (params?.status) {
    filteredNews = filteredNews.filter(n => n.status === params.status);
  }
  if (params?.featured !== undefined) {
    filteredNews = filteredNews.filter(n => n.featured === params.featured);
  }
  
  // Pagination
  const page = params?.page || 0;
  const size = params?.size || 10;
  const start = page * size;
  const end = start + size;
  const paginatedNews = filteredNews.slice(start, end);
  
  return {
    code: 200,
    message: 'Success',
    result: {
      content: paginatedNews,
      totalElements: filteredNews.length,
      totalPages: Math.ceil(filteredNews.length / size),
      size,
      page,
    },
  };
};

/**
 * Get news by ID
 */
export const getNewsById = async (id: string): Promise<ApiResponse<News>> => {
  // TODO: Uncomment khi backend implement
  // const response = await axiosClient.get(`${BASE_URL}/${id}`);
  // return response.data;
  
  await delay(200);
  
  const news = mockNews.find(n => n.id === id);
  if (!news) {
    throw new Error('News not found');
  }
  
  return {
    code: 200,
    message: 'Success',
    result: news,
  };
};

/**
 * Get news by slug
 */
export const getNewsBySlug = async (slug: string): Promise<ApiResponse<News>> => {
  // TODO: Uncomment khi backend implement
  // const response = await axiosClient.get(`${BASE_URL}/slug/${slug}`);
  // return response.data;
  
  await delay(200);
  
  const news = mockNews.find(n => n.slug === slug);
  if (!news) {
    throw new Error('News not found');
  }
  
  return {
    code: 200,
    message: 'Success',
    result: news,
  };
};

/**
 * Create new news article
 */
export const createNews = async (data: NewsCreationRequest): Promise<ApiResponse<News>> => {
  // TODO: Uncomment khi backend implement
  // const response = await axiosClient.post(BASE_URL, data);
  // return response.data;
  
  await delay(300);
  
  const newNews: News = {
    id: String(mockNews.length + 1),
    ...data,
    slug: data.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, ''),
    status: data.status || 'DRAFT',
    featured: data.featured || false,
    authorId: '1',
    authorName: 'Admin',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    viewCount: 0,
  };
  
  mockNews.push(newNews);
  
  return {
    code: 201,
    message: 'News created successfully',
    result: newNews,
  };
};

/**
 * Update news article
 */
export const updateNews = async (id: string, data: NewsUpdateRequest): Promise<ApiResponse<News>> => {
  // TODO: Uncomment khi backend implement
  // const response = await axiosClient.put(`${BASE_URL}/${id}`, data);
  // return response.data;
  
  await delay(300);
  
  const index = mockNews.findIndex(n => n.id === id);
  if (index === -1) {
    throw new Error('News not found');
  }
  
  const updatedNews: News = {
    ...mockNews[index],
    ...data,
    updatedAt: new Date().toISOString(),
  };
  
  mockNews[index] = updatedNews;
  
  return {
    code: 200,
    message: 'News updated successfully',
    result: updatedNews,
  };
};

/**
 * Delete news article
 */
export const deleteNews = async (id: string): Promise<ApiResponse<void>> => {
  // TODO: Uncomment khi backend implement
  // const response = await axiosClient.delete(`${BASE_URL}/${id}`);
  // return response.data;
  
  await delay(300);
  
  const index = mockNews.findIndex(n => n.id === id);
  if (index === -1) {
    throw new Error('News not found');
  }
  
  mockNews.splice(index, 1);
  
  return {
    code: 200,
    message: 'News deleted successfully',
    result: undefined as unknown as void,
  };
};

/**
 * Publish news article
 */
export const publishNews = async (id: string): Promise<ApiResponse<News>> => {
  // TODO: Uncomment khi backend implement
  // const response = await axiosClient.post(`${BASE_URL}/${id}/publish`);
  // return response.data;
  
  await delay(300);
  
  const index = mockNews.findIndex(n => n.id === id);
  if (index === -1) {
    throw new Error('News not found');
  }
  
  mockNews[index] = {
    ...mockNews[index],
    status: 'PUBLISHED',
    publishedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  return {
    code: 200,
    message: 'News published successfully',
    result: mockNews[index],
  };
};

/**
 * Archive news article
 */
export const archiveNews = async (id: string): Promise<ApiResponse<News>> => {
  // TODO: Uncomment khi backend implement
  // const response = await axiosClient.post(`${BASE_URL}/${id}/archive`);
  // return response.data;
  
  await delay(300);
  
  const index = mockNews.findIndex(n => n.id === id);
  if (index === -1) {
    throw new Error('News not found');
  }
  
  mockNews[index] = {
    ...mockNews[index],
    status: 'ARCHIVED',
    updatedAt: new Date().toISOString(),
  };
  
  return {
    code: 200,
    message: 'News archived successfully',
    result: mockNews[index],
  };
};

/**
 * Get featured news
 */
export const getFeaturedNews = async (limit: number = 5): Promise<ApiResponse<News[]>> => {
  // TODO: Uncomment khi backend implement
  // const response = await axiosClient.get(`${BASE_URL}/featured`, { params: { limit } });
  // return response.data;
  
  await delay(200);
  
  const featured = mockNews
    .filter(n => n.featured && n.status === 'PUBLISHED')
    .slice(0, limit);
  
  return {
    code: 200,
    message: 'Success',
    result: featured,
  };
};

/**
 * Get published news for public view
 */
export const getPublishedNews = async (params?: NewsSearchParams): Promise<ApiResponse<PageResponseDto<News>>> => {
  // TODO: Uncomment khi backend implement
  // const response = await axiosClient.get(`${BASE_URL}/public`, { params });
  // return response.data;
  
  return getNews({ ...params, status: 'PUBLISHED' });
};

export default {
  getNews,
  getNewsById,
  getNewsBySlug,
  createNews,
  updateNews,
  deleteNews,
  publishNews,
  archiveNews,
  getFeaturedNews,
  getPublishedNews,
};
