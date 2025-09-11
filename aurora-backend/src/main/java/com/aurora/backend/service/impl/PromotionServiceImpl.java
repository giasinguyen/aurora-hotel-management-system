package com.aurora.backend.service.impl;

import com.aurora.backend.dto.request.PromotionCreationRequest;
import com.aurora.backend.dto.request.PromotionUpdateRequest;
import com.aurora.backend.dto.response.PromotionResponse;
import com.aurora.backend.entity.Promotion;
import com.aurora.backend.enums.ErrorCode;
import com.aurora.backend.exception.AppException;
import com.aurora.backend.mapper.PromotionMapper;
import com.aurora.backend.repository.PromotionRepository;
import com.aurora.backend.service.PromotionService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PromotionServiceImpl implements PromotionService {
    
    PromotionRepository promotionRepository;
    PromotionMapper promotionMapper;

    @Override
    public PromotionResponse createPromotion(PromotionCreationRequest request) {
        // Validate date range
        if (request.getStartDate().isAfter(request.getEndDate())) {
            throw new AppException(ErrorCode.PROMOTION_DATE_INVALID);
        }
        
        // Check if promotion code already exists
        if (promotionRepository.existsByCode(request.getCode())) {
            throw new AppException(ErrorCode.PROMOTION_EXISTED);
        }
        
        Promotion promotion = promotionMapper.toPromotion(request);
        Promotion savedPromotion = promotionRepository.save(promotion);
        
        return promotionMapper.toPromotionResponse(savedPromotion);
    }

    @Override
    public PromotionResponse updatePromotion(String id, PromotionUpdateRequest request) {
        Promotion promotion = promotionRepository.findById(id)
            .orElseThrow(() -> new AppException(ErrorCode.PROMOTION_NOT_EXISTED));
        
        // Validate date range if both dates are provided
        if (request.getStartDate() != null && request.getEndDate() != null) {
            if (request.getStartDate().isAfter(request.getEndDate())) {
                throw new AppException(ErrorCode.PROMOTION_DATE_INVALID);
            }
        }
        
        promotionMapper.updatePromotion(promotion, request);
        Promotion updatedPromotion = promotionRepository.save(promotion);
        
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
        Page<Promotion> promotionPage = promotionRepository.findByActive(true, pageable);
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
