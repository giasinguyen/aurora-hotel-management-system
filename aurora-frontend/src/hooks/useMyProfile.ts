import { useState, useEffect } from 'react';
import { userApi } from '@/services/userApi';
import { toast } from 'sonner';
import type { User, ProfileUpdateRequest } from '@/types/user.types';

export const useMyProfile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchProfile = async () => {
    try {
      const apiResponse = await userApi.getMyInfo();
      
      if (apiResponse.result) {
        console.log('✅ Setting user data');
        setUser(apiResponse.result);
      }
    } catch (error) {
      toast.error('Không thể tải thông tin người dùng');
    } finally {
      console.log('🏁 Setting loading = false');
      setLoading(false);
    }
  };

  const updateProfile = async (data: ProfileUpdateRequest) => {
    try {
      setSaving(true);
      const response = await userApi.updateMyInfo(data);
      
      if (response.result) {
        setUser(response.result);
        toast.success('Cập nhật thông tin thành công!');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Lỗi cập nhật profile:', error);
      toast.error('Cập nhật thất bại. Vui lòng kiểm tra lại.');
      return false;
    } finally {
      setSaving(false);
    }
  };

  const handleUploadAvatar = async (file: File) => {
    try {
      await userApi.uploadAvatar(file);
      await fetchProfile();
      toast.success('Đổi ảnh đại diện thành công!');
    } catch (error) {
      console.error('Lỗi upload ảnh:', error);
      toast.error('Lỗi khi tải ảnh lên.');
    }
  };


  useEffect(() => {
    let isMounted = true;

    const loadProfile = async () => {
      try {
        console.log('🔵 Calling API...');
        const apiResponse = await userApi.getMyInfo();
        
        
        if (isMounted && apiResponse.result) {
          console.log('✅ Setting user data');
          setUser(apiResponse.result);
        }
      } catch (error) {

        if (isMounted) {
          toast.error('Không thể tải thông tin người dùng');
        }
      } finally {
        if (isMounted) {
          console.log('🏁 Setting loading = false');
          setLoading(false);
        }
      }
    };

    loadProfile();
    return () => {
      isMounted = false;
    };
  }, []); 

  return {
    user,
    loading,
    saving,
    refresh: fetchProfile,
    updateProfile,
    uploadAvatar: handleUploadAvatar,
  };
};