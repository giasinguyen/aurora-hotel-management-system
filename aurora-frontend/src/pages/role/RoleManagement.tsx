import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { 
  Eye, 
  MoreHorizontal, 
  Trash2, 
  Edit, 
  Shield,
  Key,
  Users,
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

import { 
  PageHeader, 
  DataTable, 
  Pagination, 
  SearchFilter, 
  ConfirmDialog,
  type Column 
} from '@/components/custom';

import { getRoles, createRole, updateRole, deleteRole } from '@/services/roleApi';
import type { Role, RoleCreationRequest, RoleUpdateRequest } from '@/types/user.types';
import { ROLE_CONFIG } from '@/types/user.types';

export default function RoleManagement() {
  const navigate = useNavigate();
  
  // State
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  
  // Filters
  const [searchKeyword, setSearchKeyword] = useState('');
  
  // Sorting
  const [sortColumn, setSortColumn] = useState('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  
  // Dialogs
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  
  // Form state
  const [formData, setFormData] = useState<RoleCreationRequest>({
    name: '',
    description: '',
  });

  // Fetch roles
  const fetchRoles = useCallback(async () => {
    try {
      setIsLoading(true);
      
      const response = await getRoles({
        page: currentPage,
        size: pageSize,
        sortBy: sortColumn,
        sortDir: sortDirection,
      });
      
      if (response.result) {
        let filteredRoles = response.result.content;
        
        // Client-side search filter
        if (searchKeyword) {
          filteredRoles = filteredRoles.filter(r => 
            r.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
            r.description?.toLowerCase().includes(searchKeyword.toLowerCase())
          );
        }
        
        setRoles(filteredRoles);
        setTotalElements(response.result.totalElements);
        setTotalPages(response.result.totalPages);
      }
    } catch (error) {
      console.error('Failed to fetch roles:', error);
      toast.error('Không thể tải danh sách vai trò');
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, pageSize, searchKeyword, sortColumn, sortDirection]);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  // Handle create/update role
  const handleSaveRole = async () => {
    try {
      if (editingRole) {
        await updateRole(editingRole.id, formData as RoleUpdateRequest);
        toast.success('Cập nhật vai trò thành công');
      } else {
        await createRole(formData);
        toast.success('Tạo vai trò thành công');
      }
      setEditDialogOpen(false);
      setEditingRole(null);
      setFormData({ name: '', description: '' });
      fetchRoles();
    } catch (error) {
      console.error('Failed to save role:', error);
      toast.error(editingRole ? 'Không thể cập nhật vai trò' : 'Không thể tạo vai trò');
    }
  };

  // Handle delete role
  const handleDeleteRole = async () => {
    if (!selectedRoleId) return;
    
    try {
      await deleteRole(selectedRoleId);
      toast.success('Xóa vai trò thành công');
      setDeleteDialogOpen(false);
      setSelectedRoleId(null);
      fetchRoles();
    } catch (error) {
      console.error('Failed to delete role:', error);
      toast.error('Không thể xóa vai trò');
    }
  };

  // Open edit dialog
  const openEditDialog = (role?: Role) => {
    if (role) {
      setEditingRole(role);
      setFormData({
        name: role.name,
        description: role.description || '',
      });
    } else {
      setEditingRole(null);
      setFormData({ name: '', description: '' });
    }
    setEditDialogOpen(true);
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
    setCurrentPage(0);
  };

  // Table columns
  const columns: Column<Role>[] = [
    {
      key: 'name',
      header: 'Tên vai trò',
      cell: (item) => {
        const config = ROLE_CONFIG[item.name] || { label: item.name, color: 'text-gray-700', bgColor: 'bg-gray-100' };
        return (
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${config.bgColor}`}>
              <Shield className={`h-5 w-5 ${config.color}`} />
            </div>
            <div>
              <div className="font-medium">{config.label}</div>
              <div className="text-sm text-muted-foreground">{item.name}</div>
            </div>
          </div>
        );
      },
      sortable: true,
    },
    {
      key: 'description',
      header: 'Mô tả',
      cell: (item) => (
        <span className="text-sm text-muted-foreground line-clamp-2">
          {item.description || 'Không có mô tả'}
        </span>
      ),
    },
    {
      key: 'permissions',
      header: 'Quyền hạn',
      cell: (item) => (
        <div className="flex items-center gap-2">
          <Key className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{item.permissions?.length || 0}</span>
          <span className="text-sm text-muted-foreground">quyền</span>
        </div>
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
            <DropdownMenuItem onClick={() => navigate(`/admin/roles/${item.id}`)}>
              <Eye className="h-4 w-4 mr-2" />
              Xem chi tiết
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => openEditDialog(item)}>
              <Edit className="h-4 w-4 mr-2" />
              Chỉnh sửa
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => {
                setSelectedRoleId(item.id);
                setDeleteDialogOpen(true);
              }}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Xóa vai trò
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
      className: 'w-[50px]',
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Quản lý vai trò"
        description="Xem và quản lý các vai trò và quyền hạn trong hệ thống"
        onAdd={() => openEditDialog()}
        addButtonText="Thêm vai trò"
        onRefresh={fetchRoles}
        isLoading={isLoading}
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tổng vai trò</p>
                <p className="text-2xl font-bold">{totalElements}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Key className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tổng quyền hạn</p>
                <p className="text-2xl font-bold">
                  {roles.reduce((acc, r) => acc + (r.permissions?.length || 0), 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Vai trò hệ thống</p>
                <p className="text-2xl font-bold">4</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">Bộ lọc</CardTitle>
        </CardHeader>
        <CardContent>
          <SearchFilter
            searchValue={searchKeyword}
            onSearchChange={setSearchKeyword}
            searchPlaceholder="Tìm theo tên vai trò..."
            onClear={handleClearFilters}
          />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <DataTable
            columns={columns}
            data={roles}
            keyExtractor={(item) => item.id}
            isLoading={isLoading}
            emptyMessage="Không có vai trò nào"
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

      {/* Create/Edit Role Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingRole ? 'Chỉnh sửa vai trò' : 'Thêm vai trò mới'}
            </DialogTitle>
            <DialogDescription>
              {editingRole 
                ? 'Cập nhật thông tin vai trò trong hệ thống' 
                : 'Tạo vai trò mới với các quyền hạn tương ứng'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Tên vai trò</Label>
              <Input
                id="name"
                placeholder="Nhập tên vai trò (VD: ADMIN, MANAGER...)"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value.toUpperCase() })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Mô tả</Label>
              <Textarea
                id="description"
                placeholder="Mô tả vai trò..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleSaveRole} disabled={!formData.name}>
              {editingRole ? 'Cập nhật' : 'Tạo mới'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Xác nhận xóa vai trò"
        description="Bạn có chắc chắn muốn xóa vai trò này? Tất cả người dùng có vai trò này sẽ mất quyền truy cập tương ứng."
        confirmText="Xóa"
        cancelText="Hủy"
        onConfirm={handleDeleteRole}
        variant="destructive"
      />
    </div>
  );
}