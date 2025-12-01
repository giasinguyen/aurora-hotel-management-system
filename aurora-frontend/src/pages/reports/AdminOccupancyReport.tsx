import { useState, useEffect, useCallback } from 'react';
import { Building2, BedDouble, DoorOpen, BarChart3, TrendingUp, Users } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  ReportDateRangeFilter, ReportStatCard, ReportChartCard, ExportButtons, ReportEmptyState,
  OccupancyGauge, SummaryCard, BranchSelector,
} from '@/components/custom/reports';
import { getBranchComparison } from '@/services/reportApi';
import { getOccupancyStatistics } from '@/services/dashboardApi';
import { exportOccupancyReport, type OccupancyExportData } from '@/utils/exportUtils';
import type { ReportDateRange, BranchComparisonData } from '@/types/report.types';
import type { OccupancyStatistics } from '@/types/dashboard.types';
import { toast } from 'sonner';

export default function AdminOccupancyReport() {
  const [dateRange, setDateRange] = useState<ReportDateRange>({ dateFrom: new Date().toISOString().split('T')[0], dateTo: new Date().toISOString().split('T')[0] });
  const [branchId, setBranchId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [branches, setBranches] = useState<BranchComparisonData[]>([]);
  const [systemStats, setSystemStats] = useState<OccupancyStatistics | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [branchData, statsData] = await Promise.all([
        getBranchComparison(dateRange.dateFrom, dateRange.dateTo),
        getOccupancyStatistics(dateRange.dateTo || undefined, branchId || undefined),
      ]);
      setBranches(branchData);
      setSystemStats(statsData);
    } catch (error) {
      console.error('Failed to fetch admin occupancy data:', error);
      toast.error('Không thể tải dữ liệu công suất');
    } finally {
      setLoading(false);
    }
  }, [dateRange.dateFrom, dateRange.dateTo, branchId]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Calculated stats
  const totalRooms = branches.reduce((sum, b) => sum + b.roomCount, 0) || systemStats?.totalRooms || 0;
  const avgOccupancy = branches.length > 0 ? branches.reduce((sum, b) => sum + b.occupancyRate, 0) / branches.length : systemStats?.occupancyRate || 0;
  const totalStaff = branches.reduce((sum, b) => sum + b.staffCount, 0);

  // Prepare export data
  const getExportData = useCallback((): OccupancyExportData => {
    const occupiedRooms = Math.round(totalRooms * (avgOccupancy / 100));
    return {
      dateRange: {
        from: dateRange.dateFrom,
        to: dateRange.dateTo,
      },
      totalRooms,
      occupancyRate: avgOccupancy,
      availableRooms: totalRooms - occupiedRooms,
      occupiedRooms,
      branchOccupancy: branches.map(b => ({
        branchName: b.branchName,
        roomCount: b.roomCount,
        occupancyRate: b.occupancyRate,
        staffCount: b.staffCount,
        averageRating: b.averageRating,
      })),
    };
  }, [dateRange, totalRooms, avgOccupancy, branches]);

  // Export handlers
  const handleExportPDF = async () => {
    await exportOccupancyReport(getExportData(), 'pdf');
  };

  const handleExportExcel = async () => {
    await exportOccupancyReport(getExportData(), 'excel');
  };

  const handleExportCSV = async () => {
    await exportOccupancyReport(getExportData(), 'csv');
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Báo cáo công suất (Admin)</h1>
          <p className="text-gray-500 mt-1">Tổng quan công suất toàn hệ thống</p>
        </div>
        <ExportButtons onExportPDF={handleExportPDF} onExportExcel={handleExportExcel} onExportCSV={handleExportCSV} loading={loading} />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-end gap-4">
        <ReportDateRangeFilter dateRange={dateRange} onDateRangeChange={setDateRange} onRefresh={fetchData} loading={loading} />
        <BranchSelector value={branchId} onChange={setBranchId} />
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <ReportStatCard title="Tổng số phòng" value={totalRooms.toString()} subtitle="Toàn hệ thống" icon={Building2} variant="primary" loading={loading} />
        <ReportStatCard title="Chi nhánh" value={branches.length.toString()} subtitle="Đang hoạt động" icon={DoorOpen} variant="success" loading={loading} />
        <ReportStatCard title="Công suất TB" value={`${avgOccupancy.toFixed(1)}%`} subtitle="Tất cả chi nhánh" icon={BarChart3} variant="warning" loading={loading} />
        <ReportStatCard title="Nhân viên" value={totalStaff.toString()} subtitle="Toàn hệ thống" icon={Users} variant="info" loading={loading} />
      </div>

      {branches.length === 0 && !loading ? (
        <ReportEmptyState title="Chưa có dữ liệu" description="Không có dữ liệu để hiển thị" />
      ) : (
        <>
          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <ReportChartCard title="Công suất hệ thống" subtitle="Tỷ lệ sử dụng phòng" loading={loading} minHeight="300px">
              <OccupancyGauge value={avgOccupancy} />
            </ReportChartCard>

            <ReportChartCard title="Công suất theo chi nhánh" subtitle="So sánh giữa các chi nhánh" loading={loading} className="lg:col-span-2" minHeight="300px">
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={branches} layout="vertical" margin={{ left: 80 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis type="number" domain={[0, 100]} tickFormatter={v => `${v}%`} tick={{ fontSize: 12 }} />
                  <YAxis dataKey="branchName" type="category" width={70} tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(v: number) => [`${v.toFixed(1)}%`, 'Công suất']} contentStyle={{ borderRadius: '8px' }} />
                  <Legend />
                  <Bar dataKey="occupancyRate" fill="#f59e0b" radius={[0, 4, 4, 0]} name="Công suất (%)" />
                </BarChart>
              </ResponsiveContainer>
            </ReportChartCard>
          </div>

          {/* Branch Details Table */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-amber-500" />
                Chi tiết công suất theo chi nhánh
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Chi nhánh</TableHead>
                      <TableHead className="text-right">Số phòng</TableHead>
                      <TableHead className="text-right">Công suất</TableHead>
                      <TableHead className="text-right">Đánh giá</TableHead>
                      <TableHead className="text-right">Nhân viên</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {branches.map(branch => (
                      <TableRow key={branch.branchCode}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{branch.branchName}</p>
                            <p className="text-xs text-gray-500">{branch.city}</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge variant="outline">{branch.roomCount}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Progress value={branch.occupancyRate} className="w-16 h-2" />
                            <span className={`text-sm font-medium ${
                              branch.occupancyRate >= 80 ? 'text-green-600' :
                              branch.occupancyRate >= 50 ? 'text-amber-600' : 'text-red-600'
                            }`}>
                              {branch.occupancyRate.toFixed(1)}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <span className="text-amber-400">★</span>
                            <span>{branch.averageRating.toFixed(1)}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">{branch.staffCount}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <SummaryCard icon={BedDouble} title="Công suất cao nhất" value={`${Math.max(...branches.map(b => b.occupancyRate)).toFixed(1)}%`} subtitle={branches.sort((a, b) => b.occupancyRate - a.occupancyRate)[0]?.branchName || '-'} variant="green" />
            <SummaryCard icon={BarChart3} title="Công suất trung bình" value={`${avgOccupancy.toFixed(1)}%`} subtitle="Toàn hệ thống" variant="amber" />
            <SummaryCard icon={Building2} title="Công suất thấp nhất" value={`${Math.min(...branches.map(b => b.occupancyRate)).toFixed(1)}%`} subtitle={branches.sort((a, b) => a.occupancyRate - b.occupancyRate)[0]?.branchName || '-'} variant="red" />
          </div>
        </>
      )}
    </div>
  );
}
