import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type {
  WorkShift,
  StaffShiftAssignment,
  ShiftCheckIn,
  WorkShiftCreationRequest,
  StaffShiftAssignmentRequest,
  BulkShiftAssignmentRequest,
} from '@/types/shift.types';
import { workShiftApi, staffShiftApi, shiftCheckInApi } from '@/services/shiftApi';

interface ShiftState {
  shifts: WorkShift[];
  assignments: StaffShiftAssignment[];
  checkIns: ShiftCheckIn[];
  currentShift: WorkShift | null;
  currentAssignment: StaffShiftAssignment | null;
  currentCheckIn: ShiftCheckIn | null;
  loading: boolean;
  error: string | null;
  isCheckedIn: boolean;
  hasActiveShift: boolean;
}

const initialState: ShiftState = {
  shifts: [],
  assignments: [],
  checkIns: [],
  currentShift: null,
  currentAssignment: null,
  currentCheckIn: null,
  loading: false,
  error: null,
  isCheckedIn: false,
  hasActiveShift: false,
};

// Work Shift Thunks
export const fetchAllShifts = createAsyncThunk(
  'shift/fetchAllShifts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await workShiftApi.getAllActiveShifts();
      return response.data.result;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch shifts');
    }
  }
);

export const fetchShiftsByBranch = createAsyncThunk(
  'shift/fetchShiftsByBranch',
  async (branchId: string, { rejectWithValue }) => {
    try {
      const response = await workShiftApi.getShiftsByBranch(branchId);
      return response.data.result;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch shifts');
    }
  }
);

export const createShift = createAsyncThunk(
  'shift/createShift',
  async (data: WorkShiftCreationRequest, { rejectWithValue }) => {
    try {
      const response = await workShiftApi.createShift(data);
      return response.data.result;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create shift');
    }
  }
);

export const deleteShift = createAsyncThunk(
  'shift/deleteShift',
  async (id: string, { rejectWithValue }) => {
    try {
      await workShiftApi.deleteShift(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete shift');
    }
  }
);

// Staff Assignment Thunks
export const fetchAssignmentsInRange = createAsyncThunk(
  'shift/fetchAssignmentsInRange',
  async (
    params: { startDate: string; endDate: string; branchId?: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await staffShiftApi.getShiftsInRange(
        params.startDate,
        params.endDate,
        params.branchId
      );
      return response.data.result;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch assignments');
    }
  }
);

export const assignShift = createAsyncThunk(
  'shift/assignShift',
  async (data: StaffShiftAssignmentRequest, { rejectWithValue }) => {
    try {
      const response = await staffShiftApi.assignShift(data);
      return response.data.result;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to assign shift');
    }
  }
);

export const bulkAssignShifts = createAsyncThunk(
  'shift/bulkAssignShifts',
  async (data: BulkShiftAssignmentRequest, { rejectWithValue }) => {
    try {
      const response = await staffShiftApi.bulkAssignShifts(data);
      return response.data.result;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to bulk assign shifts');
    }
  }
);

export const cancelAssignment = createAsyncThunk(
  'shift/cancelAssignment',
  async ({ id, reason }: { id: string; reason?: string }, { rejectWithValue }) => {
    try {
      await staffShiftApi.cancelAssignment(id, reason);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to cancel assignment');
    }
  }
);

export const fetchStaffCurrentShift = createAsyncThunk(
  'shift/fetchStaffCurrentShift',
  async (staffId: string, { rejectWithValue }) => {
    try {
      const response = await staffShiftApi.getCurrentActiveShift(staffId);
      return response.data.result;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch current shift');
    }
  }
);

export const checkHasActiveShift = createAsyncThunk(
  'shift/checkHasActiveShift',
  async (staffId: string, { rejectWithValue }) => {
    try {
      const response = await staffShiftApi.hasActiveShift(staffId);
      return response.data.result;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to check active shift');
    }
  }
);

// Check-In Thunks
export const checkInToShift = createAsyncThunk(
  'shift/checkInToShift',
  async (assignmentId: string, { rejectWithValue }) => {
    try {
      const response = await shiftCheckInApi.checkIn({ assignmentId });
      return response.data.result;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to check in');
    }
  }
);

export const checkOutFromShift = createAsyncThunk(
  'shift/checkOutFromShift',
  async (assignmentId: string, { rejectWithValue }) => {
    try {
      const response = await shiftCheckInApi.checkOut({ assignmentId });
      return response.data.result;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to check out');
    }
  }
);

export const fetchCurrentCheckIn = createAsyncThunk(
  'shift/fetchCurrentCheckIn',
  async (staffId: string, { rejectWithValue }) => {
    try {
      const response = await shiftCheckInApi.getCurrentCheckIn(staffId);
      return response.data.result;
    } catch (error: any) {
      // If 400 error, likely no active check-in, return null instead of rejecting
      if (error.response?.status === 400) {
        return null;
      }
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch check-in');
    }
  }
);

export const checkIsCheckedIn = createAsyncThunk(
  'shift/checkIsCheckedIn',
  async (staffId: string, { rejectWithValue }) => {
    try {
      const response = await shiftCheckInApi.isStaffCheckedIn(staffId);
      return response.data.result;
    } catch (error: any) {
      // If 400 error, likely no active shift, return false instead of rejecting
      if (error.response?.status === 400) {
        return false;
      }
      return rejectWithValue(error.response?.data?.message || 'Failed to check status');
    }
  }
);

const shiftSlice = createSlice({
  name: 'shift',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentShift: (state) => {
      state.currentShift = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch All Shifts
    builder
      .addCase(fetchAllShifts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllShifts.fulfilled, (state, action) => {
        state.loading = false;
        state.shifts = action.payload;
      })
      .addCase(fetchAllShifts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch Shifts By Branch
    builder
      .addCase(fetchShiftsByBranch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchShiftsByBranch.fulfilled, (state, action) => {
        state.loading = false;
        state.shifts = action.payload;
      })
      .addCase(fetchShiftsByBranch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Create Shift
    builder
      .addCase(createShift.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createShift.fulfilled, (state, action) => {
        state.loading = false;
        state.shifts.push(action.payload);
      })
      .addCase(createShift.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Delete Shift
    builder
      .addCase(deleteShift.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteShift.fulfilled, (state, action) => {
        state.loading = false;
        state.shifts = state.shifts.filter((shift) => shift.id !== action.payload);
      })
      .addCase(deleteShift.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch Assignments In Range
    builder
      .addCase(fetchAssignmentsInRange.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAssignmentsInRange.fulfilled, (state, action) => {
        state.loading = false;
        state.assignments = action.payload;
      })
      .addCase(fetchAssignmentsInRange.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Assign Shift
    builder
      .addCase(assignShift.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(assignShift.fulfilled, (state, action) => {
        state.loading = false;
        state.assignments.push(action.payload);
      })
      .addCase(assignShift.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Bulk Assign Shifts
    builder
      .addCase(bulkAssignShifts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(bulkAssignShifts.fulfilled, (state, action) => {
        state.loading = false;
        state.assignments.push(...action.payload);
      })
      .addCase(bulkAssignShifts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Cancel Assignment
    builder
      .addCase(cancelAssignment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelAssignment.fulfilled, (state, action) => {
        state.loading = false;
        state.assignments = state.assignments.filter((a) => a.id !== action.payload);
      })
      .addCase(cancelAssignment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch Staff Current Shift
    builder
      .addCase(fetchStaffCurrentShift.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStaffCurrentShift.fulfilled, (state, action) => {
        state.loading = false;
        state.currentAssignment = action.payload;
      })
      .addCase(fetchStaffCurrentShift.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Check Has Active Shift
    builder
      .addCase(checkHasActiveShift.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkHasActiveShift.fulfilled, (state, action) => {
        state.loading = false;
        state.hasActiveShift = action.payload;
      })
      .addCase(checkHasActiveShift.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Check In
    builder
      .addCase(checkInToShift.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkInToShift.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCheckIn = action.payload;
        state.isCheckedIn = true;
      })
      .addCase(checkInToShift.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Check Out
    builder
      .addCase(checkOutFromShift.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkOutFromShift.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCheckIn = action.payload;
        state.isCheckedIn = false;
      })
      .addCase(checkOutFromShift.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch Current Check In
    builder
      .addCase(fetchCurrentCheckIn.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCurrentCheckIn.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCheckIn = action.payload;
        state.isCheckedIn = action.payload?.isCurrentlyCheckedIn || false;
      })
      .addCase(fetchCurrentCheckIn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Check Is Checked In
    builder
      .addCase(checkIsCheckedIn.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkIsCheckedIn.fulfilled, (state, action) => {
        state.loading = false;
        state.isCheckedIn = action.payload;
      })
      .addCase(checkIsCheckedIn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearCurrentShift } = shiftSlice.actions;
export default shiftSlice.reducer;
