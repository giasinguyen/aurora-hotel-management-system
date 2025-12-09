// ============================================
// Staff Dashboard - Aurora Hotel Management System
// Shows daily stats, shift info, and quick actions
// ============================================

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  Clock,
  Users,
  DollarSign,
  Bed,
  LogIn,
  LogOut,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  RefreshCw,
  TrendingUp,
  UserPlus,
  ClipboardList,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { useAppSelector } from '@/hooks/useRedux';
import { getStaffOverview, getOccupancyStatistics } from '@/services/dashboardApi';
import { staffShiftApi, shiftCheckInApi } from '@/services/shiftApi';
import type { DashboardOverview, OccupancyStatistics } from '@/types/dashboard.types';
import type { StaffShiftAssignment } from '@/types/shift.types';

// Format currency
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(value);
};

// Format time
const formatTime = (dateString: string) => {
  return new Date(dateString).toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Get today's date
const getToday = () => new Date().toISOString().split('T')[0];

export default function StaffDashboard() {
  const navigate = useNavigate();
  const currentUser = useAppSelector((state) => state.auth.user);
  
  // State
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [overview, setOverview] = useState<DashboardOverview | null>(null);
  const [occupancy, setOccupancy] = useState<OccupancyStatistics | null>(null);
  const [todayShifts, setTodayShifts] = useState<StaffShiftAssignment[]>([]);
  const [shiftLoading, setShiftLoading] = useState<string | null>(null);
  const [noBranchAssigned, setNoBranchAssigned] = useState(false);

  // Fetch data
  const fetchData = useCallback(async (showRefreshToast = false) => {
    try {
      if (showRefreshToast) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const today = getToday();
      const branchId = currentUser?.branchId;
      const staffId = currentUser?.id;

      // Check if user has branch assigned
      if (!branchId) {
        setNoBranchAssigned(true);
        setLoading(false);
        setRefreshing(false);
        return;
      }
      setNoBranchAssigned(false);

      // Fetch dashboard overview for today
      const promises: Promise<unknown>[] = [
        getStaffOverview(today, today).catch(() => null),
        getOccupancyStatistics(today, branchId || undefined).catch(() => null),
      ];
      
      // Only fetch shifts if we have staffId
      if (staffId) {
        promises.push(
          staffShiftApi.getStaffShiftsForDate(staffId, today).catch(() => ({ data: { result: [] } }))
        );
      }

      const [overviewRes, occupancyRes, shiftsRes] = await Promise.all(promises);

      setOverview(overviewRes as DashboardOverview | null);
      setOccupancy(occupancyRes as OccupancyStatistics | null);
      
      // Handle shifts response
      if (shiftsRes && typeof shiftsRes === 'object' && 'data' in shiftsRes) {
        const shiftData = (shiftsRes as { data: { result?: StaffShiftAssignment[] } }).data;
        setTodayShifts(shiftData?.result || []);
      } else {
        setTodayShifts([]);
      }

      if (showRefreshToast) {
        toast.success('Đã cập nhật dữ liệu');
      }
    } catch (error) {
      console.error('Failed to fetch staff dashboard:', error);
      toast.error('Không thể tải dữ liệu dashboard');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [currentUser?.branchId, currentUser?.id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handle shift check-in
  const handleShiftCheckin = async (assignmentId: string) => {
    try {
      setShiftLoading(assignmentId);
      await shiftCheckInApi.checkIn({ assignmentId });
      toast.success('Check-in ca làm thành công');
      fetchData();
    } catch (error) {
      console.error('Shift check-in failed:', error);
      toast.error('Check-in thất bại');
    } finally {
      setShiftLoading(null);
    }
  };

  // Handle shift check-out
  const handleShiftCheckout = async (assignmentId: string) => {
    try {
      setShiftLoading(assignmentId);
      await shiftCheckInApi.checkOut({ assignmentId });
      toast.success('Check-out ca làm thành công');
      fetchData();
    } catch (error) {
      console.error('Shift check-out failed:', error);
      toast.error('Check-out thất bại');
    } finally {
      setShiftLoading(null);
    }
  };

  // Get shift status
  const getShiftStatus = (shift: StaffShiftAssignment) => {
    if (shift.checkOutTime) {
      return { label: 'Đã hoàn thành', color: 'bg-green-100 text-green-800', icon: CheckCircle };
    }
    if (shift.checkInTime) {
      return { label: 'Đang làm việc', color: 'bg-blue-100 text-blue-800', icon: Clock };
    }
    return { label: 'Chưa check-in', color: 'bg-yellow-100 text-yellow-800', icon: AlertCircle };
  };

  // Quick actions
  const quickActions = [
    {
      title: 'Quản lý đặt phòng',
      description: 'Xem và xử lý đặt phòng',
      icon: ClipboardList,
      color: 'bg-blue-500',
      onClick: () => navigate('/staff/bookings'),
    },
    {
      title: 'Check-in khách',
      description: 'Xử lý check-in cho khách',
      icon: LogIn,
      color: 'bg-green-500',
      onClick: () => navigate('/staff/bookings'),
    },
    {
      title: 'Check-out khách',
      description: 'Xử lý check-out cho khách',
      icon: LogOut,
      color: 'bg-orange-500',
      onClick: () => navigate('/staff/bookings'),
    },
    {
      title: 'Thêm khách hàng',
      description: 'Tạo tài khoản khách mới',
      icon: UserPlus,
      color: 'bg-purple-500',
      onClick: () => navigate('/staff/users/upsert'),
    },
  ];

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-96" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  // Show message if no branch assigned
  if (noBranchAssigned) {
    return (
      <div className="p-6">
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Chưa được gán chi nhánh
            </h2>
            <p className="text-gray-600 mb-4">
              Bạn cần được gán vào một chi nhánh để xem dashboard và thực hiện các công việc.
              Vui lòng liên hệ quản lý để được gán chi nhánh.
            </p>
            <div className="flex justify-center gap-3">
              <Button variant="outline" onClick={() => navigate('/staff/profile')}>
                Xem hồ sơ
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Xin chào, {currentUser?.firstName || currentUser?.username}! 👋
          </h1>
          <p className="text-gray-500 mt-1">
            Tổng quan công việc hôm nay - {new Date().toLocaleDateString('vi-VN', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => fetchData(true)}
          disabled={refreshing}
          className="gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          Làm mới
        </Button>
      </div>

      {/* Today's Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Today's Bookings */}
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Đặt phòng hôm nay</p>
                <p className="text-2xl font-bold text-gray-900">
                  {overview?.totalBookings || 0}
                </p>
                <p className="text-xs text-gray-400 mt-1">Tổng số đơn</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <ClipboardList className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Today's Revenue */}
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Doanh thu hôm nay</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(overview?.totalRevenue || 0)}
                </p>
                <p className="text-xs text-gray-400 mt-1">Tổng thu</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* New Customers */}
        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Khách mới</p>
                <p className="text-2xl font-bold text-gray-900">
                  {overview?.newCustomers || 0}
                </p>
                <p className="text-xs text-gray-400 mt-1">Hôm nay</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Room Occupancy */}
        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Công suất phòng</p>
                <p className="text-2xl font-bold text-gray-900">
                  {occupancy?.occupancyRate?.toFixed(0) || 0}%
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {occupancy?.occupiedRooms || 0}/{occupancy?.totalRooms || 0} phòng
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <Bed className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Shifts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              Ca làm việc hôm nay
            </CardTitle>
            <CardDescription>
              Quản lý check-in/check-out ca làm của bạn
            </CardDescription>
          </CardHeader>
          <CardContent>
            {todayShifts.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">Không có ca làm hôm nay</p>
                <p className="text-sm text-gray-400">Bạn có thể nghỉ ngơi hoặc xem lịch ca làm</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => navigate('/staff/shifts')}
                >
                  Xem lịch ca làm
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {todayShifts.map((shift) => {
                  const status = getShiftStatus(shift);
                  const StatusIcon = status.icon;
                  
                  return (
                    <div
                      key={shift.id}
                      className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {shift.workShiftName || 'Ca làm việc'}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {shift.startTime} - {shift.endTime}
                          </p>
                        </div>
                        <Badge className={status.color}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {status.label}
                        </Badge>
                      </div>

                      {/* Shift Timeline */}
                      <div className="flex items-center gap-4 text-sm mb-3">
                        {shift.checkInTime && (
                          <div className="flex items-center gap-1 text-green-600">
                            <LogIn className="w-4 h-4" />
                            <span>Check-in: {formatTime(shift.checkInTime)}</span>
                          </div>
                        )}
                        {shift.checkOutTime && (
                          <div className="flex items-center gap-1 text-orange-600">
                            <LogOut className="w-4 h-4" />
                            <span>Check-out: {formatTime(shift.checkOutTime)}</span>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        {!shift.checkInTime && (
                          <Button
                            size="sm"
                            onClick={() => handleShiftCheckin(shift.id)}
                            disabled={shiftLoading === shift.id}
                            className="gap-1 bg-green-600 hover:bg-green-700"
                          >
                            {shiftLoading === shift.id ? (
                              <RefreshCw className="w-4 h-4 animate-spin" />
                            ) : (
                              <LogIn className="w-4 h-4" />
                            )}
                            Check-in
                          </Button>
                        )}
                        {shift.checkInTime && !shift.checkOutTime && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleShiftCheckout(shift.id)}
                            disabled={shiftLoading === shift.id}
                            className="gap-1 border-orange-500 text-orange-600 hover:bg-orange-50"
                          >
                            {shiftLoading === shift.id ? (
                              <RefreshCw className="w-4 h-4 animate-spin" />
                            ) : (
                              <LogOut className="w-4 h-4" />
                            )}
                            Check-out
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              Thao tác nhanh
            </CardTitle>
            <CardDescription>
              Các chức năng thường dùng
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={action.onClick}
                  className="flex items-center gap-3 p-4 rounded-lg border hover:bg-gray-50 hover:border-gray-300 transition-all text-left group"
                >
                  <div className={`p-2 rounded-lg ${action.color} text-white`}>
                    <action.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                      {action.title}
                    </h4>
                    <p className="text-xs text-gray-500 truncate">
                      {action.description}
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Room Status Overview */}
      {occupancy && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bed className="w-5 h-5 text-orange-600" />
              Tình trạng phòng
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Occupancy Progress */}
              <div className="col-span-1 md:col-span-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Tỷ lệ lấp đầy</span>
                  <span className="text-sm font-medium">{occupancy.occupancyRate?.toFixed(1)}%</span>
                </div>
                <Progress value={occupancy.occupancyRate || 0} className="h-3" />
                <div className="flex justify-between mt-2 text-xs text-gray-500">
                  <span>0%</span>
                  <span>50%</span>
                  <span>100%</span>
                </div>
              </div>

              {/* Room Stats */}
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Còn trống</span>
                  </div>
                  <span className="font-medium text-green-700">{occupancy.availableRooms}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Đang sử dụng</span>
                  </div>
                  <span className="font-medium text-red-700">{occupancy.occupiedRooms}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Tổng cộng</span>
                  </div>
                  <span className="font-medium text-gray-700">{occupancy.totalRooms}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}