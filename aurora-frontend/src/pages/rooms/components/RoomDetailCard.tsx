// ============================================
// Room Detail Card Component - Aurora Hotel Management
// ============================================

import { 
  Building2, 
  DoorOpen, 
  Users, 
  Maximize, 
  Layers,
  CalendarDays,
  Hash,
  Info
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { Room } from '@/types/room.types';
import RoomStatusBadge from './RoomStatusBadge';

// ============================================
// Props Interface
// ============================================

interface RoomDetailCardProps {
  room: Room;
  onStatusChange?: (newStatus: string) => void;
}

// ============================================
// Info Item Component
// ============================================

interface InfoItemProps {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  className?: string;
}

function InfoItem({ icon, label, value, className = '' }: InfoItemProps) {
  return (
    <div className={`flex items-start gap-3 ${className}`}>
      <div className="p-2 rounded-lg bg-slate-100 text-slate-600 shrink-0">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="font-medium text-foreground truncate">{value}</p>
      </div>
    </div>
  );
}

// ============================================
// Component
// ============================================

export default function RoomDetailCard({ room }: RoomDetailCardProps) {
  return (
    <div className="space-y-6">
      {/* Room Header Card */}
      <Card className="border-0 shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-4 rounded-2xl bg-white/20 backdrop-blur-sm">
                <DoorOpen className="h-8 w-8" />
              </div>
              <div>
                <h2 className="text-3xl font-bold tracking-tight">
                  Phòng {room.roomNumber}
                </h2>
                <p className="text-blue-100 mt-1">
                  {room.roomTypeName} • {room.branchName}
                </p>
              </div>
            </div>
            <RoomStatusBadge status={room.status} size="lg" />
          </div>
        </div>
      </Card>

      {/* Room Information Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Location Info */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-slate-50">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                <Building2 className="h-4 w-4" />
              </div>
              Thông tin vị trí
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <InfoItem
              icon={<Building2 className="h-4 w-4" />}
              label="Chi nhánh"
              value={room.branchName}
            />
            <Separator />
            <InfoItem
              icon={<DoorOpen className="h-4 w-4" />}
              label="Loại phòng"
              value={room.roomTypeName}
            />
            <Separator />
            <InfoItem
              icon={<Layers className="h-4 w-4" />}
              label="Tầng"
              value={`Tầng ${room.floor}`}
            />
            <Separator />
            <InfoItem
              icon={<Hash className="h-4 w-4" />}
              label="Số phòng"
              value={
                <span className="font-mono text-lg font-bold text-blue-600">
                  {room.roomNumber}
                </span>
              }
            />
          </CardContent>
        </Card>

        {/* Room Specifications */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-slate-50">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <div className="p-2 rounded-lg bg-emerald-100 text-emerald-600">
                <Info className="h-4 w-4" />
              </div>
              Thông số phòng
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <InfoItem
              icon={<Maximize className="h-4 w-4" />}
              label="Diện tích"
              value={
                <span className="text-lg font-semibold text-emerald-600">
                  {room.sizeM2} m²
                </span>
              }
            />
            <Separator />
            <InfoItem
              icon={<Users className="h-4 w-4" />}
              label="Sức chứa người lớn"
              value={`${room.capacityAdults} người`}
            />
            <Separator />
            <InfoItem
              icon={<Users className="h-4 w-4" />}
              label="Sức chứa trẻ em"
              value={`${room.capacityChildren} trẻ em`}
            />
            <Separator />
            <InfoItem
              icon={<CalendarDays className="h-4 w-4" />}
              label="Trạng thái"
              value={<RoomStatusBadge status={room.status} size="md" />}
            />
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-0 shadow-md bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-lg transition-shadow">
          <CardContent className="p-4 text-center">
            <div className="mx-auto mb-2 p-3 rounded-full bg-blue-500 text-white w-fit">
              <DoorOpen className="h-5 w-5" />
            </div>
            <p className="text-2xl font-bold text-blue-700">{room.roomNumber}</p>
            <p className="text-sm text-blue-600">Số phòng</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-gradient-to-br from-emerald-50 to-emerald-100 hover:shadow-lg transition-shadow">
          <CardContent className="p-4 text-center">
            <div className="mx-auto mb-2 p-3 rounded-full bg-emerald-500 text-white w-fit">
              <Layers className="h-5 w-5" />
            </div>
            <p className="text-2xl font-bold text-emerald-700">{room.floor}</p>
            <p className="text-sm text-emerald-600">Tầng</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-gradient-to-br from-purple-50 to-purple-100 hover:shadow-lg transition-shadow">
          <CardContent className="p-4 text-center">
            <div className="mx-auto mb-2 p-3 rounded-full bg-purple-500 text-white w-fit">
              <Users className="h-5 w-5" />
            </div>
            <p className="text-2xl font-bold text-purple-700">
              {room.capacityAdults + room.capacityChildren}
            </p>
            <p className="text-sm text-purple-600">Tổng sức chứa</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-gradient-to-br from-amber-50 to-amber-100 hover:shadow-lg transition-shadow">
          <CardContent className="p-4 text-center">
            <div className="mx-auto mb-2 p-3 rounded-full bg-amber-500 text-white w-fit">
              <Maximize className="h-5 w-5" />
            </div>
            <p className="text-2xl font-bold text-amber-700">{room.sizeM2}</p>
            <p className="text-sm text-amber-600">m² diện tích</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
