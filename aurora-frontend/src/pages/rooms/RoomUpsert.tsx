// ============================================
// Room Upsert Page - Aurora Hotel Management
// Create or Edit Room
// ============================================

import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { ArrowLeft, DoorOpen, Edit, Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

import { roomApi } from '@/services/roomApi';
import type { Room, RoomCreationRequest, RoomUpdateRequest } from '@/types/room.types';
import { RoomForm, RoomDetailCard } from './components';

// ============================================
// Component
// ============================================

export default function RoomUpsertPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Get ID from query params (edit mode)
  const roomId = searchParams.get('id');
  const isEditMode = !!roomId;
  const viewMode = searchParams.get('view') === 'true';

  // States
  const [room, setRoom] = useState<Room | null>(null);
  const [isLoading, setIsLoading] = useState(isEditMode);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ========== Effects ==========

  // Fetch room data for edit mode
  useEffect(() => {
    const fetchRoom = async () => {
      if (!roomId) return;
      
      try {
        setIsLoading(true);
        const response = await roomApi.getById(roomId);
        setRoom(response.result);
      } catch (error) {
        console.error('Failed to fetch room:', error);
        toast.error('Không thể tải thông tin phòng');
        navigate('/admin/rooms');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoom();
  }, [roomId, navigate]);

  // ========== Handlers ==========

  const handleSubmit = async (data: RoomCreationRequest | RoomUpdateRequest) => {
    try {
      setIsSubmitting(true);
      
      if (isEditMode && roomId) {
        await roomApi.update(roomId, data as RoomUpdateRequest);
        toast.success('Cập nhật phòng thành công!');
      } else {
        await roomApi.create(data as RoomCreationRequest);
        toast.success('Tạo phòng mới thành công!');
      }
      
      navigate('/admin/rooms');
    } catch (error: any) {
      console.error('Failed to save room:', error);
      const errorMessage = error?.response?.data?.message || error?.message || 'Có lỗi xảy ra';
      toast.error(isEditMode 
        ? `Không thể cập nhật phòng: ${errorMessage}` 
        : `Không thể tạo phòng: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/rooms');
  };

  const handleEdit = () => {
    navigate(`/admin/rooms/upsert?id=${roomId}`);
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

  // View mode - show room details
  if (viewMode && room) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/admin/rooms')}
              className="rounded-full hover:bg-slate-100"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <DoorOpen className="h-6 w-6 text-blue-600" />
                Chi tiết phòng {room.roomNumber}
              </h1>
              <p className="text-muted-foreground">
                Xem thông tin chi tiết của phòng
              </p>
            </div>
          </div>
          <Button
            onClick={handleEdit}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
          >
            <Edit className="h-4 w-4 mr-2" />
            Chỉnh sửa
          </Button>
        </div>

        {/* Room Detail Card */}
        <RoomDetailCard room={room} />
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
          onClick={() => navigate('/admin/rooms')}
          className="rounded-full hover:bg-slate-100"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            {isEditMode ? (
              <>
                <Edit className="h-6 w-6 text-blue-600" />
                Chỉnh sửa phòng {room?.roomNumber}
              </>
            ) : (
              <>
                <Plus className="h-6 w-6 text-emerald-600" />
                Thêm phòng mới
              </>
            )}
          </h1>
          <p className="text-muted-foreground">
            {isEditMode
              ? 'Cập nhật thông tin phòng'
              : 'Điền thông tin để tạo phòng mới'}
          </p>
        </div>
      </div>

      {/* Form */}
      <RoomForm
        room={room || undefined}
        isEditMode={isEditMode}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}