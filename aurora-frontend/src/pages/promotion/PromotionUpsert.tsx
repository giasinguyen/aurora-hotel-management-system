import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { ArrowLeft, Tag, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { promotionApi } from '@/services/promotionApi';
import type { Promotion, PromotionCreationRequest, PromotionUpdateRequest } from '@/types/promotion.types';

import { PromotionForm, PromotionDetailCard } from './components';

const PromotionUpsertPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Get ID and mode from query params
  const promotionId = searchParams.get('id');
  const isEditMode = !!promotionId;
  const isViewMode = searchParams.get('view') === 'true';
  
  const [promotion, setPromotion] = useState<Promotion | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(isEditMode || isViewMode);

  // Fetch promotion data if editing or viewing
  useEffect(() => {
    const fetchPromotion = async () => {
      if (!promotionId) return;
      
      try {
        setIsFetching(true);
        const response = await promotionApi.getById(promotionId);
        setPromotion(response.result);
      } catch (error) {
        console.error('Failed to fetch promotion:', error);
        toast.error('Không thể tải thông tin khuyến mãi');
        navigate('/admin/promotions');
      } finally {
        setIsFetching(false);
      }
    };

    fetchPromotion();
  }, [promotionId, navigate]);

  // Handle form submission
  const handleSubmit = async (data: PromotionCreationRequest | PromotionUpdateRequest) => {
    try {
      setIsLoading(true);
      
      if (isEditMode && promotionId) {
        await promotionApi.update(promotionId, data as PromotionUpdateRequest);
        toast.success('Cập nhật khuyến mãi thành công');
      } else {
        await promotionApi.create(data as PromotionCreationRequest);
        toast.success('Tạo khuyến mãi thành công');
      }
      
      navigate('/admin/promotions');
    } catch (error) {
      console.error('Failed to save promotion:', error);
      const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Không thể lưu khuyến mãi';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    navigate('/admin/promotions');
  };

  // Loading state
  if (isFetching) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Đang tải thông tin...</p>
        </div>
      </div>
    );
  }

  // View mode - show detail card
  if (isViewMode && promotion) {
    return (
      <div className="space-y-6">
        <PromotionDetailCard
          promotion={promotion}
        />
      </div>
    );
  }

  // Create/Edit mode - show form
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/admin/promotions')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg text-white">
            <Tag className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">
              {isEditMode ? 'Chỉnh sửa khuyến mãi' : 'Thêm khuyến mãi mới'}
            </h1>
            <p className="text-muted-foreground">
              {isEditMode ? `Đang chỉnh sửa: ${promotion?.name}` : 'Tạo mã khuyến mãi mới cho khách hàng'}
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <PromotionForm
        promotion={promotion || undefined}
        isEditMode={isEditMode}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isSubmitting={isLoading}
      />
    </div>
  );
};

export default PromotionUpsertPage;