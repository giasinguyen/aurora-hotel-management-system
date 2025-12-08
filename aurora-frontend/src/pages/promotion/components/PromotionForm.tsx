// ============================================
// Promotion Form Component - Aurora Hotel Management
// ============================================

import { useEffect, useState } from 'react';
import { 
  Loader2, 
  Tag,
  FileText,
  Calendar,
  Code,
  RefreshCcw,
  ToggleLeft,
  DollarSign
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';

import type { 
  Promotion, 
  PromotionCreationRequest, 
  PromotionUpdateRequest
} from '@/types/promotion.types';

// ============================================
// Form State Types
// ============================================

interface FormState {
  code: string;
  name: string;
  description: string;
  amountOff: string;
  startDate: string;
  endDate: string;
  active: boolean;
}

interface FormErrors {
  code?: string;
  name?: string;
  amountOff?: string;
  startDate?: string;
  endDate?: string;
}

// ============================================
// Props Interface
// ============================================

interface PromotionFormProps {
  promotion?: Promotion;
  isEditMode?: boolean;
  onSubmit: (data: PromotionCreationRequest | PromotionUpdateRequest) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

// ============================================
// Helper Functions
// ============================================

const formatDateForInput = (dateString: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
};

const generatePromoCode = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

// ============================================
// Component
// ============================================

export default function PromotionForm({
  promotion,
  isEditMode = false,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: PromotionFormProps) {
  // ========== States ==========
  const [errors, setErrors] = useState<FormErrors>({});

  const [formState, setFormState] = useState<FormState>({
    code: promotion?.code || '',
    name: promotion?.name || '',
    description: promotion?.description || '',
    amountOff: promotion?.amountOff?.toString() || '',
    startDate: formatDateForInput(promotion?.startDate || ''),
    endDate: formatDateForInput(promotion?.endDate || ''),
    active: promotion?.active ?? true,
  });

  // ========== Effects ==========

  // Update form state when promotion prop changes (for edit mode)
  useEffect(() => {
    if (promotion) {
      setFormState({
        code: promotion.code || '',
        name: promotion.name || '',
        description: promotion.description || '',
        amountOff: promotion.amountOff?.toString() || '',
        startDate: formatDateForInput(promotion.startDate || ''),
        endDate: formatDateForInput(promotion.endDate || ''),
        active: promotion.active ?? true,
      });
      setErrors({});
    }
  }, [promotion]);

  // ========== Handlers ==========

  const updateField = <K extends keyof FormState>(field: K, value: FormState[K]) => {
    setFormState(prev => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formState.code || formState.code.trim() === '') {
      newErrors.code = 'Vui lòng nhập mã khuyến mãi';
    } else if (!/^[A-Z0-9_]+$/.test(formState.code)) {
      newErrors.code = 'Mã chỉ chứa chữ in hoa, số và _';
    } else if (formState.code.length < 3 || formState.code.length > 50) {
      newErrors.code = 'Mã phải từ 3 đến 50 ký tự';
    }

    if (!formState.name || formState.name.trim() === '') {
      newErrors.name = 'Vui lòng nhập tên khuyến mãi';
    } else if (formState.name.length > 200) {
      newErrors.name = 'Tên tối đa 200 ký tự';
    }

    const amountValue = parseFloat(formState.amountOff);
    if (!formState.amountOff || isNaN(amountValue) || amountValue <= 0) {
      newErrors.amountOff = 'Số tiền giảm phải lớn hơn 0';
    }

    if (!formState.startDate) {
      newErrors.startDate = 'Vui lòng chọn ngày bắt đầu';
    }

    if (!formState.endDate) {
      newErrors.endDate = 'Vui lòng chọn ngày kết thúc';
    } else if (formState.startDate && new Date(formState.endDate) < new Date(formState.startDate)) {
      newErrors.endDate = 'Ngày kết thúc phải sau ngày bắt đầu';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    if (isEditMode) {
      const updateData: PromotionUpdateRequest = {
        name: formState.name,
        startDate: formState.startDate,
        endDate: formState.endDate,
        active: formState.active,
        discountType: 'FIXED_AMOUNT',
        amountOff: parseFloat(formState.amountOff),
        ...(formState.description.trim() && { description: formState.description.trim() }),
      };
      await onSubmit(updateData);
    } else {
      const createData: PromotionCreationRequest = {
        code: formState.code,
        name: formState.name,
        startDate: formState.startDate,
        endDate: formState.endDate,
        active: formState.active,
        discountType: 'FIXED_AMOUNT',
        amountOff: parseFloat(formState.amountOff),
        ...(formState.description.trim() && { description: formState.description.trim() }),
      };
      await onSubmit(createData);
    }
  };

  const handleGenerateCode = () => {
    updateField('code', generatePromoCode());
  };

  // ========== Render ==========

  return (
    <form onSubmit={handleFormSubmit} className="space-y-6">
      {/* Basic Info Section */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-slate-50">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-orange-100 text-orange-600">
              <Tag className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg">Thông tin khuyến mãi</CardTitle>
              <CardDescription>Mã và tên chương trình khuyến mãi</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2">
          {/* Code */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Code className="h-4 w-4 text-muted-foreground" />
              Mã khuyến mãi <span className="text-destructive">*</span>
            </Label>
            <div className="flex gap-2">
              <Input
                value={formState.code}
                onChange={(e) => updateField('code', e.target.value.toUpperCase())}
                placeholder="VD: SUMMER2024, NEWYEAR..."
                disabled={isEditMode}
                className={`h-11 font-mono uppercase ${errors.code ? 'border-destructive' : ''}`}
              />
              {!isEditMode && (
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={handleGenerateCode}
                  className="h-11 w-11 shrink-0"
                  title="Tạo mã ngẫu nhiên"
                >
                  <RefreshCcw className="h-4 w-4" />
                </Button>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              {isEditMode ? 'Không thể thay đổi mã khi chỉnh sửa' : 'Mã chỉ chứa chữ in hoa, số và _'}
            </p>
            {errors.code && <p className="text-sm text-destructive">{errors.code}</p>}
          </div>

          {/* Name */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Tag className="h-4 w-4 text-muted-foreground" />
              Tên khuyến mãi <span className="text-destructive">*</span>
            </Label>
            <Input
              value={formState.name}
              onChange={(e) => updateField('name', e.target.value)}
              placeholder="VD: Khuyến mãi mùa hè, Giảm giá năm mới..."
              className={`h-11 ${errors.name ? 'border-destructive' : ''}`}
            />
            {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
          </div>

          {/* Description - Full Width */}
          <div className="space-y-2 md:col-span-2">
            <Label className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              Mô tả
            </Label>
            <Textarea
              value={formState.description}
              onChange={(e) => updateField('description', e.target.value)}
              placeholder="Mô tả chi tiết về chương trình khuyến mãi..."
              rows={3}
              className="resize-none"
            />
          </div>
        </CardContent>
      </Card>

      {/* Discount Section */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-slate-50">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-green-100 text-green-600">
              <DollarSign className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg">Mức giảm giá</CardTitle>
              <CardDescription>Thiết lập số tiền giảm cố định</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              Số tiền giảm (VNĐ) <span className="text-destructive">*</span>
            </Label>
            <Input
              type="number"
              value={formState.amountOff}
              onChange={(e) => updateField('amountOff', e.target.value)}
              placeholder="100000"
              className={`h-11 ${errors.amountOff ? 'border-destructive' : ''}`}
            />
            {errors.amountOff && <p className="text-sm text-destructive">{errors.amountOff}</p>}
            <p className="text-sm text-muted-foreground">
              Nhập số tiền giảm cố định (ví dụ: 100000 = 100,000đ)
            </p>
          </div>

          {/* Preview */}
          <div className="p-4 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200">
            <p className="text-sm text-green-700">
              Khách hàng sẽ được giảm <span className="font-bold text-green-800">
                {formState.amountOff ? new Intl.NumberFormat('vi-VN').format(parseFloat(formState.amountOff)) : '0'}đ
              </span> cho đơn hàng
            </p>
            {formState.amountOff && (
              <p className="text-xs text-green-600 mt-1">
                VD: Đơn 1,000,000đ → Giảm còn {new Intl.NumberFormat('vi-VN').format(1000000 - parseFloat(formState.amountOff || '0'))}đ
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Date Range Section */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-slate-50">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-100 text-blue-600">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg">Thời gian áp dụng</CardTitle>
              <CardDescription>Khoảng thời gian khuyến mãi có hiệu lực</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              Ngày bắt đầu <span className="text-destructive">*</span>
            </Label>
            <Input
              type="date"
              value={formState.startDate}
              onChange={(e) => updateField('startDate', e.target.value)}
              className={`h-11 ${errors.startDate ? 'border-destructive' : ''}`}
            />
            {errors.startDate && <p className="text-sm text-destructive">{errors.startDate}</p>}
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              Ngày kết thúc <span className="text-destructive">*</span>
            </Label>
            <Input
              type="date"
              value={formState.endDate}
              onChange={(e) => updateField('endDate', e.target.value)}
              min={formState.startDate}
              className={`h-11 ${errors.endDate ? 'border-destructive' : ''}`}
            />
            {errors.endDate && <p className="text-sm text-destructive">{errors.endDate}</p>}
          </div>
        </CardContent>
      </Card>

      {/* Active Status Section */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-slate-50">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-100 text-purple-600">
              <ToggleLeft className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg">Trạng thái</CardTitle>
              <CardDescription>Bật/tắt khuyến mãi</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between rounded-lg border p-4 bg-white max-w-md">
            <div className="space-y-0.5">
              <Label className="text-base">Kích hoạt khuyến mãi</Label>
              <p className="text-sm text-muted-foreground">
                Khuyến mãi sẽ {formState.active ? 'được áp dụng' : 'tạm dừng'} trong thời gian hiệu lực
              </p>
            </div>
            <Switch
              checked={formState.active}
              onCheckedChange={(checked) => updateField('active', checked)}
            />
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
          className="min-w-[180px] bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Đang lưu...
            </>
          ) : isEditMode ? (
            'Cập nhật khuyến mãi'
          ) : (
            'Tạo khuyến mãi mới'
          )}
        </Button>
      </div>
    </form>
  );
}
