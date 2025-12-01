/**
 * Export Utilities for Reports
 * Provides functions to export data to PDF, Excel, and CSV formats
 */

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

// =====================
// Types
// =====================

export interface ExportColumn {
  header: string;
  key: string;
  width?: number;
  format?: (value: unknown) => string;
}

export interface ExportOptions {
  filename: string;
  title?: string;
  subtitle?: string;
  dateRange?: {
    from: string | null;
    to: string | null;
  };
  generatedAt?: Date;
  author?: string;
  orientation?: 'portrait' | 'landscape';
}

export interface TableExportData {
  columns: ExportColumn[];
  data: Record<string, unknown>[];
}

export interface ChartExportData {
  chartTitle: string;
  chartRef?: HTMLElement | null;
  summary?: { label: string; value: string }[];
}

export interface ReportExportData {
  options: ExportOptions;
  tables?: TableExportData[];
  summary?: { label: string; value: string | number }[];
  charts?: ChartExportData[];
}

// =====================
// Helper Functions
// =====================

/**
 * Format currency in Vietnamese
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(value);
};

/**
 * Format number with thousand separators
 */
export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('vi-VN').format(value);
};

/**
 * Format date in Vietnamese locale
 */
export const formatDate = (date: string | Date | null): string => {
  if (!date) return 'N/A';
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

/**
 * Format datetime in Vietnamese locale
 */
export const formatDateTime = (date: Date): string => {
  return date.toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Get cell value formatted according to column definition
 */
const getCellValue = (row: Record<string, unknown>, column: ExportColumn): string => {
  const value = row[column.key];
  if (value === null || value === undefined) return '';
  if (column.format) return column.format(value);
  return String(value);
};

// =====================
// PDF Export
// =====================

/**
 * Convert Vietnamese text to ASCII for PDF (workaround for font issues)
 * This removes diacritics but keeps the text readable
 */
const removeVietnameseDiacritics = (str: string): string => {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');
};

/**
 * Export report data to PDF using jsPDF with autoTable
 */
export const exportToPDF = async (data: ReportExportData): Promise<void> => {
  const { options, tables, summary } = data;
  const orientation = options.orientation || 'portrait';
  
  // Create PDF document
  const doc = new jsPDF({
    orientation,
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 15;
  let yPosition = 20;

  // Helper to convert text for PDF
  const t = (text: string) => removeVietnameseDiacritics(text);

  // Header - Title
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text(t(options.title || 'Bao cao'), pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 10;

  // Subtitle
  if (options.subtitle) {
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(t(options.subtitle), pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 8;
  }

  // Date range
  if (options.dateRange && (options.dateRange.from || options.dateRange.to)) {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    const dateText = `Thoi gian: ${formatDate(options.dateRange.from)} - ${formatDate(options.dateRange.to)}`;
    doc.text(t(dateText), pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 8;
  }

  // Generated timestamp
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(128, 128, 128);
  doc.text(t(`Tao luc: ${formatDateTime(options.generatedAt || new Date())}`), pageWidth / 2, yPosition, { align: 'center' });
  doc.setTextColor(0, 0, 0);
  yPosition += 12;

  // Summary section
  if (summary && summary.length > 0) {
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(t('Tong quan'), margin, yPosition);
    yPosition += 8;

    // Draw summary boxes
    const boxWidth = (pageWidth - margin * 2) / Math.min(summary.length, 4);
    const boxHeight = 20;
    
    summary.forEach((item, index) => {
      const xPos = margin + (index % 4) * boxWidth;
      const yPos = yPosition + Math.floor(index / 4) * (boxHeight + 5);
      
      // Box background
      doc.setFillColor(249, 250, 251);
      doc.roundedRect(xPos, yPos, boxWidth - 5, boxHeight, 2, 2, 'F');
      
      // Label
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(107, 114, 128);
      doc.text(t(item.label), xPos + 3, yPos + 7);
      
      // Value
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 0, 0);
      doc.text(t(String(item.value)), xPos + 3, yPos + 15);
    });
    
    yPosition += Math.ceil(summary.length / 4) * (boxHeight + 5) + 10;
  }

  // Tables
  if (tables && tables.length > 0) {
    for (const table of tables) {
      // Prepare table data
      const headers = table.columns.map(col => t(col.header));
      const body = table.data.map(row => 
        table.columns.map(col => t(getCellValue(row, col)))
      );

      // Add table using autoTable
      autoTable(doc, {
        startY: yPosition,
        head: [headers],
        body: body,
        theme: 'striped',
        headStyles: {
          fillColor: [245, 158, 11], // Amber color
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          fontSize: 10,
        },
        bodyStyles: {
          fontSize: 9,
        },
        alternateRowStyles: {
          fillColor: [249, 250, 251],
        },
        margin: { left: margin, right: margin },
        styles: {
          cellPadding: 3,
          overflow: 'linebreak',
        },
        columnStyles: table.columns.reduce((acc, col, index) => {
          if (col.width) {
            acc[index] = { cellWidth: col.width };
          }
          return acc;
        }, {} as Record<number, { cellWidth: number }>),
      });

      // Update yPosition after table
      yPosition = (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 15;
    }
  }

  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(128, 128, 128);
    doc.text(
      `Trang ${i}/${pageCount}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
    doc.text(
      'Aurora Hotel Management System',
      pageWidth - margin,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'right' }
    );
  }

  // Save file
  doc.save(`${options.filename}.pdf`);
};

// =====================
// Excel Export
// =====================

/**
 * Export report data to Excel
 */
export const exportToExcel = async (data: ReportExportData): Promise<void> => {
  const { options, tables, summary } = data;
  
  // Create workbook
  const workbook = XLSX.utils.book_new();

  // Summary sheet if exists
  if (summary && summary.length > 0) {
    const summaryData = [
      [options.title || 'Báo cáo'],
      [options.subtitle || ''],
      [`Thời gian: ${formatDate(options.dateRange?.from || null)} - ${formatDate(options.dateRange?.to || null)}`],
      [`Tạo lúc: ${formatDateTime(options.generatedAt || new Date())}`],
      [],
      ['Tổng quan'],
      ...summary.map(item => [item.label, String(item.value)]),
    ];

    const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
    
    // Styling for summary sheet
    summarySheet['!cols'] = [{ wch: 30 }, { wch: 20 }];
    
    XLSX.utils.book_append_sheet(workbook, summarySheet, 'Tổng quan');
  }

  // Data sheets
  if (tables && tables.length > 0) {
    tables.forEach((table, index) => {
      // Prepare data with headers
      const sheetData = [
        table.columns.map(col => col.header),
        ...table.data.map(row => 
          table.columns.map(col => {
            const value = row[col.key];
            if (col.format) return col.format(value);
            return value;
          })
        ),
      ];

      const sheet = XLSX.utils.aoa_to_sheet(sheetData);

      // Set column widths
      sheet['!cols'] = table.columns.map(col => ({
        wch: col.width || 15,
      }));

      XLSX.utils.book_append_sheet(
        workbook, 
        sheet, 
        `Dữ liệu ${index + 1}`.substring(0, 31) // Sheet name max 31 chars
      );
    });
  }

  // Generate Excel file
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { 
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
  });
  
  saveAs(blob, `${options.filename}.xlsx`);
};

// =====================
// CSV Export
// =====================

/**
 * Export report data to CSV
 */
export const exportToCSV = async (data: ReportExportData): Promise<void> => {
  const { options, tables } = data;
  
  if (!tables || tables.length === 0) {
    throw new Error('No table data to export');
  }

  // Use first table for CSV
  const table = tables[0];
  
  // Create CSV content
  const headers = table.columns.map(col => col.header).join(',');
  const rows = table.data.map(row => 
    table.columns.map(col => {
      const value = getCellValue(row, col);
      // Escape quotes and wrap in quotes if contains comma
      if (value.includes(',') || value.includes('"')) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    }).join(',')
  );

  const csvContent = [headers, ...rows].join('\n');
  
  // Add BOM for UTF-8
  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8' });
  
  saveAs(blob, `${options.filename}.csv`);
};

// =====================
// Report-Specific Export Functions
// =====================

/**
 * Export Overview Report
 */
export interface OverviewExportData {
  dateRange: { from: string | null; to: string | null };
  overview: {
    totalRevenue: number;
    totalBookings: number;
    totalCustomers: number;
    occupancyRate: number;
  };
  revenueByMonth?: { period: string; revenue: number; bookings: number }[];
  topRoomTypes?: { name: string; bookings: number; revenue?: number }[];
}

export const exportOverviewReport = async (
  data: OverviewExportData,
  format: 'pdf' | 'excel' | 'csv'
): Promise<void> => {
  const exportData: ReportExportData = {
    options: {
      filename: `bao-cao-tong-quan-${formatDate(new Date()).replace(/\//g, '-')}`,
      title: 'Báo cáo Tổng quan',
      subtitle: 'Aurora Hotel Management System',
      dateRange: data.dateRange,
      generatedAt: new Date(),
      orientation: 'landscape',
    },
    summary: [
      { label: 'Tổng doanh thu', value: formatCurrency(data.overview.totalRevenue) },
      { label: 'Tổng đặt phòng', value: formatNumber(data.overview.totalBookings) },
      { label: 'Khách hàng', value: formatNumber(data.overview.totalCustomers) },
      { label: 'Công suất', value: `${data.overview.occupancyRate.toFixed(1)}%` },
    ],
    tables: [],
  };

  // Revenue by month table
  if (data.revenueByMonth && data.revenueByMonth.length > 0) {
    exportData.tables!.push({
      columns: [
        { header: 'Thời gian', key: 'period', width: 15 },
        { header: 'Doanh thu', key: 'revenue', width: 20, format: (v) => formatCurrency(v as number) },
        { header: 'Đặt phòng', key: 'bookings', width: 15, format: (v) => formatNumber(v as number) },
      ],
      data: data.revenueByMonth,
    });
  }

  // Top room types table
  if (data.topRoomTypes && data.topRoomTypes.length > 0) {
    exportData.tables!.push({
      columns: [
        { header: 'Loại phòng', key: 'name', width: 25 },
        { header: 'Số lượt đặt', key: 'bookings', width: 15, format: (v) => formatNumber(v as number) },
        { header: 'Doanh thu', key: 'revenue', width: 20, format: (v) => formatCurrency(v as number) },
      ],
      data: data.topRoomTypes,
    });
  }

  switch (format) {
    case 'pdf':
      await exportToPDF(exportData);
      break;
    case 'excel':
      await exportToExcel(exportData);
      break;
    case 'csv':
      await exportToCSV(exportData);
      break;
  }
};

/**
 * Export Revenue Report
 */
export interface RevenueExportData {
  dateRange: { from: string | null; to: string | null };
  totalRevenue: number;
  totalBookings: number;
  averageBookingValue: number;
  revenueGrowth: number;
  revenueData: { period: string; revenue: number; bookings: number }[];
  branchRevenue?: { branchName: string; revenue: number; bookings: number; percentage: number }[];
  paymentMethods?: { method: string; amount: number; percentage: number }[];
}

export const exportRevenueReport = async (
  data: RevenueExportData,
  format: 'pdf' | 'excel' | 'csv'
): Promise<void> => {
  const exportData: ReportExportData = {
    options: {
      filename: `bao-cao-doanh-thu-${formatDate(new Date()).replace(/\//g, '-')}`,
      title: 'Báo cáo Doanh thu',
      subtitle: 'Aurora Hotel Management System',
      dateRange: data.dateRange,
      generatedAt: new Date(),
      orientation: 'landscape',
    },
    summary: [
      { label: 'Tổng doanh thu', value: formatCurrency(data.totalRevenue) },
      { label: 'Tổng đặt phòng', value: formatNumber(data.totalBookings) },
      { label: 'Giá trị TB/đơn', value: formatCurrency(data.averageBookingValue) },
      { label: 'Tăng trưởng', value: `${data.revenueGrowth >= 0 ? '+' : ''}${data.revenueGrowth.toFixed(1)}%` },
    ],
    tables: [
      {
        columns: [
          { header: 'Thời gian', key: 'period', width: 15 },
          { header: 'Doanh thu', key: 'revenue', width: 20, format: (v) => formatCurrency(v as number) },
          { header: 'Đặt phòng', key: 'bookings', width: 15, format: (v) => formatNumber(v as number) },
        ],
        data: data.revenueData,
      },
    ],
  };

  // Branch revenue table
  if (data.branchRevenue && data.branchRevenue.length > 0) {
    exportData.tables!.push({
      columns: [
        { header: 'Chi nhánh', key: 'branchName', width: 25 },
        { header: 'Doanh thu', key: 'revenue', width: 20, format: (v) => formatCurrency(v as number) },
        { header: 'Đặt phòng', key: 'bookings', width: 15, format: (v) => formatNumber(v as number) },
        { header: 'Tỷ lệ', key: 'percentage', width: 10, format: (v) => `${(v as number).toFixed(1)}%` },
      ],
      data: data.branchRevenue,
    });
  }

  // Payment methods table
  if (data.paymentMethods && data.paymentMethods.length > 0) {
    exportData.tables!.push({
      columns: [
        { header: 'Phương thức', key: 'method', width: 20 },
        { header: 'Số tiền', key: 'amount', width: 20, format: (v) => formatCurrency(v as number) },
        { header: 'Tỷ lệ', key: 'percentage', width: 10, format: (v) => `${(v as number).toFixed(1)}%` },
      ],
      data: data.paymentMethods,
    });
  }

  switch (format) {
    case 'pdf':
      await exportToPDF(exportData);
      break;
    case 'excel':
      await exportToExcel(exportData);
      break;
    case 'csv':
      await exportToCSV(exportData);
      break;
  }
};

/**
 * Export Occupancy Report
 */
export interface OccupancyExportData {
  dateRange: { from: string | null; to: string | null };
  totalRooms: number;
  occupancyRate: number;
  availableRooms: number;
  occupiedRooms: number;
  branchOccupancy?: { 
    branchName: string; 
    roomCount: number; 
    occupancyRate: number; 
    staffCount: number;
    averageRating: number;
  }[];
  weeklyTrend?: {
    dayName: string;
    occupancyRate: number;
    roomsUsed: number;
  }[];
  topRoomTypes?: {
    name: string;
    bookings: number;
    revenue?: number;
  }[];
}

export const exportOccupancyReport = async (
  data: OccupancyExportData,
  format: 'pdf' | 'excel' | 'csv'
): Promise<void> => {
  const exportData: ReportExportData = {
    options: {
      filename: `bao-cao-cong-suat-${formatDate(new Date()).replace(/\//g, '-')}`,
      title: 'Báo cáo Công suất',
      subtitle: 'Aurora Hotel Management System',
      dateRange: data.dateRange,
      generatedAt: new Date(),
    },
    summary: [
      { label: 'Tổng số phòng', value: formatNumber(data.totalRooms) },
      { label: 'Công suất', value: `${data.occupancyRate.toFixed(1)}%` },
      { label: 'Phòng trống', value: formatNumber(data.availableRooms) },
      { label: 'Đang sử dụng', value: formatNumber(data.occupiedRooms) },
    ],
    tables: [
      {
        columns: [
          { header: 'Chi nhánh', key: 'branchName', width: 25 },
          { header: 'Số phòng', key: 'roomCount', width: 12, format: (v) => formatNumber(v as number) },
          { header: 'Công suất', key: 'occupancyRate', width: 12, format: (v) => `${(v as number).toFixed(1)}%` },
          { header: 'Nhân viên', key: 'staffCount', width: 12, format: (v) => formatNumber(v as number) },
          { header: 'Đánh giá', key: 'averageRating', width: 12, format: (v) => `${(v as number).toFixed(1)} ★` },
        ],
        data: data.branchOccupancy ?? [],
      },
    ],
  };

  switch (format) {
    case 'pdf':
      await exportToPDF(exportData);
      break;
    case 'excel':
      await exportToExcel(exportData);
      break;
    case 'csv':
      await exportToCSV(exportData);
      break;
  }
};

/**
 * Export Branch Comparison Report
 */
export interface BranchComparisonExportData {
  dateRange: { from: string | null; to: string | null };
  totalBranches: number;
  totalRevenue: number;
  totalBookings: number;
  averageOccupancy: number;
  branches: {
    branchName: string;
    branchCode: string;
    city: string;
    roomCount: number;
    totalRevenue: number;
    totalBookings: number;
    occupancyRate: number;
    averageRating: number;
    staffCount: number;
  }[];
}

export const exportBranchComparisonReport = async (
  data: BranchComparisonExportData,
  format: 'pdf' | 'excel' | 'csv'
): Promise<void> => {
  const exportData: ReportExportData = {
    options: {
      filename: `bao-cao-so-sanh-chi-nhanh-${formatDate(new Date()).replace(/\//g, '-')}`,
      title: 'Báo cáo So sánh Chi nhánh',
      subtitle: 'Aurora Hotel Management System',
      dateRange: data.dateRange,
      generatedAt: new Date(),
      orientation: 'landscape',
    },
    summary: [
      { label: 'Số chi nhánh', value: formatNumber(data.totalBranches) },
      { label: 'Tổng doanh thu', value: formatCurrency(data.totalRevenue) },
      { label: 'Tổng đặt phòng', value: formatNumber(data.totalBookings) },
      { label: 'Công suất TB', value: `${data.averageOccupancy.toFixed(1)}%` },
    ],
    tables: [
      {
        columns: [
          { header: 'Chi nhánh', key: 'branchName', width: 22 },
          { header: 'Mã', key: 'branchCode', width: 10 },
          { header: 'Thành phố', key: 'city', width: 15 },
          { header: 'Số phòng', key: 'roomCount', width: 10, format: (v) => formatNumber(v as number) },
          { header: 'Doanh thu', key: 'totalRevenue', width: 18, format: (v) => formatCurrency(v as number) },
          { header: 'Đặt phòng', key: 'totalBookings', width: 12, format: (v) => formatNumber(v as number) },
          { header: 'Công suất', key: 'occupancyRate', width: 10, format: (v) => `${(v as number).toFixed(1)}%` },
          { header: 'Đánh giá', key: 'averageRating', width: 10, format: (v) => `${(v as number).toFixed(1)} ★` },
        ],
        data: data.branches,
      },
    ],
  };

  switch (format) {
    case 'pdf':
      await exportToPDF(exportData);
      break;
    case 'excel':
      await exportToExcel(exportData);
      break;
    case 'csv':
      await exportToCSV(exportData);
      break;
  }
};

/**
 * Export Shift Report
 */
export interface ShiftExportData {
  date: string;
  shiftType: string;
  staffName: string;
  checkIns: number;
  checkOuts: number;
  bookings: number;
  revenue: number;
  notes?: string;
}

export interface ShiftExportOptions {
  format: 'pdf' | 'excel' | 'csv';
  title: string;
  dateRange: { from: string | null; to: string | null };
}

export const exportShiftReport = async (
  shifts: ShiftExportData[],
  options: ShiftExportOptions
): Promise<void> => {
  // Calculate totals
  const totalShifts = shifts.length;
  const totalCheckIns = shifts.reduce((sum, s) => sum + s.checkIns, 0);
  const totalCheckOuts = shifts.reduce((sum, s) => sum + s.checkOuts, 0);
  const totalBookings = shifts.reduce((sum, s) => sum + s.bookings, 0);
  const totalRevenue = shifts.reduce((sum, s) => sum + s.revenue, 0);

  // Create shift summary by type
  const shiftSummary = Object.values(
    shifts.reduce((acc, shift) => {
      if (!acc[shift.shiftType]) {
        acc[shift.shiftType] = {
          shiftType: shift.shiftType,
          shiftCount: 0,
          checkIns: 0,
          checkOuts: 0,
          bookings: 0,
          revenue: 0,
        };
      }
      acc[shift.shiftType].shiftCount += 1;
      acc[shift.shiftType].checkIns += shift.checkIns;
      acc[shift.shiftType].checkOuts += shift.checkOuts;
      acc[shift.shiftType].bookings += shift.bookings;
      acc[shift.shiftType].revenue += shift.revenue;
      return acc;
    }, {} as Record<string, { shiftType: string; shiftCount: number; checkIns: number; checkOuts: number; bookings: number; revenue: number }>)
  );

  const exportData: ReportExportData = {
    options: {
      filename: `bao-cao-ca-lam-${formatDate(new Date()).replace(/\//g, '-')}`,
      title: options.title || 'Báo cáo Ca làm việc',
      subtitle: 'Aurora Hotel Management System',
      dateRange: options.dateRange,
      generatedAt: new Date(),
      orientation: 'landscape',
    },
    summary: [
      { label: 'Tổng số ca', value: formatNumber(totalShifts) },
      { label: 'Tổng check-in', value: formatNumber(totalCheckIns) },
      { label: 'Tổng check-out', value: formatNumber(totalCheckOuts) },
      { label: 'Tổng đặt phòng', value: formatNumber(totalBookings) },
      { label: 'Tổng doanh thu', value: formatCurrency(totalRevenue) },
    ],
    tables: [
      // Shift summary by type
      {
        columns: [
          { header: 'Loại ca', key: 'shiftType', width: 15 },
          { header: 'Số ca', key: 'shiftCount', width: 12, format: (v) => formatNumber(v as number) },
          { header: 'Check-in', key: 'checkIns', width: 12, format: (v) => formatNumber(v as number) },
          { header: 'Check-out', key: 'checkOuts', width: 12, format: (v) => formatNumber(v as number) },
          { header: 'Đặt phòng', key: 'bookings', width: 12, format: (v) => formatNumber(v as number) },
          { header: 'Doanh thu', key: 'revenue', width: 18, format: (v) => formatCurrency(v as number) },
        ],
        data: shiftSummary as unknown as Record<string, unknown>[],
      },
      // Shift details
      {
        columns: [
          { header: 'Ngày', key: 'date', width: 12 },
          { header: 'Ca', key: 'shiftType', width: 12 },
          { header: 'Nhân viên', key: 'staffName', width: 20 },
          { header: 'Check-in', key: 'checkIns', width: 10, format: (v) => formatNumber(v as number) },
          { header: 'Check-out', key: 'checkOuts', width: 10, format: (v) => formatNumber(v as number) },
          { header: 'Đặt phòng', key: 'bookings', width: 10, format: (v) => formatNumber(v as number) },
          { header: 'Doanh thu', key: 'revenue', width: 18, format: (v) => formatCurrency(v as number) },
        ],
        data: shifts as unknown as Record<string, unknown>[],
      },
    ],
  };

  switch (options.format) {
    case 'pdf':
      await exportToPDF(exportData);
      break;
    case 'excel':
      await exportToExcel(exportData);
      break;
    case 'csv':
      await exportToCSV(exportData);
      break;
  }
};
