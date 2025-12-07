// ============================================
// Service Detail Card Component - Aurora Hotel Management
// ============================================

import { 
  Building2, 
  Tag,
  FileText,
  DollarSign,
  Sparkles,
  ArrowLeft,
  Edit,
  Clock,
  Users,
  Calendar,
  CheckCircle2,
  XCircle,
  Image as ImageIcon
} from 'lucide-react';
import fallbackImage from '@/assets/images/commons/fallback.png';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import type { HotelService } from '@/types/service.types';

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

interface ServiceDetailCardProps {
  service: HotelService;
  onEdit?: () => void;
  onBack?: () => void;
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

export default function ServiceDetailCard({ service, onEdit, onBack }: ServiceDetailCardProps) {
  return (
    <div className="space-y-6">
      {/* Action Buttons */}
      {(onBack || onEdit) && (
        <div className="flex items-center justify-between">
          {onBack && (
            <Button variant="ghost" onClick={onBack} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Quay lại
            </Button>
          )}
          {onEdit && (
            <Button onClick={onEdit} className="gap-2 bg-primary hover:bg-primary/90">
              <Edit className="h-4 w-4" />
              Chỉnh sửa
            </Button>
          )}
        </div>
      )}

      {/* Header Card */}
      <Card className="border-0 shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-primary via-primary/90 to-primary/80 p-6 text-white">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="p-4 rounded-2xl bg-white/20 backdrop-blur-sm">
                <Sparkles className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-3xl font-bold tracking-tight">
                  {service.name}
                </h2>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <Badge variant="secondary" className="bg-white/20 text-white border-0">
                    {service.categoryName || 'Chưa phân loại'}
                  </Badge>
                  <span className="text-white/80">•</span>
                  <span className="text-white/80">{service.branchName}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{formatCurrency(service.basePrice)}</div>
              <div className="text-white/80 text-sm">
                {service.unit ? `/${service.unit}` : 'Giá dịch vụ'}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Service Images */}
      {service.images && service.images.length > 0 && (
        <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-slate-50 p-4">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-primary/10 text-primary">
                <ImageIcon className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-lg">Hình ảnh dịch vụ</CardTitle>
                <p className="text-sm text-muted-foreground">Các hình ảnh của dịch vụ</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Carousel className="w-full">
              <CarouselContent>
                {service.images.map((image, index) => (
                  <CarouselItem key={index}>
                    <div className="p-1">
                      <div className="w-full min-h-[500px] h-[600px] rounded-lg overflow-hidden">
                        <img 
                          src={image} 
                          alt={`Service Image ${index + 1}`} 
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

      {/* Information Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Basic Info */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-slate-50">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <Tag className="h-4 w-4" />
              </div>
              Thông tin dịch vụ
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <InfoItem
              icon={<Tag className="h-4 w-4" />}
              label="Tên dịch vụ"
              value={service.name}
            />
            <Separator />
            <InfoItem
              icon={<Sparkles className="h-4 w-4" />}
              label="Danh mục dịch vụ"
              value={
                <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                  {service.categoryName || 'Chưa phân loại'}
                </Badge>
              }
            />
            <Separator />
            <InfoItem
              icon={<Building2 className="h-4 w-4" />}
              label="Chi nhánh"
              value={service.branchName}
            />
            <Separator />
            <InfoItem
              icon={<CheckCircle2 className="h-4 w-4" />}
              label="Trạng thái hoạt động"
              value={
                service.active !== false ? (
                  <div className="flex items-center gap-2 text-primary">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Đang hoạt động</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-destructive">
                    <XCircle className="h-4 w-4" />
                    <span>Ngừng hoạt động</span>
                  </div>
                )
              }
            />
            <Separator />
            <InfoItem
              icon={<Calendar className="h-4 w-4" />}
              label="Yêu cầu đặt trước"
              value={
                service.requiresBooking !== false ? (
                  <div className="flex items-center gap-2 text-primary">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Cần đặt trước</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <XCircle className="h-4 w-4" />
                    <span>Không cần đặt trước</span>
                  </div>
                )
              }
            />
          </CardContent>
        </Card>

        {/* Pricing & Details */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-slate-50">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <DollarSign className="h-4 w-4" />
              </div>
              Giá & Chi tiết
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <InfoItem
              icon={<DollarSign className="h-4 w-4" />}
              label="Giá dịch vụ"
              value={
                <span className="text-2xl font-bold text-primary">
                  {formatCurrency(service.basePrice)}
                </span>
              }
            />
            {service.unit && (
              <>
                <Separator />
                <InfoItem
                  icon={<Tag className="h-4 w-4" />}
                  label="Đơn vị tính"
                  value={service.unit}
                />
              </>
            )}
            {service.durationMinutes && (
              <>
                <Separator />
                <InfoItem
                  icon={<Clock className="h-4 w-4" />}
                  label="Thời lượng"
                  value={
                    <span className="text-primary font-semibold">
                      {service.durationMinutes} phút
                    </span>
                  }
                />
              </>
            )}
            {service.maxCapacityPerSlot && (
              <>
                <Separator />
                <InfoItem
                  icon={<Users className="h-4 w-4" />}
                  label="Sức chứa tối đa"
                  value={
                    <span className="text-primary font-semibold">
                      {service.maxCapacityPerSlot} người/slot
                    </span>
                  }
                />
              </>
            )}
            {service.operatingHours && (
              <>
                <Separator />
                <InfoItem
                  icon={<Calendar className="h-4 w-4" />}
                  label="Giờ hoạt động"
                  value={service.operatingHours}
                />
              </>
            )}
          </CardContent>
        </Card>

        {/* Description */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-slate-50">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <FileText className="h-4 w-4" />
              </div>
              Mô tả
            </CardTitle>
          </CardHeader>
          <CardContent>
            {service.description ? (
              <p className="text-foreground leading-relaxed">{service.description}</p>
            ) : (
              <p className="text-muted-foreground italic">Chưa có mô tả</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4 lg:grid-cols-6">
        <Card className="border-0 shadow-md bg-gradient-to-br from-primary/5 to-primary/10 hover:shadow-lg transition-shadow">
          <CardContent className="p-4 text-center">
            <div className="mx-auto mb-2 p-3 rounded-full bg-primary text-white w-fit">
              <Sparkles className="h-5 w-5" />
            </div>
            <p className="text-sm font-bold text-primary line-clamp-2">{service.categoryName || 'Chưa phân loại'}</p>
            <p className="text-xs text-primary/70 mt-1">Danh mục</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-gradient-to-br from-primary/5 to-primary/10 hover:shadow-lg transition-shadow">
          <CardContent className="p-4 text-center">
            <div className="mx-auto mb-2 p-3 rounded-full bg-primary text-white w-fit">
              <DollarSign className="h-5 w-5" />
            </div>
            <p className="text-sm font-bold text-primary">{formatCurrency(service.basePrice)}</p>
            <p className="text-xs text-primary/70 mt-1">Giá dịch vụ</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-gradient-to-br from-primary/5 to-primary/10 hover:shadow-lg transition-shadow">
          <CardContent className="p-4 text-center">
            <div className="mx-auto mb-2 p-3 rounded-full bg-primary text-white w-fit">
              <Building2 className="h-5 w-5" />
            </div>
            <p className="text-sm font-bold text-primary line-clamp-2">{service.branchName}</p>
            <p className="text-xs text-primary/70 mt-1">Chi nhánh</p>
          </CardContent>
        </Card>

        {service.durationMinutes && (
          <Card className="border-0 shadow-md bg-gradient-to-br from-primary/5 to-primary/10 hover:shadow-lg transition-shadow">
            <CardContent className="p-4 text-center">
              <div className="mx-auto mb-2 p-3 rounded-full bg-primary text-white w-fit">
                <Clock className="h-5 w-5" />
              </div>
              <p className="text-2xl font-bold text-primary">{service.durationMinutes}</p>
              <p className="text-xs text-primary/70">Phút</p>
            </CardContent>
          </Card>
        )}

        {service.maxCapacityPerSlot && (
          <Card className="border-0 shadow-md bg-gradient-to-br from-primary/5 to-primary/10 hover:shadow-lg transition-shadow">
            <CardContent className="p-4 text-center">
              <div className="mx-auto mb-2 p-3 rounded-full bg-primary text-white w-fit">
                <Users className="h-5 w-5" />
              </div>
              <p className="text-2xl font-bold text-primary">{service.maxCapacityPerSlot}</p>
              <p className="text-xs text-primary/70">Người/slot</p>
            </CardContent>
          </Card>
        )}

        <Card className="border-0 shadow-md bg-gradient-to-br from-primary/5 to-primary/10 hover:shadow-lg transition-shadow">
          <CardContent className="p-4 text-center">
            <div className="mx-auto mb-2 p-3 rounded-full bg-primary text-white w-fit">
              {service.active !== false ? (
                <CheckCircle2 className="h-5 w-5" />
              ) : (
                <XCircle className="h-5 w-5" />
              )}
            </div>
            <p className="text-sm font-bold text-primary">
              {service.active !== false ? 'Hoạt động' : 'Ngừng'}
            </p>
            <p className="text-xs text-primary/70">Trạng thái</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
