package com.aurora.backend.service.impl;

import com.aurora.backend.dto.request.RoomCategoryRequest;
import com.aurora.backend.dto.response.RoomCategoryResponse;
import com.aurora.backend.entity.Branch;
import com.aurora.backend.entity.RoomCategory;
import com.aurora.backend.enums.ErrorCode;
import com.aurora.backend.exception.AppException;
import com.aurora.backend.mapper.RoomCategoryMapper;
import com.aurora.backend.repository.BranchRepository;
import com.aurora.backend.repository.RoomCategoryRepository;
import com.aurora.backend.service.RoomCategoryService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
@Transactional(readOnly = true)
public class RoomCategoryServiceImpl implements RoomCategoryService {

    RoomCategoryRepository roomCategoryRepository;
    BranchRepository branchRepository;
    RoomCategoryMapper roomCategoryMapper;

    @Override
    public List<RoomCategoryResponse> getAllByBranch(String branchId) {
        log.info("Fetching all categories for branch: {}", branchId);
        
        // Verify branch exists
        if (!branchRepository.existsById(branchId)) {
            throw new AppException(ErrorCode.BRANCH_NOT_EXISTED);
        }
        
        List<RoomCategory> categories = roomCategoryRepository.findByBranchIdAndActiveTrue(branchId);
        return roomCategoryMapper.toResponseList(categories);
    }

    @Override
    public RoomCategoryResponse getById(String id) {
        log.info("Fetching category by ID: {}", id);
        
        RoomCategory category = roomCategoryRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.ROOM_TYPE_NOT_EXISTED)); // Reuse error code
        
        return roomCategoryMapper.toResponse(category);
    }

    @Override
    public RoomCategoryResponse getByIdWithRoomTypes(String id) {
        log.info("Fetching category with room types by ID: {}", id);
        
        RoomCategory category = roomCategoryRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.ROOM_TYPE_NOT_EXISTED));
        
        return roomCategoryMapper.toResponseWithRoomTypes(category);
    }

    @Override
    @Transactional
    public RoomCategoryResponse create(RoomCategoryRequest request) {
        log.info("Creating room category: {} for branch: {}", request.getName(), request.getBranchId());
        
        // Verify branch exists
        Branch branch = branchRepository.findById(request.getBranchId())
                .orElseThrow(() -> new AppException(ErrorCode.BRANCH_NOT_EXISTED));
        
        // Check if code already exists in this branch
        if (roomCategoryRepository.existsByCodeAndBranchId(request.getCode(), request.getBranchId())) {
            throw new AppException(ErrorCode.ROOM_TYPE_EXISTED); // Reuse error code
        }
        
        RoomCategory category = roomCategoryMapper.toEntity(request);
        category.setBranch(branch);
        
        if (category.getActive() == null) {
            category.setActive(true);
        }
        
        RoomCategory savedCategory = roomCategoryRepository.save(category);
        log.info("Room category created successfully with ID: {}", savedCategory.getId());
        
        return roomCategoryMapper.toResponse(savedCategory);
    }

    @Override
    @Transactional
    public RoomCategoryResponse update(String id, RoomCategoryRequest request) {
        log.info("Updating room category: {}", id);
        
        RoomCategory category = roomCategoryRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.ROOM_TYPE_NOT_EXISTED));
        
        // If code is being changed, check for duplicates
        if (request.getCode() != null && !request.getCode().equals(category.getCode())) {
            if (roomCategoryRepository.existsByCodeAndBranchId(request.getCode(), category.getBranch().getId())) {
                throw new AppException(ErrorCode.ROOM_TYPE_EXISTED);
            }
        }
        
        roomCategoryMapper.updateEntity(category, request);
        
        RoomCategory updatedCategory = roomCategoryRepository.save(category);
        log.info("Room category updated successfully: {}", id);
        
        return roomCategoryMapper.toResponse(updatedCategory);
    }

    @Override
    @Transactional
    public void delete(String id) {
        log.info("Deleting room category: {}", id);
        
        RoomCategory category = roomCategoryRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.ROOM_TYPE_NOT_EXISTED));
        
        category.setDeleted(true);
        roomCategoryRepository.save(category);
        
        log.info("Room category soft deleted: {}", id);
    }
}

