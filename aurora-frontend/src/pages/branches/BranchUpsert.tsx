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
        await branchApi.update(branchId, data as BranchUpdateRequest);
        toast.success('Cập nhật chi nhánh thành công');
      } else {
        await branchApi.create(data as BranchCreationRequest);
        toast.success('Tạo chi nhánh thành công');
      }
      
      navigate('/admin/branches');
    } catch (error) {
      console.error('Failed to save branch:', error);
      const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Không thể lưu chi nhánh';
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
          onAssignManager={() => navigate(`/admin/users/${branch.managerId}/assign-branch`)}
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
          <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg text-white">
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