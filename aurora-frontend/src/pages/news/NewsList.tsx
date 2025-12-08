import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { 
  Eye, 
  MoreHorizontal, 
  Trash2, 
  Edit, 
  Calendar, 
  User,
  ImageOff,
  Globe,
  Lock
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

import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { fetchAllNews, updateVisibility, deleteNewsById } from '@/features/slices/newsSlice';

import type { 
  NewsListResponse
} from '@/types/news.types';

import {
  NEWS_STATUS_CONFIG,
} from '@/types/news.types';

export default function NewsList() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { allNewsList, loading } = useAppSelector((state) => state.news);
  
  // State
  const [filteredNews, setFilteredNews] = useState<NewsListResponse[]>([]);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  
  // Filters
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  
  // Sorting
  const [sortColumn, setSortColumn] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  // Dialogs
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedNewsId, setSelectedNewsId] = useState<string | null>(null);

  // Fetch news on component mount
  useEffect(() => {
    dispatch(fetchAllNews());
  }, [dispatch]);

  // Apply filters and sorting
  useEffect(() => {
    let result = [...allNewsList];
    
    // Apply filters
    if (searchKeyword) {
      result = result.filter(n => 
        n.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        n.description.toLowerCase().includes(searchKeyword.toLowerCase())
      );
    }
    if (selectedStatus) {
      result = result.filter(n => n.status === selectedStatus);
    }
    
    // Sort
    result.sort((a, b) => {
      const aValue = a[sortColumn as keyof NewsListResponse] as string;
      const bValue = b[sortColumn as keyof NewsListResponse] as string;
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue) 
        : bValue.localeCompare(aValue);
    });
    
    setFilteredNews(result);
    setTotalElements(result.length);
    setTotalPages(Math.ceil(result.length / pageSize));
  }, [allNewsList, searchKeyword, selectedStatus, sortColumn, sortDirection, pageSize]);

  // Handle delete news
  const handleDeleteNews = async () => {
    if (!selectedNewsId) return;
    
    try {
      await dispatch(deleteNewsById(selectedNewsId)).unwrap();
      toast.success('Xóa tin tức thành công');
      setDeleteDialogOpen(false);
      setSelectedNewsId(null);
    } catch (error) {
      console.error('Failed to delete news:', error);
      toast.error('Không thể xóa tin tức');
    }
  };

  // Handle toggle visibility (publish/unpublish)
  const handleToggleVisibility = async (newsItem: NewsListResponse) => {
    try {
      await dispatch(
        updateVisibility({
          id: newsItem.id,
          request: { isPublic: !newsItem.isPublic }
        })
      ).unwrap();
      
      const action = !newsItem.isPublic ? 'công khai' : 'riêng tư';
      toast.success(`Đã chuyển tin tức sang chế độ ${action}`);
    } catch (error) {
      console.error('Failed to update visibility:', error);
      toast.error('Không thể cập nhật trạng thái công khai');
    }
  };

  // Handle refresh
  const handleRefresh = () => {
    dispatch(fetchAllNews());
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

  // Get paginated data
  const paginatedNews = filteredNews.slice(
    currentPage * pageSize,
    (currentPage + 1) * pageSize
  );

  // Table columns
  const columns: Column<NewsListResponse>[] = [
    {
      key: 'title',
      header: 'Tiêu đề',
      cell: (item) => (
        <div className="flex items-start gap-3 max-w-[400px]">
          {item.thumbnailUrl ? (
            <img 
              src={item.thumbnailUrl} 
              alt={item.title}
              className="w-16 h-12 object-cover rounded"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const fallback = target.nextElementSibling as HTMLElement;
                if (fallback) fallback.style.display = 'flex';
              }}
            />
          ) : null}
          <div 
            className="w-16 h-12 bg-muted rounded flex items-center justify-center"
            style={{ display: item.thumbnailUrl ? 'none' : 'flex' }}
          >
            <ImageOff className="h-6 w-6 text-muted-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-medium line-clamp-1">
              {item.title}
            </div>
            <div className="text-sm text-muted-foreground line-clamp-1">
              {item.description}
            </div>
          </div>
        </div>
      ),
      sortable: true,
    },
    {
      key: 'isPublic',
      header: 'Công khai',
      cell: (item) => (
        <Badge variant={item.isPublic ? 'default' : 'secondary'}>
          {item.isPublic ? 'Công khai' : 'Riêng tư'}
        </Badge>
      ),
    },
    {
      key: 'createdBy',
      header: 'Tác giả',
      cell: (item) => (
        <div className="flex items-center gap-2 text-sm">
          <User className="h-4 w-4 text-muted-foreground" />
          {item.createdBy}
        </div>
      ),
    },
    {
      key: 'publishedAt',
      header: 'Ngày đăng',
      cell: (item) => (
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          {formatDate(item.publishedAt)}
        </div>
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
            <DropdownMenuItem 
              onClick={() => {
                if (item.isPublic) {
                  navigate(`/news/${item.slug}`);
                } else {
                  navigate(`/admin/news/preview/${item.slug}`);
                }
              }}
            >
              <Eye className="h-4 w-4 mr-2" />
              {item.isPublic ? 'Xem bài viết' : 'Xem trước'}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate(`/admin/news/upsert/${item.slug}`)}>
              <Edit className="h-4 w-4 mr-2" />
              Chỉnh sửa
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleToggleVisibility(item)}>
              {item.isPublic ? (
                <>
                  <Lock className="h-4 w-4 mr-2" />
                  Chuyển sang riêng tư
                </>
              ) : (
                <>
                  <Globe className="h-4 w-4 mr-2" />
                  Chuyển sang công khai
                </>
              )}
            </DropdownMenuItem>
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
  const statusOptions = Object.entries(NEWS_STATUS_CONFIG).map(([value, config]) => ({
    value,
    label: config.label,
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Quản lý tin tức"
        description="Xem và quản lý tất cả tin tức, bài viết trong hệ thống"
        onAdd={() => navigate("/admin/news/upsert")}
        addButtonText="Thêm tin tức"
        onRefresh={handleRefresh}
        isLoading={loading}
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">Bộ lọc</CardTitle>
        </CardHeader>
        <CardContent>
          <SearchFilter
            searchValue={searchKeyword}
            onSearchChange={setSearchKeyword}
            searchPlaceholder="Tìm theo tiêu đề hoặc mô tả..."
            filters={[
              {
                key: "status",
                label: "Trạng thái",
                value: selectedStatus,
                options: statusOptions,
                onChange: (value) => {
                  setSelectedStatus(value === "all" ? "" : value);
                  setCurrentPage(0);
                },
              },
            ]}
            onClear={handleClearFilters}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">Danh sách tin tức</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <DataTable
            columns={columns}
            data={paginatedNews}
            keyExtractor={(item) => item.id}
            isLoading={loading}
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