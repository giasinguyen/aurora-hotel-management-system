import { useState, useEffect, useCallback } from 'react';
import {
  TrendingUp,
  Users,
  CalendarCheck,
  DollarSign,
  BarChart3,
  Building2,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPie,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
  Area,
  AreaChart,
} from 'recharts';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ReportDateRangeFilter,
  ReportStatCard,
  ReportChartCard,
  ExportButtons,
  BranchSelector,
  ReportEmptyState,
} from '@/components/custom/reports';
import { getAdminOverview, getRevenueStatistics, getOccupancyStatistics, getTopRoomTypes, getRevenueByPaymentMethod, getBookingsBySource, getCustomerGrowth } from '@/services/dashboardApi';
import { exportOverviewReport, type OverviewExportData } from '@/utils/exportUtils';
import type { ReportDateRange } from '@/types/report.types';
import type { 
  DashboardOverview, 
  RevenueStatistics, 
  OccupancyStatistics, 
  TopRoomType, 
  PaymentMethodRevenue, 
  BookingSourceStats,
  CustomerGrowthPoint,
} from '@/types/dashboard.types';
import { toast } from 'sonner';

// Colors for charts
const COLORS = ['#f59e0b', '#3b82f6', '#10b981', '#ef4444', '#8b5cf6', '#ec4899'];

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

// Get default date range (this month)
const getDefaultDateRange = (): ReportDateRange => {
  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  return {
    dateFrom: firstDayOfMonth.toISOString().split('T')[0],
    dateTo: today.toISOString().split('T')[0],
  };
};

export default function OverviewReport() {
  // State
  const [dateRange, setDateRange] = useState<ReportDateRange>(getDefaultDateRange);
  const [branchId, setBranchId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Data states
  const [overview, setOverview] = useState<DashboardOverview | null>(null);
  const [revenueStats, setRevenueStats] = useState<RevenueStatistics[]>([]);
  const [occupancyStats, setOccupancyStats] = useState<OccupancyStatistics | null>(null);
  const [topRoomTypes, setTopRoomTypes] = useState<TopRoomType[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodRevenue | null>(null);
  const [bookingSources, setBookingSources] = useState<BookingSourceStats | null>(null);
  const [customerGrowth, setCustomerGrowth] = useState<CustomerGrowthPoint[]>([]);

  // Fetch all data
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      
      const [
        overviewRes,
        revenueRes,
        occupancyRes,
        topRoomsRes,
        paymentRes,
        bookingSourceRes,
        customerGrowthRes,
      ] = await Promise.all([
        getAdminOverview(dateRange.dateFrom, dateRange.dateTo),
        getRevenueStatistics(dateRange.dateFrom, dateRange.dateTo, 'MONTH', branchId || undefined),
        getOccupancyStatistics(dateRange.dateTo, branchId || undefined),
        getTopRoomTypes(10, branchId || undefined),
        getRevenueByPaymentMethod(dateRange.dateFrom, dateRange.dateTo, branchId || undefined),
        getBookingsBySource(dateRange.dateFrom, dateRange.dateTo, branchId || undefined),
        getCustomerGrowth('MONTH'),
      ]);

      setOverview(overviewRes);
      setRevenueStats(revenueRes);
      setOccupancyStats(occupancyRes);
      setTopRoomTypes(topRoomsRes);
      setPaymentMethods(paymentRes);
      setBookingSources(bookingSourceRes);
      setCustomerGrowth(customerGrowthRes);
    } catch (error) {
      console.error('Failed to fetch overview data:', error);
      toast.error('Không thể tải dữ liệu tổng quan');
    } finally {
      setLoading(false);
    }
  }, [dateRange.dateFrom, dateRange.dateTo, branchId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Prepare chart data
  const revenueChartData = revenueStats.map(point => ({
    name: point.periodLabel,
    revenue: point.revenue,
    bookings: point.bookingCount,
  }));

  const paymentMethodData = paymentMethods ? [
    { name: 'Tiền mặt', value: paymentMethods.cash || 0 },
    { name: 'Thẻ', value: paymentMethods.card || 0 },
    { name: 'Chuyển khoản', value: paymentMethods.transfer || 0 },
    { name: 'VNPay', value: paymentMethods.vnpay || 0 },
  ].filter(item => item.value > 0) : [];

  const bookingSourceData = bookingSources ? [
    { name: 'Website', value: bookingSources.website || 0 },
    { name: 'App', value: bookingSources.app || 0 },
    { name: 'Walk-in', value: bookingSources.walkIn || 0 },
    { name: 'Đối tác', value: bookingSources.partner || 0 },
  ].filter(item => item.value > 0) : [];

  const customerGrowthData = customerGrowth.map(point => ({
    name: point.periodLabel,
    customers: point.customers,
  }));

  // Prepare export data
  const getExportData = useCallback((): OverviewExportData => {
    return {
      dateRange: {
        from: dateRange.dateFrom,
        to: dateRange.dateTo,
      },
      overview: {
        totalRevenue: overview?.totalRevenue || 0,
        totalBookings: overview?.totalBookings || 0,
        totalCustomers: overview?.newCustomers || 0,
        occupancyRate: occupancyStats?.occupancyRate || 0,
      },
      revenueByMonth: revenueStats.map(point => ({
        period: point.periodLabel,
        revenue: point.revenue,
        bookings: point.bookingCount,
      })),
      topRoomTypes: topRoomTypes.map(rt => ({
        name: rt.roomTypeName,
        bookings: rt.bookings,
      })),
    };
  }, [dateRange, overview, occupancyStats, revenueStats, topRoomTypes]);

  // Export handlers
  const handleExportPDF = async () => {
    await exportOverviewReport(getExportData(), 'pdf');
  };

  const handleExportExcel = async () => {
    await exportOverviewReport(getExportData(), 'excel');
  };

  const handleExportCSV = async () => {
    await exportOverviewReport(getExportData(), 'csv');
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Báo cáo tổng quan</h1>
          <p className="text-gray-500 mt-1">Xem tổng quan hoạt động kinh doanh của hệ thống</p>
        </div>
        <ExportButtons
          onExportPDF={handleExportPDF}
          onExportExcel={handleExportExcel}
          onExportCSV={handleExportCSV}
          loading={loading}
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-end gap-4">
        <ReportDateRangeFilter
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          onRefresh={fetchData}
          loading={loading}
        />
        <BranchSelector
          value={branchId}
          onChange={setBranchId}
        />
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <ReportStatCard
          title="Tổng doanh thu"
          value={formatCurrency(overview?.totalRevenue || 0)}
          subtitle="Tổng doanh thu trong kỳ"
          icon={DollarSign}
          trend={{ value: 12.5, label: 'so với kỳ trước' }}
          variant="primary"
          loading={loading}
        />
        <ReportStatCard
          title="Tổng đặt phòng"
          value={(overview?.totalBookings || 0).toLocaleString()}
          subtitle="Số lượt đặt phòng"
          icon={CalendarCheck}
          trend={{ value: 8.2, label: 'so với kỳ trước' }}
          variant="success"
          loading={loading}
        />
        <ReportStatCard
          title="Khách hàng mới"
          value={(overview?.newCustomers || 0).toLocaleString()}
          subtitle="Khách hàng đăng ký mới"
          icon={Users}
          trend={{ value: 15.3, label: 'so với kỳ trước' }}
          variant="info"
          loading={loading}
        />
        <ReportStatCard
          title="Tỷ lệ lấp đầy"
          value={`${(occupancyStats?.occupancyRate || 0).toFixed(1)}%`}
          subtitle="Tỷ lệ phòng được sử dụng"
          icon={Building2}
          trend={{ value: 5.1, label: 'so với kỳ trước' }}
          variant="warning"
          loading={loading}
        />
      </div>

      {/* Charts Section */}
      <Tabs defaultValue="revenue" className="space-y-4">
        <TabsList className="bg-gray-100 p-1">
          <TabsTrigger value="revenue" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            Doanh thu
          </TabsTrigger>
          <TabsTrigger value="bookings" className="gap-2">
            <CalendarCheck className="h-4 w-4" />
            Đặt phòng
          </TabsTrigger>
          <TabsTrigger value="customers" className="gap-2">
            <Users className="h-4 w-4" />
            Khách hàng
          </TabsTrigger>
        </TabsList>

        {/* Revenue Tab */}
        <TabsContent value="revenue" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Revenue Chart */}
            <ReportChartCard
              title="Biểu đồ doanh thu"
              subtitle="Doanh thu theo thời gian"
              loading={loading}
              className="lg:col-span-2"
              minHeight="350px"
            >
              {revenueChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={350}>
                  <AreaChart data={revenueChartData}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tickFormatter={(value) => formatCurrency(value)} tick={{ fontSize: 12 }} />
                    <Tooltip 
                      formatter={(value: number) => [formatCurrency(value), 'Doanh thu']}
                      contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#f59e0b"
                      strokeWidth={2}
                      fill="url(#colorRevenue)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <ReportEmptyState
                  title="Chưa có dữ liệu doanh thu"
                  description="Không có dữ liệu doanh thu trong khoảng thời gian đã chọn"
                />
              )}
            </ReportChartCard>

            {/* Payment Methods Pie Chart */}
            <ReportChartCard
              title="Phương thức thanh toán"
              subtitle="Tỷ lệ các phương thức"
              loading={loading}
              minHeight="350px"
            >
              {paymentMethodData.length > 0 ? (
                <ResponsiveContainer width="100%" height={350}>
                  <RechartsPie>
                    <Pie
                      data={paymentMethodData}
                      cx="50%"
                      cy="45%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {paymentMethodData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => [formatCurrency(value), 'Doanh thu']} />
                    <Legend />
                  </RechartsPie>
                </ResponsiveContainer>
              ) : (
                <ReportEmptyState
                  title="Chưa có dữ liệu"
                  description="Không có dữ liệu phương thức thanh toán"
                />
              )}
            </ReportChartCard>
          </div>
        </TabsContent>

        {/* Bookings Tab */}
        <TabsContent value="bookings" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Bookings Bar Chart */}
            <ReportChartCard
              title="Số lượng đặt phòng"
              subtitle="Đặt phòng theo thời gian"
              loading={loading}
              className="lg:col-span-2"
              minHeight="350px"
            >
              {revenueChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={revenueChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
                    />
                    <Bar dataKey="bookings" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Đặt phòng" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <ReportEmptyState
                  title="Chưa có dữ liệu đặt phòng"
                  description="Không có dữ liệu đặt phòng trong khoảng thời gian đã chọn"
                />
              )}
            </ReportChartCard>

            {/* Booking Sources */}
            <ReportChartCard
              title="Nguồn đặt phòng"
              subtitle="Tỷ lệ các nguồn"
              loading={loading}
              minHeight="350px"
            >
              {bookingSourceData.length > 0 ? (
                <ResponsiveContainer width="100%" height={350}>
                  <RechartsPie>
                    <Pie
                      data={bookingSourceData}
                      cx="50%"
                      cy="45%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {bookingSourceData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </RechartsPie>
                </ResponsiveContainer>
              ) : (
                <ReportEmptyState
                  title="Chưa có dữ liệu"
                  description="Không có dữ liệu nguồn đặt phòng"
                />
              )}
            </ReportChartCard>
          </div>

          {/* Top Room Types */}
          <ReportChartCard
            title="Loại phòng phổ biến"
            subtitle="Top 10 loại phòng được đặt nhiều nhất"
            loading={loading}
            minHeight="300px"
          >
            {topRoomTypes.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topRoomTypes} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis type="number" tick={{ fontSize: 12 }} />
                  <YAxis 
                    dataKey="roomTypeName" 
                    type="category" 
                    width={150}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
                  />
                  <Bar dataKey="bookingCount" fill="#10b981" radius={[0, 4, 4, 0]} name="Số lượt đặt" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <ReportEmptyState
                title="Chưa có dữ liệu"
                description="Không có dữ liệu loại phòng"
              />
            )}
          </ReportChartCard>
        </TabsContent>

        {/* Customers Tab */}
        <TabsContent value="customers" className="space-y-4">
          <ReportChartCard
            title="Tăng trưởng khách hàng"
            subtitle="Khách hàng mới và quay lại theo thời gian"
            loading={loading}
            minHeight="400px"
          >
            {customerGrowthData.length > 0 ? (
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={customerGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="newCustomers" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    name="Khách mới"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="returningCustomers" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    name="Khách quay lại"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="total" 
                    stroke="#f59e0b" 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    name="Tổng"
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <ReportEmptyState
                title="Chưa có dữ liệu"
                description="Không có dữ liệu tăng trưởng khách hàng"
              />
            )}
          </ReportChartCard>
        </TabsContent>
      </Tabs>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-amber-700">Doanh thu trung bình/ngày</p>
                <p className="text-xl font-bold text-amber-900">
                  {formatCurrency((overview?.totalRevenue || 0) / 30)}
                </p>
              </div>
              <div className="bg-amber-200 p-2 rounded-lg">
                <TrendingUp className="h-5 w-5 text-amber-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-700">Đặt phòng trung bình/ngày</p>
                <p className="text-xl font-bold text-blue-900">
                  {((overview?.totalBookings || 0) / 30).toFixed(1)}
                </p>
              </div>
              <div className="bg-blue-200 p-2 rounded-lg">
                <CalendarCheck className="h-5 w-5 text-blue-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-700">Giá trị trung bình/đơn</p>
                <p className="text-xl font-bold text-green-900">
                  {formatCurrency((overview?.totalRevenue || 0) / (overview?.totalBookings || 1))}
                </p>
              </div>
              <div className="bg-green-200 p-2 rounded-lg">
                <DollarSign className="h-5 w-5 text-green-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-700">Phòng trống</p>
                <p className="text-xl font-bold text-purple-900">
                  {occupancyStats?.availableRooms || 0} / {occupancyStats?.totalRooms || 0}
                </p>
              </div>
              <div className="bg-purple-200 p-2 rounded-lg">
                <Building2 className="h-5 w-5 text-purple-700" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}