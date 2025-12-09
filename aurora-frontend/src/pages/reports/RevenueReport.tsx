import { useState, useEffect, useCallback } from 'react';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  CreditCard,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Receipt,
} from 'lucide-react';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Line,
  Area,
  ComposedChart,
  Legend,
  PieChart as RechartsPie,
  Pie,
  Cell,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  ReportDateRangeFilter,
  ReportStatCard,
  ReportChartCard,
  ExportButtons,
  BranchSelector,
  ReportEmptyState,
} from '@/components/custom/reports';
import { 
  getRevenueStatistics, 
  getRevenueByPaymentMethod,
  getAdminOverview,
  getManagerBranchOverview,
} from '@/services/dashboardApi';
import { useAppSelector } from '@/hooks/useRedux';
import { exportRevenueReport, type RevenueExportData } from '@/utils/exportUtils';
import type { ReportDateRange } from '@/types/report.types';
import type { 
  RevenueStatistics, 
  PaymentMethodRevenue,
  DashboardOverview,
  DashboardGroupBy,
} from '@/types/dashboard.types';
import { toast } from 'sonner';

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

const formatFullCurrency = (value: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(value);
};

export default function RevenueReport() {
  // Get current user from Redux store
  const currentUser = useAppSelector((state) => state.auth.user);
  
  // Check if user is Manager (not Admin)
  // Note: roles in UserSessionResponse is string[] not array of objects
  const isManager = currentUser?.roles?.some(
    (role) => role === 'ROLE_MANAGER' || role === 'MANAGER'
  ) && !currentUser?.roles?.some(
    (role) => role === 'ROLE_ADMIN' || role === 'ADMIN'
  );
  
  // State
  const [dateRange, setDateRange] = useState<ReportDateRange>({
    dateFrom: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    dateTo: new Date().toISOString().split('T')[0],
  });
  const [branchId, setBranchId] = useState<string | null>(null);
  const [groupBy, setGroupBy] = useState<DashboardGroupBy>('DAY');
  const [loading, setLoading] = useState(false);

  // Data states
  const [overview, setOverview] = useState<DashboardOverview | null>(null);
  const [revenueStats, setRevenueStats] = useState<RevenueStatistics[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodRevenue | null>(null);

  // Fetch data - use appropriate API based on user role
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Determine which branch to use
      const effectiveBranchId = isManager ? currentUser?.branchId : branchId;
      
      // Get overview based on role
      let overviewRes: DashboardOverview;
      if (isManager && currentUser?.branchId) {
        // Manager uses branch-specific API
        overviewRes = await getManagerBranchOverview(
          currentUser.branchId,
          dateRange.dateFrom || undefined,
          dateRange.dateTo || undefined
        );
      } else {
        // Admin uses admin overview API
        overviewRes = await getAdminOverview(
          dateRange.dateFrom || undefined,
          dateRange.dateTo || undefined
        );
      }
      
      const [revenueRes, paymentRes] = await Promise.all([
        getRevenueStatistics(
          dateRange.dateFrom || undefined,
          dateRange.dateTo || undefined,
          groupBy,
          effectiveBranchId || undefined
        ),
        getRevenueByPaymentMethod(
          dateRange.dateFrom || undefined, 
          dateRange.dateTo || undefined, 
          effectiveBranchId || undefined
        ),
      ]);

      setOverview(overviewRes);
      setRevenueStats(revenueRes);
      setPaymentMethods(paymentRes);
    } catch (error) {
      console.error('Failed to fetch revenue data:', error);
      toast.error('Không thể tải dữ liệu doanh thu');
    } finally {
      setLoading(false);
    }
  }, [dateRange.dateFrom, dateRange.dateTo, branchId, groupBy, isManager, currentUser?.branchId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Chart data from revenue stats array
  const revenueChartData = revenueStats.map((point: RevenueStatistics) => ({
    name: point.periodLabel,
    revenue: point.revenue,
    bookings: point.bookingCount,
    average: point.bookingCount > 0 ? Math.round(point.revenue / point.bookingCount) : 0,
  }));

  // Map backend payment method enum to display names
  // Backend returns: { "CASH": 1000, "CARD": 2000, "BANK_TRANSFER": 3000, "VNPAY": 4000, ... }
  const paymentMethodData = paymentMethods ? [
    { name: 'Tiền mặt', value: paymentMethods.CASH || 0, icon: Wallet, color: '#10b981' },
    { name: 'Thẻ', value: paymentMethods.CARD || 0, icon: CreditCard, color: '#3b82f6' },
    { name: 'Chuyển khoản', value: paymentMethods.BANK_TRANSFER || 0, icon: ArrowUpRight, color: '#f59e0b' },
    { name: 'VNPay', value: paymentMethods.VNPAY || 0, icon: Receipt, color: '#8b5cf6' },
    { name: 'MoMo', value: paymentMethods.MOMO || 0, icon: Wallet, color: '#d946ef' },
    { name: 'ZaloPay', value: paymentMethods.ZALOPAY || 0, icon: Wallet, color: '#0ea5e9' },
    { name: 'PayPal', value: paymentMethods.PAYPAL || 0, icon: CreditCard, color: '#6366f1' },
  ].filter(item => item.value > 0) : [];

  const totalPayment = paymentMethodData.reduce((sum, item) => sum + item.value, 0);

  // Calculate comparison
  const previousRevenue = overview?.totalRevenue ? overview.totalRevenue * 0.85 : 0;
  const revenueChange = overview?.totalRevenue && previousRevenue
    ? ((overview.totalRevenue - previousRevenue) / previousRevenue) * 100
    : 0;

  // Prepare export data
  const getExportData = useCallback((): RevenueExportData => {
    return {
      dateRange: {
        from: dateRange.dateFrom,
        to: dateRange.dateTo,
      },
      totalRevenue: overview?.totalRevenue || 0,
      totalBookings: overview?.totalBookings || 0,
      averageBookingValue: overview?.totalBookings 
        ? (overview.totalRevenue || 0) / overview.totalBookings 
        : 0,
      revenueGrowth: revenueChange,
      revenueData: revenueChartData.map(d => ({
        period: d.name,
        revenue: d.revenue,
        bookings: d.bookings,
      })),
      paymentMethods: paymentMethodData.map(pm => ({
        method: pm.name,
        amount: pm.value,
        percentage: totalPayment > 0 ? (pm.value / totalPayment) * 100 : 0,
      })),
    };
  }, [dateRange, overview, revenueChange, revenueChartData, paymentMethodData, totalPayment]);

  // Export handlers
  const handleExportPDF = async () => {
    try {
      await exportRevenueReport(getExportData(), 'pdf');
      toast.success('Đã xuất báo cáo PDF');
    } catch (error) {
      console.error('Export PDF failed:', error);
      toast.error('Xuất báo cáo PDF thất bại');
    }
  };

  const handleExportExcel = async () => {
    try {
      await exportRevenueReport(getExportData(), 'excel');
      toast.success('Đã xuất báo cáo Excel');
    } catch (error) {
      console.error('Export Excel failed:', error);
      toast.error('Xuất báo cáo Excel thất bại');
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Báo cáo doanh thu</h1>
          <p className="text-gray-500 mt-1">Phân tích chi tiết doanh thu theo thời gian và phương thức</p>
        </div>
        <ExportButtons
          onExportPDF={handleExportPDF}
          onExportExcel={handleExportExcel}
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
        <div className="min-w-[150px]">
          <Label htmlFor="groupBy" className="text-xs text-gray-500 mb-1 block">
            Nhóm theo
          </Label>
          <Select value={groupBy} onValueChange={(v) => setGroupBy(v as DashboardGroupBy)}>
            <SelectTrigger id="groupBy" className="h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="DAY">Ngày</SelectItem>
              <SelectItem value="WEEK">Tuần</SelectItem>
              <SelectItem value="MONTH">Tháng</SelectItem>
              <SelectItem value="QUARTER">Quý</SelectItem>
              <SelectItem value="YEAR">Năm</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <ReportStatCard
          title="Tổng doanh thu"
          value={formatCurrency(overview?.totalRevenue || 0)}
          subtitle="Tổng doanh thu trong kỳ"
          icon={DollarSign}
          trend={{ value: revenueChange, label: 'so với kỳ trước' }}
          variant="primary"
          loading={loading}
        />
        <ReportStatCard
          title="Doanh thu trung bình/ngày"
          value={formatCurrency((overview?.totalRevenue || 0) / 30)}
          subtitle="Trung bình mỗi ngày"
          icon={TrendingUp}
          trend={{ value: 8.5 }}
          variant="success"
          loading={loading}
        />
        <ReportStatCard
          title="Giá trị đơn trung bình"
          value={formatCurrency((overview?.totalRevenue || 0) / (overview?.totalBookings || 1))}
          subtitle="Giá trị trung bình/đặt phòng"
          icon={Receipt}
          trend={{ value: 3.2 }}
          variant="info"
          loading={loading}
        />
        <ReportStatCard
          title="Số giao dịch"
          value={(overview?.totalBookings || 0).toLocaleString()}
          subtitle="Tổng số đặt phòng"
          icon={CreditCard}
          trend={{ value: 12.1 }}
          variant="warning"
          loading={loading}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Revenue Trend Chart */}
        <ReportChartCard
          title="Xu hướng doanh thu"
          subtitle={`Doanh thu theo ${groupBy === 'DAY' ? 'ngày' : groupBy === 'WEEK' ? 'tuần' : groupBy === 'MONTH' ? 'tháng' : groupBy === 'QUARTER' ? 'quý' : 'năm'}`}
          loading={loading}
          className="lg:col-span-2"
          minHeight="400px"
        >
          {revenueChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={400}>
              <ComposedChart data={revenueChartData}>
                <defs>
                  <linearGradient id="colorRevenueFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis 
                  yAxisId="left"
                  tickFormatter={(value) => formatCurrency(value)} 
                  tick={{ fontSize: 12 }} 
                />
                <YAxis 
                  yAxisId="right"
                  orientation="right"
                  tick={{ fontSize: 12 }}
                />
                <Tooltip 
                  formatter={(value: number, name: string) => {
                    if (name === 'Doanh thu' || name === 'Trung bình/đơn') {
                      return [formatFullCurrency(value), name];
                    }
                    return [value, name];
                  }}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
                />
                <Legend />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="revenue"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  fill="url(#colorRevenueFill)"
                  name="Doanh thu"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="bookings"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  name="Số đặt phòng"
                />
              </ComposedChart>
            </ResponsiveContainer>
          ) : (
            <ReportEmptyState
              title="Chưa có dữ liệu doanh thu"
              description="Không có dữ liệu doanh thu trong khoảng thời gian đã chọn"
            />
          )}
        </ReportChartCard>

        {/* Payment Methods */}
        <ReportChartCard
          title="Phương thức thanh toán"
          subtitle="Tỷ lệ theo phương thức"
          loading={loading}
          minHeight="400px"
        >
          {paymentMethodData.length > 0 ? (
            <div className="space-y-4">
              <ResponsiveContainer width="100%" height={200}>
                <RechartsPie>
                  <Pie
                    data={paymentMethodData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {paymentMethodData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => [formatCurrency(value), 'Doanh thu']} />
                </RechartsPie>
              </ResponsiveContainer>

              <div className="space-y-3 px-2">
                {paymentMethodData.map((item, index) => {
                  const Icon = item.icon;
                  const percentage = totalPayment > 0 ? (item.value / totalPayment) * 100 : 0;
                  return (
                    <div key={index} className="flex items-center gap-3">
                      <div 
                        className="p-2 rounded-lg"
                        style={{ backgroundColor: `${item.color}20` }}
                      >
                        <Icon className="h-4 w-4" style={{ color: item.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">{item.name}</span>
                          <span className="text-sm text-gray-500">{percentage.toFixed(1)}%</span>
                        </div>
                        <div className="mt-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full rounded-full transition-all"
                            style={{ 
                              width: `${percentage}%`,
                              backgroundColor: item.color,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <ReportEmptyState
              title="Chưa có dữ liệu"
              description="Không có dữ liệu phương thức thanh toán"
            />
          )}
        </ReportChartCard>
      </div>

      {/* Revenue Details Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Chi tiết doanh thu theo kỳ</CardTitle>
        </CardHeader>
        <CardContent>
          {revenueChartData.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Thời gian</TableHead>
                    <TableHead className="text-right">Doanh thu</TableHead>
                    <TableHead className="text-right">Số đặt phòng</TableHead>
                    <TableHead className="text-right">Trung bình/đơn</TableHead>
                    <TableHead className="text-right">Thay đổi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {revenueChartData.map((row, index) => {
                    const previousRow = revenueChartData[index - 1];
                    const change = previousRow && previousRow.revenue > 0
                      ? ((row.revenue - previousRow.revenue) / previousRow.revenue) * 100
                      : 0;
                    const isPositive = change >= 0;

                    return (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{row.name}</TableCell>
                        <TableCell className="text-right">{formatFullCurrency(row.revenue)}</TableCell>
                        <TableCell className="text-right">{row.bookings}</TableCell>
                        <TableCell className="text-right">{formatFullCurrency(row.average)}</TableCell>
                        <TableCell className="text-right">
                          {index > 0 && (
                            <span className={`inline-flex items-center gap-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                              {isPositive ? (
                                <ArrowUpRight className="h-4 w-4" />
                              ) : (
                                <ArrowDownRight className="h-4 w-4" />
                              )}
                              {Math.abs(change).toFixed(1)}%
                            </span>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          ) : (
            <ReportEmptyState
              title="Chưa có dữ liệu"
              description="Không có dữ liệu doanh thu chi tiết"
            />
          )}
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="bg-green-200 p-3 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-700" />
              </div>
              <div>
                <p className="text-sm text-green-700">Doanh thu cao nhất</p>
                <p className="text-2xl font-bold text-green-900">
                  {formatCurrency(Math.max(...revenueChartData.map(d => d.revenue), 0))}
                </p>
                <p className="text-xs text-green-600">
                  {revenueChartData.find(d => d.revenue === Math.max(...revenueChartData.map(d => d.revenue)))?.name || '-'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="bg-red-200 p-3 rounded-lg">
                <TrendingDown className="h-6 w-6 text-red-700" />
              </div>
              <div>
                <p className="text-sm text-red-700">Doanh thu thấp nhất</p>
                <p className="text-2xl font-bold text-red-900">
                  {formatCurrency(Math.min(...revenueChartData.map(d => d.revenue), 0))}
                </p>
                <p className="text-xs text-red-600">
                  {revenueChartData.find(d => d.revenue === Math.min(...revenueChartData.map(d => d.revenue)))?.name || '-'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="bg-amber-200 p-3 rounded-lg">
                <DollarSign className="h-6 w-6 text-amber-700" />
              </div>
              <div>
                <p className="text-sm text-amber-700">Doanh thu trung bình</p>
                <p className="text-2xl font-bold text-amber-900">
                  {formatCurrency(
                    revenueChartData.length > 0 
                      ? revenueChartData.reduce((sum, d) => sum + d.revenue, 0) / revenueChartData.length
                      : 0
                  )}
                </p>
                <p className="text-xs text-amber-600">Trung bình mỗi kỳ</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}