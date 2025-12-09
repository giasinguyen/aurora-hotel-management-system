// ============================================
// Top Room Types Chart - Admin Dashboard
// ============================================

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Crown, TrendingUp, BedDouble } from 'lucide-react';
import type { TopRoomType } from '@/types/dashboard.types';

interface TopRoomTypesChartProps {
  data: TopRoomType[];
  loading?: boolean;
  error?: string | null;
}

const RANK_COLORS = [
  { bg: 'bg-gradient-to-r from-amber-400 to-yellow-500', text: 'text-amber-700', badge: 'bg-amber-100 text-amber-700 border-amber-300' },
  { bg: 'bg-gradient-to-r from-gray-300 to-gray-400', text: 'text-gray-600', badge: 'bg-gray-100 text-gray-600 border-gray-300' },
  { bg: 'bg-gradient-to-r from-orange-300 to-orange-400', text: 'text-orange-700', badge: 'bg-orange-100 text-orange-700 border-orange-300' },
  { bg: 'bg-blue-500', text: 'text-blue-600', badge: 'bg-blue-100 text-blue-600 border-blue-300' },
  { bg: 'bg-purple-500', text: 'text-purple-600', badge: 'bg-purple-100 text-purple-600 border-purple-300' },
];

export default function TopRoomTypesChart({ data, loading, error }: TopRoomTypesChartProps) {
  const hasData = data && data.length > 0;
  const maxBookings = hasData ? Math.max(...data.map(d => d.bookings)) : 0;

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-32" />
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
        <CardTitle className="flex items-center gap-2">
          <Crown className="h-5 w-5 text-amber-500" />
          Loại phòng được đặt nhiều nhất
        </CardTitle>
        <CardDescription>Top 5 loại phòng phổ biến</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        {error ? (
          <div className="flex items-center justify-center h-64 text-red-500">
            {error}
          </div>
        ) : !hasData ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <BedDouble className="h-12 w-12 mb-2 text-gray-300" />
            <p>Không có dữ liệu</p>
          </div>
        ) : (
          <div className="space-y-4">
            {data.map((item, index) => {
              const progress = maxBookings > 0 ? (item.bookings / maxBookings) * 100 : 0;
              const colors = RANK_COLORS[index] || RANK_COLORS[4];
              
              return (
                <div
                  key={item.roomTypeName}
                  className="relative p-4 rounded-lg border bg-white hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-4">
                    {/* Rank Badge */}
                    <div className={`w-10 h-10 rounded-full ${colors.bg} flex items-center justify-center text-white font-bold shadow-lg`}>
                      {index + 1}
                    </div>
                    
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-900 truncate">
                          {item.roomTypeName}
                        </h4>
                        <Badge variant="outline" className={colors.badge}>
                          {item.bookings} đặt phòng
                        </Badge>
                      </div>
                      <div className="relative">
                        <Progress value={progress} className="h-2" />
                        <span className="absolute right-0 top-3 text-xs text-gray-500">
                          {progress.toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
