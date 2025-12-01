package com.aurora.backend.service;

import com.aurora.backend.dto.request.RoomCategoryRequest;
import com.aurora.backend.dto.response.RoomCategoryResponse;

import java.util.List;

public interface RoomCategoryService {
    
    /**
     * Lấy tất cả categories của một branch
     */
    List<RoomCategoryResponse> getAllByBranch(String branchId);
    
    /**
     * Lấy category theo ID
     */
    RoomCategoryResponse getById(String id);
    
    /**
     * Lấy category theo ID với danh sách room types
     */
    RoomCategoryResponse getByIdWithRoomTypes(String id);
    
    /**
     * Tạo category mới
     */
    RoomCategoryResponse create(RoomCategoryRequest request);
    
    /**
     * Cập nhật category
     */
    RoomCategoryResponse update(String id, RoomCategoryRequest request);
    
    /**
     * Xóa category (soft delete)
     */
    void delete(String id);
}

