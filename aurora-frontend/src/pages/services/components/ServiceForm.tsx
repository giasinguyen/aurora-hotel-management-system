// ============================================
// Service Form Component - Aurora Hotel Management
// ============================================

import { useEffect, useState } from 'react';
import { 
  Loader2, 
  Building2, 
  Tag,
  FileText,
  DollarSign,
  Sparkles,
  Utensils,
  Car,
  Dumbbell,
  Waves,
  Shirt,
  Map,
  Package
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { branchApi } from '@/services/branchApi';
import type { Branch } from '@/types/branch.types';
import type { 
  HotelService, 
  ServiceCreationRequest, 
  ServiceUpdateRequest,
  ServiceType 
} from '@/types/service.types';

// ============================================
// Service Type Options
// ============================================

const SERVICE_TYPES: { value: ServiceType; label: string; icon: React.ReactNode; description: string }[] = [
  { value: 'SPA', label: 'Spa & Massage', icon: <Sparkles className="h-5 w-5" />, description: 'Dịch vụ spa, massage thư giãn' },
  { value: 'RESTAURANT', label: 'Nhà hàng', icon: <Utensils className="h-5 w-5" />, description: 'Dịch vụ ẩm thực, đồ uống' },
  { value: 'LAUNDRY', label: 'Giặt ủi', icon: <Shirt className="h-5 w-5" />, description: 'Dịch vụ giặt ủi quần áo' },
  { value: 'TRANSPORT', label: 'Vận chuyển', icon: <Car className="h-5 w-5" />, description: 'Dịch vụ đưa đón, thuê xe' },
  { value: 'TOUR', label: 'Tour du lịch', icon: <Map className="h-5 w-5" />, description: 'Tour tham quan, du lịch' },
  { value: 'GYM', label: 'Phòng gym', icon: <Dumbbell className="h-5 w-5" />, description: 'Phòng tập thể dục, gym' },
  { value: 'POOL', label: 'Hồ bơi', icon: <Waves className="h-5 w-5" />, description: 'Dịch vụ hồ bơi, bể bơi' },
  { value: 'OTHER', label: 'Khác', icon: <Package className="h-5 w-5" />, description: 'Các dịch vụ khác' },
];

// ============================================
// Form State Types
// ============================================

interface FormState {
  branchId: string;
  name: string;
  type: ServiceType;
  description: string;
  basePrice: number;
}

interface FormErrors {
  branchId?: string;
  name?: string;
  type?: string;
  basePrice?: string;
}

// ============================================
// Props Interface
// ============================================

interface ServiceFormProps {
  service?: HotelService;
  isEditMode?: boolean;
  onSubmit: (data: ServiceCreationRequest | ServiceUpdateRequest) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

// ============================================
// Component
// ============================================

export default function ServiceForm({
  service,
  isEditMode = false,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: ServiceFormProps) {
  // ========== States ==========
  const [branches, setBranches] = useState<Branch[]>([]);
  const [isLoadingBranches, setIsLoadingBranches] = useState(true);
  const [errors, setErrors] = useState<FormErrors>({});

  const [formState, setFormState] = useState<FormState>({
    branchId: service?.branchId || '',
    name: service?.name || '',
    type: service?.type || 'OTHER',
    description: service?.description || '',
    basePrice: service?.basePrice || 100000,
  });

  // ========== Effects ==========

  // Update form state when service prop changes (for edit mode)
  useEffect(() => {
    if (service) {
      setFormState({
        branchId: service.branchId || '',
        name: service.name || '',
        type: service.type || 'OTHER',
        description: service.description || '',
        basePrice: service.basePrice || 100000,
      });
      setErrors({});
    }
  }, [service]);

  // Fetch branches
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        setIsLoadingBranches(true);
        const response = await branchApi.getAll({ page: 0, size: 100 });
        setBranches(response.result.content);
      } catch (error) {
        console.error('Failed to fetch branches:', error);
      } finally {
        setIsLoadingBranches(false);
      }
    };
    fetchBranches();
  }, []);

  // ========== Handlers ==========

  const updateField = <K extends keyof FormState>(field: K, value: FormState[K]) => {
    setFormState(prev => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formState.branchId) {
      newErrors.branchId = 'Vui lòng chọn chi nhánh';
    }
    if (!formState.name || formState.name.trim() === '') {
      newErrors.name = 'Vui lòng nhập tên dịch vụ';
    } else if (formState.name.length > 100) {
      newErrors.name = 'Tên tối đa 100 ký tự';
    }
    if (!formState.type) {
      newErrors.type = 'Vui lòng chọn loại dịch vụ';
    }
    if (!formState.basePrice || formState.basePrice <= 0) {
      newErrors.basePrice = 'Giá dịch vụ phải lớn hơn 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    if (isEditMode) {
      const updateData: ServiceUpdateRequest = {
        name: formState.name,
        type: formState.type,
        description: formState.description || undefined,
        basePrice: formState.basePrice,
      };
      console.log('Updating service with data:', updateData);
      await onSubmit(updateData);
    } else {
      const createData: ServiceCreationRequest = {
        branchId: formState.branchId,
        name: formState.name,
        type: formState.type,
        description: formState.description || undefined,
        basePrice: formState.basePrice,
      };
      console.log('Creating service with data:', createData);
      await onSubmit(createData);
    }
  };

  const selectedTypeConfig = SERVICE_TYPES.find(t => t.value === formState.type);

  // ========== Render ==========

  return (
    <form onSubmit={handleFormSubmit} className="space-y-6">
      {/* Branch Selection */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-slate-50">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-100 text-blue-600">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg">Chi nhánh</CardTitle>
              <CardDescription>Chọn chi nhánh cung cấp dịch vụ</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              Chi nhánh <span className="text-destructive">*</span>
            </Label>
            <Select
              disabled={isEditMode || isLoadingBranches}
              value={formState.branchId}
              onValueChange={(value) => updateField('branchId', value)}
            >
              <SelectTrigger className={`h-11 max-w-md ${errors.branchId ? 'border-destructive' : ''}`}>
                <SelectValue placeholder={isLoadingBranches ? 'Đang tải...' : 'Chọn chi nhánh'} />
              </SelectTrigger>
              <SelectContent>
                {branches.map((branch) => (
                  <SelectItem key={branch.id} value={branch.id}>
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      {branch.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.branchId && <p className="text-sm text-destructive">{errors.branchId}</p>}
            {isEditMode && (
              <p className="text-sm text-amber-600">Không thể thay đổi chi nhánh khi chỉnh sửa</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Service Type Selection */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-slate-50">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-100 text-purple-600">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg">Loại dịch vụ</CardTitle>
              <CardDescription>Chọn loại dịch vụ phù hợp</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
            {SERVICE_TYPES.map((type) => {
              const isSelected = formState.type === type.value;
              return (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => updateField('type', type.value)}
                  className={`
                    flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200
                    ${isSelected 
                      ? 'border-purple-500 bg-purple-50 text-purple-700 shadow-md' 
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                    }
                  `}
                >
                  <div className={`
                    p-3 rounded-full
                    ${isSelected ? 'bg-purple-500 text-white' : 'bg-gray-100 text-gray-500'}
                  `}>
                    {type.icon}
                  </div>
                  <span className="text-sm font-medium">{type.label}</span>
                </button>
              );
            })}
          </div>
          {selectedTypeConfig && (
            <p className="mt-3 text-sm text-muted-foreground text-center">
              {selectedTypeConfig.description}
            </p>
          )}
          {errors.type && <p className="text-sm text-destructive mt-2">{errors.type}</p>}
        </CardContent>
      </Card>

      {/* Basic Info Section */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-slate-50">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-600">
              <Tag className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg">Thông tin dịch vụ</CardTitle>
              <CardDescription>Tên và mô tả dịch vụ</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Name */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Tag className="h-4 w-4 text-muted-foreground" />
              Tên dịch vụ <span className="text-destructive">*</span>
            </Label>
            <Input
              value={formState.name}
              onChange={(e) => updateField('name', e.target.value)}
              placeholder="VD: Massage toàn thân, Giặt ủi nhanh..."
              className={`h-11 ${errors.name ? 'border-destructive' : ''}`}
            />
            {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              Mô tả dịch vụ
            </Label>
            <Textarea
              value={formState.description}
              onChange={(e) => updateField('description', e.target.value)}
              placeholder="Mô tả chi tiết về dịch vụ..."
              rows={4}
              className="resize-none"
            />
          </div>
        </CardContent>
      </Card>

      {/* Pricing Section */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-slate-50">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-green-100 text-green-600">
              <DollarSign className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg">Giá dịch vụ</CardTitle>
              <CardDescription>Thiết lập giá cơ bản cho dịch vụ</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-w-md">
            <Label className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              Giá cơ bản (VNĐ) <span className="text-destructive">*</span>
            </Label>
            <Input
              type="number"
              value={formState.basePrice}
              onChange={(e) => updateField('basePrice', parseFloat(e.target.value) || 0)}
              min={0}
              step={10000}
              placeholder="100000"
              className={`h-11 ${errors.basePrice ? 'border-destructive' : ''}`}
            />
            <p className="text-sm text-muted-foreground">
              Giá sẽ được hiển thị: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(formState.basePrice)}
            </p>
            {errors.basePrice && <p className="text-sm text-destructive">{errors.basePrice}</p>}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-4 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
          className="min-w-[120px]"
        >
          Hủy
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="min-w-[180px] bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Đang lưu...
            </>
          ) : isEditMode ? (
            'Cập nhật dịch vụ'
          ) : (
            'Tạo dịch vụ mới'
          )}
        </Button>
      </div>
    </form>
  );
}
