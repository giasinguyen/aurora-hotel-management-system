package com.aurora.backend.controller;

import com.aurora.backend.dto.request.RoomCategoryRequest;
import com.aurora.backend.dto.response.ApiResponse;
import com.aurora.backend.dto.response.RoomCategoryResponse;
import com.aurora.backend.service.RoomCategoryService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/room-categories")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class RoomCategoryController {

    RoomCategoryService roomCategoryService;

    /**
     * Lấy tất cả categories của một branch
     * GET /api/v1/room-categories/branch/{branchId}
     */
    @GetMapping("/branch/{branchId}")
    public ApiResponse<List<RoomCategoryResponse>> getAllByBranch(@PathVariable String branchId) {
        log.info("REST request to get all room categories for branch: {}", branchId);
        return ApiResponse.<List<RoomCategoryResponse>>builder()
                .code(HttpStatus.OK.value())
                .result(roomCategoryService.getAllByBranch(branchId))
                .build();
    }

    /**
     * Lấy category theo ID
     * GET /api/v1/room-categories/{id}
     */
    @GetMapping("/{id}")
    public ApiResponse<RoomCategoryResponse> getById(@PathVariable String id) {
        log.info("REST request to get room category: {}", id);
        return ApiResponse.<RoomCategoryResponse>builder()
                .code(HttpStatus.OK.value())
                .result(roomCategoryService.getById(id))
                .build();
    }

    /**
     * Lấy category theo ID kèm room types
     * GET /api/v1/room-categories/{id}/with-room-types
     */
    @GetMapping("/{id}/with-room-types")
    public ApiResponse<RoomCategoryResponse> getByIdWithRoomTypes(@PathVariable String id) {
        log.info("REST request to get room category with room types: {}", id);
        return ApiResponse.<RoomCategoryResponse>builder()
                .code(HttpStatus.OK.value())
                .result(roomCategoryService.getByIdWithRoomTypes(id))
                .build();
    }

    /**
     * Tạo category mới
     * POST /api/v1/room-categories
     */
    @PostMapping
    public ApiResponse<RoomCategoryResponse> create(@Valid @RequestBody RoomCategoryRequest request) {
        log.info("REST request to create room category: {}", request.getName());
        return ApiResponse.<RoomCategoryResponse>builder()
                .code(HttpStatus.CREATED.value())
                .result(roomCategoryService.create(request))
                .build();
    }

    /**
     * Cập nhật category
     * PUT /api/v1/room-categories/{id}
     */
    @PutMapping("/{id}")
    public ApiResponse<RoomCategoryResponse> update(
            @PathVariable String id,
            @Valid @RequestBody RoomCategoryRequest request) {
        log.info("REST request to update room category: {}", id);
        return ApiResponse.<RoomCategoryResponse>builder()
                .code(HttpStatus.OK.value())
                .result(roomCategoryService.update(id, request))
                .build();
    }

    /**
     * Xóa category (soft delete)
     * DELETE /api/v1/room-categories/{id}
     */
    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable String id) {
        log.info("REST request to delete room category: {}", id);
        roomCategoryService.delete(id);
        return ApiResponse.<Void>builder()
                .code(HttpStatus.NO_CONTENT.value())
                .message("Room category deleted successfully")
                .build();
    }
}

