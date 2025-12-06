export interface Branch {
  id: string;
  code: string;
  name: string;
  address: string;
  apiId: string; // ID thực tế trong database
}

export const BRANCHES: Record<string, Branch> = {
  hcm: {
    id: "hcm",
    code: "HCM",
    name: "Hồ Chí Minh",
    address: "12 Nguyễn Văn A, Hạnh Thông, Thành phố Hồ Chí Minh",
    apiId: "branch-hcm-001",
  },
  hno: {
    id: "hno",
    code: "HNO",
    name: "Hà Nội",
    address: "14 Nguyễn Văn C, Cầu Giấy, Hà Nội",
    apiId: "branch-hanoi-001",
  },
  dng: {
    id: "dng",
    code: "DNG",
    name: "Đà Nẵng",
    address: "13 Nguyễn Văn B, An Nhơn, Thành phố Đà Nẵng",
    apiId: "branch-danang-001",
  },
};

// Helper function to get branch by id
export const getBranchById = (id: string): Branch | undefined => {
  return BRANCHES[id];
};

// Helper function to get all branches as array
export const getAllBranches = (): Branch[] => {
  return Object.values(BRANCHES);
};

// Helper function to get default branch (HCM)
export const getDefaultBranch = (): Branch => {
  return BRANCHES.hcm;
};

