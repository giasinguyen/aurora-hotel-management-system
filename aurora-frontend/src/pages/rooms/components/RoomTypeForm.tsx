// ============================================
// Room Type Form Component - Aurora Hotel Management
// ============================================

import { useEffect, useState } from 'react';
import { 
  Loader2, 
  Building2, 
  DoorOpen, 
  Users, 
  Maximize, 
  Tag,
  Code,
  RefreshCcw,
  Sparkles,
  Check,
  DollarSign
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { branchApi } from '@/services/branchApi';
import { amenityApi } from '@/services/amenityApi';
import type { Branch } from '@/types/branch.types';
import type { Amenity, RoomType, RoomTypeCreationRequest, RoomTypeUpdateRequest } from '@/types/room.types';

// ============================================
// Form State Types
// ============================================

interface FormState {
  branchId: string;
  name: string;
  code: string;
  priceFrom: number;
  capacityAdults: number;
  capacityChildren: number;
  maxOccupancy: number;
  sizeM2: number;
  refundable: boolean;
  amenityIds: string[];
}

interface FormErrors {
  branchId?: string;
  name?: string;
  code?: string;
  priceFrom?: string;
  capacityAdults?: string;
  capacityChildren?: string;
  maxOccupancy?: string;
  sizeM2?: string;
}

// ============================================
// Props Interface
// ============================================

interface RoomTypeFormProps {
  roomType?: RoomType;
  isEditMode?: boolean;
  onSubmit: (data: RoomTypeCreationRequest | RoomTypeUpdateRequest) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

// ============================================
// Component
// ============================================

export default function RoomTypeForm({
  roomType,
  isEditMode = false,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: RoomTypeFormProps) {
  // ========== States ==========
  const [branches, setBranches] = useState<Branch[]>([]);
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [isLoadingBranches, setIsLoadingBranches] = useState(true);
  const [isLoadingAmenities, setIsLoadingAmenities] = useState(true);
  const [errors, setErrors] = useState<FormErrors>({});

  const [formState, setFormState] = useState<FormState>({
    branchId: roomType?.branchId || '',
    name: roomType?.name || '',
    code: roomType?.code || '',
    priceFrom: roomType?.priceFrom || 500000,
    capacityAdults: roomType?.capacityAdults || 2,
    capacityChildren: roomType?.capacityChildren || 0,
    maxOccupancy: roomType?.maxOccupancy || 2,
    sizeM2: roomType?.sizeM2 || 25,
    refundable: roomType?.refundable ?? true,
    amenityIds: roomType?.amenities?.map(a => a.id) || [],
  });

  // ========== Effects ==========

  // Update form state when roomType prop changes (for edit mode)
  useEffect(() => {
    if (roomType) {
      setFormState({
        branchId: roomType.branchId || '',
        name: roomType.name || '',
        code: roomType.code || '',
        priceFrom: roomType.priceFrom || 500000,
        capacityAdults: roomType.capacityAdults || 2,
        capacityChildren: roomType.capacityChildren || 0,
        maxOccupancy: roomType.maxOccupancy || 2,
        sizeM2: roomType.sizeM2 || 25,
        refundable: roomType.refundable ?? true,
        amenityIds: roomType.amenities?.map(a => a.id) || [],
      });
      setErrors({});
    }
  }, [roomType]);

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

  // Fetch amenities
  useEffect(() => {
    const fetchAmenities = async () => {
      try {
        setIsLoadingAmenities(true);
        const response = await amenityApi.getAll();
        setAmenities(response.result);
      } catch (error) {
        console.error('Failed to fetch amenities:', error);
      } finally {
        setIsLoadingAmenities(false);
      }
    };
    fetchAmenities();
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
      newErrors.name = 'Vui lòng nhập tên loại phòng';
    } else if (formState.name.length > 100) {
      newErrors.name = 'Tên tối đa 100 ký tự';
    }
    if (!formState.code || formState.code.trim() === '') {
      newErrors.code = 'Vui lòng nhập mã loại phòng';
    } else if (!/^[A-Z]{3,5}$/.test(formState.code)) {
      newErrors.code = 'Mã phải gồm 3-5 chữ in hoa';
    }
    if (!formState.priceFrom || formState.priceFrom <= 0) {
      newErrors.priceFrom = 'Giá tham khảo từ phải lớn hơn 0';
    }
    if (formState.capacityAdults < 1 || formState.capacityAdults > 20) {
      newErrors.capacityAdults = 'Số người lớn từ 1-20';
    }
    if (formState.capacityChildren < 0 || formState.capacityChildren > 10) {
      newErrors.capacityChildren = 'Số trẻ em từ 0-10';
    }
    if (!formState.maxOccupancy || formState.maxOccupancy < 1) {
      newErrors.maxOccupancy = 'Sức chứa tối đa ít nhất 1 người';
    } else if (formState.maxOccupancy < formState.capacityAdults) {
      newErrors.maxOccupancy = 'Sức chứa tối đa phải >= số người lớn';
    }
    if (formState.sizeM2 < 10 || formState.sizeM2 > 1000) {
      newErrors.sizeM2 = 'Diện tích từ 10-1000m²';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    if (isEditMode) {
      const updateData: RoomTypeUpdateRequest = {
        name: formState.name,
        code: formState.code,
        priceFrom: formState.priceFrom,
        capacityAdults: formState.capacityAdults,
        capacityChildren: formState.capacityChildren,
        maxOccupancy: formState.maxOccupancy,
        sizeM2: formState.sizeM2,
        refundable: formState.refundable,
        amenityIds: formState.amenityIds,
      };
      console.log('Updating room type with data:', updateData);
      await onSubmit(updateData);
    } else {
      const createData: RoomTypeCreationRequest = {
        branchId: formState.branchId,
        name: formState.name,
        code: formState.code,
        priceFrom: formState.priceFrom,
        capacityAdults: formState.capacityAdults,
        capacityChildren: formState.capacityChildren,
        maxOccupancy: formState.maxOccupancy,
        sizeM2: formState.sizeM2,
        refundable: formState.refundable,
        amenityIds: formState.amenityIds,
      };
      console.log('Creating room type with data:', createData);
      await onSubmit(createData);
    }
  };

  const toggleAmenity = (amenityId: string) => {
    if (formState.amenityIds.includes(amenityId)) {
      updateField('amenityIds', formState.amenityIds.filter(id => id !== amenityId));
    } else {
      updateField('amenityIds', [...formState.amenityIds, amenityId]);
    }
  };

  // Auto-generate code from name
  const generateCode = () => {
    if (formState.name) {
      const code = formState.name
        .toUpperCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/gi, 'd')
        .replace(/[^A-Z]/g, '')
        .slice(0, 5);
      // Ensure at least 3 characters
      const finalCode = code.length >= 3 ? code : code.padEnd(3, 'X');
      updateField('code', finalCode);
    }
  };

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
              <CardDescription>Chọn chi nhánh cho loại phòng</CardDescription>
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

      {/* Basic Info Section */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-slate-50">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-600">
              <Tag className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg">Thông tin cơ bản</CardTitle>
              <CardDescription>Tên và mã loại phòng</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2">
          {/* Name */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <DoorOpen className="h-4 w-4 text-muted-foreground" />
              Tên loại phòng <span className="text-destructive">*</span>
            </Label>
            <Input
              value={formState.name}
              onChange={(e) => updateField('name', e.target.value)}
              placeholder="VD: Phòng Deluxe, Phòng Superior..."
              className={`h-11 ${errors.name ? 'border-destructive' : ''}`}
            />
            {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
          </div>

          {/* Code */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Code className="h-4 w-4 text-muted-foreground" />
              Mã loại phòng <span className="text-destructive">*</span>
            </Label>
            <div className="flex gap-2">
              <Input
                value={formState.code}
                onChange={(e) => updateField('code', e.target.value.toUpperCase())}
                placeholder="VD: DELUXE, SUPERIOR..."
                className={`h-11 font-mono uppercase ${errors.code ? 'border-destructive' : ''}`}
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={generateCode}
                className="h-11 w-11 shrink-0"
                title="Tạo mã tự động"
              >
                <RefreshCcw className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">Mã gồm 3-5 chữ in hoa (VD: DEL, SUITE, STDRD)</p>
            {errors.code && <p className="text-sm text-destructive">{errors.code}</p>}
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
              <CardTitle className="text-lg">Thông tin giá</CardTitle>
              <CardDescription>Giá phòng cơ bản và cuối tuần</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2">
          {/* Price From */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              Giá tham khảo từ (VNĐ/đêm) <span className="text-destructive">*</span>
            </Label>
            <Input
              type="number"
              value={formState.priceFrom}
              onChange={(e) => updateField('priceFrom', parseFloat(e.target.value) || 0)}
              min={0}
              step={10000}
              placeholder="500000"
              className={`h-11 ${errors.priceFrom ? 'border-destructive' : ''}`}
            />
            <p className="text-sm text-muted-foreground">Giá tham khảo thấp nhất của loại phòng này</p>
            {errors.priceFrom && <p className="text-sm text-destructive">{errors.priceFrom}</p>}
          </div>
        </CardContent>
      </Card>

      {/* Capacity & Size Section */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-slate-50">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-100 text-purple-600">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg">Sức chứa & Diện tích</CardTitle>
              <CardDescription>Thông số kỹ thuật của loại phòng</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* Capacity Adults */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              Số người lớn <span className="text-destructive">*</span>
            </Label>
            <Input
              type="number"
              value={formState.capacityAdults}
              onChange={(e) => updateField('capacityAdults', parseInt(e.target.value) || 1)}
              min={1}
              max={20}
              className={`h-11 ${errors.capacityAdults ? 'border-destructive' : ''}`}
            />
            {errors.capacityAdults && <p className="text-sm text-destructive">{errors.capacityAdults}</p>}
          </div>

          {/* Capacity Children */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              Số trẻ em
            </Label>
            <Input
              type="number"
              value={formState.capacityChildren}
              onChange={(e) => updateField('capacityChildren', parseInt(e.target.value) || 0)}
              min={0}
              max={10}
              className={`h-11 ${errors.capacityChildren ? 'border-destructive' : ''}`}
            />
            {errors.capacityChildren && <p className="text-sm text-destructive">{errors.capacityChildren}</p>}
          </div>

          {/* Max Occupancy */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              Sức chứa tối đa <span className="text-destructive">*</span>
            </Label>
            <Input
              type="number"
              value={formState.maxOccupancy}
              onChange={(e) => updateField('maxOccupancy', parseInt(e.target.value) || 1)}
              min={1}
              max={30}
              className={`h-11 ${errors.maxOccupancy ? 'border-destructive' : ''}`}
            />
            <p className="text-sm text-muted-foreground">Tổng số người tối đa</p>
            {errors.maxOccupancy && <p className="text-sm text-destructive">{errors.maxOccupancy}</p>}
          </div>

          {/* Size */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Maximize className="h-4 w-4 text-muted-foreground" />
              Diện tích (m²) <span className="text-destructive">*</span>
            </Label>
            <Input
              type="number"
              value={formState.sizeM2}
              onChange={(e) => updateField('sizeM2', parseInt(e.target.value) || 10)}
              min={10}
              max={1000}
              className={`h-11 ${errors.sizeM2 ? 'border-destructive' : ''}`}
            />
            {errors.sizeM2 && <p className="text-sm text-destructive">{errors.sizeM2}</p>}
          </div>
        </CardContent>
      </Card>

      {/* Refundable Section */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-slate-50">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-100 text-amber-600">
              <RefreshCcw className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg">Chính sách</CardTitle>
              <CardDescription>Cài đặt chính sách hoàn tiền</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between rounded-lg border p-4 bg-white">
            <div className="space-y-0.5">
              <Label className="text-base">Cho phép hoàn tiền</Label>
              <p className="text-sm text-muted-foreground">
                Khách có thể được hoàn tiền khi hủy đặt phòng theo chính sách
              </p>
            </div>
            <Switch
              checked={formState.refundable}
              onCheckedChange={(checked) => updateField('refundable', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Amenities Section */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-slate-50">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-indigo-100 text-indigo-600">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-lg">Tiện nghi</CardTitle>
                <CardDescription>Chọn các tiện nghi có trong loại phòng này</CardDescription>
              </div>
            </div>
            <Badge variant="secondary" className="text-sm">
              {formState.amenityIds.length} đã chọn
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {isLoadingAmenities ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : amenities.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Chưa có tiện nghi nào được tạo
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {amenities.map((amenity) => {
                const isSelected = formState.amenityIds.includes(amenity.id);
                return (
                  <button
                    key={amenity.id}
                    type="button"
                    onClick={() => toggleAmenity(amenity.id)}
                    className={`
                      flex items-center gap-3 p-3 rounded-lg border-2 transition-all duration-200
                      ${isSelected 
                        ? 'border-blue-500 bg-blue-50 text-blue-700' 
                        : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                      }
                    `}
                  >
                    <div className={`
                      w-6 h-6 rounded-full flex items-center justify-center shrink-0
                      ${isSelected ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-400'}
                    `}>
                      {isSelected ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <span className="text-xs">{amenity.icon || '✓'}</span>
                      )}
                    </div>
                    <span className="text-sm font-medium truncate">{amenity.name}</span>
                  </button>
                );
              })}
            </div>
          )}
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
          className="min-w-[180px] bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Đang lưu...
            </>
          ) : isEditMode ? (
            'Cập nhật loại phòng'
          ) : (
            'Tạo loại phòng mới'
          )}
        </Button>
      </div>
    </form>
  );
}
