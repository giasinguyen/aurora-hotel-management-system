// ============================================
// Occupancy Chart - Admin Dashboard
// ============================================

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { BedDouble, CheckCircle2, XCircle, Building2, Percent } from 'lucide-react';
import type { OccupancyStatistics } from '@/types/dashboard.types';

interface OccupancyChartProps {
  data: OccupancyStatistics | null;
  loading?: boolean;
  error?: string | null;
}

export default function OccupancyChart({ data, loading, error }: OccupancyChartProps) {
  const occupancyRate = data?.occupancyRate ?? 0;
  const totalRooms = data?.totalRooms ?? 0;
  const occupiedRooms = data?.occupiedRooms ?? 0;
  const availableRooms = data?.availableRooms ?? 0;

  const getOccupancyStatus = (rate: number) => {
    if (rate >= 80) return { label: 'Xuất sắc', color: 'text-green-600', bgColor: 'bg-green-500', lightBg: 'bg-green-50' };
    if (rate >= 60) return { label: 'Tốt', color: 'text-blue-600', bgColor: 'bg-blue-500', lightBg: 'bg-blue-50' };
    if (rate >= 40) return { label: 'Trung bình', color: 'text-amber-600', bgColor: 'bg-amber-500', lightBg: 'bg-amber-50' };
    return { label: 'Cần cải thiện', color: 'text-red-600', bgColor: 'bg-red-500', lightBg: 'bg-red-50' };
  };

  const status = getOccupancyStatus(occupancyRate);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-32" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-48 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b">
        <CardTitle className="flex items-center gap-2">
          <Percent className="h-5 w-5 text-purple-500" />
          Tỷ lệ lấp đầy phòng
        </CardTitle>
        <CardDescription>Trạng thái sử dụng phòng hôm nay</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        {error ? (
          <div className="flex items-center justify-center h-64 text-red-500">
            {error}
          </div>
        ) : !data ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <BedDouble className="h-12 w-12 mb-2 text-gray-300" />
            <p>Không có dữ liệu</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Main Occupancy Display */}
            <div className="flex items-center justify-center">
              <div className="relative w-40 h-40">
                {/* Circular Progress Background */}
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="12"
                  />
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    fill="none"
                    stroke="url(#occupancyGradient)"
                    strokeWidth="12"
                    strokeLinecap="round"
                    strokeDasharray={`${(occupancyRate / 100) * 440} 440`}
                  />
                  <defs>
                    <linearGradient id="occupancyGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#8b5cf6" />
                      <stop offset="100%" stopColor="#ec4899" />
                    </linearGradient>
                  </defs>
                </svg>
                {/* Center Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    {occupancyRate.toFixed(1)}%
                  </span>
                  <span className={`text-sm font-medium ${status.color}`}>
                    {status.label}
                  </span>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-3">
              <div className="flex flex-col items-center p-4 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100">
                <div className="p-2 rounded-full bg-blue-100 mb-2">
                  <Building2 className="h-5 w-5 text-blue-600" />
                </div>
                <span className="text-2xl font-bold text-blue-700">{totalRooms}</span>
                <span className="text-xs text-blue-600 font-medium">Tổng phòng</span>
              </div>

              <div className="flex flex-col items-center p-4 rounded-xl bg-gradient-to-br from-red-50 to-rose-50 border border-red-100">
                <div className="p-2 rounded-full bg-red-100 mb-2">
                  <XCircle className="h-5 w-5 text-red-600" />
                </div>
                <span className="text-2xl font-bold text-red-700">{occupiedRooms}</span>
                <span className="text-xs text-red-600 font-medium">Đang sử dụng</span>
              </div>

              <div className="flex flex-col items-center p-4 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100">
                <div className="p-2 rounded-full bg-green-100 mb-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                </div>
                <span className="text-2xl font-bold text-green-700">{availableRooms}</span>
                <span className="text-xs text-green-600 font-medium">Còn trống</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tiến độ lấp đầy</span>
                <span className="font-medium">{occupiedRooms}/{totalRooms} phòng</span>
              </div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
                  style={{ width: `${occupancyRate}%` }}
                />
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
