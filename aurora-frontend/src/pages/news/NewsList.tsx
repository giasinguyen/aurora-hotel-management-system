import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { 
  Eye, 
  MoreHorizontal, 
  Trash2, 
  Edit, 
  Calendar, 
  User, 
  Star,
  Archive,
  Send 
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { 
  PageHeader, 
  DataTable, 
  Pagination, 
  SearchFilter, 
  StatusBadge, 
  ConfirmDialog,
  type Column 
} from '@/components/custom';

import type { 
  News
} from '@/types/news.types';

import {
  NEWS_CATEGORY_CONFIG,
  NEWS_STATUS_CONFIG,
} from '@/types/news.types';

// Mock data - sẽ thay bằng API call khi backend implement
const mockNews: News[] = [
  {
    id: '1',
    title: 'Khai trương chi nhánh mới tại Đà Nẵng',
    slug: 'khai-truong-chi-nhanh-moi-tai-da-nang',
    content: 'Aurora Hotel vui mừng thông báo khai trương chi nhánh mới...',
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
    content: 'Nhân dịp cuối năm, Aurora Hotel xin gửi tặng...',
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
    content: 'Mời quý khách tham dự đêm nhạc Jazz...',
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

export default function NewsList() {
  const navigate = useNavigate();
  
  // State
  const [news, setNews] = useState<News[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  
  // Filters
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  
  // Sorting
  const [sortColumn, setSortColumn] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  // Dialogs
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedNewsId, setSelectedNewsId] = useState<string | null>(null);

  // Fetch news (mock)
  const fetchNews = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      let filteredNews = [...mockNews];
      
      // Apply filters
      if (searchKeyword) {
        filteredNews = filteredNews.filter(n => 
          n.title.toLowerCase().includes(searchKeyword.toLowerCase())
        );
      }
      if (selectedCategory) {
        filteredNews = filteredNews.filter(n => n.category === selectedCategory);
      }
      if (selectedStatus) {
        filteredNews = filteredNews.filter(n => n.status === selectedStatus);
      }
      
      // Sort
      filteredNews.sort((a, b) => {
        const aValue = a[sortColumn as keyof News] as string;
        const bValue = b[sortColumn as keyof News] as string;
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue) 
          : bValue.localeCompare(aValue);
      });
      
      setNews(filteredNews);
      setTotalElements(filteredNews.length);
      setTotalPages(Math.ceil(filteredNews.length / pageSize));
    } catch (error) {
      console.error('Failed to fetch news:', error);
      toast.error('Không thể tải danh sách tin tức');
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, pageSize, searchKeyword, selectedCategory, selectedStatus, sortColumn, sortDirection]);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  // Handle delete news
  const handleDeleteNews = async () => {
    if (!selectedNewsId) return;
    
    try {
      // Mock delete
      await new Promise(resolve => setTimeout(resolve, 300));
      toast.success('Xóa tin tức thành công');
      setDeleteDialogOpen(false);
      setSelectedNewsId(null);
      fetchNews();
    } catch (error) {
      console.error('Failed to delete news:', error);
      toast.error('Không thể xóa tin tức');
    }
  };

  // Handle sort
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  // Handle clear filters
  const handleClearFilters = () => {
    setSearchKeyword('');
    setSelectedCategory('');
    setSelectedStatus('');
    setCurrentPage(0);
  };

  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Table columns
  const columns: Column<News>[] = [
    {
      key: 'title',
      header: 'Tiêu đề',
      cell: (item) => (
        <div className="flex items-start gap-3 max-w-[400px]">
          {item.thumbnailUrl && (
            <img 
              src={item.thumbnailUrl} 
              alt={item.title}
              className="w-16 h-12 object-cover rounded"
            />
          )}
          <div className="flex-1 min-w-0">
            <div className="font-medium line-clamp-1 flex items-center gap-2">
              {item.featured && <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />}
              {item.title}
            </div>
            <div className="text-sm text-muted-foreground line-clamp-1">
              {item.excerpt || item.content.substring(0, 100)}...
            </div>
          </div>
        </div>
      ),
      sortable: true,
    },
    {
      key: 'category',
      header: 'Danh mục',
      cell: (item) => {
        const config = NEWS_CATEGORY_CONFIG[item.category];
        return (
          <Badge variant="outline" className={config?.color}>
            {config?.label || item.category}
          </Badge>
        );
      },
    },
    {
      key: 'author',
      header: 'Tác giả',
      cell: (item) => (
        <div className="flex items-center gap-2 text-sm">
          <User className="h-4 w-4 text-muted-foreground" />
          {item.authorName}
        </div>
      ),
    },
    {
      key: 'publishedAt',
      header: 'Ngày đăng',
      cell: (item) => (
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          {formatDate(item.publishedAt || item.createdAt)}
        </div>
      ),
      sortable: true,
    },
    {
      key: 'viewCount',
      header: 'Lượt xem',
      cell: (item) => (
        <span className="font-medium">{item.viewCount.toLocaleString()}</span>
      ),
      sortable: true,
    },
    {
      key: 'status',
      header: 'Trạng thái',
      cell: (item) => {
        const config = NEWS_STATUS_CONFIG[item.status];
        return <StatusBadge label={config.label} variant={config.variant} />;
      },
    },
    {
      key: 'actions',
      header: '',
      cell: (item) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate(`/admin/news/${item.id}`)}>
              <Eye className="h-4 w-4 mr-2" />
              Xem chi tiết
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate(`/admin/news/${item.id}/edit`)}>
              <Edit className="h-4 w-4 mr-2" />
              Chỉnh sửa
            </DropdownMenuItem>
            {item.status === 'DRAFT' && (
              <DropdownMenuItem onClick={() => toast.info('Chức năng đang phát triển')}>
                <Send className="h-4 w-4 mr-2" />
                Xuất bản
              </DropdownMenuItem>
            )}
            {item.status === 'PUBLISHED' && (
              <DropdownMenuItem onClick={() => toast.info('Chức năng đang phát triển')}>
                <Archive className="h-4 w-4 mr-2" />
                Lưu trữ
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => {
                setSelectedNewsId(item.id);
                setDeleteDialogOpen(true);
              }}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Xóa tin tức
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
      className: 'w-[50px]',
    },
  ];

  // Filter options
  const categoryOptions = Object.entries(NEWS_CATEGORY_CONFIG).map(([value, config]) => ({
    value,
    label: config.label,
  }));

  const statusOptions = Object.entries(NEWS_STATUS_CONFIG).map(([value, config]) => ({
    value,
    label: config.label,
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Quản lý tin tức"
        description="Xem và quản lý tất cả tin tức, bài viết trong hệ thống"
        onAdd={() => navigate('/admin/news/create')}
        addButtonText="Thêm tin tức"
        onRefresh={fetchNews}
        isLoading={isLoading}
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">Bộ lọc</CardTitle>
        </CardHeader>
        <CardContent>
          <SearchFilter
            searchValue={searchKeyword}
            onSearchChange={setSearchKeyword}
            searchPlaceholder="Tìm theo tiêu đề..."
            filters={[
              {
                key: 'category',
                label: 'Danh mục',
                value: selectedCategory,
                options: categoryOptions,
                onChange: (value) => {
                  setSelectedCategory(value === 'all' ? '' : value);
                  setCurrentPage(0);
                },
              },
              {
                key: 'status',
                label: 'Trạng thái',
                value: selectedStatus,
                options: statusOptions,
                onChange: (value) => {
                  setSelectedStatus(value === 'all' ? '' : value);
                  setCurrentPage(0);
                },
              },
            ]}
            onClear={handleClearFilters}
          />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <DataTable
            columns={columns}
            data={news}
            keyExtractor={(item) => item.id}
            isLoading={isLoading}
            emptyMessage="Không có tin tức nào"
            sortColumn={sortColumn}
            sortDirection={sortDirection}
            onSort={handleSort}
          />

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            totalElements={totalElements}
            onPageChange={setCurrentPage}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setCurrentPage(0);
            }}
          />
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Xác nhận xóa tin tức"
        description="Bạn có chắc chắn muốn xóa tin tức này? Hành động này không thể hoàn tác."
        confirmText="Xóa"
        cancelText="Hủy"
        onConfirm={handleDeleteNews}
        variant="destructive"
      />
    </div>
  );
}