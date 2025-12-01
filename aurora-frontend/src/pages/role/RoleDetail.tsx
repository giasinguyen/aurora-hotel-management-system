import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { 
  ArrowLeft, 
  Edit, 
  Loader2, 
  Shield,
  Key,
  Users,
  Search,
  Save,
  Mail,
  Phone,
  ChevronRight,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { getRoleById, updateRole, getPermissions } from '@/services/roleApi';
import { getUsersByRole } from '@/services/userApi';
import type { Role, Permission, RoleUpdateRequest } from '@/types/user.types';
import type { User } from '@/types/user.types';
import { ROLE_CONFIG } from '@/types/user.types';

// Theme color constant
const THEME_COLOR = 'oklch(0.702 0.078 56.8)';

export default function RoleDetail() {
  const { id: roleId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // State
  const [role, setRole] = useState<Role | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [allPermissions, setAllPermissions] = useState<Permission[]>([]);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Search & Filter
  const [permissionSearch, setPermissionSearch] = useState('');
  const [userSearch, setUserSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Edit dialog
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({ name: '', description: '' });

  // Fetch role data
  const fetchRole = useCallback(async () => {
    if (!roleId) return;

    try {
      setIsLoading(true);
      const response = await getRoleById(roleId);
      if (response.result) {
        setRole(response.result);
        setSelectedPermissions(response.result.permissions?.map(p => p.id) || []);
        setEditFormData({
          name: response.result.name,
          description: response.result.description || '',
        });
      }
    } catch (error) {
      console.error('Failed to fetch role:', error);
      toast.error('Không thể tải thông tin vai trò');
      navigate('/admin/roles');
    } finally {
      setIsLoading(false);
    }
  }, [roleId, navigate]);

  // Fetch all permissions
  const fetchPermissions = useCallback(async () => {
    try {
      const response = await getPermissions({ page: 0, size: 1000 });
      if (response.result) {
        setAllPermissions(response.result.content);
      }
    } catch (error) {
      console.error('Failed to fetch permissions:', error);
    }
  }, []);

  // Fetch users with this role
  const fetchUsers = useCallback(async () => {
    if (!roleId || !role) return;

    try {
      setIsLoadingUsers(true);
      const response = await getUsersByRole(role.name, { page: 0, size: 1000 });
      if (response.result?.content) {
        setUsers(response.result.content);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
      setUsers([]);
    } finally {
      setIsLoadingUsers(false);
    }
  }, [roleId, role]);

  useEffect(() => {
    fetchRole();
    fetchPermissions();
  }, [fetchRole, fetchPermissions]);

  useEffect(() => {
    if (role) {
      fetchUsers();
    }
  }, [role, fetchUsers]);

  // Check for changes
  useEffect(() => {
    if (role) {
      const originalIds = role.permissions?.map(p => p.id) || [];
      const hasPermissionChanges = 
        selectedPermissions.length !== originalIds.length ||
        !selectedPermissions.every(id => originalIds.includes(id));
      setHasChanges(hasPermissionChanges);
    }
  }, [selectedPermissions, role]);

  // Toggle permission
  const togglePermission = (permissionId: string) => {
    setSelectedPermissions(prev =>
      prev.includes(permissionId)
        ? prev.filter(id => id !== permissionId)
        : [...prev, permissionId]
    );
  };

  // Select all permissions in category
  const selectAllInCategory = (category: string) => {
    const categoryPermissions = allPermissions.filter(p => 
      p.name.startsWith(category.toUpperCase())
    );
    const allSelected = categoryPermissions.every(p => 
      selectedPermissions.includes(p.id)
    );
    
    if (allSelected) {
      setSelectedPermissions(prev => 
        prev.filter(id => !categoryPermissions.some(p => p.id === id))
      );
    } else {
      const newIds = categoryPermissions.map(p => p.id);
      setSelectedPermissions(prev => [...new Set([...prev, ...newIds])]);
    }
  };

  // Save permissions
  const handleSavePermissions = async () => {
    if (!roleId || !role) return;

    try {
      setIsSaving(true);
      const updateData: RoleUpdateRequest = {
        description: role.description,
        permissionIds: selectedPermissions,
      };
      
      await updateRole(roleId, updateData);
      toast.success('Cập nhật quyền hạn thành công');
      fetchRole();
    } catch (error) {
      console.error('Failed to save permissions:', error);
      toast.error('Không thể cập nhật quyền hạn');
    } finally {
      setIsSaving(false);
    }
  };

  // Update role info
  const handleUpdateRole = async () => {
    if (!roleId) return;

    try {
      const updateData: RoleUpdateRequest = {
        description: editFormData.description,
        permissionIds: selectedPermissions,
      };
      
      await updateRole(roleId, updateData);
      toast.success('Cập nhật vai trò thành công');
      setEditDialogOpen(false);
      fetchRole();
    } catch (error) {
      console.error('Failed to update role:', error);
      toast.error('Không thể cập nhật vai trò');
    }
  };

  // Get permission categories
  const getPermissionCategories = () => {
    const categories = new Set<string>();
    allPermissions.forEach(p => {
      const parts = p.name.split('_');
      if (parts.length > 1) {
        categories.add(parts[0]);
      }
    });
    return Array.from(categories).sort();
  };

  // Filter permissions
  const filteredPermissions = allPermissions.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(permissionSearch.toLowerCase()) ||
      p.description?.toLowerCase().includes(permissionSearch.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || 
      p.name.startsWith(selectedCategory.toUpperCase());
    return matchesSearch && matchesCategory;
  });

  // Filter users
  const filteredUsers = users.filter(u =>
    u.username?.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.firstName?.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.lastName?.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.email?.toLowerCase().includes(userSearch.toLowerCase())
  );

  // Group permissions by category
  const groupedPermissions = filteredPermissions.reduce((acc, p) => {
    const parts = p.name.split('_');
    const category = parts[0] || 'OTHER';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(p);
    return acc;
  }, {} as Record<string, Permission[]>);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Đang tải thông tin vai trò...</p>
        </div>
      </div>
    );
  }

  if (!role) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <p className="text-lg font-medium">Không tìm thấy vai trò</p>
          <Button 
            variant="outline" 
            onClick={() => navigate('/admin/roles')}
            className="mt-4"
          >
            Quay lại danh sách
          </Button>
        </div>
      </div>
    );
  }

  const roleConfig = ROLE_CONFIG[role.name] || { 
    label: role.name, 
    color: 'text-gray-700', 
    bgColor: 'bg-gray-100' 
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div 
        className="relative overflow-hidden rounded-2xl p-8 shadow-2xl"
        style={{ backgroundColor: THEME_COLOR }}
      >
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/admin/roles')}
            className="gap-2 text-white hover:bg-white/20 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Quay lại danh sách
          </Button>
          
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-white/20 rounded-xl backdrop-blur-sm">
                <Shield className="h-10 w-10 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">{roleConfig.label}</h1>
                <p className="text-white/90 mt-1 flex items-center gap-2">
                  <Badge variant="secondary" className="bg-white/20 text-white border-none">
                    {role.name}
                  </Badge>
                  <span>•</span>
                  <span>{role.permissions?.length || 0} quyền hạn</span>
                  <span>•</span>
                  <span>{users.length} người dùng</span>
                </p>
                {role.description && (
                  <p className="text-white/80 mt-2 max-w-2xl">{role.description}</p>
                )}
              </div>
            </div>
            
            <Button 
              onClick={() => setEditDialogOpen(true)}
              className="gap-2 bg-white/20 hover:bg-white/30 text-white border-none"
            >
              <Edit className="h-4 w-4" />
              Chỉnh sửa
            </Button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg" style={{ backgroundColor: `color-mix(in oklch, ${THEME_COLOR} 20%, white)` }}>
                <Key className="h-6 w-6" style={{ color: THEME_COLOR }} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Quyền hạn hiện tại</p>
                <p className="text-2xl font-bold">{selectedPermissions.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg" style={{ backgroundColor: `color-mix(in oklch, ${THEME_COLOR} 20%, white)` }}>
                <Users className="h-6 w-6" style={{ color: THEME_COLOR }} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Người dùng</p>
                <p className="text-2xl font-bold">{users.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg" style={{ backgroundColor: `color-mix(in oklch, ${THEME_COLOR} 20%, white)` }}>
                <Shield className="h-6 w-6" style={{ color: THEME_COLOR }} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tổng quyền hệ thống</p>
                <p className="text-2xl font-bold">{allPermissions.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="permissions" className="space-y-4">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="permissions" className="gap-2">
            <Key className="h-4 w-4" />
            Quyền hạn
          </TabsTrigger>
          <TabsTrigger value="users" className="gap-2">
            <Users className="h-4 w-4" />
            Người dùng ({users.length})
          </TabsTrigger>
        </TabsList>

        {/* Permissions Tab */}
        <TabsContent value="permissions" className="space-y-4">
          <Card>
            <CardHeader style={{ backgroundColor: THEME_COLOR }} className="text-white rounded-t-lg">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Key className="h-5 w-5" />
                    Quản lý quyền hạn
                  </CardTitle>
                  <CardDescription className="text-white/80">
                    Chọn các quyền hạn cho vai trò này
                  </CardDescription>
                </div>
                {hasChanges && (
                  <Button 
                    onClick={handleSavePermissions}
                    disabled={isSaving}
                    className="gap-2 bg-white/20 hover:bg-white/30 text-white border-none"
                  >
                    {isSaving ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    Lưu thay đổi
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              {/* Search and Filter */}
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Tìm kiếm quyền hạn..."
                    value={permissionSearch}
                    onChange={(e) => setPermissionSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2 flex-wrap">
                  <Button
                    variant={selectedCategory === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory('all')}
                    style={selectedCategory === 'all' ? { backgroundColor: THEME_COLOR } : {}}
                  >
                    Tất cả
                  </Button>
                  {getPermissionCategories().map(cat => (
                    <Button
                      key={cat}
                      variant={selectedCategory === cat ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedCategory(cat)}
                      style={selectedCategory === cat ? { backgroundColor: THEME_COLOR } : {}}
                    >
                      {cat}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Permissions Grid */}
              <ScrollArea className="h-[500px] pr-4">
                <div className="space-y-6">
                  {Object.entries(groupedPermissions).map(([category, permissions]) => (
                    <div key={category} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-lg flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: THEME_COLOR }}
                          />
                          {category}
                          <Badge variant="secondary" className="ml-2">
                            {permissions.filter(p => selectedPermissions.includes(p.id)).length}/{permissions.length}
                          </Badge>
                        </h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => selectAllInCategory(category)}
                          className="text-xs"
                        >
                          {permissions.every(p => selectedPermissions.includes(p.id)) 
                            ? 'Bỏ chọn tất cả' 
                            : 'Chọn tất cả'}
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {permissions.map(permission => (
                          <div
                            key={permission.id}
                            className={`
                              p-4 rounded-lg border-2 cursor-pointer transition-all duration-200
                              ${selectedPermissions.includes(permission.id)
                                ? 'border-primary bg-primary/5'
                                : 'border-transparent bg-muted/50 hover:bg-muted'
                              }
                            `}
                            onClick={() => togglePermission(permission.id)}
                            style={selectedPermissions.includes(permission.id) 
                              ? { borderColor: THEME_COLOR, backgroundColor: `color-mix(in oklch, ${THEME_COLOR} 10%, white)` }
                              : {}
                            }
                          >
                            <div className="flex items-start gap-3">
                              <Switch
                                checked={selectedPermissions.includes(permission.id)}
                                onCheckedChange={() => togglePermission(permission.id)}
                                className="mt-0.5"
                              />
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-sm truncate">
                                  {permission.name}
                                </p>
                                {permission.description && (
                                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                    {permission.description}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <Separator className="mt-4" />
                    </div>
                  ))}

                  {filteredPermissions.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                      <Key className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Không tìm thấy quyền hạn nào</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader style={{ backgroundColor: THEME_COLOR }} className="text-white rounded-t-lg">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Danh sách người dùng
                  </CardTitle>
                  <CardDescription className="text-white/80">
                    Người dùng có vai trò {roleConfig.label}
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={fetchUsers}
                  disabled={isLoadingUsers}
                  className="gap-2 text-white hover:bg-white/20"
                >
                  <RefreshCw className={`h-4 w-4 ${isLoadingUsers ? 'animate-spin' : ''}`} />
                  Làm mới
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              {/* Search */}
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm người dùng..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Users List */}
              {isLoadingUsers ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Không có người dùng nào với vai trò này</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredUsers.map(user => (
                    <Card 
                      key={user.id} 
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => navigate(`/admin/users/detail?id=${user.id}`)}
                    >
                      <CardContent className="pt-4">
                        <div className="flex items-start gap-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={user.avatarUrl} />
                            <AvatarFallback style={{ backgroundColor: THEME_COLOR }} className="text-white">
                              {user.firstName?.[0]}{user.lastName?.[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">
                              {user.firstName} {user.lastName}
                            </p>
                            <p className="text-sm text-muted-foreground truncate">
                              @{user.username}
                            </p>
                            <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                              {user.email && (
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger>
                                      <Mail className="h-3 w-3" />
                                    </TooltipTrigger>
                                    <TooltipContent>{user.email}</TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              )}
                              {user.phone && (
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger>
                                      <Phone className="h-3 w-3" />
                                    </TooltipTrigger>
                                    <TooltipContent>{user.phone}</TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              )}
                              <Badge 
                                variant={user.active ? 'default' : 'secondary'}
                                className="ml-auto text-xs"
                                style={user.active ? { backgroundColor: THEME_COLOR } : {}}
                              >
                                {user.active ? 'Hoạt động' : 'Vô hiệu'}
                              </Badge>
                            </div>
                          </div>
                          <ChevronRight className="h-5 w-5 text-muted-foreground" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Role Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chỉnh sửa vai trò</DialogTitle>
            <DialogDescription>
              Cập nhật thông tin vai trò trong hệ thống
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Tên vai trò</Label>
              <Input
                id="edit-name"
                value={editFormData.name}
                onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value.toUpperCase() })}
                placeholder="VD: ADMIN, MANAGER..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Mô tả</Label>
              <Textarea
                id="edit-description"
                value={editFormData.description}
                onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                placeholder="Mô tả vai trò..."
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Hủy
            </Button>
            <Button 
              onClick={handleUpdateRole}
              style={{ backgroundColor: THEME_COLOR }}
            >
              Cập nhật
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
