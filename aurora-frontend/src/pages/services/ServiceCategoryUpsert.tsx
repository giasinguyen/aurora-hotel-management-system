import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { ArrowLeft, Sparkles, Loader2, Image as ImageIcon } from 'lucide-react';
import fallbackImage from '@/assets/images/commons/fallback.png';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

import { serviceCategoryApi } from '@/services/serviceCategoryApi';
import { branchApi } from '@/services/branchApi';
import type { ServiceCategoryRequest } from '@/types/serviceCategory.types';
import type { Branch } from '@/types/branch.types';

export default function ServiceCategoryUpsert() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const categoryId = searchParams.get('id');
  const isEdit = !!categoryId;

  const [formData, setFormData] = useState<ServiceCategoryRequest>({
    branchId: '',
    name: '',
    code: '',
    description: '',
    displayOrder: 0,
    active: true,
    imageUrl: '',
  });
  const [branches, setBranches] = useState<Branch[]>([]);
  const [isLoading, setIsLoading] = useState(isEdit);
  const [isSaving, setIsSaving] = useState(false);

  // Load branches
  useEffect(() => {
    const loadBranches = async () => {
      try {
        const res = await branchApi.getAll({ page: 0, size: 100 });
        if (res.result?.content) {
          setBranches(res.result.content);
          // Set first branch as default if creating new
          if (!isEdit && res.result.content.length > 0) {
            const firstBranch = res.result.content[0];
            setFormData(prev => ({
              ...prev,
              branchId: firstBranch.id,
            }));
          }
        }
      } catch (error) {
        toast.error('Không thể tải danh sách chi nhánh');
      }
    };
    loadBranches();
  }, [isEdit]);

  // Load category if editing
  useEffect(() => {
    if (!isEdit) {
      setIsLoading(false);
      return;
    }

    const loadCategory = async () => {
      try {
        setIsLoading(true);
        const res = await serviceCategoryApi.getById(categoryId!);
        if (res.result) {
          setFormData({
            branchId: res.result.branchId,
            name: res.result.name,
            code: res.result.code,
            description: res.result.description || '',
            displayOrder: res.result.displayOrder || 0,
            active: res.result.active ?? true,
            imageUrl: res.result.imageUrl || '',
          });
        }
      } catch (error) {
        toast.error('Không thể tải thông tin danh mục dịch vụ');
        navigate('/admin/service-categories');
      } finally {
        setIsLoading(false);
      }
    };

    loadCategory();
  }, [categoryId, isEdit, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Tên danh mục là bắt buộc');
      return;
    }

    if (!formData.code.trim()) {
      toast.error('Mã danh mục là bắt buộc');
      return;
    }

    if (!formData.branchId) {
      toast.error('Chi nhánh là bắt buộc');
      return;
    }

    try {
      setIsSaving(true);
      
      const payload: ServiceCategoryRequest = {
        branchId: formData.branchId,
        name: formData.name.trim(),
        code: formData.code.trim().toUpperCase(),
        description: formData.description?.trim() || undefined,
        displayOrder: formData.displayOrder || 0,
        active: formData.active ?? true,
        imageUrl: formData.imageUrl?.trim() || undefined,
      };

      if (isEdit) {
        await serviceCategoryApi.update(categoryId!, payload);
        toast.success('Cập nhật danh mục dịch vụ thành công');
      } else {
        await serviceCategoryApi.create(payload);
        toast.success('Tạo danh mục dịch vụ thành công');
      }

      navigate('/admin/service-categories');
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || 
        (isEdit ? 'Không thể cập nhật danh mục dịch vụ' : 'Không thể tạo danh mục dịch vụ');
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Đang tải thông tin...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/admin/service-categories')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-violet-500 to-purple-500 rounded-lg text-white">
            <Sparkles className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">
              {isEdit ? 'Chỉnh sửa danh mục dịch vụ' : 'Thêm danh mục dịch vụ mới'}
            </h1>
            <p className="text-muted-foreground">
              {isEdit ? 'Cập nhật thông tin danh mục dịch vụ' : 'Tạo danh mục dịch vụ mới'}
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>{isEdit ? 'Chỉnh sửa danh mục' : 'Tạo danh mục mới'}</CardTitle>
          <CardDescription>
            {isEdit ? 'Cập nhật thông tin danh mục dịch vụ' : 'Nhập thông tin để tạo danh mục dịch vụ mới'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Branch Selection */}
            <div className="space-y-2">
              <Label htmlFor="branch">Chi nhánh <span className="text-destructive">*</span></Label>
              <select
                id="branch"
                value={formData.branchId}
                onChange={(e) => setFormData(prev => ({ ...prev, branchId: e.target.value }))}
                className="w-full px-3 py-2 border rounded-md"
                disabled={isEdit}
                required
              >
                <option value="">Chọn chi nhánh</option>
                {branches.map(branch => (
                  <option key={branch.id} value={branch.id}>
                    {branch.name}
                  </option>
                ))}
              </select>
              {isEdit && (
                <p className="text-sm text-amber-600">Không thể thay đổi chi nhánh khi chỉnh sửa</p>
              )}
            </div>

            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Tên danh mục <span className="text-destructive">*</span></Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="VD: Spa & Wellness, Food & Drink..."
                required
              />
            </div>

            {/* Code */}
            <div className="space-y-2">
              <Label htmlFor="code">Mã danh mục <span className="text-destructive">*</span></Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                placeholder="VD: SPA_WELLNESS, FOOD_DRINK..."
                required
              />
              <p className="text-sm text-muted-foreground">
                Mã sẽ được tự động chuyển thành chữ hoa
              </p>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Mô tả</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Mô tả về danh mục dịch vụ..."
                rows={4}
                className="resize-none"
              />
            </div>

            {/* Display Order and Active */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="displayOrder">Thứ tự hiển thị</Label>
                <Input
                  id="displayOrder"
                  type="number"
                  value={formData.displayOrder}
                  onChange={(e) => setFormData(prev => ({ ...prev, displayOrder: parseInt(e.target.value) || 0 }))}
                  placeholder="0"
                  min={0}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="imageUrl">URL ảnh</Label>
                <Input
                  id="imageUrl"
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                  placeholder="https://..."
                />
              </div>
            </div>

            {/* Image Preview */}
            {formData.imageUrl && (
              <div className="space-y-2">
                <Label>Ảnh đại diện</Label>
                <div className="w-full max-w-md">
                  <div className="aspect-video rounded-lg overflow-hidden border-2 border-gray-200 bg-gray-100">
                    <img
                      src={formData.imageUrl}
                      alt="Category preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = fallbackImage;
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            {!formData.imageUrl && (
              <div className="space-y-2">
                <Label>Ảnh đại diện</Label>
                <div className="w-full max-w-md aspect-video rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <ImageIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Chưa có ảnh đại diện</p>
                    <p className="text-xs">Nhập URL ảnh ở trên để xem preview</p>
                  </div>
                </div>
              </div>
            )}

            {/* Active Checkbox */}
            <div className="flex items-center space-x-2">
              <input
                id="active"
                type="checkbox"
                checked={formData.active}
                onChange={(e) => setFormData(prev => ({ ...prev, active: e.target.checked }))}
                className="h-4 w-4 rounded border-gray-300"
              />
              <Label htmlFor="active" className="cursor-pointer">
                Danh mục đang hoạt động
              </Label>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-end pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/admin/service-categories')}
                disabled={isSaving}
              >
                Hủy
              </Button>
              <Button 
                type="submit" 
                disabled={isSaving}
                className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang lưu...
                  </>
                ) : isEdit ? (
                  'Cập nhật'
                ) : (
                  'Tạo mới'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}


