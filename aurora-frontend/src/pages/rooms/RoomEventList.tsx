import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Eye, MoreHorizontal, Edit, Trash2, Calendar, TrendingUp } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

import {
  PageHeader,
  DataTable,
  Pagination,
  SearchFilter,
  StatusBadge,
  ConfirmDialog,
  type Column,
} from '@/components/custom';

import type { Event, EventStatus } from '@/types/event.types';
import { EVENT_STATUS_CONFIG } from '@/types/event.types';

// Mock data for development
const mockEvents: Event[] = [
  {
    id: 'event-001',
    name: 'Tết Nguyên Đán 2026',
    description: 'Tăng giá phòng dịp Tết Nguyên Đán',
    startDate: '2026-01-28',
    endDate: '2026-02-05',
    status: 'SCHEDULED',
    branchId: 'branch-hcm-001',
    branchName: 'Aurora Grand Hotel Hồ Chí Minh',
    priceAdjustments: [
      {
        id: 'adj-001',
        adjustmentType: 'PERCENTAGE',
        adjustmentValue: 50,
        targetType: 'CATEGORY',
        targetId: 'cat-001',
        targetName: 'Standard',
      },
    ],
    createdAt: '2025-12-01T10:00:00Z',
  },
  {
    id: 'event-002',
    name: 'Lễ 30/4 - 1/5',
    description: 'Tăng giá phòng dịp lễ Giải phóng và Quốc tế Lao động',
    startDate: '2026-04-30',
    endDate: '2026-05-03',
    status: 'SCHEDULED',
    branchId: 'branch-hcm-001',
    branchName: 'Aurora Grand Hotel Hồ Chí Minh',
    priceAdjustments: [
      {
        id: 'adj-002',
        adjustmentType: 'FIXED_AMOUNT',
        adjustmentValue: 500000,
        targetType: 'ROOM_TYPE',
        targetId: 'rt-001',
        targetName: 'Deluxe Double Room',
      },
    ],
    createdAt: '2025-12-05T14:30:00Z',
  },
];

export default function RoomEventList() {
  const navigate = useNavigate();

  // Detect role prefix
  const currentPath = window.location.pathname;
  const rolePrefix = currentPath.startsWith('/admin')
    ? '/admin'
    : currentPath.startsWith('/manager')
    ? '/manager'
    : '';

  // State
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalElements, setTotalElements] = useState(mockEvents.length);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<EventStatus | 'ALL'>('ALL');

  // Delete dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<Event | null>(null);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  const getAdjustmentSummary = (event: Event) => {
    const count = event.priceAdjustments.length;
    if (count === 0) return 'Chưa cấu hình';
    return `${count} điều chỉnh`;
  };

  // Table columns
  const columns: Column<Event>[] = [
    {
      key: 'name',
      header: 'Tên sự kiện',
      cell: (event) => (
        <div>
          <p className="font-medium">{event.name}</p>
          {event.description && (
            <p className="text-sm text-gray-500 line-clamp-1">{event.description}</p>
          )}
        </div>
      ),
    },
    {
      key: 'dates',
      header: 'Thời gian',
      cell: (event) => (
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-gray-400" />
          <span className="text-sm">
            {formatDate(event.startDate)} - {formatDate(event.endDate)}
          </span>
        </div>
      ),
    },
    {
      key: 'branch',
      header: 'Chi nhánh',
      cell: (event) => <span className="text-sm">{event.branchName}</span>,
    },
    {
      key: 'adjustments',
      header: 'Điều chỉnh giá',
      cell: (event) => (
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-green-600" />
          <span className="text-sm">{getAdjustmentSummary(event)}</span>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Trạng thái',
      cell: (event) => {
        const statusConfig = EVENT_STATUS_CONFIG[event.status];
        return (
          <StatusBadge
            label={statusConfig.label}
            variant={statusConfig.variant}
          />
        );
      },
    },
    {
      key: 'actions',
      header: 'Thao tác',
      cell: (event) => (
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
              onClick={() => navigate(`${rolePrefix}/room-events/${event.id}`)}
            >
              <Eye className="h-4 w-4 mr-2" />
              Xem chi tiết
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => navigate(`${rolePrefix}/room-events/upsert?id=${event.id}`)}
            >
              <Edit className="h-4 w-4 mr-2" />
              Chỉnh sửa
            </DropdownMenuItem>
            {event.status === 'SCHEDULED' && (
              <DropdownMenuItem
                onClick={() => {
                  setEventToDelete(event);
                  setDeleteDialogOpen(true);
                }}
                className="text-red-600"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Xóa
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const handleDelete = async () => {
    if (!eventToDelete) return;

    try {
      // TODO: Call API to delete event
      toast.success('Đã xóa sự kiện thành công');
      setEvents(events.filter((e) => e.id !== eventToDelete.id));
      setDeleteDialogOpen(false);
      setEventToDelete(null);
    } catch (error) {
      toast.error('Không thể xóa sự kiện');
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Quản lý sự kiện giá"
        description="Quản lý điều chỉnh giá phòng theo lễ tết và sự kiện đặc biệt"
        onAdd={() => navigate(`${rolePrefix}/room-events/upsert`)}
        addButtonText="Tạo sự kiện mới"
        onRefresh={() => setIsLoading(true)}
        isLoading={isLoading}
      />

      {/* Error Message */}
      {error && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-red-600">
              <p>{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <SearchFilter
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Tìm kiếm sự kiện..."
              />
            </div>
            <div className="w-full sm:w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as EventStatus | 'ALL')}
                className="w-full h-10 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="ALL">Tất cả trạng thái</option>
                <option value="SCHEDULED">Đã lên lịch</option>
                <option value="ACTIVE">Đang diễn ra</option>
                <option value="COMPLETED">Đã kết thúc</option>
                <option value="CANCELLED">Đã hủy</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <DataTable<Event>
        columns={columns}
        data={events}
        keyExtractor={(event) => event.id}
        isLoading={isLoading}
        emptyMessage="Chưa có sự kiện nào"
      />

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        pageSize={pageSize}
        totalElements={totalElements}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Xác nhận xóa sự kiện"
        description={`Bạn có chắc chắn muốn xóa sự kiện "${eventToDelete?.name}"? Hành động này không thể hoàn tác.`}
        onConfirm={handleDelete}
        confirmText="Xóa"
        cancelText="Hủy"
        variant="destructive"
      />
    </div>
  );
}
