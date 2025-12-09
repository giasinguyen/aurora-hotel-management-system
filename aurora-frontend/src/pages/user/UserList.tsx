import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { 
  Eye, 
  MoreHorizontal, 
  Edit, 
  User as UserIcon,
  Shield,
  Calendar,
  Mail,
  UserX,
  UserCheck,
  Phone,
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { 
  PageHeader, 
  DataTable, 
  Pagination, 
  SearchFilter, 
  ConfirmDialog,
  type Column 
} from '@/components/custom';

import { getUsersPaginated, toggleUserStatus, searchUsers, getUsersByRole } from '@/services/userApi';
import { useAppSelector } from '@/hooks/useRedux';
import type { User } from '@/types/user.types';
import { ROLE_CONFIG } from '@/types/user.types';

export default function UserList() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get base path from current location (e.g., /admin, /manager, /staff)
  const basePath = '/' + location.pathname.split('/')[1];
  
  // Get current user to check role
  const currentUser = useAppSelector((state) => state.auth.user);
  
  // Check if user is Manager (not Admin)
  // Note: roles in UserSessionResponse is string[] not array of objects
  const isManager = currentUser?.roles?.some(
    (role) => role === 'ROLE_MANAGER' || role === 'MANAGER'
  ) && !currentUser?.roles?.some(
    (role) => role === 'ROLE_ADMIN' || role === 'ADMIN'
  );
  
  // State
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  
  // Filters
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  
  // Sorting
  const [sortColumn, setSortColumn] = useState('username');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  
  // Dialogs
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [statusAction, setStatusAction] = useState<'activate' | 'deactivate'>('deactivate');

  // Fetch users - different logic for Manager vs Admin
  const fetchUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Manager can only see STAFF and CUSTOMER
      if (isManager) {
        // Fetch both STAFF and CUSTOMER users
        const [staffRes, customerRes] = await Promise.all([
          getUsersByRole('STAFF', { page: 0, size: 1000 }),
          getUsersByRole('CUSTOMER', { page: 0, size: 1000 }),
        ]);
        
        let allUsers: User[] = [];
        if (staffRes.result?.content) {
          allUsers = [...allUsers, ...staffRes.result.content];
        }
        if (customerRes.result?.content) {
          allUsers = [...allUsers, ...customerRes.result.content];
        }
        
        // Apply client-side filters
        let filteredUsers = allUsers;
        
        // Filter by search keyword
        if (searchKeyword) {
          filteredUsers = filteredUsers.filter(u => 
            u.username.toLowerCase().includes(searchKeyword.toLowerCase()) ||
            u.email?.toLowerCase().includes(searchKeyword.toLowerCase()) ||
            u.firstName?.toLowerCase().includes(searchKeyword.toLowerCase()) ||
            u.lastName?.toLowerCase().includes(searchKeyword.toLowerCase())
          );
        }
        
        // Filter by role
        if (selectedRole) {
          filteredUsers = filteredUsers.filter(u => 
            u.roles?.some(r => r.name === selectedRole)
          );
        }
        
        // Filter by status
        if (selectedStatus === 'active') {
          filteredUsers = filteredUsers.filter(u => u.active === true);
        } else if (selectedStatus === 'inactive') {
          filteredUsers = filteredUsers.filter(u => u.active === false);
        }
        
        // Paginate client-side
        const startIndex = currentPage * pageSize;
        const paginatedUsers = filteredUsers.slice(startIndex, startIndex + pageSize);
        
        setUsers(paginatedUsers);
        setTotalElements(filteredUsers.length);
        setTotalPages(Math.ceil(filteredUsers.length / pageSize));
        return;
      }
      
      // Admin flow - original logic
      let response;
      if (searchKeyword) {
        response = await searchUsers({
          username: searchKeyword,
          page: currentPage,
          size: pageSize,
        });
      } else {
        response = await getUsersPaginated({
          page: currentPage,
          size: pageSize,
          sortBy: sortColumn,
          sortDir: sortDirection,
        });
      }
      
      if (response.result) {
        let filteredUsers = response.result.content;
        
        // Client-side filter by role
        if (selectedRole) {
          filteredUsers = filteredUsers.filter(u => 
            u.roles?.some(r => r.name === selectedRole)
          );
        }

        // Client-side filter by status
        if (selectedStatus === 'active') {
          filteredUsers = filteredUsers.filter(u => u.active === true);
        } else if (selectedStatus === 'inactive') {
          filteredUsers = filteredUsers.filter(u => u.active === false);
        }
        
        setUsers(filteredUsers);
        setTotalElements(response.result.totalElements);
        setTotalPages(response.result.totalPages);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
      toast.error('Không thể tải danh sách người dùng');
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, pageSize, searchKeyword, selectedRole, selectedStatus, sortColumn, sortDirection, isManager]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Refresh when navigating back from create/edit
  useEffect(() => {
    if (location.state?.refresh) {
      // Clear filters to see newly created/updated user
      setSearchKeyword('');
      setSelectedRole('');
      setSelectedStatus('');
      setCurrentPage(0);
      
      // Clear the state to prevent unnecessary refreshes
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // Handle toggle user status
  const handleToggleStatus = async () => {
    if (!selectedUser) return;
    
    try {
      const newStatus = statusAction === 'activate';
      await toggleUserStatus(selectedUser.id, newStatus);
      toast.success(
        newStatus 
          ? 'Đã kích hoạt tài khoản' 
          : 'Đã vô hiệu hóa tài khoản'
      );
      setStatusDialogOpen(false);
      setSelectedUser(null);
      fetchUsers();
    } catch (error) {
      console.error('Failed to toggle user status:', error);
      toast.error('Không thể thay đổi trạng thái tài khoản');
    }
  };

  // Open status dialog
  const openStatusDialog = (user: User, action: 'activate' | 'deactivate') => {
    setSelectedUser(user);
    setStatusAction(action);
    setStatusDialogOpen(true);
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
    setSelectedRole('');
    setSelectedStatus('');
    setCurrentPage(0);
  };

  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  // Get initials from name
  const getInitials = (firstName?: string, lastName?: string) => {
    const first = firstName?.charAt(0).toUpperCase() || '';
    const last = lastName?.charAt(0).toUpperCase() || '';
    return first + last || 'U';
  };

  // Table columns
  const columns: Column<User>[] = [
    {
      key: 'user',
      header: 'Người dùng',
      cell: (item) => (
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar className="h-10 w-10">
              <AvatarImage src={item.avatarUrl} alt={item.username} />
              <AvatarFallback className="bg-primary/10 text-primary">
                {getInitials(item.firstName, item.lastName)}
              </AvatarFallback>
            </Avatar>
            {/* Status indicator dot */}
            <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${
              item.active ? 'bg-emerald-500' : 'bg-gray-400'
            }`} />
          </div>
          <div>
            <div className="font-medium flex items-center gap-2">
              {item.firstName} {item.lastName}
              {!item.active && (
                <Badge variant="outline" className="text-xs bg-red-50 text-red-600 border-red-200">
                  Đã vô hiệu hóa
                </Badge>
              )}
            </div>
            <div className="text-sm text-muted-foreground flex items-center gap-1">
              <UserIcon className="h-3 w-3" />
              {item.username}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'contact',
      header: 'Liên hệ',
      cell: (item) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span className="truncate max-w-[180px]" title={item.email || undefined}>
              {item.email || '-'}
            </span>
          </div>
          {item.phone && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Phone className="h-4 w-4" />
              {item.phone}
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'dob',
      header: 'Ngày sinh',
      cell: (item) => (
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          {formatDate(item.dob)}
        </div>
      ),
      sortable: true,
    },
    {
      key: 'roles',
      header: 'Vai trò',
      cell: (item) => (
        <div className="flex flex-wrap gap-1">
          {item.roles?.map((role) => {
            const config = ROLE_CONFIG[role.name] || { label: role.name, color: 'text-gray-700', bgColor: 'bg-gray-100' };
            return (
              <Badge 
                key={role.id} 
                variant="outline" 
                className={`${config.bgColor} ${config.color} border-0`}
              >
                <Shield className="h-3 w-3 mr-1" />
                {config.label}
              </Badge>
            );
          }) || '-'}
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Trạng thái',
      cell: (item) => (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2">
                <Switch
                  checked={item.active}
                  onCheckedChange={(checked) => {
                    openStatusDialog(item, checked ? 'activate' : 'deactivate');
                  }}
                  className={item.active ? 'data-[state=checked]:bg-emerald-500' : ''}
                />
                <span className={`text-sm font-medium ${item.active ? 'text-emerald-600' : 'text-gray-500'}`}>
                  {item.active ? 'Hoạt động' : 'Đã tắt'}
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{item.active ? 'Bấm để vô hiệu hóa tài khoản' : 'Bấm để kích hoạt tài khoản'}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ),
    },
    {
      key: 'actions',
      header: '',
      cell: (item) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate(`${basePath}/users/upsert?id=${item.id}&view=true`)}>
              <Eye className="h-4 w-4 mr-2" />
              Xem chi tiết
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate(`${basePath}/users/upsert?id=${item.id}`)}>
              <Edit className="h-4 w-4 mr-2" />
              Chỉnh sửa
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {item.active ? (
              <DropdownMenuItem
                className="text-amber-600"
                onClick={() => openStatusDialog(item, 'deactivate')}
              >
                <UserX className="h-4 w-4 mr-2" />
                Vô hiệu hóa
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem
                className="text-emerald-600"
                onClick={() => openStatusDialog(item, 'activate')}
              >
                <UserCheck className="h-4 w-4 mr-2" />
                Kích hoạt lại
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      ),
      className: 'w-[50px]',
    },
  ];

  // Filter options
  const roleOptions = Object.entries(ROLE_CONFIG).map(([value, config]) => ({
    value,
    label: config.label,
  }));

  const statusOptions = [
    { value: 'active', label: 'Đang hoạt động' },
    { value: 'inactive', label: 'Đã vô hiệu hóa' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Quản lý người dùng"
        description="Xem và quản lý tất cả người dùng trong hệ thống"
        onAdd={() => navigate(`${basePath}/users/upsert`)}
        addButtonText="Thêm người dùng"
        onRefresh={fetchUsers}
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
            searchPlaceholder="Tìm theo tên đăng nhập..."
            filters={[
              {
                key: 'role',
                label: 'Vai trò',
                value: selectedRole,
                options: roleOptions,
                onChange: (value) => {
                  setSelectedRole(value === 'all' ? '' : value);
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
            data={users}
            keyExtractor={(item) => item.id}
            isLoading={isLoading}
            emptyMessage="Không có người dùng nào"
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

      {/* Status Toggle Confirmation Dialog */}
      <ConfirmDialog
        open={statusDialogOpen}
        onOpenChange={setStatusDialogOpen}
        title={statusAction === 'activate' ? 'Kích hoạt tài khoản' : 'Vô hiệu hóa tài khoản'}
        description={
          statusAction === 'activate'
            ? `Bạn có chắc muốn kích hoạt lại tài khoản "${selectedUser?.firstName} ${selectedUser?.lastName}"? Người dùng sẽ có thể đăng nhập và sử dụng hệ thống.`
            : `Bạn có chắc muốn vô hiệu hóa tài khoản "${selectedUser?.firstName} ${selectedUser?.lastName}"? Người dùng sẽ không thể đăng nhập cho đến khi được kích hoạt lại.`
        }
        confirmText={statusAction === 'activate' ? 'Kích hoạt' : 'Vô hiệu hóa'}
        cancelText="Hủy"
        onConfirm={handleToggleStatus}
        variant={statusAction === 'activate' ? 'default' : 'destructive'}
      />
    </div>
  );
}