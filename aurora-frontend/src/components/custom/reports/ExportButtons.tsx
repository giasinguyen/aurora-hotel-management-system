import { useState, useCallback } from 'react';
import { Download, FileSpreadsheet, FileText, Loader2, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

export type ExportFormat = 'pdf' | 'excel' | 'csv';

interface ExportButtonsProps {
  /**
   * Handler for PDF export - receives callback to trigger export
   */
  onExportPDF?: () => Promise<void>;
  /**
   * Handler for Excel export
   */
  onExportExcel?: () => Promise<void>;
  /**
   * Handler for CSV export
   */
  onExportCSV?: () => Promise<void>;
  /**
   * Disable all export buttons
   */
  disabled?: boolean;
  /**
   * Show loading state (e.g., when data is loading)
   */
  loading?: boolean;
  /**
   * Custom className for the trigger button
   */
  className?: string;
  /**
   * Size variant for the button
   */
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

/**
 * ExportButtons component
 * Provides dropdown menu with PDF, Excel, and CSV export options
 */
export function ExportButtons({
  onExportPDF,
  onExportExcel,
  onExportCSV,
  disabled = false,
  loading = false,
  className = '',
  size = 'sm',
}: ExportButtonsProps) {
  const [exporting, setExporting] = useState<ExportFormat | null>(null);
  const [lastExported, setLastExported] = useState<ExportFormat | null>(null);

  const handleExport = useCallback(async (format: ExportFormat, handler?: () => Promise<void>) => {
    if (!handler) {
      toast.info(`Chức năng xuất ${format.toUpperCase()} đang được phát triển`);
      return;
    }

    try {
      setExporting(format);
      await handler();
      setLastExported(format);
      // Reset last exported status after 3 seconds
      setTimeout(() => setLastExported(null), 3000);
    } catch (error) {
      console.error(`Export ${format} failed:`, error);
      // Error toast is handled by the parent component
    } finally {
      setExporting(null);
    }
  }, []);

  const isExporting = exporting !== null;
  const isDisabled = disabled || loading || isExporting;

  const getFormatLabel = (format: ExportFormat): string => {
    switch (format) {
      case 'pdf': return 'PDF';
      case 'excel': return 'Excel';
      case 'csv': return 'CSV';
    }
  };

  const getButtonText = (): string => {
    if (isExporting) {
      return `Đang xuất ${getFormatLabel(exporting!)}...`;
    }
    if (lastExported) {
      return `Đã xuất ${getFormatLabel(lastExported)}`;
    }
    return 'Xuất báo cáo';
  };

  const getButtonIcon = () => {
    if (isExporting) {
      return <Loader2 className="h-4 w-4 animate-spin" />;
    }
    if (lastExported) {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
    return <Download className="h-4 w-4" />;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={lastExported ? 'outline' : 'default'}
          size={size}
          disabled={isDisabled}
          className={`gap-2 ${lastExported ? 'border-green-200 text-green-700' : ''} ${className}`}
          style={!lastExported ? { backgroundColor: 'oklch(0.702 0.078 56.8)' } : undefined}
        >
          {getButtonIcon()}
          <span className="hidden sm:inline">{getButtonText()}</span>
          <span className="sm:hidden">
            {isExporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        {/* PDF Export */}
        <DropdownMenuItem
          onClick={() => handleExport('pdf', onExportPDF)}
          disabled={isExporting}
          className="cursor-pointer flex items-center gap-3 py-2.5"
        >
          <div className="flex items-center justify-center w-8 h-8 rounded-md bg-red-50">
            <FileText className="h-4 w-4 text-red-600" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-sm">Xuất PDF</p>
            <p className="text-xs text-muted-foreground">Báo cáo đầy đủ</p>
          </div>
          {exporting === 'pdf' && <Loader2 className="h-4 w-4 animate-spin" />}
          {lastExported === 'pdf' && <CheckCircle className="h-4 w-4 text-green-500" />}
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Excel Export */}
        <DropdownMenuItem
          onClick={() => handleExport('excel', onExportExcel)}
          disabled={isExporting}
          className="cursor-pointer flex items-center gap-3 py-2.5"
        >
          <div className="flex items-center justify-center w-8 h-8 rounded-md bg-green-50">
            <FileSpreadsheet className="h-4 w-4 text-green-600" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-sm">Xuất Excel</p>
            <p className="text-xs text-muted-foreground">Dữ liệu chi tiết</p>
          </div>
          {exporting === 'excel' && <Loader2 className="h-4 w-4 animate-spin" />}
          {lastExported === 'excel' && <CheckCircle className="h-4 w-4 text-green-500" />}
        </DropdownMenuItem>

        {/* CSV Export */}
        <DropdownMenuItem
          onClick={() => handleExport('csv', onExportCSV)}
          disabled={isExporting}
          className="cursor-pointer flex items-center gap-3 py-2.5"
        >
          <div className="flex items-center justify-center w-8 h-8 rounded-md bg-blue-50">
            <FileSpreadsheet className="h-4 w-4 text-blue-600" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-sm">Xuất CSV</p>
            <p className="text-xs text-muted-foreground">Dữ liệu thô</p>
          </div>
          {exporting === 'csv' && <Loader2 className="h-4 w-4 animate-spin" />}
          {lastExported === 'csv' && <CheckCircle className="h-4 w-4 text-green-500" />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default ExportButtons;
