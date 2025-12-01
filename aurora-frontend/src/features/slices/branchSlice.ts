import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { BRANCHES, getDefaultBranch, getBranchById, type Branch } from "@/mocks/branches";

// Re-export Branch type for convenience
export type { Branch };

interface BranchState {
  currentBranch: Branch;
  isSelectionCompleted: boolean;
}

const getInitialBranch = (): Branch => {
  const saved = localStorage.getItem("branch");
  if (saved) {
    const branch = getBranchById(saved);
    if (branch) {
      return branch;
    }
  }
  return getDefaultBranch(); // Default to HCM
};

const initialState: BranchState = {
  currentBranch: getInitialBranch(),
  isSelectionCompleted: localStorage.getItem("selectionCompleted") === "true",
};

const branchSlice = createSlice({
  name: "branch",
  initialState,
  reducers: {
    setBranch: (state, action: PayloadAction<string>) => {
      const branchId = action.payload;
      const branch = getBranchById(branchId);
      if (branch) {
        state.currentBranch = branch;
        localStorage.setItem("branch", branchId);
      }
    },
    setSelectionCompleted: (state, action: PayloadAction<boolean>) => {
      state.isSelectionCompleted = action.payload;
      localStorage.setItem("selectionCompleted", action.payload.toString());
    },
  },
});

export const { setBranch, setSelectionCompleted } = branchSlice.actions;
export { BRANCHES }; // Re-export for convenience
export default branchSlice.reducer;

