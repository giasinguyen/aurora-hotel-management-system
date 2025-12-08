package com.aurora.backend.service.impl;

import com.aurora.backend.dto.request.PromotionCreationRequest;
import com.aurora.backend.dto.request.PromotionUpdateRequest;
import com.aurora.backend.dto.response.PromotionResponse;
import com.aurora.backend.entity.Branch;
import com.aurora.backend.entity.Promotion;
import com.aurora.backend.entity.RoomType;
import com.aurora.backend.enums.ErrorCode;
import com.aurora.backend.exception.AppException;
import com.aurora.backend.mapper.PromotionMapper;
import com.aurora.backend.repository.BranchRepository;
import com.aurora.backend.repository.PromotionRepository;
import com.aurora.backend.repository.RoomTypeRepository;
import com.aurora.backend.service.PromotionService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Slf4j
@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Transactional(readOnly = true)
public class PromotionServiceImpl implements PromotionService {
    
    PromotionRepository promotionRepository;
    PromotionMapper promotionMapper;
    BranchRepository branchRepository;
    RoomTypeRepository roomTypeRepository;

    @Override
    @Transactional
    public PromotionResponse createPromotion(PromotionCreationRequest request) {
        log.info("Creating promotion with code: {}", request.getCode());
        
        // Validate date range
        if (request.getStartDate().isAfter(request.getEndDate())) {
            throw new AppException(ErrorCode.PROMOTION_DATE_INVALID);
        }
        
        // Check if promotion code already exists
        if (promotionRepository.existsByCode(request.getCode())) {
            throw new AppException(ErrorCode.PROMOTION_EXISTED);
        }
        
        Promotion promotion = promotionMapper.toPromotion(request);
        
        // Set branch if provided
        if (request.getBranchId() != null && !request.getBranchId().trim().isEmpty()) {
            Branch branch = branchRepository.findById(request.getBranchId())
                    .orElseThrow(() -> new AppException(ErrorCode.BRANCH_NOT_EXISTED));
            promotion.setBranch(branch);
        }
        
        // Set room types if provided
        if (request.getApplicableRoomTypeIds() != null && !request.getApplicableRoomTypeIds().isEmpty()) {
            Set<RoomType> roomTypes = request.getApplicableRoomTypeIds().stream()
                    .map(roomTypeId -> roomTypeRepository.findById(roomTypeId)
                            .orElseThrow(() -> new AppException(ErrorCode.ROOM_TYPE_NOT_FOUND)))
                    .collect(Collectors.toSet());
            promotion.setApplicableRoomTypes(roomTypes);
        }
        
        // Set defaults
        if (promotion.getActive() == null) {
            promotion.setActive(true);
        }
        if (promotion.getDiscountType() == null) {
            promotion.setDiscountType(Promotion.DiscountType.FIXED_AMOUNT);
        }
        if (promotion.getStackable() == null) {
            promotion.setStackable(false);
        }
        if (promotion.getExclusiveWithOthers() == null) {
            promotion.setExclusiveWithOthers(false);
        }
        if (promotion.getPriority() == null) {
            promotion.setPriority(0);
        }
        if (promotion.getUsedCount() == null) {
            promotion.setUsedCount(0);
        }
        
        Promotion savedPromotion = promotionRepository.save(promotion);
        log.info("Promotion created successfully with ID: {}", savedPromotion.getId());
        
        return promotionMapper.toPromotionResponse(savedPromotion);
    }

    @Override
    @Transactional
    public PromotionResponse updatePromotion(String id, PromotionUpdateRequest request) {
        log.info("Updating promotion with ID: {}", id);
        
        Promotion promotion = promotionRepository.findById(id)
            .orElseThrow(() -> new AppException(ErrorCode.PROMOTION_NOT_EXISTED));
        
        // Validate date range if both dates are provided
        if (request.getStartDate() != null && request.getEndDate() != null) {
            if (request.getStartDate().isAfter(request.getEndDate())) {
                throw new AppException(ErrorCode.PROMOTION_DATE_INVALID);
            }
        }
        
        // Update branch if provided
        if (request.getBranchId() != null) {
            if (request.getBranchId().trim().isEmpty()) {
                promotion.setBranch(null); // Set to null for all branches
            } else {
                Branch branch = branchRepository.findById(request.getBranchId())
                        .orElseThrow(() -> new AppException(ErrorCode.BRANCH_NOT_EXISTED));
                promotion.setBranch(branch);
            }
        }
        
        // Update room types if provided
        if (request.getApplicableRoomTypeIds() != null) {
            if (request.getApplicableRoomTypeIds().isEmpty()) {
                promotion.setApplicableRoomTypes(new HashSet<>()); // Empty = all room types
            } else {
                Set<RoomType> roomTypes = request.getApplicableRoomTypeIds().stream()
                        .map(roomTypeId -> roomTypeRepository.findById(roomTypeId)
                                .orElseThrow(() -> new AppException(ErrorCode.ROOM_TYPE_NOT_FOUND)))
                        .collect(Collectors.toSet());
                promotion.setApplicableRoomTypes(roomTypes);
            }
        }
        
        promotionMapper.updatePromotion(promotion, request);
        Promotion updatedPromotion = promotionRepository.save(promotion);
        log.info("Promotion updated successfully with ID: {}", updatedPromotion.getId());
        
        return promotionMapper.toPromotionResponse(updatedPromotion);
    }

    @Override
    public void deletePromotion(String id) {
        if (!promotionRepository.existsById(id)) {
            throw new AppException(ErrorCode.PROMOTION_NOT_EXISTED);
        }
        
        promotionRepository.deleteById(id);
    }

    @Override
    public PromotionResponse getPromotionById(String id) {
        Promotion promotion = promotionRepository.findById(id)
            .orElseThrow(() -> new AppException(ErrorCode.PROMOTION_NOT_EXISTED));
        
        return promotionMapper.toPromotionResponse(promotion);
    }

    @Override
    public PromotionResponse getPromotionByCode(String code) {
        Promotion promotion = promotionRepository.findByCode(code)
            .orElseThrow(() -> new AppException(ErrorCode.PROMOTION_NOT_EXISTED));
        
        return promotionMapper.toPromotionResponse(promotion);
    }

    @Override
    public Page<PromotionResponse> getAllPromotions(Pageable pageable) {
        Page<Promotion> promotionPage = promotionRepository.findAll(pageable);
        return promotionPage.map(promotionMapper::toPromotionResponse);
    }

    @Override
    public Page<PromotionResponse> getActivePromotions(Pageable pageable) {
        // Filter by active status AND valid date range (not expired)
        LocalDate today = LocalDate.now();
        Page<Promotion> promotionPage = promotionRepository.findActiveAndValidPromotions(today, pageable);
        return promotionPage.map(promotionMapper::toPromotionResponse);
    }

    @Override
    public Page<PromotionResponse> searchPromotions(String code, String name, Boolean active,
                                                   LocalDate startDate, LocalDate endDate,
                                                   Pageable pageable) {
        Page<Promotion> promotionPage = promotionRepository.findByFilters(
            code, name, active, startDate, endDate, pageable);
        return promotionPage.map(promotionMapper::toPromotionResponse);
    }
}
