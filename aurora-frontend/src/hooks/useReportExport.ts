/**
 * Custom hook for report exports
 * Provides standardized export functionality across all report pages
 */

import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import {
  exportOverviewReport,
  exportRevenueReport,
  exportOccupancyReport,
  exportBranchComparisonReport,
  exportShiftReport,
  type OverviewExportData,
  type RevenueExportData,
  type OccupancyExportData,
  type BranchComparisonExportData,
  type ShiftExportData,
  type ShiftExportOptions,
} from '@/utils/exportUtils';

export type ExportFormat = 'pdf' | 'excel' | 'csv';
export type ReportType = 'overview' | 'revenue' | 'occupancy' | 'branch-comparison' | 'shift';

interface UseReportExportOptions {
  reportType: ReportType;
  onExportStart?: () => void;
  onExportSuccess?: (format: ExportFormat) => void;
  onExportError?: (error: Error) => void;
}

interface ShiftReportData {
  shifts: ShiftExportData[];
  options: ShiftExportOptions;
}

interface UseReportExportReturn {
  isExporting: boolean;
  exportingFormat: ExportFormat | null;
  exportReport: (format: ExportFormat, data: ReportExportDataUnion) => Promise<void>;
  exportPDF: (data: ReportExportDataUnion) => Promise<void>;
  exportExcel: (data: ReportExportDataUnion) => Promise<void>;
  exportCSV: (data: ReportExportDataUnion) => Promise<void>;
}

type ReportExportDataUnion =
  | OverviewExportData
  | RevenueExportData
  | OccupancyExportData
  | BranchComparisonExportData
  | ShiftReportData;

/**
 * Hook for handling report exports
 */
export function useReportExport(options: UseReportExportOptions): UseReportExportReturn {
  const { reportType, onExportStart, onExportSuccess, onExportError } = options;
  
  const [isExporting, setIsExporting] = useState(false);
  const [exportingFormat, setExportingFormat] = useState<ExportFormat | null>(null);

  const exportReport = useCallback(async (format: ExportFormat, data: ReportExportDataUnion) => {
    try {
      setIsExporting(true);
      setExportingFormat(format);
      onExportStart?.();

      // Call appropriate export function based on report type
      switch (reportType) {
        case 'overview':
          await exportOverviewReport(data as OverviewExportData, format);
          break;
        case 'revenue':
          await exportRevenueReport(data as RevenueExportData, format);
          break;
        case 'occupancy':
          await exportOccupancyReport(data as OccupancyExportData, format);
          break;
        case 'branch-comparison':
          await exportBranchComparisonReport(data as BranchComparisonExportData, format);
          break;
        case 'shift': {
          const shiftData = data as ShiftReportData;
          await exportShiftReport(shiftData.shifts, shiftData.options);
          break;
        }
        default:
          throw new Error(`Unknown report type: ${reportType}`);
      }

      const formatLabel = format.toUpperCase();
      toast.success(`Đã xuất báo cáo ${formatLabel} thành công`);
      onExportSuccess?.(format);
    } catch (error) {
      console.error(`Export ${format} failed:`, error);
      const errorMessage = error instanceof Error ? error.message : 'Lỗi không xác định';
      toast.error(`Xuất báo cáo thất bại: ${errorMessage}`);
      onExportError?.(error instanceof Error ? error : new Error(errorMessage));
    } finally {
      setIsExporting(false);
      setExportingFormat(null);
    }
  }, [reportType, onExportStart, onExportSuccess, onExportError]);

  const exportPDF = useCallback((data: ReportExportDataUnion) => {
    return exportReport('pdf', data);
  }, [exportReport]);

  const exportExcel = useCallback((data: ReportExportDataUnion) => {
    return exportReport('excel', data);
  }, [exportReport]);

  const exportCSV = useCallback((data: ReportExportDataUnion) => {
    return exportReport('csv', data);
  }, [exportReport]);

  return {
    isExporting,
    exportingFormat,
    exportReport,
    exportPDF,
    exportExcel,
    exportCSV,
  };
}

export default useReportExport;
