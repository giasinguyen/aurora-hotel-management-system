package com.aurora.backend.service;

import com.aurora.backend.dto.request.PromotionCreationRequest;
import com.aurora.backend.dto.request.PromotionUpdateRequest;
import com.aurora.backend.dto.response.PromotionResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;

public interface PromotionService {
    PromotionResponse createPromotion(PromotionCreationRequest request);
    PromotionResponse updatePromotion(String id, PromotionUpdateRequest request);
    void deletePromotion(String id);
    PromotionResponse getPromotionById(String id);
    PromotionResponse getPromotionByCode(String code);
    Page<PromotionResponse> getAllPromotions(Pageable pageable);
    Page<PromotionResponse> getActivePromotions(Pageable pageable);
    Page<PromotionResponse> searchPromotions(String code, String name, Boolean active, 
                                           LocalDate startDate, LocalDate endDate, Pageable pageable);
}
