import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { ArrowLeft, Loader2, User as UserIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { UserForm, UserDetailCard, PermissionManager } from './components';
import { getUserById, createUser, updateUser } from '@/services/userApi';
import type { User, UserCreationRequest, UserUpdateRequest } from '@/types/user.types';
import { APP_COLOR } from '@/utils/constant';

export default function UserUpsert() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const userId = searchParams.get('id');
  const isViewMode = searchParams.get('view') === 'true';
  const isEditMode = !!userId && !isViewMode;

  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // If we have userId, redirect to UserDetail for view mode
  useEffect(() => {
    if (isViewMode && userId) {
      // Redirect to proper detail page
      navigate(`/admin/users/detail?id=${userId}`, { replace: true });
    }
  }, [isViewMode, userId, navigate]);

  // Fetch user data for edit mode
  const fetchUser = async () => {
    if (!userId) return;

    try {
      setIsLoading(true);
      const response = await getUserById(userId);
      setUser(response.result);
    } catch (error) {
      console.error('Failed to fetch user:', error);
      toast.error('Không thể tải thông tin người dùng');
      navigate('/admin/users');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (userId && !isViewMode) {
      fetchUser();
    }
  }, [userId]);

  // Handle form submit
  const handleSubmit = async (data: UserCreationRequest | UserUpdateRequest) => {
    try {
      setIsSaving(true);
      
      if (isEditMode && userId) {
        // Update existing user
        await updateUser(userId, data as UserUpdateRequest);
        toast.success('Cập nhật người dùng thành công');
      } else {
        // Create new user
        await createUser(data as UserCreationRequest);
        toast.success('Tạo người dùng thành công');
      }
      
      // Navigate back and force refresh with state
      navigate('/admin/users', { state: { refresh: true }, replace: true });
    } catch (error: any) {
      console.error('Failed to save user:', error);
      const errorMessage = error.response?.data?.message || 'Không thể lưu người dùng';
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    navigate('/admin/users');
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

  return (
    <div className="space-y-6 pb-8">
      {/* Header with gradient background */}
      <div 
        className="relative overflow-hidden rounded-2xl p-8 shadow-2xl"
        style={{ 
          background: `linear-gradient(135deg, ${APP_COLOR.ADMIN} 0%, #8B0000 50%, #660000 100%)` 
        }}
      >
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/admin/users')}
            className="gap-2 text-white hover:bg-white/20 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Quay lại danh sách
          </Button>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <UserIcon className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">
                {isEditMode ? 'Chỉnh sửa người dùng' : 'Thêm người dùng mới'}
              </h1>
              <p className="text-white/90 mt-1">
                {isEditMode 
                  ? `Cập nhật thông tin cho ${user?.firstName} ${user?.lastName}`
                  : 'Tạo tài khoản người dùng mới trong hệ thống'
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Form - Full width for better layout */}
      <div className="max-w-7xl mx-auto">
        <UserForm
          user={user}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isSaving}
        />
      </div>
    </div>
  );
}