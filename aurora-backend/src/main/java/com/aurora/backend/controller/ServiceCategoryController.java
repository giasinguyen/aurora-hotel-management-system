package com.aurora.backend.controller;

import com.aurora.backend.config.annotation.RequirePermission;
import com.aurora.backend.constant.PermissionConstants;
import com.aurora.backend.dto.request.ServiceCategoryRequest;
import com.aurora.backend.dto.response.ApiResponse;
import com.aurora.backend.dto.response.ServiceCategoryResponse;
import com.aurora.backend.service.ServiceCategoryService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/service-categories")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class ServiceCategoryController {

    ServiceCategoryService serviceCategoryService;

    /**
     * Lấy tất cả categories của một branch
     * GET /api/v1/service-categories/branch/{branchId}
     */
    @GetMapping("/branch/{branchId}")
    public ApiResponse<List<ServiceCategoryResponse>> getAllByBranch(@PathVariable String branchId) {
        log.info("REST request to get all service categories for branch: {}", branchId);
        return ApiResponse.<List<ServiceCategoryResponse>>builder()
                .code(HttpStatus.OK.value())
                .result(serviceCategoryService.getAllByBranch(branchId))
                .build();
    }

    /**
     * Lấy tất cả categories active
     * GET /api/v1/service-categories/active
     */
    @GetMapping("/active")
    public ApiResponse<List<ServiceCategoryResponse>> getAllActive() {
        log.info("REST request to get all active service categories");
        return ApiResponse.<List<ServiceCategoryResponse>>builder()
                .code(HttpStatus.OK.value())
                .result(serviceCategoryService.getAllActive())
                .build();
    }

    /**
     * Lấy category theo ID
     * GET /api/v1/service-categories/{id}
     */
    @GetMapping("/{id}")
    public ApiResponse<ServiceCategoryResponse> getById(@PathVariable String id) {
        log.info("REST request to get service category: {}", id);
        return ApiResponse.<ServiceCategoryResponse>builder()
                .code(HttpStatus.OK.value())
                .result(serviceCategoryService.getById(id))
                .build();
    }

    /**
     * Lấy category theo ID kèm services
     * GET /api/v1/service-categories/{id}/with-services
     */
    @GetMapping("/{id}/with-services")
    public ApiResponse<ServiceCategoryResponse> getByIdWithServices(@PathVariable String id) {
        log.info("REST request to get service category with services: {}", id);
        return ApiResponse.<ServiceCategoryResponse>builder()
                .code(HttpStatus.OK.value())
                .result(serviceCategoryService.getByIdWithServices(id))
                .build();
    }

    /**
     * Tạo category mới
     * POST /api/v1/service-categories
     */
    @PostMapping
    @RequirePermission(PermissionConstants.Staff.SERVICE_MANAGE)
    public ApiResponse<ServiceCategoryResponse> create(@Valid @RequestBody ServiceCategoryRequest request) {
        log.info("REST request to create service category: {}", request.getName());
        return ApiResponse.<ServiceCategoryResponse>builder()
                .code(HttpStatus.CREATED.value())
                .message("Service category created successfully")
                .result(serviceCategoryService.create(request))
                .build();
    }

    /**
     * Cập nhật category
     * PUT /api/v1/service-categories/{id}
     */
    @PutMapping("/{id}")
    @RequirePermission(PermissionConstants.Staff.SERVICE_MANAGE)
    public ApiResponse<ServiceCategoryResponse> update(
            @PathVariable String id,
            @Valid @RequestBody ServiceCategoryRequest request) {
        log.info("REST request to update service category: {}", id);
        return ApiResponse.<ServiceCategoryResponse>builder()
                .code(HttpStatus.OK.value())
                .message("Service category updated successfully")
                .result(serviceCategoryService.update(id, request))
                .build();
    }

    /**
     * Xóa category (soft delete)
     * DELETE /api/v1/service-categories/{id}
     */
    @DeleteMapping("/{id}")
    @RequirePermission(PermissionConstants.Staff.SERVICE_MANAGE)
    public ApiResponse<Void> delete(@PathVariable String id) {
        log.info("REST request to delete service category: {}", id);
        serviceCategoryService.delete(id);
        return ApiResponse.<Void>builder()
                .code(HttpStatus.NO_CONTENT.value())
                .message("Service category deleted successfully")
                .build();
    }
}

