package com.aurora.backend.service;

import com.aurora.backend.dto.request.ServiceCreationRequest;
import com.aurora.backend.dto.request.ServiceUpdateRequest;
import com.aurora.backend.dto.response.ServiceResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ServiceService {
    ServiceResponse createService(ServiceCreationRequest request);
    ServiceResponse updateService(String id, ServiceUpdateRequest request);
    void deleteService(String id);
    ServiceResponse getServiceById(String id);
    Page<ServiceResponse> getAllServices(Pageable pageable);
    Page<ServiceResponse> getServicesByBranch(String branchId, Pageable pageable);
    Page<ServiceResponse> getServicesByType(String categoryId, Pageable pageable);
    Page<ServiceResponse> searchServices(String branchId, String categoryId, String name, Pageable pageable);
}
