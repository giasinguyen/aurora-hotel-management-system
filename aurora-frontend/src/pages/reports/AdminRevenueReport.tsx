import { useState, useEffect, useCallback } from 'react';
import {
  DollarSign,
  TrendingUp,
  Building2,
  CalendarCheck,
  Users,
  BarChart3,
  PieChart as PieChartIcon,
} from 'lucide-react';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  Line,
  ComposedChart,
  Legend,
  PieChart as RechartsPie,
  Pie,
  Cell,
  BarChart,
  Bar,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  ReportEmptyState,
} from '@/components/custom/reports';
import { 
  getRevenueStatistics, 
  getRevenueByPaymentMethod,
  getAdminOverview,
} from '@/services/dashboardApi';
import { getBranchComparison } from '@/services/reportApi';
import { exportRevenueReport, type RevenueExportData } from '@/utils/exportUtils';
import type { ReportDateRange, BranchComparisonData } from '@/types/report.types';
import type { 
  RevenueStatistics, 
  PaymentMethodRevenue,
  DashboardOverview,
  DashboardGroupBy,
} from '@/types/dashboard.types';
import { toast } from 'sonner';

// Colors
const BRANCH_COLORS = ['#f59e0b', '#3b82f6', '#10b981', '#ef4444', '#8b5cf6', '#ec4899'];

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

export default function AdminRevenueReport() {
  // State
  const [dateRange, setDateRange] = useState<ReportDateRange>({
    dateFrom: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    dateTo: new Date().toISOString().split('T')[0],
  });
  const [groupBy, setGroupBy] = useState<DashboardGroupBy>('MONTH');
  const [loading, setLoading] = useState(false);

  // Data states
  const [overview, setOverview] = useState<DashboardOverview | null>(null);
  const [revenueStats, setRevenueStats] = useState<RevenueStatistics[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodRevenue | null>(null);
  const [branchData, setBranchData] = useState<BranchComparisonData[]>([]);

  // Fetch data
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      
      const [overviewRes, revenueRes, paymentRes, branchRes] = await Promise.all([
        getAdminOverview(dateRange.dateFrom || undefined, dateRange.dateTo || undefined),
        getRevenueStatistics(dateRange.dateFrom || undefined, dateRange.dateTo || undefined, groupBy),
        getRevenueByPaymentMethod(dateRange.dateFrom || undefined, dateRange.dateTo || undefined),
        getBranchComparison(dateRange.dateFrom, dateRange.dateTo),
      ]);

      setOverview(overviewRes);
      setRevenueStats(revenueRes);
      setPaymentMethods(paymentRes);
      setBranchData(branchRes);
    } catch (error) {
      console.error('Failed to fetch admin revenue data:', error);
      toast.error('Không thể tải dữ liệu doanh thu');
    } finally {
      setLoading(false);
    }
  }, [dateRange.dateFrom, dateRange.dateTo, groupBy]);

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

  const paymentMethodData = paymentMethods ? [
    { name: 'Tiền mặt', value: paymentMethods.cash || 0, color: '#10b981' },
    { name: 'Thẻ', value: paymentMethods.card || 0, color: '#3b82f6' },
    { name: 'Chuyển khoản', value: paymentMethods.transfer || 0, color: '#f59e0b' },
    { name: 'VNPay', value: paymentMethods.vnpay || 0, color: '#8b5cf6' },
  ].filter(item => item.value > 0) : [];

  const branchRevenueData = branchData.map((b, index) => ({
    name: b.branchCode,
    fullName: b.branchName,
    revenue: b.totalRevenue,
    bookings: b.totalBookings,
    color: BRANCH_COLORS[index % BRANCH_COLORS.length],
  }));

  // Calculate totals
  const totalRevenue = branchData.reduce((sum, b) => sum + b.totalRevenue, 0);
  const totalBookings = branchData.reduce((sum, b) => sum + b.totalBookings, 0);
  const avgRevenue = totalBookings > 0 ? totalRevenue / totalBookings : 0;

  // Prepare export data
  const getExportData = useCallback((): RevenueExportData => {
    const paymentTotal = paymentMethodData.reduce((sum, p) => sum + p.value, 0);
    return {
      dateRange: {
        from: dateRange.dateFrom,
        to: dateRange.dateTo,
      },
      totalRevenue: overview?.totalRevenue || totalRevenue,
      totalBookings: overview?.totalBookings || totalBookings,
      averageBookingValue: avgRevenue || (overview?.totalRevenue || 0) / (overview?.totalBookings || 1),
      revenueGrowth: 15.3, // TODO: Calculate from actual data
      revenueData: revenueChartData.map(item => ({
        period: item.name,
        revenue: item.revenue,
        bookings: item.bookings,
      })),
      branchRevenue: branchData.map(b => ({
        branchName: b.branchName,
        revenue: b.totalRevenue,
        bookings: b.totalBookings,
        percentage: totalRevenue > 0 ? (b.totalRevenue / totalRevenue) * 100 : 0,
      })),
      paymentMethods: paymentMethodData.map(p => ({
        method: p.name,
        amount: p.value,
        percentage: paymentTotal > 0 ? (p.value / paymentTotal) * 100 : 0,
      })),
    };
  }, [dateRange, overview, totalRevenue, totalBookings, avgRevenue, revenueChartData, branchData, paymentMethodData]);

  // Export handlers
  const handleExportPDF = async () => {
    await exportRevenueReport(getExportData(), 'pdf');
  };

  const handleExportExcel = async () => {
    await exportRevenueReport(getExportData(), 'excel');
  };

  const handleExportCSV = async () => {
    await exportRevenueReport(getExportData(), 'csv');
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Báo cáo doanh thu tổng hợp</h1>
          <p className="text-gray-500 mt-1">Phân tích doanh thu toàn hệ thống và theo chi nhánh</p>
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
          title="Tổng doanh thu hệ thống"
          value={formatCurrency(overview?.totalRevenue || totalRevenue)}
          subtitle="Tất cả chi nhánh"
          icon={DollarSign}
          trend={{ value: 15.3, label: 'so với kỳ trước' }}
          variant="primary"
          loading={loading}
        />
        <ReportStatCard
          title="Tổng đặt phòng"
          value={(overview?.totalBookings || totalBookings).toLocaleString()}
          subtitle="Số lượt đặt phòng"
          icon={CalendarCheck}
          trend={{ value: 12.1 }}
          variant="success"
          loading={loading}
        />
        <ReportStatCard
          title="Giá trị trung bình/đơn"
          value={formatCurrency(avgRevenue || (overview?.totalRevenue || 0) / (overview?.totalBookings || 1))}
          subtitle="Doanh thu/đặt phòng"
          icon={BarChart3}
          trend={{ value: 5.8 }}
          variant="info"
          loading={loading}
        />
        <ReportStatCard
          title="Số chi nhánh"
          value={branchData.length.toString()}
          subtitle="Chi nhánh hoạt động"
          icon={Building2}
          variant="warning"
          loading={loading}
        />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="trend" className="space-y-4">
        <TabsList className="bg-gray-100 p-1">
          <TabsTrigger value="trend" className="gap-2">
            <TrendingUp className="h-4 w-4" />
            Xu hướng
          </TabsTrigger>
          <TabsTrigger value="branches" className="gap-2">
            <Building2 className="h-4 w-4" />
            Chi nhánh
          </TabsTrigger>
          <TabsTrigger value="payment" className="gap-2">
            <PieChartIcon className="h-4 w-4" />
            Thanh toán
          </TabsTrigger>
        </TabsList>

        {/* Trend Tab */}
        <TabsContent value="trend" className="space-y-4">
          <ReportChartCard
            title="Xu hướng doanh thu hệ thống"
            subtitle={`Doanh thu theo ${groupBy === 'DAY' ? 'ngày' : groupBy === 'WEEK' ? 'tuần' : groupBy === 'MONTH' ? 'tháng' : groupBy === 'QUARTER' ? 'quý' : 'năm'}`}
            loading={loading}
            minHeight="400px"
          >
            {revenueChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={400}>
                <ComposedChart data={revenueChartData}>
                  <defs>
                    <linearGradient id="adminRevenueGradient" x1="0" y1="0" x2="0" y2="1">
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
                    fill="url(#adminRevenueGradient)"
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
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="average"
                    stroke="#10b981"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={{ r: 3 }}
                    name="Trung bình/đơn"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            ) : (
              <ReportEmptyState
                title="Chưa có dữ liệu"
                description="Không có dữ liệu xu hướng doanh thu"
              />
            )}
          </ReportChartCard>
        </TabsContent>

        {/* Branches Tab */}
        <TabsContent value="branches" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Branch Revenue Bar Chart */}
            <ReportChartCard
              title="Doanh thu theo chi nhánh"
              subtitle="So sánh doanh thu các chi nhánh"
              loading={loading}
              minHeight="400px"
            >
              {branchRevenueData.length > 0 ? (
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={branchRevenueData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis type="number" tickFormatter={(value) => formatCurrency(value)} tick={{ fontSize: 12 }} />
                    <YAxis 
                      dataKey="name" 
                      type="category" 
                      width={80}
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip 
                      formatter={(value: number) => [formatFullCurrency(value), 'Doanh thu']}
                      labelFormatter={(label) => {
                        const branch = branchRevenueData.find(b => b.name === label);
                        return branch?.fullName || label;
                      }}
                      contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
                    />
                    <Bar dataKey="revenue" radius={[0, 4, 4, 0]}>
                      {branchRevenueData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <ReportEmptyState
                  title="Chưa có dữ liệu"
                  description="Không có dữ liệu doanh thu chi nhánh"
                />
              )}
            </ReportChartCard>

            {/* Branch Pie Chart */}
            <ReportChartCard
              title="Tỷ trọng doanh thu"
              subtitle="Phần trăm doanh thu mỗi chi nhánh"
              loading={loading}
              minHeight="400px"
            >
              {branchRevenueData.length > 0 ? (
                <ResponsiveContainer width="100%" height={400}>
                  <RechartsPie>
                    <Pie
                      data={branchRevenueData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={3}
                      dataKey="revenue"
                      label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                    >
                      {branchRevenueData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => [formatFullCurrency(value), 'Doanh thu']} />
                    <Legend />
                  </RechartsPie>
                </ResponsiveContainer>
              ) : (
                <ReportEmptyState
                  title="Chưa có dữ liệu"
                  description="Không có dữ liệu tỷ trọng"
                />
              )}
            </ReportChartCard>
          </div>

          {/* Branch Table */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Chi tiết doanh thu theo chi nhánh</CardTitle>
            </CardHeader>
            <CardContent>
              {branchData.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>#</TableHead>
                        <TableHead>Chi nhánh</TableHead>
                        <TableHead>Thành phố</TableHead>
                        <TableHead className="text-right">Doanh thu</TableHead>
                        <TableHead className="text-right">Tỷ trọng</TableHead>
                        <TableHead className="text-right">Đặt phòng</TableHead>
                        <TableHead className="text-right">TB/đơn</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {branchData
                        .sort((a, b) => b.totalRevenue - a.totalRevenue)
                        .map((branch, index) => {
                          const percentage = totalRevenue > 0 
                            ? (branch.totalRevenue / totalRevenue) * 100 
                            : 0;
                          const avg = branch.totalBookings > 0 
                            ? branch.totalRevenue / branch.totalBookings 
                            : 0;
                          return (
                            <TableRow key={branch.branchId}>
                              <TableCell>
                                <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                                  index === 0 ? 'bg-amber-100 text-amber-700' :
                                  index === 1 ? 'bg-gray-100 text-gray-700' :
                                  index === 2 ? 'bg-orange-100 text-orange-700' :
                                  'bg-gray-50 text-gray-500'
                                }`}>
                                  {index + 1}
                                </span>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <div 
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: BRANCH_COLORS[index % BRANCH_COLORS.length] }}
                                  />
                                  <div>
                                    <p className="font-medium">{branch.branchName}</p>
                                    <p className="text-xs text-gray-500">{branch.branchCode}</p>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>{branch.city}</TableCell>
                              <TableCell className="text-right font-semibold text-amber-600">
                                {formatFullCurrency(branch.totalRevenue)}
                              </TableCell>
                              <TableCell className="text-right">
                                {percentage.toFixed(1)}%
                              </TableCell>
                              <TableCell className="text-right">{branch.totalBookings}</TableCell>
                              <TableCell className="text-right text-gray-500">
                                {formatCurrency(avg)}
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
                  description="Không có dữ liệu chi nhánh"
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment Tab */}
        <TabsContent value="payment" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ReportChartCard
              title="Phương thức thanh toán"
              subtitle="Tỷ lệ doanh thu theo phương thức"
              loading={loading}
              minHeight="400px"
            >
              {paymentMethodData.length > 0 ? (
                <ResponsiveContainer width="100%" height={400}>
                  <RechartsPie>
                    <Pie
                      data={paymentMethodData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={3}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                    >
                      {paymentMethodData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => [formatFullCurrency(value), 'Doanh thu']} />
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

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Chi tiết thanh toán</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {paymentMethodData.map((method, index) => {
                  const total = paymentMethodData.reduce((sum, m) => sum + m.value, 0);
                  const percentage = total > 0 ? (method.value / total) * 100 : 0;
                  return (
                    <div key={index}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-4 h-4 rounded"
                            style={{ backgroundColor: method.color }}
                          />
                          <span className="font-medium">{method.name}</span>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{formatFullCurrency(method.value)}</p>
                          <p className="text-sm text-gray-500">{percentage.toFixed(1)}%</p>
                        </div>
                      </div>
                      <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all"
                          style={{ 
                            width: `${percentage}%`,
                            backgroundColor: method.color,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="bg-green-200 p-3 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-700" />
              </div>
              <div>
                <p className="text-sm text-green-700">Chi nhánh doanh thu cao nhất</p>
                <p className="text-lg font-bold text-green-900">
                  {branchData.sort((a, b) => b.totalRevenue - a.totalRevenue)[0]?.branchName || '-'}
                </p>
                <p className="text-xl font-bold text-green-800">
                  {formatCurrency(branchData.sort((a, b) => b.totalRevenue - a.totalRevenue)[0]?.totalRevenue || 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="bg-amber-200 p-3 rounded-lg">
                <BarChart3 className="h-6 w-6 text-amber-700" />
              </div>
              <div>
                <p className="text-sm text-amber-700">Doanh thu trung bình/chi nhánh</p>
                <p className="text-xl font-bold text-amber-900">
                  {formatCurrency(branchData.length > 0 ? totalRevenue / branchData.length : 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="bg-blue-200 p-3 rounded-lg">
                <Users className="h-6 w-6 text-blue-700" />
              </div>
              <div>
                <p className="text-sm text-blue-700">Đặt phòng trung bình/chi nhánh</p>
                <p className="text-xl font-bold text-blue-900">
                  {branchData.length > 0 ? Math.round(totalBookings / branchData.length) : 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}