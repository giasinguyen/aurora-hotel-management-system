import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { 
  ArrowLeft, 
  Edit, 
  Loader2, 
  UserX, 
  UserCheck,
  Settings,
  Building2
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ConfirmDialog } from '@/components/custom';

import { UserDetailCard, PermissionManager, BranchAssignment } from './components';
import { getUserById, toggleUserStatus } from '@/services/userApi';
import type { User } from '@/types/user.types';
import { APP_COLOR } from '@/utils/constant';

export default function UserDetail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const userId = searchParams.get('id');
  
  // Get base path from current location
  const basePath = '/' + location.pathname.split('/')[1];

  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('info');
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [statusAction, setStatusAction] = useState<'activate' | 'deactivate'>('deactivate');

  // Fetch user data
  const fetchUser = async () => {
    if (!userId) {
      toast.error('Không tìm thấy ID người dùng');
      navigate(`${basePath}/users`);
      return;
    }

    try {
      setIsLoading(true);
      const response = await getUserById(userId);
      setUser(response.result);
    } catch (error) {
      console.error('Failed to fetch user:', error);
      toast.error('Không thể tải thông tin người dùng');
      navigate(`${basePath}/users`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [userId]);

  // Handle toggle status
  const handleToggleStatus = async () => {
    if (!user) return;

    try {
      const newStatus = statusAction === 'activate';
      await toggleUserStatus(user.id, newStatus);
      toast.success(
        newStatus 
          ? 'Đã kích hoạt tài khoản' 
          : 'Đã vô hiệu hóa tài khoản'
      );
      setStatusDialogOpen(false);
      fetchUser(); // Refresh user data
    } catch (error) {
      console.error('Failed to toggle user status:', error);
      toast.error('Không thể thay đổi trạng thái tài khoản');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Đang tải thông tin người dùng...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-muted-foreground">Không tìm thấy người dùng</p>
        <Button onClick={() => navigate(`${basePath}/users`)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại danh sách
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate(`${basePath}/users`)}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Quay lại
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Chi tiết người dùng</h1>
            <p className="text-muted-foreground">
              Xem và quản lý thông tin của {user.firstName} {user.lastName}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {user.active ? (
            <Button 
              variant="outline" 
              className="text-amber-600 hover:text-amber-700 gap-2"
              onClick={() => {
                setStatusAction('deactivate');
                setStatusDialogOpen(true);
              }}
            >
              <UserX className="h-4 w-4" />
              Vô hiệu hóa
            </Button>
          ) : (
            <Button 
              variant="outline" 
              className="text-emerald-600 hover:text-emerald-700 gap-2"
              onClick={() => {
                setStatusAction('activate');
                setStatusDialogOpen(true);
              }}
            >
              <UserCheck className="h-4 w-4" />
              Kích hoạt
            </Button>
          )}
          <Button 
            onClick={() => navigate(`${basePath}/users/upsert?id=${userId}`)}
            className="gap-2"
            style={{
              background: `linear-gradient(135deg, ${APP_COLOR.ADMIN} 0%, #8B0000 100%)`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = `linear-gradient(135deg, #8B0000 0%, ${APP_COLOR.ADMIN} 100%)`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = `linear-gradient(135deg, ${APP_COLOR.ADMIN} 0%, #8B0000 100%)`;
            }}
          >
            <Edit className="h-4 w-4" />
            Chỉnh sửa
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full max-w-lg grid-cols-3">
          <TabsTrigger value="info" className="gap-2">
            <Settings className="h-4 w-4" />
            Thông tin
          </TabsTrigger>
          <TabsTrigger value="permissions" className="gap-2">
            <Settings className="h-4 w-4" />
            Quyền hạn
          </TabsTrigger>
          <TabsTrigger value="branch" className="gap-2">
            <Building2 className="h-4 w-4" />
            Chi nhánh
          </TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="mt-6">
          <UserDetailCard user={user} />
        </TabsContent>

        <TabsContent value="permissions" className="mt-6">
          <PermissionManager user={user} onUpdate={fetchUser} />
        </TabsContent>

        <TabsContent value="branch" className="mt-6">
          <BranchAssignment user={user} onUpdate={fetchUser} />
        </TabsContent>
      </Tabs>

      {/* Status Toggle Dialog */}
      <ConfirmDialog
        open={statusDialogOpen}
        onOpenChange={setStatusDialogOpen}
        title={statusAction === 'activate' ? 'Kích hoạt tài khoản' : 'Vô hiệu hóa tài khoản'}
        description={
          statusAction === 'activate'
            ? `Bạn có chắc muốn kích hoạt lại tài khoản "${user.firstName} ${user.lastName}"? Người dùng sẽ có thể đăng nhập và sử dụng hệ thống.`
            : `Bạn có chắc muốn vô hiệu hóa tài khoản "${user.firstName} ${user.lastName}"? Người dùng sẽ không thể đăng nhập cho đến khi được kích hoạt lại.`
        }
        confirmText={statusAction === 'activate' ? 'Kích hoạt' : 'Vô hiệu hóa'}
        cancelText="Hủy"
        onConfirm={handleToggleStatus}
        variant={statusAction === 'activate' ? 'default' : 'destructive'}
      />
    </div>
  );
}