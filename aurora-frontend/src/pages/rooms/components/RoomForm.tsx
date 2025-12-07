// ============================================
// Room Form Component - Aurora Hotel Management
// ============================================

import { useEffect, useState } from 'react';
import { Loader2, Building2, DoorOpen, Users, Maximize, Layers, DollarSign, Eye, Percent, Image as ImageIcon, Plus, X, Upload } from 'lucide-react';
import fallbackImage from '@/assets/images/commons/fallback.png';
import { uploadToCloudinary, uploadMultipleToCloudinary } from '@/config/cloudinary';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { branchApi } from '@/services/branchApi';
import { roomTypeApi } from '@/services/roomApi';
import type { Branch } from '@/types/branch.types';
import type { RoomType, RoomStatus, Room, RoomCreationRequest, RoomUpdateRequest } from '@/types/room.types';
import { ROOM_STATUS_OPTIONS } from '../constants';
import RoomStatusBadge from './RoomStatusBadge';

// ============================================
// Form State Type
// ============================================

interface FormState {
  branchId: string;
  roomTypeId: string;
  roomNumber: string;
  floor: number;
  status: RoomStatus;
  viewType: string;
  basePrice: number;
  salePercent: number;
  images: string[];
}

interface FormErrors {
  branchId?: string;
  roomTypeId?: string;
  roomNumber?: string;
  floor?: string;
  viewType?: string;
  basePrice?: string;
  salePercent?: string;
}

// ============================================
// Props Interface
// ============================================

interface RoomFormProps {
  room?: Room;
  isEditMode?: boolean;
  onSubmit: (data: RoomCreationRequest | RoomUpdateRequest) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

// ============================================
// Component
// ============================================

export default function RoomForm({
  room,
  isEditMode = false,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: RoomFormProps) {
  // ========== States ==========
  const [branches, setBranches] = useState<Branch[]>([]);
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [isLoadingBranches, setIsLoadingBranches] = useState(true);
  const [isLoadingRoomTypes, setIsLoadingRoomTypes] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const [formState, setFormState] = useState<FormState>({
    branchId: room?.branchId || '',
    roomTypeId: room?.roomTypeId || '',
    roomNumber: room?.roomNumber || '',
    floor: room?.floor || 1,
    status: room?.status || 'READY',
    viewType: room?.viewType || 'CITY',
    basePrice: room?.basePrice || 500000,
    salePercent: room?.salePercent || 0,
    images: room?.images || [],
  });
  
  const [newImageUrl, setNewImageUrl] = useState('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // ========== Effects ==========

  // Update form state when room prop changes (for edit mode)
  useEffect(() => {
    if (room) {
      setFormState({
        branchId: room.branchId || '',
        roomTypeId: room.roomTypeId || '',
        roomNumber: room.roomNumber || '',
        floor: room.floor || 1,
        status: room.status || 'READY',
        viewType: room.viewType || 'CITY',
        basePrice: room.basePrice || 500000,
        salePercent: room.salePercent || 0,
        images: room.images || [],
      });
      setNewImageUrl('');
      setErrors({});
    }
  }, [room]);

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

  // Fetch room types when branch changes
  useEffect(() => {
    const fetchRoomTypes = async () => {
      if (!formState.branchId) {
        setRoomTypes([]);
        return;
      }

      try {
        setIsLoadingRoomTypes(true);
        const response = await roomTypeApi.getByBranch(formState.branchId);
        setRoomTypes(response.result);
        
        // Reset roomTypeId if current selection is not in new list
        if (formState.roomTypeId && !response.result.find(rt => rt.id === formState.roomTypeId)) {
          setFormState(prev => ({ ...prev, roomTypeId: '' }));
        }
      } catch (error) {
        console.error('Failed to fetch room types:', error);
        setRoomTypes([]);
      } finally {
        setIsLoadingRoomTypes(false);
      }
    };
    fetchRoomTypes();
  }, [formState.branchId, formState.roomTypeId]);

  // ========== Handlers ==========

  const updateField = <K extends keyof FormState>(field: K, value: FormState[K]) => {
    setFormState(prev => ({ ...prev, [field]: value }));
    // Clear error when field is updated
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formState.branchId) {
      newErrors.branchId = 'Vui lòng chọn chi nhánh';
    }
    if (!formState.roomTypeId) {
      newErrors.roomTypeId = 'Vui lòng chọn loại phòng';
    }
    if (!formState.roomNumber || formState.roomNumber.trim() === '') {
      newErrors.roomNumber = 'Vui lòng nhập số phòng';
    } else if (!/^[A-Za-z0-9-]+$/.test(formState.roomNumber)) {
      newErrors.roomNumber = 'Số phòng chỉ chứa chữ cái, số và dấu gạch ngang';
    }
    if (formState.floor < -5 || formState.floor > 200) {
      newErrors.floor = 'Tầng phải từ -5 đến 200';
    }
    if (!formState.basePrice || formState.basePrice <= 0) {
      newErrors.basePrice = 'Giá gốc phải lớn hơn 0';
    }
    if (formState.salePercent < 0 || formState.salePercent > 100) {
      newErrors.salePercent = '% giảm giá từ 0-100';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddImage = () => {
    if (newImageUrl.trim() && !formState.images.includes(newImageUrl.trim())) {
      setFormState(prev => ({
        ...prev,
        images: [...prev.images, newImageUrl.trim()]
      }));
      setNewImageUrl('');
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Validate max images
    if (formState.images.length + files.length > 10) {
      toast.error('Chỉ được tải tối đa 10 ảnh');
      return;
    }

    // Validate file types and sizes
    for (const file of Array.from(files)) {
      if (!file.type.startsWith('image/')) {
        toast.error('Vui lòng chỉ chọn các file ảnh');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`File ${file.name} vượt quá 5MB`);
        return;
      }
    }

    try {
      setIsUploadingImage(true);
      toast.info(`Đang tải lên ${files.length} ảnh...`);
      
      // Upload all files using backend API
      const uploadedUrls = await uploadMultipleToCloudinary(Array.from(files), 'rooms');
      
      // Add to form state
      setFormState(prev => ({
        ...prev,
        images: [...prev.images, ...uploadedUrls]
      }));
      
      toast.success(`Đã tải lên ${uploadedUrls.length} ảnh thành công!`);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Không thể tải ảnh lên. Vui lòng thử lại.');
    } finally {
      setIsUploadingImage(false);
      // Reset input
      e.target.value = '';
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormState(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    if (isEditMode) {
      const updateData: RoomUpdateRequest = {
        roomTypeId: formState.roomTypeId,
        roomNumber: formState.roomNumber,
        floor: formState.floor,
        status: formState.status,
        viewType: formState.viewType,
        basePrice: formState.basePrice,
        salePercent: formState.salePercent,
        images: formState.images.length > 0 ? formState.images : undefined,
      };
      await onSubmit(updateData);
    } else {
      const createData: RoomCreationRequest = {
        branchId: formState.branchId,
        roomTypeId: formState.roomTypeId,
        roomNumber: formState.roomNumber,
        floor: formState.floor,
        status: formState.status,
        viewType: formState.viewType,
        basePrice: formState.basePrice,
        salePercent: formState.salePercent,
        images: formState.images.length > 0 ? formState.images : undefined,
      };
      await onSubmit(createData);
    }
  };

  // ========== Render ==========

  return (
    <form onSubmit={handleFormSubmit} className="space-y-6">
      {/* Branch & Room Type Section */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-slate-50">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-100 text-blue-600">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg">Thông tin chi nhánh</CardTitle>
              <CardDescription>Chọn chi nhánh và loại phòng</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2">
          {/* Branch Select */}
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
              <SelectTrigger className={`h-11 ${errors.branchId ? 'border-destructive' : ''}`}>
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

          {/* Room Type Select */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <DoorOpen className="h-4 w-4 text-muted-foreground" />
              Loại phòng <span className="text-destructive">*</span>
            </Label>
            <Select
              disabled={!formState.branchId || isLoadingRoomTypes}
              value={formState.roomTypeId}
              onValueChange={(value) => updateField('roomTypeId', value)}
            >
              <SelectTrigger className={`h-11 ${errors.roomTypeId ? 'border-destructive' : ''}`}>
                <SelectValue
                  placeholder={
                    !formState.branchId
                      ? 'Chọn chi nhánh trước'
                      : isLoadingRoomTypes
                      ? 'Đang tải...'
                      : 'Chọn loại phòng'
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {roomTypes.map((roomType) => (
                  <SelectItem key={roomType.id} value={roomType.id}>
                    <div className="flex flex-col">
                      <span className="font-medium">{roomType.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {roomType.capacityAdults} người • {roomType.sizeM2}m²
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.roomTypeId && <p className="text-sm text-destructive">{errors.roomTypeId}</p>}
          </div>
        </CardContent>
      </Card>

      {/* Room Details Section */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-slate-50">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-600">
              <DoorOpen className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg">Thông tin phòng</CardTitle>
              <CardDescription>Số phòng, tầng và trạng thái</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-3">
          {/* Room Number */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <DoorOpen className="h-4 w-4 text-muted-foreground" />
              Số phòng <span className="text-destructive">*</span>
            </Label>
            <Input
              value={formState.roomNumber}
              onChange={(e) => updateField('roomNumber', e.target.value.toUpperCase())}
              placeholder="VD: 101, A-201"
              className={`h-11 font-mono text-lg font-bold uppercase ${errors.roomNumber ? 'border-destructive' : ''}`}
            />
            {errors.roomNumber && <p className="text-sm text-destructive">{errors.roomNumber}</p>}
          </div>

          {/* Floor */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-muted-foreground" />
              Tầng <span className="text-destructive">*</span>
            </Label>
            <Input
              type="number"
              value={formState.floor}
              onChange={(e) => updateField('floor', parseInt(e.target.value) || 1)}
              min={-5}
              max={200}
              className={`h-11 ${errors.floor ? 'border-destructive' : ''}`}
            />
            {errors.floor && <p className="text-sm text-destructive">{errors.floor}</p>}
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label>Trạng thái</Label>
            <Select
              value={formState.status}
              onValueChange={(value) => updateField('status', value as RoomStatus)}
            >
              <SelectTrigger className="h-11">
                <SelectValue>
                  <RoomStatusBadge status={formState.status} size="sm" />
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {ROOM_STATUS_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-3">
                      <RoomStatusBadge status={option.value} size="sm" />
                      <span className="text-xs text-muted-foreground">
                        {option.description}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Price & View Section */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-slate-50">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-green-100 text-green-600">
              <DollarSign className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg">Giá & Khuyến mãi</CardTitle>
              <CardDescription>Quản lý giá phòng và giảm giá linh hoạt</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-3">
          {/* View Type */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-muted-foreground" />
              Hướng view <span className="text-destructive">*</span>
            </Label>
            <Select
              value={formState.viewType}
              onValueChange={(value) => updateField('viewType', value)}
            >
              <SelectTrigger className="h-11">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CITY">Thành phố</SelectItem>
                <SelectItem value="SEA">Biển/Sông</SelectItem>
                <SelectItem value="MOUNTAIN">Núi</SelectItem>
                <SelectItem value="GARDEN">Vườn</SelectItem>
              </SelectContent>
            </Select>
            {errors.viewType && <p className="text-sm text-destructive">{errors.viewType}</p>}
          </div>

          {/* Base Price */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              Giá gốc (VNĐ/đêm) <span className="text-destructive">*</span>
            </Label>
            <Input
              type="number"
              value={formState.basePrice}
              onChange={(e) => updateField('basePrice', parseFloat(e.target.value) || 0)}
              min={0}
              step={10000}
              placeholder="500000"
              className={`h-11 ${errors.basePrice ? 'border-destructive' : ''}`}
            />
            <p className="text-sm text-muted-foreground">Giá gốc của phòng (có thể thay đổi)</p>
            {errors.basePrice && <p className="text-sm text-destructive">{errors.basePrice}</p>}
          </div>

          {/* Sale Percent */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Percent className="h-4 w-4 text-muted-foreground" />
              % Giảm giá
            </Label>
            <Input
              type="number"
              value={formState.salePercent}
              onChange={(e) => updateField('salePercent', parseFloat(e.target.value) || 0)}
              min={0}
              max={100}
              step={1}
              placeholder="0"
              className={`h-11 ${errors.salePercent ? 'border-destructive' : ''}`}
            />
            <p className="text-sm text-muted-foreground">
              Giá hiển thị: {formState.basePrice ? (formState.basePrice * (100 - formState.salePercent) / 100).toLocaleString('vi-VN') : '0'} VNĐ
            </p>
            {errors.salePercent && <p className="text-sm text-destructive">{errors.salePercent}</p>}
          </div>
        </CardContent>
      </Card>

      {/* Images Section */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-slate-50">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-100 text-blue-600">
              <ImageIcon className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg">Hình ảnh phòng</CardTitle>
              <CardDescription>Tải lên hình ảnh cho phòng (tối đa 10 ảnh)</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('room-images-upload')?.click()}
                disabled={isUploadingImage || formState.images.length >= 10}
                className="flex items-center gap-2"
              >
                {isUploadingImage ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4" />
                )}
                {isUploadingImage ? 'Đang tải lên...' : 'Chọn ảnh'}
              </Button>
              <input
                id="room-images-upload"
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
              />
              <span className="text-sm text-muted-foreground">
                JPG, PNG (tối đa 5MB/ảnh, {10 - formState.images.length} ảnh còn lại)
              </span>
            </div>

            {formState.images.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {formState.images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image}
                      alt={`Room Image ${index + 1}`}
                      className="w-full h-24 object-cover rounded-md border"
                      onError={(e) => { e.currentTarget.src = fallbackImage; }}
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-1 right-1 h-6 w-6 rounded-full shadow-md opacity-90 hover:opacity-100 transition-opacity"
                      onClick={() => handleRemoveImage(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-8 border-2 border-dashed rounded-lg">
                <ImageIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Chưa có hình ảnh nào được thêm</p>
                <p className="text-sm">Nhấp nút "Chọn ảnh" để tải lên</p>
              </div>
            )}
            {formState.images.length >= 10 && (
              <p className="text-sm text-amber-600">Đã đạt tối đa 10 ảnh</p>
            )}
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
          className="min-w-[160px] bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Đang lưu...
            </>
          ) : isEditMode ? (
            'Cập nhật phòng'
          ) : (
            'Tạo phòng mới'
          )}
        </Button>
      </div>
    </form>
  );
}
