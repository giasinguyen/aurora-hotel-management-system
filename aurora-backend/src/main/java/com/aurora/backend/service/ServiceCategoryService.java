package com.aurora.backend.service;

import com.aurora.backend.dto.request.ServiceCategoryRequest;
import com.aurora.backend.dto.response.ServiceCategoryResponse;

import java.util.List;

public interface ServiceCategoryService {
    
    /**
     * Lấy tất cả categories của một branch
     */
    List<ServiceCategoryResponse> getAllByBranch(String branchId);
    
    /**
     * Lấy tất cả categories active
     */
    List<ServiceCategoryResponse> getAllActive();
    
    /**
     * Lấy category theo ID
     */
    ServiceCategoryResponse getById(String id);
    
    /**
     * Lấy category theo ID với danh sách services
     */
    ServiceCategoryResponse getByIdWithServices(String id);
    
    /**
     * Tạo category mới
     */
    ServiceCategoryResponse create(ServiceCategoryRequest request);
    
    /**
     * Cập nhật category
     */
    ServiceCategoryResponse update(String id, ServiceCategoryRequest request);
    
    /**
     * Xóa category (soft delete)
     */
    void delete(String id);
}

