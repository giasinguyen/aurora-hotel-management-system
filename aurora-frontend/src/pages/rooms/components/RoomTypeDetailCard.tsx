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
  DollarSign,
  Image as ImageIcon,
  Bed,
  Ban,
  FileText
} from 'lucide-react';
import fallbackImage from '@/assets/images/commons/fallback.png';

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
      <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
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
        <div className="bg-gradient-to-r from-primary via-primary/90 to-primary/80 p-6 text-white">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              {roomType.imageUrl ? (
                <img
                  src={roomType.imageUrl}
                  alt={roomType.name}
                  className="w-20 h-20 object-cover rounded-2xl border-4 border-white/20"
                  onError={(e) => { e.currentTarget.src = fallbackImage; }}
                />
              ) : (
                <div className="p-4 rounded-2xl bg-white/20 backdrop-blur-sm">
                  <DoorOpen className="h-8 w-8" />
                </div>
              )}
              <div>
                <h2 className="text-3xl font-bold tracking-tight">
                  {roomType.name}
                </h2>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <Badge variant="secondary" className="bg-white/20 text-white border-0 font-mono">
                    {roomType.code}
                  </Badge>
                  <span className="text-white/80">•</span>
                  <span className="text-white/80">{roomType.branchName}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{formatCurrency(roomType.priceFrom)}</div>
              <div className="text-white/80 text-sm">/đêm (giá cơ bản)</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Room Type Image */}
      {roomType.imageUrl && (
        <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-slate-50 p-4">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-primary/10 text-primary">
                <ImageIcon className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-lg">Ảnh đại diện</CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="w-full aspect-video rounded-lg overflow-hidden border">
              <img
                src={roomType.imageUrl}
                alt={roomType.name}
                className="w-full h-full object-cover"
                onError={(e) => { e.currentTarget.src = fallbackImage; }}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Information Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Pricing Info */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-slate-50">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
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
                <span className="text-lg font-semibold text-primary">
                  {formatCurrency(roomType.priceFrom)}
                </span>
              }
            />
          </CardContent>
        </Card>

        {/* Basic Info */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-slate-50">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
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
                <span className="font-mono text-primary font-bold">
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
                  <div className="flex items-center gap-2 text-primary">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Cho phép hoàn tiền</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-destructive">
                    <XCircle className="h-4 w-4" />
                    <span>Không hoàn tiền</span>
                  </div>
                )
              }
            />
            <Separator />
            <InfoItem
              icon={<Ban className="h-4 w-4" />}
              label="Hút thuốc"
              value={
                roomType.smokingAllowed ? (
                  <div className="flex items-center gap-2 text-primary">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Cho phép hút thuốc</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-destructive">
                    <XCircle className="h-4 w-4" />
                    <span>Không cho phép hút thuốc</span>
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
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
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
                <span className="text-lg font-semibold text-primary">
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
                <span className="text-lg font-semibold text-primary">
                  {roomType.maxOccupancy} người
                </span>
              }
            />
            {roomType.bedType && (
              <>
                <Separator />
                <InfoItem
                  icon={<Bed className="h-4 w-4" />}
                  label="Loại giường"
                  value={roomType.bedType}
                />
              </>
            )}
            {roomType.numberOfBeds && (
              <>
                <Separator />
                <InfoItem
                  icon={<Bed className="h-4 w-4" />}
                  label="Số lượng giường"
                  value={`${roomType.numberOfBeds} giường`}
                />
              </>
            )}
            <Separator />
            <InfoItem
              icon={<DoorOpen className="h-4 w-4" />}
              label="Số phòng"
              value={
                <div className="flex items-center gap-2">
                  <span className="text-lg font-semibold text-primary">
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

      {/* Description */}
      {(roomType.description || roomType.shortDescription) && (
        <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-slate-50">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <FileText className="h-4 w-4" />
              </div>
              Mô tả
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {roomType.shortDescription && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">Mô tả ngắn</p>
                <p className="text-foreground">{roomType.shortDescription}</p>
              </div>
            )}
            {roomType.description && (
              <>
                {roomType.shortDescription && <Separator />}
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Mô tả chi tiết</p>
                  <p className="text-foreground leading-relaxed">{roomType.description}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card className="border-0 shadow-md bg-gradient-to-br from-primary/5 to-primary/10 hover:shadow-lg transition-shadow">
          <CardContent className="p-4 text-center">
            <div className="mx-auto mb-2 p-3 rounded-full bg-primary text-white w-fit">
              <DollarSign className="h-5 w-5" />
            </div>
            <p className="text-lg font-bold text-primary">{formatCurrency(roomType.priceFrom)}</p>
            <p className="text-sm text-primary/70">Giá/đêm</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-gradient-to-br from-primary/5 to-primary/10 hover:shadow-lg transition-shadow">
          <CardContent className="p-4 text-center">
            <div className="mx-auto mb-2 p-3 rounded-full bg-primary text-white w-fit">
              <Users className="h-5 w-5" />
            </div>
            <p className="text-2xl font-bold text-primary">{roomType.maxOccupancy}</p>
            <p className="text-sm text-primary/70">Sức chứa tối đa</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-gradient-to-br from-primary/5 to-primary/10 hover:shadow-lg transition-shadow">
          <CardContent className="p-4 text-center">
            <div className="mx-auto mb-2 p-3 rounded-full bg-primary text-white w-fit">
              <Maximize className="h-5 w-5" />
            </div>
            <p className="text-2xl font-bold text-primary">{roomType.sizeM2}</p>
            <p className="text-sm text-primary/70">m² diện tích</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-gradient-to-br from-primary/5 to-primary/10 hover:shadow-lg transition-shadow">
          <CardContent className="p-4 text-center">
            <div className="mx-auto mb-2 p-3 rounded-full bg-primary text-white w-fit">
              <DoorOpen className="h-5 w-5" />
            </div>
            <p className="text-2xl font-bold text-primary">{roomType.totalRooms}</p>
            <p className="text-sm text-primary/70">Tổng phòng</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-gradient-to-br from-primary/5 to-primary/10 hover:shadow-lg transition-shadow">
          <CardContent className="p-4 text-center">
            <div className="mx-auto mb-2 p-3 rounded-full bg-primary text-white w-fit">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <p className="text-2xl font-bold text-primary">{roomType.availableRooms}</p>
            <p className="text-sm text-primary/70">Phòng trống</p>
          </CardContent>
        </Card>
      </div>

      {/* Amenities */}
      {roomType.amenities && roomType.amenities.length > 0 && (
        <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-slate-50">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
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
                  className="px-3 py-1.5 text-sm bg-primary/10 text-primary border border-primary/20"
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
