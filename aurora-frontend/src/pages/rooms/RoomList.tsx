import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Eye, MoreHorizontal, Trash2, Edit, Users, Maximize } from 'lucide-react';
import fallbackImage from '@/assets/images/commons/fallback.png';

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

import { roomApi, roomTypeApi, roomCategoryApi } from '@/services/roomApi';
import { branchApi } from '@/services/branchApi';
import type { Room, RoomStatus, RoomType, RoomCategory } from '@/types/room.types';
import type { Branch } from '@/types/branch.types';

// Status configurations
const roomStatusConfig: Record<RoomStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' }> = {
  READY: { label: 'Sẵn sàng', variant: 'success' },
  CLEANING: { label: 'Đang dọn', variant: 'warning' },
  MAINTENANCE: { label: 'Bảo trì', variant: 'secondary' },
  LOCKED: { label: 'Khoá phòng', variant: 'destructive' },
};

export default function RoomList() {
  const navigate = useNavigate();
  
  // State
  const [rooms, setRooms] = useState<Room[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [categories, setCategories] = useState<RoomCategory[]>([]);
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [filteredRoomTypes, setFilteredRoomTypes] = useState<RoomType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  
  // Filters
  const [searchKeyword, setSearchKeyword] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedRoomType, setSelectedRoomType] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  
  // Sorting
  const [sortColumn, setSortColumn] = useState('roomNumber');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  
  // Dialogs
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);

  // Fetch branches, categories, room types for filter
  useEffect(() => {
    const fetchFiltersData = async () => {
      try {
        const branchesRes = await branchApi.getAll({ page: 0, size: 100 });
        setBranches(branchesRes.result.content);
        
        // Fetch all room types
        const roomTypesRes = await roomTypeApi.getAll();
        setRoomTypes(roomTypesRes.result);
      } catch (error) {
        console.error('Failed to fetch filter data:', error);
      }
    };
    fetchFiltersData();
  }, []);

  // Fetch categories when branch changes
  useEffect(() => {
    const fetchCategories = async () => {
      if (selectedBranch) {
        try {
          const categoryRes = await roomCategoryApi.getByBranch(selectedBranch);
          setCategories(categoryRes.result || []);
        } catch (error) {
          console.error('Failed to fetch categories:', error);
          setCategories([]);
        }
      } else {
        setCategories([]);
      }
    };
    fetchCategories();
  }, [selectedBranch]);

  // Filter room types by category
  useEffect(() => {
    if (!selectedCategory || selectedCategory === 'all') {
      // No category selected - show room types from selected branch
      if (selectedBranch && selectedBranch !== 'all') {
        setFilteredRoomTypes(roomTypes.filter(rt => rt.branchId === selectedBranch));
      } else {
        setFilteredRoomTypes(roomTypes);
      }
    } else {
      // Category selected - filter by categoryId
      setFilteredRoomTypes(roomTypes.filter(rt => rt.categoryId === selectedCategory));
    }
  }, [selectedCategory, selectedBranch, roomTypes]);

  // Debounce search keyword
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchKeyword);
      setCurrentPage(0);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchKeyword]);

  // Fetch rooms
  const fetchRooms = useCallback(async () => {
    try {
      setIsLoading(true);
      
      let response;
      if (selectedBranch) {
        response = await roomApi.getByBranch(selectedBranch, {
          page: currentPage,
          size: pageSize,
          sortBy: sortColumn,
          sortDir: sortDirection,
        });
      } else if (selectedRoomType) {
        response = await roomApi.getByRoomType(selectedRoomType, {
          page: currentPage,
          size: pageSize,
          sortBy: sortColumn,
          sortDir: sortDirection,
        });
      } else {
        response = await roomApi.getAll({
          page: currentPage,
          size: pageSize,
          sortBy: sortColumn,
          sortDir: sortDirection,
        });
      }
      
      const pageData = response.result;
      
      // Filter by category, status and search client-side if needed
      let filteredRooms = pageData.content;
      
      // Filter by category first (if selected)
      if (selectedCategory && selectedCategory !== 'all') {
        filteredRooms = filteredRooms.filter(room => room.categoryId === selectedCategory);
      }
      
      // Then filter by room type (if selected)
      if (selectedRoomType && selectedRoomType !== 'all') {
        filteredRooms = filteredRooms.filter(room => room.roomTypeId === selectedRoomType);
      }
      
      // Filter by status
      if (selectedStatus) {
        filteredRooms = filteredRooms.filter(room => room.status === selectedStatus);
      }
      
      // Filter by search keyword
      if (debouncedSearch) {
        filteredRooms = filteredRooms.filter(room => 
          room.roomNumber.toLowerCase().includes(debouncedSearch.toLowerCase())
        );
      }
      
      setRooms(filteredRooms);
      setTotalPages(pageData.totalPages);
      setTotalElements(pageData.totalElements);
    } catch (error) {
      console.error('Failed to fetch rooms:', error);
      toast.error('Không thể tải danh sách phòng');
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, pageSize, selectedBranch, selectedCategory, selectedRoomType, selectedStatus, debouncedSearch, sortColumn, sortDirection]);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  // Handle delete room (soft delete - change status to LOCKED)
  const handleDeleteRoom = async () => {
    if (!selectedRoomId) return;
    
    try {
      // Soft delete: Update status to LOCKED instead of deleting
      await roomApi.update(selectedRoomId, { status: 'LOCKED' });
      toast.success('Đã khoá phòng thành công');
      setDeleteDialogOpen(false);
      setSelectedRoomId(null);
      fetchRooms();
    } catch (error) {
      console.error('Failed to suspend room:', error);
      toast.error('Không thể tạm ngưng phòng');
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
    setSelectedStatus('');
    setSelectedRoomType('');
    setCurrentPage(0);
  };

  // Table columns
  const columns: Column<Room>[] = [
    {
      key: 'images',
      header: 'Ảnh',
      cell: (room) => (
        <img
          src={room.images?.[0] || fallbackImage}
          alt={room.roomNumber}
          className="w-32 h-32 object-cover rounded-md"
          onError={(e) => { e.currentTarget.src = fallbackImage; }}
        />
      ),
    },
    {
      key: 'roomNumber',
      header: 'Số phòng',
      cell: (room) => (
        <span className="font-mono font-bold text-lg">
          {room.roomNumber}
        </span>
      ),
      sortable: true,
    },
    {
      key: 'floor',
      header: 'Tầng',
      cell: (room) => (
        <span className="text-center">{room.floor}</span>
      ),
      sortable: true,
    },
    {
      key: 'roomTypeName',
      header: 'Loại phòng',
      cell: (room) => (
        <div>
          <div className="font-medium">{room.roomTypeName}</div>
          <div className="text-sm text-muted-foreground">{room.branchName}</div>
        </div>
      ),
    },
    {
      key: 'capacity',
      header: 'Sức chứa',
      cell: (room) => (
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span>{room.capacityAdults} người lớn</span>
          {room.capacityChildren > 0 && (
            <span className="text-muted-foreground">+ {room.capacityChildren} trẻ em</span>
          )}
        </div>
      ),
    },
    {
      key: 'sizeM2',
      header: 'Diện tích',
      cell: (room) => (
        <div className="flex items-center gap-1">
          <Maximize className="h-4 w-4 text-muted-foreground" />
          <span>{room.sizeM2} m²</span>
        </div>
      ),
      sortable: true,
    },
    {
      key: 'status',
      header: 'Trạng thái',
      cell: (room) => {
        const config = roomStatusConfig[room.status as RoomStatus];
        return <StatusBadge label={config.label} variant={config.variant} />;
      },
    },
    {
      key: 'actions',
      header: '',
      cell: (room) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate(`/admin/rooms/upsert?id=${room.id}&view=true`)}>
              <Eye className="h-4 w-4 mr-2" />
              Xem chi tiết
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate(`/admin/rooms/upsert?id=${room.id}`)}>
              <Edit className="h-4 w-4 mr-2" />
              Chỉnh sửa
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => {
                setSelectedRoomId(room.id);
                setDeleteDialogOpen(true);
              }}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Tạm ngưng phòng
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
      className: 'w-[50px]',
    },
  ];

  // Filter options
  const statusOptions = Object.entries(roomStatusConfig).map(([value, config]) => ({
    value,
    label: config.label,
  }));

  const branchOptions = branches.map((branch) => ({
    value: branch.id,
    label: branch.name,
  }));

  const categoryOptions = categories.map((category) => ({
    value: category.id,
    label: category.name,
  }));

  const roomTypeOptions = filteredRoomTypes.map((type) => ({
    value: type.id,
    label: type.name,
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Quản lý phòng"
        description="Xem và quản lý tất cả phòng trong hệ thống"
        onAdd={() => navigate('/admin/rooms/upsert')}
        addButtonText="Thêm phòng"
        onRefresh={fetchRooms}
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
            searchPlaceholder="Tìm theo số phòng..."
            filters={[
              {
                key: 'branch',
                label: 'Chi nhánh',
                value: selectedBranch,
                options: branchOptions,
                onChange: (value) => {
                  setSelectedBranch(value === 'all' ? '' : value);
                  setSelectedCategory('');
                  setSelectedRoomType('');
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
                  setSelectedRoomType(''); // Reset type when category changes
                  setCurrentPage(0);
                },
                disabled: !selectedBranch || selectedBranch === 'all',
                placeholder: (selectedBranch && selectedBranch !== 'all') ? 'Chọn hạng phòng' : 'Chọn chi nhánh trước',
              },
              {
                key: 'roomType',
                label: 'Loại phòng',
                value: selectedRoomType,
                options: roomTypeOptions,
                onChange: (value) => {
                  setSelectedRoomType(value === 'all' ? '' : value);
                  setCurrentPage(0);
                },
                disabled: !selectedCategory || selectedCategory === 'all',
                placeholder: (selectedCategory && selectedCategory !== 'all') ? 'Chọn loại phòng' : 'Chọn hạng phòng trước',
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
            data={rooms}
            keyExtractor={(room) => room.id}
            isLoading={isLoading}
            emptyMessage="Không có phòng nào"
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

      {/* Suspend Room Confirmation Dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Xác nhận tạm ngưng phòng"
        description="Bạn có chắc chắn muốn tạm ngưng phòng này? Phòng sẽ chuyển sang trạng thái 'Tạm ngưng' và không thể đặt được."
        confirmText="Tạm ngưng"
        cancelText="Hủy"
        onConfirm={handleDeleteRoom}
        variant="destructive"
      />
    </div>
  );
}