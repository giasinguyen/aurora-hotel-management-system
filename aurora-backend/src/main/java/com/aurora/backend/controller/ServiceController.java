package com.aurora.backend.controller;

import com.aurora.backend.dto.request.ServiceCreationRequest;
import com.aurora.backend.dto.request.ServiceUpdateRequest;
import com.aurora.backend.dto.response.ApiResponse;
import com.aurora.backend.dto.response.ServiceResponse;
import com.aurora.backend.service.ServiceService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/services")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class ServiceController {
    
    ServiceService serviceService;

    @PostMapping
    public ApiResponse<ServiceResponse> createService(@Valid @RequestBody ServiceCreationRequest request) {
        ServiceResponse response = serviceService.createService(request);
        return ApiResponse.<ServiceResponse>builder()
                .code(HttpStatus.CREATED.value())
                .message("Service created successfully")
                .result(response)
                .build();
    }

    @PutMapping("/{id}")
    public ApiResponse<ServiceResponse> updateService(@PathVariable String id, @Valid @RequestBody ServiceUpdateRequest request) {
        ServiceResponse response = serviceService.updateService(id, request);
        return ApiResponse.<ServiceResponse>builder()
                .code(HttpStatus.OK.value())
                .message("Service updated successfully")
                .result(response)
                .build();
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteService(@PathVariable String id) {
        serviceService.deleteService(id);
        return ApiResponse.<Void>builder()
                .code(HttpStatus.OK.value())
                .message("Service deleted successfully")
                .build();
    }

    @GetMapping("/{id}")
    public ApiResponse<ServiceResponse> getServiceById(@PathVariable String id) {
        ServiceResponse response = serviceService.getServiceById(id);
        return ApiResponse.<ServiceResponse>builder()
                .code(HttpStatus.OK.value())
                .message("Service retrieved successfully")
                .result(response)
                .build();
    }

    @GetMapping
    public ApiResponse<Page<ServiceResponse>> getAllServices(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "name") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {
        Sort.Direction direction = sortDir.equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));
        Page<ServiceResponse> response = serviceService.getAllServices(pageable);
        return ApiResponse.<Page<ServiceResponse>>builder()
                .code(HttpStatus.OK.value())
                .message("Services retrieved successfully")
                .result(response)
                .build();
    }

    @GetMapping("/search")
    public ApiResponse<Page<ServiceResponse>> searchServices(
            @RequestParam(required = false) String hotelId,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String name,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "name") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {
        Sort.Direction direction = sortDir.equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));
        Page<ServiceResponse> response = serviceService.searchServices(hotelId, type, name, pageable);
        return ApiResponse.<Page<ServiceResponse>>builder()
                .code(HttpStatus.OK.value())
                .message("Services searched successfully")
                .result(response)
                .build();
    }
}
