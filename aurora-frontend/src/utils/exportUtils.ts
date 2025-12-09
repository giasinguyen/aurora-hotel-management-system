/**
 * Enhanced Export Utilities for Reports
 * Uses jsPDF, html2canvas, exceljs, and file-saver for professional exports
 */

/**
 * Enhanced Export Utilities for Reports
 * Uses jsPDF with Vietnamese font support, html2canvas, exceljs, and file-saver
 */

import html2canvas from 'html2canvas';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import 'jspdf-autotable';
import auroraLogo from '@/assets/images/commons/aurora-logo.png';
// =====================
// Vietnamese Font Support
// =====================

import {
  createVietnamesePDF,
  setBoldFont,
  setRegularFont,
  setItalicFont,
} from '../font/font-loader';

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

/**
 * Capture chart as image using html2canvas
 */
const captureChart = async (element: HTMLElement): Promise<string> => {
  try {
    const canvas = await html2canvas(element, {
      backgroundColor: '#ffffff',
      scale: 2, // Higher quality
      logging: false,
      useCORS: true,
      allowTaint: true,
      removeContainer: true,
    });
    return canvas.toDataURL('image/png');
  } catch (error) {
    console.error('Failed to capture chart:', error);
    return '';
  }
};

//=== Logo==//
const loadLogo = (): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    // Đường dẫn đến file logo trong thư mục public
    img.src = auroraLogo;
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
  });
};
// =====================
// PDF Export with Clean, Professional Design
// =====================

/**
 * Export report data to PDF with clean, professional design
 */
export const exportToPDF = async (data: ReportExportData): Promise<void> => {
  const { options, tables, summary, charts } = data;
  const orientation = options.orientation || 'portrait';

  // Create PDF document
  const doc = createVietnamesePDF({
    orientation,
    unit: 'mm',
    format: 'a4',
  });
  setRegularFont(doc);

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  let yPosition = 25;
  let logoImg: HTMLImageElement | null = null;

  // Color palette - Professional and minimal
  const colors = {
    primary: [51, 51, 51],        // Dark gray for text
    secondary: [102, 102, 102],   // Medium gray
    accent: [200, 200, 200],      // Light gray for borders
    background: [250, 250, 250],  // Very light gray
    header: [240, 240, 240],      // Light gray for headers
  };

  // Helper function to add new page if needed
  const checkPageBreak = async (requiredSpace: number) => {
    if (yPosition + requiredSpace > pageHeight - 25) {
      doc.addPage();
      setRegularFont(doc); // Re-apply font on new page
      yPosition = 25;
      return true;
    }
    return false;
  };

  // ===== HEADER SECTION - Minimal & Clean =====
  // Load logo
  const logoWidth = 30;
  let logoHeight = 0;
  const headerStartY = yPosition;


  try {
    logoImg = await loadLogo();
    logoHeight = (logoImg.height * logoWidth) / logoImg.width;
    const logoX = pageWidth - margin - logoWidth;
    doc.addImage(logoImg, 'PNG', logoX, headerStartY, logoWidth, logoHeight);
  } catch (error) {
    console.warn("Không tải được logo:", error);
    logoHeight = 15;
  }
  doc.setFontSize(22);
  doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
  setBoldFont(doc);
  const textY = headerStartY + (logoHeight / 2) + 2.5;

  doc.text(options.title || 'Báo cáo', margin, textY);
  yPosition = headerStartY + logoHeight + 10;

  // Thin line under title
  doc.setDrawColor(colors.accent[0], colors.accent[1], colors.accent[2]);
  doc.setLineWidth(0.5);
  doc.line(margin, yPosition, pageWidth - margin, yPosition);

  // Tăng yPosition để bắt đầu phần Subtitle
  yPosition += 8;

  // Subtitle and metadata
  doc.setFontSize(9);
  doc.setTextColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
  setRegularFont(doc);

  if (options.subtitle) {
    doc.text(options.subtitle, margin, yPosition);
    yPosition += 5;
  }

  // Date range
  if (options.dateRange && (options.dateRange.from || options.dateRange.to)) {
    const dateText = `Thời gian: ${formatDate(options.dateRange.from)} - ${formatDate(options.dateRange.to)}`;
    doc.text(dateText, margin, yPosition);
    yPosition += 5;
  }

  // Generated timestamp
  doc.text(`Tạo lúc: ${formatDateTime(options.generatedAt || new Date())}`, margin, yPosition);
  yPosition += 12;

  // ===== SUMMARY SECTION - Clean Cards =====
  if (summary && summary.length > 0) {
    await checkPageBreak(45);

    doc.setFontSize(12);
    setBoldFont(doc);
    doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
    doc.text('Tổng quan', margin, yPosition);
    yPosition += 8;

    const cardWidth = (pageWidth - margin * 2 - 9) / 4;
    const cardHeight = 24;

    summary.slice(0, 4).forEach((item, index) => {
      const xPos = margin + index * (cardWidth + 3);

      // Card border
      doc.setDrawColor(colors.accent[0], colors.accent[1], colors.accent[2]);
      doc.setLineWidth(0.3);
      doc.rect(xPos, yPosition, cardWidth, cardHeight);

      // Card background - subtle
      doc.setFillColor(colors.background[0], colors.background[1], colors.background[2]);
      doc.rect(xPos, yPosition, cardWidth, cardHeight, 'F');

      // Redraw border on top
      doc.setDrawColor(colors.accent[0], colors.accent[1], colors.accent[2]);
      doc.rect(xPos, yPosition, cardWidth, cardHeight);

      // Label
      doc.setFontSize(7.5);
      setRegularFont(doc);
      doc.setTextColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
      doc.text(item.label, xPos + 3, yPosition + 6, { maxWidth: cardWidth - 6 });

      // Value
      doc.setFontSize(11);
      setBoldFont(doc);
      doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
      const valueText = String(item.value);
      doc.text(valueText, xPos + 3, yPosition + 16, { maxWidth: cardWidth - 6 });
    });

    yPosition += cardHeight + 12;
  }

  // ===== CHARTS SECTION =====
  if (charts && charts.length > 0) {
    for (const chart of charts) {
      if (chart.chartRef) {
        await checkPageBreak(100);

        // Chart title
        doc.setFontSize(11);
        setBoldFont(doc);
        doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
        doc.text(chart.chartTitle, margin, yPosition);
        yPosition += 7;

        // Capture and add chart
        const chartImage = await captureChart(chart.chartRef);
        if (chartImage) {
          const chartWidth = pageWidth - margin * 2;
          const chartHeight = 90;

          // Border around chart
          doc.setDrawColor(colors.accent[0], colors.accent[1], colors.accent[2]);
          doc.setLineWidth(0.3);
          doc.rect(margin, yPosition, chartWidth, chartHeight);

          doc.addImage(chartImage, 'PNG', margin, yPosition, chartWidth, chartHeight);
          yPosition += chartHeight + 10;
        }
      }
    }
  }

  // ===== TABLES SECTION - Clean & Professional =====
  if (tables && tables.length > 0) {
    for (let tableIndex = 0; tableIndex < tables.length; tableIndex++) {
      const table = tables[tableIndex];
      await checkPageBreak(50);

      // Table title
      doc.setFontSize(11);
      setBoldFont(doc);
      doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
      doc.text(`Dữ liệu ${tableIndex + 1}`, margin, yPosition);
      yPosition += 8;

      // Calculate column widths
      const availableWidth = pageWidth - margin * 2;
      const totalWidth = table.columns.reduce((sum, col) => sum + (col.width || 20), 0);
      const columnWidths = table.columns.map(col =>
        ((col.width || 20) / totalWidth) * availableWidth
      );

      // Draw table header
      doc.setFillColor(colors.header[0], colors.header[1], colors.header[2]);
      doc.rect(margin, yPosition, availableWidth, 9, 'F');

      // Header border
      doc.setDrawColor(colors.accent[0], colors.accent[1], colors.accent[2]);
      doc.setLineWidth(0.3);
      doc.rect(margin, yPosition, availableWidth, 9);

      doc.setFontSize(8.5);
      setBoldFont(doc);
      doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);

      let xPos = margin;
      table.columns.forEach((col, i) => {
        doc.text(col.header, xPos + 2.5, yPosition + 6, { maxWidth: columnWidths[i] - 5 });
        xPos += columnWidths[i];
      });

      yPosition += 9;

      // Draw table rows
      setRegularFont(doc);
      doc.setFontSize(8);

      for (let rowIndex = 0; rowIndex < table.data.length; rowIndex++) {
        const row = table.data[rowIndex];
        await checkPageBreak(7.5);

        // Alternate row colors - very subtle
        if (rowIndex % 2 === 0) {
          doc.setFillColor(colors.background[0], colors.background[1], colors.background[2]);
          doc.rect(margin, yPosition, availableWidth, 7.5, 'F');
        }

        // Row border
        doc.setDrawColor(colors.accent[0], colors.accent[1], colors.accent[2]);
        doc.setLineWidth(0.1);
        doc.line(margin, yPosition + 7.5, pageWidth - margin, yPosition + 7.5);

        doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
        xPos = margin;
        table.columns.forEach((col, i) => {
          const value = getCellValue(row, col);
          doc.text(value, xPos + 2.5, yPosition + 5, { maxWidth: columnWidths[i] - 5 });
          xPos += columnWidths[i];
        });

        yPosition += 7.5;
      }

      yPosition += 10;
    }
  }

  // ===== WATERMARK CHO TẤT CẢ CÁC TRANG =====
  if (logoImg) {
    // Ép kiểu lại một lần nữa để chắc chắn nó là ảnh
    const img = logoImg as HTMLImageElement;

    const totalPages = doc.getNumberOfPages();
    const wmWidth = 100;
    const wmHeight = (img.height * wmWidth) / img.width; 

    const wmX = (pageWidth - wmWidth) / 2;
    const wmY = (pageHeight - wmHeight) / 2;

    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);

      // 1. Lưu trạng thái
      doc.saveGraphicsState();

      // 2. Set độ mờ (Dùng 'as any' để sửa lỗi GState đỏ)
      try {
        // @ts-ignore
        const gState = new doc.GState({ opacity: 0.1 });
        doc.setGState(gState);
      } catch (e) {
        // Fallback nếu GState lỗi (hiếm gặp)
        console.warn("GState không hỗ trợ", e);
      }

      // 3. Vẽ logo
      doc.addImage(img, 'PNG', wmX, wmY, wmWidth, wmHeight);

      // 4. Khôi phục
      doc.restoreGraphicsState();
    }
  }
  // ===== FOOTER ON ALL PAGES - Minimal =====
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    setRegularFont(doc); // Re-apply font for footer

    // Top border line
    doc.setDrawColor(colors.accent[0], colors.accent[1], colors.accent[2]);
    doc.setLineWidth(0.3);
    doc.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);

    // Page number
    doc.setFontSize(8);
    setItalicFont(doc);
    doc.setTextColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
    doc.text(
      `Trang ${i}/${pageCount}`,
      pageWidth / 2,
      pageHeight - 7,
      { align: 'center' }
    );

    // System name
    doc.text(
      'Aurora Hotel Management System',
      pageWidth - margin,
      pageHeight - 7,
      { align: 'right' }
    );
  }

  // Save file
  doc.save(`${options.filename}.pdf`);
};

// =====================
// Excel Export with Clean, Professional Styling
// =====================

/**
 * Export report data to Excel with professional styling
 */
export const exportToExcel = async (data: ReportExportData): Promise<void> => {
  const { options, tables, summary } = data;

  // Create workbook
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Aurora Hotel Management System';
  workbook.created = new Date();

  // Professional color scheme
  const colors = {
    headerBg: 'FFF5F5F5',
    headerText: 'FF333333',
    altRowBg: 'FFFAFAFA',
    borderColor: 'FFE0E0E0',
    accentText: 'FF666666',
  };

  // ===== SUMMARY SHEET =====
  if (summary && summary.length > 0) {
    const summarySheet = workbook.addWorksheet('Tổng quan', {
      properties: { tabColor: { argb: 'FF999999' } }
    });

    // Set column widths
    summarySheet.columns = [
      { width: 35 },
      { width: 25 },
    ];

    // Title row
    const titleRow = summarySheet.addRow([options.title || 'Báo cáo']);
    titleRow.font = { size: 18, bold: true, color: { argb: 'FF333333' } };
    titleRow.height = 28;
    summarySheet.mergeCells('A1:B1');
    titleRow.alignment = { vertical: 'middle', horizontal: 'left' };

    // Subtitle row
    if (options.subtitle) {
      const subtitleRow = summarySheet.addRow([options.subtitle]);
      subtitleRow.font = { size: 10, color: { argb: colors.accentText } };
      subtitleRow.height = 18;
      summarySheet.mergeCells('A2:B2');
      subtitleRow.alignment = { vertical: 'middle', horizontal: 'left' };
    }

    // Date range row
    if (options.dateRange && (options.dateRange.from || options.dateRange.to)) {
      const dateRow = summarySheet.addRow([
        `Thời gian: ${formatDate(options.dateRange.from)} - ${formatDate(options.dateRange.to)}`
      ]);
      dateRow.font = { size: 9, color: { argb: colors.accentText } };
      dateRow.height = 16;
      summarySheet.mergeCells(`A${dateRow.number}:B${dateRow.number}`);
      dateRow.alignment = { vertical: 'middle', horizontal: 'left' };
    }

    // Generated timestamp
    const timestampRow = summarySheet.addRow([
      `Tạo lúc: ${formatDateTime(options.generatedAt || new Date())}`
    ]);
    timestampRow.font = { size: 9, color: { argb: colors.accentText } };
    timestampRow.height = 16;
    summarySheet.mergeCells(`A${timestampRow.number}:B${timestampRow.number}`);
    timestampRow.alignment = { vertical: 'middle', horizontal: 'left' };

    // Empty row
    summarySheet.addRow([]);

    // Summary section header
    const summaryHeaderRow = summarySheet.addRow(['Chỉ tiêu chính']);
    summaryHeaderRow.font = { size: 12, bold: true, color: { argb: colors.headerText } };
    summaryHeaderRow.height = 22;
    summarySheet.mergeCells(`A${summaryHeaderRow.number}:B${summaryHeaderRow.number}`);
    summaryHeaderRow.alignment = { vertical: 'middle', horizontal: 'left' };
    summaryHeaderRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: colors.headerBg }
    };

    // Summary data
    summary.forEach((item, index) => {
      const row = summarySheet.addRow([item.label, String(item.value)]);
      row.height = 20;

      // Styling
      row.getCell(1).font = { size: 10, color: { argb: colors.accentText } };
      row.getCell(2).font = { size: 11, bold: true, color: { argb: colors.headerText } };
      row.getCell(2).alignment = { horizontal: 'right', vertical: 'middle' };

      // Alternate row colors
      if (index % 2 === 0) {
        row.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: colors.altRowBg }
        };
      }

      // Thin borders
      row.eachCell((cell) => {
        cell.border = {
          bottom: { style: 'thin', color: { argb: colors.borderColor } }
        };
      });
    });
  }

  // ===== DATA SHEETS =====
  if (tables && tables.length > 0) {
    tables.forEach((table, tableIndex) => {
      const sheetName = `Dữ liệu ${tableIndex + 1}`;
      const worksheet = workbook.addWorksheet(sheetName, {
        properties: { tabColor: { argb: 'FF999999' } }
      });

      // Set column widths
      worksheet.columns = table.columns.map(col => ({
        width: col.width || 15,
      }));

      // Add header row - Clean style
      const headerRow = worksheet.addRow(table.columns.map(col => col.header));
      headerRow.height = 22;
      headerRow.font = { size: 10, bold: true, color: { argb: colors.headerText } };
      headerRow.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: colors.headerBg }
      };
      headerRow.alignment = { vertical: 'middle', horizontal: 'center' };

      // Clean header borders
      headerRow.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin', color: { argb: colors.borderColor } },
          left: { style: 'thin', color: { argb: colors.borderColor } },
          bottom: { style: 'medium', color: { argb: colors.borderColor } },
          right: { style: 'thin', color: { argb: colors.borderColor } }
        };
      });

      // Add data rows
      table.data.forEach((row, rowIndex) => {
        const dataRow = worksheet.addRow(
          table.columns.map(col => {
            const value = row[col.key];
            if (col.format) return col.format(value);
            return value;
          })
        );

        dataRow.height = 18;
        dataRow.font = { size: 9.5 };

        // Alternate row colors - subtle
        if (rowIndex % 2 === 0) {
          dataRow.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: colors.altRowBg }
          };
        }

        // Alignment
        dataRow.eachCell((cell, colIndex) => {
          const column = table.columns[colIndex - 1];

          // Right align numbers and currency
          if (column.format || typeof row[column.key] === 'number') {
            cell.alignment = { horizontal: 'right', vertical: 'middle' };
          } else {
            cell.alignment = { horizontal: 'left', vertical: 'middle' };
          }

          // Thin borders
          cell.border = {
            top: { style: 'thin', color: { argb: colors.borderColor } },
            left: { style: 'thin', color: { argb: colors.borderColor } },
            bottom: { style: 'thin', color: { argb: colors.borderColor } },
            right: { style: 'thin', color: { argb: colors.borderColor } }
          };
        });
      });

      // Auto-filter
      worksheet.autoFilter = {
        from: { row: 1, column: 1 },
        to: { row: 1, column: table.columns.length }
      };

      // Freeze header row
      worksheet.views = [
        { state: 'frozen', xSplit: 0, ySplit: 1 }
      ];
    });
  }

  // Generate Excel file
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
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
 * Export Overview Report with Charts
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
  chartRefs?: {
    revenueChart?: HTMLElement | null;
    paymentMethodChart?: HTMLElement | null;
    bookingSourceChart?: HTMLElement | null;
    topRoomTypesChart?: HTMLElement | null;
  };
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
    charts: [],
  };

  // Add charts if refs are provided
  if (data.chartRefs) {
    if (data.chartRefs.revenueChart) {
      exportData.charts!.push({
        chartTitle: 'Biểu đồ Doanh thu',
        chartRef: data.chartRefs.revenueChart,
      });
    }
    if (data.chartRefs.paymentMethodChart) {
      exportData.charts!.push({
        chartTitle: 'Phương thức Thanh toán',
        chartRef: data.chartRefs.paymentMethodChart,
      });
    }
    if (data.chartRefs.bookingSourceChart) {
      exportData.charts!.push({
        chartTitle: 'Nguồn Đặt phòng',
        chartRef: data.chartRefs.bookingSourceChart,
      });
    }
    if (data.chartRefs.topRoomTypesChart) {
      exportData.charts!.push({
        chartTitle: 'Loại phòng Phổ biến',
        chartRef: data.chartRefs.topRoomTypesChart,
      });
    }
  }

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