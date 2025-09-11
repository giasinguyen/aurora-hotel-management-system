package com.aurora.backend.service.impl;

import com.aurora.backend.dto.request.ServiceCreationRequest;
import com.aurora.backend.dto.request.ServiceUpdateRequest;
import com.aurora.backend.dto.response.ServiceResponse;
import com.aurora.backend.entity.Hotel;
import com.aurora.backend.entity.Service;
import com.aurora.backend.exception.AppException;
import com.aurora.backend.enums.ErrorCode;
import com.aurora.backend.mapper.ServiceMapper;
import com.aurora.backend.repository.HotelRepository;
import com.aurora.backend.repository.ServiceRepository;
import com.aurora.backend.service.ServiceService;
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
public class ServiceServiceImpl implements ServiceService {
    
    ServiceRepository serviceRepository;
    HotelRepository hotelRepository;
    ServiceMapper serviceMapper;

    @Override
    @Transactional
    public ServiceResponse createService(ServiceCreationRequest request) {
        log.info("Creating service: {} for hotel: {}", request.getName(), request.getHotelId());
        
        // Validate hotel exists
        Hotel hotel = hotelRepository.findById(request.getHotelId())
                .orElseThrow(() -> new AppException(ErrorCode.HOTEL_NOT_FOUND));
        
        // Check if service name already exists in this hotel
        if (serviceRepository.existsByHotelAndName(hotel, request.getName())) {
            throw new AppException(ErrorCode.SERVICE_EXISTED);
        }
        
        Service service = serviceMapper.toService(request);
        service.setHotel(hotel);
        
        Service savedService = serviceRepository.save(service);
        log.info("Service created successfully with ID: {}", savedService.getId());
        
        return serviceMapper.toServiceResponse(savedService);
    }

    @Override
    @Transactional
    public ServiceResponse updateService(String id, ServiceUpdateRequest request) {
        log.info("Updating service with ID: {}", id);
        
        Service service = serviceRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.SERVICE_NOT_FOUND));
        
        // If name is being updated, check uniqueness within hotel
        if (request.getName() != null && !request.getName().equals(service.getName())) {
            if (serviceRepository.existsByHotelAndName(service.getHotel(), request.getName())) {
                throw new AppException(ErrorCode.SERVICE_EXISTED);
            }
        }
        
        serviceMapper.updateService(service, request);
        
        Service updatedService = serviceRepository.save(service);
        log.info("Service updated successfully with ID: {}", updatedService.getId());
        
        return serviceMapper.toServiceResponse(updatedService);
    }

    @Override
    @Transactional
    public void deleteService(String id) {
        log.info("Deleting service with ID: {}", id);
        
        Service service = serviceRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.SERVICE_NOT_FOUND));
        
        // Check if service can be deleted (no active bookings)
        // This would require ServiceBooking entity check if implemented
        
        serviceRepository.delete(service);
        log.info("Service deleted successfully with ID: {}", id);
    }

    @Override
    @Transactional(readOnly = true)
    public ServiceResponse getServiceById(String id) {
        log.debug("Fetching service with ID: {}", id);
        
        Service service = serviceRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.SERVICE_NOT_FOUND));
        
        return serviceMapper.toServiceResponse(service);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ServiceResponse> getAllServices(Pageable pageable) {
        log.debug("Fetching all services with pagination: {}", pageable);
        
        Page<Service> services = serviceRepository.findAll(pageable);
        return services.map(serviceMapper::toServiceResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ServiceResponse> getServicesByHotel(String hotelId, Pageable pageable) {
        log.debug("Fetching services for hotel ID: {} with pagination: {}", hotelId, pageable);
        
        Hotel hotel = hotelRepository.findById(hotelId)
                .orElseThrow(() -> new AppException(ErrorCode.HOTEL_NOT_FOUND));
        
        Page<Service> services = serviceRepository.findByHotel(hotel, pageable);
        return services.map(serviceMapper::toServiceResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ServiceResponse> getServicesByType(String type, Pageable pageable) {
        log.debug("Fetching services with type: {} with pagination: {}", type, pageable);
        
        Page<Service> services = serviceRepository.findByType(type, pageable);
        return services.map(serviceMapper::toServiceResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ServiceResponse> searchServices(String hotelId, String type, String name, Pageable pageable) {
        log.debug("Searching services with filters - Hotel: {}, Type: {}, Name: {}", hotelId, type, name);
        
        Hotel hotel = null;
        if (hotelId != null && !hotelId.trim().isEmpty()) {
            hotel = hotelRepository.findById(hotelId)
                    .orElseThrow(() -> new AppException(ErrorCode.HOTEL_NOT_FOUND));
        }
        
        Page<Service> services = serviceRepository.findByFilters(hotel, type, name, pageable);
        return services.map(serviceMapper::toServiceResponse);
    }
}
