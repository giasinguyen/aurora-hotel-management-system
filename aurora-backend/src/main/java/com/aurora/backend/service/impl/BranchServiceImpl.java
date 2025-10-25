package com.aurora.backend.service.impl;

import com.aurora.backend.dto.request.BranchCreationRequest;
import com.aurora.backend.dto.request.BranchUpdateRequest;
import com.aurora.backend.dto.response.BranchResponse;
import com.aurora.backend.entity.Branch;
import com.aurora.backend.entity.User;
import com.aurora.backend.enums.ErrorCode;
import com.aurora.backend.exception.AppException;
import com.aurora.backend.mapper.BranchMapper;
import com.aurora.backend.repository.BranchRepository;
import com.aurora.backend.repository.UserRepository;
import com.aurora.backend.service.BranchService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
@Transactional(readOnly = true)
public class BranchServiceImpl implements BranchService {
    
    BranchRepository branchRepository;
    UserRepository userRepository;
    BranchMapper branchMapper;

    @Override
    @Transactional
    public BranchResponse createBranch(BranchCreationRequest request) {
        log.info("Creating new branch with code: {}", request.getCode());
        
        if (branchRepository.existsByCode(request.getCode())) {
            throw new AppException(ErrorCode.BRANCH_CODE_EXISTED);
        }
        
        Branch branch = branchMapper.toBranch(request);
        
        if (request.getManagerId() != null) {
            User manager = userRepository.findById(request.getManagerId())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
            
            boolean hasManagerRole = manager.getRoles().stream()
                .anyMatch(role -> "MANAGER".equals(role.getName()));
            
            if (!hasManagerRole) {
                throw new AppException(ErrorCode.USER_NOT_MANAGER);
            }
            
            branch.setManager(manager);
            manager.setAssignedBranch(branch);
        }
        
        Branch savedBranch = branchRepository.save(branch);
        log.info("Branch created successfully with ID: {}", savedBranch.getId());
        
        return branchMapper.toBranchResponse(savedBranch);
    }

    @Override
    @Transactional
    public BranchResponse updateBranch(String id, BranchUpdateRequest request) {
        log.info("Updating branch with ID: {}", id);
        
        Branch branch = branchRepository.findById(id)
            .orElseThrow(() -> new AppException(ErrorCode.BRANCH_NOT_EXISTED));
        
        if (request.getManagerId() != null) {
            if (branch.getManager() != null) {
                branch.getManager().setAssignedBranch(null);
            }
            
            User newManager = userRepository.findById(request.getManagerId())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
            
            boolean hasManagerRole = newManager.getRoles().stream()
                .anyMatch(role -> "MANAGER".equals(role.getName()));
            
            if (!hasManagerRole) {
                throw new AppException(ErrorCode.USER_NOT_MANAGER);
            }
            
            branch.setManager(newManager);
            newManager.setAssignedBranch(branch);
        }
        
        branchMapper.updateBranch(branch, request);
        Branch updatedBranch = branchRepository.save(branch);
        
        log.info("Branch updated successfully: {}", id);
        return branchMapper.toBranchResponse(updatedBranch);
    }

    @Override
    @Transactional
    public void deleteBranch(String id) {
        log.info("Deleting branch with ID: {}", id);
        
        Branch branch = branchRepository.findById(id)
            .orElseThrow(() -> new AppException(ErrorCode.BRANCH_NOT_EXISTED));
        
        if (branch.getRooms() != null && !branch.getRooms().isEmpty()) {
            throw new AppException(ErrorCode.BRANCH_HAS_ROOMS);
        }
        
        if (branch.getManager() != null) {
            branch.getManager().setAssignedBranch(null);
        }
        
        if (branch.getStaff() != null) {
            branch.getStaff().forEach(staff -> staff.setAssignedBranch(null));
        }
        
        branchRepository.delete(branch);
        log.info("Branch deleted successfully: {}", id);
    }

    @Override
    public BranchResponse getBranchById(String id) {
        log.debug("Fetching branch with ID: {}", id);
        
        Branch branch = branchRepository.findById(id)
            .orElseThrow(() -> new AppException(ErrorCode.BRANCH_NOT_EXISTED));
        
        return branchMapper.toBranchResponse(branch);
    }

    @Override
    public BranchResponse getBranchByCode(String code) {
        log.debug("Fetching branch with code: {}", code);
        
        Branch branch = branchRepository.findByCode(code)
            .orElseThrow(() -> new AppException(ErrorCode.BRANCH_NOT_EXISTED));
        
        return branchMapper.toBranchResponse(branch);
    }

    @Override
    public Page<BranchResponse> getAllBranches(Pageable pageable) {
        log.debug("Fetching all branches with pagination: {}", pageable);
        
        return branchRepository.findAll(pageable)
            .map(branchMapper::toBranchResponse);
    }

    @Override
    public Page<BranchResponse> getBranchesByStatus(Branch.BranchStatus status, Pageable pageable) {
        log.debug("Fetching branches by status: {}", status);
        
        return branchRepository.findByStatus(status, pageable)
            .map(branchMapper::toBranchResponse);
    }

    @Override
    public Page<BranchResponse> getBranchesByCity(String city, Pageable pageable) {
        log.debug("Fetching branches by city: {}", city);
        
        return branchRepository.findByCity(city, pageable)
            .map(branchMapper::toBranchResponse);
    }

    @Override
    public Page<BranchResponse> searchBranches(String keyword, Pageable pageable) {
        log.debug("Searching branches with keyword: {}", keyword);
        
        return branchRepository.searchBranches(keyword, pageable)
            .map(branchMapper::toBranchResponse);
    }

    @Override
    @Transactional
    public BranchResponse assignManager(String branchId, String managerId) {
        log.info("Assigning manager {} to branch {}", managerId, branchId);
        
        Branch branch = branchRepository.findById(branchId)
            .orElseThrow(() -> new AppException(ErrorCode.BRANCH_NOT_EXISTED));
        
        User manager = userRepository.findById(managerId)
            .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        
        boolean hasManagerRole = manager.getRoles().stream()
            .anyMatch(role -> "MANAGER".equals(role.getName()));
        
        if (!hasManagerRole) {
            throw new AppException(ErrorCode.USER_NOT_MANAGER);
        }
        
        if (branch.getManager() != null) {
            branch.getManager().setAssignedBranch(null);
        }
        
        branch.setManager(manager);
        manager.setAssignedBranch(branch);
        
        branchRepository.save(branch);
        log.info("Manager assigned successfully");
        
        return branchMapper.toBranchResponse(branch);
    }

    @Override
    @Transactional
    public BranchResponse removeManager(String branchId) {
        log.info("Removing manager from branch {}", branchId);
        
        Branch branch = branchRepository.findById(branchId)
            .orElseThrow(() -> new AppException(ErrorCode.BRANCH_NOT_EXISTED));
        
        if (branch.getManager() != null) {
            branch.getManager().setAssignedBranch(null);
            branch.setManager(null);
            branchRepository.save(branch);
        }
        
        log.info("Manager removed successfully");
        return branchMapper.toBranchResponse(branch);
    }

    @Override
    public BranchResponse getBranchStatistics(String branchId) {
        log.debug("Fetching statistics for branch: {}", branchId);
        
        Branch branch = branchRepository.findById(branchId)
            .orElseThrow(() -> new AppException(ErrorCode.BRANCH_NOT_EXISTED));
        
        return branchMapper.toBranchResponse(branch);
    }
}
