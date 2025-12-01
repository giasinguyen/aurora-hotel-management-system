// ============================================
// Room Type Detail Card Component - Aurora Hotel Management
// ============================================

import { 
  Building2, 
  DoorOpen, 
  Users, 
  Maximize, 
  Tag,
  Code,
  RefreshCcw,
  Sparkles,
  CheckCircle2,
  XCircle,
  DollarSign
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import type { RoomType } from '@/types/room.types';

// ============================================
// Helper Functions
// ============================================

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount);
}

// ============================================
// Props Interface
// ============================================

interface RoomTypeDetailCardProps {
  roomType: RoomType;
}

// ============================================
// Info Item Component
// ============================================

interface InfoItemProps {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}

function InfoItem({ icon, label, value }: InfoItemProps) {
  return (
    <div className="flex items-start gap-3">
      <div className="p-2 rounded-lg bg-slate-100 text-slate-600 shrink-0">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="font-medium text-foreground">{value}</p>
      </div>
    </div>
  );
}

// ============================================
// Component
// ============================================

export default function RoomTypeDetailCard({ roomType }: RoomTypeDetailCardProps) {
  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card className="border-0 shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-700 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-4 rounded-2xl bg-white/20 backdrop-blur-sm">
                <DoorOpen className="h-8 w-8" />
              </div>
              <div>
                <h2 className="text-3xl font-bold tracking-tight">
                  {roomType.name}
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="bg-white/20 text-white border-0 font-mono">
                    {roomType.code}
                  </Badge>
                  <span className="text-emerald-100">•</span>
                  <span className="text-emerald-100">{roomType.branchName}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{formatCurrency(roomType.basePrice)}</div>
              <div className="text-emerald-100 text-sm">/đêm (giá cơ bản)</div>
              {roomType.weekendPrice && roomType.weekendPrice > 0 && (
                <div className="text-sm text-emerald-200 mt-1">
                  Cuối tuần: {formatCurrency(roomType.weekendPrice)}
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Information Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Pricing Info */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-slate-50">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <div className="p-2 rounded-lg bg-green-100 text-green-600">
                <DollarSign className="h-4 w-4" />
              </div>
              Thông tin giá
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <InfoItem
              icon={<DollarSign className="h-4 w-4" />}
              label="Giá cơ bản"
              value={
                <span className="text-lg font-semibold text-green-600">
                  {formatCurrency(roomType.basePrice)}
                </span>
              }
            />
            <Separator />
            <InfoItem
              icon={<DollarSign className="h-4 w-4" />}
              label="Giá cuối tuần"
              value={
                roomType.weekendPrice && roomType.weekendPrice > 0 ? (
                  <span className="text-lg font-semibold text-amber-600">
                    {formatCurrency(roomType.weekendPrice)}
                  </span>
                ) : (
                  <span className="text-muted-foreground">Dùng giá cơ bản</span>
                )
              }
            />
          </CardContent>
        </Card>

        {/* Basic Info */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-slate-50">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                <Tag className="h-4 w-4" />
              </div>
              Thông tin cơ bản
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <InfoItem
              icon={<DoorOpen className="h-4 w-4" />}
              label="Tên loại phòng"
              value={roomType.name}
            />
            <Separator />
            <InfoItem
              icon={<Code className="h-4 w-4" />}
              label="Mã loại phòng"
              value={
                <span className="font-mono text-blue-600 font-bold">
                  {roomType.code}
                </span>
              }
            />
            <Separator />
            <InfoItem
              icon={<Building2 className="h-4 w-4" />}
              label="Chi nhánh"
              value={roomType.branchName}
            />
            <Separator />
            <InfoItem
              icon={<RefreshCcw className="h-4 w-4" />}
              label="Hoàn tiền"
              value={
                roomType.refundable ? (
                  <div className="flex items-center gap-2 text-emerald-600">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Cho phép hoàn tiền</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-rose-600">
                    <XCircle className="h-4 w-4" />
                    <span>Không hoàn tiền</span>
                  </div>
                )
              }
            />
          </CardContent>
        </Card>

        {/* Specifications */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-slate-50">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <div className="p-2 rounded-lg bg-purple-100 text-purple-600">
                <Users className="h-4 w-4" />
              </div>
              Thông số kỹ thuật
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <InfoItem
              icon={<Maximize className="h-4 w-4" />}
              label="Diện tích"
              value={
                <span className="text-lg font-semibold text-purple-600">
                  {roomType.sizeM2} m²
                </span>
              }
            />
            <Separator />
            <InfoItem
              icon={<Users className="h-4 w-4" />}
              label="Sức chứa người lớn"
              value={`${roomType.capacityAdults} người`}
            />
            <Separator />
            <InfoItem
              icon={<Users className="h-4 w-4" />}
              label="Sức chứa trẻ em"
              value={`${roomType.capacityChildren} trẻ em`}
            />
            <Separator />
            <InfoItem
              icon={<Users className="h-4 w-4" />}
              label="Sức chứa tối đa"
              value={
                <span className="text-lg font-semibold text-indigo-600">
                  {roomType.maxOccupancy} người
                </span>
              }
            />
            <Separator />
            <InfoItem
              icon={<DoorOpen className="h-4 w-4" />}
              label="Số phòng"
              value={
                <div className="flex items-center gap-2">
                  <span className="text-lg font-semibold text-emerald-600">
                    {roomType.availableRooms}
                  </span>
                  <span className="text-muted-foreground">
                    / {roomType.totalRooms} phòng trống
                  </span>
                </div>
              }
            />
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card className="border-0 shadow-md bg-gradient-to-br from-green-50 to-green-100 hover:shadow-lg transition-shadow">
          <CardContent className="p-4 text-center">
            <div className="mx-auto mb-2 p-3 rounded-full bg-green-500 text-white w-fit">
              <DollarSign className="h-5 w-5" />
            </div>
            <p className="text-lg font-bold text-green-700">{formatCurrency(roomType.basePrice)}</p>
            <p className="text-sm text-green-600">Giá/đêm</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-lg transition-shadow">
          <CardContent className="p-4 text-center">
            <div className="mx-auto mb-2 p-3 rounded-full bg-blue-500 text-white w-fit">
              <Users className="h-5 w-5" />
            </div>
            <p className="text-2xl font-bold text-blue-700">{roomType.maxOccupancy}</p>
            <p className="text-sm text-blue-600">Sức chứa tối đa</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-gradient-to-br from-purple-50 to-purple-100 hover:shadow-lg transition-shadow">
          <CardContent className="p-4 text-center">
            <div className="mx-auto mb-2 p-3 rounded-full bg-purple-500 text-white w-fit">
              <Maximize className="h-5 w-5" />
            </div>
            <p className="text-2xl font-bold text-purple-700">{roomType.sizeM2}</p>
            <p className="text-sm text-purple-600">m² diện tích</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-gradient-to-br from-emerald-50 to-emerald-100 hover:shadow-lg transition-shadow">
          <CardContent className="p-4 text-center">
            <div className="mx-auto mb-2 p-3 rounded-full bg-emerald-500 text-white w-fit">
              <DoorOpen className="h-5 w-5" />
            </div>
            <p className="text-2xl font-bold text-emerald-700">{roomType.totalRooms}</p>
            <p className="text-sm text-emerald-600">Tổng phòng</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-gradient-to-br from-amber-50 to-amber-100 hover:shadow-lg transition-shadow">
          <CardContent className="p-4 text-center">
            <div className="mx-auto mb-2 p-3 rounded-full bg-amber-500 text-white w-fit">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <p className="text-2xl font-bold text-amber-700">{roomType.availableRooms}</p>
            <p className="text-sm text-amber-600">Phòng trống</p>
          </CardContent>
        </Card>
      </div>

      {/* Amenities */}
      {roomType.amenities && roomType.amenities.length > 0 && (
        <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-slate-50">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <div className="p-2 rounded-lg bg-indigo-100 text-indigo-600">
                <Sparkles className="h-4 w-4" />
              </div>
              Tiện nghi ({roomType.amenities.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {roomType.amenities.map((amenity) => (
                <Badge
                  key={amenity.id}
                  variant="secondary"
                  className="px-3 py-1.5 text-sm bg-indigo-50 text-indigo-700 border border-indigo-200"
                >
                  <span className="mr-1.5">{amenity.icon || '✓'}</span>
                  {amenity.name}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
