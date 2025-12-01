// ============================================
// Room Type Upsert Page - Aurora Hotel Management
// Create or Edit Room Type
// ============================================

import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { ArrowLeft, DoorOpen, Edit, Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

import { roomTypeApi } from '@/services/roomApi';
import type { RoomType, RoomTypeCreationRequest, RoomTypeUpdateRequest } from '@/types/room.types';
import { RoomTypeForm, RoomTypeDetailCard } from './components';

// ============================================
// Component
// ============================================

export default function RoomTypeUpsertPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Get ID from query params (edit mode)
  const roomTypeId = searchParams.get('id');
  const isEditMode = !!roomTypeId;
  const viewMode = searchParams.get('view') === 'true';

  // States
  const [roomType, setRoomType] = useState<RoomType | null>(null);
  const [isLoading, setIsLoading] = useState(isEditMode);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ========== Effects ==========

  // Fetch room type data for edit mode
  useEffect(() => {
    const fetchRoomType = async () => {
      if (!roomTypeId) return;
      
      try {
        setIsLoading(true);
        console.log('Fetching room type with ID:', roomTypeId);
        const response = await roomTypeApi.getById(roomTypeId);
        console.log('Fetched room type:', response.result);
        setRoomType(response.result);
      } catch (error) {
        console.error('Failed to fetch room type:', error);
        toast.error('Không thể tải thông tin loại phòng');
        navigate('/admin/room-types');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoomType();
  }, [roomTypeId, navigate]);

  // ========== Handlers ==========

  const handleSubmit = async (data: RoomTypeCreationRequest | RoomTypeUpdateRequest) => {
    try {
      setIsSubmitting(true);
      
      if (isEditMode && roomTypeId) {
        await roomTypeApi.update(roomTypeId, data as RoomTypeUpdateRequest);
        toast.success('Cập nhật loại phòng thành công!');
      } else {
        await roomTypeApi.create(data as RoomTypeCreationRequest);
        toast.success('Tạo loại phòng mới thành công!');
      }
      
      navigate('/admin/room-types');
    } catch (error: any) {
      console.error('Failed to save room type:', error);
      console.error('Error response:', error?.response?.data);
      const errorMessage = error?.response?.data?.message || error?.message || 'Có lỗi xảy ra';
      toast.error(isEditMode 
        ? `Không thể cập nhật loại phòng: ${errorMessage}` 
        : `Không thể tạo loại phòng: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/room-types');
  };

  const handleEdit = () => {
    navigate(`/admin/room-types/upsert?id=${roomTypeId}`);
  };

  // ========== Render ==========

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10 rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="grid gap-6 md:grid-cols-2">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-11 w-full" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // View mode - show room type details
  if (viewMode && roomType) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/admin/room-types')}
              className="rounded-full hover:bg-slate-100"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <DoorOpen className="h-6 w-6 text-emerald-600" />
                Chi tiết loại phòng
              </h1>
              <p className="text-muted-foreground">
                Xem thông tin chi tiết của loại phòng
              </p>
            </div>
          </div>
          <Button
            onClick={handleEdit}
            className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800"
          >
            <Edit className="h-4 w-4 mr-2" />
            Chỉnh sửa
          </Button>
        </div>

        {/* Room Type Detail Card */}
        <RoomTypeDetailCard roomType={roomType} />
      </div>
    );
  }

  // Create/Edit mode
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/admin/room-types')}
          className="rounded-full hover:bg-slate-100"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            {isEditMode ? (
              <>
                <Edit className="h-6 w-6 text-emerald-600" />
                Chỉnh sửa loại phòng {roomType?.name}
              </>
            ) : (
              <>
                <Plus className="h-6 w-6 text-emerald-600" />
                Thêm loại phòng mới
              </>
            )}
          </h1>
          <p className="text-muted-foreground">
            {isEditMode
              ? 'Cập nhật thông tin loại phòng'
              : 'Điền thông tin để tạo loại phòng mới'}
          </p>
        </div>
      </div>

      {/* Form */}
      <RoomTypeForm
        roomType={roomType || undefined}
        isEditMode={isEditMode}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}