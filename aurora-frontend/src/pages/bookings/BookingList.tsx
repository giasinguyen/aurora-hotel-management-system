import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Eye, MoreHorizontal, CheckCircle, XCircle, Edit, LogIn, LogOut } from 'lucide-react';
import { useAppSelector } from '@/hooks/useRedux';

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

// Status configurations with unique colors
const bookingStatusConfig: Record<BookingStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning'; className?: string }> = {
  PENDING: { label: 'Chờ xác nhận', variant: 'default', className: 'bg-yellow-500 text-white hover:bg-yellow-600 border-transparent' },
  CONFIRMED: { label: 'Đã xác nhận', variant: 'default', className: 'bg-blue-500 text-white hover:bg-blue-600 border-transparent' },
  CHECKED_IN: { label: 'Đã nhận phòng', variant: 'default', className: 'bg-cyan-500 text-white hover:bg-cyan-600 border-transparent' },
  CHECKED_OUT: { label: 'Đã trả phòng', variant: 'default', className: 'bg-indigo-500 text-white hover:bg-indigo-600 border-transparent' },
  COMPLETED: { label: 'Hoàn thành', variant: 'default', className: 'bg-green-500 text-white hover:bg-green-600 border-transparent' },
  CANCELLED: { label: 'Đã hủy', variant: 'destructive', className: 'bg-red-500 text-white hover:bg-red-600 border-transparent' },
  NO_SHOW: { label: 'Không đến', variant: 'default', className: 'bg-gray-500 text-white hover:bg-gray-600 border-transparent' },
};

const paymentStatusConfig: Record<PaymentStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning'; className?: string }> = {
  PENDING: { label: 'Chờ thanh toán', variant: 'default', className: 'bg-orange-500 text-white hover:bg-orange-600 border-transparent' },
  DEPOSIT_PAID: { label: 'Đã đặt cọc', variant: 'default', className: 'bg-purple-500 text-white hover:bg-purple-600 border-transparent' },
  PARTIALLY_PAID: { label: 'Thanh toán một phần', variant: 'default', className: 'bg-pink-500 text-white hover:bg-pink-600 border-transparent' },
  PAID: { label: 'Đã thanh toán', variant: 'default', className: 'bg-emerald-500 text-white hover:bg-emerald-600 border-transparent' },
  REFUNDED: { label: 'Đã hoàn tiền', variant: 'default', className: 'bg-teal-500 text-white hover:bg-teal-600 border-transparent' },
};

export default function BookingList() {
  const navigate = useNavigate();
  
  // Get current user from auth state
  const authUser = useAppSelector((state) => state.auth.user);
  
  // Detect current role prefix from URL
  const currentPath = window.location.pathname;
  const rolePrefix = currentPath.startsWith('/admin') ? '/admin' 
    : currentPath.startsWith('/manager') ? '/manager'
    : currentPath.startsWith('/staff') ? '/staff'
    : '';
  
  // Check if user is Admin (can see all branches) or Manager/Staff (limited to their branch)
  const isAdmin = useMemo(() => {
    return authUser?.roles?.some(role => 
      role.toUpperCase() === 'ADMIN' || role.toUpperCase() === 'ROLE_ADMIN'
    ) ?? false;
  }, [authUser?.roles]);
  
  // Get user's branch ID for filtering (Manager/Staff only see their branch)
  const userBranchId = useMemo(() => {
    if (isAdmin) return null; // Admin can see all
    return authUser?.branchId || null;
  }, [isAdmin, authUser?.branchId]);
  
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
  
  // Filters - For Manager/Staff, auto-set to their branch
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  
  // Effect to set initial branch filter for Manager/Staff
  useEffect(() => {
    if (userBranchId && !isAdmin) {
      setSelectedBranch(userBranchId);
    }
  }, [userBranchId, isAdmin]);
  
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
      
      // For Manager/Staff, always use their branchId even if selectedBranch is empty
      const branchIdToUse = !isAdmin && userBranchId ? userBranchId : (selectedBranch || undefined);
      
      const response = await bookingApi.search({
        branchId: branchIdToUse,
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
  }, [currentPage, pageSize, selectedBranch, selectedStatus, sortColumn, sortDirection, isAdmin, userBranchId]);

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

  // Handle check-in
  const handleCheckIn = async (bookingId: string) => {
    try {
      const currentUserId = localStorage.getItem('userId') || 'SYSTEM';
      await bookingApi.checkIn(bookingId, currentUserId);
      toast.success('Check-in thành công');
      fetchBookings();
    } catch (error: any) {
      toast.error('Check-in thất bại', {
        description: error.response?.data?.message || 'Vui lòng thử lại',
      });
    }
  };

  // Handle check-out
  const handleCheckOut = async (bookingId: string) => {
    try {
      const currentUserId = localStorage.getItem('userId') || 'SYSTEM';
      await bookingApi.checkOut(bookingId, currentUserId);
      toast.success('Check-out thành công');
      fetchBookings();
    } catch (error: any) {
      toast.error('Check-out thất bại', {
        description: error.response?.data?.message || 'Vui lòng thử lại',
      });
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
    // For Manager/Staff, don't clear branch filter - keep their branch
    if (isAdmin) {
      setSelectedBranch('');
    }
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
        
        return <StatusBadge label={config.label} variant={config.variant} className={config.className} />;
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
        
        return <StatusBadge label={config.label} variant={config.variant} className={config.className} />;
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
              <DropdownMenuItem onClick={() => navigate(`${rolePrefix}/bookings/${booking.id}`)}>
                <Eye className="h-4 w-4 mr-2" />
                Xem chi tiết
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate(`${rolePrefix}/bookings/${booking.id}/update`)}>
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
              {booking.status === 'CONFIRMED' && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleCheckIn(booking.id)}>
                    <LogIn className="h-4 w-4 mr-2 text-blue-500" />
                    Check-in
                  </DropdownMenuItem>
                </>
              )}
              {booking.status === 'CHECKED_IN' && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleCheckOut(booking.id)}>
                    <LogOut className="h-4 w-4 mr-2 text-purple-500" />
                    Check-out
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
        onAdd={() => navigate(`${rolePrefix}/bookings`)}
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
              // Only show branch filter for Admin, Manager/Staff see their branch name as info
              ...(isAdmin ? [{
                key: 'branch',
                label: 'Chi nhánh',
                value: selectedBranch,
                options: branchOptions,
                onChange: (value: string) => {
                  setSelectedBranch(value === 'all' ? '' : value);
                  setCurrentPage(0);
                },
              }] : [{
                key: 'branch',
                label: 'Chi nhánh',
                value: userBranchId || '',
                options: branches.filter(b => b.id === userBranchId).map(b => ({ value: b.id, label: b.name })),
                onChange: () => {}, // Disabled - cannot change
                disabled: true,
              }]),
              {
                key: 'status',
                label: 'Trạng thái',
                value: selectedStatus,
                options: statusOptions,
                onChange: (value: string) => {
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