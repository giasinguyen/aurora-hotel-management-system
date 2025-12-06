// ============================================
// Room Constants - Aurora Hotel Management
// ============================================

import type { RoomStatus } from '@/types/room.types';

export interface RoomStatusConfig {
  label: string;
  variant: 'default' | 'secondary' | 'destructive' | 'outline';
  className: string;
  iconName: string;
  description: string;
}

export const ROOM_STATUS_CONFIG: Record<RoomStatus, RoomStatusConfig> = {
  READY: {
    label: 'Sẵn sàng',
    variant: 'default',
    className: 'bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100',
    iconName: 'CheckCircle2',
    description: 'Phòng sẵn sàng sử dụng',
  },
  CLEANING: {
    label: 'Đang dọn',
    variant: 'outline',
    className: 'bg-purple-100 text-purple-700 border-purple-200 hover:bg-purple-100',
    iconName: 'Sparkles',
    description: 'Phòng đang được dọn dẹp',
  },
  MAINTENANCE: {
    label: 'Bảo trì',
    variant: 'secondary',
    className: 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-100',
    iconName: 'Wrench',
    description: 'Phòng đang bảo trì',
  },
  LOCKED: {
    label: 'Khoá phòng',
    variant: 'destructive',
    className: 'bg-rose-100 text-rose-700 border-rose-200 hover:bg-rose-100',
    iconName: 'XCircle',
    description: 'Phòng bị khoá',
  },
};

export const ROOM_STATUS_OPTIONS = Object.entries(ROOM_STATUS_CONFIG).map(([value, config]) => ({
  value: value as RoomStatus,
  label: config.label,
  description: config.description,
}));

export const FLOOR_OPTIONS = Array.from({ length: 50 }, (_, i) => ({
  value: (i + 1).toString(),
  label: `Tầng ${i + 1}`,
}));

// Default values for new room
export const DEFAULT_ROOM_VALUES = {
  roomNumber: '',
  floor: 1,
  status: 'READY' as RoomStatus,
  capacityAdults: 2,
  capacityChildren: 0,
  sizeM2: 25,
  branchId: '',
  roomTypeId: '',
};

// Validation rules
export const ROOM_VALIDATION = {
  roomNumber: {
    maxLength: 10,
    pattern: /^[A-Za-z0-9-]+$/,
    message: 'Số phòng chỉ chứa chữ cái, số và dấu gạch ngang',
  },
  floor: {
    min: -5,
    max: 200,
  },
  capacityAdults: {
    min: 1,
    max: 20,
  },
  capacityChildren: {
    min: 0,
    max: 10,
  },
  sizeM2: {
    min: 10,
    max: 1000,
  },
};
