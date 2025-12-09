import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { ArrowLeft, Building2, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { branchApi } from '@/services/branchApi';
import type { Branch, BranchCreationRequest, BranchUpdateRequest } from '@/types/branch.types';

import { BranchForm, BranchDetailCard } from './components';

const BranchUpsertPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Get ID and mode from query params
  const branchId = searchParams.get('id');
  const isEditMode = !!branchId;
  const isViewMode = searchParams.get('view') === 'true';
  
  const [branch, setBranch] = useState<Branch | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(isEditMode || isViewMode);

  // Fetch branch data if editing or viewing
  useEffect(() => {
    const fetchBranch = async () => {
      if (!branchId) return;
      
      try {
        setIsFetching(true);
        const response = await branchApi.getById(branchId);
        setBranch(response.result);
      } catch (error) {
        console.error('Failed to fetch branch:', error);
        toast.error('Không thể tải thông tin chi nhánh');
        navigate('/admin/branches');
      } finally {
        setIsFetching(false);
      }
    };

    fetchBranch();
  }, [branchId, navigate]);

  // Handle form submission
  const handleSubmit = async (data: BranchCreationRequest | BranchUpdateRequest) => {
    try {
      setIsLoading(true);
      
      if (isEditMode && branchId) {
        // Log data being sent for debugging
        console.log('Updating branch with data:', data);
        const response = await branchApi.update(branchId, data as BranchUpdateRequest);
        console.log('Update response:', response);
        toast.success('Cập nhật chi nhánh thành công');
      } else {
        console.log('Creating branch with data:', data);
        await branchApi.create(data as BranchCreationRequest);
        toast.success('Tạo chi nhánh thành công');
      }
      
      navigate('/admin/branches');
    } catch (error) {
      console.error('Failed to save branch:', error);
      const errorResponse = error as { response?: { data?: { message?: string; errors?: any } } };
      let errorMessage = 'Không thể lưu chi nhánh';
      
      if (errorResponse.response?.data) {
        if (errorResponse.response.data.message) {
          errorMessage = errorResponse.response.data.message;
        } else if (errorResponse.response.data.errors) {
          // Handle validation errors
          const errors = errorResponse.response.data.errors;
          const errorList = Object.entries(errors).map(([field, messages]) => {
            const msgArray = Array.isArray(messages) ? messages : [messages];
            return `${field}: ${msgArray.join(', ')}`;
          }).join('\n');
          errorMessage = `Lỗi validation:\n${errorList}`;
        }
      }
      
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    navigate('/admin/branches');
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
  if (isViewMode && branch) {
    return (
      <div className="space-y-6">
        <BranchDetailCard
          branch={branch}
          onEdit={() => navigate(`/admin/branches/upsert?id=${branchId}`)}
          onBack={() => navigate('/admin/branches')}
          onAssignManager={() => navigate(`/admin/branches/${branch.id}/assign-manager`)}
        />
      </div>
    );
  }

  // Create/Edit mode - show form
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/admin/branches')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary rounded-lg text-white">
            <Building2 className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">
              {isEditMode ? 'Chỉnh sửa chi nhánh' : 'Thêm chi nhánh mới'}
            </h1>
            <p className="text-muted-foreground">
              {isEditMode ? `Đang chỉnh sửa: ${branch?.name}` : 'Tạo chi nhánh khách sạn mới'}
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <BranchForm
        branch={branch}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={isLoading}
      />
    </div>
  );
};

export default BranchUpsertPage;