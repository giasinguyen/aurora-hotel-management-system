// ============================================
// Promotion Detail Card Component - Aurora Hotel Management
// ============================================

import { 
  Tag,
  FileText,
  Percent,
  Calendar,
  Code,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import type { Promotion } from '@/types/promotion.types';

// ============================================
// Helper Functions
// ============================================

type PromotionStatus = 'active' | 'scheduled' | 'expired' | 'inactive';

const getPromotionStatus = (promotion: Promotion): PromotionStatus => {
  if (!promotion.active) return 'inactive';
  
  const now = new Date();
  const start = new Date(promotion.startDate);
  const end = new Date(promotion.endDate);
  
  if (now < start) return 'scheduled';
  if (now > end) return 'expired';
  return 'active';
};

const statusConfig: Record<PromotionStatus, { 
  label: string; 
  icon: React.ReactNode; 
  bgColor: string; 
  textColor: string;
  borderColor: string;
}> = {
  active: { 
    label: 'Đang áp dụng', 
    icon: <CheckCircle2 className="h-5 w-5" />,
    bgColor: 'bg-green-50',
    textColor: 'text-green-700',
    borderColor: 'border-green-200'
  },
  scheduled: { 
    label: 'Sắp diễn ra', 
    icon: <Clock className="h-5 w-5" />,
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700',
    borderColor: 'border-blue-200'
  },
  expired: { 
    label: 'Đã hết hạn', 
    icon: <AlertCircle className="h-5 w-5" />,
    bgColor: 'bg-gray-50',
    textColor: 'text-gray-700',
    borderColor: 'border-gray-200'
  },
  inactive: { 
    label: 'Tạm dừng', 
    icon: <XCircle className="h-5 w-5" />,
    bgColor: 'bg-red-50',
    textColor: 'text-red-700',
    borderColor: 'border-red-200'
  },
};

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// ============================================
// Props Interface
// ============================================

interface PromotionDetailCardProps {
  promotion: Promotion;
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

export default function PromotionDetailCard({ promotion }: PromotionDetailCardProps) {
  const status = getPromotionStatus(promotion);
  const config = statusConfig[status];

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card className="border-0 shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-orange-500 via-orange-600 to-amber-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-4 rounded-2xl bg-white/20 backdrop-blur-sm">
                <Percent className="h-8 w-8" />
              </div>
              <div>
                <h2 className="text-3xl font-bold tracking-tight">
                  {promotion.name}
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="bg-white/20 text-white border-0 font-mono">
                    {promotion.code}
                  </Badge>
                  <span className="text-orange-100">•</span>
                  <span className="text-orange-100">Giảm {promotion.discount}%</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-5xl font-bold">{promotion.discount}%</div>
              <div className="text-orange-100 text-sm">Giảm giá</div>
            </div>
          </div>
        </div>

        {/* Status Banner */}
        <div className={`px-6 py-3 ${config.bgColor} ${config.borderColor} border-t flex items-center gap-2`}>
          <span className={config.textColor}>{config.icon}</span>
          <span className={`font-medium ${config.textColor}`}>{config.label}</span>
        </div>
      </Card>

      {/* Information Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Basic Info */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-slate-50">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <div className="p-2 rounded-lg bg-orange-100 text-orange-600">
                <Tag className="h-4 w-4" />
              </div>
              Thông tin khuyến mãi
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <InfoItem
              icon={<Tag className="h-4 w-4" />}
              label="Tên khuyến mãi"
              value={promotion.name}
            />
            <Separator />
            <InfoItem
              icon={<Code className="h-4 w-4" />}
              label="Mã khuyến mãi"
              value={
                <span className="font-mono text-orange-600 font-bold text-lg">
                  {promotion.code}
                </span>
              }
            />
            <Separator />
            <InfoItem
              icon={<Percent className="h-4 w-4" />}
              label="Mức giảm giá"
              value={
                <span className="text-2xl font-bold text-green-600">
                  {promotion.discount}%
                </span>
              }
            />
          </CardContent>
        </Card>

        {/* Time & Status */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-slate-50">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                <Calendar className="h-4 w-4" />
              </div>
              Thời gian & Trạng thái
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <InfoItem
              icon={<Calendar className="h-4 w-4" />}
              label="Ngày bắt đầu"
              value={formatDate(promotion.startDate)}
            />
            <Separator />
            <InfoItem
              icon={<Calendar className="h-4 w-4" />}
              label="Ngày kết thúc"
              value={formatDate(promotion.endDate)}
            />
            <Separator />
            <InfoItem
              icon={config.icon}
              label="Trạng thái"
              value={
                <Badge className={`${config.bgColor} ${config.textColor} border ${config.borderColor}`}>
                  {config.label}
                </Badge>
              }
            />
          </CardContent>
        </Card>
      </div>

      {/* Description */}
      {promotion.description && (
        <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-slate-50">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <div className="p-2 rounded-lg bg-purple-100 text-purple-600">
                <FileText className="h-4 w-4" />
              </div>
              Mô tả
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 leading-relaxed">{promotion.description}</p>
          </CardContent>
        </Card>
      )}

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-0 shadow-md bg-gradient-to-br from-orange-50 to-orange-100 hover:shadow-lg transition-shadow">
          <CardContent className="p-4 text-center">
            <div className="mx-auto mb-2 p-3 rounded-full bg-orange-500 text-white w-fit">
              <Code className="h-5 w-5" />
            </div>
            <p className="text-lg font-bold text-orange-700 font-mono">{promotion.code}</p>
            <p className="text-sm text-orange-600">Mã khuyến mãi</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-gradient-to-br from-green-50 to-green-100 hover:shadow-lg transition-shadow">
          <CardContent className="p-4 text-center">
            <div className="mx-auto mb-2 p-3 rounded-full bg-green-500 text-white w-fit">
              <Percent className="h-5 w-5" />
            </div>
            <p className="text-2xl font-bold text-green-700">{promotion.discount}%</p>
            <p className="text-sm text-green-600">Giảm giá</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-lg transition-shadow">
          <CardContent className="p-4 text-center">
            <div className="mx-auto mb-2 p-3 rounded-full bg-blue-500 text-white w-fit">
              <Calendar className="h-5 w-5" />
            </div>
            <p className="text-sm font-bold text-blue-700">{formatDate(promotion.startDate)}</p>
            <p className="text-sm text-blue-600">Bắt đầu</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-gradient-to-br from-purple-50 to-purple-100 hover:shadow-lg transition-shadow">
          <CardContent className="p-4 text-center">
            <div className="mx-auto mb-2 p-3 rounded-full bg-purple-500 text-white w-fit">
              <Calendar className="h-5 w-5" />
            </div>
            <p className="text-sm font-bold text-purple-700">{formatDate(promotion.endDate)}</p>
            <p className="text-sm text-purple-600">Kết thúc</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
