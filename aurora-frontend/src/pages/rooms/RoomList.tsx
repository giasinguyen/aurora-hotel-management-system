import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Eye, MoreHorizontal, Trash2, Edit, Users, Maximize } from 'lucide-react';

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

import { roomApi, roomTypeApi } from '@/services/roomApi';
import { branchApi } from '@/services/branchApi';
import type { Room, RoomStatus, RoomType } from '@/types/room.types';
import type { Branch } from '@/types/branch.types';

// Status configurations
const roomStatusConfig: Record<RoomStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' }> = {
  AVAILABLE: { label: 'Trống', variant: 'success' },
  OCCUPIED: { label: 'Có khách', variant: 'default' },
  RESERVED: { label: 'Đã đặt', variant: 'warning' },
  MAINTENANCE: { label: 'Bảo trì', variant: 'secondary' },
  CLEANING: { label: 'Đang dọn', variant: 'outline' },
  OUT_OF_ORDER: { label: 'Hỏng', variant: 'destructive' },
};

export default function RoomList() {
  const navigate = useNavigate();
  
  // State
  const [rooms, setRooms] = useState<Room[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  
  // Filters
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedRoomType, setSelectedRoomType] = useState('');
  
  // Sorting
  const [sortColumn, setSortColumn] = useState('roomNumber');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  
  // Dialogs
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);

  // Fetch branches for filter
  useEffect(() => {
    const fetchFiltersData = async () => {
      try {
        const [branchesRes, roomTypesRes] = await Promise.all([
          branchApi.getAll({ page: 0, size: 100 }),
          roomTypeApi.getAll(),
        ]);
        setBranches(branchesRes.result.content);
        setRoomTypes(roomTypesRes.result);
      } catch (error) {
        console.error('Failed to fetch filter data:', error);
      }
    };
    fetchFiltersData();
  }, []);

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
      
      // Filter by status client-side if needed
      let filteredRooms = pageData.content;
      if (selectedStatus) {
        filteredRooms = filteredRooms.filter(room => room.status === selectedStatus);
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
  }, [currentPage, pageSize, selectedBranch, selectedRoomType, selectedStatus, sortColumn, sortDirection]);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  // Handle delete room (soft delete - change status to OUT_OF_ORDER)
  const handleDeleteRoom = async () => {
    if (!selectedRoomId) return;
    
    try {
      // Soft delete: Update status to OUT_OF_ORDER instead of deleting
      await roomApi.update(selectedRoomId, { status: 'OUT_OF_ORDER' });
      toast.success('Đã tạm ngưng phòng thành công');
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
    setSelectedStatus('');
    setSelectedRoomType('');
    setCurrentPage(0);
  };

  // Table columns
  const columns: Column<Room>[] = [
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

  const roomTypeOptions = roomTypes.map((type) => ({
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
                  setCurrentPage(0);
                },
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