import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  CalendarDays, 
  Users, 
  BedDouble,
  UserCog,
  Edit,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Wrench,
  Ban
} from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

import type { Branch, BranchStatus } from '@/types/branch.types';

interface BranchDetailCardProps {
  branch: Branch;
  onEdit?: () => void;
  onBack?: () => void;
  onAssignManager?: () => void;
}

// Status configurations with icons
const STATUS_CONFIG: Record<BranchStatus, { 
  label: string; 
  variant: 'default' | 'secondary' | 'destructive' | 'outline'; 
  bgColor: string;
  textColor: string;
  icon: React.ComponentType<{ className?: string }>;
}> = {
  ACTIVE: { 
    label: 'Hoạt động', 
    variant: 'default', 
    bgColor: 'bg-green-100',
    textColor: 'text-green-700',
    icon: CheckCircle2
  },
  INACTIVE: { 
    label: 'Tạm ngừng', 
    variant: 'secondary', 
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-700',
    icon: XCircle
  },
  MAINTENANCE: { 
    label: 'Bảo trì', 
    variant: 'secondary', 
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-700',
    icon: Wrench
  },
};

export default function BranchDetailCard({ branch, onEdit, onBack, onAssignManager }: BranchDetailCardProps) {
  const statusConfig = STATUS_CONFIG[branch.status as BranchStatus] || STATUS_CONFIG.ACTIVE;
  const StatusIcon = statusConfig.icon;

  // Calculate room availability percentage
  const roomAvailabilityPercent = branch.totalRooms > 0 
    ? Math.round((branch.availableRooms / branch.totalRooms) * 100) 
    : 0;

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Quay lại
        </Button>
        <div className="flex items-center gap-2">
          {onAssignManager && (
            <Button variant="outline" onClick={onAssignManager} className="gap-2">
              <UserCog className="h-4 w-4" />
              Phân công quản lý
            </Button>
          )}
          {onEdit && (
            <Button onClick={onEdit} className="gap-2 bg-primary hover:bg-primary/90">
              <Edit className="h-4 w-4" />
              Chỉnh sửa
            </Button>
          )}
        </div>
      </div>

      {/* Main Info Card */}
      <Card className="overflow-hidden border-0 shadow-lg">
        <CardHeader className="bg-primary text-white p-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="p-4 bg-white/20 rounded-xl backdrop-blur-sm">
                <Building2 className="h-10 w-10" />
              </div>
              <div>
                <CardTitle className="text-3xl font-bold">{branch.name}</CardTitle>
                <CardDescription className="text-white/80 mt-2 font-mono text-lg">
                  {branch.code}
                </CardDescription>
                {branch.description && (
                  <p className="text-white/80 mt-3 max-w-xl">{branch.description}</p>
                )}
              </div>
            </div>
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${statusConfig.bgColor} ${statusConfig.textColor}`}>
              <StatusIcon className="h-5 w-5" />
              <span className="font-semibold">{statusConfig.label}</span>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 border-b">
            {/* Total Rooms */}
            <div className="p-6 text-center">
              <div className="flex items-center justify-center gap-2 text-muted-foreground mb-2">
                <BedDouble className="h-5 w-5" />
                <span>Tổng phòng</span>
              </div>
              <div className="text-3xl font-bold text-blue-600">{branch.totalRooms}</div>
            </div>

            {/* Available Rooms */}
            <div className="p-6 text-center">
              <div className="flex items-center justify-center gap-2 text-muted-foreground mb-2">
                <BedDouble className="h-5 w-5 text-green-500" />
                <span>Phòng trống</span>
              </div>
              <div className="text-3xl font-bold text-green-600">
                {branch.availableRooms}
                <span className="text-sm font-normal text-muted-foreground ml-2">
                  ({roomAvailabilityPercent}%)
                </span>
              </div>
            </div>

            {/* Total Staff */}
            <div className="p-6 text-center">
              <div className="flex items-center justify-center gap-2 text-muted-foreground mb-2">
                <Users className="h-5 w-5" />
                <span>Nhân viên</span>
              </div>
              <div className="text-3xl font-bold text-purple-600">{branch.totalStaff}</div>
            </div>

            {/* Manager */}
            <div className="p-6 text-center">
              <div className="flex items-center justify-center gap-2 text-muted-foreground mb-2">
                <UserCog className="h-5 w-5" />
                <span>Quản lý</span>
              </div>
              <div className="text-lg font-semibold text-gray-800">
                {branch.managerName || (
                  <span className="text-muted-foreground italic">Chưa phân công</span>
                )}
              </div>
            </div>
          </div>

          {/* Detail Sections */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Address Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-lg font-semibold">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <MapPin className="h-5 w-5 text-emerald-600" />
                </div>
                Địa chỉ
              </div>
              <div className="pl-11 space-y-2">
                <p className="text-gray-700 leading-relaxed">{branch.fullAddress}</p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="font-normal">
                    {branch.ward}
                  </Badge>
                  <Badge variant="outline" className="font-normal">
                    {branch.district}
                  </Badge>
                  <Badge variant="secondary">
                    {branch.city}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Contact Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-lg font-semibold">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Phone className="h-5 w-5 text-purple-600" />
                </div>
                Liên hệ
              </div>
              <div className="pl-11 space-y-3">
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <a 
                    href={`tel:${branch.phone}`} 
                    className="text-blue-600 hover:underline font-medium"
                  >
                    {branch.phone}
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <a 
                    href={`mailto:${branch.email}`} 
                    className="text-blue-600 hover:underline"
                  >
                    {branch.email}
                  </a>
                </div>
              </div>
            </div>

            {/* Operating Hours Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-lg font-semibold">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Clock className="h-5 w-5 text-orange-600" />
                </div>
                Thời gian hoạt động
              </div>
              <div className="pl-11 space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="text-xs text-green-600 font-medium mb-1">Check-in</div>
                    <div className="text-lg font-bold text-green-700">{branch.checkInTime || '14:00'}</div>
                  </div>
                  <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                    <div className="text-xs text-red-600 font-medium mb-1">Check-out</div>
                    <div className="text-lg font-bold text-red-700">{branch.checkOutTime || '12:00'}</div>
                  </div>
                </div>
                {branch.operatingHours && (
                  <p className="text-sm text-muted-foreground">
                    Giờ hoạt động: {branch.operatingHours}
                  </p>
                )}
              </div>
            </div>

            {/* Opening Date Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-lg font-semibold">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <CalendarDays className="h-5 w-5 text-blue-600" />
                </div>
                Ngày khai trương
              </div>
              <div className="pl-11">
                <p className="text-gray-700 font-medium">
                  {formatDate(branch.openingDate)}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Room Availability Progress */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <BedDouble className="h-5 w-5 text-blue-600" />
            Tình trạng phòng
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Phòng trống</span>
              <span className="font-medium">{branch.availableRooms} / {branch.totalRooms} phòng</span>
            </div>
            <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${
                  roomAvailabilityPercent > 60 
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                    : roomAvailabilityPercent > 30 
                    ? 'bg-gradient-to-r from-yellow-500 to-orange-500' 
                    : 'bg-gradient-to-r from-red-500 to-pink-500'
                }`}
                style={{ width: `${roomAvailabilityPercent}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>0%</span>
              <span className="font-medium text-sm">
                {roomAvailabilityPercent > 60 ? (
                  <span className="text-green-600">Còn nhiều phòng trống</span>
                ) : roomAvailabilityPercent > 30 ? (
                  <span className="text-yellow-600">Phòng trống trung bình</span>
                ) : (
                  <span className="text-red-600">Gần hết phòng</span>
                )}
              </span>
              <span>100%</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
