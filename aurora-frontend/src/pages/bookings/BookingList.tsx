import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Eye, MoreHorizontal, CheckCircle, XCircle, Edit } from 'lucide-react';

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

import { bookingApi } from '@/services/bookingApi';
import { branchApi } from '@/services/branchApi';
import type { Booking, BookingStatus, PaymentStatus } from '@/types/booking.types';
import type { Branch } from '@/types/branch.types';

// Status configurations
const bookingStatusConfig: Record<BookingStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' }> = {
  PENDING: { label: 'Chờ xác nhận', variant: 'warning' },
  CONFIRMED: { label: 'Đã xác nhận', variant: 'success' },
  CHECKED_IN: { label: 'Đã nhận phòng', variant: 'default' },
  CHECKED_OUT: { label: 'Đã trả phòng', variant: 'secondary' },
  CANCELLED: { label: 'Đã hủy', variant: 'destructive' },
  NO_SHOW: { label: 'Không đến', variant: 'outline' },
};

const paymentStatusConfig: Record<PaymentStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' }> = {
  PENDING: { label: 'Chờ thanh toán', variant: 'warning' },
  PAID: { label: 'Đã thanh toán', variant: 'success' },
  PARTIALLY_PAID: { label: 'Thanh toán một phần', variant: 'secondary' },
  REFUNDED: { label: 'Đã hoàn tiền', variant: 'outline' },
  FAILED: { label: 'Thất bại', variant: 'destructive' },
};

export default function BookingList() {
  const navigate = useNavigate();
  
  // State
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  
  // Filters
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  
  // Sorting
  const [sortColumn, setSortColumn] = useState('checkin');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  // Dialogs
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);

  // Fetch branches for filter
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await branchApi.getAll({ page: 0, size: 100 });
        if (response?.result?.content) {
          setBranches(response.result.content);
        } else {
          setBranches([]);
        }
      } catch {
        setBranches([]);
      }
    };
    fetchBranches();
  }, []);

  // Fetch bookings
  const fetchBookings = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await bookingApi.search({
        hotelId: selectedBranch || undefined,
        status: selectedStatus as BookingStatus || undefined,
        page: currentPage,
        size: pageSize,
        sortBy: sortColumn,
        sortDir: sortDirection,
      });
      
      // Safe access với fallback
      const pageData = response?.result;
      if (pageData) {
        const bookingsData = pageData.content || [];
        setBookings(bookingsData);
        setTotalPages(pageData.totalPages ?? 0);
        setTotalElements(pageData.totalElements ?? 0);
      } else {
        setBookings([]);
        setTotalPages(0);
        setTotalElements(0);
      }
    } catch (error: unknown) {
      
      // Xử lý error chi tiết hơn
      let errorMessage = 'Không thể tải danh sách đặt phòng';
      
      if (error && typeof error === 'object') {
        if ('response' in error && error.response) {
          const axiosError = error as { response?: { status?: number; data?: { message?: string } } };
          if (axiosError.response?.status === 404) {
            errorMessage = 'API endpoint không tồn tại. Vui lòng kiểm tra backend.';
          } else if (axiosError.response?.status === 403) {
            errorMessage = 'Bạn không có quyền truy cập.';
          } else if (axiosError.response?.status === 401) {
            errorMessage = 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.';
          } else if (axiosError.response?.data?.message) {
            errorMessage = axiosError.response.data.message;
          }
        } else if ('message' in error && typeof error.message === 'string') {
          errorMessage = error.message;
        }
      }
      
      setError(errorMessage);
      setBookings([]);
      setTotalPages(0);
      setTotalElements(0);
      
      // Chỉ toast error nếu không phải lỗi network (để tránh spam)
      if (error && typeof error === 'object' && 'message' in error) {
        toast.error(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, pageSize, selectedBranch, selectedStatus, sortColumn, sortDirection]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  // Handle confirm booking
  const handleConfirmBooking = async (bookingId: string) => {
    try {
      await bookingApi.confirm(bookingId, {});
      toast.success('Xác nhận đặt phòng thành công');
      fetchBookings();
    } catch {
      toast.error('Không thể xác nhận đặt phòng');
    }
  };

  // Handle cancel booking
  const handleCancelBooking = async () => {
    if (!selectedBookingId) return;
    
    try {
      await bookingApi.cancel(selectedBookingId, { reason: 'Hủy bởi quản trị viên' });
      toast.success('Hủy đặt phòng thành công');
      setCancelDialogOpen(false);
      setSelectedBookingId(null);
      fetchBookings();
    } catch {
      toast.error('Không thể hủy đặt phòng');
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
    setSelectedBranch('');
    setSelectedStatus('');
    setCurrentPage(0);
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  // Table columns
  const columns: Column<Booking>[] = [
    {
      key: 'bookingCode',
      header: 'Mã đặt phòng',
      cell: (booking) => (
        <span className="font-mono font-medium text-primary">
          {booking?.bookingCode || 'N/A'}
        </span>
      ),
      sortable: true,
    },
    {
      key: 'customerName',
      header: 'Khách hàng',
      cell: (booking) => (
        <div>
          <div className="font-medium">{booking?.customerName || 'N/A'}</div>
          <div className="text-sm text-muted-foreground">{booking?.branchName || ''}</div>
        </div>
      ),
    },
    {
      key: 'checkin',
      header: 'Ngày nhận',
      cell: (booking) => booking?.checkin ? formatDate(booking.checkin) : 'N/A',
      sortable: true,
    },
    {
      key: 'checkout',
      header: 'Ngày trả',
      cell: (booking) => booking?.checkout ? formatDate(booking.checkout) : 'N/A',
      sortable: true,
    },
    {
      key: 'totalPrice',
      header: 'Tổng tiền',
      cell: (booking) => (
        <span className="font-medium">
          {booking?.totalPrice != null ? formatCurrency(booking.totalPrice) : 'N/A'}
        </span>
      ),
      sortable: true,
    },
    {
      key: 'status',
      header: 'Trạng thái',
      cell: (booking) => {
        if (!booking?.status) {
          return <StatusBadge label="N/A" variant="outline" />;
        }
        
        const config = bookingStatusConfig[booking.status as BookingStatus];
        if (!config) {
          return <StatusBadge label={String(booking.status)} variant="outline" />;
        }
        
        return <StatusBadge label={config.label} variant={config.variant} />;
      },
    },
    {
      key: 'paymentStatus',
      header: 'Thanh toán',
      cell: (booking) => {
        if (!booking?.paymentStatus) {
          return <StatusBadge label="N/A" variant="outline" />;
        }
        
        const config = paymentStatusConfig[booking.paymentStatus as PaymentStatus];
        if (!config) {
          return <StatusBadge label={String(booking.paymentStatus)} variant="outline" />;
        }
        
        return <StatusBadge label={config.label} variant={config.variant} />;
      },
    },
    {
      key: 'actions',
      header: '',
      cell: (booking) => {
        if (!booking?.id) {
          return null;
        }
        
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate(`/admin/booking/${booking.id}`)}>
                <Eye className="h-4 w-4 mr-2" />
                Xem chi tiết
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate(`/admin/booking/upsert`)}>
                <Edit className="h-4 w-4 mr-2" />
                Chỉnh sửa
              </DropdownMenuItem>
              {booking.status === 'PENDING' && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleConfirmBooking(booking.id)}>
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                    Xác nhận
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={() => {
                      setSelectedBookingId(booking.id);
                      setCancelDialogOpen(true);
                    }}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Hủy đặt phòng
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
      className: 'w-[50px]',
    },
  ];

  // Filter options với safe fallback
  const statusOptions = Object.entries(bookingStatusConfig).map(([value, config]) => ({
    value,
    label: config.label,
  }));

  const branchOptions = (branches || []).map((branch) => ({
    value: branch.id,
    label: branch.name || 'Không có tên',
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Quản lý đặt phòng"
        description="Xem và quản lý tất cả đặt phòng trong hệ thống"
        onAdd={() => navigate('/admin/booking/upsert')}
        addButtonText="Tạo đặt phòng"
        onRefresh={fetchBookings}
        isLoading={isLoading}
      />

      {/* Error Message */}
      {error && (
        <Card>
          <CardContent className="pt-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 font-semibold mb-2">⚠️ Lỗi khi tải dữ liệu</p>
              <p className="text-red-700 text-sm mb-4">{error}</p>
              <Button onClick={() => fetchBookings()} variant="outline" size="sm">
                Thử lại
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">Bộ lọc</CardTitle>
        </CardHeader>
        <CardContent>
          <SearchFilter
            searchValue={searchKeyword}
            onSearchChange={setSearchKeyword}
            searchPlaceholder="Tìm theo mã đặt phòng, tên khách..."
            filters={[
              {
                key: 'branch',
                label: 'Chi nhánh',
                value: selectedBranch,
                options: branchOptions,
                onChange: (value) => {
                  setSelectedBranch(value === 'all' ? '' : value);
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
            data={bookings || []}
            keyExtractor={(booking) => booking.id}
            isLoading={isLoading}
            emptyMessage="Không có đặt phòng nào"
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

      {/* Cancel Confirmation Dialog */}
      <ConfirmDialog
        open={cancelDialogOpen}
        onOpenChange={setCancelDialogOpen}
        title="Xác nhận hủy đặt phòng"
        description="Bạn có chắc chắn muốn hủy đặt phòng này? Hành động này không thể hoàn tác."
        confirmText="Hủy đặt phòng"
        cancelText="Đóng"
        onConfirm={handleCancelBooking}
        variant="destructive"
      />
    </div>
  );
}