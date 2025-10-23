package com.aurora.backend.service;

import com.aurora.backend.dto.request.ServiceBookingCreationRequest;
import com.aurora.backend.dto.request.ServiceBookingUpdateRequest;
import com.aurora.backend.dto.response.ServiceBookingResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ServiceBookingService {
    ServiceBookingResponse createServiceBooking(ServiceBookingCreationRequest request);
    ServiceBookingResponse updateServiceBooking(String id, ServiceBookingUpdateRequest request);
    void deleteServiceBooking(String id);
    ServiceBookingResponse getServiceBookingById(String id);
    Page<ServiceBookingResponse> getAllServiceBookings(Pageable pageable);
    Page<ServiceBookingResponse> getServiceBookingsByBooking(String bookingId, Pageable pageable);
    Page<ServiceBookingResponse> getServiceBookingsByService(String serviceId, Pageable pageable);
    Page<ServiceBookingResponse> getServiceBookingsByCustomer(String customerId, Pageable pageable);
    Page<ServiceBookingResponse> searchServiceBookings(String bookingId, String serviceId, String customerId, String status, Pageable pageable);
}
