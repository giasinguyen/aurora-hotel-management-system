import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { ArrowLeft, Sparkles, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { serviceApi } from '@/services/serviceApi';
import type { HotelService, ServiceCreationRequest, ServiceUpdateRequest } from '@/types/service.types';

import { ServiceForm, ServiceDetailCard } from './components';

const ServiceUpsertPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Get ID and mode from query params
  const serviceId = searchParams.get('id');
  const isEditMode = !!serviceId;
  const isViewMode = searchParams.get('view') === 'true';
  
  const [service, setService] = useState<HotelService | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(isEditMode || isViewMode);

  // Fetch service data if editing or viewing
  useEffect(() => {
    const fetchService = async () => {
      if (!serviceId) return;
      
      try {
        setIsFetching(true);
        const response = await serviceApi.getById(serviceId);
        setService(response.result);
      } catch (error) {
        console.error('Failed to fetch service:', error);
        toast.error('Không thể tải thông tin dịch vụ');
        navigate('/admin/services');
      } finally {
        setIsFetching(false);
      }
    };

    fetchService();
  }, [serviceId, navigate]);

  // Handle form submission
  const handleSubmit = async (data: ServiceCreationRequest | ServiceUpdateRequest) => {
    try {
      setIsLoading(true);
      
      if (isEditMode && serviceId) {
        await serviceApi.update(serviceId, data as ServiceUpdateRequest);
        toast.success('Cập nhật dịch vụ thành công');
      } else {
        await serviceApi.create(data as ServiceCreationRequest);
        toast.success('Tạo dịch vụ thành công');
      }
      
      navigate('/admin/services');
    } catch (error) {
      console.error('Failed to save service:', error);
      const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Không thể lưu dịch vụ';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    navigate('/admin/services');
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
  if (isViewMode && service) {
    return (
      <div className="space-y-6">
        <ServiceDetailCard
          service={service}
          onEdit={() => navigate(`/admin/services/upsert?id=${serviceId}`)}
          onBack={() => navigate('/admin/services')}
        />
      </div>
    );
  }

  // Create/Edit mode - show form
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/admin/services')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-violet-500 to-purple-500 rounded-lg text-white">
            <Sparkles className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">
              {isEditMode ? 'Chỉnh sửa dịch vụ' : 'Thêm dịch vụ mới'}
            </h1>
            <p className="text-muted-foreground">
              {isEditMode ? `Đang chỉnh sửa: ${service?.name}` : 'Tạo dịch vụ mới cho khách sạn'}
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <ServiceForm
        service={service || undefined}
        isEditMode={isEditMode}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isSubmitting={isLoading}
      />
    </div>
  );
};

export default ServiceUpsertPage;