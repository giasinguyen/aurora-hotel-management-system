// Shift Management Type Definitions

export const ShiftAssignmentStatus = {
  SCHEDULED: 'SCHEDULED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
  NO_SHOW: 'NO_SHOW',
} as const;

export type ShiftAssignmentStatus = typeof ShiftAssignmentStatus[keyof typeof ShiftAssignmentStatus];

// Work Shift Types
export interface WorkShift {
  id: string;
  name: string;
  description?: string;
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
  colorCode: string; // Hex color
  active: boolean;
  branchId?: string;
  branchName?: string;
  durationHours: number;
  createdAt: string;
  updatedAt: string;
}

export interface WorkShiftCreationRequest {
  name: string;
  description?: string;
  startTime: string;
  endTime: string;
  colorCode: string;
  branchId?: string;
}

export interface WorkShiftUpdateRequest {
  name?: string;
  description?: string;
  startTime?: string;
  endTime?: string;
  colorCode?: string;
}

// Staff Shift Assignment Types
export interface StaffShiftAssignment {
  id: string;
  staffId: string;
  staffName: string;
  staffUsername: string;
  staffEmail?: string;
  // Backend returns flat fields instead of nested workShift object
  workShiftId: string;
  workShiftName: string;
  startTime: string;
  endTime: string;
  shiftColorCode: string;
  // Keep this for backward compatibility with components
  workShift?: WorkShift;
  shiftDate: string; // ISO date
  status: ShiftAssignmentStatus;
  branchId: string;
  branchName: string;
  assignedBy: string;
  assignedByName: string;
  notes?: string;
  cancelledReason?: string;
  hasCheckedIn?: boolean;
  checkInTime?: string;
  checkOutTime?: string;
  isActiveNow?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface StaffShiftAssignmentRequest {
  staffId: string;
  workShiftId: string;
  shiftDate: string; // ISO date
  branchId: string;
  assignedById: string;
  notes?: string;
}

export interface BulkShiftAssignmentRequest {
  staffIds: string[];
  workShiftId: string;
  startDate: string; // ISO date
  endDate: string; // ISO date
  branchId: string;
  assignedById: string;
  notes?: string;
}

// Shift Check-In Types
export interface ShiftCheckIn {
  id: string;
  assignment: StaffShiftAssignment;
  checkInTime: string; // ISO datetime
  checkOutTime?: string; // ISO datetime
  isLate: boolean;
  lateMinutes?: number;
  earlyDeparture?: boolean;
  earlyMinutes?: number;
  ipAddress?: string;
  deviceInfo?: string;
  location?: string;
  notes?: string;
  workingHours?: number;
  isCurrentlyCheckedIn: boolean;
}

export interface ShiftCheckInRequest {
  assignmentId: string;
  ipAddress?: string;
  deviceInfo?: string;
  location?: string;
  notes?: string;
}

export interface ShiftCheckOutRequest {
  assignmentId: string;
  notes?: string;
}

// Calendar Event Type for UI
export interface ShiftCalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource: StaffShiftAssignment;
  backgroundColor?: string;
}

// Filter Types
export interface ShiftFilterParams {
  branchId?: string;
  date?: string;
  startDate?: string;
  endDate?: string;
  staffId?: string;
  status?: ShiftAssignmentStatus;
}

// Statistics Types
export interface ShiftStatistics {
  totalShifts: number;
  activeStaff: number;
  lateCheckIns: number;
  noShows: number;
  totalWorkingHours: number;
  averageWorkingHours: number;
}
