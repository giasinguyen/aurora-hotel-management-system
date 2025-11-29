import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Building2, MapPin, Phone, Mail, Clock, CalendarDays, FileText, Loader2, Save, X } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';


import type { Branch, BranchStatus, BranchCreationRequest, BranchUpdateRequest } from '@/types/branch.types';

interface BranchFormProps {
  branch?: Branch | null;
  onSubmit: (data: BranchCreationRequest | BranchUpdateRequest) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

// Vietnam cities for selection
const VIETNAM_CITIES = [
  'Hà Nội',
  'TP. Hồ Chí Minh',
  'Đà Nẵng',
  'Hải Phòng',
  'Cần Thơ',
  'Nha Trang',
  'Vũng Tàu',
  'Huế',
  'Đà Lạt',
  'Phú Quốc',
  'Quy Nhơn',
  'Hạ Long',
  'Sapa',
  'Hội An',
];

// Status options
const STATUS_OPTIONS: { value: BranchStatus; label: string; description: string }[] = [
  { value: 'ACTIVE', label: 'Hoạt động', description: 'Chi nhánh đang hoạt động bình thường' },
  { value: 'INACTIVE', label: 'Tạm ngừng', description: 'Chi nhánh tạm thời ngừng hoạt động' },
  { value: 'MAINTENANCE', label: 'Bảo trì', description: 'Chi nhánh đang trong quá trình bảo trì' },
  { value: 'CLOSED', label: 'Đã đóng cửa', description: 'Chi nhánh đã đóng cửa vĩnh viễn' },
];

interface FormData {
  name: string;
  code: string;
  address: string;
  ward: string;
  district: string;
  city: string;
  phone: string;
  email: string;
  status?: BranchStatus;
  openingDate?: string;
  checkInTime?: string;
  checkOutTime?: string;
  operatingHours?: string;
  description?: string;
}

export default function BranchForm({ branch, onSubmit, onCancel, isLoading = false }: BranchFormProps) {
  const isEditMode = !!branch;
  const [selectedCity, setSelectedCity] = useState<string>(branch?.city || '');
  const [selectedStatus, setSelectedStatus] = useState<BranchStatus>(branch?.status || 'ACTIVE');

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    setValue,
  } = useForm<FormData>({
    defaultValues: {
      name: branch?.name || '',
      code: branch?.code || '',
      address: branch?.address || '',
      ward: branch?.ward || '',
      district: branch?.district || '',
      city: branch?.city || '',
      phone: branch?.phone || '',
      email: branch?.email || '',
      status: branch?.status || 'ACTIVE',
      openingDate: branch?.openingDate ? branch.openingDate.split('T')[0] : '',
      checkInTime: branch?.checkInTime || '14:00',
      checkOutTime: branch?.checkOutTime || '12:00',
      operatingHours: branch?.operatingHours || '',
      description: branch?.description || '',
    },
  });

  // Generate branch code from name
  const generateCode = (name: string) => {
    const words = name.trim().split(' ');
    if (words.length >= 2) {
      return words.map(w => w.charAt(0).toUpperCase()).join('') + '-' + Math.random().toString(36).substring(2, 6).toUpperCase();
    }
    return name.substring(0, 3).toUpperCase() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase();
  };

  const handleFormSubmit = async (data: FormData) => {
    const formData = {
      ...data,
      city: selectedCity,
      status: isEditMode ? selectedStatus : undefined,
    };

    if (isEditMode) {
      await onSubmit({
        name: formData.name,
        address: formData.address,
        ward: formData.ward,
        district: formData.district,
        city: formData.city,
        phone: formData.phone,
        email: formData.email,
        status: formData.status,
        checkInTime: formData.checkInTime,
        checkOutTime: formData.checkOutTime,
        operatingHours: formData.operatingHours,
        description: formData.description,
      } as BranchUpdateRequest);
    } else {
      await onSubmit({
        name: formData.name,
        code: formData.code,
        address: formData.address,
        ward: formData.ward,
        district: formData.district,
        city: formData.city,
        phone: formData.phone,
        email: formData.email,
        openingDate: formData.openingDate,
        checkInTime: formData.checkInTime,
        checkOutTime: formData.checkOutTime,
        operatingHours: formData.operatingHours,
        description: formData.description,
      } as BranchCreationRequest);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Basic Information Section */}
      <Card className="overflow-hidden border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <Building2 className="h-6 w-6" />
            </div>
            <div>
              <CardTitle className="text-xl">Thông tin cơ bản</CardTitle>
              <CardDescription className="text-blue-100">
                Nhập thông tin chính của chi nhánh
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Branch Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium flex items-center gap-2">
                <Building2 className="h-4 w-4 text-blue-500" />
                Tên chi nhánh <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                placeholder="VD: Aurora Hotel Đà Nẵng"
                {...register('name', { required: 'Tên chi nhánh là bắt buộc' })}
                onBlur={(e) => {
                  if (!isEditMode) {
                    setValue('code', generateCode(e.target.value));
                  }
                }}
                className={errors.name ? 'border-destructive' : ''}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>

            {/* Branch Code */}
            <div className="space-y-2">
              <Label htmlFor="code" className="text-sm font-medium flex items-center gap-2">
                <FileText className="h-4 w-4 text-blue-500" />
                Mã chi nhánh <span className="text-destructive">*</span>
              </Label>
              <Input
                id="code"
                placeholder="VD: AHD-2024"
                {...register('code', { required: 'Mã chi nhánh là bắt buộc' })}
                disabled={isEditMode}
                className={`font-mono ${errors.code ? 'border-destructive' : ''} ${isEditMode ? 'bg-muted' : ''}`}
              />
              {errors.code && (
                <p className="text-sm text-destructive">{errors.code.message}</p>
              )}
              {!isEditMode && (
                <p className="text-xs text-muted-foreground">
                  Mã sẽ được tự động tạo từ tên chi nhánh
                </p>
              )}
            </div>
          </div>

          {/* Status - Only show in edit mode */}
          {isEditMode && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Trạng thái hoạt động</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {STATUS_OPTIONS.map((option) => (
                  <div
                    key={option.value}
                    onClick={() => setSelectedStatus(option.value)}
                    className={`
                      relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-200
                      ${selectedStatus === option.value
                        ? option.value === 'ACTIVE' 
                          ? 'border-green-500 bg-green-50'
                          : option.value === 'INACTIVE'
                          ? 'border-yellow-500 bg-yellow-50'
                          : option.value === 'MAINTENANCE'
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-red-500 bg-red-50'
                        : 'border-gray-200 hover:border-gray-300'
                      }
                    `}
                  >
                    <div className="font-medium text-sm">{option.label}</div>
                    <div className="text-xs text-muted-foreground mt-1">{option.description}</div>
                    {selectedStatus === option.value && (
                      <div className={`
                        absolute top-2 right-2 w-2 h-2 rounded-full
                        ${option.value === 'ACTIVE' ? 'bg-green-500' : ''}
                        ${option.value === 'INACTIVE' ? 'bg-yellow-500' : ''}
                        ${option.value === 'MAINTENANCE' ? 'bg-blue-500' : ''}
                        ${option.value === 'CLOSED' ? 'bg-red-500' : ''}
                      `} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium flex items-center gap-2">
              <FileText className="h-4 w-4 text-blue-500" />
              Mô tả
            </Label>
            <Textarea
              id="description"
              placeholder="Mô tả về chi nhánh, tiện nghi, đặc điểm nổi bật..."
              {...register('description')}
              rows={3}
              className="resize-none"
            />
          </div>
        </CardContent>
      </Card>

      {/* Address Section */}
      <Card className="overflow-hidden border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <MapPin className="h-6 w-6" />
            </div>
            <div>
              <CardTitle className="text-xl">Địa chỉ</CardTitle>
              <CardDescription className="text-emerald-100">
                Thông tin vị trí của chi nhánh
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* City */}
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2">
                <MapPin className="h-4 w-4 text-emerald-500" />
                Thành phố <span className="text-destructive">*</span>
              </Label>
              <Select value={selectedCity} onValueChange={setSelectedCity}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn thành phố" />
                </SelectTrigger>
                <SelectContent>
                  {VIETNAM_CITIES.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* District */}
            <div className="space-y-2">
              <Label htmlFor="district" className="text-sm font-medium">
                Quận/Huyện <span className="text-destructive">*</span>
              </Label>
              <Input
                id="district"
                placeholder="VD: Quận Hải Châu"
                {...register('district', { required: 'Quận/Huyện là bắt buộc' })}
                className={errors.district ? 'border-destructive' : ''}
              />
              {errors.district && (
                <p className="text-sm text-destructive">{errors.district.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Ward */}
            <div className="space-y-2">
              <Label htmlFor="ward" className="text-sm font-medium">
                Phường/Xã <span className="text-destructive">*</span>
              </Label>
              <Input
                id="ward"
                placeholder="VD: Phường Thạch Thang"
                {...register('ward', { required: 'Phường/Xã là bắt buộc' })}
                className={errors.ward ? 'border-destructive' : ''}
              />
              {errors.ward && (
                <p className="text-sm text-destructive">{errors.ward.message}</p>
              )}
            </div>

            {/* Address */}
            <div className="space-y-2">
              <Label htmlFor="address" className="text-sm font-medium">
                Địa chỉ chi tiết <span className="text-destructive">*</span>
              </Label>
              <Input
                id="address"
                placeholder="VD: 123 Đường Bạch Đằng"
                {...register('address', { required: 'Địa chỉ là bắt buộc' })}
                className={errors.address ? 'border-destructive' : ''}
              />
              {errors.address && (
                <p className="text-sm text-destructive">{errors.address.message}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Section */}
      <Card className="overflow-hidden border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <Phone className="h-6 w-6" />
            </div>
            <div>
              <CardTitle className="text-xl">Thông tin liên hệ</CardTitle>
              <CardDescription className="text-purple-100">
                Số điện thoại và email liên hệ
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium flex items-center gap-2">
                <Phone className="h-4 w-4 text-purple-500" />
                Số điện thoại <span className="text-destructive">*</span>
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="VD: 0236 123 4567"
                {...register('phone', {
                  required: 'Số điện thoại là bắt buộc',
                  pattern: {
                    value: /^[0-9\s+()-]+$/,
                    message: 'Số điện thoại không hợp lệ',
                  },
                })}
                className={errors.phone ? 'border-destructive' : ''}
              />
              {errors.phone && (
                <p className="text-sm text-destructive">{errors.phone.message}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                <Mail className="h-4 w-4 text-purple-500" />
                Email <span className="text-destructive">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="VD: danang@aurorahotel.com"
                {...register('email', {
                  required: 'Email là bắt buộc',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Email không hợp lệ',
                  },
                })}
                className={errors.email ? 'border-destructive' : ''}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Operating Hours Section */}
      <Card className="overflow-hidden border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <Clock className="h-6 w-6" />
            </div>
            <div>
              <CardTitle className="text-xl">Thời gian hoạt động</CardTitle>
              <CardDescription className="text-orange-100">
                Giờ check-in/check-out và ngày khai trương
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Check-in Time */}
            <div className="space-y-2">
              <Label htmlFor="checkInTime" className="text-sm font-medium flex items-center gap-2">
                <Clock className="h-4 w-4 text-orange-500" />
                Giờ Check-in
              </Label>
              <Input
                id="checkInTime"
                type="time"
                {...register('checkInTime')}
              />
              <p className="text-xs text-muted-foreground">Mặc định: 14:00</p>
            </div>

            {/* Check-out Time */}
            <div className="space-y-2">
              <Label htmlFor="checkOutTime" className="text-sm font-medium flex items-center gap-2">
                <Clock className="h-4 w-4 text-orange-500" />
                Giờ Check-out
              </Label>
              <Input
                id="checkOutTime"
                type="time"
                {...register('checkOutTime')}
              />
              <p className="text-xs text-muted-foreground">Mặc định: 12:00</p>
            </div>

            {/* Opening Date */}
            {!isEditMode && (
              <div className="space-y-2">
                <Label htmlFor="openingDate" className="text-sm font-medium flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-orange-500" />
                  Ngày khai trương
                </Label>
                <Input
                  id="openingDate"
                  type="date"
                  {...register('openingDate')}
                />
              </div>
            )}
          </div>

          {/* Operating Hours (optional) */}
          <div className="space-y-2">
            <Label htmlFor="operatingHours" className="text-sm font-medium">
              Giờ hoạt động (tùy chọn)
            </Label>
            <Input
              id="operatingHours"
              placeholder="VD: 24/7 hoặc 06:00 - 23:00"
              {...register('operatingHours')}
            />
            <p className="text-xs text-muted-foreground">
              Để trống nếu sử dụng giờ check-in/check-out mặc định
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-4 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
          className="gap-2"
        >
          <X className="h-4 w-4" />
          Hủy
        </Button>
        <Button
          type="submit"
          disabled={isLoading || (!isDirty && isEditMode)}
          className="gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Đang xử lý...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              {isEditMode ? 'Cập nhật' : 'Tạo chi nhánh'}
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
