import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { 
  Eye, 
  MoreHorizontal, 
  Trash2, 
  Edit, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Users, 
  BedDouble,
  UserCog 
} from 'lucide-react';

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

import { branchApi } from '@/services/branchApi';
import type { Branch, BranchStatus } from '@/types/branch.types';

// Status configurations
const branchStatusConfig: Record<BranchStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' }> = {
  ACTIVE: { label: 'Hoạt động', variant: 'success' },
  INACTIVE: { label: 'Tạm ngừng', variant: 'warning' },
  MAINTENANCE: { label: 'Bảo trì', variant: 'secondary' },
  CLOSED: { label: 'Đã đóng cửa', variant: 'destructive' },
};

export default function BranchList() {
  const navigate = useNavigate();
  
  // State
  const [branches, setBranches] = useState<Branch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  
  // Filters
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  
  // Sorting
  const [sortColumn, setSortColumn] = useState('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  
  // Dialogs
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedBranchId, setSelectedBranchId] = useState<string | null>(null);

  // Get unique cities from branches
  const cities = [...new Set(branches.map(b => b.city))];

  // Fetch branches
  const fetchBranches = useCallback(async () => {
    try {
      setIsLoading(true);
      
      let response;
      
      if (searchKeyword) {
        response = await branchApi.search(searchKeyword, {
          page: currentPage,
          size: pageSize,
        });
      } else if (selectedCity) {
        response = await branchApi.getByCity(selectedCity, {
          page: currentPage,
          size: pageSize,
        });
      } else if (selectedStatus) {
        response = await branchApi.getByStatus(selectedStatus as BranchStatus, {
          page: currentPage,
          size: pageSize,
        });
      } else {
        response = await branchApi.getAll({
          page: currentPage,
          size: pageSize,
          sortBy: sortColumn,
        });
      }
      
      const pageData = response.result;
      setBranches(pageData.content);
      setTotalPages(pageData.totalPages);
      setTotalElements(pageData.totalElements);
    } catch (error) {
      console.error('Failed to fetch branches:', error);
      toast.error('Không thể tải danh sách chi nhánh');
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, pageSize, searchKeyword, selectedCity, selectedStatus, sortColumn]);

  useEffect(() => {
    fetchBranches();
  }, [fetchBranches]);

  // Handle delete branch
  const handleDeleteBranch = async () => {
    if (!selectedBranchId) return;
    
    try {
      await branchApi.delete(selectedBranchId);
      toast.success('Xóa chi nhánh thành công');
      setDeleteDialogOpen(false);
      setSelectedBranchId(null);
      fetchBranches();
    } catch (error) {
      console.error('Failed to delete branch:', error);
      toast.error('Không thể xóa chi nhánh. Có thể chi nhánh đang có phòng hoặc nhân viên.');
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
    setSelectedCity('');
    setSelectedStatus('');
    setCurrentPage(0);
  };

  // Table columns
  const columns: Column<Branch>[] = [
    {
      key: 'name',
      header: 'Tên chi nhánh',
      cell: (branch) => (
        <div>
          <div className="font-medium">{branch.name}</div>
          <div className="text-sm text-muted-foreground font-mono">{branch.code}</div>
        </div>
      ),
      sortable: true,
    },
    {
      key: 'address',
      header: 'Địa chỉ',
      cell: (branch) => (
        <div className="flex items-start gap-2 max-w-[300px]">
          <MapPin className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
          <span className="text-sm line-clamp-2">{branch.fullAddress}</span>
        </div>
      ),
    },
    {
      key: 'contact',
      header: 'Liên hệ',
      cell: (branch) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm">
            <Phone className="h-3 w-3 text-muted-foreground" />
            {branch.phone}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Mail className="h-3 w-3" />
            {branch.email}
          </div>
        </div>
      ),
    },
    {
      key: 'manager',
      header: 'Quản lý',
      cell: (branch) => (
        branch.managerName ? (
          <div className="flex items-center gap-2">
            <UserCog className="h-4 w-4 text-muted-foreground" />
            <span>{branch.managerName}</span>
          </div>
        ) : (
          <span className="text-muted-foreground italic">Chưa phân công</span>
        )
      ),
    },
    {
      key: 'rooms',
      header: 'Phòng',
      cell: (branch) => (
        <div className="flex items-center gap-2">
          <BedDouble className="h-4 w-4 text-muted-foreground" />
          <span className="text-green-600 font-medium">{branch.availableRooms}</span>
          <span className="text-muted-foreground">/</span>
          <span>{branch.totalRooms}</span>
        </div>
      ),
    },
    {
      key: 'staff',
      header: 'Nhân viên',
      cell: (branch) => (
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span>{branch.totalStaff}</span>
        </div>
      ),
    },
    {
      key: 'operatingHours',
      header: 'Giờ hoạt động',
      cell: (branch) => (
        <div className="flex items-center gap-2 text-sm">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span>{branch.operatingHours || `${branch.checkInTime} - ${branch.checkOutTime}`}</span>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Trạng thái',
      cell: (branch) => {
        const config = branchStatusConfig[branch.status as BranchStatus];
        return config ? (
          <StatusBadge label={config.label} variant={config.variant} />
        ) : (
          <StatusBadge label={branch.status} variant="outline" />
        );
      },
    },
    {
      key: 'actions',
      header: '',
      cell: (branch) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate(`/admin/branches/upsert?id=${branch.id}&view=true`)}>
              <Eye className="h-4 w-4 mr-2" />
              Xem chi tiết
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate(`/admin/branches/upsert?id=${branch.id}`)}>
              <Edit className="h-4 w-4 mr-2" />
              Chỉnh sửa
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate(`/admin/users/${branch.managerId}/assign-branch`)}>
              <UserCog className="h-4 w-4 mr-2" />
              Phân công quản lý
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => {
                setSelectedBranchId(branch.id);
                setDeleteDialogOpen(true);
              }}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Xóa chi nhánh
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
      className: 'w-[50px]',
    },
  ];

  // Filter options
  const statusOptions = Object.entries(branchStatusConfig).map(([value, config]) => ({
    value,
    label: config.label,
  }));

  const cityOptions = cities.map((city) => ({
    value: city,
    label: city,
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Quản lý chi nhánh"
        description="Xem và quản lý tất cả chi nhánh khách sạn"
        onAdd={() => navigate('/admin/branches/upsert')}
        addButtonText="Thêm chi nhánh"
        onRefresh={fetchBranches}
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
            searchPlaceholder="Tìm theo tên, mã chi nhánh..."
            filters={[
              {
                key: 'city',
                label: 'Thành phố',
                value: selectedCity,
                options: cityOptions,
                onChange: (value) => {
                  setSelectedCity(value === 'all' ? '' : value);
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
            data={branches}
            keyExtractor={(branch) => branch.id}
            isLoading={isLoading}
            emptyMessage="Không có chi nhánh nào"
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
        title="Xác nhận xóa chi nhánh"
        description="Bạn có chắc chắn muốn xóa chi nhánh này? Hành động này không thể hoàn tác và sẽ ảnh hưởng đến tất cả phòng và nhân viên thuộc chi nhánh."
        confirmText="Xóa"
        cancelText="Hủy"
        onConfirm={handleDeleteBranch}
        variant="destructive"
      />
    </div>
  );
}