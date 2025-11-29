import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Eye, MoreHorizontal, Trash2, Edit, Percent, Calendar, Copy, Check } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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

import { promotionApi } from '@/services/promotionApi';
import type { Promotion, PromotionStatus, getPromotionStatus, PROMOTION_STATUS_CONFIG } from '@/types/promotion.types';

// Get promotion status
const getStatus = (promotion: Promotion): PromotionStatus => {
  if (!promotion.active) return 'inactive';
  
  const now = new Date();
  const start = new Date(promotion.startDate);
  const end = new Date(promotion.endDate);
  
  if (now < start) return 'scheduled';
  if (now > end) return 'expired';
  return 'active';
};

// Status configurations
const promotionStatusConfig: Record<PromotionStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' }> = {
  active: { label: 'Đang áp dụng', variant: 'success' },
  scheduled: { label: 'Sắp diễn ra', variant: 'warning' },
  expired: { label: 'Đã hết hạn', variant: 'secondary' },
  inactive: { label: 'Tạm ngừng', variant: 'outline' },
};

export default function PromotionList() {
  const navigate = useNavigate();
  
  // State
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  
  // Filters
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  
  // Sorting
  const [sortColumn, setSortColumn] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  // Dialogs
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedPromotionId, setSelectedPromotionId] = useState<string | null>(null);

  // Fetch promotions
  const fetchPromotions = useCallback(async () => {
    try {
      setIsLoading(true);
      
      const response = await promotionApi.search({
        name: searchKeyword || undefined,
        active: selectedStatus === 'active' ? true : selectedStatus === 'inactive' ? false : undefined,
        page: currentPage,
        size: pageSize,
        sortBy: sortColumn,
        sortDir: sortDirection,
      });
      
      const pageData = response.result;
      setPromotions(pageData.content);
      setTotalPages(pageData.totalPages);
      setTotalElements(pageData.totalElements);
    } catch (error) {
      console.error('Failed to fetch promotions:', error);
      toast.error('Không thể tải danh sách khuyến mãi');
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, pageSize, searchKeyword, selectedStatus, sortColumn, sortDirection]);

  useEffect(() => {
    fetchPromotions();
  }, [fetchPromotions]);

  // Handle delete promotion
  const handleDeletePromotion = async () => {
    if (!selectedPromotionId) return;
    
    try {
      await promotionApi.delete(selectedPromotionId);
      toast.success('Xóa khuyến mãi thành công');
      setDeleteDialogOpen(false);
      setSelectedPromotionId(null);
      fetchPromotions();
    } catch (error) {
      console.error('Failed to delete promotion:', error);
      toast.error('Không thể xóa khuyến mãi');
    }
  };

  // Handle copy code
  const handleCopyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      toast.success('Đã sao chép mã khuyến mãi');
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (error) {
      toast.error('Không thể sao chép mã');
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
    setSelectedStatus('');
    setCurrentPage(0);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  // Table columns
  const columns: Column<Promotion>[] = [
    {
      key: 'code',
      header: 'Mã khuyến mãi',
      cell: (promotion) => (
        <div className="flex items-center gap-2">
          <span className="font-mono font-bold text-primary bg-primary/10 px-2 py-1 rounded">
            {promotion.code}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={(e) => {
              e.stopPropagation();
              handleCopyCode(promotion.code);
            }}
          >
            {copiedCode === promotion.code ? (
              <Check className="h-3 w-3 text-green-500" />
            ) : (
              <Copy className="h-3 w-3" />
            )}
          </Button>
        </div>
      ),
      sortable: true,
    },
    {
      key: 'name',
      header: 'Tên khuyến mãi',
      cell: (promotion) => (
        <div>
          <div className="font-medium">{promotion.name}</div>
          <div className="text-sm text-muted-foreground line-clamp-1">
            {promotion.description || 'Không có mô tả'}
          </div>
        </div>
      ),
      sortable: true,
    },
    {
      key: 'discount',
      header: 'Giảm giá',
      cell: (promotion) => (
        <div className="flex items-center gap-1 font-bold text-lg text-green-600">
          <Percent className="h-4 w-4" />
          {promotion.discount}%
        </div>
      ),
      sortable: true,
    },
    {
      key: 'period',
      header: 'Thời gian',
      cell: (promotion) => (
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span>{formatDate(promotion.startDate)}</span>
          <span>-</span>
          <span>{formatDate(promotion.endDate)}</span>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Trạng thái',
      cell: (promotion) => {
        const status = getStatus(promotion);
        const config = promotionStatusConfig[status];
        return <StatusBadge label={config.label} variant={config.variant} />;
      },
    },
    {
      key: 'actions',
      header: '',
      cell: (promotion) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate(`/admin/promotions/upsert?id=${promotion.id}&view=true`)}>
              <Eye className="h-4 w-4 mr-2" />
              Xem chi tiết
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate(`/admin/promotions/upsert?id=${promotion.id}`)}>
              <Edit className="h-4 w-4 mr-2" />
              Chỉnh sửa
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => {
                setSelectedPromotionId(promotion.id);
                setDeleteDialogOpen(true);
              }}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Xóa khuyến mãi
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
      className: 'w-[50px]',
    },
  ];

  // Filter options
  const statusOptions = [
    { value: 'active', label: 'Đang hoạt động' },
    { value: 'inactive', label: 'Tạm ngừng' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Quản lý khuyến mãi"
        description="Xem và quản lý tất cả khuyến mãi trong hệ thống"
        onAdd={() => navigate('/admin/promotions/upsert')}
        addButtonText="Thêm khuyến mãi"
        onRefresh={fetchPromotions}
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
            searchPlaceholder="Tìm theo tên, mã khuyến mãi..."
            filters={[
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
            data={promotions}
            keyExtractor={(promotion) => promotion.id}
            isLoading={isLoading}
            emptyMessage="Không có khuyến mãi nào"
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
        title="Xác nhận xóa khuyến mãi"
        description="Bạn có chắc chắn muốn xóa khuyến mãi này? Hành động này không thể hoàn tác."
        confirmText="Xóa"
        cancelText="Hủy"
        onConfirm={handleDeletePromotion}
        variant="destructive"
      />
    </div>
  );
}