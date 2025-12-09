import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { Eye, MoreHorizontal, Trash2, Edit, DollarSign } from 'lucide-react';
import fallbackImage from '@/assets/images/commons/fallback.png';

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
import { serviceCategoryApi } from '@/services/serviceCategoryApi';
import type { HotelService } from '@/types/service.types';
import type { Branch } from '@/types/branch.types';
import type { ServiceCategory } from '@/types/serviceCategory.types';

export default function ServiceList() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get base path from current location (e.g., /admin, /manager, /staff)
  const basePath = '/' + location.pathname.split('/')[1];
  
  // State
  const [services, setServices] = useState<HotelService[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  
  // Filters
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  
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

  // Fetch categories when branch is selected
  useEffect(() => {
    const fetchCategories = async () => {
      if (!selectedBranch) {
        setCategories([]);
        return;
      }
      try {
        const response = await serviceCategoryApi.getByBranch(selectedBranch);
        setCategories(response.result || []);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };
    fetchCategories();
  }, [selectedBranch]);

  // Fetch services
  const fetchServices = useCallback(async () => {
    try {
      setIsLoading(true);
      
      const response = await serviceApi.search({
        hotelId: selectedBranch || undefined,
        categoryId: selectedCategory || undefined,
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
  }, [currentPage, pageSize, selectedBranch, selectedCategory, searchKeyword, sortColumn, sortDirection]);

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
    setSelectedCategory('');
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
      key: 'image',
      header: 'Ảnh',
      cell: (service) => {
        const imageUrl = service.images && service.images.length > 0 ? service.images[0] : null;
        return (
          <div className="w-32 h-32 rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
            <img
              src={imageUrl || fallbackImage}
              alt={service.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = fallbackImage;
              }}
            />
          </div>
        );
      },
      className: 'w-[140px]',
    },
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
      key: 'categoryName',
      header: 'Danh mục dịch vụ',
      cell: (service) => (
        <Badge variant="outline" className="bg-purple-100 text-purple-800">
          {service.categoryName || 'Chưa phân loại'}
        </Badge>
      ),
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
            <DropdownMenuItem onClick={() => navigate(`${basePath}/services/upsert?id=${service.id}&view=true`)}>
              <Eye className="h-4 w-4 mr-2" />
              Xem chi tiết
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate(`${basePath}/services/upsert?id=${service.id}`)}>
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

  const categoryOptions = [
    { value: 'all', label: 'Tất cả danh mục' },
    ...categories.map((cat) => ({
      value: cat.id,
      label: cat.name,
    })),
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Quản lý dịch vụ"
        description="Xem và quản lý tất cả dịch vụ trong hệ thống"
        onAdd={() => navigate(`${basePath}/services/upsert`)}
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
                key: 'category',
                label: 'Danh mục dịch vụ',
                value: selectedCategory,
                options: categoryOptions,
                onChange: (value) => {
                  setSelectedCategory(value === 'all' ? '' : value);
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