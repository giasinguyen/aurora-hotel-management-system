import axiosClient from '@/config/axiosClient';
import type { 
  RevenueStatistics, 
  OccupancyStatistics,
  DashboardOverview,
  TopRoomType,
  PaymentMethodRevenue,
  BookingSourceStats,
  CustomerGrowthPoint,
  DashboardGroupBy,
} from '@/types/dashboard.types';
import type {
  BranchComparisonData,
  ShiftReportData,
  ShiftSummary,
} from '@/types/report.types';

const DASHBOARD_BASE_URL = '/api/dashboard';

// =====================
// Revenue Reports
// =====================

/**
 * Get revenue statistics for reports
 */
export const getRevenueReport = async (
  dateFrom?: string | null,
  dateTo?: string | null,
  groupBy: DashboardGroupBy = 'DAY',
  branchId?: string | null
): Promise<RevenueStatistics[]> => {
  const params = new URLSearchParams();
  if (dateFrom) params.append('dateFrom', dateFrom);
  if (dateTo) params.append('dateTo', dateTo);
  params.append('groupBy', groupBy);
  if (branchId) params.append('branchId', branchId);

  const response = await axiosClient.get(`${DASHBOARD_BASE_URL}/revenue?${params.toString()}`);
  return response.data.result;
};

/**
 * Get admin overview for revenue summary
 */
export const getRevenueSummary = async (
  dateFrom?: string | null,
  dateTo?: string | null
): Promise<DashboardOverview> => {
  const params = new URLSearchParams();
  if (dateFrom) params.append('dateFrom', dateFrom);
  if (dateTo) params.append('dateTo', dateTo);

  const response = await axiosClient.get(`${DASHBOARD_BASE_URL}/admin/overview?${params.toString()}`);
  return response.data.result;
};

/**
 * Get revenue by payment method
 */
export const getRevenueByPaymentMethod = async (
  dateFrom?: string | null,
  dateTo?: string | null,
  branchId?: string | null
): Promise<PaymentMethodRevenue> => {
  const params = new URLSearchParams();
  if (dateFrom) params.append('dateFrom', dateFrom);
  if (dateTo) params.append('dateTo', dateTo);
  if (branchId) params.append('branchId', branchId);

  const response = await axiosClient.get(`${DASHBOARD_BASE_URL}/revenue/payment-methods?${params.toString()}`);
  return response.data.result;
};

// =====================
// Occupancy Reports
// =====================

/**
 * Get occupancy statistics
 */
export const getOccupancyReport = async (
  date?: string | null,
  branchId?: string | null
): Promise<OccupancyStatistics> => {
  const params = new URLSearchParams();
  if (date) params.append('date', date);
  if (branchId) params.append('branchId', branchId);

  const response = await axiosClient.get(`${DASHBOARD_BASE_URL}/occupancy?${params.toString()}`);
  return response.data.result;
};

/**
 * Get top room types by bookings
 */
export const getTopRoomTypes = async (
  limit: number = 10,
  branchId?: string | null
): Promise<TopRoomType[]> => {
  const params = new URLSearchParams();
  params.append('limit', limit.toString());
  if (branchId) params.append('branchId', branchId);

  const response = await axiosClient.get(`${DASHBOARD_BASE_URL}/top-rooms?${params.toString()}`);
  return response.data.result;
};

// =====================
// Branch Comparison Reports
// =====================

/**
 * Get branch comparison data from backend API
 */
export const getBranchComparison = async (
  dateFrom?: string | null,
  dateTo?: string | null
): Promise<BranchComparisonData[]> => {
  const params = new URLSearchParams();
  if (dateFrom) params.append('dateFrom', dateFrom);
  if (dateTo) params.append('dateTo', dateTo);

  const response = await axiosClient.get(`${DASHBOARD_BASE_URL}/branch-comparison?${params.toString()}`);
  return response.data.result;
};

// =====================
// Booking Reports
// =====================

/**
 * Get bookings by source
 */
export const getBookingsBySource = async (
  dateFrom?: string | null,
  dateTo?: string | null,
  branchId?: string | null
): Promise<BookingSourceStats> => {
  const params = new URLSearchParams();
  if (dateFrom) params.append('dateFrom', dateFrom);
  if (dateTo) params.append('dateTo', dateTo);
  if (branchId) params.append('branchId', branchId);

  const response = await axiosClient.get(`${DASHBOARD_BASE_URL}/bookings/source?${params.toString()}`);
  return response.data.result;
};

// =====================
// Customer Reports
// =====================

/**
 * Get customer growth statistics
 */
export const getCustomerGrowth = async (
  period: DashboardGroupBy = 'MONTH'
): Promise<CustomerGrowthPoint[]> => {
  const response = await axiosClient.get(`${DASHBOARD_BASE_URL}/customer-growth?period=${period}`);
  return response.data.result;
};

// =====================
// Shift Reports
// =====================

/**
 * Get shift report data from backend API
 */
export const getShiftReport = async (
  dateFrom?: string | null,
  dateTo?: string | null,
  branchId?: string | null,
  staffId?: string | null
): Promise<ShiftReportData[]> => {
  const params = new URLSearchParams();
  if (dateFrom) params.append('dateFrom', dateFrom);
  if (dateTo) params.append('dateTo', dateTo);
  if (branchId) params.append('branchId', branchId);
  if (staffId) params.append('staffId', staffId);

  const response = await axiosClient.get(`${DASHBOARD_BASE_URL}/shift-report?${params.toString()}`);
  return response.data.result;
};

/**
 * Get shift summary from backend API
 */
export const getShiftSummary = async (
  dateFrom?: string | null,
  dateTo?: string | null,
  branchId?: string | null
): Promise<ShiftSummary> => {
  const params = new URLSearchParams();
  if (dateFrom) params.append('dateFrom', dateFrom);
  if (dateTo) params.append('dateTo', dateTo);
  if (branchId) params.append('branchId', branchId);

  const response = await axiosClient.get(`${DASHBOARD_BASE_URL}/shift-summary?${params.toString()}`);
  return response.data.result;
};

export default {
  getRevenueReport,
  getRevenueSummary,
  getRevenueByPaymentMethod,
  getOccupancyReport,
  getTopRoomTypes,
  getBranchComparison,
  getBookingsBySource,
  getCustomerGrowth,
  getShiftReport,
  getShiftSummary,
};
