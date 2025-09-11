package com.aurora.backend.service.impl;

import com.aurora.backend.dto.request.ServiceBookingCreationRequest;
import com.aurora.backend.dto.request.ServiceBookingUpdateRequest;
import com.aurora.backend.dto.response.ServiceBookingResponse;
import com.aurora.backend.entity.Booking;
import com.aurora.backend.entity.Service;
import com.aurora.backend.entity.ServiceBooking;
import com.aurora.backend.entity.User;
import com.aurora.backend.exception.AppException;
import com.aurora.backend.enums.ErrorCode;
import com.aurora.backend.mapper.ServiceBookingMapper;
import com.aurora.backend.repository.BookingRepository;
import com.aurora.backend.repository.ServiceBookingRepository;
import com.aurora.backend.repository.ServiceRepository;
import com.aurora.backend.repository.UserRepository;
import com.aurora.backend.service.ServiceBookingService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class ServiceBookingServiceImpl implements ServiceBookingService {
    
    ServiceBookingRepository serviceBookingRepository;
    BookingRepository bookingRepository;
    ServiceRepository serviceRepository;
    UserRepository userRepository;
    ServiceBookingMapper serviceBookingMapper;

    @Override
    @Transactional
    public ServiceBookingResponse createServiceBooking(ServiceBookingCreationRequest request) {
        log.info("Creating service booking for booking: {} and service: {}", request.getBookingId(), request.getServiceId());
        
        // Validate booking exists
        Booking booking = bookingRepository.findById(request.getBookingId())
                .orElseThrow(() -> new AppException(ErrorCode.BOOKING_NOT_FOUND));
        
        // Validate service exists
        Service service = serviceRepository.findById(request.getServiceId())
                .orElseThrow(() -> new AppException(ErrorCode.SERVICE_NOT_FOUND));
        
        // Validate customer exists
        User customer = userRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        
        // Check if service is already booked for this booking
        if (serviceBookingRepository.existsByBookingAndService(booking, service)) {
            throw new AppException(ErrorCode.SERVICE_BOOKING_EXISTED);
        }
        
        ServiceBooking serviceBooking = serviceBookingMapper.toServiceBooking(request);
        serviceBooking.setBooking(booking);
        serviceBooking.setService(service);
        serviceBooking.setCustomer(customer);
        
        // Set default status if not provided
        if (request.getStatus() == null || request.getStatus().trim().isEmpty()) {
            serviceBooking.setStatus("PENDING");
        }
        
        ServiceBooking savedServiceBooking = serviceBookingRepository.save(serviceBooking);
        log.info("Service booking created successfully with ID: {}", savedServiceBooking.getId());
        
        return serviceBookingMapper.toServiceBookingResponse(savedServiceBooking);
    }

    @Override
    @Transactional
    public ServiceBookingResponse updateServiceBooking(String id, ServiceBookingUpdateRequest request) {
        log.info("Updating service booking with ID: {}", id);
        
        ServiceBooking serviceBooking = serviceBookingRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.SERVICE_BOOKING_NOT_FOUND));
        
        serviceBookingMapper.updateServiceBooking(serviceBooking, request);
        
        ServiceBooking updatedServiceBooking = serviceBookingRepository.save(serviceBooking);
        log.info("Service booking updated successfully with ID: {}", updatedServiceBooking.getId());
        
        return serviceBookingMapper.toServiceBookingResponse(updatedServiceBooking);
    }

    @Override
    @Transactional
    public void deleteServiceBooking(String id) {
        log.info("Deleting service booking with ID: {}", id);
        
        ServiceBooking serviceBooking = serviceBookingRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.SERVICE_BOOKING_NOT_FOUND));
        
        serviceBookingRepository.delete(serviceBooking);
        log.info("Service booking deleted successfully with ID: {}", id);
    }

    @Override
    @Transactional(readOnly = true)
    public ServiceBookingResponse getServiceBookingById(String id) {
        log.debug("Fetching service booking with ID: {}", id);
        
        ServiceBooking serviceBooking = serviceBookingRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.SERVICE_BOOKING_NOT_FOUND));
        
        return serviceBookingMapper.toServiceBookingResponse(serviceBooking);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ServiceBookingResponse> getAllServiceBookings(Pageable pageable) {
        log.debug("Fetching all service bookings with pagination: {}", pageable);
        
        Page<ServiceBooking> serviceBookings = serviceBookingRepository.findAll(pageable);
        return serviceBookings.map(serviceBookingMapper::toServiceBookingResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ServiceBookingResponse> getServiceBookingsByBooking(String bookingId, Pageable pageable) {
        log.debug("Fetching service bookings for booking ID: {} with pagination: {}", bookingId, pageable);
        
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new AppException(ErrorCode.BOOKING_NOT_FOUND));
        
        Page<ServiceBooking> serviceBookings = serviceBookingRepository.findByBooking(booking, pageable);
        return serviceBookings.map(serviceBookingMapper::toServiceBookingResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ServiceBookingResponse> getServiceBookingsByService(String serviceId, Pageable pageable) {
        log.debug("Fetching service bookings for service ID: {} with pagination: {}", serviceId, pageable);
        
        Service service = serviceRepository.findById(serviceId)
                .orElseThrow(() -> new AppException(ErrorCode.SERVICE_NOT_FOUND));
        
        Page<ServiceBooking> serviceBookings = serviceBookingRepository.findByService(service, pageable);
        return serviceBookings.map(serviceBookingMapper::toServiceBookingResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ServiceBookingResponse> getServiceBookingsByCustomer(String customerId, Pageable pageable) {
        log.debug("Fetching service bookings for customer ID: {} with pagination: {}", customerId, pageable);
        
        User customer = userRepository.findById(customerId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        
        Page<ServiceBooking> serviceBookings = serviceBookingRepository.findByCustomer(customer, pageable);
        return serviceBookings.map(serviceBookingMapper::toServiceBookingResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ServiceBookingResponse> searchServiceBookings(String bookingId, String serviceId, String customerId, String status, Pageable pageable) {
        log.debug("Searching service bookings with filters - Booking: {}, Service: {}, Customer: {}, Status: {}", 
                bookingId, serviceId, customerId, status);
        
        Booking booking = null;
        Service service = null;
        User customer = null;
        
        if (bookingId != null && !bookingId.trim().isEmpty()) {
            booking = bookingRepository.findById(bookingId)
                    .orElseThrow(() -> new AppException(ErrorCode.BOOKING_NOT_FOUND));
        }
        
        if (serviceId != null && !serviceId.trim().isEmpty()) {
            service = serviceRepository.findById(serviceId)
                    .orElseThrow(() -> new AppException(ErrorCode.SERVICE_NOT_FOUND));
        }
        
        if (customerId != null && !customerId.trim().isEmpty()) {
            customer = userRepository.findById(customerId)
                    .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        }
        
        Page<ServiceBooking> serviceBookings = serviceBookingRepository.findByFilters(booking, service, customer, status, pageable);
        return serviceBookings.map(serviceBookingMapper::toServiceBookingResponse);
    }
}
