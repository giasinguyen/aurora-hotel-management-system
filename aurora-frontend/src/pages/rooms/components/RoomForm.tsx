// ============================================
// Room Form Component - Aurora Hotel Management
// ============================================

import { useEffect, useState } from 'react';
import { Loader2, Building2, DoorOpen, Users, Maximize, Layers } from 'lucide-react';

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
  capacityAdults: number;
  capacityChildren: number;
  sizeM2: number;
}

interface FormErrors {
  branchId?: string;
  roomTypeId?: string;
  roomNumber?: string;
  floor?: string;
  capacityAdults?: string;
  capacityChildren?: string;
  sizeM2?: string;
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
    status: room?.status || 'AVAILABLE',
    capacityAdults: room?.capacityAdults || 2,
    capacityChildren: room?.capacityChildren || 0,
    sizeM2: room?.sizeM2 || 25,
  });

  // ========== Effects ==========

  // Update form state when room prop changes (for edit mode)
  useEffect(() => {
    if (room) {
      setFormState({
        branchId: room.branchId || '',
        roomTypeId: room.roomTypeId || '',
        roomNumber: room.roomNumber || '',
        floor: room.floor || 1,
        status: room.status || 'AVAILABLE',
        capacityAdults: room.capacityAdults || 2,
        capacityChildren: room.capacityChildren || 0,
        sizeM2: room.sizeM2 || 25,
      });
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
    if (formState.capacityAdults < 1 || formState.capacityAdults > 20) {
      newErrors.capacityAdults = 'Số người lớn từ 1-20';
    }
    if (formState.capacityChildren < 0 || formState.capacityChildren > 10) {
      newErrors.capacityChildren = 'Số trẻ em từ 0-10';
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
      const updateData: RoomUpdateRequest = {
        roomTypeId: formState.roomTypeId,
        roomNumber: formState.roomNumber,
        floor: formState.floor,
        status: formState.status,
        capacityAdults: formState.capacityAdults,
        capacityChildren: formState.capacityChildren,
        sizeM2: formState.sizeM2,
      };
      await onSubmit(updateData);
    } else {
      const createData: RoomCreationRequest = {
        branchId: formState.branchId,
        roomTypeId: formState.roomTypeId,
        roomNumber: formState.roomNumber,
        floor: formState.floor,
        status: formState.status,
        capacityAdults: formState.capacityAdults,
        capacityChildren: formState.capacityChildren,
        sizeM2: formState.sizeM2,
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

      {/* Capacity & Size Section */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-slate-50">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-100 text-purple-600">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg">Sức chứa & Diện tích</CardTitle>
              <CardDescription>Thông tin về sức chứa và kích thước phòng</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-3">
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
            <p className="text-sm text-muted-foreground">Từ 1-20 người</p>
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
            <p className="text-sm text-muted-foreground">Từ 0-10 trẻ em</p>
            {errors.capacityChildren && <p className="text-sm text-destructive">{errors.capacityChildren}</p>}
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
            <p className="text-sm text-muted-foreground">Từ 10-1000 m²</p>
            {errors.sizeM2 && <p className="text-sm text-destructive">{errors.sizeM2}</p>}
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
