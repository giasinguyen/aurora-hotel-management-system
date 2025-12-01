import { useState, useEffect, useCallback } from 'react';
import {
  Clock,
  Users,
  DollarSign,
  LogIn,
  LogOut,
  CalendarCheck,
  Sun,
  Sunset,
  Moon,
} from 'lucide-react';
import {
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
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import {
  ReportDateRangeFilter,
  ReportStatCard,
  ReportChartCard,
  ExportButtons,
  BranchSelector,
  ReportEmptyState,
} from '@/components/custom/reports';
import { getShiftReport, getShiftSummary } from '@/services/reportApi';
import { exportShiftReport, type ShiftExportData } from '@/utils/exportUtils';
import type { ReportDateRange, ShiftReportData, ShiftSummary } from '@/types/report.types';
import { toast } from 'sonner';

// Colors
const SHIFT_COLORS = {
  MORNING: '#f59e0b',
  AFTERNOON: '#3b82f6',
  NIGHT: '#6b7280',
};

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

const getShiftLabel = (type: 'MORNING' | 'AFTERNOON' | 'NIGHT') => {
  switch (type) {
    case 'MORNING': return 'Ca sáng';
    case 'AFTERNOON': return 'Ca chiều';
    case 'NIGHT': return 'Ca đêm';
  }
};

const getShiftIcon = (type: 'MORNING' | 'AFTERNOON' | 'NIGHT') => {
  switch (type) {
    case 'MORNING': return Sun;
    case 'AFTERNOON': return Sunset;
    case 'NIGHT': return Moon;
  }
};

// Get default date range (last 7 days)
const getDefaultDateRange = (): ReportDateRange => {
  const today = new Date();
  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 6);
  return {
    dateFrom: weekAgo.toISOString().split('T')[0],
    dateTo: today.toISOString().split('T')[0],
  };
};

export default function ShiftReport() {
  // State
  const [dateRange, setDateRange] = useState<ReportDateRange>(getDefaultDateRange);
  const [branchId, setBranchId] = useState<string | null>(null);
  const [selectedShift, setSelectedShift] = useState<'all' | 'MORNING' | 'AFTERNOON' | 'NIGHT'>('all');
  const [loading, setLoading] = useState(false);

  // Data states
  const [shifts, setShifts] = useState<ShiftReportData[]>([]);
  const [summary, setSummary] = useState<ShiftSummary | null>(null);

  // Fetch data
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      
      const [shiftsRes, summaryRes] = await Promise.all([
        getShiftReport(dateRange.dateFrom, dateRange.dateTo, branchId),
        getShiftSummary(dateRange.dateFrom, dateRange.dateTo, branchId),
      ]);

      setShifts(shiftsRes);
      setSummary(summaryRes);
    } catch (error) {
      console.error('Failed to fetch shift data:', error);
      toast.error('Không thể tải dữ liệu ca làm');
    } finally {
      setLoading(false);
    }
  }, [dateRange.dateFrom, dateRange.dateTo, branchId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Filter shifts
  const filteredShifts = selectedShift === 'all' 
    ? shifts 
    : shifts.filter(s => s.shiftType === selectedShift);

  // Group shifts by type
  const shiftsByType = {
    MORNING: shifts.filter(s => s.shiftType === 'MORNING'),
    AFTERNOON: shifts.filter(s => s.shiftType === 'AFTERNOON'),
    NIGHT: shifts.filter(s => s.shiftType === 'NIGHT'),
  };

  // Calculate stats per shift type
  const shiftTypeStats = Object.entries(shiftsByType).map(([type, typeShifts]) => ({
    type: type as 'MORNING' | 'AFTERNOON' | 'NIGHT',
    name: getShiftLabel(type as 'MORNING' | 'AFTERNOON' | 'NIGHT'),
    shifts: typeShifts.length,
    checkIns: typeShifts.reduce((sum, s) => sum + s.checkIns, 0),
    checkOuts: typeShifts.reduce((sum, s) => sum + s.checkOuts, 0),
    revenue: typeShifts.reduce((sum, s) => sum + s.revenue, 0),
    avgRevenue: typeShifts.length > 0 
      ? typeShifts.reduce((sum, s) => sum + s.revenue, 0) / typeShifts.length 
      : 0,
  }));

  // Pie chart data for shift distribution
  const shiftDistributionData = shiftTypeStats.map(stat => ({
    name: stat.name,
    value: stat.shifts,
    revenue: stat.revenue,
    color: SHIFT_COLORS[stat.type],
  }));

  // Group by date for trend chart
  const dateGroups = shifts.reduce((acc, shift) => {
    const date = shift.shiftDate;
    if (!acc[date]) {
      acc[date] = { date, checkIns: 0, checkOuts: 0, revenue: 0, shifts: 0 };
    }
    acc[date].checkIns += shift.checkIns;
    acc[date].checkOuts += shift.checkOuts;
    acc[date].revenue += shift.revenue;
    acc[date].shifts += 1;
    return acc;
  }, {} as Record<string, { date: string; checkIns: number; checkOuts: number; revenue: number; shifts: number }>);

  const trendData = Object.values(dateGroups).sort((a, b) => a.date.localeCompare(b.date));

  // Staff performance
  const staffPerformance = shifts.reduce((acc, shift) => {
    if (!acc[shift.staffId]) {
      acc[shift.staffId] = {
        staffId: shift.staffId,
        staffName: shift.staffName,
        shifts: 0,
        checkIns: 0,
        checkOuts: 0,
        bookings: 0,
        revenue: 0,
      };
    }
    acc[shift.staffId].shifts += 1;
    acc[shift.staffId].checkIns += shift.checkIns;
    acc[shift.staffId].checkOuts += shift.checkOuts;
    acc[shift.staffId].bookings += shift.bookingsCreated;
    acc[shift.staffId].revenue += shift.revenue;
    return acc;
  }, {} as Record<string, { staffId: string; staffName: string; shifts: number; checkIns: number; checkOuts: number; bookings: number; revenue: number }>);

  const staffPerformanceList = Object.values(staffPerformance).sort((a, b) => b.revenue - a.revenue);

  // Prepare export data
  const shiftExportData: ShiftExportData[] = filteredShifts.map(shift => ({
    date: shift.shiftDate,
    shiftType: shift.shiftType === 'MORNING' ? 'Ca sáng' : shift.shiftType === 'AFTERNOON' ? 'Ca chiều' : 'Ca đêm',
    staffName: shift.staffName,
    checkIns: shift.checkIns,
    checkOuts: shift.checkOuts,
    bookings: shift.bookingsCreated,
    revenue: shift.revenue,
  }));

  // Export handlers
  const handleExportPDF = async () => {
    try {
      exportShiftReport(shiftExportData, {
        format: 'pdf',
        title: 'Báo cáo thống kê ca làm việc',
        dateRange: {
          from: dateRange.dateFrom,
          to: dateRange.dateTo,
        },
      });
      toast.success('Đã xuất báo cáo PDF thành công!');
    } catch (error) {
      console.error('Export PDF error:', error);
      toast.error('Lỗi khi xuất báo cáo PDF');
    }
  };

  const handleExportExcel = async () => {
    try {
      exportShiftReport(shiftExportData, {
        format: 'excel',
        title: 'Báo cáo thống kê ca làm việc',
        dateRange: {
          from: dateRange.dateFrom,
          to: dateRange.dateTo,
        },
      });
      toast.success('Đã xuất báo cáo Excel thành công!');
    } catch (error) {
      console.error('Export Excel error:', error);
      toast.error('Lỗi khi xuất báo cáo Excel');
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Thống kê ca làm</h1>
          <p className="text-gray-500 mt-1">Báo cáo hoạt động theo ca làm việc</p>
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
          <Label htmlFor="shiftFilter" className="text-xs text-gray-500 mb-1 block">
            Lọc ca làm
          </Label>
          <Select value={selectedShift} onValueChange={(v) => setSelectedShift(v as typeof selectedShift)}>
            <SelectTrigger id="shiftFilter" className="h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả ca</SelectItem>
              <SelectItem value="MORNING">Ca sáng</SelectItem>
              <SelectItem value="AFTERNOON">Ca chiều</SelectItem>
              <SelectItem value="NIGHT">Ca đêm</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <ReportStatCard
          title="Tổng ca làm"
          value={(summary?.totalShifts || 0).toString()}
          subtitle="Số ca trong kỳ"
          icon={Clock}
          variant="primary"
          loading={loading}
        />
        <ReportStatCard
          title="Tổng Check-in"
          value={(summary?.totalCheckIns || 0).toString()}
          subtitle="Lượt nhận phòng"
          icon={LogIn}
          variant="success"
          loading={loading}
        />
        <ReportStatCard
          title="Tổng Check-out"
          value={(summary?.totalCheckOuts || 0).toString()}
          subtitle="Lượt trả phòng"
          icon={LogOut}
          variant="info"
          loading={loading}
        />
        <ReportStatCard
          title="Tổng doanh thu"
          value={formatCurrency(summary?.totalRevenue || 0)}
          subtitle="Doanh thu trong kỳ"
          icon={DollarSign}
          trend={{ value: 8.5 }}
          variant="warning"
          loading={loading}
        />
      </div>

      {/* Shift Type Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {shiftTypeStats.map((stat) => {
          const Icon = getShiftIcon(stat.type);
          return (
            <Card 
              key={stat.type}
              className="hover:shadow-md transition-shadow cursor-pointer"
              style={{ borderColor: SHIFT_COLORS[stat.type] }}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div 
                        className="p-2 rounded-lg"
                        style={{ backgroundColor: `${SHIFT_COLORS[stat.type]}20` }}
                      >
                        <Icon className="h-5 w-5" style={{ color: SHIFT_COLORS[stat.type] }} />
                      </div>
                      <span className="font-semibold text-gray-900">{stat.name}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-3">
                      <div>
                        <p className="text-xs text-gray-500">Số ca</p>
                        <p className="text-lg font-bold">{stat.shifts}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Check-in</p>
                        <p className="text-lg font-bold">{stat.checkIns}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Check-out</p>
                        <p className="text-lg font-bold">{stat.checkOuts}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">TB/ca</p>
                        <p className="text-lg font-bold">{formatCurrency(stat.avgRevenue)}</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Doanh thu</p>
                    <p className="text-xl font-bold" style={{ color: SHIFT_COLORS[stat.type] }}>
                      {formatCurrency(stat.revenue)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Trend Chart */}
        <ReportChartCard
          title="Xu hướng hoạt động"
          subtitle="Check-in/Check-out theo ngày"
          loading={loading}
          className="lg:col-span-2"
          minHeight="350px"
        >
          {trendData.length > 0 ? (
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => new Date(value).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip 
                  labelFormatter={(value) => new Date(value).toLocaleDateString('vi-VN')}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="checkIns"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  name="Check-in"
                />
                <Line
                  type="monotone"
                  dataKey="checkOuts"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  name="Check-out"
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <ReportEmptyState
              title="Chưa có dữ liệu"
              description="Không có dữ liệu xu hướng"
            />
          )}
        </ReportChartCard>

        {/* Distribution Pie */}
        <ReportChartCard
          title="Phân bổ theo ca"
          subtitle="Số ca làm và doanh thu"
          loading={loading}
          minHeight="350px"
        >
          {shiftDistributionData.length > 0 ? (
            <ResponsiveContainer width="100%" height={350}>
              <RechartsPie>
                <Pie
                  data={shiftDistributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                >
                  {shiftDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip 
                  formatter={(value: number, name: string, props) => {
                    if (name === 'value') return [value, 'Số ca'];
                    return [formatCurrency(props.payload.revenue), 'Doanh thu'];
                  }}
                />
              </RechartsPie>
            </ResponsiveContainer>
          ) : (
            <ReportEmptyState
              title="Chưa có dữ liệu"
              description="Không có dữ liệu phân bổ"
            />
          )}
        </ReportChartCard>
      </div>

      {/* Staff Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="h-5 w-5 text-amber-500" />
            Hiệu suất nhân viên
          </CardTitle>
        </CardHeader>
        <CardContent>
          {staffPerformanceList.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>#</TableHead>
                    <TableHead>Nhân viên</TableHead>
                    <TableHead className="text-right">Số ca</TableHead>
                    <TableHead className="text-right">Check-in</TableHead>
                    <TableHead className="text-right">Check-out</TableHead>
                    <TableHead className="text-right">Đặt phòng</TableHead>
                    <TableHead className="text-right">Doanh thu</TableHead>
                    <TableHead className="text-right">TB/ca</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {staffPerformanceList.map((staff, index) => (
                    <TableRow key={staff.staffId}>
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
                      <TableCell className="font-medium">{staff.staffName}</TableCell>
                      <TableCell className="text-right">{staff.shifts}</TableCell>
                      <TableCell className="text-right">{staff.checkIns}</TableCell>
                      <TableCell className="text-right">{staff.checkOuts}</TableCell>
                      <TableCell className="text-right">{staff.bookings}</TableCell>
                      <TableCell className="text-right font-medium text-amber-600">
                        {formatCurrency(staff.revenue)}
                      </TableCell>
                      <TableCell className="text-right text-gray-500">
                        {formatCurrency(staff.shifts > 0 ? staff.revenue / staff.shifts : 0)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <ReportEmptyState
              title="Chưa có dữ liệu"
              description="Không có dữ liệu hiệu suất nhân viên"
            />
          )}
        </CardContent>
      </Card>

      {/* Shift Details Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <CalendarCheck className="h-5 w-5 text-amber-500" />
            Chi tiết ca làm
            {selectedShift !== 'all' && (
              <Badge variant="outline" className="ml-2">
                {getShiftLabel(selectedShift as 'MORNING' | 'AFTERNOON' | 'NIGHT')}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredShifts.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ngày</TableHead>
                    <TableHead>Ca làm</TableHead>
                    <TableHead>Thời gian</TableHead>
                    <TableHead>Nhân viên</TableHead>
                    <TableHead className="text-right">Check-in</TableHead>
                    <TableHead className="text-right">Check-out</TableHead>
                    <TableHead className="text-right">Đặt phòng</TableHead>
                    <TableHead className="text-right">Doanh thu</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredShifts.slice(0, 20).map((shift) => {
                    const Icon = getShiftIcon(shift.shiftType);
                    return (
                      <TableRow key={shift.shiftId}>
                        <TableCell className="font-medium">
                          {new Date(shift.shiftDate).toLocaleDateString('vi-VN')}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div 
                              className="p-1.5 rounded"
                              style={{ backgroundColor: `${SHIFT_COLORS[shift.shiftType]}20` }}
                            >
                              <Icon 
                                className="h-4 w-4" 
                                style={{ color: SHIFT_COLORS[shift.shiftType] }}
                              />
                            </div>
                            <span>{getShiftLabel(shift.shiftType)}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-500">
                          {shift.startTime} - {shift.endTime}
                        </TableCell>
                        <TableCell>{shift.staffName}</TableCell>
                        <TableCell className="text-right">
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            {shift.checkIns}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            {shift.checkOuts}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">{shift.bookingsCreated}</TableCell>
                        <TableCell className="text-right font-medium text-amber-600">
                          {formatCurrency(shift.revenue)}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
              {filteredShifts.length > 20 && (
                <p className="text-center text-sm text-gray-500 mt-4">
                  Đang hiển thị 20/{filteredShifts.length} ca làm
                </p>
              )}
            </div>
          ) : (
            <ReportEmptyState
              title="Chưa có dữ liệu"
              description="Không có dữ liệu ca làm trong khoảng thời gian đã chọn"
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}