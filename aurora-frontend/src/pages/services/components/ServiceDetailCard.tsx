// ============================================
// Service Detail Card Component - Aurora Hotel Management
// ============================================

import { 
  Building2, 
  Tag,
  FileText,
  DollarSign,
  Sparkles,
  Utensils,
  Car,
  Dumbbell,
  Waves,
  Shirt,
  Map,
  Package,
  ArrowLeft,
  Edit
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import type { HotelService, ServiceType } from '@/types/service.types';

// ============================================
// Helper Functions
// ============================================

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount);
}

const getServiceTypeIcon = (type: ServiceType) => {
  const icons: Record<ServiceType, React.ReactNode> = {
    SPA: <Sparkles className="h-6 w-6" />,
    RESTAURANT: <Utensils className="h-6 w-6" />,
    LAUNDRY: <Shirt className="h-6 w-6" />,
    TRANSPORT: <Car className="h-6 w-6" />,
    TOUR: <Map className="h-6 w-6" />,
    GYM: <Dumbbell className="h-6 w-6" />,
    POOL: <Waves className="h-6 w-6" />,
    OTHER: <Package className="h-6 w-6" />,
  };
  return icons[type] || <Package className="h-6 w-6" />;
};

const getServiceTypeLabel = (type: ServiceType): string => {
  const labels: Record<ServiceType, string> = {
    SPA: 'Spa & Massage',
    RESTAURANT: 'Nhà hàng',
    LAUNDRY: 'Giặt ủi',
    TRANSPORT: 'Vận chuyển',
    TOUR: 'Tour du lịch',
    GYM: 'Phòng gym',
    POOL: 'Hồ bơi',
    OTHER: 'Khác',
  };
  return labels[type] || 'Khác';
};

const getServiceTypeColor = (type: ServiceType): string => {
  const colors: Record<ServiceType, string> = {
    SPA: 'from-pink-500 to-rose-500',
    RESTAURANT: 'from-orange-500 to-amber-500',
    LAUNDRY: 'from-cyan-500 to-teal-500',
    TRANSPORT: 'from-blue-500 to-indigo-500',
    TOUR: 'from-green-500 to-emerald-500',
    GYM: 'from-red-500 to-rose-500',
    POOL: 'from-sky-500 to-blue-500',
    OTHER: 'from-gray-500 to-slate-500',
  };
  return colors[type] || 'from-gray-500 to-slate-500';
};

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
            <Button onClick={onEdit} className="gap-2 bg-gradient-to-r from-violet-600 to-purple-600">
              <Edit className="h-4 w-4" />
              Chỉnh sửa
            </Button>
          )}
        </div>
      )}

      {/* Header Card */}
      <Card className="border-0 shadow-lg overflow-hidden">
        <div className={`bg-gradient-to-r ${getServiceTypeColor(service.type)} p-6 text-white`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-4 rounded-2xl bg-white/20 backdrop-blur-sm">
                {getServiceTypeIcon(service.type)}
              </div>
              <div>
                <h2 className="text-3xl font-bold tracking-tight">
                  {service.name}
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="bg-white/20 text-white border-0">
                    {getServiceTypeLabel(service.type)}
                  </Badge>
                  <span className="text-white/80">•</span>
                  <span className="text-white/80">{service.branchName}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{formatCurrency(service.basePrice)}</div>
              <div className="text-white/80 text-sm">Giá dịch vụ</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Information Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Basic Info */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-slate-50">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
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
              label="Loại dịch vụ"
              value={
                <Badge variant="secondary" className="mt-1">
                  {getServiceTypeLabel(service.type)}
                </Badge>
              }
            />
            <Separator />
            <InfoItem
              icon={<Building2 className="h-4 w-4" />}
              label="Chi nhánh"
              value={service.branchName}
            />
          </CardContent>
        </Card>

        {/* Description & Price */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-slate-50">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <div className="p-2 rounded-lg bg-green-100 text-green-600">
                <DollarSign className="h-4 w-4" />
              </div>
              Giá & Mô tả
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <InfoItem
              icon={<DollarSign className="h-4 w-4" />}
              label="Giá dịch vụ"
              value={
                <span className="text-2xl font-bold text-green-600">
                  {formatCurrency(service.basePrice)}
                </span>
              }
            />
            <Separator />
            <InfoItem
              icon={<FileText className="h-4 w-4" />}
              label="Mô tả"
              value={
                service.description ? (
                  <p className="text-gray-600 leading-relaxed">{service.description}</p>
                ) : (
                  <p className="text-muted-foreground italic">Chưa có mô tả</p>
                )
              }
            />
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-0 shadow-md bg-gradient-to-br from-purple-50 to-purple-100 hover:shadow-lg transition-shadow">
          <CardContent className="p-4 text-center">
            <div className="mx-auto mb-2 p-3 rounded-full bg-purple-500 text-white w-fit">
              {getServiceTypeIcon(service.type)}
            </div>
            <p className="text-lg font-bold text-purple-700">{getServiceTypeLabel(service.type)}</p>
            <p className="text-sm text-purple-600">Loại dịch vụ</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-gradient-to-br from-green-50 to-green-100 hover:shadow-lg transition-shadow">
          <CardContent className="p-4 text-center">
            <div className="mx-auto mb-2 p-3 rounded-full bg-green-500 text-white w-fit">
              <DollarSign className="h-5 w-5" />
            </div>
            <p className="text-lg font-bold text-green-700">{formatCurrency(service.basePrice)}</p>
            <p className="text-sm text-green-600">Giá dịch vụ</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-lg transition-shadow">
          <CardContent className="p-4 text-center">
            <div className="mx-auto mb-2 p-3 rounded-full bg-blue-500 text-white w-fit">
              <Building2 className="h-5 w-5" />
            </div>
            <p className="text-lg font-bold text-blue-700">{service.branchName}</p>
            <p className="text-sm text-blue-600">Chi nhánh</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
