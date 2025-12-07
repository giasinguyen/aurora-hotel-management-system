package com.aurora.backend.service.impl;

import com.aurora.backend.dto.request.ServiceCategoryRequest;
import com.aurora.backend.dto.response.ServiceCategoryResponse;
import com.aurora.backend.entity.Branch;
import com.aurora.backend.entity.ServiceCategory;
import com.aurora.backend.enums.ErrorCode;
import com.aurora.backend.exception.AppException;
import com.aurora.backend.mapper.ServiceCategoryMapper;
import com.aurora.backend.repository.BranchRepository;
import com.aurora.backend.repository.ServiceCategoryRepository;
import com.aurora.backend.service.ServiceCategoryService;
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
public class ServiceCategoryServiceImpl implements ServiceCategoryService {

    ServiceCategoryRepository serviceCategoryRepository;
    BranchRepository branchRepository;
    ServiceCategoryMapper serviceCategoryMapper;

    @Override
    public List<ServiceCategoryResponse> getAllByBranch(String branchId) {
        log.info("Fetching all service categories for branch: {}", branchId);
        
        // Verify branch exists
        if (!branchRepository.existsById(branchId)) {
            throw new AppException(ErrorCode.BRANCH_NOT_EXISTED);
        }
        
        List<ServiceCategory> categories = serviceCategoryRepository.findByBranchIdAndActiveTrue(branchId);
        return serviceCategoryMapper.toResponseList(categories);
    }

    @Override
    public List<ServiceCategoryResponse> getAllActive() {
        log.info("Fetching all active service categories");
        
        List<ServiceCategory> categories = serviceCategoryRepository.findAllActive();
        return serviceCategoryMapper.toResponseList(categories);
    }

    @Override
    public ServiceCategoryResponse getById(String id) {
        log.info("Fetching service category by ID: {}", id);
        
        ServiceCategory category = serviceCategoryRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.SERVICE_NOT_FOUND));
        
        return serviceCategoryMapper.toResponse(category);
    }

    @Override
    public ServiceCategoryResponse getByIdWithServices(String id) {
        log.info("Fetching service category with services by ID: {}", id);
        
        ServiceCategory category = serviceCategoryRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.SERVICE_NOT_FOUND));
        
        return serviceCategoryMapper.toResponseWithServices(category);
    }

    @Override
    @Transactional
    public ServiceCategoryResponse create(ServiceCategoryRequest request) {
        log.info("Creating service category: {} for branch: {}", request.getName(), request.getBranchId());
        
        // Verify branch exists
        Branch branch = branchRepository.findById(request.getBranchId())
                .orElseThrow(() -> new AppException(ErrorCode.BRANCH_NOT_EXISTED));
        
        // Check if code already exists in this branch
        if (serviceCategoryRepository.existsByCodeAndBranchId(request.getCode(), request.getBranchId())) {
            throw new AppException(ErrorCode.SERVICE_EXISTED);
        }
        
        ServiceCategory category = serviceCategoryMapper.toEntity(request);
        category.setBranch(branch);
        
        if (category.getActive() == null) {
            category.setActive(true);
        }
        
        ServiceCategory savedCategory = serviceCategoryRepository.save(category);
        log.info("Service category created successfully with ID: {}", savedCategory.getId());
        
        return serviceCategoryMapper.toResponse(savedCategory);
    }

    @Override
    @Transactional
    public ServiceCategoryResponse update(String id, ServiceCategoryRequest request) {
        log.info("Updating service category: {}", id);
        
        ServiceCategory category = serviceCategoryRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.SERVICE_NOT_FOUND));
        
        // If code is being changed, check for duplicates
        if (request.getCode() != null && !request.getCode().equals(category.getCode())) {
            if (serviceCategoryRepository.existsByCodeAndBranchId(request.getCode(), category.getBranch().getId())) {
                throw new AppException(ErrorCode.SERVICE_EXISTED);
            }
        }
        
        serviceCategoryMapper.updateEntity(category, request);
        
        ServiceCategory updatedCategory = serviceCategoryRepository.save(category);
        log.info("Service category updated successfully: {}", id);
        
        return serviceCategoryMapper.toResponse(updatedCategory);
    }

    @Override
    @Transactional
    public void delete(String id) {
        log.info("Deleting service category: {}", id);
        
        ServiceCategory category = serviceCategoryRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.SERVICE_NOT_FOUND));
        
        category.setDeleted(true);
        serviceCategoryRepository.save(category);
        
        log.info("Service category soft deleted: {}", id);
    }
}

