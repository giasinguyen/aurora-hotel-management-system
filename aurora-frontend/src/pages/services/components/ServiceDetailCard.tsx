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
  Edit
} from 'lucide-react';

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

const getCategoryColor = (): string => {
  return 'from-purple-500 to-violet-500';
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
        <div className={`bg-gradient-to-r ${getCategoryColor()} p-6 text-white`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-4 rounded-2xl bg-white/20 backdrop-blur-sm">
                <Sparkles className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-3xl font-bold tracking-tight">
                  {service.name}
                </h2>
                <div className="flex items-center gap-2 mt-1">
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
              label="Danh mục dịch vụ"
              value={
                <Badge variant="secondary" className="mt-1">
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
              <Sparkles className="h-5 w-5" />
            </div>
            <p className="text-lg font-bold text-purple-700">{service.categoryName || 'Chưa phân loại'}</p>
            <p className="text-sm text-purple-600">Danh mục dịch vụ</p>
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
