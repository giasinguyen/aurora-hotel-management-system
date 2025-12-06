import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Branch } from "@/types/branch.types";

interface BranchState {
  currentBranch: Branch | null;
}

const getInitialBranch = (): Branch | null => {
  const savedId = localStorage.getItem("branchId");
  
  if (savedId) {
    // Return partial branch, will be filled by BranchInitializer
    return {
      id: savedId,
      code: '',
      name: '',
      address: '',
      ward: '',
      district: '',
      city: '',
      fullAddress: '',
      phone: '',
      email: '',
      status: 'ACTIVE',
      openingDate: '',
      checkInTime: '',
      checkOutTime: '',
      operatingHours: '',
      totalRooms: 0,
      totalStaff: 0,
      availableRooms: 0,
    };
  }
  
  // No branch selected yet (will trigger modal to show)
  return null;
};

const initialState: BranchState = {
  currentBranch: getInitialBranch(),
};

const branchSlice = createSlice({
  name: "branch",
  initialState,
  reducers: {
    // Set only branchId and save to localStorage
    setBranch: (state, action: PayloadAction<string>) => {
      const branchId = action.payload;
      if (state.currentBranch) {
        state.currentBranch.id = branchId;
      }
      localStorage.setItem("branchId", branchId);
    },
    // Set full branch details from API
    setBranchDetails: (state, action: PayloadAction<Branch>) => {
      state.currentBranch = action.payload;
      localStorage.setItem("branchId", action.payload.id);
    },
  },
});

export const { setBranch, setBranchDetails } = branchSlice.actions;
export default branchSlice.reducer;

