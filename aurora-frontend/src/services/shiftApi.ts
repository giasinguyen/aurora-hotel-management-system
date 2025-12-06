import axiosClient from '@/config/axiosClient';
import type {
  WorkShift,
  WorkShiftCreationRequest,
  WorkShiftUpdateRequest,
  StaffShiftAssignment,
  StaffShiftAssignmentRequest,
  BulkShiftAssignmentRequest,
  ShiftCheckIn,
  ShiftCheckInRequest,
  ShiftCheckOutRequest,
  ShiftAssignmentStatus,
} from '@/types/shift.types';
import type { ApiResponse } from '@/types/apiResponse';

// Work Shift API
export const workShiftApi = {
  // Create new work shift
  createShift: (data: WorkShiftCreationRequest) =>
    axiosClient.post<ApiResponse<WorkShift>>('/api/v1/shifts', data),

  // Update work shift
  updateShift: (id: string, data: WorkShiftUpdateRequest) =>
    axiosClient.put<ApiResponse<WorkShift>>(`/api/v1/shifts/${id}`, data),

  // Get shift by ID
  getShift: (id: string) =>
    axiosClient.get<ApiResponse<WorkShift>>(`/api/v1/shifts/${id}`),

  // Get all active shifts
  getAllActiveShifts: () =>
    axiosClient.get<ApiResponse<WorkShift[]>>('/api/v1/shifts'),

  // Get shifts by branch
  getShiftsByBranch: (branchId: string) =>
    axiosClient.get<ApiResponse<WorkShift[]>>(`/api/v1/shifts/branch/${branchId}`),

  // Delete shift (soft delete)
  deleteShift: (id: string) =>
    axiosClient.delete<ApiResponse<void>>(`/api/v1/shifts/${id}`),

  // Toggle shift status
  toggleShiftStatus: (id: string) =>
    axiosClient.patch<ApiResponse<WorkShift>>(`/api/v1/shifts/${id}/toggle-status`),
};

// Staff Shift Assignment API
export const staffShiftApi = {
  // Assign shift to staff
  assignShift: (data: StaffShiftAssignmentRequest) =>
    axiosClient.post<ApiResponse<StaffShiftAssignment>>('/api/v1/shift-assignments', data),

  // Bulk assign shifts
  bulkAssignShifts: (data: BulkShiftAssignmentRequest) =>
    axiosClient.post<ApiResponse<StaffShiftAssignment[]>>('/api/v1/shift-assignments/bulk', data),

  // Update assignment
  updateAssignment: (id: string, data: StaffShiftAssignmentRequest) =>
    axiosClient.put<ApiResponse<StaffShiftAssignment>>(`/api/v1/shift-assignments/${id}`, data),

  // Cancel assignment
  cancelAssignment: (id: string, reason?: string) =>
    axiosClient.delete<ApiResponse<void>>(`/api/v1/shift-assignments/${id}`, {
      params: { reason },
    }),

  // Get assignment by ID
  getAssignment: (id: string) =>
    axiosClient.get<ApiResponse<StaffShiftAssignment>>(`/api/v1/shift-assignments/${id}`),

  // Get staff shifts for specific date
  getStaffShiftsForDate: (staffId: string, date: string) =>
    axiosClient.get<ApiResponse<StaffShiftAssignment[]>>(
      `/api/v1/shift-assignments/staff/${staffId}`,
      { params: { date } }
    ),

  // Get staff shifts in date range
  getStaffShiftsInRange: (staffId: string, startDate: string, endDate: string) =>
    axiosClient.get<ApiResponse<StaffShiftAssignment[]>>(
      `/api/v1/shift-assignments/staff/${staffId}/range`,
      { params: { startDate, endDate } }
    ),

  // Get all shifts for date (manager view)
  getShiftsForDate: (date: string, branchId?: string) =>
    axiosClient.get<ApiResponse<StaffShiftAssignment[]>>('/api/v1/shift-assignments/date', {
      params: { date, branchId },
    }),

  // Get shifts in date range (manager view)
  getShiftsInRange: (startDate: string, endDate: string, branchId?: string) => {
    const params: Record<string, string> = { startDate, endDate };
    if (branchId) {
      params.branchId = branchId;
    }
    return axiosClient.get<ApiResponse<StaffShiftAssignment[]>>('/api/v1/shift-assignments/range', {
      params,
    });
  },

  // Get current active shift for staff
  getCurrentActiveShift: (staffId: string) =>
    axiosClient.get<ApiResponse<StaffShiftAssignment>>(
      `/api/v1/shift-assignments/staff/${staffId}/current`
    ),

  // Check if staff has active shift
  hasActiveShift: (staffId: string) =>
    axiosClient.get<ApiResponse<boolean>>(`/api/v1/shift-assignments/staff/${staffId}/has-active`),

  // Update assignment status
  updateAssignmentStatus: (id: string, status: ShiftAssignmentStatus) =>
    axiosClient.patch<ApiResponse<StaffShiftAssignment>>(
      `/api/v1/shift-assignments/${id}/status`,
      null,
      { params: { status } }
    ),
};

// Shift Check-In API
export const shiftCheckInApi = {
  // Check in to shift
  checkIn: (data: ShiftCheckInRequest) =>
    axiosClient.post<ApiResponse<ShiftCheckIn>>('/api/v1/shift-checkins/check-in', data),

  // Check out from shift
  checkOut: (data: ShiftCheckOutRequest) =>
    axiosClient.post<ApiResponse<ShiftCheckIn>>('/api/v1/shift-checkins/check-out', data),

  // Get check-in record by ID
  getCheckInRecord: (id: string) =>
    axiosClient.get<ApiResponse<ShiftCheckIn>>(`/api/v1/shift-checkins/${id}`),

  // Get check-ins by assignment
  getCheckInsByAssignment: (assignmentId: string) =>
    axiosClient.get<ApiResponse<ShiftCheckIn[]>>(
      `/api/v1/shift-checkins/assignment/${assignmentId}`
    ),

  // Get staff check-ins in date range
  getStaffCheckIns: (staffId: string, startDate: string, endDate: string) =>
    axiosClient.get<ApiResponse<ShiftCheckIn[]>>(`/api/v1/shift-checkins/staff/${staffId}`, {
      params: { startDate, endDate },
    }),

  // Get branch check-ins in date range
  getBranchCheckIns: (branchId: string, startDate: string, endDate: string) =>
    axiosClient.get<ApiResponse<ShiftCheckIn[]>>(`/api/v1/shift-checkins/branch/${branchId}`, {
      params: { startDate, endDate },
    }),

  // Check if staff is currently checked in
  isStaffCheckedIn: (staffId: string) =>
    axiosClient.get<ApiResponse<boolean>>(`/api/v1/shift-checkins/staff/${staffId}/is-checked-in`),

  // Get current check-in for staff
  getCurrentCheckIn: (staffId: string) =>
    axiosClient.get<ApiResponse<ShiftCheckIn>>(`/api/v1/shift-checkins/staff/${staffId}/current`),

  // Get total working hours for staff in date range
  getTotalWorkingHours: (staffId: string, startDate: string, endDate: string) =>
    axiosClient.get<ApiResponse<number>>(`/api/v1/shift-checkins/staff/${staffId}/total-hours`, {
      params: { startDate, endDate },
    }),

  // Get late check-ins in date range
  getLateCheckIns: (startDate: string, endDate: string, branchId?: string) =>
    axiosClient.get<ApiResponse<ShiftCheckIn[]>>('/api/v1/shift-checkins/late', {
      params: { startDate, endDate, branchId },
    }),
};
