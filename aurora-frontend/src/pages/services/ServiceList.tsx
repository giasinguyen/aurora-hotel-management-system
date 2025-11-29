import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Eye, MoreHorizontal, Trash2, Edit, DollarSign } from 'lucide-react';

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
  ConfirmDialog,
  type Column 
} from '@/components/custom';

import { serviceApi } from '@/services/serviceApi';
import { branchApi } from '@/services/branchApi';
import type { HotelService, ServiceType } from '@/types/service.types';
import type { Branch } from '@/types/branch.types';

// Service type configurations
const serviceTypeConfig: Record<ServiceType, { label: string; icon: string; color: string }> = {
  SPA: { label: 'Spa & Massage', icon: '🧖', color: 'bg-pink-100 text-pink-800' },
  RESTAURANT: { label: 'Nhà hàng', icon: '🍽️', color: 'bg-orange-100 text-orange-800' },
  LAUNDRY: { label: 'Giặt ủi', icon: '🧺', color: 'bg-blue-100 text-blue-800' },
  TRANSPORT: { label: 'Vận chuyển', icon: '🚗', color: 'bg-green-100 text-green-800' },
  TOUR: { label: 'Tour du lịch', icon: '🗺️', color: 'bg-yellow-100 text-yellow-800' },
  GYM: { label: 'Phòng gym', icon: '🏋️', color: 'bg-red-100 text-red-800' },
  POOL: { label: 'Hồ bơi', icon: '🏊', color: 'bg-cyan-100 text-cyan-800' },
  OTHER: { label: 'Khác', icon: '📦', color: 'bg-gray-100 text-gray-800' },
};

export default function ServiceList() {
  const navigate = useNavigate();
  
  // State
  const [services, setServices] = useState<HotelService[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  
  // Filters
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedType, setSelectedType] = useState('');
  
  // Sorting
  const [sortColumn, setSortColumn] = useState('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  
  // Dialogs
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);

  // Fetch branches for filter
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await branchApi.getAll({ page: 0, size: 100 });
        setBranches(response.result.content);
      } catch (error) {
        console.error('Failed to fetch branches:', error);
      }
    };
    fetchBranches();
  }, []);

  // Fetch services
  const fetchServices = useCallback(async () => {
    try {
      setIsLoading(true);
      
      const response = await serviceApi.search({
        hotelId: selectedBranch || undefined,
        type: selectedType as ServiceType || undefined,
        name: searchKeyword || undefined,
        page: currentPage,
        size: pageSize,
        sortBy: sortColumn,
        sortDir: sortDirection,
      });
      
      const pageData = response.result;
      setServices(pageData.content);
      setTotalPages(pageData.totalPages);
      setTotalElements(pageData.totalElements);
    } catch (error) {
      console.error('Failed to fetch services:', error);
      toast.error('Không thể tải danh sách dịch vụ');
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, pageSize, selectedBranch, selectedType, searchKeyword, sortColumn, sortDirection]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  // Handle delete service
  const handleDeleteService = async () => {
    if (!selectedServiceId) return;
    
    try {
      await serviceApi.delete(selectedServiceId);
      toast.success('Xóa dịch vụ thành công');
      setDeleteDialogOpen(false);
      setSelectedServiceId(null);
      fetchServices();
    } catch (error) {
      console.error('Failed to delete service:', error);
      toast.error('Không thể xóa dịch vụ');
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
    setSelectedType('');
    setCurrentPage(0);
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  // Table columns
  const columns: Column<HotelService>[] = [
    {
      key: 'name',
      header: 'Tên dịch vụ',
      cell: (service) => (
        <div>
          <div className="font-medium">{service.name}</div>
          <div className="text-sm text-muted-foreground line-clamp-1">
            {service.description || 'Không có mô tả'}
          </div>
        </div>
      ),
      sortable: true,
    },
    {
      key: 'branchName',
      header: 'Chi nhánh',
      cell: (service) => service.branchName,
    },
    {
      key: 'type',
      header: 'Loại dịch vụ',
      cell: (service) => {
        const config = serviceTypeConfig[service.type as ServiceType];
        return (
          <Badge variant="outline" className={config?.color}>
            <span className="mr-1">{config?.icon}</span>
            {config?.label || service.type}
          </Badge>
        );
      },
    },
    {
      key: 'basePrice',
      header: 'Giá cơ bản',
      cell: (service) => (
        <div className="flex items-center gap-1 font-medium">
          <DollarSign className="h-4 w-4 text-green-600" />
          {formatCurrency(service.basePrice)}
        </div>
      ),
      sortable: true,
    },
    {
      key: 'actions',
      header: '',
      cell: (service) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate(`/admin/services/upsert?id=${service.id}&view=true`)}>
              <Eye className="h-4 w-4 mr-2" />
              Xem chi tiết
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate(`/admin/services/upsert?id=${service.id}`)}>
              <Edit className="h-4 w-4 mr-2" />
              Chỉnh sửa
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => {
                setSelectedServiceId(service.id);
                setDeleteDialogOpen(true);
              }}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Xóa dịch vụ
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
      className: 'w-[50px]',
    },
  ];

  // Filter options
  const branchOptions = branches.map((branch) => ({
    value: branch.id,
    label: branch.name,
  }));

  const typeOptions = Object.entries(serviceTypeConfig).map(([value, config]) => ({
    value,
    label: config.label,
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Quản lý dịch vụ"
        description="Xem và quản lý tất cả dịch vụ trong hệ thống"
        onAdd={() => navigate('/admin/services/upsert')}
        addButtonText="Thêm dịch vụ"
        onRefresh={fetchServices}
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
            searchPlaceholder="Tìm theo tên dịch vụ..."
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
                key: 'type',
                label: 'Loại dịch vụ',
                value: selectedType,
                options: typeOptions,
                onChange: (value) => {
                  setSelectedType(value === 'all' ? '' : value);
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
            data={services}
            keyExtractor={(service) => service.id}
            isLoading={isLoading}
            emptyMessage="Không có dịch vụ nào"
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
        title="Xác nhận xóa dịch vụ"
        description="Bạn có chắc chắn muốn xóa dịch vụ này? Hành động này không thể hoàn tác."
        confirmText="Xóa"
        cancelText="Hủy"
        onConfirm={handleDeleteService}
        variant="destructive"
      />
    </div>
  );
}