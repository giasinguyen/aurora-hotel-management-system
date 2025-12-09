package com.aurora.backend.service;

import com.aurora.backend.dto.request.BranchCreationRequest;
import com.aurora.backend.dto.request.BranchUpdateRequest;
import com.aurora.backend.dto.response.BranchResponse;
import com.aurora.backend.entity.Branch;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface BranchService {
    BranchResponse createBranch(BranchCreationRequest request);
    BranchResponse updateBranch(String id, BranchUpdateRequest request);
    void deleteBranch(String id);
    BranchResponse getBranchById(String id);
    BranchResponse getBranchByCode(String code);
    Page<BranchResponse> getAllBranches(Pageable pageable);
    Page<BranchResponse> getBranchesByStatus(Branch.BranchStatus status, Pageable pageable);
    Page<BranchResponse> getBranchesByCity(String city, Pageable pageable);
    Page<BranchResponse> searchBranches(String keyword, Pageable pageable);
    BranchResponse assignManager(String branchId, String managerId);
    BranchResponse removeManager(String branchId);
    BranchResponse assignStaffToBranch(String branchId, String staffId);
    BranchResponse removeStaffFromBranch(String branchId, String staffId);
    BranchResponse getBranchStatistics(String branchId);
}
