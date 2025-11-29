import { useState, useEffect } from 'react';
import { 
  Shield, 
  Lock, 
  Unlock, 
  Search,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  RefreshCw
} from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { getPermissions } from '@/services/roleApi';
import { updateUserPermissions, getUserPermissions } from '@/services/userApi';
import type { User, Permission } from '@/types/user.types';
import { toast } from 'sonner';

interface PermissionManagerProps {
  user: User;
  onUpdate?: () => void;
}

interface PermissionState {
  permission: Permission;
  isGranted: boolean;        // Final calculated state
  fromRole: boolean;         // Inherited from role
  overrideValue?: boolean;   // Explicit override (true = granted, false = revoked)
}

export default function PermissionManager({ user, onUpdate }: PermissionManagerProps) {
  const [allPermissions, setAllPermissions] = useState<Permission[]>([]);
  const [permissionStates, setPermissionStates] = useState<PermissionState[]>([]);
  const [disabledPermissionIds, setDisabledPermissionIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    permission: PermissionState | null;
    action: 'grant' | 'revoke';
  }>({ open: false, permission: null, action: 'grant' });

  // Get all permissions from user's roles
  const getRolePermissions = (): Set<string> => {
    const permissions = new Set<string>();
    user.roles?.forEach(role => {
      role.permissions?.forEach(perm => {
        permissions.add(perm.id);
      });
    });
    return permissions;
  };

  // Fetch all permissions and user overrides
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch all available permissions
        const permResponse = await getPermissions({ page: 0, size: 1000 });
        const permissions = permResponse.result?.content || [];
        
        if (permissions.length === 0) {
          console.warn('No permissions found in system');
        }
        
        setAllPermissions(permissions);

        // Fetch user's disabled permissions
        try {
          const disabledResponse = await getUserPermissions(user.id);
          setDisabledPermissionIds(disabledResponse.result || []);
        } catch (error) {
          console.error('Failed to fetch user permissions:', error);
          // API might not exist yet, continue with empty
          setDisabledPermissionIds([]);
        }
      } catch (error) {
        console.error('Failed to fetch permissions:', error);
        toast.error('Không thể tải danh sách quyền');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [user.id]);

  // Calculate permission states whenever dependencies change
  useEffect(() => {
    const rolePermissionIds = getRolePermissions();
    
    const states: PermissionState[] = allPermissions.map(perm => {
      const fromRole = rolePermissionIds.has(perm.id);
      const isDisabled = disabledPermissionIds.includes(perm.id);
      
      // If from role and disabled, it's revoked
      // If from role and not disabled, it's granted from role
      // If not from role, it's not granted
      const isGranted = fromRole && !isDisabled;
      const overrideValue = fromRole && isDisabled ? false : undefined;

      return {
        permission: perm,
        isGranted,
        fromRole,
        overrideValue,
      };
    });

    setPermissionStates(states);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allPermissions, disabledPermissionIds, user.roles]);

  // Group permissions by category (e.g., USER_READ -> USER)
  const getPermissionGroups = () => {
    const groups: Record<string, PermissionState[]> = {};
    
    permissionStates.forEach(state => {
      // Extract category from permission name (e.g., "USER" from "USER_READ")
      const parts = state.permission.name.split('_');
      const category = parts.length > 1 ? parts[0] : 'OTHER';
      
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(state);
    });

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      Object.keys(groups).forEach(category => {
        groups[category] = groups[category].filter(state =>
          state.permission.name.toLowerCase().includes(query) ||
          state.permission.description?.toLowerCase().includes(query)
        );
        if (groups[category].length === 0) {
          delete groups[category];
        }
      });
    }

    return groups;
  };

  const handlePermissionToggle = (state: PermissionState) => {
    const newGranted = !state.isGranted;
    
    // If revoking a role-inherited permission, show confirmation
    if (state.fromRole && !newGranted) {
      setConfirmDialog({
        open: true,
        permission: state,
        action: 'revoke'
      });
      return;
    }

    applyPermissionChange(state, newGranted);
  };

  const applyPermissionChange = (state: PermissionState, newGranted: boolean) => {
    setDisabledPermissionIds(prev => {
      if (newGranted) {
        // Enable: remove from disabled list
        return prev.filter(id => id !== state.permission.id);
      } else {
        // Disable: add to disabled list if not already there
        if (prev.includes(state.permission.id)) {
          return prev;
        }
        return [...prev, state.permission.id];
      }
    });
    setHasChanges(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateUserPermissions(user.id, { disabledPermissions: disabledPermissionIds });
      toast.success('Đã cập nhật quyền người dùng');
      setHasChanges(false);
      onUpdate?.();
    } catch (error) {
      console.error('Failed to save permissions:', error);
      toast.error('Không thể lưu thay đổi');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setDisabledPermissionIds([]);
    setHasChanges(true);
  };

  const getCategoryLabel = (category: string): string => {
    const labels: Record<string, string> = {
      USER: 'Quản lý người dùng',
      ROLE: 'Quản lý vai trò',
      ROOM: 'Quản lý phòng',
      BOOKING: 'Quản lý đặt phòng',
      SERVICE: 'Quản lý dịch vụ',
      BRANCH: 'Quản lý chi nhánh',
      REPORT: 'Báo cáo & Thống kê',
      PROMOTION: 'Quản lý khuyến mãi',
      NEWS: 'Quản lý tin tức',
      AMENITY: 'Quản lý tiện nghi',
      DASHBOARD: 'Dashboard',
      OTHER: 'Khác'
    };
    return labels[category] || category;
  };

  const permissionGroups = getPermissionGroups();

  if (isLoading) {
    return (
      <Card className="overflow-hidden border-0 shadow-lg">
        <CardContent className="p-12 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <TooltipProvider>
      <Card className="overflow-hidden border-0 shadow-lg">
        <CardHeader style={{ backgroundColor: 'oklch(0.702 0.078 56.8)' }} className="text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <Shield className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="text-xl">Quản lý quyền chi tiết</CardTitle>
                <CardDescription className="text-purple-100">
                  Tùy chỉnh quyền hạn cho người dùng này
                </CardDescription>
              </div>
            </div>
            {hasChanges && (
              <Badge className="bg-amber-500 text-white">
                Có thay đổi chưa lưu
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {/* Search and Actions */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm quyền..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleReset}
                disabled={disabledPermissionIds.length === 0}
                className="gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Reset về mặc định
              </Button>
              <Button
                onClick={handleSave}
                disabled={!hasChanges || isSaving}
                className="gap-2 bg-gradient-to-r from-indigo-600 to-purple-600"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Đang lưu...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    Lưu thay đổi
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
              <span>Có quyền (từ vai trò)</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span>Có quyền (được cấp thêm)</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span>Bị thu hồi</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-3 h-3 rounded-full bg-gray-300" />
              <span>Không có quyền</span>
            </div>
          </div>

          <Separator />

          {/* Permission Groups */}
          {Object.keys(permissionGroups).length === 0 ? (
            <div className="text-center py-12">
              <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-900">
                {allPermissions.length === 0 
                  ? 'Chưa có quyền nào trong hệ thống' 
                  : 'Không tìm thấy quyền'}
              </h4>
              <p className="text-muted-foreground mt-1">
                {allPermissions.length === 0 
                  ? 'Vui lòng liên hệ quản trị viên để thêm quyền vào hệ thống' 
                  : 'Thử tìm kiếm với từ khóa khác'}
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(permissionGroups).map(([category, permissions]) => (
                <div key={category} className="space-y-3">
                  <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Shield className="h-4 w-4 text-indigo-500" />
                    {getCategoryLabel(category)}
                    <Badge variant="outline" className="ml-2">
                      {permissions.length}
                    </Badge>
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {permissions.map((state) => {
                      // Determine status color and icon
                      let statusColor = 'bg-gray-300';
                      let StatusIcon = XCircle;
                      let statusText = 'Không có quyền';

                      if (state.isGranted) {
                        if (state.overrideValue === true) {
                          statusColor = 'bg-blue-500';
                          StatusIcon = Unlock;
                          statusText = 'Được cấp thêm';
                        } else if (state.fromRole) {
                          statusColor = 'bg-emerald-500';
                          StatusIcon = CheckCircle2;
                          statusText = 'Từ vai trò';
                        }
                      } else if (state.overrideValue === false && state.fromRole) {
                        statusColor = 'bg-red-500';
                        StatusIcon = Lock;
                        statusText = 'Bị thu hồi';
                      }

                      return (
                        <div
                          key={state.permission.id}
                          className={`
                            p-4 rounded-xl border-2 transition-all duration-200
                            ${state.isGranted 
                              ? 'border-emerald-200 bg-emerald-50/50' 
                              : state.overrideValue === false 
                                ? 'border-red-200 bg-red-50/50'
                                : 'border-gray-200 bg-white'
                            }
                          `}
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex items-start gap-3 flex-1">
                              <Tooltip>
                                <TooltipTrigger>
                                  <div className={`w-3 h-3 rounded-full ${statusColor} mt-1.5`} />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>{statusText}</p>
                                </TooltipContent>
                              </Tooltip>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <StatusIcon className={`h-4 w-4 flex-shrink-0 ${
                                    state.isGranted 
                                      ? 'text-emerald-500' 
                                      : state.overrideValue === false 
                                        ? 'text-red-500'
                                        : 'text-gray-400'
                                  }`} />
                                  <span className="font-medium text-gray-900 truncate">
                                    {state.permission.name}
                                  </span>
                                </div>
                                {state.permission.description && (
                                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                    {state.permission.description}
                                  </p>
                                )}
                                {state.fromRole && state.overrideValue === undefined && (
                                  <Badge variant="outline" className="mt-2 text-xs">
                                    Kế thừa từ vai trò
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <Switch
                              checked={state.isGranted}
                              onCheckedChange={() => handlePermissionToggle(state)}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <AlertDialog 
        open={confirmDialog.open} 
        onOpenChange={(open) => setConfirmDialog(prev => ({ ...prev, open }))}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Xác nhận thu hồi quyền
            </AlertDialogTitle>
            <AlertDialogDescription>
              Quyền <strong>{confirmDialog.permission?.permission.name}</strong> được kế thừa từ vai trò. 
              Bạn có chắc muốn thu hồi quyền này cho người dùng <strong>{user.firstName} {user.lastName}</strong>?
              <br /><br />
              Người dùng sẽ không thể thực hiện các thao tác liên quan đến quyền này.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={() => {
                if (confirmDialog.permission) {
                  applyPermissionChange(confirmDialog.permission, false);
                }
                setConfirmDialog({ open: false, permission: null, action: 'grant' });
              }}
            >
              Thu hồi quyền
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </TooltipProvider>
  );
}
