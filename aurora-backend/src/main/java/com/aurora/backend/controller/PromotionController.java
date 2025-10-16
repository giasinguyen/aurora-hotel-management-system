package com.aurora.backend.controller;

import com.aurora.backend.config.annotation.RequirePermission;
import com.aurora.backend.constant.PermissionConstants;
import com.aurora.backend.dto.request.PromotionCreationRequest;
import com.aurora.backend.dto.request.PromotionUpdateRequest;
import com.aurora.backend.dto.response.ApiResponse;
import com.aurora.backend.dto.response.PromotionResponse;
import com.aurora.backend.service.PromotionService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/promotions")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PromotionController {
    
    PromotionService promotionService;

    // MANAGER - Tạo promotion
    @PostMapping
    @RequirePermission(PermissionConstants.Manager.PROMOTION_CREATE)
    public ApiResponse<PromotionResponse> createPromotion(@Valid @RequestBody PromotionCreationRequest request) {
        PromotionResponse result = promotionService.createPromotion(request);
        return ApiResponse.<PromotionResponse>builder()
            .code(1000)
            .message("Promotion created successfully")
            .result(result)
            .build();
    }

    @GetMapping
    public ApiResponse<Page<PromotionResponse>> getAllPromotions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {
        
        Sort sort = sortDir.equalsIgnoreCase("desc") ? 
            Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<PromotionResponse> result = promotionService.getAllPromotions(pageable);
        return ApiResponse.<Page<PromotionResponse>>builder()
            .code(1000)
            .message("Promotions retrieved successfully")
            .result(result)
            .build();
    }

    @GetMapping("/active")
    public ApiResponse<Page<PromotionResponse>> getActivePromotions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {
        
        Sort sort = sortDir.equalsIgnoreCase("desc") ? 
            Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<PromotionResponse> result = promotionService.getActivePromotions(pageable);
        return ApiResponse.<Page<PromotionResponse>>builder()
            .code(1000)
            .message("Active promotions retrieved successfully")
            .result(result)
            .build();
    }

    @GetMapping("/search")
    public ApiResponse<Page<PromotionResponse>> searchPromotions(
            @RequestParam(required = false) String code,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) Boolean active,
            @RequestParam(required = false) LocalDate startDate,
            @RequestParam(required = false) LocalDate endDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {
        
        Sort sort = sortDir.equalsIgnoreCase("desc") ? 
            Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<PromotionResponse> result = promotionService.searchPromotions(
            code, name, active, startDate, endDate, pageable);
        return ApiResponse.<Page<PromotionResponse>>builder()
            .code(1000)
            .message("Promotions search completed successfully")
            .result(result)
            .build();
    }

    @GetMapping("/{id}")
    public ApiResponse<PromotionResponse> getPromotionById(@PathVariable String id) {
        PromotionResponse result = promotionService.getPromotionById(id);
        return ApiResponse.<PromotionResponse>builder()
            .code(1000)
            .message("Promotion retrieved successfully")
            .result(result)
            .build();
    }

    @GetMapping("/code/{code}")
    public ApiResponse<PromotionResponse> getPromotionByCode(@PathVariable String code) {
        PromotionResponse result = promotionService.getPromotionByCode(code);
        return ApiResponse.<PromotionResponse>builder()
            .code(1000)
            .message("Promotion retrieved successfully")
            .result(result)
            .build();
    }

    // MANAGER - Update promotion
    @PutMapping("/{id}")
    @RequirePermission(PermissionConstants.Manager.PROMOTION_UPDATE)
    public ApiResponse<PromotionResponse> updatePromotion(
            @PathVariable String id,
            @Valid @RequestBody PromotionUpdateRequest request) {
        
        PromotionResponse result = promotionService.updatePromotion(id, request);
        return ApiResponse.<PromotionResponse>builder()
            .code(1000)
            .message("Promotion updated successfully")
            .result(result)
            .build();
    }

    // MANAGER - Delete promotion
    @DeleteMapping("/{id}")
    @RequirePermission(PermissionConstants.Manager.PROMOTION_DELETE)
    public ApiResponse<Void> deletePromotion(@PathVariable String id) {
        promotionService.deletePromotion(id);
        return ApiResponse.<Void>builder()
            .code(1000)
            .message("Promotion deleted successfully")
            .build();
    }
}
