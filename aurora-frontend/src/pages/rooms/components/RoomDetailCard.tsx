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
  Info,
  DollarSign,
  Percent,
  Eye,
  Tag,
  Image as ImageIcon
} from 'lucide-react';
import fallbackImage from '@/assets/images/commons/fallback.png';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import type { Room } from '@/types/room.types';
import RoomStatusBadge from './RoomStatusBadge';

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
      <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
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
  const getViewTypeLabel = (viewType?: string) => {
    const viewMap: Record<string, string> = {
      'CITY': 'Thành phố',
      'SEA': 'Biển/Sông',
      'MOUNTAIN': 'Núi',
      'GARDEN': 'Vườn',
      'RIVER': 'Sông'
    };
    return viewType ? (viewMap[viewType] || viewType) : 'Chưa xác định';
  };

  return (
    <div className="space-y-6">
      {/* Room Header Card */}
      <Card className="border-0 shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-primary via-primary/90 to-primary/80 p-6 text-white">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="p-4 rounded-2xl bg-white/20 backdrop-blur-sm">
                <DoorOpen className="h-8 w-8" />
              </div>
              <div>
                <h2 className="text-3xl font-bold tracking-tight">
                  Phòng {room.roomNumber}
                </h2>
                <p className="text-white/80 mt-1">
                  {room.roomTypeName} • {room.branchName}
                </p>
                {room.categoryName && (
                  <p className="text-white/70 text-sm mt-1">
                    {room.categoryName}
                  </p>
                )}
              </div>
            </div>
            <RoomStatusBadge status={room.status} size="lg" />
          </div>
        </div>
      </Card>

      {/* Room Images */}
      {room.images && room.images.length > 0 && (
        <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-slate-50 p-4">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-primary/10 text-primary">
                <ImageIcon className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-lg">Hình ảnh phòng</CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Carousel className="w-full">
              <CarouselContent>
                {room.images.map((image, index) => (
                  <CarouselItem key={index}>
                    <div className="p-1">
                      <div className="w-full min-h-[500px] h-[600px] rounded-lg overflow-hidden">
                        <img 
                          src={image} 
                          alt={`Room Image ${index + 1}`} 
                          className="w-full h-full object-cover"
                          onError={(e) => { e.currentTarget.src = fallbackImage; }}
                        />
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </CardContent>
        </Card>
      )}

      {/* Room Information Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Location Info */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-slate-50">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
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
            {room.categoryName && (
              <>
                <Separator />
                <InfoItem
                  icon={<Tag className="h-4 w-4" />}
                  label="Hạng phòng"
                  value={room.categoryName}
                />
              </>
            )}
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
                <span className="font-mono text-lg font-bold text-primary">
                  {room.roomNumber}
                </span>
              }
            />
            {room.viewType && (
              <>
                <Separator />
                <InfoItem
                  icon={<Eye className="h-4 w-4" />}
                  label="Hướng view"
                  value={
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                      {getViewTypeLabel(room.viewType)}
                    </Badge>
                  }
                />
              </>
            )}
          </CardContent>
        </Card>

        {/* Room Specifications */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-slate-50">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
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
                <span className="text-lg font-semibold text-primary">
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
              label="Giá gốc"
              value={
                <span className="text-lg font-semibold text-primary">
                  {formatCurrency(room.basePrice)}
                </span>
              }
            />
            <Separator />
            <InfoItem
              icon={<Percent className="h-4 w-4" />}
              label="% Giảm giá"
              value={
                room.salePercent > 0 ? (
                  <span className="text-lg font-semibold text-primary">
                    {room.salePercent}%
                  </span>
                ) : (
                  <span className="text-muted-foreground">Không có</span>
                )
              }
            />
            <Separator />
            <InfoItem
              icon={<DollarSign className="h-4 w-4" />}
              label="Giá hiển thị"
              value={
                <span className="text-xl font-bold text-primary">
                  {formatCurrency(room.displayPrice)}
                </span>
              }
            />
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4 lg:grid-cols-6">
        <Card className="border-0 shadow-md bg-gradient-to-br from-primary/5 to-primary/10 hover:shadow-lg transition-shadow">
          <CardContent className="p-4 text-center">
            <div className="mx-auto mb-2 p-3 rounded-full bg-primary text-white w-fit">
              <Hash className="h-5 w-5" />
            </div>
            <p className="text-xl font-bold text-primary">{room.roomNumber}</p>
            <p className="text-sm text-primary/70">Số phòng</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-gradient-to-br from-primary/5 to-primary/10 hover:shadow-lg transition-shadow">
          <CardContent className="p-4 text-center">
            <div className="mx-auto mb-2 p-3 rounded-full bg-primary text-white w-fit">
              <Layers className="h-5 w-5" />
            </div>
            <p className="text-2xl font-bold text-primary">{room.floor}</p>
            <p className="text-sm text-primary/70">Tầng</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-gradient-to-br from-primary/5 to-primary/10 hover:shadow-lg transition-shadow">
          <CardContent className="p-4 text-center">
            <div className="mx-auto mb-2 p-3 rounded-full bg-primary text-white w-fit">
              <Users className="h-5 w-5" />
            </div>
            <p className="text-2xl font-bold text-primary">
              {room.capacityAdults + room.capacityChildren}
            </p>
            <p className="text-sm text-primary/70">Tổng sức chứa</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-gradient-to-br from-primary/5 to-primary/10 hover:shadow-lg transition-shadow">
          <CardContent className="p-4 text-center">
            <div className="mx-auto mb-2 p-3 rounded-full bg-primary text-white w-fit">
              <Maximize className="h-5 w-5" />
            </div>
            <p className="text-2xl font-bold text-primary">{room.sizeM2}</p>
            <p className="text-sm text-primary/70">m² diện tích</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-gradient-to-br from-primary/5 to-primary/10 hover:shadow-lg transition-shadow">
          <CardContent className="p-4 text-center">
            <div className="mx-auto mb-2 p-3 rounded-full bg-primary text-white w-fit">
              <DollarSign className="h-5 w-5" />
            </div>
            <p className="text-lg font-bold text-primary">{formatCurrency(room.displayPrice)}</p>
            <p className="text-sm text-primary/70">Giá/đêm</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-gradient-to-br from-primary/5 to-primary/10 hover:shadow-lg transition-shadow">
          <CardContent className="p-4 text-center">
            <div className="mx-auto mb-2 p-3 rounded-full bg-primary text-white w-fit">
              <Percent className="h-5 w-5" />
            </div>
            <p className="text-2xl font-bold text-primary">{room.salePercent}%</p>
            <p className="text-sm text-primary/70">Giảm giá</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
