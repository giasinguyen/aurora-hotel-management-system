import { useState, useEffect, useCallback } from 'react';
import { Building2, DollarSign, Users, Star, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ReportDateRangeFilter, ReportChartCard, ExportButtons, ReportEmptyState,
  BranchRevenueChart, BranchRadarChart, BranchRankingTable, SummaryCard,
} from '@/components/custom/reports';
import { getBranchComparison } from '@/services/reportApi';
import { exportBranchComparisonReport, type BranchComparisonExportData } from '@/utils/exportUtils';
import type { ReportDateRange, BranchComparisonData } from '@/types/report.types';
import { toast } from 'sonner';

// Format currency helper
const formatCurrency = (value: number) => {
  if (value >= 1000000000) return `${(value / 1000000000).toFixed(1)} tỷ`;
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)} triệu`;
  if (value >= 1000) return `${(value / 1000).toFixed(1)}k`;
  return value.toLocaleString('vi-VN');
};

export default function BranchComparisonReport() {
  const [dateRange, setDateRange] = useState<ReportDateRange>({ dateFrom: new Date().toISOString().split('T')[0], dateTo: new Date().toISOString().split('T')[0] });
  const [loading, setLoading] = useState(false);
  const [branches, setBranches] = useState<BranchComparisonData[]>([]);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getBranchComparison(dateRange.dateFrom, dateRange.dateTo);
      setBranches(data);
    } catch (error) {
      console.error('Failed to fetch branch comparison:', error);
      toast.error('Không thể tải dữ liệu so sánh chi nhánh');
    } finally {
      setLoading(false);
    }
  }, [dateRange.dateFrom, dateRange.dateTo]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Calculated stats
  const totalRevenue = branches.reduce((sum, b) => sum + b.totalRevenue, 0);
  const totalBookings = branches.reduce((sum, b) => sum + b.totalBookings, 0);
  const avgOccupancy = branches.length > 0 ? branches.reduce((sum, b) => sum + b.occupancyRate, 0) / branches.length : 0;
  const avgRating = branches.length > 0 ? branches.reduce((sum, b) => sum + b.averageRating, 0) / branches.length : 0;
  const topBranch = branches.length > 0 ? [...branches].sort((a, b) => b.totalRevenue - a.totalRevenue)[0] : null;

  // Prepare export data
  const getExportData = useCallback((): BranchComparisonExportData => {
    return {
      dateRange: {
        from: dateRange.dateFrom,
        to: dateRange.dateTo,
      },
      totalBranches: branches.length,
      totalRevenue,
      totalBookings,
      averageOccupancy: avgOccupancy,
      branches: branches.map(b => ({
        branchName: b.branchName,
        branchCode: b.branchCode,
        city: b.city,
        roomCount: b.roomCount,
        totalRevenue: b.totalRevenue,
        totalBookings: b.totalBookings,
        occupancyRate: b.occupancyRate,
        averageRating: b.averageRating,
        staffCount: b.staffCount,
      })),
    };
  }, [dateRange, branches, totalRevenue, totalBookings, avgOccupancy]);

  // Export handlers
  const handleExportPDF = async () => {
    await exportBranchComparisonReport(getExportData(), 'pdf');
  };

  const handleExportExcel = async () => {
    await exportBranchComparisonReport(getExportData(), 'excel');
  };

  const handleExportCSV = async () => {
    await exportBranchComparisonReport(getExportData(), 'csv');
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">So sánh chi nhánh</h1>
          <p className="text-gray-500 mt-1">Phân tích hiệu suất giữa các chi nhánh</p>
        </div>
        <ExportButtons onExportPDF={handleExportPDF} onExportExcel={handleExportExcel} onExportCSV={handleExportCSV} loading={loading} />
      </div>

      {/* Filters */}
      <ReportDateRangeFilter dateRange={dateRange} onDateRangeChange={setDateRange} onRefresh={fetchData} loading={loading} />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard icon={Building2} title="Tổng chi nhánh" value={branches.length.toString()} subtitle="Đang hoạt động" variant="blue" />
        <SummaryCard icon={DollarSign} title="Tổng doanh thu" value={`${formatCurrency(totalRevenue)}đ`} subtitle="Tất cả chi nhánh" variant="amber" />
        <SummaryCard icon={Users} title="Tổng đặt phòng" value={totalBookings.toString()} subtitle="Lượt đặt" variant="green" />
        <SummaryCard icon={Star} title="Đánh giá TB" value={avgRating.toFixed(1)} subtitle={`Công suất: ${avgOccupancy.toFixed(1)}%`} variant="purple" />
      </div>

      {branches.length === 0 && !loading ? (
        <ReportEmptyState title="Chưa có dữ liệu" description="Không có dữ liệu chi nhánh để so sánh" />
      ) : (
        <>
          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ReportChartCard title="Doanh thu theo chi nhánh" subtitle="So sánh doanh thu" loading={loading} minHeight="350px">
              <BranchRevenueChart data={branches} height={300} />
            </ReportChartCard>

            <ReportChartCard title="Phân tích hiệu suất" subtitle="Radar các chỉ số" loading={loading} minHeight="350px">
              <BranchRadarChart data={branches} height={300} />
            </ReportChartCard>
          </div>

          {/* Ranking Table */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Award className="h-5 w-5 text-amber-500" />
                Bảng xếp hạng chi nhánh
              </CardTitle>
            </CardHeader>
            <CardContent>
              <BranchRankingTable data={branches} totalRevenue={totalRevenue} />
            </CardContent>
          </Card>

          {/* Top Performer */}
          {topBranch && (
            <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="bg-amber-200 p-4 rounded-xl">
                    <Award className="h-8 w-8 text-amber-700" />
                  </div>
                  <div className="flex-1">
                    <p className="text-amber-700 text-sm font-medium">Chi nhánh hoạt động tốt nhất</p>
                    <p className="text-2xl font-bold text-amber-900">{topBranch.branchName}</p>
                    <p className="text-amber-600 text-sm">Doanh thu: {formatCurrency(topBranch.totalRevenue)}đ • {topBranch.totalBookings} đặt phòng • {topBranch.occupancyRate.toFixed(1)}% công suất</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
