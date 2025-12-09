import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
  DollarSign,
  Calendar,
  Users,
  BedDouble,
  TrendingUp,
  TrendingDown,
  Clock,
  ClipboardList,
  FileText,
  ArrowRight,
  Building2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAppSelector } from '@/hooks/useRedux';
import {
  getManagerBranchOverview,
  getRevenueStatistics,
  getOccupancyStatistics,
} from '@/services/dashboardApi';
import type {
  DashboardOverview,
  RevenueStatistics,
  OccupancyStatistics,
} from '@/types/dashboard.types';

// Format currency
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

const ManagerDashboard = () => {
  const navigate = useNavigate();
  const currentUser = useAppSelector((state) => state.auth.user);
  const branchId = currentUser?.branchId;

  // State
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState<DashboardOverview | null>(null);
  const [revenueStats, setRevenueStats] = useState<RevenueStatistics[]>([]);
  const [occupancy, setOccupancy] = useState<OccupancyStatistics | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Date range - Last 30 days
  const dateFrom = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const dateTo = new Date().toISOString().split('T')[0];

  // Fetch dashboard data
  const fetchDashboardData = useCallback(async () => {
    console.log('ManagerDashboard: currentUser:', currentUser);
    console.log('ManagerDashboard: branchId:', branchId);
    
    if (!branchId) {
      setError('Bạn chưa được gán chi nhánh. Vui lòng liên hệ Admin để được gán chi nhánh quản lý.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const [overviewRes, revenueRes, occupancyRes] = await Promise.all([
        getManagerBranchOverview(branchId, dateFrom, dateTo),
        getRevenueStatistics(dateFrom, dateTo, 'DAY', branchId),
        getOccupancyStatistics(dateTo, branchId),
      ]);

      console.log('ManagerDashboard: overviewRes:', overviewRes);
      console.log('ManagerDashboard: revenueRes:', revenueRes);
      console.log('ManagerDashboard: occupancyRes:', occupancyRes);

      setOverview(overviewRes);
      setRevenueStats(revenueRes);
      setOccupancy(occupancyRes);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      setError('Không thể tải dữ liệu dashboard. Vui lòng thử lại.');
      toast.error('Không thể tải dữ liệu dashboard');
    } finally {
      setLoading(false);
    }
  }, [branchId, dateFrom, dateTo, currentUser]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Quick action handlers
  const quickActions = [
    {
      title: 'Quản lý ca làm',
      description: 'Phân ca và theo dõi nhân viên',
      icon: Clock,
      color: 'bg-blue-500',
      onClick: () => navigate('/manager/shifts'),
    },
    {
      title: 'Đặt phòng',
      description: 'Xem và quản lý đặt phòng',
      icon: Calendar,
      color: 'bg-green-500',
      onClick: () => navigate('/manager/bookings'),
    },
    {
      title: 'Phòng',
      description: 'Quản lý trạng thái phòng',
      icon: BedDouble,
      color: 'bg-purple-500',
      onClick: () => navigate('/manager/rooms'),
    },
    {
      title: 'Báo cáo',
      description: 'Xem báo cáo doanh thu',
      icon: FileText,
      color: 'bg-orange-500',
      onClick: () => navigate('/manager/reports/revenue'),
    },
  ];

  // Chart data
  const chartData = revenueStats.slice(-7).map((stat) => ({
    name: stat.periodLabel,
    revenue: stat.revenue,
    bookings: stat.bookingCount,
  }));

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Đang tải dữ liệu dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manager Dashboard</h1>
        </div>
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <AlertCircle className="h-8 w-8 text-orange-500" />
              <div>
                <h3 className="font-semibold text-orange-800">Không thể hiển thị Dashboard</h3>
                <p className="text-orange-700">{error}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manager Dashboard</h1>
          <p className="text-gray-500 mt-1 flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Chi nhánh: {currentUser?.branchId || 'Chưa được gán chi nhánh'}
          </p>
        </div>
        <div className="text-sm text-muted-foreground">
          Dữ liệu 30 ngày gần nhất ({dateFrom} - {dateTo})
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng doanh thu</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(overview?.totalRevenue || 0)} ₫
            </div>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
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
                <span>So với kỳ trước</span>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Total Bookings */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng đặt phòng</CardTitle>
            <ClipboardList className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {overview?.totalBookings || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Trung bình: {formatCurrency(overview?.averageBookingValue || 0)} ₫/booking
            </p>
          </CardContent>
        </Card>

        {/* Occupancy Rate */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tỷ lệ lấp đầy</CardTitle>
            <BedDouble className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {(overview?.occupancyRate || 0).toFixed(1)}%
            </div>
            <Progress 
              value={overview?.occupancyRate || 0} 
              className="h-2 mt-2"
            />
            <p className="text-xs text-muted-foreground mt-1">
              {occupancy?.occupiedRooms || 0} / {occupancy?.totalRooms || 0} phòng
            </p>
          </CardContent>
        </Card>

        {/* Customers */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Khách hàng</CardTitle>
            <Users className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {(overview?.newCustomers || 0) + (overview?.returningCustomers || 0)}
            </div>
            <div className="flex gap-2 mt-1">
              <Badge variant="outline" className="text-xs">
                Mới: {overview?.newCustomers || 0}
              </Badge>
              <Badge variant="outline" className="text-xs">
                Quay lại: {overview?.returningCustomers || 0}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart - Takes 2 columns */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Biểu đồ doanh thu</CardTitle>
            <CardDescription>Doanh thu 7 ngày gần nhất</CardDescription>
          </CardHeader>
          <CardContent>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    tickFormatter={(value) => formatCurrency(value)}
                  />
                  <Tooltip 
                    formatter={(value: number) => [`${formatCurrency(value)} ₫`, 'Doanh thu']}
                    labelStyle={{ color: '#374151' }}
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px'
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#10b981"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                Không có dữ liệu
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Thao tác nhanh</CardTitle>
            <CardDescription>Truy cập các chức năng thường dùng</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                variant="outline"
                className="w-full justify-start h-auto py-3 px-4"
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

      {/* Room Status Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Trạng thái phòng hôm nay</CardTitle>
          <CardDescription>Tổng quan tình trạng phòng chi nhánh</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-center gap-4 p-4 rounded-lg bg-green-50 border border-green-200">
              <div className="p-3 rounded-full bg-green-100">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-green-600 font-medium">Phòng trống</p>
                <p className="text-2xl font-bold text-green-700">
                  {occupancy?.availableRooms || 0}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-lg bg-red-50 border border-red-200">
              <div className="p-3 rounded-full bg-red-100">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-red-600 font-medium">Đang sử dụng</p>
                <p className="text-2xl font-bold text-red-700">
                  {occupancy?.occupiedRooms || 0}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-lg bg-blue-50 border border-blue-200">
              <div className="p-3 rounded-full bg-blue-100">
                <AlertCircle className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-blue-600 font-medium">Tổng phòng</p>
                <p className="text-2xl font-bold text-blue-700">
                  {occupancy?.totalRooms || 0}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ManagerDashboard;
