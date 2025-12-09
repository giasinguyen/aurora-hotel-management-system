// ============================================
// Admin Dashboard Page - Aurora Hotel Management
// ============================================

import { useState, useCallback } from 'react';
import { format, subDays } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import { useAdminDashboard } from '@/hooks/useDashboard';
import {
  DateRangePicker,
  RevenueChart,
  TopRoomTypesChart,
  PaymentMethodsChart,
  OccupancyChart,
} from '@/pages/admin/components/dashboard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

import {
  DollarSign,
  CalendarCheck,
  BedDouble,
  Users,
  TrendingUp,
  TrendingDown,
  Building2,
  Shield,
  FileText,
  ArrowRight,
  RefreshCw,
  BarChart3,
  UserCog,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  Activity,
  Percent,
  Wallet,
} from 'lucide-react';
import type { DashboardGroupBy } from '@/types/dashboard.types';
import { useAppSelector } from '@/hooks/useRedux';

// Format currency - Vietnamese style
const formatCurrency = (value: number) => {
  if (value >= 1000000000) {
    return `${(value / 1000000000).toFixed(1)} tỷ`;
  } else if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)} triệu`;
  } else if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}k`;
  }
  return value.toLocaleString('vi-VN');
};

// Format number
const formatNumber = (value: number) => {
  return value.toLocaleString('vi-VN');
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const currentUser = useAppSelector((state) => state.auth.user);
  
  // Date range state
  const [dateFrom, setDateFrom] = useState<string | null>(
    format(subDays(new Date(), 30), 'yyyy-MM-dd')
  );
  const [dateTo, setDateTo] = useState<string | null>(
    format(new Date(), 'yyyy-MM-dd')
  );
  const [groupBy, setGroupBy] = useState<DashboardGroupBy>('DAY');

  // Fetch dashboard data using custom hook
  const {
    overview,
    revenueStats,
    occupancyStats,
    topRoomTypes,
    paymentMethods,
    loading,
    error,
    refresh,
  } = useAdminDashboard({
    dateFrom,
    dateTo,
    groupBy,
    autoFetch: true,
  });

  // Handle date range change
  const handleDateChange = useCallback((from: string | null, to: string | null) => {
    setDateFrom(from);
    setDateTo(to);
  }, []);

  // Handle group by change
  const handleGroupByChange = useCallback((value: string) => {
    setGroupBy(value as DashboardGroupBy);
  }, []);

  // Quick actions for Admin
  const quickActions = [
    {
      title: 'Quản lý người dùng',
      description: 'Thêm, sửa, xóa tài khoản',
      icon: UserCog,
      color: 'bg-blue-500',
      onClick: () => navigate('/admin/users'),
    },
    {
      title: 'Quản lý chi nhánh',
      description: 'Quản lý các chi nhánh khách sạn',
      icon: Building2,
      color: 'bg-green-500',
      onClick: () => navigate('/admin/branches'),
    },
    {
      title: 'Phân quyền',
      description: 'Cấu hình quyền hạn hệ thống',
      icon: Shield,
      color: 'bg-purple-500',
      onClick: () => navigate('/admin/roles'),
    },
    {
      title: 'Báo cáo tổng hợp',
      description: 'Xem báo cáo doanh thu, thống kê',
      icon: FileText,
      color: 'bg-orange-500',
      onClick: () => navigate('/admin/reports/revenue'),
    },
  ];

  // Loading state
  if (loading && !overview) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Đang tải dữ liệu dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Bảng điều khiển Admin
          </h1>
          <p className="text-gray-500 mt-1 flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Xin chào, {currentUser?.firstName || 'Admin'}! Đây là tổng quan hệ thống Aurora Hotel.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={refresh}
          disabled={loading}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Làm mới
        </Button>
      </div>

      {/* Date Range Picker */}
      <DateRangePicker
        dateFrom={dateFrom}
        dateTo={dateTo}
        onDateChange={handleDateChange}
        onRefresh={refresh}
        loading={loading}
      />

      {/* Error Message */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <div>
                <p className="font-medium text-red-800">Không thể tải dữ liệu</p>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Stats Cards - 5 columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {/* Total Revenue */}
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-green-100 to-transparent rounded-full -mr-8 -mt-8" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Tổng doanh thu</CardTitle>
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(overview?.totalRevenue || 0)} ₫
            </div>
            <div className="flex items-center text-xs mt-1">
              {overview?.revenueGrowthPercent !== undefined && overview.revenueGrowthPercent > 0 ? (
                <>
                  <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                  <span className="text-green-500">+{overview.revenueGrowthPercent.toFixed(1)}%</span>
                </>
              ) : overview?.revenueGrowthPercent !== undefined && overview.revenueGrowthPercent < 0 ? (
                <>
                  <TrendingDown className="h-3 w-3 mr-1 text-red-500" />
                  <span className="text-red-500">{overview.revenueGrowthPercent.toFixed(1)}%</span>
                </>
              ) : (
                <span className="text-gray-500">So với kỳ trước</span>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Total Bookings */}
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-100 to-transparent rounded-full -mr-8 -mt-8" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Tổng đặt phòng</CardTitle>
            <div className="p-2 bg-blue-100 rounded-lg">
              <CalendarCheck className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {formatNumber(overview?.totalBookings || 0)}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Trong khoảng thời gian đã chọn
            </p>
          </CardContent>
        </Card>

        {/* Occupancy Rate */}
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-100 to-transparent rounded-full -mr-8 -mt-8" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Tỷ lệ lấp đầy</CardTitle>
            <div className="p-2 bg-purple-100 rounded-lg">
              <Percent className="h-4 w-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {(overview?.occupancyRate || 0).toFixed(1)}%
            </div>
            <Progress 
              value={overview?.occupancyRate || 0} 
              className="h-2 mt-2"
            />
          </CardContent>
        </Card>

        {/* New Customers */}
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-orange-100 to-transparent rounded-full -mr-8 -mt-8" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Khách hàng mới</CardTitle>
            <div className="p-2 bg-orange-100 rounded-lg">
              <Users className="h-4 w-4 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {formatNumber(overview?.newCustomers || 0)}
            </div>
            <div className="flex gap-2 mt-1">
              <Badge variant="outline" className="text-xs bg-orange-50 border-orange-200 text-orange-700">
                Quay lại: {overview?.returningCustomers || 0}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Average Booking Value */}
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-cyan-100 to-transparent rounded-full -mr-8 -mt-8" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Giá trị TB/Booking</CardTitle>
            <div className="p-2 bg-cyan-100 rounded-lg">
              <Wallet className="h-4 w-4 text-cyan-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-cyan-600">
              {formatCurrency(overview?.averageBookingValue || 0)} ₫
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Trung bình mỗi đơn đặt phòng
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart - Takes 2 columns */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="DAY" onValueChange={handleGroupByChange} className="w-full">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-blue-500" />
                      Phân tích doanh thu
                    </CardTitle>
                    <CardDescription>Biểu đồ doanh thu theo thời gian</CardDescription>
                  </div>
                  <TabsList className="bg-gray-100">
                    <TabsTrigger value="DAY" className="text-xs">Theo ngày</TabsTrigger>
                    <TabsTrigger value="WEEK" className="text-xs">Theo tuần</TabsTrigger>
                    <TabsTrigger value="MONTH" className="text-xs">Theo tháng</TabsTrigger>
                  </TabsList>
                </div>
              </CardHeader>
              <CardContent>
                <TabsContent value="DAY" className="mt-0">
                  <RevenueChart data={revenueStats} loading={loading} />
                </TabsContent>
                <TabsContent value="WEEK" className="mt-0">
                  <RevenueChart data={revenueStats} loading={loading} />
                </TabsContent>
                <TabsContent value="MONTH" className="mt-0">
                  <RevenueChart data={revenueStats} loading={loading} />
                </TabsContent>
              </CardContent>
            </Card>
          </Tabs>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-purple-500" />
              Thao tác nhanh
            </CardTitle>
            <CardDescription>Truy cập các chức năng quản trị</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                variant="outline"
                className="w-full justify-start h-auto py-3 px-4 hover:bg-gray-50 transition-all"
                onClick={action.onClick}
              >
                <div className={`${action.color} p-2 rounded-lg mr-3`}>
                  <action.icon className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium">{action.title}</p>
                  <p className="text-xs text-muted-foreground">{action.description}</p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </Button>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid - Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopRoomTypesChart data={topRoomTypes} loading={loading} />
        <OccupancyChart data={occupancyStats} loading={loading} />
      </div>

      {/* Payment Methods Chart */}
      <PaymentMethodsChart data={paymentMethods} loading={loading} />

      {/* Room Status Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BedDouble className="h-5 w-5 text-indigo-500" />
            Tổng quan trạng thái phòng hôm nay
          </CardTitle>
          <CardDescription>Thống kê tình trạng phòng toàn hệ thống</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-center gap-4 p-4 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200">
              <div className="p-3 rounded-full bg-green-100">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-green-600 font-medium">Phòng trống</p>
                <p className="text-2xl font-bold text-green-700">
                  {occupancyStats?.availableRooms || 0}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-lg bg-gradient-to-r from-red-50 to-rose-50 border border-red-200">
              <div className="p-3 rounded-full bg-red-100">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-red-600 font-medium">Đang sử dụng</p>
                <p className="text-2xl font-bold text-red-700">
                  {occupancyStats?.occupiedRooms || 0}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
              <div className="p-3 rounded-full bg-blue-100">
                <Building2 className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-blue-600 font-medium">Tổng số phòng</p>
                <p className="text-2xl font-bold text-blue-700">
                  {occupancyStats?.totalRooms || 0}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Footer Info */}
      <div className="text-center text-sm text-gray-500 pt-4 border-t">
        <p className="flex items-center justify-center gap-2">
          <Clock className="h-4 w-4" />
          Dữ liệu cập nhật lúc: {format(new Date(), 'HH:mm dd/MM/yyyy', { locale: vi })} | 
          Hiển thị từ {dateFrom ? format(new Date(dateFrom), 'dd/MM/yyyy', { locale: vi }) : 'N/A'} đến {dateTo ? format(new Date(dateTo), 'dd/MM/yyyy', { locale: vi }) : 'N/A'}
        </p>
      </div>
    </div>
  );
};

export default AdminDashboard;