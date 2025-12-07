import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Eye, MoreHorizontal, Trash2, Edit, Users, Maximize, BedDouble, Check, DollarSign } from 'lucide-react';
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

import { roomTypeApi, roomCategoryApi } from '@/services/roomApi';
import { branchApi } from '@/services/branchApi';
import type { RoomType, RoomCategory } from '@/types/room.types';
import type { Branch } from '@/types/branch.types';

export default function RoomTypeList() {
  const navigate = useNavigate();
  
  // State
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [categories, setCategories] = useState<RoomCategory[]>([]);
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
  const [selectedRoomTypeId, setSelectedRoomTypeId] = useState<string | null>(null);

  // Fetch branches and categories for filter
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const branchRes = await branchApi.getAll({ page: 0, size: 100 });
        setBranches(branchRes.result.content);
        
        // Fetch categories for selected branch (or first branch if none selected)
        if (branchRes.result.content.length > 0) {
          const branchToFetch = selectedBranch || branchRes.result.content[0].id;
          const categoryRes = await roomCategoryApi.getByBranch(branchToFetch);
          setCategories(categoryRes.result || []);
        }
      } catch (error) {
        console.error('Failed to fetch filters:', error);
      }
    };
    fetchFilters();
  }, [selectedBranch]);

  // Fetch room types
  const fetchRoomTypes = useCallback(async () => {
    try {
      setIsLoading(true);
      
      let response;
      if (selectedBranch) {
        response = await roomTypeApi.getByBranchPaginated(selectedBranch, {
          page: currentPage,
          size: pageSize,
          sortBy: sortColumn,
          sortDirection: sortDirection,
        });
      } else {
        response = await roomTypeApi.getAllPaginated({
          page: currentPage,
          size: pageSize,
          sortBy: sortColumn,
          sortDirection: sortDirection,
        });
      }
      
      const pageData = response.result;
      let filteredTypes = pageData.content;
      
      // Filter by category if selected
      if (selectedCategory) {
        filteredTypes = filteredTypes.filter(rt => rt.categoryId === selectedCategory);
      }
      
      setRoomTypes(filteredTypes);
      setTotalPages(pageData.totalPages);
      setTotalElements(pageData.totalElements);
    } catch (error) {
      console.error('Failed to fetch room types:', error);
      toast.error('Không thể tải danh sách loại phòng');
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, pageSize, selectedBranch, selectedCategory, sortColumn, sortDirection]);

  useEffect(() => {
    fetchRoomTypes();
  }, [fetchRoomTypes]);

  // Handle delete room type
  const handleDeleteRoomType = async () => {
    if (!selectedRoomTypeId) return;
    
    try {
      await roomTypeApi.delete(selectedRoomTypeId);
      toast.success('Xóa loại phòng thành công');
      setDeleteDialogOpen(false);
      setSelectedRoomTypeId(null);
      fetchRoomTypes();
    } catch (error) {
      console.error('Failed to delete room type:', error);
      toast.error('Không thể xóa loại phòng. Có thể đang có phòng thuộc loại này.');
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

  // Table columns
  const columns: Column<RoomType>[] = [
    {
      key: 'imageUrl',
      header: 'Ảnh',
      cell: (roomType) => (
        <img
          src={roomType.imageUrl || fallbackImage}
          alt={roomType.name}
          className="w-32 h-32 object-cover rounded-md"
          onError={(e) => { e.currentTarget.src = fallbackImage; }}
        />
      ),
    },
    {
      key: 'name',
      header: 'Tên loại phòng',
      cell: (roomType) => (
        <div>
          <div className="font-medium">{roomType.name}</div>
          <div className="text-sm text-muted-foreground font-mono">{roomType.code}</div>
        </div>
      ),
      sortable: true,
    },
    {
      key: 'branchName',
      header: 'Chi nhánh',
      cell: (roomType) => roomType.branchName,
    },
    {
      key: 'basePrice',
      header: 'Giá phòng',
      cell: (roomType) => (
        <div className="flex items-center gap-1.5">
          <DollarSign className="h-4 w-4 text-green-600" />
          <span className="font-medium text-green-700">
            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(roomType.priceFrom)}
          </span>
        </div>
      ),
      sortable: true,
    },
    {
      key: 'capacity',
      header: 'Sức chứa',
      cell: (roomType) => (
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span>{roomType.capacityAdults} người lớn</span>
          {roomType.capacityChildren > 0 && (
            <span className="text-muted-foreground">+ {roomType.capacityChildren} trẻ em</span>
          )}
        </div>
      ),
    },
    {
      key: 'sizeM2',
      header: 'Diện tích',
      cell: (roomType) => (
        <div className="flex items-center gap-1">
          <Maximize className="h-4 w-4 text-muted-foreground" />
          <span>{roomType.sizeM2} m²</span>
        </div>
      ),
      sortable: true,
    },
    {
      key: 'rooms',
      header: 'Số phòng',
      cell: (roomType) => (
        <div className="flex items-center gap-2">
          <BedDouble className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{roomType.totalRooms}</span>
        </div>
      ),
    },
    {
      key: 'refundable',
      header: 'Hoàn tiền',
      cell: (roomType) => (
        roomType.refundable ? (
          <Badge variant="outline" className="text-green-600 border-green-600">
            <Check className="h-3 w-3 mr-1" />
            Có
          </Badge>
        ) : (
          <Badge variant="outline" className="text-muted-foreground">
            Không
          </Badge>
        )
      ),
    },
    {
      key: 'amenities',
      header: 'Tiện nghi',
      cell: (roomType) => (
        <div className="flex flex-wrap gap-1 max-w-[200px]">
          {roomType.amenities.slice(0, 3).map((amenity) => (
            <Badge key={amenity.id} variant="secondary" className="text-xs">
              {amenity.name}
            </Badge>
          ))}
          {roomType.amenities.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{roomType.amenities.length - 3}
            </Badge>
          )}
        </div>
      ),
    },
    {
      key: 'actions',
      header: '',
      cell: (roomType) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate(`/admin/room-types/upsert?id=${roomType.id}&view=true`)}>
              <Eye className="h-4 w-4 mr-2" />
              Xem chi tiết
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate(`/admin/room-types/upsert?id=${roomType.id}`)}>
              <Edit className="h-4 w-4 mr-2" />
              Chỉnh sửa
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => {
                setSelectedRoomTypeId(roomType.id);
                setDeleteDialogOpen(true);
              }}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Xóa loại phòng
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

  const categoryOptions = categories.map((category) => ({
    value: category.id,
    label: category.name,
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Quản lý loại phòng"
        description="Xem và quản lý tất cả loại phòng trong hệ thống"
        onAdd={() => {
          console.log('Add button clicked, navigating to /admin/room-types/upsert');
          navigate('/admin/room-types/upsert');
        }}
        addButtonText="Thêm loại phòng"
        onRefresh={fetchRoomTypes}
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
            searchPlaceholder="Tìm theo tên loại phòng..."
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
                label: 'Hạng phòng',
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
            data={roomTypes}
            keyExtractor={(roomType) => roomType.id}
            isLoading={isLoading}
            emptyMessage="Không có loại phòng nào"
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
        title="Xác nhận xóa loại phòng"
        description="Bạn có chắc chắn muốn xóa loại phòng này? Hành động này không thể hoàn tác và sẽ ảnh hưởng đến các phòng thuộc loại này."
        confirmText="Xóa"
        cancelText="Hủy"
        onConfirm={handleDeleteRoomType}
        variant="destructive"
      />
    </div>
  );
}